import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params
    const session = await getServerSession(authOptions)

    const topic = await db.topic.findUnique({
      where: { id: topicId },
      include: {
        week: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
          },
        },
        lessons: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        questions: {
          where: { isActive: true },
          orderBy: [{ difficulty: "asc" }, { orderIndex: "asc" }],
          select: {
            id: true,
            title: true,
            type: true,
            difficulty: true,
            estimatedMinutes: true,
            points: true,
          },
        },
      },
    })

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      )
    }

    // Get user's attempts if logged in
    let passedQuestionIds = new Set<string>()
    let attemptCounts = new Map<string, number>()
    let earnedPoints = 0

    if (session?.user?.id) {
      const userId = session.user.id

      // Get passed questions
      const passedAttempts = await db.attempt.findMany({
        where: {
          userId,
          questionId: { in: topic.questions.map((q) => q.id) },
          status: "PASS",
        },
        select: { questionId: true, pointsEarned: true },
      })

      passedQuestionIds = new Set(passedAttempts.map((a) => a.questionId))
      earnedPoints = passedAttempts.reduce((sum, a) => sum + a.pointsEarned, 0)

      // Get attempt counts
      const attempts = await db.attempt.groupBy({
        by: ["questionId"],
        where: {
          userId,
          questionId: { in: topic.questions.map((q) => q.id) },
        },
        _count: true,
      })

      attempts.forEach((a) => {
        attemptCounts.set(a.questionId, a._count)
      })
    }

    // Calculate stats
    const totalQuestions = topic.questions.length
    const passedQuestions = passedQuestionIds.size
    const progress = totalQuestions > 0
      ? Math.round((passedQuestions / totalQuestions) * 100)
      : 0
    const totalPoints = topic.questions.reduce((sum, q) => sum + q.points, 0)

    return NextResponse.json({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      introMarkdown: topic.introMarkdown,
      week: topic.week,
      lessons: topic.lessons,
      questions: topic.questions.map((q) => ({
        ...q,
        isPassed: passedQuestionIds.has(q.id),
        attemptCount: attemptCounts.get(q.id) || 0,
      })),
      stats: {
        totalQuestions,
        passedQuestions,
        progress,
        totalPoints,
        earnedPoints,
      },
    })
  } catch (error) {
    console.error("Error fetching topic:", error)
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    )
  }
}
