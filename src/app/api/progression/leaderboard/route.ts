import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculateLevel } from "@/lib/progression"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "weekly"
    const limit = 20

    // Calculate date filter based on period
    let dateFilter: Date | undefined
    const now = new Date()

    if (period === "daily") {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    } else if (period === "weekly") {
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      dateFilter = startOfWeek
    }
    // For "alltime", no date filter needed

    // Get users with XP
    let users: {
      userId: string
      xp: number
      name: string
      image: string | null
      streak: number
      passCount: number
    }[]

    if (dateFilter) {
      // For daily/weekly, sum up points from ledger
      const usersWithPeriodXp = await db.pointsLedger.groupBy({
        by: ["userId"],
        where: {
          createdAt: { gte: dateFilter },
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: limit,
      })

      const userIds = usersWithPeriodXp.map((u) => u.userId)

      if (userIds.length === 0) {
        return NextResponse.json({
          entries: [],
          currentUserRank: undefined,
          totalUsers: 0,
          period,
        })
      }

      const userDetails = await db.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          image: true,
          progress: true,
        },
      })

      const userMap = new Map(userDetails.map((u) => [u.id, u]))

      // Get pass counts for the period
      const passCounts = await db.attempt.groupBy({
        by: ["userId"],
        where: {
          userId: { in: userIds },
          status: "PASS",
          createdAt: { gte: dateFilter },
        },
        _count: true,
      })

      const passCountMap = new Map(passCounts.map((p) => [p.userId, p._count]))

      users = usersWithPeriodXp.map((entry) => {
        const user = userMap.get(entry.userId)
        return {
          userId: entry.userId,
          xp: entry._sum.amount || 0,
          name: user?.name || "Anonymous",
          image: user?.image || null,
          streak: user?.progress?.currentStreak || 0,
          passCount: passCountMap.get(entry.userId) || 0,
        }
      })
    } else {
      // All time - use userProgress
      const allUsers = await db.userProgress.findMany({
        orderBy: { xp: "desc" },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      // Get pass counts
      const userIds = allUsers.map((u) => u.userId)
      const passCounts = await db.attempt.groupBy({
        by: ["userId"],
        where: {
          userId: { in: userIds },
          status: "PASS",
        },
        _count: true,
      })

      const passCountMap = new Map(passCounts.map((p) => [p.userId, p._count]))

      users = allUsers.map((u) => ({
        userId: u.userId,
        xp: u.xp,
        name: u.user.name || "Anonymous",
        image: u.user.image,
        streak: u.currentStreak,
        passCount: passCountMap.get(u.userId) || 0,
      }))
    }

    // Build entries with rank and level
    const entries = users.map((u, index) => ({
      rank: index + 1,
      userId: u.userId,
      name: u.name,
      avatar: u.image,
      xp: u.xp,
      level: calculateLevel(u.xp),
      streak: u.streak,
      passCount: u.passCount,
      isCurrentUser: u.userId === userId,
    }))

    // Get current user's rank if not in top entries
    let currentUserRank = entries.find((e) => e.isCurrentUser)?.rank

    if (!currentUserRank) {
      // Calculate user's rank
      if (dateFilter) {
        const userPeriodXp = await db.pointsLedger.aggregate({
          where: {
            userId,
            createdAt: { gte: dateFilter },
          },
          _sum: { amount: true },
        })

        const userXp = userPeriodXp._sum.amount || 0

        if (userXp > 0) {
          const higherCount = await db.pointsLedger.groupBy({
            by: ["userId"],
            where: {
              createdAt: { gte: dateFilter },
            },
            _sum: { amount: true },
            having: {
              amount: { _sum: { gt: userXp } },
            },
          })

          currentUserRank = higherCount.length + 1
        }
      } else {
        const userProgress = await db.userProgress.findUnique({
          where: { userId },
        })

        if (userProgress) {
          const higherCount = await db.userProgress.count({
            where: { xp: { gt: userProgress.xp } },
          })
          currentUserRank = higherCount + 1
        }
      }
    }

    // Get total users
    const totalUsers = await db.userProgress.count()

    return NextResponse.json({
      entries,
      currentUserRank,
      totalUsers,
      period,
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
