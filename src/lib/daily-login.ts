/**
 * Daily Login System - Streak tracking and bonus XP
 */

import { db } from "@/lib/db"
import { awardXP } from "@/lib/progression"

// Streak bonus XP tiers
const STREAK_BONUSES: Array<{ days: number; xp: number; type: string }> = [
  { days: 1, xp: 10, type: "daily" },
  { days: 3, xp: 25, type: "streak_3" },
  { days: 7, xp: 50, type: "streak_7" },
  { days: 14, xp: 100, type: "streak_14" },
  { days: 30, xp: 200, type: "streak_30" },
  { days: 60, xp: 400, type: "streak_60" },
  { days: 100, xp: 750, type: "streak_100" },
]

/**
 * Calculate bonus XP for current streak
 */
export function calculateStreakBonus(streak: number): { xp: number; type: string } {
  // Find the highest tier the user qualifies for
  let bonus = STREAK_BONUSES[0]

  for (const tier of STREAK_BONUSES) {
    if (streak >= tier.days) {
      bonus = tier
    }
  }

  // Add variable bonus based on streak length
  const variableBonus = Math.floor(streak / 7) * 5 // +5 XP per week

  return {
    xp: bonus.xp + variableBonus,
    type: bonus.type,
  }
}

/**
 * Check if two dates are on the same calendar day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Check if date1 is exactly one day before date2
 */
function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date1, yesterday)
}

/**
 * Process daily login and return streak info
 */
export async function processDailyLogin(userId: string): Promise<{
  isNewDay: boolean
  streak: number
  streakReset: boolean
  bonusXp: number
  bonusType: string
  previousStreak: number
}> {
  const now = new Date()

  // Get existing daily login record
  const existing = await db.dailyLogin.findUnique({
    where: { userId },
  })

  // If no record, create first login
  if (!existing) {
    const bonus = calculateStreakBonus(1)

    await db.dailyLogin.create({
      data: {
        userId,
        lastLogin: now,
        streak: 1,
        bonusXp: bonus.xp,
        bonusType: bonus.type,
      },
    })

    // Award XP
    await awardXP(userId, bonus.xp, "Daily login bonus", {
      streak: 1,
      type: "daily_login",
    })

    return {
      isNewDay: true,
      streak: 1,
      streakReset: false,
      bonusXp: bonus.xp,
      bonusType: bonus.type,
      previousStreak: 0,
    }
  }

  const lastLogin = new Date(existing.lastLogin)

  // Same day - no new bonus
  if (isSameDay(lastLogin, now)) {
    return {
      isNewDay: false,
      streak: existing.streak,
      streakReset: false,
      bonusXp: 0,
      bonusType: existing.bonusType,
      previousStreak: existing.streak,
    }
  }

  // Calculate new streak
  let newStreak: number
  let streakReset = false
  const previousStreak = existing.streak

  if (isYesterday(lastLogin, now)) {
    // Consecutive day - increment streak
    newStreak = existing.streak + 1
  } else {
    // Streak broken - reset to 1
    newStreak = 1
    streakReset = true
  }

  const bonus = calculateStreakBonus(newStreak)

  // Update record
  await db.dailyLogin.update({
    where: { userId },
    data: {
      lastLogin: now,
      streak: newStreak,
      bonusXp: bonus.xp,
      bonusType: bonus.type,
    },
  })

  // Award XP
  await awardXP(userId, bonus.xp, `Day ${newStreak} login bonus`, {
    streak: newStreak,
    type: "daily_login",
    streakReset,
  })

  return {
    isNewDay: true,
    streak: newStreak,
    streakReset,
    bonusXp: bonus.xp,
    bonusType: bonus.type,
    previousStreak,
  }
}

/**
 * Get user's daily login status
 */
export async function getDailyLoginStatus(userId: string) {
  const existing = await db.dailyLogin.findUnique({
    where: { userId },
  })

  if (!existing) {
    return {
      hasLoggedToday: false,
      streak: 0,
      lastLogin: null,
      nextBonusXp: calculateStreakBonus(1).xp,
    }
  }

  const now = new Date()
  const lastLogin = new Date(existing.lastLogin)
  const hasLoggedToday = isSameDay(lastLogin, now)

  // Calculate what the next bonus would be
  const nextStreak = hasLoggedToday ? existing.streak : existing.streak + 1
  const nextBonus = calculateStreakBonus(nextStreak)

  return {
    hasLoggedToday,
    streak: existing.streak,
    lastLogin: existing.lastLogin,
    bonusXp: existing.bonusXp,
    bonusType: existing.bonusType,
    nextBonusXp: nextBonus.xp,
  }
}

/**
 * Get streak milestones user has achieved
 */
export function getStreakMilestones(streak: number): {
  current: number
  next: number | null
  achieved: number[]
} {
  const milestones = [3, 7, 14, 30, 60, 100]
  const achieved = milestones.filter(m => streak >= m)
  const next = milestones.find(m => streak < m) || null

  return {
    current: streak,
    next,
    achieved,
  }
}
