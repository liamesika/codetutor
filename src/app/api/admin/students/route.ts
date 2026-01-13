import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const semester = searchParams.get("semester") || ""
    const status = searchParams.get("status") || ""
    const gradeMin = searchParams.get("gradeMin") ? parseInt(searchParams.get("gradeMin")!) : null
    const gradeMax = searchParams.get("gradeMax") ? parseInt(searchParams.get("gradeMax")!) : null

    // Get all students (users with role USER)
    const students = await db.user.findMany({
      where: {
        role: "USER",
        OR: search ? [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { studentExternalId: { contains: search, mode: "insensitive" } },
        ] : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        studentExternalId: true,
        createdAt: true,
        assignmentSubmissions: {
          include: {
            assignment: {
              select: {
                id: true,
                title: true,
                semester: true,
                week: {
                  select: {
                    weekNumber: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    // Get all unique semesters
    const semesters = await db.assignment.findMany({
      where: { isPublished: true, semester: { not: null } },
      select: { semester: true },
      distinct: ["semester"],
    })

    // Get total assignment count
    const totalAssignments = await db.assignment.count({
      where: { isPublished: true },
    })

    // Process student data
    const processedStudents = students.map((student) => {
      // Filter submissions by semester if provided
      const relevantSubmissions = semester
        ? student.assignmentSubmissions.filter(
            (s) => s.assignment.semester === semester
          )
        : student.assignmentSubmissions

      const submittedCount = relevantSubmissions.filter(
        (s) => s.status === "SUBMITTED"
      ).length

      const gradesSubmitted = relevantSubmissions.filter(
        (s) => s.status === "SUBMITTED" && s.grade !== null
      )

      const avgGrade =
        gradesSubmitted.length > 0
          ? Math.round(
              gradesSubmitted.reduce((sum, s) => sum + (s.grade || 0), 0) /
                gradesSubmitted.length
            )
          : null

      const lastSubmission = relevantSubmissions
        .filter((s) => s.submittedAt)
        .sort(
          (a, b) =>
            new Date(b.submittedAt!).getTime() -
            new Date(a.submittedAt!).getTime()
        )[0]

      // Calculate risk flag
      // At risk if: avg grade < 60 OR submitted less than 50% of assignments
      const submissionRate = totalAssignments > 0 ? submittedCount / totalAssignments : 0
      const isAtRisk = (avgGrade !== null && avgGrade < 60) || submissionRate < 0.5

      return {
        id: student.id,
        name: student.name || "Unknown",
        email: student.email,
        studentExternalId: student.studentExternalId,
        createdAt: student.createdAt,
        submittedCount,
        totalAssignments: semester
          ? relevantSubmissions.length
          : totalAssignments,
        avgGrade,
        lastSubmission: lastSubmission?.submittedAt || null,
        isAtRisk,
        submissions: relevantSubmissions.map((s) => ({
          assignmentId: s.assignmentId,
          status: s.status,
          grade: s.grade,
          submittedAt: s.submittedAt,
          assignment: s.assignment,
        })),
      }
    })

    // Apply status filter
    let filteredStudents = processedStudents
    if (status === "at_risk") {
      filteredStudents = processedStudents.filter((s) => s.isAtRisk)
    } else if (status === "passing") {
      filteredStudents = processedStudents.filter(
        (s) => s.avgGrade !== null && s.avgGrade >= 60
      )
    } else if (status === "no_submissions") {
      filteredStudents = processedStudents.filter((s) => s.submittedCount === 0)
    }

    // Apply grade range filter
    if (gradeMin !== null || gradeMax !== null) {
      filteredStudents = filteredStudents.filter((s) => {
        if (s.avgGrade === null) return false
        if (gradeMin !== null && s.avgGrade < gradeMin) return false
        if (gradeMax !== null && s.avgGrade > gradeMax) return false
        return true
      })
    }

    // Calculate KPIs
    const kpis = {
      totalStudents: filteredStudents.length,
      avgGradeOverall:
        filteredStudents.filter((s) => s.avgGrade !== null).length > 0
          ? Math.round(
              filteredStudents
                .filter((s) => s.avgGrade !== null)
                .reduce((sum, s) => sum + (s.avgGrade || 0), 0) /
                filteredStudents.filter((s) => s.avgGrade !== null).length
            )
          : null,
      atRiskCount: filteredStudents.filter((s) => s.isAtRisk).length,
      noSubmissionsCount: filteredStudents.filter((s) => s.submittedCount === 0)
        .length,
      totalAssignments,
    }

    return NextResponse.json({
      students: filteredStudents,
      semesters: semesters.map((s) => s.semester).filter(Boolean),
      kpis,
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}
