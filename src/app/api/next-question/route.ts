import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Generate unique request ID for error tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Default response when no question is available
const NO_QUESTION_RESPONSE = {
  questionId: null,
  message: "No questions available at this time.",
}

// Adaptive learning algorithm for selecting next question
export async function GET(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Get session with defensive handling
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (sessionError) {
      console.error(`[NEXT-QUESTION API][${requestId}] Session retrieval failed:`, sessionError)
      return NextResponse.json(
        { error: "Unauthorized", ...NO_QUESTION_RESPONSE },
        { status: 401, headers: { "X-Request-Id": requestId } }
      )
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", ...NO_QUESTION_RESPONSE },
        { status: 401, headers: { "X-Request-Id": requestId } }
      )
    }

    const userId = session.user.id

    // Parse URL defensively
    let courseSlug = "java-weeks-1-5"
    let topicId: string | null = null
    try {
      const { searchParams } = new URL(req.url)
      courseSlug = searchParams.get("course") || "java-weeks-1-5"
      topicId = searchParams.get("topicId")
    } catch (urlError) {
      console.error(`[NEXT-QUESTION API][${requestId}] URL parsing failed:`, urlError)
      // Continue with defaults
    }

    // Get course with all questions (defensive)
    let course = null
    try {
      course = await db.course.findUnique({
        where: { slug: courseSlug },
        include: {
          weeks: {
            where: { isLocked: false },
            orderBy: { orderIndex: "asc" },
            include: {
              topics: {
                where: topicId ? { id: topicId } : { isLocked: false },
                orderBy: { orderIndex: "asc" },
                include: {
                  questions: {
                    where: { isActive: true },
                    orderBy: [{ difficulty: "asc" }, { orderIndex: "asc" }],
                  },
                },
              },
            },
          },
        },
      })
    } catch (dbError) {
      console.error(`[NEXT-QUESTION API][${requestId}] Database query failed:`, dbError)
      return NextResponse.json(
        { ...NO_QUESTION_RESPONSE, error: "Database temporarily unavailable" },
        { status: 200, headers: { "X-Request-Id": requestId } }
      )
    }

    // No course found - return empty (not 500)
    if (!course) {
      console.log(`[NEXT-QUESTION API][${requestId}] Course not found: ${courseSlug}`)
      return NextResponse.json(
        { ...NO_QUESTION_RESPONSE, message: "Course not found" },
        { status: 200, headers: { "X-Request-Id": requestId } }
      )
    }

    // No weeks available
    if (!course.weeks || course.weeks.length === 0) {
      console.log(`[NEXT-QUESTION API][${requestId}] No unlocked weeks in course`)
      return NextResponse.json(
        { ...NO_QUESTION_RESPONSE, message: "No content available yet" },
        { status: 200, headers: { "X-Request-Id": requestId } }
      )
    }

    // Get user's topic stats (defensive)
    let topicStats: Awaited<ReturnType<typeof db.userTopicStats.findMany>> = []
    try {
      topicStats = await db.userTopicStats.findMany({
        where: { userId },
      })
    } catch (dbError) {
      console.error(`[NEXT-QUESTION API][${requestId}] Failed to fetch topic stats:`, dbError)
      // Continue with empty stats
    }
    const statsMap = new Map(topicStats.map((s) => [s.topicId, s]))

    // Get user's passed questions (defensive)
    let passedAttempts: { questionId: string }[] = []
    try {
      passedAttempts = await db.attempt.findMany({
        where: { userId, status: "PASS" },
        select: { questionId: true },
      })
    } catch (dbError) {
      console.error(`[NEXT-QUESTION API][${requestId}] Failed to fetch passed attempts:`, dbError)
      // Continue with empty list
    }
    const passedQuestionIds = new Set(passedAttempts.map((a) => a.questionId))

    // Get user's recent failed attempts (defensive)
    let recentFailures: { questionId: string }[] = []
    try {
      recentFailures = await db.attempt.findMany({
        where: {
          userId,
          status: { not: "PASS" },
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        select: { questionId: true },
        orderBy: { createdAt: "desc" },
      })
    } catch (dbError) {
      console.error(`[NEXT-QUESTION API][${requestId}] Failed to fetch recent failures:`, dbError)
      // Continue with empty list
    }
    const recentFailedIds = new Set(recentFailures.slice(0, 5).map((a) => a.questionId))

    // Collect all available questions with scores
    interface QuestionCandidate {
      question: {
        id: string
        topicId: string
        difficulty: number
        points: number
        title: string
        orderIndex?: number
      }
      topic: {
        id: string
        title: string
        weekId: string
        questions?: { id: string }[]
      }
      score: number
      reason: string
    }

    const candidates: QuestionCandidate[] = []

    // Process weeks and topics safely
    for (const week of course.weeks ?? []) {
      for (const topic of week.topics ?? []) {
        const stats = statsMap.get(topic.id)
        const passRate = stats
          ? (stats.attemptsCount ?? 0) > 0
            ? (stats.passCount ?? 0) / (stats.attemptsCount ?? 1)
            : 0.5
          : 0.5
        const skillLevel = stats?.skillLevel ?? 0.5
        const lastAttempt = stats?.lastAttemptAt
        const streak = stats?.streak ?? 0

        for (const question of topic.questions ?? []) {
          // Skip already passed questions (unless for spaced repetition)
          if (passedQuestionIds.has(question.id)) {
            // Spaced repetition: resurface passed questions after 7 days
            if (lastAttempt) {
              const daysSinceAttempt = Math.floor(
                (Date.now() - lastAttempt.getTime()) / (1000 * 60 * 60 * 24)
              )
              if (daysSinceAttempt >= 7 && Math.random() < 0.2) {
                candidates.push({
                  question,
                  topic,
                  score: 20,
                  reason: "Spaced repetition review",
                })
              }
            }
            continue
          }

          let score = 100
          let reason = "New question"

          // 1. Prioritize weak topics (low pass rate)
          if (passRate < 0.6) {
            score += 50
            reason = "Weak topic - needs practice"
          }

          // 2. Match difficulty to skill level
          const targetDifficulty = Math.ceil(skillLevel * 5)
          const difficultyMatch = Math.abs((question.difficulty ?? 1) - targetDifficulty)
          if (difficultyMatch === 0) {
            score += 30
            reason = "Optimal difficulty"
          } else if (difficultyMatch === 1) {
            score += 15
          } else {
            score -= difficultyMatch * 10
          }

          // 3. Prioritize recently failed questions
          if (recentFailedIds.has(question.id)) {
            score += 40
            reason = "Recently failed - retry"
          }

          // 4. Progress through topics sequentially
          const attemptedInTopic = (topic.questions ?? []).filter((q) =>
            passedQuestionIds.has(q.id)
          ).length
          if (attemptedInTopic === 0 && (question.orderIndex ?? 0) === 0) {
            score += 25
            reason = "Start new topic"
          }

          // 5. Streak momentum
          if (streak >= 3 && (question.difficulty ?? 1) > targetDifficulty) {
            score += 20
            reason = "Challenge mode - on a streak!"
          }

          // 6. Lower difficulty if struggling
          if (passRate < 0.4 && (question.difficulty ?? 1) > 2) {
            score -= 30
          }
          if (passRate < 0.4 && (question.difficulty ?? 1) <= 2) {
            score += 30
            reason = "Easier question for practice"
          }

          // 7. Add some randomness
          score += Math.random() * 20

          candidates.push({
            question,
            topic,
            score,
            reason,
          })
        }
      }
    }

    // No candidates available
    if (candidates.length === 0) {
      return NextResponse.json(
        {
          questionId: null,
          message: "All questions completed! Great job!",
        },
        { headers: { "X-Request-Id": requestId } }
      )
    }

    // Sort by score and pick top candidate
    candidates.sort((a, b) => b.score - a.score)
    const selected = candidates[0]

    // Log selection for analytics (non-critical, don't crash if fails)
    try {
      await db.eventLog.create({
        data: {
          userId,
          eventType: "ADAPTIVE_SELECTION",
          payload: {
            selectedQuestionId: selected.question.id,
            reason: selected.reason,
            score: selected.score,
            candidatesCount: candidates.length,
          },
        },
      })
    } catch (logError) {
      console.error(`[NEXT-QUESTION API][${requestId}] Failed to log selection:`, logError)
      // Continue - logging is not critical
    }

    return NextResponse.json(
      {
        questionId: selected.question.id,
        topicId: selected.topic.id,
        topicTitle: selected.topic.title ?? "Unknown Topic",
        questionTitle: selected.question.title ?? "Untitled Question",
        difficulty: selected.question.difficulty ?? 1,
        reason: selected.reason,
      },
      { headers: { "X-Request-Id": requestId } }
    )
  } catch (error) {
    console.error(`[NEXT-QUESTION API][${requestId}] Unexpected error:`, error)
    // Return safe response instead of 500
    return NextResponse.json(
      { ...NO_QUESTION_RESPONSE, message: "Unable to select question at this time" },
      {
        status: 200,
        headers: { "X-Request-Id": requestId, "X-Error": "unexpected_error" },
      }
    )
  }
}
