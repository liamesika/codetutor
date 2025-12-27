/**
 * Daily Challenge System - One highlighted challenge per day with bonus XP
 */

import { db } from "@/lib/db"
import { awardXP, XP_CONFIG } from "./progression"

/**
 * Get today's daily challenge
 */
export async function getDailyChallenge(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if challenge exists for today
  let challenge = await db.dailyChallenge.findUnique({
    where: { date: today },
    include: {
      question: {
        include: {
          topic: {
            include: {
              week: true,
            },
          },
        },
      },
      completions: {
        where: { userId },
      },
    },
  })

  // If no challenge for today, create one
  if (!challenge) {
    const newChallenge = await createDailyChallenge(today)
    if (!newChallenge) return null

    // Reload with relations
    challenge = await db.dailyChallenge.findUnique({
      where: { id: newChallenge.id },
      include: {
        question: {
          include: {
            topic: {
              include: {
                week: true,
              },
            },
          },
        },
        completions: {
          where: { userId },
        },
      },
    })
  }

  if (!challenge) return null

  const isCompleted = challenge.completions.length > 0
  const completion = challenge.completions[0]

  return {
    id: challenge.id,
    date: challenge.date,
    bonusXp: challenge.bonusXp,
    question: {
      id: challenge.question.id,
      title: challenge.question.title,
      slug: challenge.question.slug,
      difficulty: challenge.question.difficulty,
      type: challenge.question.type,
      estimatedMinutes: challenge.question.estimatedMinutes,
      points: challenge.question.points,
      topic: {
        id: challenge.question.topic.id,
        title: challenge.question.topic.title,
        weekNumber: challenge.question.topic.week.weekNumber,
      },
    },
    isCompleted,
    completedAt: completion?.completedAt,
    xpEarned: completion?.xpEarned,
  }
}

/**
 * Create a daily challenge for a specific date
 */
async function createDailyChallenge(date: Date) {
  // Get a random active question
  // Prefer medium difficulty (2-3) for daily challenges
  const questions = await db.question.findMany({
    where: {
      isActive: true,
      difficulty: { in: [2, 3] },
    },
    select: { id: true },
  })

  if (questions.length === 0) {
    // Fallback to any active question
    const allQuestions = await db.question.findMany({
      where: { isActive: true },
      select: { id: true },
    })

    if (allQuestions.length === 0) return null

    const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)]

    return db.dailyChallenge.create({
      data: {
        date,
        questionId: randomQuestion.id,
        bonusXp: XP_CONFIG.DAILY_CHALLENGE,
      },
    })
  }

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)]

  return db.dailyChallenge.create({
    data: {
      date,
      questionId: randomQuestion.id,
      bonusXp: XP_CONFIG.DAILY_CHALLENGE,
    },
  })
}

/**
 * Complete the daily challenge
 */
export async function completeDailyChallenge(userId: string, challengeId: string) {
  // Check if already completed
  const existing = await db.dailyChallengeCompletion.findUnique({
    where: {
      userId_challengeId: { userId, challengeId },
    },
  })

  if (existing) {
    return { success: true, alreadyCompleted: true, xpEarned: 0 }
  }

  // Get challenge details
  const challenge = await db.dailyChallenge.findUnique({
    where: { id: challengeId },
    include: { question: true },
  })

  if (!challenge) {
    throw new Error("Challenge not found")
  }

  // Check if it's today's challenge
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const challengeDate = new Date(challenge.date)
  challengeDate.setHours(0, 0, 0, 0)

  if (challengeDate.getTime() !== today.getTime()) {
    throw new Error("This challenge has expired")
  }

  // Award bonus XP
  const xpResult = await awardXP(
    userId,
    challenge.bonusXp,
    "Daily challenge completed",
    {
      challengeId,
      questionId: challenge.questionId,
      questionTitle: challenge.question.title,
    }
  )

  // Record completion
  await db.dailyChallengeCompletion.create({
    data: {
      userId,
      challengeId,
      xpEarned: challenge.bonusXp,
    },
  })

  return {
    success: true,
    alreadyCompleted: false,
    xpEarned: challenge.bonusXp,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.newLevel,
  }
}

/**
 * Check if user has completed today's daily challenge
 */
export async function hasDailyChallengeCompleted(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const challenge = await db.dailyChallenge.findUnique({
    where: { date: today },
    include: {
      completions: {
        where: { userId },
      },
    },
  })

  return challenge?.completions.length ? challenge.completions.length > 0 : false
}

/**
 * Get user's daily challenge streak (consecutive days of completing daily challenges)
 */
export async function getDailyChallengeStreak(userId: string) {
  const completions = await db.dailyChallengeCompletion.findMany({
    where: { userId },
    include: { challenge: true },
    orderBy: { completedAt: "desc" },
    take: 30, // Check last 30 days max
  })

  if (completions.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)

    const hasCompletion = completions.some((c) => {
      const completionDate = new Date(c.challenge.date)
      completionDate.setHours(0, 0, 0, 0)
      return completionDate.getTime() === checkDate.getTime()
    })

    if (hasCompletion) {
      streak++
    } else if (i > 0) {
      // Allow missing today, but break on any other gap
      break
    }
  }

  return streak
}
