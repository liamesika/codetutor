import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get counts in parallel
    const [totalCourses, totalWeeks, totalTopics] = await Promise.all([
      db.course.count(),
      db.week.count(),
      db.topic.count(),
    ])

    // Get total users
    const totalUsers = await db.user.count()

    // Get active users today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const activeToday = await db.attempt.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: today },
      },
    })

    // Get total questions
    const totalQuestions = await db.question.count({
      where: { isActive: true },
    })

    // Get total attempts
    const totalAttempts = await db.attempt.count()

    // Calculate pass rate
    const passedAttempts = await db.attempt.count({
      where: { status: "PASS" },
    })
    const passRate = totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0

    // Avg attempts per question
    const avgAttemptsPerQuestion = totalQuestions > 0
      ? totalAttempts / totalQuestions
      : 0

    // Get hardest questions (lowest pass rate with at least 5 attempts)
    const questionStats = await db.attempt.groupBy({
      by: ["questionId"],
      _count: { id: true },
      where: {
        status: { not: undefined },
      },
    })

    const passedStats = await db.attempt.groupBy({
      by: ["questionId"],
      _count: { id: true },
      where: {
        status: "PASS",
      },
    })

    const passedMap = new Map(passedStats.map((s) => [s.questionId, s._count.id]))

    const hardestQuestionIds = questionStats
      .filter((s) => s._count.id >= 3) // At least 3 attempts
      .map((s) => ({
        questionId: s.questionId,
        attempts: s._count.id,
        passed: passedMap.get(s.questionId) || 0,
        passRate: Math.round(((passedMap.get(s.questionId) || 0) / s._count.id) * 100),
      }))
      .sort((a, b) => a.passRate - b.passRate)
      .slice(0, 5)

    // Get question titles
    const questionDetails = await db.question.findMany({
      where: { id: { in: hardestQuestionIds.map((q) => q.questionId) } },
      select: { id: true, title: true },
    })
    const questionTitleMap = new Map(questionDetails.map((q) => [q.id, q.title]))

    const hardestQuestions = hardestQuestionIds.map((q) => ({
      id: q.questionId,
      title: questionTitleMap.get(q.questionId) || "Unknown",
      passRate: q.passRate,
      attempts: q.attempts,
    }))

    // Get recent activity
    const recentEvents = await db.eventLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    const recentActivity = recentEvents.map((event) => {
      let message = ""
      switch (event.eventType) {
        case "USER_REGISTERED":
          message = "New user registered"
          break
        case "CODE_CHECK":
          message = "Code submission checked"
          break
        case "SOLUTION_REVEALED":
          message = "Solution revealed"
          break
        case "ADAPTIVE_SELECTION":
          message = "Adaptive question selected"
          break
        default:
          message = event.eventType
      }

      return {
        type: event.eventType,
        message,
        timestamp: formatDistanceToNow(event.createdAt, { addSuffix: true }),
      }
    })

    // Get recent attempts for activity feed
    const recentAttempts = await db.attempt.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          select: { email: true, name: true },
        },
        question: {
          select: { title: true },
        },
      },
    })

    return NextResponse.json({
      totalCourses,
      totalWeeks,
      totalTopics,
      totalUsers,
      activeToday: activeToday.length,
      totalQuestions,
      totalAttempts,
      passRate,
      avgAttemptsPerQuestion,
      hardestQuestions,
      recentActivity,
      recentAttempts: recentAttempts.map((a) => ({
        id: a.id,
        user: a.user.name || a.user.email || "Unknown",
        question: a.question.title,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
