import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getUserEntitlement, FREE_ACCESS } from "@/lib/entitlement"

// Force dynamic to ensure entitlement is always fresh (no caching)
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // CRITICAL DEBUG: Log session state for troubleshooting auth issues
    console.log("[COURSES API] Session state:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id || "MISSING",
      email: session?.user?.email || "MISSING",
      sessionKeys: session ? Object.keys(session) : [],
      userKeys: session?.user ? Object.keys(session.user) : [],
    })

    // Get user's entitlement to determine access
    let userHasAccess = false
    let entitlementDebug: {
      status: string | null
      plan: string | null
      hasAccess: boolean
      expiresAt: string | null
      grantedAt: string | null
    } | null = null

    if (session?.user?.id) {
      const entitlement = await getUserEntitlement(session.user.id)
      userHasAccess = entitlement.hasAccess
      entitlementDebug = entitlement

      // Debug logging for entitlement issues
      console.log("[COURSES API] User entitlement check:", {
        userId: session.user.id,
        email: session.user.email,
        entitlement,
        userHasAccess,
      })
    } else {
      // Log why we're treating user as anonymous
      console.log("[COURSES API] No authenticated user - treating as anonymous:", {
        sessionExists: !!session,
        userExists: !!session?.user,
        userIdExists: !!session?.user?.id,
      })
    }

    const courses = await db.course.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        weeks: {
          orderBy: { weekNumber: "asc" },
          include: {
            topics: {
              orderBy: { orderIndex: "asc" },
              include: {
                questions: {
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

    // Transform data to include progress
    // IMPORTANT: Compute isLocked dynamically based on entitlement
    const coursesWithProgress = courses.map((course) => ({
      id: course.id,
      name: course.name,
      slug: course.slug,
      description: course.description,
      language: course.language,
      isLocked: course.isLocked,
      isEnrolled: session?.user?.id
        ? ((course as { enrollments?: { id: string }[] }).enrollments?.length ?? 0) > 0
        : false,
      weeks: course.weeks.map((week) => {
        // Dynamic lock logic:
        // - Week 1 (or below maxWeek) is always free
        // - User with entitlement has access to all weeks
        // - Otherwise, weeks beyond FREE_ACCESS.maxWeek are locked
        const weekIsLocked = week.weekNumber > FREE_ACCESS.maxWeek && !userHasAccess

        return {
          id: week.id,
          weekNumber: week.weekNumber,
          title: week.title,
          description: week.description,
          isLocked: weekIsLocked,
          topics: week.topics.map((topic) => {
            const totalQuestions = topic.questions.length
            const stats = (topic as { userStats?: { passCount: number }[] }).userStats?.[0]
            const passCount = stats?.passCount || 0
            const progress =
              totalQuestions > 0
                ? Math.round((passCount / totalQuestions) * 100)
                : 0

            return {
              id: topic.id,
              title: topic.title,
              slug: topic.slug,
              description: topic.description,
              isLocked: weekIsLocked, // Topics inherit week lock status
              questionCount: totalQuestions,
              progress,
              isCompleted: progress === 100,
            }
          }),
          progress: 0, // Will calculate below
        }
      }),
    }))

    // Calculate week progress
    coursesWithProgress.forEach((course) => {
      course.weeks.forEach((week) => {
        if (week.topics.length > 0) {
          const avgProgress =
            week.topics.reduce((sum, t) => sum + t.progress, 0) /
            week.topics.length
          week.progress = Math.round(avgProgress)
        }
      })
    })

    // Add debug header to help troubleshoot entitlement issues in production
    const response = NextResponse.json(coursesWithProgress)
    response.headers.set("X-Entitlement-Debug", JSON.stringify({
      userId: session?.user?.id || "anonymous",
      email: session?.user?.email || "anonymous",
      hasAccess: userHasAccess,
      plan: entitlementDebug?.plan || "none",
      status: entitlementDebug?.status || "none",
      weekCount: coursesWithProgress[0]?.weeks?.length || 0,
      lockedWeeks: coursesWithProgress[0]?.weeks?.filter(w => w.isLocked).length || 0,
      sessionValid: !!session?.user?.id,
    }))
    return response
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}
