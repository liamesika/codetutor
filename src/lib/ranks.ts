/**
 * Rank & League System - XP-based ranking with weekly leagues
 */

import { db } from "@/lib/db"
import { Rank } from "@prisma/client"

// Rank thresholds
export const RANK_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 1500,
  PLATINUM: 3000,
  DIAMOND: 6000,
} as const

// Rank metadata
export const RANK_CONFIG: Record<Rank, {
  name: string
  minXp: number
  maxXp: number
  color: string
  glowColor: string
  icon: string
  bgGradient: string
}> = {
  BRONZE: {
    name: "Bronze",
    minXp: 0,
    maxXp: 499,
    color: "#CD7F32",
    glowColor: "rgba(205, 127, 50, 0.5)",
    icon: "Shield",
    bgGradient: "from-amber-700/20 to-orange-900/20",
  },
  SILVER: {
    name: "Silver",
    minXp: 500,
    maxXp: 1499,
    color: "#C0C0C0",
    glowColor: "rgba(192, 192, 192, 0.5)",
    icon: "Shield",
    bgGradient: "from-gray-400/20 to-gray-600/20",
  },
  GOLD: {
    name: "Gold",
    minXp: 1500,
    maxXp: 2999,
    color: "#FFD700",
    glowColor: "rgba(255, 215, 0, 0.5)",
    icon: "Crown",
    bgGradient: "from-yellow-500/20 to-amber-600/20",
  },
  PLATINUM: {
    name: "Platinum",
    minXp: 3000,
    maxXp: 5999,
    color: "#22D3EE",
    glowColor: "rgba(34, 211, 238, 0.5)",
    icon: "Gem",
    bgGradient: "from-cyan-400/20 to-teal-600/20",
  },
  DIAMOND: {
    name: "Diamond",
    minXp: 6000,
    maxXp: Infinity,
    color: "#818CF8",
    glowColor: "rgba(129, 140, 248, 0.6)",
    icon: "Diamond",
    bgGradient: "from-indigo-400/20 to-purple-600/20",
  },
}

/**
 * Calculate rank from XP
 */
export function calculateRank(xp: number): Rank {
  if (xp >= RANK_THRESHOLDS.DIAMOND) return "DIAMOND"
  if (xp >= RANK_THRESHOLDS.PLATINUM) return "PLATINUM"
  if (xp >= RANK_THRESHOLDS.GOLD) return "GOLD"
  if (xp >= RANK_THRESHOLDS.SILVER) return "SILVER"
  return "BRONZE"
}

/**
 * Get XP progress toward next rank
 */
export function getRankProgress(xp: number): {
  currentRank: Rank
  nextRank: Rank | null
  progress: number
  xpToNext: number
  xpInCurrentRank: number
} {
  const currentRank = calculateRank(xp)
  const config = RANK_CONFIG[currentRank]

  const ranks: Rank[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]
  const currentIndex = ranks.indexOf(currentRank)
  const nextRank = currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      progress: 100,
      xpToNext: 0,
      xpInCurrentRank: xp - config.minXp,
    }
  }

  const nextConfig = RANK_CONFIG[nextRank]
  const xpInCurrentRank = xp - config.minXp
  const xpNeeded = nextConfig.minXp - config.minXp
  const progress = Math.min(100, (xpInCurrentRank / xpNeeded) * 100)
  const xpToNext = nextConfig.minXp - xp

  return {
    currentRank,
    nextRank,
    progress,
    xpToNext,
    xpInCurrentRank,
  }
}

/**
 * Get or create current week's league
 */
export async function getCurrentLeague() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayOfWeek)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  let league = await db.league.findUnique({
    where: { weekStart },
  })

  if (!league) {
    league = await db.league.create({
      data: {
        weekStart,
        weekEnd,
        isActive: true,
      },
    })
  }

  return league
}

/**
 * Get or create user's league placement for current week
 */
export async function getUserLeaguePlacement(userId: string) {
  const league = await getCurrentLeague()

  // Get user's XP for rank calculation
  const progress = await db.userProgress.findUnique({
    where: { userId },
  })

  const xp = progress?.xp || 0
  const rank = calculateRank(xp)

  let placement = await db.leaguePlacement.findUnique({
    where: {
      userId_leagueId: { userId, leagueId: league.id },
    },
  })

  if (!placement) {
    placement = await db.leaguePlacement.create({
      data: {
        userId,
        leagueId: league.id,
        rank,
        weeklyXp: 0,
      },
    })
  }

  return placement
}

/**
 * Update weekly XP for league placement
 */
export async function updateWeeklyXp(userId: string, xpGained: number) {
  const league = await getCurrentLeague()

  const progress = await db.userProgress.findUnique({
    where: { userId },
  })

  const totalXp = progress?.xp || 0
  const rank = calculateRank(totalXp)

  const placement = await db.leaguePlacement.upsert({
    where: {
      userId_leagueId: { userId, leagueId: league.id },
    },
    update: {
      weeklyXp: { increment: xpGained },
      rank,
    },
    create: {
      userId,
      leagueId: league.id,
      rank,
      weeklyXp: xpGained,
    },
  })

  return placement
}

/**
 * Get league leaderboard for current week
 */
export async function getLeagueLeaderboard(limit = 50) {
  const league = await getCurrentLeague()

  const placements = await db.leaguePlacement.findMany({
    where: { leagueId: league.id },
    orderBy: { weeklyXp: "desc" },
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

  return placements.map((p, index) => ({
    position: index + 1,
    userId: p.userId,
    name: p.user.name,
    image: p.user.image,
    rank: p.rank,
    weeklyXp: p.weeklyXp,
    promoted: p.promoted,
    demoted: p.demoted,
  }))
}

/**
 * Process end-of-week league promotions/demotions
 */
export async function processLeagueWeek() {
  const league = await getCurrentLeague()

  if (league.processedAt) {
    return { processed: false, message: "Already processed" }
  }

  const placements = await db.leaguePlacement.findMany({
    where: { leagueId: league.id },
    orderBy: { weeklyXp: "desc" },
  })

  const totalUsers = placements.length
  const promoteThreshold = Math.ceil(totalUsers * 0.2) // Top 20%
  const demoteThreshold = Math.ceil(totalUsers * 0.2) // Bottom 20%

  const updates = placements.map((p, index) => {
    const position = index + 1
    const promoted = position <= promoteThreshold
    const demoted = position > totalUsers - demoteThreshold

    return db.leaguePlacement.update({
      where: { id: p.id },
      data: {
        position,
        promoted,
        demoted,
      },
    })
  })

  await Promise.all(updates)

  await db.league.update({
    where: { id: league.id },
    data: { processedAt: new Date(), isActive: false },
  })

  return {
    processed: true,
    totalUsers,
    promoted: promoteThreshold,
    demoted: demoteThreshold,
  }
}

/**
 * Get user's rank data with all details
 */
export async function getUserRankData(userId: string) {
  const progress = await db.userProgress.findUnique({
    where: { userId },
  })

  const xp = progress?.xp || 0
  const rankProgress = getRankProgress(xp)
  const placement = await getUserLeaguePlacement(userId)
  const leaderboard = await getLeagueLeaderboard(10)

  // Find user's position
  const userPosition = leaderboard.find(l => l.userId === userId)?.position || null

  return {
    xp,
    level: progress?.level || 1,
    ...rankProgress,
    rankConfig: RANK_CONFIG[rankProgress.currentRank],
    nextRankConfig: rankProgress.nextRank ? RANK_CONFIG[rankProgress.nextRank] : null,
    league: {
      weeklyXp: placement.weeklyXp,
      position: userPosition,
      promoted: placement.promoted,
      demoted: placement.demoted,
    },
  }
}
