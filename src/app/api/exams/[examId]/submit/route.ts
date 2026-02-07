import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { canAccessWeek } from "@/lib/subscription"

// POST - Submit exam and calculate grade
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { examId } = await params
    const userId = session.user.id

    // Get exam assignment with questions
    const assignment = await db.assignment.findUnique({
      where: { id: examId, isPublished: true },
      include: {
        week: {
          select: { weekNumber: true },
        },
        questions: {
          select: {
            questionId: true,
            question: {
              select: { id: true, title: true },
            },
          },
        },
        submissions: {
          where: { userId },
        },
      },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      )
    }

    // Entitlement check - verify user can access this exam's week
    const access = await canAccessWeek(userId, assignment.week.weekNumber)
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason || "Content locked", weekNumber: assignment.week.weekNumber },
        { status: 403 }
      )
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions[0]
    if (existingSubmission?.status === "SUBMITTED") {
      return NextResponse.json(
        { error: "Exam already submitted", submission: existingSubmission },
        { status: 400 }
      )
    }

    // Get passed questions for this user
    const questionIds = assignment.questions.map((q) => q.questionId)
    const passedAttempts = await db.attempt.findMany({
      where: {
        userId,
        questionId: { in: questionIds },
        status: "PASS",
      },
      select: {
        questionId: true,
      },
      distinct: ["questionId"],
    })

    const passedQuestionIds = new Set(passedAttempts.map((a) => a.questionId))
    const passedCount = passedQuestionIds.size
    const totalCount = questionIds.length

    // Calculate grade
    const grade = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0

    // Create or update submission
    const submission = await db.assignmentSubmission.upsert({
      where: {
        assignmentId_userId: {
          assignmentId: examId,
          userId,
        },
      },
      create: {
        assignmentId: examId,
        userId,
        status: "SUBMITTED",
        submittedAt: new Date(),
        grade,
      },
      update: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        grade,
      },
    })

    // Build per-question results
    const questionResults = assignment.questions.map((q) => ({
      questionId: q.questionId,
      title: q.question.title,
      passed: passedQuestionIds.has(q.questionId),
    }))

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        status: submission.status,
        grade: submission.grade,
        submittedAt: submission.submittedAt,
      },
      details: {
        passedQuestions: passedCount,
        totalQuestions: totalCount,
        questionResults,
      },
    })
  } catch (error) {
    console.error("Error submitting exam:", error)
    return NextResponse.json(
      { error: "Failed to submit exam" },
      { status: 500 }
    )
  }
}
