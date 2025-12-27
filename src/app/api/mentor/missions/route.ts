/**
 * PRO Missions API
 * GET /api/mentor/missions - Get active PRO missions
 * POST /api/mentor/missions - Generate new daily missions
 * PATCH /api/mentor/missions - Update mission progress
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  generateDailyMissions,
  saveProMissions,
  getActiveProMissions,
  updateMissionProgress,
} from "@/lib/mentor/mission-generator"
import { checkProAccess } from "@/lib/entitlement"
import { startOfDay } from "date-fns"

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

    const missions = await getActiveProMissions(userId)

    // Get topic names for targeted missions
    const topicIds = missions
      .map((m) => m.targetTopicId)
      .filter(Boolean) as string[]

    const topics = await db.topic.findMany({
      where: { id: { in: topicIds } },
      select: { id: true, title: true },
    })
    const topicNameMap = Object.fromEntries(topics.map((t) => [t.id, t.title]))

    const enhancedMissions = missions.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      missionType: m.missionType,
      targetValue: m.targetValue,
      progress: m.progress,
      xpReward: m.xpReward,
      difficultyLevel: m.difficultyLevel,
      priorityScore: m.priorityScore,
      targetTopic: m.targetTopicId ? topicNameMap[m.targetTopicId] : null,
      targetSkillArea: m.targetSkillArea,
      targetMistakeType: m.targetMistakeType,
      generatedReason: m.generatedReason,
      isComplete: m.completedAt !== null,
      completedAt: m.completedAt,
      xpEarned: m.xpEarned,
    }))

    // Calculate summary
    const completed = missions.filter((m) => m.completedAt).length
    const totalXpPossible = missions.reduce((sum, m) => sum + m.xpReward, 0)
    const xpEarned = missions.reduce((sum, m) => sum + m.xpEarned, 0)

    return NextResponse.json({
      missions: enhancedMissions,
      summary: {
        total: missions.length,
        completed,
        remaining: missions.length - completed,
        totalXpPossible,
        xpEarned,
        allComplete: completed === missions.length && missions.length > 0,
      },
    })
  } catch (error) {
    console.error("Error fetching missions:", error)
    return NextResponse.json(
      { error: "Failed to fetch missions" },
      { status: 500 }
    )
  }
}

export async function POST() {
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

    // Check if missions already exist for today
    const today = startOfDay(new Date())
    const existingMissions = await db.proMission.findMany({
      where: {
        userId,
        scheduledFor: today,
        isActive: true,
      },
    })

    if (existingMissions.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Missions already generated for today",
        generated: false,
        count: existingMissions.length,
      })
    }

    // Generate new missions
    const missions = await generateDailyMissions(userId, 3)
    await saveProMissions(userId, missions)

    return NextResponse.json({
      success: true,
      message: "Daily missions generated",
      generated: true,
      count: missions.length,
      missions: missions.map((m) => ({
        type: m.type,
        title: m.title,
        xpReward: m.xpReward,
      })),
    })
  } catch (error) {
    console.error("Error generating missions:", error)
    return NextResponse.json(
      { error: "Failed to generate missions" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json()
    const { missionId, incrementBy = 1 } = body

    if (!missionId) {
      return NextResponse.json(
        { error: "Mission ID required" },
        { status: 400 }
      )
    }

    // Verify mission belongs to user
    const mission = await db.proMission.findUnique({
      where: { id: missionId },
    })

    if (!mission || mission.userId !== userId) {
      return NextResponse.json(
        { error: "Mission not found" },
        { status: 404 }
      )
    }

    if (mission.completedAt) {
      return NextResponse.json({
        success: true,
        message: "Mission already completed",
        mission: {
          id: mission.id,
          progress: mission.progress,
          targetValue: mission.targetValue,
          isComplete: true,
        },
      })
    }

    await updateMissionProgress(missionId, incrementBy)

    // Get updated mission
    const updated = await db.proMission.findUnique({
      where: { id: missionId },
    })

    // If mission was just completed, award XP
    if (updated?.completedAt && !mission.completedAt) {
      // Update user progress XP
      await db.userProgress.upsert({
        where: { userId },
        update: { xp: { increment: updated.xpReward } },
        create: { userId, xp: updated.xpReward },
      })
    }

    return NextResponse.json({
      success: true,
      message: updated?.completedAt ? "Mission completed!" : "Progress updated",
      mission: {
        id: updated?.id,
        progress: updated?.progress,
        targetValue: updated?.targetValue,
        isComplete: updated?.completedAt !== null,
        xpEarned: updated?.xpEarned || 0,
      },
    })
  } catch (error) {
    console.error("Error updating mission:", error)
    return NextResponse.json(
      { error: "Failed to update mission" },
      { status: 500 }
    )
  }
}
