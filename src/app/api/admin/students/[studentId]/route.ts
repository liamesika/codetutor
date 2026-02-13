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

    // Fetch student with progress, entitlement, all attempts, and recent activity
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
        entitlement: {
          select: {
            plan: true,
            status: true,
          },
        },
        attempts: {
          select: {
            id: true,
            questionId: true,
            status: true,
            hintsUsed: true,
            pointsEarned: true,
            createdAt: true,
            question: {
              select: {
                title: true,
                difficulty: true,
                slug: true,
                topic: {
                  select: {
                    title: true,
                    slug: true,
                    week: {
                      select: {
                        weekNumber: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          select: {
            id: true,
            activityType: true,
            metadata: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    // Get all weeks with their topics and question counts for the marathon course
    const marathonCourse = await db.course.findUnique({
      where: { slug: "cs-exam-marathon" },
      select: {
        weeks: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
            topics: {
              select: {
                id: true,
                title: true,
                questions: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
          orderBy: { weekNumber: "asc" },
        },
      },
    })

    // Build set of passed question IDs
    const passedQuestionIds = new Set(
      student.attempts
        .filter((a) => a.status === "PASS")
        .map((a) => a.questionId)
    )

    // Build day progress grid
    const dayProgress = (marathonCourse?.weeks || []).map((week) => {
      const questionIds = week.topics.flatMap((t) =>
        t.questions.map((q) => q.id)
      )
      const totalQuestions = questionIds.length
      const solvedQuestions = questionIds.filter((id) =>
        passedQuestionIds.has(id)
      ).length
      const percentage =
        totalQuestions > 0
          ? Math.round((solvedQuestions / totalQuestions) * 100)
          : 0

      return {
        dayNumber: week.weekNumber,
        dayTitle: week.title,
        totalQuestions,
        solvedQuestions,
        percentage,
      }
    })

    // Group attempts by day (weekNumber) → question
    const attemptsByDayMap = new Map<
      number,
      {
        dayNumber: number
        dayTitle: string
        questions: Map<
          string,
          {
            questionId: string
            questionTitle: string
            questionSlug: string
            topicTitle: string
            difficulty: number
            attempts: {
              id: string
              status: string
              hintsUsed: number
              pointsEarned: number
              createdAt: Date
            }[]
            bestStatus: string
            totalAttempts: number
            attemptsToPass: number | null
            lastAttemptAt: Date
          }
        >
      }
    >()

    for (const attempt of student.attempts) {
      const weekNum = attempt.question.topic.week.weekNumber
      const weekTitle = attempt.question.topic.week.title

      if (!attemptsByDayMap.has(weekNum)) {
        attemptsByDayMap.set(weekNum, {
          dayNumber: weekNum,
          dayTitle: weekTitle,
          questions: new Map(),
        })
      }

      const dayGroup = attemptsByDayMap.get(weekNum)!
      const qId = attempt.questionId

      if (!dayGroup.questions.has(qId)) {
        dayGroup.questions.set(qId, {
          questionId: qId,
          questionTitle: attempt.question.title,
          questionSlug: attempt.question.slug,
          topicTitle: attempt.question.topic.title,
          difficulty: attempt.question.difficulty,
          attempts: [],
          bestStatus: "FAIL",
          totalAttempts: 0,
          attemptsToPass: null as number | null,
          lastAttemptAt: attempt.createdAt,
        })
      }

      const questionGroup = dayGroup.questions.get(qId)!
      questionGroup.attempts.push({
        id: attempt.id,
        status: attempt.status,
        hintsUsed: attempt.hintsUsed,
        pointsEarned: attempt.pointsEarned,
        createdAt: attempt.createdAt,
      })
      questionGroup.totalAttempts++
      if (attempt.status === "PASS") {
        questionGroup.bestStatus = "PASS"
      }
      // Since attempts are ordered desc, the first one is the latest
      if (attempt.createdAt > questionGroup.lastAttemptAt) {
        questionGroup.lastAttemptAt = attempt.createdAt
      }
    }

    // Compute attemptsToPass for each question
    for (const [, day] of attemptsByDayMap) {
      for (const [, q] of day.questions) {
        if (q.bestStatus === "PASS") {
          // Attempts are in desc order, reverse to find first PASS chronologically
          const chronological = [...q.attempts].reverse()
          const firstPassIdx = chronological.findIndex((a) => a.status === "PASS")
          q.attemptsToPass = firstPassIdx + 1
        }
      }
    }

    // Convert to serializable array
    const attemptsByDay = Array.from(attemptsByDayMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([, day]) => ({
        dayNumber: day.dayNumber,
        dayTitle: day.dayTitle,
        questions: Array.from(day.questions.values()).map((q) => ({
          ...q,
          // Only send last 5 attempts per question to keep payload small
          attempts: q.attempts.slice(0, 5),
        })),
      }))

    // Overall stats
    const totalQuestionsSolved = passedQuestionIds.size
    const totalQuestionsAvailable = (marathonCourse?.weeks || []).reduce(
      (sum, w) =>
        sum + w.topics.reduce((s, t) => s + t.questions.length, 0),
      0
    )

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name || "Unknown",
        email: student.email,
        studentExternalId: student.studentExternalId,
        createdAt: student.createdAt,
        progress: student.progress,
        plan: student.entitlement?.plan || null,
      },
      dayProgress,
      attemptsByDay,
      recentActivity: student.activities,
      stats: {
        totalQuestionsSolved,
        totalQuestionsAvailable,
        totalAttempts: student.attempts.length,
        completionPercentage:
          totalQuestionsAvailable > 0
            ? Math.round(
                (totalQuestionsSolved / totalQuestionsAvailable) * 100
              )
            : 0,
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
