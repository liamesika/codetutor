import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { differenceInHours, differenceInDays, startOfDay } from "date-fns"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const now = new Date()

    // Get last activity
    const lastActivity = await db.userActivity.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    // Get user progress for streak info
    const userProgress = await db.userProgress.findUnique({
      where: { userId },
    })

    // Get last incomplete question (for "saved your place" feature)
    const lastDraft = await db.codeDraft.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        question: {
          include: {
            topic: {
              include: {
                week: true,
              },
            },
          },
        },
      },
    })

    // Check if there's a completed attempt for this question
    let resumeQuestion = null
    if (lastDraft) {
      const hasCompleted = await db.attempt.findFirst({
        where: {
          userId,
          questionId: lastDraft.questionId,
          status: "PASS",
        },
      })

      if (!hasCompleted) {
        resumeQuestion = {
          id: lastDraft.question.id,
          title: lastDraft.question.title,
          topicTitle: lastDraft.question.topic.title,
          weekNumber: lastDraft.question.topic.week.weekNumber,
          savedAt: lastDraft.updatedAt,
        }
      }
    }

    // Calculate inactivity status
    let inactivityStatus = "active"
    let hoursInactive = 0
    let daysInactive = 0
    let streakAtRisk = false
    let bonusXpAvailable = 0

    if (lastActivity) {
      hoursInactive = differenceInHours(now, lastActivity.createdAt)
      daysInactive = differenceInDays(now, startOfDay(lastActivity.createdAt))

      // Check streak risk (after 18 hours)
      if (userProgress && userProgress.currentStreak > 0) {
        const lastActiveDate = userProgress.lastActiveDate
        if (lastActiveDate) {
          const hoursSinceActive = differenceInHours(now, lastActiveDate)
          streakAtRisk = hoursSinceActive >= 18 && hoursSinceActive < 48
        }
      }

      // Determine inactivity level
      if (hoursInactive < 24) {
        inactivityStatus = "active"
      } else if (hoursInactive < 48) {
        inactivityStatus = "returning_soon"
        bonusXpAvailable = 25 // Bonus for returning within 48h
      } else if (hoursInactive < 168) { // 7 days
        inactivityStatus = "returning"
        bonusXpAvailable = 50 // Bigger bonus for coming back
      } else {
        inactivityStatus = "long_absence"
        bonusXpAvailable = 100 // Welcome back bonus
      }
    }

    // Calculate streak countdown
    let streakCountdown = null
    if (userProgress?.lastActiveDate && userProgress.currentStreak > 0) {
      const lastActive = startOfDay(userProgress.lastActiveDate)
      const todayStart = startOfDay(now)
      const daysSinceActive = differenceInDays(todayStart, lastActive)

      if (daysSinceActive === 0) {
        // Already active today
        streakCountdown = null
      } else if (daysSinceActive === 1) {
        // Need to be active today
        const endOfDay = new Date(todayStart)
        endOfDay.setHours(23, 59, 59, 999)
        const msRemaining = endOfDay.getTime() - now.getTime()
        streakCountdown = {
          hoursRemaining: Math.floor(msRemaining / (1000 * 60 * 60)),
          minutesRemaining: Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60)),
          streakValue: userProgress.currentStreak,
        }
      }
    }

    return NextResponse.json({
      inactivityStatus,
      hoursInactive,
      daysInactive,
      streakAtRisk,
      streakCountdown,
      currentStreak: userProgress?.currentStreak || 0,
      resumeQuestion,
      bonusXpAvailable,
      lastActivityType: lastActivity?.activityType || null,
    })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    )
  }
}

// Log activity
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { activityType, metadata, sessionId } = body

    if (!activityType) {
      return NextResponse.json({ error: "Activity type required" }, { status: 400 })
    }

    const validTypes = [
      "LOGIN",
      "QUESTION_START",
      "QUESTION_SUBMIT",
      "HINT_VIEW",
      "SOLUTION_VIEW",
      "LESSON_VIEW",
      "SESSION_START",
      "SESSION_END",
    ]

    if (!validTypes.includes(activityType)) {
      return NextResponse.json({ error: "Invalid activity type" }, { status: 400 })
    }

    const activity = await db.userActivity.create({
      data: {
        userId,
        activityType,
        metadata,
        sessionId,
      },
    })

    // Update last active date if meaningful activity
    if (["QUESTION_SUBMIT", "LESSON_VIEW"].includes(activityType)) {
      await db.userProgress.upsert({
        where: { userId },
        create: {
          userId,
          lastActiveDate: new Date(),
        },
        update: {
          lastActiveDate: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true, activity })
  } catch (error) {
    console.error("Error logging activity:", error)
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    )
  }
}

// Claim return bonus
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { action } = body

    if (action !== "claim-return-bonus") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Get last activity to determine bonus
    const lastActivity = await db.userActivity.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    if (!lastActivity) {
      return NextResponse.json({ error: "No previous activity found" }, { status: 400 })
    }

    const hoursInactive = differenceInHours(new Date(), lastActivity.createdAt)

    // Determine bonus based on inactivity
    let bonusXp = 0
    let bonusType = ""

    if (hoursInactive >= 24 && hoursInactive < 48) {
      bonusXp = 25
      bonusType = "quick_return"
    } else if (hoursInactive >= 48 && hoursInactive < 168) {
      bonusXp = 50
      bonusType = "return"
    } else if (hoursInactive >= 168) {
      bonusXp = 100
      bonusType = "welcome_back"
    }

    if (bonusXp === 0) {
      return NextResponse.json({ error: "No bonus available" }, { status: 400 })
    }

    // Check if bonus already claimed today
    const today = startOfDay(new Date())
    const existingBonus = await db.pointsLedger.findFirst({
      where: {
        userId,
        type: "ACHIEVEMENT",
        description: { contains: "return bonus" },
        createdAt: { gte: today },
      },
    })

    if (existingBonus) {
      return NextResponse.json({ error: "Bonus already claimed today" }, { status: 400 })
    }

    // Award bonus
    await db.userProgress.upsert({
      where: { userId },
      create: {
        userId,
        xp: bonusXp,
        lastActiveDate: new Date(),
      },
      update: {
        xp: { increment: bonusXp },
        lastActiveDate: new Date(),
      },
    })

    await db.pointsLedger.create({
      data: {
        userId,
        amount: bonusXp,
        type: "ACHIEVEMENT",
        description: `Welcome back return bonus (${bonusType})`,
        metadata: { bonusType, hoursInactive },
      },
    })

    // Log the return activity
    await db.userActivity.create({
      data: {
        userId,
        activityType: "LOGIN",
        metadata: { bonusClaimed: true, bonusXp, bonusType },
      },
    })

    return NextResponse.json({
      success: true,
      bonusXp,
      bonusType,
      message: `Welcome back! You earned ${bonusXp} XP!`,
    })
  } catch (error) {
    console.error("Error claiming return bonus:", error)
    return NextResponse.json(
      { error: "Failed to claim bonus" },
      { status: 500 }
    )
  }
}
