import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST - Submit assignment and calculate grade
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { assignmentId } = await params
    const userId = session.user.id

    // Get assignment with questions
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId, isPublished: true },
      include: {
        questions: {
          select: {
            questionId: true,
          },
        },
        submissions: {
          where: { userId },
        },
      },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      )
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions[0]
    if (existingSubmission?.status === "SUBMITTED") {
      return NextResponse.json(
        { error: "Assignment already submitted", submission: existingSubmission },
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

    const passedCount = passedAttempts.length
    const totalCount = questionIds.length

    // Calculate grade: (passed / total) * 100, rounded
    const grade = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0

    // Create or update submission
    const submission = await db.assignmentSubmission.upsert({
      where: {
        assignmentId_userId: {
          assignmentId,
          userId,
        },
      },
      create: {
        assignmentId,
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
      },
    })
  } catch (error) {
    console.error("Error submitting assignment:", error)
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    )
  }
}
