/**
 * Momentum Score API
 * GET /api/mentor/momentum - Get detailed momentum analysis
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getOrCreateProfile } from "@/lib/mentor/cognitive-engine"
import { checkProAccess } from "@/lib/entitlement"
import { subDays, differenceInDays, startOfDay } from "date-fns"

interface MomentumBreakdown {
  xpVelocity: { score: number; trend: "up" | "down" | "stable" }
  streakStability: { score: number; currentStreak: number; riskLevel: "low" | "medium" | "high" }
  successRatio: { score: number; recent: number; overall: number }
  missionCompletion: { score: number; completed: number; total: number }
  consistency: { score: number; daysActive: number; avgGap: number }
}

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

    const profile = await getOrCreateProfile(userId)

    // Get detailed data for momentum breakdown
    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)
    const fourteenDaysAgo = subDays(now, 14)

    const [
      recentAttempts,
      previousAttempts,
      userProgress,
      recentMissions,
      activities,
      proMissions,
    ] = await Promise.all([
      db.attempt.findMany({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: "desc" },
      }),
      db.attempt.findMany({
        where: {
          userId,
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
      db.userProgress.findUnique({ where: { userId } }),
      db.userDailyMission.findMany({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
      }),
      db.userActivity.findMany({
        where: { userId, createdAt: { gte: fourteenDaysAgo } },
        orderBy: { createdAt: "desc" },
      }),
      db.proMission.findMany({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
      }),
    ])

    // Calculate XP Velocity
    const recentXp = recentAttempts
      .filter((a) => a.status === "PASS")
      .reduce((sum, a) => sum + a.pointsEarned, 0)
    const previousXp = previousAttempts
      .filter((a) => a.status === "PASS")
      .reduce((sum, a) => sum + a.pointsEarned, 0)

    const xpVelocityScore = Math.min(100, Math.round((recentXp / 500) * 100)) // 500 XP/week = 100 score
    const xpTrend: "up" | "down" | "stable" =
      recentXp > previousXp * 1.2 ? "up" : recentXp < previousXp * 0.8 ? "down" : "stable"

    // Calculate Streak Stability
    const currentStreak = userProgress?.currentStreak || 0
    const bestStreak = userProgress?.bestStreak || 1
    const streakRatio = currentStreak / Math.max(bestStreak, 1)
    const streakStabilityScore = Math.min(100, Math.round(30 + streakRatio * 70))
    const streakRiskLevel: "low" | "medium" | "high" =
      currentStreak >= 7 ? "low" : currentStreak >= 3 ? "medium" : "high"

    // Calculate Success Ratio
    const recentPasses = recentAttempts.filter((a) => a.status === "PASS").length
    const recentTotal = recentAttempts.length
    const recentSuccessRate = recentTotal > 0 ? recentPasses / recentTotal : 0
    const overallSuccessRate = profile.accuracyRate
    const successRatioScore = Math.round(recentSuccessRate * 100)

    // Calculate Mission Completion
    const completedMissions = [...recentMissions, ...proMissions].filter(
      (m) => m.completedAt
    ).length
    const totalMissions = recentMissions.length + proMissions.length
    const missionCompletionScore =
      totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 50

    // Calculate Consistency
    const uniqueDays = new Set(
      activities
        .filter((a) => differenceInDays(now, a.createdAt) < 14)
        .map((a) => startOfDay(a.createdAt).toISOString())
    )
    const daysActive = uniqueDays.size

    const activeDates = Array.from(uniqueDays)
      .map((d) => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime())

    let totalGap = 0
    for (let i = 1; i < activeDates.length; i++) {
      totalGap += differenceInDays(activeDates[i], activeDates[i - 1])
    }
    const avgGap = activeDates.length > 1 ? totalGap / (activeDates.length - 1) : 0
    const consistencyScore = Math.max(0, Math.min(100, Math.round(100 - (avgGap - 1) * 20)))

    // Build breakdown
    const breakdown: MomentumBreakdown = {
      xpVelocity: {
        score: xpVelocityScore,
        trend: xpTrend,
      },
      streakStability: {
        score: streakStabilityScore,
        currentStreak,
        riskLevel: streakRiskLevel,
      },
      successRatio: {
        score: successRatioScore,
        recent: Math.round(recentSuccessRate * 100),
        overall: Math.round(overallSuccessRate * 100),
      },
      missionCompletion: {
        score: missionCompletionScore,
        completed: completedMissions,
        total: totalMissions,
      },
      consistency: {
        score: consistencyScore,
        daysActive,
        avgGap: Math.round(avgGap * 10) / 10,
      },
    }

    // Calculate overall momentum
    const overallMomentum = Math.round(
      (xpVelocityScore * 0.25 +
        streakStabilityScore * 0.2 +
        successRatioScore * 0.25 +
        missionCompletionScore * 0.15 +
        consistencyScore * 0.15)
    )

    // Generate momentum message
    const momentumMessage = generateMomentumMessage(overallMomentum, breakdown)

    // Determine momentum state
    const momentumState: "rising" | "stable" | "declining" | "critical" =
      overallMomentum >= 70
        ? "rising"
        : overallMomentum >= 50
          ? "stable"
          : overallMomentum >= 30
            ? "declining"
            : "critical"

    return NextResponse.json({
      momentum: {
        score: overallMomentum,
        state: momentumState,
        message: momentumMessage,
        breakdown,
      },
      recommendations: generateRecommendations(breakdown),
      history: {
        recentXp,
        previousXp,
        weeklyChange: previousXp > 0 ? Math.round(((recentXp - previousXp) / previousXp) * 100) : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching momentum:", error)
    return NextResponse.json(
      { error: "Failed to fetch momentum" },
      { status: 500 }
    )
  }
}

function generateMomentumMessage(
  score: number,
  breakdown: MomentumBreakdown
): string {
  if (score >= 80) {
    return "You're on fire! Your momentum is excellent. Keep pushing!"
  }

  if (score >= 60) {
    return "Good momentum! You're making solid progress."
  }

  if (score >= 40) {
    if (breakdown.xpVelocity.trend === "down") {
      return "Your activity has slowed down. A quick win could get you back on track."
    }
    if (breakdown.streakStability.riskLevel === "high") {
      return "Your streak needs attention. Complete a question to protect it."
    }
    return "Steady progress. A bit more focus will boost your momentum."
  }

  if (score >= 20) {
    return "Your momentum is low. Start with something easy to rebuild confidence."
  }

  return "Time to get back on track! Start with a quick, easy win."
}

function generateRecommendations(breakdown: MomentumBreakdown): string[] {
  const recommendations: string[] = []

  if (breakdown.xpVelocity.score < 50) {
    recommendations.push("Try to solve at least 2-3 questions daily to build XP velocity")
  }

  if (breakdown.streakStability.riskLevel === "high") {
    recommendations.push("Focus on maintaining your streak - even one question per day helps")
  }

  if (breakdown.successRatio.score < 60) {
    recommendations.push("Consider practicing easier questions to improve your success rate")
  }

  if (breakdown.missionCompletion.score < 50) {
    recommendations.push("Complete your daily missions for bonus XP and structured practice")
  }

  if (breakdown.consistency.avgGap > 2) {
    recommendations.push("Try to practice every day - consistency is key to learning")
  }

  if (recommendations.length === 0) {
    recommendations.push("Keep up the great work! Consider tackling harder challenges")
  }

  return recommendations.slice(0, 3)
}
