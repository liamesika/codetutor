import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Adaptive learning algorithm for selecting next question
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const courseSlug = searchParams.get("course") || "java-weeks-1-5"
    const topicId = searchParams.get("topicId")

    // Get course with all questions
    const course = await db.course.findUnique({
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

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Get user's topic stats
    const topicStats = await db.userTopicStats.findMany({
      where: { userId },
    })
    const statsMap = new Map(topicStats.map((s) => [s.topicId, s]))

    // Get user's passed questions
    const passedAttempts = await db.attempt.findMany({
      where: { userId, status: "PASS" },
      select: { questionId: true },
    })
    const passedQuestionIds = new Set(passedAttempts.map((a) => a.questionId))

    // Get user's recent failed attempts (last 24 hours)
    const recentFailures = await db.attempt.findMany({
      where: {
        userId,
        status: { not: "PASS" },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: { questionId: true },
      orderBy: { createdAt: "desc" },
    })
    const recentFailedIds = new Set(recentFailures.slice(0, 5).map((a) => a.questionId))

    // Collect all available questions with scores
    interface QuestionCandidate {
      question: {
        id: string
        topicId: string
        difficulty: number
        points: number
        title: string
      }
      topic: {
        id: string
        title: string
        weekId: string
      }
      score: number
      reason: string
    }

    const candidates: QuestionCandidate[] = []

    for (const week of course.weeks) {
      for (const topic of week.topics) {
        const stats = statsMap.get(topic.id)
        const passRate = stats
          ? stats.attemptsCount > 0
            ? stats.passCount / stats.attemptsCount
            : 0.5
          : 0.5
        const skillLevel = stats?.skillLevel ?? 0.5
        const lastAttempt = stats?.lastAttemptAt
        const streak = stats?.streak ?? 0

        for (const question of topic.questions) {
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
                  score: 20, // Low priority for review
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
          const difficultyMatch = Math.abs(question.difficulty - targetDifficulty)
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
          // First unattempted question in topic gets bonus
          const attemptedInTopic = topic.questions.filter((q) =>
            passedQuestionIds.has(q.id)
          ).length
          if (
            attemptedInTopic === 0 &&
            question.orderIndex === 0
          ) {
            score += 25
            reason = "Start new topic"
          }

          // 5. Streak momentum - if on a streak, slightly harder questions
          if (streak >= 3 && question.difficulty > targetDifficulty) {
            score += 20
            reason = "Challenge mode - on a streak!"
          }

          // 6. Lower difficulty if struggling
          if (passRate < 0.4 && question.difficulty > 2) {
            score -= 30
          }
          if (passRate < 0.4 && question.difficulty <= 2) {
            score += 30
            reason = "Easier question for practice"
          }

          // 7. Add some randomness to prevent stale patterns
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

    if (candidates.length === 0) {
      return NextResponse.json({
        questionId: null,
        message: "All questions completed! Great job!",
      })
    }

    // Sort by score (highest first) and pick top candidate
    candidates.sort((a, b) => b.score - a.score)
    const selected = candidates[0]

    // Log selection for analytics
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

    return NextResponse.json({
      questionId: selected.question.id,
      topicId: selected.topic.id,
      topicTitle: selected.topic.title,
      questionTitle: selected.question.title,
      difficulty: selected.question.difficulty,
      reason: selected.reason,
    })
  } catch (error) {
    console.error("Error selecting next question:", error)
    return NextResponse.json(
      { error: "Failed to select next question" },
      { status: 500 }
    )
  }
}
