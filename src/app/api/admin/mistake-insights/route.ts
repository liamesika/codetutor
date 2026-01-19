import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getClassMistakeInsights, getStudentMistakeInsights } from "@/lib/mentor/pedagogical-engine"
import { db } from "@/lib/db"

// GET /api/admin/mistake-insights - Get class-wide mistake analytics
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    // If studentId provided, get specific student's insights
    if (studentId) {
      const student = await db.user.findUnique({
        where: { id: studentId },
        select: { id: true, name: true, email: true },
      })

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 })
      }

      const insights = await getStudentMistakeInsights(studentId)

      return NextResponse.json({
        student,
        insights,
      })
    }

    // Get class-wide insights
    const classInsights = await getClassMistakeInsights()

    // Get additional stats
    const [totalFeedback, studentsWithFeedback, avgMistakesPerStudent] = await Promise.all([
      db.pedagogicalFeedback.count(),
      db.pedagogicalFeedback.groupBy({
        by: ["mistakeLogId"],
        _count: true,
      }).then(results => {
        const uniqueUsers = new Set<string>()
        // We need to get unique users from mistake logs
        return db.mistakeLog.findMany({
          where: {
            pedagogicalFeedback: { isNot: null },
          },
          select: { userId: true },
          distinct: ["userId"],
        }).then(users => users.length)
      }),
      db.mistakeLog.groupBy({
        by: ["userId"],
        _count: { id: true },
      }).then(results => {
        if (results.length === 0) return 0
        const total = results.reduce((sum, r) => sum + r._count.id, 0)
        return Math.round(total / results.length)
      }),
    ])

    return NextResponse.json({
      ...classInsights,
      stats: {
        totalFeedback,
        studentsWithFeedback,
        avgMistakesPerStudent,
      },
    })
  } catch (error) {
    console.error("Admin mistake insights error:", error)
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    )
  }
}
