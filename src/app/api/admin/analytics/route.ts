import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") || "7d"

    // Calculate date range
    const now = new Date()
    let startDate: Date
    switch (range) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Overview stats
    const totalUsers = await db.user.count()

    const newUsersThisWeek = await db.user.count({
      where: { createdAt: { gte: weekAgo } },
    })

    const activeUsersToday = await db.attempt.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: today } },
    })

    const activeUsersThisWeek = await db.attempt.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: weekAgo } },
    })

    const totalAttempts = await db.attempt.count()

    const attemptsThisWeek = await db.attempt.count({
      where: { createdAt: { gte: weekAgo } },
    })

    const passedAttempts = await db.attempt.count({
      where: { status: "PASS" },
    })

    const overallPassRate = totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0

    // Topic performance
    const topics = await db.topic.findMany({
      include: {
        week: { select: { weekNumber: true } },
        questions: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    })

    const topicPerformance = await Promise.all(
      topics.map(async (topic) => {
        const questionIds = topic.questions.map((q) => q.id)

        if (questionIds.length === 0) {
          return {
            topicId: topic.id,
            topicTitle: topic.title,
            weekNumber: topic.week.weekNumber,
            totalAttempts: 0,
            passRate: 0,
            avgHintsUsed: 0,
            avgTimeMs: 0,
          }
        }

        const attempts = await db.attempt.findMany({
          where: {
            questionId: { in: questionIds },
            createdAt: { gte: startDate },
          },
          select: {
            status: true,
            hintsUsed: true,
            executionMs: true,
          },
        })

        const totalAttempts = attempts.length
        const passed = attempts.filter((a) => a.status === "PASS").length
        const passRate = totalAttempts > 0
          ? Math.round((passed / totalAttempts) * 100)
          : 0
        const avgHintsUsed = totalAttempts > 0
          ? attempts.reduce((sum, a) => sum + a.hintsUsed, 0) / totalAttempts
          : 0
        const validTimes = attempts.filter((a) => a.executionMs !== null)
        const avgTimeMs = validTimes.length > 0
          ? validTimes.reduce((sum, a) => sum + (a.executionMs || 0), 0) / validTimes.length
          : 0

        return {
          topicId: topic.id,
          topicTitle: topic.title,
          weekNumber: topic.week.weekNumber,
          totalAttempts,
          passRate,
          avgHintsUsed,
          avgTimeMs,
        }
      })
    )

    // Sort by week number
    topicPerformance.sort((a, b) => a.weekNumber - b.weekNumber)

    // Question performance (top 50 by attempts)
    const questionStats = await db.attempt.groupBy({
      by: ["questionId"],
      _count: { id: true },
      _avg: { hintsUsed: true },
      where: { createdAt: { gte: startDate } },
      orderBy: { _count: { id: "desc" } },
      take: 50,
    })

    const questionIds = questionStats.map((q) => q.questionId)
    const questions = await db.question.findMany({
      where: { id: { in: questionIds } },
      include: { topic: { select: { title: true } } },
    })
    const questionMap = new Map(questions.map((q) => [q.id, q]))

    const passedByQuestion = await db.attempt.groupBy({
      by: ["questionId"],
      _count: { id: true },
      where: {
        questionId: { in: questionIds },
        status: "PASS",
        createdAt: { gte: startDate },
      },
    })
    const passedMap = new Map(passedByQuestion.map((p) => [p.questionId, p._count.id]))

    const questionPerformance = questionStats.map((stat) => {
      const question = questionMap.get(stat.questionId)
      const passed = passedMap.get(stat.questionId) || 0
      return {
        questionId: stat.questionId,
        questionTitle: question?.title || "Unknown",
        topicTitle: question?.topic.title || "Unknown",
        difficulty: question?.difficulty || 1,
        attempts: stat._count.id,
        passRate: stat._count.id > 0
          ? Math.round((passed / stat._count.id) * 100)
          : 0,
        avgHints: stat._avg.hintsUsed || 0,
      }
    })

    // User leaderboard
    const userStats = await db.attempt.groupBy({
      by: ["userId"],
      _count: { id: true },
      _sum: { pointsEarned: true },
      where: { status: "PASS" },
      orderBy: { _sum: { pointsEarned: "desc" } },
      take: 20,
    })

    const userIds = userStats.map((u) => u.userId)
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    })
    const userMap = new Map(users.map((u) => [u.id, u]))

    // Get total attempts per user for pass rate
    const totalAttemptsByUser = await db.attempt.groupBy({
      by: ["userId"],
      _count: { id: true },
      where: { userId: { in: userIds } },
    })
    const totalAttemptsMap = new Map(
      totalAttemptsByUser.map((u) => [u.userId, u._count.id])
    )

    // Get current streaks
    const topicStatsForUsers = await db.userTopicStats.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, streak: true },
    })
    const streakMap = new Map<string, number>()
    topicStatsForUsers.forEach((stat) => {
      const current = streakMap.get(stat.userId) || 0
      if (stat.streak > current) {
        streakMap.set(stat.userId, stat.streak)
      }
    })

    const userLeaderboard = userStats.map((stat) => {
      const user = userMap.get(stat.userId)
      const totalUserAttempts = totalAttemptsMap.get(stat.userId) || 0
      return {
        userId: stat.userId,
        userName: user?.name || null,
        email: user?.email || "",
        totalPoints: stat._sum.pointsEarned || 0,
        questionsCompleted: stat._count.id,
        passRate: totalUserAttempts > 0
          ? Math.round((stat._count.id / totalUserAttempts) * 100)
          : 0,
        streak: streakMap.get(stat.userId) || 0,
      }
    })

    // Error breakdown
    const statusCounts = await db.attempt.groupBy({
      by: ["status"],
      _count: { id: true },
      where: { createdAt: { gte: startDate } },
    })

    const totalInRange = statusCounts.reduce((sum, s) => sum + s._count.id, 0)
    const errorBreakdown = statusCounts.map((s) => ({
      status: s.status,
      count: s._count.id,
      percentage: totalInRange > 0
        ? Math.round((s._count.id / totalInRange) * 100)
        : 0,
    }))

    // Sort by count descending
    errorBreakdown.sort((a, b) => b.count - a.count)

    // Daily activity (simplified - just counts per day)
    const dailyActivity: { date: string; attempts: number; passes: number; users: number }[] = []

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsersThisWeek,
        activeUsersToday: activeUsersToday.length,
        activeUsersThisWeek: activeUsersThisWeek.length,
        totalAttempts,
        attemptsThisWeek,
        overallPassRate,
        avgSessionDuration: 0, // Would need session tracking
      },
      dailyActivity,
      topicPerformance,
      questionPerformance,
      userLeaderboard,
      errorBreakdown,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
