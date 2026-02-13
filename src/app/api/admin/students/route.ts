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
    const status = searchParams.get("status") || ""

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
        progress: {
          select: {
            totalSolved: true,
            xp: true,
            level: true,
            lastActiveDate: true,
          },
        },
        entitlement: {
          select: {
            plan: true,
          },
        },
        attempts: {
          select: {
            id: true,
            questionId: true,
            status: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    // Process student data
    const processedStudents = students.map((student) => {
      const totalAttempts = student.attempts.length
      const passedQuestionIds = new Set(
        student.attempts
          .filter((a) => a.status === "PASS")
          .map((a) => a.questionId)
      )
      const questionsSolved = passedQuestionIds.size
      const lastActive = student.progress?.lastActiveDate || null
      const plan = student.entitlement?.plan || null

      // At risk if: no attempts at all
      const isNoActivity = totalAttempts === 0

      return {
        id: student.id,
        name: student.name || "Unknown",
        email: student.email,
        studentExternalId: student.studentExternalId,
        createdAt: student.createdAt,
        questionsSolved,
        totalAttempts,
        lastActive,
        plan,
        xp: student.progress?.xp || 0,
        level: student.progress?.level || 1,
        isNoActivity,
      }
    })

    // Apply status filter
    let filteredStudents = processedStudents
    if (status === "active") {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      filteredStudents = processedStudents.filter(
        (s) => s.lastActive && new Date(s.lastActive) > oneDayAgo
      )
    } else if (status === "no_activity") {
      filteredStudents = processedStudents.filter((s) => s.isNoActivity)
    }

    // Calculate KPIs
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const kpis = {
      totalStudents: filteredStudents.length,
      activeToday: filteredStudents.filter(
        (s) => s.lastActive && new Date(s.lastActive) > oneDayAgo
      ).length,
      totalQuestionsSolved: filteredStudents.reduce(
        (sum, s) => sum + s.questionsSolved, 0
      ),
      noActivityCount: filteredStudents.filter((s) => s.isNoActivity).length,
    }

    return NextResponse.json({
      students: filteredStudents,
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
