import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { startOfDay } from "date-fns"

// Mission templates that rotate daily
const MISSION_TEMPLATES = [
  // Easy missions (free)
  {
    title: "First Steps",
    description: "Solve 1 question today",
    xpReward: 25,
    type: "SOLVE" as const,
    targetValue: 1,
    difficulty: "EASY" as const,
    isPremiumOnly: false,
  },
  {
    title: "Quick Learner",
    description: "Practice for 10 minutes",
    xpReward: 30,
    type: "TIME" as const,
    targetValue: 10,
    difficulty: "EASY" as const,
    isPremiumOnly: false,
  },
  {
    title: "Keep Going",
    description: "Log in and solve any question",
    xpReward: 20,
    type: "SOLVE" as const,
    targetValue: 1,
    difficulty: "EASY" as const,
    isPremiumOnly: false,
  },
  // Normal missions (challenge)
  {
    title: "Triple Threat",
    description: "Solve 3 questions today",
    xpReward: 75,
    type: "SOLVE" as const,
    targetValue: 3,
    difficulty: "NORMAL" as const,
    isPremiumOnly: false,
  },
  {
    title: "Flame Keeper",
    description: "Maintain your streak",
    xpReward: 50,
    type: "STREAK" as const,
    targetValue: 1,
    difficulty: "NORMAL" as const,
    isPremiumOnly: false,
  },
  {
    title: "Focused Session",
    description: "Practice for 30 minutes",
    xpReward: 60,
    type: "TIME" as const,
    targetValue: 30,
    difficulty: "NORMAL" as const,
    isPremiumOnly: false,
  },
  {
    title: "Sharp Mind",
    description: "Achieve 80% accuracy today",
    xpReward: 70,
    type: "ACCURACY" as const,
    targetValue: 80,
    difficulty: "NORMAL" as const,
    isPremiumOnly: false,
  },
  // Challenge missions (premium)
  {
    title: "Perfectionist",
    description: "Complete 3 questions without using hints",
    xpReward: 150,
    type: "PERFECT" as const,
    targetValue: 3,
    difficulty: "CHALLENGE" as const,
    isPremiumOnly: true,
  },
  {
    title: "Marathon Coder",
    description: "Solve 5 questions in one session",
    xpReward: 125,
    type: "SOLVE" as const,
    targetValue: 5,
    difficulty: "CHALLENGE" as const,
    isPremiumOnly: true,
  },
  {
    title: "Accuracy Master",
    description: "Achieve 95% accuracy on 3 questions",
    xpReward: 175,
    type: "ACCURACY" as const,
    targetValue: 95,
    difficulty: "CHALLENGE" as const,
    isPremiumOnly: true,
  },
  {
    title: "Topic Conqueror",
    description: "Complete all questions in a topic",
    xpReward: 200,
    type: "TOPIC" as const,
    targetValue: 1,
    difficulty: "CHALLENGE" as const,
    isPremiumOnly: true,
  },
]

// Deterministically select missions for a given date
function selectMissionsForDate(date: Date): typeof MISSION_TEMPLATES {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()

  // Separate by difficulty
  const easy = MISSION_TEMPLATES.filter(m => m.difficulty === "EASY")
  const normal = MISSION_TEMPLATES.filter(m => m.difficulty === "NORMAL")
  const challenge = MISSION_TEMPLATES.filter(m => m.difficulty === "CHALLENGE")

  // Select one from each category using seed
  const selectedEasy = easy[seed % easy.length]
  const selectedNormal = normal[(seed * 7) % normal.length]
  const selectedChallenge = challenge[(seed * 13) % challenge.length]

  return [selectedEasy, selectedNormal, selectedChallenge]
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const today = startOfDay(new Date())

    // Check user's premium status
    const entitlement = await db.entitlement.findUnique({
      where: { userId },
    })
    const isPremium = entitlement?.plan === "PRO"

    // Get or create today's missions
    const existingMissions = await db.userDailyMission.findMany({
      where: {
        userId,
        date: today,
      },
      include: {
        mission: true,
      },
    })

    // If missions already assigned for today, return them
    if (existingMissions.length > 0) {
      return NextResponse.json({
        missions: existingMissions.map(um => ({
          id: um.id,
          missionId: um.mission.id,
          title: um.mission.title,
          description: um.mission.description,
          xpReward: um.mission.xpReward,
          type: um.mission.type,
          targetValue: um.mission.targetValue,
          difficulty: um.mission.difficulty,
          isPremiumOnly: um.mission.isPremiumOnly,
          progress: um.progress,
          completed: !!um.completedAt,
          completedAt: um.completedAt,
          xpEarned: um.xpEarned,
          locked: um.mission.isPremiumOnly && !isPremium,
        })),
        isPremium,
      })
    }

    // Select missions for today
    const selectedTemplates = selectMissionsForDate(today)

    // Create or get missions in database
    const missions = await Promise.all(
      selectedTemplates.map(async (template) => {
        // Find or create the mission template
        let mission = await db.dailyMission.findFirst({
          where: {
            title: template.title,
            type: template.type,
            targetValue: template.targetValue,
          },
        })

        if (!mission) {
          mission = await db.dailyMission.create({
            data: template,
          })
        }

        // Create user's daily mission entry
        const userMission = await db.userDailyMission.create({
          data: {
            userId,
            missionId: mission.id,
            date: today,
            progress: 0,
          },
          include: {
            mission: true,
          },
        })

        return {
          id: userMission.id,
          missionId: mission.id,
          title: mission.title,
          description: mission.description,
          xpReward: mission.xpReward,
          type: mission.type,
          targetValue: mission.targetValue,
          difficulty: mission.difficulty,
          isPremiumOnly: mission.isPremiumOnly,
          progress: 0,
          completed: false,
          completedAt: null,
          xpEarned: 0,
          locked: mission.isPremiumOnly && !isPremium,
        }
      })
    )

    return NextResponse.json({
      missions,
      isPremium,
    })
  } catch (error) {
    console.error("Error fetching daily missions:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily missions" },
      { status: 500 }
    )
  }
}

// Update mission progress
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { missionId, progressIncrement } = body

    if (!missionId) {
      return NextResponse.json({ error: "Mission ID required" }, { status: 400 })
    }

    const today = startOfDay(new Date())

    // Get the user mission
    const userMission = await db.userDailyMission.findFirst({
      where: {
        userId,
        missionId,
        date: today,
      },
      include: {
        mission: true,
      },
    })

    if (!userMission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    // Check if already completed
    if (userMission.completedAt) {
      return NextResponse.json({
        message: "Mission already completed",
        mission: userMission,
      })
    }

    // Check premium lock
    const entitlement = await db.entitlement.findUnique({
      where: { userId },
    })
    const isPremium = entitlement?.plan === "PRO"

    if (userMission.mission.isPremiumOnly && !isPremium) {
      return NextResponse.json({ error: "Premium mission locked" }, { status: 403 })
    }

    // Update progress
    const newProgress = Math.min(
      userMission.progress + (progressIncrement || 1),
      userMission.mission.targetValue
    )

    const isCompleted = newProgress >= userMission.mission.targetValue

    // Update the mission
    const updated = await db.userDailyMission.update({
      where: { id: userMission.id },
      data: {
        progress: newProgress,
        completedAt: isCompleted ? new Date() : null,
        xpEarned: isCompleted ? userMission.mission.xpReward : 0,
      },
      include: {
        mission: true,
      },
    })

    // If completed, award XP
    if (isCompleted && !userMission.completedAt) {
      // Update user progress
      await db.userProgress.upsert({
        where: { userId },
        create: {
          userId,
          xp: userMission.mission.xpReward,
        },
        update: {
          xp: { increment: userMission.mission.xpReward },
        },
      })

      // Add to points ledger
      await db.pointsLedger.create({
        data: {
          userId,
          amount: userMission.mission.xpReward,
          type: "ACHIEVEMENT",
          description: `Completed daily mission: ${userMission.mission.title}`,
          metadata: {
            missionId: userMission.mission.id,
            missionType: userMission.mission.type,
          },
        },
      })
    }

    return NextResponse.json({
      mission: {
        id: updated.id,
        missionId: updated.mission.id,
        title: updated.mission.title,
        description: updated.mission.description,
        xpReward: updated.mission.xpReward,
        type: updated.mission.type,
        targetValue: updated.mission.targetValue,
        difficulty: updated.mission.difficulty,
        isPremiumOnly: updated.mission.isPremiumOnly,
        progress: updated.progress,
        completed: !!updated.completedAt,
        completedAt: updated.completedAt,
        xpEarned: updated.xpEarned,
        locked: false,
      },
      justCompleted: isCompleted && !userMission.completedAt,
      xpAwarded: isCompleted && !userMission.completedAt ? userMission.mission.xpReward : 0,
    })
  } catch (error) {
    console.error("Error updating mission progress:", error)
    return NextResponse.json(
      { error: "Failed to update mission progress" },
      { status: 500 }
    )
  }
}
