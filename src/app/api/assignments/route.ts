import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get assignments for a week (student view)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const weekNumber = searchParams.get("weekNumber")

    if (!weekNumber) {
      return NextResponse.json(
        { error: "weekNumber is required" },
        { status: 400 }
      )
    }

    // Get published assignments for this week
    const assignments = await db.assignment.findMany({
      where: {
        isPublished: true,
        week: {
          weekNumber: parseInt(weekNumber),
        },
      },
      orderBy: { createdAt: "asc" },
      include: {
        week: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
          },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
          include: {
            question: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                points: true,
                estimatedMinutes: true,
              },
            },
          },
        },
        submissions: {
          where: { userId: session.user.id },
          select: {
            id: true,
            status: true,
            grade: true,
            submittedAt: true,
          },
        },
      },
    })

    // Get user's pass status for each question
    const questionIds = assignments.flatMap((a) =>
      a.questions.map((q) => q.questionId)
    )

    const passedAttempts = await db.attempt.findMany({
      where: {
        userId: session.user.id,
        questionId: { in: questionIds },
        status: "PASS",
      },
      select: {
        questionId: true,
      },
      distinct: ["questionId"],
    })

    const passedQuestionIds = new Set(passedAttempts.map((a) => a.questionId))

    // Enrich assignments with user progress
    const enrichedAssignments = assignments.map((assignment) => {
      const submission = assignment.submissions[0]
      const questionsWithProgress = assignment.questions.map((aq) => ({
        ...aq,
        isPassed: passedQuestionIds.has(aq.questionId),
      }))
      const passedCount = questionsWithProgress.filter((q) => q.isPassed).length
      const totalCount = assignment.questions.length

      // Determine status
      let status = submission?.status || "NOT_STARTED"
      if (!submission && passedCount > 0) {
        status = "IN_PROGRESS"
      }

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        week: assignment.week,
        questions: questionsWithProgress,
        submission: submission
          ? {
              id: submission.id,
              status: submission.status,
              grade: submission.grade,
              submittedAt: submission.submittedAt,
            }
          : null,
        progress: {
          passed: passedCount,
          total: totalCount,
          percentage: totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0,
        },
        status,
      }
    })

    return NextResponse.json(enrichedAssignments)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    )
  }
}
