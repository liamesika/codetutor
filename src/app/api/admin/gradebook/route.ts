import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get gradebook data (all submissions with student info)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const assignmentId = searchParams.get("assignmentId")
    const weekNumber = searchParams.get("weekNumber")

    // Build the where clause for assignments
    const assignmentWhere: Record<string, unknown> = { isPublished: true }
    if (weekNumber) {
      assignmentWhere.week = { weekNumber: parseInt(weekNumber) }
    }

    // Get all published assignments with their submissions
    const assignments = await db.assignment.findMany({
      where: assignmentId ? { id: assignmentId } : assignmentWhere,
      orderBy: [
        { week: { weekNumber: "asc" } },
        { createdAt: "asc" },
      ],
      include: {
        week: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
          },
        },
        questions: {
          select: {
            questionId: true,
          },
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // Get all students (non-admin users)
    const students = await db.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        email: true,
        name: true,
      },
      orderBy: { email: "asc" },
    })

    // Build gradebook matrix: for each assignment, show all students with their status/grade
    const gradebook = assignments.map((assignment) => {
      const studentGrades = students.map((student) => {
        const submission = assignment.submissions.find(
          (s) => s.userId === student.id
        )
        return {
          student,
          status: submission?.status || "NOT_STARTED",
          grade: submission?.grade,
          submittedAt: submission?.submittedAt,
          submissionId: submission?.id,
        }
      })

      return {
        assignment: {
          id: assignment.id,
          title: assignment.title,
          weekNumber: assignment.week.weekNumber,
          weekTitle: assignment.week.title,
          dueDate: assignment.dueDate,
          questionCount: assignment.questions.length,
        },
        grades: studentGrades,
        stats: {
          totalStudents: students.length,
          submitted: studentGrades.filter((g) => g.status === "SUBMITTED").length,
          inProgress: studentGrades.filter((g) => g.status === "IN_PROGRESS").length,
          notStarted: studentGrades.filter((g) => g.status === "NOT_STARTED").length,
          averageGrade: calculateAverageGrade(studentGrades),
        },
      }
    })

    return NextResponse.json({
      gradebook,
      students,
      totalAssignments: assignments.length,
    })
  } catch (error) {
    console.error("Error fetching gradebook:", error)
    return NextResponse.json(
      { error: "Failed to fetch gradebook" },
      { status: 500 }
    )
  }
}

function calculateAverageGrade(
  grades: { grade: number | null | undefined }[]
): number | null {
  const submittedGrades = grades.filter(
    (g) => g.grade !== null && g.grade !== undefined
  )
  if (submittedGrades.length === 0) return null
  const sum = submittedGrades.reduce((acc, g) => acc + (g.grade || 0), 0)
  return Math.round(sum / submittedGrades.length)
}
