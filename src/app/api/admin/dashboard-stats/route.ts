import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total students (users with role USER)
    const totalStudentsResult = await db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "User" WHERE role = 'USER'
    `
    const totalStudents = Number(totalStudentsResult[0]?.count ?? 0)

    // Get active assignments (published)
    const activeAssignmentsResult = await db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "Assignment" WHERE "isPublished" = true
    `
    const activeAssignments = Number(activeAssignmentsResult[0]?.count ?? 0)

    // Get submissions this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const submissionsThisWeekResult = await db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "AssignmentSubmission"
      WHERE status = 'SUBMITTED' AND "submittedAt" >= ${oneWeekAgo}
    `
    const submissionsThisWeek = Number(submissionsThisWeekResult[0]?.count ?? 0)

    // Get students at risk (avg grade < 60 or missing submissions)
    const studentsAtRiskResult = await db.$queryRaw<{ count: bigint }[]>`
      WITH student_stats AS (
        SELECT
          u.id,
          AVG(s.grade) as avg_grade,
          COUNT(s.id) FILTER (WHERE s.status = 'SUBMITTED') as submitted,
          (SELECT COUNT(*) FROM "Assignment" WHERE "isPublished" = true) as total_assignments
        FROM "User" u
        LEFT JOIN "AssignmentSubmission" s ON u.id = s."userId"
        WHERE u.role = 'USER'
        GROUP BY u.id
      )
      SELECT COUNT(*) as count FROM student_stats
      WHERE avg_grade < 60 OR avg_grade IS NULL OR submitted < total_assignments
    `
    const studentsAtRisk = Number(studentsAtRiskResult[0]?.count ?? 0)

    // Get overall average grade
    const avgGradeResult = await db.$queryRaw<{ avg: number | null }[]>`
      SELECT AVG(grade)::numeric(10,2) as avg FROM "AssignmentSubmission"
      WHERE grade IS NOT NULL AND status = 'SUBMITTED'
    `
    const avgGradeOverall = avgGradeResult[0]?.avg !== null
      ? Math.round(Number(avgGradeResult[0].avg))
      : null

    // Get recent submissions
    const recentSubmissions = await db.$queryRaw<{
      studentName: string
      assignmentTitle: string
      grade: number | null
      submittedAt: Date
    }[]>`
      SELECT
        u.name as "studentName",
        a.title as "assignmentTitle",
        s.grade,
        s."submittedAt"
      FROM "AssignmentSubmission" s
      JOIN "User" u ON s."userId" = u.id
      JOIN "Assignment" a ON s."assignmentId" = a.id
      WHERE s.status = 'SUBMITTED'
      ORDER BY s."submittedAt" DESC
      LIMIT 5
    `

    // Get upcoming deadlines
    const upcomingDeadlines = await db.$queryRaw<{
      title: string
      dueDate: Date
    }[]>`
      SELECT title, "dueDate"
      FROM "Assignment"
      WHERE "isPublished" = true AND "dueDate" > NOW()
      ORDER BY "dueDate" ASC
      LIMIT 3
    `

    const deadlinesWithDaysLeft = upcomingDeadlines.map((d) => ({
      title: d.title,
      dueDate: d.dueDate.toISOString(),
      daysLeft: Math.ceil((new Date(d.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    }))

    return NextResponse.json({
      totalStudents,
      activeAssignments,
      submissionsThisWeek,
      studentsAtRisk,
      avgGradeOverall,
      recentSubmissions: recentSubmissions.map((s) => ({
        ...s,
        submittedAt: s.submittedAt?.toISOString() ?? null,
      })),
      upcomingDeadlines: deadlinesWithDaysLeft,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
