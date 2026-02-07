import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { canAccessWeek } from "@/lib/subscription"

// GET - Get single assignment details for student
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { assignmentId } = await params

    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId, isPublished: true },
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
                type: true,
                prompt: true,
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

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      )
    }

    // Entitlement check - verify user can access this assignment's week
    const access = await canAccessWeek(session.user.id, assignment.week.weekNumber)
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason || "Content locked", weekNumber: assignment.week.weekNumber },
        { status: 403 }
      )
    }

    // Get user's pass status for each question
    const questionIds = assignment.questions.map((q) => q.questionId)

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

    const questionsWithProgress = assignment.questions.map((aq) => ({
      ...aq,
      isPassed: passedQuestionIds.has(aq.questionId),
    }))

    const passedCount = questionsWithProgress.filter((q) => q.isPassed).length
    const totalCount = assignment.questions.length
    const submission = assignment.submissions[0]

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error fetching assignment:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignment" },
      { status: 500 }
    )
  }
}
