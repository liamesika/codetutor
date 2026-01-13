import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { studentId } = await params

    const student = await db.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        studentExternalId: true,
        createdAt: true,
        progress: {
          select: {
            xp: true,
            level: true,
            totalSolved: true,
            currentStreak: true,
            bestStreak: true,
            lastActiveDate: true,
          },
        },
        assignmentSubmissions: {
          include: {
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
                  include: {
                    question: {
                      select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        points: true,
                      },
                    },
                  },
                  orderBy: { orderIndex: "asc" },
                },
              },
            },
          },
          orderBy: {
            assignment: {
              week: {
                weekNumber: "asc",
              },
            },
          },
        },
        attempts: {
          where: {
            status: "PASS",
          },
          select: {
            questionId: true,
          },
          distinct: ["questionId"],
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    // Get passed question IDs
    const passedQuestionIds = new Set(student.attempts.map((a) => a.questionId))

    // Process submissions with question-level pass status
    const submissions = student.assignmentSubmissions.map((sub) => {
      const questionsWithStatus = sub.assignment.questions.map((aq) => ({
        questionId: aq.questionId,
        title: aq.question.title,
        difficulty: aq.question.difficulty,
        points: aq.question.points,
        isPassed: passedQuestionIds.has(aq.questionId),
        orderIndex: aq.orderIndex,
      }))

      const passedCount = questionsWithStatus.filter((q) => q.isPassed).length
      const totalCount = questionsWithStatus.length
      const progressPercentage =
        totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0

      return {
        id: sub.id,
        assignmentId: sub.assignmentId,
        status: sub.status,
        grade: sub.grade,
        submittedAt: sub.submittedAt,
        createdAt: sub.createdAt,
        assignment: {
          id: sub.assignment.id,
          title: sub.assignment.title,
          description: sub.assignment.description,
          dueDate: sub.assignment.dueDate,
          semester: sub.assignment.semester,
          week: sub.assignment.week,
        },
        questions: questionsWithStatus,
        progress: {
          passed: passedCount,
          total: totalCount,
          percentage: progressPercentage,
        },
      }
    })

    // Calculate overall stats
    const submittedAssignments = submissions.filter(
      (s) => s.status === "SUBMITTED"
    )
    const gradesWithValues = submittedAssignments.filter(
      (s) => s.grade !== null
    )
    const avgGrade =
      gradesWithValues.length > 0
        ? Math.round(
            gradesWithValues.reduce((sum, s) => sum + (s.grade || 0), 0) /
              gradesWithValues.length
          )
        : null

    // Get all published assignments for completion rate
    const totalAssignments = await db.assignment.count({
      where: { isPublished: true },
    })

    const completionRate =
      totalAssignments > 0
        ? Math.round((submittedAssignments.length / totalAssignments) * 100)
        : 0

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name || "Unknown",
        email: student.email,
        studentExternalId: student.studentExternalId,
        createdAt: student.createdAt,
        progress: student.progress,
      },
      submissions,
      stats: {
        totalAssignments,
        submittedCount: submittedAssignments.length,
        avgGrade,
        completionRate,
        inProgressCount: submissions.filter((s) => s.status === "IN_PROGRESS")
          .length,
        notStartedCount: submissions.filter((s) => s.status === "NOT_STARTED")
          .length,
      },
    })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    )
  }
}
