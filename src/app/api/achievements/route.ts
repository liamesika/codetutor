import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all achievements
    const achievements = await db.achievement.findMany({
      orderBy: [{ points: "desc" }, { name: "asc" }],
    })

    // Get user's unlocked achievements
    const userAchievements = await db.userAchievement.findMany({
      where: { userId },
    })

    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua.earnedAt])
    )

    // Get user stats for progress calculation
    const [totalPasses, maxStreak, noHintPasses] = await Promise.all([
      db.attempt.count({ where: { userId, status: "PASS" } }),
      db.userTopicStats.aggregate({
        where: { userId },
        _max: { bestStreak: true },
      }),
      db.attempt.count({ where: { userId, status: "PASS", hintsUsed: 0 } }),
    ])

    // Build response with progress info
    const achievementsWithProgress = achievements.map((a) => {
      const criteria = a.criteria as { type: string; count?: number } | null
      const isUnlocked = unlockedMap.has(a.id)
      let progress: number | undefined
      let requirement: number | undefined

      if (!isUnlocked && criteria) {
        switch (criteria.type) {
          case "first_pass":
            progress = Math.min(1, totalPasses)
            requirement = 1
            break
          case "passes":
            progress = totalPasses
            requirement = criteria.count || 10
            break
          case "streak":
            progress = maxStreak._max.bestStreak || 0
            requirement = criteria.count || 7
            break
          case "no_hints":
            progress = noHintPasses
            requirement = criteria.count || 5
            break
        }
      }

      // Map rarity from points
      let rarity = "common"
      if (a.points >= 500) rarity = "legendary"
      else if (a.points >= 200) rarity = "epic"
      else if (a.points >= 100) rarity = "rare"
      else if (a.points >= 50) rarity = "uncommon"

      return {
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon || "Trophy",
        points: a.points,
        rarity,
        isUnlocked,
        unlockedAt: unlockedMap.get(a.id)?.toISOString(),
        progress,
        requirement,
      }
    })

    // Calculate totals
    const totalUnlocked = achievementsWithProgress.filter((a) => a.isUnlocked).length
    const totalPoints = achievementsWithProgress
      .filter((a) => a.isUnlocked)
      .reduce((sum, a) => sum + a.points, 0)

    return NextResponse.json({
      achievements: achievementsWithProgress,
      totalUnlocked,
      totalPoints,
    })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    )
  }
}
