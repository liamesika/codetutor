import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { differenceInHours, differenceInDays, startOfDay } from "date-fns"

// Generate unique request ID for error tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Default response for activity - never crash, always return valid data
const DEFAULT_ACTIVITY_RESPONSE = {
  inactivityStatus: "active",
  hoursInactive: 0,
  daysInactive: 0,
  streakAtRisk: false,
  streakCountdown: null,
  currentStreak: 0,
  resumeQuestion: null,
  bonusXpAvailable: 0,
  lastActivityType: null,
}

export async function GET() {
  const requestId = generateRequestId()

  try {
    // Get session with defensive handling
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (sessionError) {
      console.error(`[ACTIVITY API][${requestId}] Session retrieval failed:`, sessionError)
      // Return defaults for unauthenticated user
      return NextResponse.json(DEFAULT_ACTIVITY_RESPONSE, {
        headers: { "X-Request-Id": requestId },
      })
    }

    if (!session?.user?.id) {
      // Return 401 cleanly for unauthenticated users
      return NextResponse.json(
        { error: "Unauthorized", ...DEFAULT_ACTIVITY_RESPONSE },
        { status: 401, headers: { "X-Request-Id": requestId } }
      )
    }

    const userId = session.user.id
    const now = new Date()

    // Get last activity (defensive - may not exist)
    let lastActivity = null
    try {
      lastActivity = await db.userActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    } catch (dbError) {
      console.error(`[ACTIVITY API][${requestId}] Failed to fetch last activity:`, dbError)
      // Continue with null - first-time user
    }

    // Get user progress for streak info (defensive - may not exist)
    let userProgress = null
    try {
      userProgress = await db.userProgress.findUnique({
        where: { userId },
      })
    } catch (dbError) {
      console.error(`[ACTIVITY API][${requestId}] Failed to fetch user progress:`, dbError)
      // Continue with null - new user without progress
    }

    // Get last incomplete question (defensive - complex query)
    let resumeQuestion = null
    try {
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
      if (lastDraft?.question?.topic?.week) {
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
            title: lastDraft.question.title ?? "Untitled",
            topicTitle: lastDraft.question.topic.title ?? "Unknown Topic",
            weekNumber: lastDraft.question.topic.week.weekNumber ?? 1,
            savedAt: lastDraft.updatedAt,
          }
        }
      }
    } catch (dbError) {
      console.error(`[ACTIVITY API][${requestId}] Failed to fetch resume question:`, dbError)
      // Continue without resume question
    }

    // Calculate inactivity status (all defensive)
    let inactivityStatus = "active"
    let hoursInactive = 0
    let daysInactive = 0
    let streakAtRisk = false
    let bonusXpAvailable = 0

    if (lastActivity?.createdAt) {
      try {
        hoursInactive = differenceInHours(now, lastActivity.createdAt)
        daysInactive = differenceInDays(now, startOfDay(lastActivity.createdAt))

        // Check streak risk (after 18 hours)
        if (userProgress?.currentStreak && userProgress.currentStreak > 0) {
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
          bonusXpAvailable = 25
        } else if (hoursInactive < 168) {
          inactivityStatus = "returning"
          bonusXpAvailable = 50
        } else {
          inactivityStatus = "long_absence"
          bonusXpAvailable = 100
        }
      } catch (dateError) {
        console.error(`[ACTIVITY API][${requestId}] Date calculation error:`, dateError)
        // Continue with defaults
      }
    }

    // Calculate streak countdown (defensive)
    let streakCountdown = null
    try {
      if (userProgress?.lastActiveDate && userProgress.currentStreak > 0) {
        const lastActive = startOfDay(userProgress.lastActiveDate)
        const todayStart = startOfDay(now)
        const daysSinceActive = differenceInDays(todayStart, lastActive)

        if (daysSinceActive === 1) {
          const endOfDay = new Date(todayStart)
          endOfDay.setHours(23, 59, 59, 999)
          const msRemaining = endOfDay.getTime() - now.getTime()
          streakCountdown = {
            hoursRemaining: Math.max(0, Math.floor(msRemaining / (1000 * 60 * 60))),
            minutesRemaining: Math.max(0, Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60))),
            streakValue: userProgress.currentStreak,
          }
        }
      }
    } catch (streakError) {
      console.error(`[ACTIVITY API][${requestId}] Streak calculation error:`, streakError)
      // Continue without streak countdown
    }

    return NextResponse.json(
      {
        inactivityStatus,
        hoursInactive,
        daysInactive,
        streakAtRisk,
        streakCountdown,
        currentStreak: userProgress?.currentStreak ?? 0,
        resumeQuestion,
        bonusXpAvailable,
        lastActivityType: lastActivity?.activityType ?? null,
      },
      { headers: { "X-Request-Id": requestId } }
    )
  } catch (error) {
    console.error(`[ACTIVITY API][${requestId}] Unexpected error:`, error)
    // Return defaults instead of 500
    return NextResponse.json(DEFAULT_ACTIVITY_RESPONSE, {
      status: 200,
      headers: { "X-Request-Id": requestId, "X-Error": "unexpected_error" },
    })
  }
}

// Log activity
export async function POST(request: Request) {
  const requestId = generateRequestId()

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "X-Request-Id": requestId } }
      )
    }

    const userId = session.user.id

    // Parse body defensively
    let body: { activityType?: string; metadata?: unknown; sessionId?: string } = {}
    try {
      body = await request.json()
    } catch (parseError) {
      console.error(`[ACTIVITY API][${requestId}] Failed to parse request body:`, parseError)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400, headers: { "X-Request-Id": requestId } }
      )
    }

    const { activityType, metadata, sessionId } = body

    if (!activityType) {
      return NextResponse.json(
        { error: "Activity type required" },
        { status: 400, headers: { "X-Request-Id": requestId } }
      )
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
      return NextResponse.json(
        { error: "Invalid activity type" },
        { status: 400, headers: { "X-Request-Id": requestId } }
      )
    }

    // Create activity (defensive)
    let activity = null
    try {
      activity = await db.userActivity.create({
        data: {
          userId,
          activityType: activityType as "LOGIN" | "QUESTION_START" | "QUESTION_SUBMIT" | "HINT_VIEW" | "SOLUTION_VIEW" | "LESSON_VIEW" | "SESSION_START" | "SESSION_END",
          metadata: metadata as object | undefined,
          sessionId: sessionId ?? null,
        },
      })
    } catch (dbError) {
      console.error(`[ACTIVITY API][${requestId}] Failed to create activity:`, dbError)
      // Return success anyway - activity logging is not critical
      return NextResponse.json(
        { success: true, activity: null, warning: "Activity not logged" },
        { headers: { "X-Request-Id": requestId } }
      )
    }

    // Update last active date if meaningful activity (defensive)
    if (["QUESTION_SUBMIT", "LESSON_VIEW"].includes(activityType)) {
      try {
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
      } catch (upsertError) {
        console.error(`[ACTIVITY API][${requestId}] Failed to update user progress:`, upsertError)
        // Continue - not critical
      }
    }

    return NextResponse.json(
      { success: true, activity },
      { headers: { "X-Request-Id": requestId } }
    )
  } catch (error) {
    console.error(`[ACTIVITY API][${requestId}] Unexpected POST error:`, error)
    // Return success anyway - activity logging is not critical
    return NextResponse.json(
      { success: true, warning: "Activity may not have been logged" },
      { headers: { "X-Request-Id": requestId, "X-Error": "unexpected_error" } }
    )
  }
}

// Claim return bonus
export async function PUT(request: Request) {
  const requestId = generateRequestId()

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "X-Request-Id": requestId } }
      )
    }

    const userId = session.user.id

    // Parse body defensively
    let body: { action?: string } = {}
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400, headers: { "X-Request-Id": requestId } }
      )
    }

    const { action } = body

    if (action !== "claim-return-bonus") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400, headers: { "X-Request-Id": requestId } }
      )
    }

    // Get last activity to determine bonus
    const lastActivity = await db.userActivity.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    if (!lastActivity) {
      return NextResponse.json(
        { error: "No previous activity found", bonusXp: 0 },
        { status: 200, headers: { "X-Request-Id": requestId } }
      )
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
      return NextResponse.json(
        { success: false, error: "No bonus available", bonusXp: 0 },
        { status: 200, headers: { "X-Request-Id": requestId } }
      )
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
      return NextResponse.json(
        { success: false, error: "Bonus already claimed today", bonusXp: 0 },
        { status: 200, headers: { "X-Request-Id": requestId } }
      )
    }

    // Award bonus (defensive)
    try {
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
    } catch (awardError) {
      console.error(`[ACTIVITY API][${requestId}] Failed to award bonus:`, awardError)
      return NextResponse.json(
        { success: false, error: "Failed to award bonus", bonusXp: 0 },
        { status: 200, headers: { "X-Request-Id": requestId } }
      )
    }

    return NextResponse.json(
      {
        success: true,
        bonusXp,
        bonusType,
        message: `Welcome back! You earned ${bonusXp} XP!`,
      },
      { headers: { "X-Request-Id": requestId } }
    )
  } catch (error) {
    console.error(`[ACTIVITY API][${requestId}] Unexpected PUT error:`, error)
    return NextResponse.json(
      { success: false, error: "Something went wrong", bonusXp: 0 },
      { status: 200, headers: { "X-Request-Id": requestId, "X-Error": "unexpected_error" } }
    )
  }
}
