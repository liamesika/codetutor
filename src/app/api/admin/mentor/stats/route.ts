import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get mentor usage statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get date ranges
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    // Get total mentor messages
    const totalMessages = await db.mentorMessage.count()

    // Get today's messages
    const todayMessages = await db.mentorMessage.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    })

    // Get this week's messages
    const weekMessages = await db.mentorMessage.count({
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    })

    // Get unique users who used mentor
    const uniqueUsers = await db.mentorMessage.groupBy({
      by: ["userId"],
    })

    // Get error category distribution
    const categoryDistribution = await db.mentorMessage.groupBy({
      by: ["errorCategory"],
      _count: {
        errorCategory: true,
      },
      where: {
        errorCategory: {
          not: { equals: undefined },
        },
      },
    })

    // Get average response time
    const avgResponseTime = await db.mentorMessage.aggregate({
      _avg: {
        responseTimeMs: true,
      },
    })

    // Get total tokens used
    const totalTokens = await db.mentorMessage.aggregate({
      _sum: {
        tokensUsed: true,
      },
    })

    // Get average confidence score
    const avgConfidence = await db.mentorMessage.aggregate({
      _avg: {
        confidence: true,
      },
    })

    // Get top questions that triggered mentor
    const topQuestions = await db.mentorMessage.groupBy({
      by: ["questionId"],
      _count: {
        questionId: true,
      },
      orderBy: {
        _count: {
          questionId: "desc",
        },
      },
      take: 5,
      where: {
        questionId: {
          not: { equals: undefined },
        },
      },
    })

    // Get question details for top questions
    const questionDetails = await db.question.findMany({
      where: {
        id: {
          in: topQuestions.map((q) => q.questionId).filter(Boolean) as string[],
        },
      },
      select: {
        id: true,
        title: true,
      },
    })

    const topQuestionsWithDetails = topQuestions.map((q) => ({
      questionId: q.questionId,
      count: q._count.questionId,
      title: questionDetails.find((d) => d.id === q.questionId)?.title || "Unknown",
    }))

    return NextResponse.json({
      totalMessages,
      todayMessages,
      weekMessages,
      uniqueUsers: uniqueUsers.length,
      categoryDistribution: categoryDistribution.map((c) => ({
        category: c.errorCategory,
        count: c._count.errorCategory,
      })),
      averageResponseTimeMs: Math.round(avgResponseTime._avg.responseTimeMs || 0),
      totalTokensUsed: totalTokens._sum.tokensUsed || 0,
      averageConfidence: avgConfidence._avg.confidence
        ? Math.round(avgConfidence._avg.confidence * 100)
        : null,
      topQuestions: topQuestionsWithDetails,
    })
  } catch (error) {
    console.error("Error fetching mentor stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch mentor statistics" },
      { status: 500 }
    )
  }
}
