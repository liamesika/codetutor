import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getUserEntitlement, TIER_ACCESS } from "@/lib/entitlement"
import type { EntitlementPlan } from "@prisma/client"

// Force dynamic to ensure entitlement is always fresh (no caching)
export const dynamic = "force-dynamic"
export const revalidate = 0

// Generate unique request ID for error tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export async function GET() {
  const requestId = generateRequestId()

  try {
    // Wrap session retrieval in its own try/catch
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (sessionError) {
      console.error(`[COURSES API][${requestId}] Session retrieval failed:`, sessionError)
      // Continue without session - treat as unauthenticated
    }

    // Log session state for debugging
    console.log(`[COURSES API][${requestId}] Session state:`, {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id || "MISSING",
    })

    // Get user's entitlement to determine access (with defensive handling)
    let userPlan: EntitlementPlan = "FREE"
    let userMaxWeek: number = TIER_ACCESS.FREE.maxWeek
    let entitlementDebug: {
      status: string | null
      plan: string | null
      hasAccess: boolean
      expiresAt: string | null
      grantedAt: string | null
    } | null = null

    if (session?.user?.id) {
      try {
        const entitlement = await getUserEntitlement(session.user.id)
        userPlan = entitlement?.plan ?? "FREE"
        userMaxWeek = TIER_ACCESS[userPlan]?.maxWeek ?? TIER_ACCESS.FREE.maxWeek
        entitlementDebug = entitlement
      } catch (entitlementError) {
        console.error(`[COURSES API][${requestId}] Entitlement check failed:`, entitlementError)
        // Continue with FREE tier defaults - don't crash
        userPlan = "FREE"
        userMaxWeek = TIER_ACCESS.FREE.maxWeek
      }
    }

    // Fetch courses with defensive error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let courses: any[] = []
    try {
      courses = await db.course.findMany({
        orderBy: { orderIndex: "asc" },
        include: {
          weeks: {
            orderBy: { weekNumber: "asc" },
            include: {
              topics: {
                orderBy: { orderIndex: "asc" },
                include: {
                  questions: {
                    where: { isActive: true },
                    select: { id: true },
                  },
                  ...(session?.user?.id
                    ? {
                        userStats: {
                          where: { userId: session.user.id },
                          select: {
                            passCount: true,
                            attemptsCount: true,
                          },
                        },
                      }
                    : {}),
                },
              },
            },
          },
          ...(session?.user?.id
            ? {
                enrollments: {
                  where: { userId: session.user.id },
                  select: { id: true },
                },
              }
            : {}),
        },
      })
    } catch (dbError) {
      console.error(`[COURSES API][${requestId}] Database query failed:`, dbError)
      // Return empty courses array with error indication
      return NextResponse.json(
        {
          courses: [],
          error: "Database temporarily unavailable",
          requestId,
        },
        { status: 200 } // Return 200 with empty data, not 500
      )
    }

    // If no courses found, return empty array (not an error)
    if (!courses || courses.length === 0) {
      console.log(`[COURSES API][${requestId}] No courses found in database`)
      return NextResponse.json([])
    }

    // Transform data to include progress (with defensive null checks)
    const coursesWithProgress = courses.map((course) => ({
      id: course.id ?? "",
      name: course.name ?? "Untitled Course",
      slug: course.slug ?? "",
      description: course.description ?? "",
      language: course.language ?? "java",
      isLocked: course.isLocked ?? false,
      isEnrolled: session?.user?.id
        ? ((course as { enrollments?: { id: string }[] }).enrollments?.length ?? 0) > 0
        : false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      weeks: (course.weeks ?? []).map((week: any) => {
        // Dynamic lock logic based on user's plan tier
        const weekNumber = week.weekNumber ?? 1
        const weekIsLocked = weekNumber > userMaxWeek

        return {
          id: week.id ?? "",
          weekNumber,
          title: week.title ?? `Week ${weekNumber}`,
          description: week.description ?? "",
          isLocked: weekIsLocked,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          topics: (week.topics ?? []).map((topic: any) => {
            const totalQuestions = topic.questions?.length ?? 0
            const stats = (topic as { userStats?: { passCount: number }[] }).userStats?.[0]
            const passCount = stats?.passCount ?? 0
            const progress =
              totalQuestions > 0
                ? Math.round((passCount / totalQuestions) * 100)
                : 0

            return {
              id: topic.id ?? "",
              title: topic.title ?? "Untitled Topic",
              slug: topic.slug ?? "",
              description: topic.description ?? "",
              isLocked: weekIsLocked,
              questionCount: totalQuestions,
              progress,
              isCompleted: progress === 100,
            }
          }),
          progress: 0,
        }
      }),
    }))

    // Calculate week progress (with defensive checks)
    coursesWithProgress.forEach((course) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (course.weeks ?? []).forEach((week: any) => {
        if (week.topics && week.topics.length > 0) {
          const avgProgress =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            week.topics.reduce((sum: number, t: any) => sum + (t.progress ?? 0), 0) /
            week.topics.length
          week.progress = Math.round(avgProgress)
        }
      })
    })

    // Build response with debug headers
    const response = NextResponse.json(coursesWithProgress)
    response.headers.set("X-Request-Id", requestId)
    response.headers.set("X-Entitlement-Debug", JSON.stringify({
      userId: session?.user?.id || "anonymous",
      plan: userPlan,
      maxWeek: userMaxWeek === Infinity ? "unlimited" : userMaxWeek,
      status: entitlementDebug?.status || "none",
      weekCount: coursesWithProgress[0]?.weeks?.length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lockedWeeks: coursesWithProgress[0]?.weeks?.filter((w: any) => w.isLocked).length || 0,
    }))

    return response
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error(`[COURSES API][${requestId}] Unexpected error:`, error)

    // Return a safe fallback response (empty courses, not 500)
    return NextResponse.json(
      [],
      {
        status: 200,
        headers: {
          "X-Request-Id": requestId,
          "X-Error": "unexpected_error",
        }
      }
    )
  }
}
