import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get detailed submission with question-level results
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { submissionId } = await params

    const submission = await db.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        assignment: {
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
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      )
    }

    // Get user's attempts for each question in the assignment
    const questionIds = submission.assignment.questions.map((q) => q.questionId)

    const attempts = await db.attempt.findMany({
      where: {
        userId: submission.userId,
        questionId: { in: questionIds },
      },
      orderBy: { createdAt: "desc" },
      include: {
        testResults: true,
      },
    })

    // Group attempts by question and get latest + best status
    const attemptsByQuestion = new Map<string, typeof attempts>()
    for (const attempt of attempts) {
      const existing = attemptsByQuestion.get(attempt.questionId) || []
      existing.push(attempt)
      attemptsByQuestion.set(attempt.questionId, existing)
    }

    // Build question results
    const questionResults = submission.assignment.questions.map((aq) => {
      const questionAttempts = attemptsByQuestion.get(aq.questionId) || []
      const latestAttempt = questionAttempts[0]
      const hasPassed = questionAttempts.some((a) => a.status === "PASS")

      return {
        question: aq.question,
        orderIndex: aq.orderIndex,
        isPassed: hasPassed,
        attemptCount: questionAttempts.length,
        latestAttempt: latestAttempt
          ? {
              id: latestAttempt.id,
              status: latestAttempt.status,
              code: latestAttempt.code,
              stdout: latestAttempt.stdout,
              stderr: latestAttempt.stderr,
              compileError: latestAttempt.compileError,
              executionMs: latestAttempt.executionMs,
              createdAt: latestAttempt.createdAt,
              testResults: latestAttempt.testResults.map((tr) => ({
                testIndex: tr.testIndex,
                input: tr.input,
                expected: tr.expected,
                actual: tr.actual,
                passed: tr.passed,
                error: tr.error,
              })),
            }
          : null,
      }
    })

    const passedCount = questionResults.filter((q) => q.isPassed).length
    const totalCount = questionResults.length

    return NextResponse.json({
      submission: {
        id: submission.id,
        status: submission.status,
        grade: submission.grade,
        submittedAt: submission.submittedAt,
        createdAt: submission.createdAt,
      },
      user: submission.user,
      assignment: {
        id: submission.assignment.id,
        title: submission.assignment.title,
        week: submission.assignment.week,
      },
      questionResults,
      summary: {
        passed: passedCount,
        total: totalCount,
        percentage: totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching submission details:", error)
    return NextResponse.json(
      { error: "Failed to fetch submission details" },
      { status: 500 }
    )
  }
}
