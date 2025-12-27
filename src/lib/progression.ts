/**
 * Progression Engine - XP, Level, Streak, and Skill Tree logic
 */

import { db } from "@/lib/db"

// XP Configuration
export const XP_CONFIG = {
  SOLVE_QUESTION: 10,
  MASTER_TOPIC: 50,
  DAILY_STREAK_BONUS: 15,
  COMPLETE_NODE: 100,
  DAILY_CHALLENGE: 25,
  NO_HINTS_BONUS: 5,
  FIRST_TRY_BONUS: 10,
  SPEED_BONUS_THRESHOLD_MS: 60000, // Under 1 minute
  SPEED_BONUS: 5,
}

// Level formula: level = floor(totalXP / 250) + 1
export const XP_PER_LEVEL = 250

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  return currentLevel * XP_PER_LEVEL
}

export function xpProgress(currentXp: number): number {
  const levelStart = (calculateLevel(currentXp) - 1) * XP_PER_LEVEL
  const levelEnd = calculateLevel(currentXp) * XP_PER_LEVEL
  return ((currentXp - levelStart) / (levelEnd - levelStart)) * 100
}

/**
 * Get or create user progress
 */
export async function getUserProgress(userId: string) {
  let progress = await db.userProgress.findUnique({
    where: { userId },
  })

  if (!progress) {
    progress = await db.userProgress.create({
      data: { userId },
    })
  }

  return {
    ...progress,
    level: calculateLevel(progress.xp),
    xpToNextLevel: xpForNextLevel(progress.xp),
    xpProgress: xpProgress(progress.xp),
  }
}

/**
 * Award XP to user and update level
 */
export async function awardXP(
  userId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, unknown>
) {
  const progress = await db.userProgress.upsert({
    where: { userId },
    update: {
      xp: { increment: amount },
    },
    create: {
      userId,
      xp: amount,
    },
  })

  const newLevel = calculateLevel(progress.xp)
  const leveledUp = newLevel > progress.level

  if (leveledUp) {
    await db.userProgress.update({
      where: { userId },
      data: { level: newLevel },
    })
  }

  // Log to points ledger
  await db.pointsLedger.create({
    data: {
      userId,
      amount,
      type: "QUESTION_PASS",
      description: reason,
      metadata: metadata as object,
    },
  })

  return {
    xpAwarded: amount,
    newXp: progress.xp,
    newLevel,
    leveledUp,
    xpProgress: xpProgress(progress.xp),
  }
}

/**
 * Update streak on activity
 */
export async function updateStreak(userId: string) {
  const progress = await db.userProgress.findUnique({
    where: { userId },
  })

  if (!progress) {
    return db.userProgress.create({
      data: {
        userId,
        currentStreak: 1,
        bestStreak: 1,
        lastActiveDate: new Date(),
      },
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastActive = progress.lastActiveDate
    ? new Date(progress.lastActiveDate)
    : null

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0)
  }

  let newStreak = progress.currentStreak
  let streakBroken = false
  let streakContinued = false

  if (!lastActive) {
    // First activity
    newStreak = 1
  } else {
    const dayDiff = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (dayDiff === 0) {
      // Same day, no change
      streakContinued = true
    } else if (dayDiff === 1) {
      // Next day, continue streak
      newStreak = progress.currentStreak + 1
      streakContinued = true
    } else {
      // Streak broken
      newStreak = 1
      streakBroken = true
    }
  }

  const newBestStreak = Math.max(newStreak, progress.bestStreak)

  const updated = await db.userProgress.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastActiveDate: new Date(),
    },
  })

  // Award streak bonus if streak continues to a new day
  if (streakContinued && newStreak > progress.currentStreak) {
    await awardXP(
      userId,
      XP_CONFIG.DAILY_STREAK_BONUS,
      `Day ${newStreak} streak bonus`,
      { streak: newStreak }
    )
  }

  return {
    ...updated,
    streakBroken,
    streakContinued,
  }
}

/**
 * Increment solved count
 */
export async function incrementSolved(userId: string) {
  return db.userProgress.upsert({
    where: { userId },
    update: {
      totalSolved: { increment: 1 },
    },
    create: {
      userId,
      totalSolved: 1,
    },
  })
}

/**
 * Calculate XP for solving a question
 */
export function calculateQuestionXP(options: {
  basePoints: number
  hintsUsed: number
  isFirstTry: boolean
  executionMs?: number
}): { total: number; breakdown: { label: string; amount: number }[] } {
  const breakdown: { label: string; amount: number }[] = []

  // Base XP
  breakdown.push({ label: "Solved", amount: XP_CONFIG.SOLVE_QUESTION })

  // No hints bonus
  if (options.hintsUsed === 0) {
    breakdown.push({ label: "No hints", amount: XP_CONFIG.NO_HINTS_BONUS })
  }

  // First try bonus
  if (options.isFirstTry) {
    breakdown.push({ label: "First try", amount: XP_CONFIG.FIRST_TRY_BONUS })
  }

  // Speed bonus
  if (
    options.executionMs &&
    options.executionMs < XP_CONFIG.SPEED_BONUS_THRESHOLD_MS
  ) {
    breakdown.push({ label: "Speed bonus", amount: XP_CONFIG.SPEED_BONUS })
  }

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0)

  return { total, breakdown }
}

/**
 * Process question completion - main entry point
 */
export async function processQuestionCompletion(
  userId: string,
  questionId: string,
  options: {
    hintsUsed: number
    executionMs?: number
  }
) {
  // Check if this is first pass
  const previousPass = await db.attempt.findFirst({
    where: {
      userId,
      questionId,
      status: "PASS",
    },
  })

  const isFirstTry = !previousPass

  // Get previous level before awarding XP
  const previousProgress = await getUserProgress(userId)
  const previousLevel = previousProgress.level

  // Calculate XP
  const { total, breakdown } = calculateQuestionXP({
    basePoints: XP_CONFIG.SOLVE_QUESTION,
    hintsUsed: options.hintsUsed,
    isFirstTry,
    executionMs: options.executionMs,
  })

  // Only award XP on first pass
  let xpResult = null
  if (isFirstTry) {
    xpResult = await awardXP(userId, total, "Question solved", {
      questionId,
      breakdown,
    })

    // Increment solved count
    await incrementSolved(userId)

    // Update streak
    await updateStreak(userId)
  }

  // Get updated progress
  const progress = await getUserProgress(userId)
  const leveledUp = progress.level > previousLevel

  return {
    xpAwarded: isFirstTry ? total : 0,
    breakdown: isFirstTry ? breakdown : [],
    isFirstPass: isFirstTry,
    leveledUp,
    previousLevel,
    progress,
  }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(limit = 10) {
  const users = await db.userProgress.findMany({
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

  return users.map((u, index) => ({
    rank: index + 1,
    userId: u.userId,
    name: u.user.name,
    image: u.user.image,
    xp: u.xp,
    level: calculateLevel(u.xp),
    streak: u.currentStreak,
  }))
}

/**
 * Check topic mastery
 */
export async function checkTopicMastery(userId: string, topicId: string) {
  const topic = await db.topic.findUnique({
    where: { id: topicId },
    include: {
      questions: { where: { isActive: true } },
    },
  })

  if (!topic) return null

  const passedQuestions = await db.attempt.findMany({
    where: {
      userId,
      questionId: { in: topic.questions.map((q) => q.id) },
      status: "PASS",
    },
    distinct: ["questionId"],
  })

  const totalQuestions = topic.questions.length
  const solvedCount = passedQuestions.length
  const masteryPercent =
    totalQuestions > 0 ? (solvedCount / totalQuestions) * 100 : 0
  const isMastered = masteryPercent === 100

  // Award mastery bonus if just achieved
  if (isMastered) {
    const stats = await db.userTopicStats.findUnique({
      where: { userId_topicId: { userId, topicId } },
    })

    // Check if this is newly mastered (skill level < 1 before)
    if (stats && stats.skillLevel < 1) {
      await awardXP(userId, XP_CONFIG.MASTER_TOPIC, "Topic mastered", {
        topicId,
        topicTitle: topic.title,
      })
    }
  }

  return {
    topicId,
    topicTitle: topic.title,
    totalQuestions,
    solvedCount,
    masteryPercent,
    isMastered,
  }
}
