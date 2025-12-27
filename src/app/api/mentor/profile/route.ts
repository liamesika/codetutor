/**
 * Cognitive Profile API
 * GET /api/mentor/profile - Get user's cognitive metrics
 * PATCH /api/mentor/profile - Force recalculate profile
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  getOrCreateProfile,
  recalculateCognitiveProfile,
} from "@/lib/mentor/cognitive-engine"
import { checkProAccess } from "@/lib/entitlement"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Check PRO access
    const hasProAccess = await checkProAccess(userId)
    if (!hasProAccess) {
      return NextResponse.json(
        { error: "PRO subscription required" },
        { status: 403 }
      )
    }

    // Get cognitive profile
    const profile = await getOrCreateProfile(userId)

    // Get additional context
    const [userProgress, recentMistakes, topTopics] = await Promise.all([
      db.userProgress.findUnique({ where: { userId } }),
      db.mistakeLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { question: { select: { title: true, topicId: true } } },
      }),
      db.userTopicStats.findMany({
        where: { userId },
        orderBy: { passCount: "desc" },
        take: 5,
        include: { topic: { select: { title: true } } },
      }),
    ])

    // Parse JSON fields
    const topicWeaknessMap = profile.topicWeaknessMap as Record<string, number>
    const topicStrengthMap = profile.topicStrengthMap as Record<string, number>
    const mistakeTypeFrequency = profile.mistakeTypeFrequency as Record<string, number>
    const avgSolveTimeByDifficulty = profile.avgSolveTimeByDifficulty as Record<string, number>

    // Get topic names for weakness/strength maps
    const topicIds = [...Object.keys(topicWeaknessMap), ...Object.keys(topicStrengthMap)]
    const topics = await db.topic.findMany({
      where: { id: { in: topicIds } },
      select: { id: true, title: true },
    })
    const topicNameMap = Object.fromEntries(topics.map(t => [t.id, t.title]))

    // Build weakness details with names
    const weaknesses = Object.entries(topicWeaknessMap)
      .filter(([, score]) => score > 40)
      .map(([topicId, score]) => ({
        topicId,
        topicName: topicNameMap[topicId] || "Unknown",
        weaknessScore: score,
      }))
      .sort((a, b) => b.weaknessScore - a.weaknessScore)
      .slice(0, 5)

    // Build strength details with names
    const strengths = Object.entries(topicStrengthMap)
      .filter(([, score]) => score > 60)
      .map(([topicId, score]) => ({
        topicId,
        topicName: topicNameMap[topicId] || "Unknown",
        strengthScore: score,
      }))
      .sort((a, b) => b.strengthScore - a.strengthScore)
      .slice(0, 5)

    // Calculate profile health score (overall assessment)
    const healthScore = Math.round(
      (profile.confidenceIndex * 0.2 +
        profile.momentumScore * 0.25 +
        profile.engagementScore * 0.2 +
        profile.consistencyScore * 0.15 +
        (100 - profile.burnoutRiskScore) * 0.2)
    )

    return NextResponse.json({
      profile: {
        // Core metrics
        accuracyRate: profile.accuracyRate,
        retryRate: profile.retryRate,
        avgSolveTime: profile.avgSolveTime,
        avgSolveTimeByDifficulty,

        // Behavioral scores
        momentumScore: profile.momentumScore,
        confidenceIndex: profile.confidenceIndex,
        burnoutRiskScore: profile.burnoutRiskScore,
        engagementScore: profile.engagementScore,
        streakStabilityScore: profile.streakStabilityScore,
        consistencyScore: profile.consistencyScore,

        // Learning patterns
        learningVelocity: profile.learningVelocity,
        preferredSessionLength: profile.preferredSessionLength,
        peakPerformanceHour: profile.peakPerformanceHour,

        // Streaks
        currentWinStreak: profile.currentWinStreak,
        currentLoseStreak: profile.currentLoseStreak,

        // Totals
        totalQuestionsAttempted: profile.totalQuestionsAttempted,
        totalQuestionsPassed: profile.totalQuestionsPassed,
        totalMistakes: profile.totalMistakes,

        // Overall health
        healthScore,

        lastProfileUpdate: profile.lastProfileUpdate,
      },

      // Analysis
      weaknesses,
      strengths,
      mistakeTypeFrequency,

      // Recent activity
      recentMistakes: recentMistakes.map(m => ({
        id: m.id,
        type: m.mistakeType,
        severity: m.severity,
        questionTitle: m.question.title,
        createdAt: m.createdAt,
        wasResolved: m.wasResolved,
      })),

      // Context
      context: {
        level: userProgress?.level || 1,
        xp: userProgress?.xp || 0,
        currentStreak: userProgress?.currentStreak || 0,
        topTopics: topTopics.map(t => ({
          name: t.topic.title,
          solved: t.passCount,
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching cognitive profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Check PRO access
    const hasProAccess = await checkProAccess(userId)
    if (!hasProAccess) {
      return NextResponse.json(
        { error: "PRO subscription required" },
        { status: 403 }
      )
    }

    // Force full recalculation
    const result = await recalculateCognitiveProfile(userId)

    return NextResponse.json({
      success: true,
      message: "Profile recalculated successfully",
      profile: result,
    })
  } catch (error) {
    console.error("Error recalculating profile:", error)
    return NextResponse.json(
      { error: "Failed to recalculate profile" },
      { status: 500 }
    )
  }
}
