import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Debug endpoint for adaptive learning algorithm
// Shows topic mastery, selection reasoning, and weights
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const targetUserId = searchParams.get("userId") || session.user.id
    const courseSlug = searchParams.get("course") || "java-weeks-1-5"
    const limit = parseInt(searchParams.get("limit") || "10")

    // Get user info
    const user = await db.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all topic stats for user
    const topicStats = await db.userTopicStats.findMany({
      where: { userId: targetUserId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
            week: {
              select: { weekNumber: true, title: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Get recent attempts
    const recentAttempts = await db.attempt.findMany({
      where: { userId: targetUserId },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            topic: {
              select: { title: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    // Get recent adaptive selection events
    const selectionEvents = await db.eventLog.findMany({
      where: {
        userId: targetUserId,
        eventType: "ADAPTIVE_SELECTION",
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    // Get course with questions for analysis
    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        weeks: {
          orderBy: { orderIndex: "asc" },
          include: {
            topics: {
              orderBy: { orderIndex: "asc" },
              include: {
                questions: {
                  where: { isActive: true },
                  select: { id: true, difficulty: true },
                },
              },
            },
          },
        },
      },
    })

    // Calculate mastery scores per topic
    const masteryScores = topicStats.map((stat) => {
      const passRate = stat.attemptsCount > 0
        ? stat.passCount / stat.attemptsCount
        : 0
      const mastery = Math.round(
        (stat.skillLevel * 0.4 + passRate * 0.4 + Math.min(stat.streak / 5, 1) * 0.2) * 100
      )

      return {
        topicId: stat.topicId,
        topicTitle: stat.topic.title,
        weekNumber: stat.topic.week.weekNumber,
        weekTitle: stat.topic.week.title,
        skillLevel: Math.round(stat.skillLevel * 100),
        passRate: Math.round(passRate * 100),
        streak: stat.streak,
        bestStreak: stat.bestStreak,
        attemptsCount: stat.attemptsCount,
        passCount: stat.passCount,
        failCount: stat.failCount,
        avgHintsUsed: Math.round(stat.avgHintsUsed * 10) / 10,
        totalPoints: stat.totalPoints,
        masteryScore: mastery,
        lastAttemptAt: stat.lastAttemptAt,
        status: mastery >= 80 ? "mastered" : mastery >= 50 ? "learning" : "needs-work",
      }
    })

    // Sort by week and topic order
    masteryScores.sort((a, b) => {
      if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber
      return a.topicTitle.localeCompare(b.topicTitle)
    })

    // Format selection events with reasoning
    const selectionHistory = selectionEvents.map((event) => {
      const payload = event.payload as {
        selectedQuestionId: string
        reason: string
        score: number
        candidatesCount: number
      }
      return {
        timestamp: event.createdAt,
        questionId: payload.selectedQuestionId,
        reason: payload.reason,
        score: Math.round(payload.score),
        candidatesCount: payload.candidatesCount,
      }
    })

    // Calculate overall stats
    const totalAttempts = recentAttempts.length
    const passedAttempts = recentAttempts.filter((a) => a.status === "PASS").length
    const overallPassRate = totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0

    // Analyze attempt patterns
    const attemptsByDifficulty = [1, 2, 3, 4, 5].map((diff) => {
      const attempts = recentAttempts.filter((a) => a.question.difficulty === diff)
      const passed = attempts.filter((a) => a.status === "PASS").length
      return {
        difficulty: diff,
        attempts: attempts.length,
        passed,
        passRate: attempts.length > 0 ? Math.round((passed / attempts.length) * 100) : 0,
      }
    })

    // Get question completion stats
    let totalQuestions = 0
    let passedQuestions = 0

    if (course) {
      for (const week of course.weeks) {
        for (const topic of week.topics) {
          totalQuestions += topic.questions.length
        }
      }
    }

    const passedQuestionIds = new Set(
      recentAttempts.filter((a) => a.status === "PASS").map((a) => a.questionId)
    )
    passedQuestions = passedQuestionIds.size

    // Algorithm weight explanation
    const algorithmWeights = {
      description: "Adaptive algorithm selects questions based on weighted scoring:",
      weights: [
        { name: "Base score", value: 100, description: "Starting score for all unattempted questions" },
        { name: "Weak topic bonus", value: "+50", condition: "passRate < 60%", description: "Prioritize topics where student is struggling" },
        { name: "Optimal difficulty", value: "+30", condition: "difficulty matches skill level", description: "Questions at the right challenge level" },
        { name: "Close difficulty", value: "+15", condition: "difficulty within ±1 of skill level", description: "Questions slightly above/below skill" },
        { name: "Recently failed retry", value: "+40", condition: "failed in last 24 hours", description: "Give another chance at recent failures" },
        { name: "New topic start", value: "+25", condition: "first question in unattempted topic", description: "Introduce new concepts" },
        { name: "Challenge mode", value: "+20", condition: "streak >= 3 and harder question", description: "Increase difficulty when on a roll" },
        { name: "Struggle mode", value: "+30", condition: "passRate < 40% and difficulty <= 2", description: "Easier questions when really struggling" },
        { name: "Spaced repetition", value: "20", condition: "passed 7+ days ago, 20% chance", description: "Occasionally review mastered content" },
        { name: "Random factor", value: "+0-20", condition: "always", description: "Prevents predictable patterns" },
      ],
    }

    // Recent attempts formatted
    const formattedAttempts = recentAttempts.slice(0, 10).map((attempt) => ({
      id: attempt.id,
      questionTitle: attempt.question.title,
      topicTitle: attempt.question.topic.title,
      difficulty: attempt.question.difficulty,
      status: attempt.status,
      hintsUsed: attempt.hintsUsed,
      pointsEarned: attempt.pointsEarned,
      executionMs: attempt.executionMs,
      createdAt: attempt.createdAt,
    }))

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      overview: {
        totalTopicsWithActivity: masteryScores.length,
        totalQuestions,
        passedQuestions,
        completionRate: totalQuestions > 0
          ? Math.round((passedQuestions / totalQuestions) * 100)
          : 0,
        overallPassRate,
        recentAttemptsCount: totalAttempts,
      },
      masteryScores,
      attemptsByDifficulty,
      recentAttempts: formattedAttempts,
      selectionHistory,
      algorithmWeights,
    })
  } catch (error) {
    console.error("Error fetching adaptive debug info:", error)
    return NextResponse.json(
      { error: "Failed to fetch debug info" },
      { status: 500 }
    )
  }
}
