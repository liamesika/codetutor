/**
 * Cognitive Profiling Engine
 *
 * Analyzes user behavior to build a comprehensive cognitive profile
 * that drives adaptive learning recommendations.
 */

import { db } from "@/lib/db"
import { subDays, differenceInDays, startOfDay, getHours } from "date-fns"

interface ProfileCalculationResult {
  accuracyRate: number
  retryRate: number
  avgSolveTime: number
  avgSolveTimeByDifficulty: Record<string, number>
  topicWeaknessMap: Record<string, number>
  topicStrengthMap: Record<string, number>
  mistakeTypeFrequency: Record<string, number>
  streakStabilityScore: number
  momentumScore: number
  burnoutRiskScore: number
  confidenceIndex: number
  engagementScore: number
  preferredSessionLength: number
  peakPerformanceHour: number
  consistencyScore: number
  learningVelocity: number
  totalQuestionsAttempted: number
  totalQuestionsPassed: number
  totalMistakes: number
  currentWinStreak: number
  currentLoseStreak: number
}

/**
 * Get or create a user's cognitive profile
 */
export async function getOrCreateProfile(userId: string) {
  let profile = await db.cognitiveProfile.findUnique({
    where: { userId },
  })

  if (!profile) {
    profile = await db.cognitiveProfile.create({
      data: { userId },
    })
  }

  return profile
}

/**
 * Full recalculation of cognitive profile
 * Called periodically or after significant activity
 */
export async function recalculateCognitiveProfile(
  userId: string
): Promise<ProfileCalculationResult> {
  // Gather all necessary data
  const [
    attempts,
    userProgress,
    mistakeLogs,
    userActivities,
    dailyMissions,
  ] = await Promise.all([
    db.attempt.findMany({
      where: { userId },
      include: { question: { include: { topic: true } } },
      orderBy: { createdAt: "desc" },
      take: 500, // Last 500 attempts for analysis
    }),
    db.userProgress.findUnique({ where: { userId } }),
    db.mistakeLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.userActivity.findMany({
      where: { userId, createdAt: { gte: subDays(new Date(), 30) } },
      orderBy: { createdAt: "desc" },
    }),
    db.userDailyMission.findMany({
      where: { userId, createdAt: { gte: subDays(new Date(), 30) } },
    }),
  ])

  // Calculate basic metrics
  const totalAttempts = attempts.length
  const passedAttempts = attempts.filter(a => a.status === "PASS")
  const failedAttempts = attempts.filter(a => a.status === "FAIL")

  const accuracyRate = totalAttempts > 0
    ? passedAttempts.length / totalAttempts
    : 0

  // Calculate retry rate (attempts per unique question)
  const uniqueQuestions = new Set(attempts.map(a => a.questionId))
  const retryRate = uniqueQuestions.size > 0
    ? totalAttempts / uniqueQuestions.size
    : 1

  // Calculate average solve time
  const successfulAttempts = passedAttempts.filter(a => a.executionMs)
  const avgSolveTime = successfulAttempts.length > 0
    ? Math.round(successfulAttempts.reduce((sum, a) => sum + (a.executionMs || 0), 0) / successfulAttempts.length / 1000)
    : 0

  // Calculate solve time by difficulty
  const avgSolveTimeByDifficulty: Record<string, number> = {}
  const difficultyGroups = new Map<number, number[]>()

  for (const attempt of successfulAttempts) {
    const difficulty = attempt.question.difficulty
    if (!difficultyGroups.has(difficulty)) {
      difficultyGroups.set(difficulty, [])
    }
    difficultyGroups.get(difficulty)!.push(attempt.executionMs || 0)
  }

  for (const [difficulty, times] of difficultyGroups) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length / 1000
    avgSolveTimeByDifficulty[`LEVEL_${difficulty}`] = Math.round(avg)
  }

  // Calculate topic strength/weakness maps
  const topicStats = new Map<string, { passed: number; failed: number; total: number }>()

  for (const attempt of attempts) {
    const topicId = attempt.question.topicId
    if (!topicStats.has(topicId)) {
      topicStats.set(topicId, { passed: 0, failed: 0, total: 0 })
    }
    const stats = topicStats.get(topicId)!
    stats.total++
    if (attempt.status === "PASS") stats.passed++
    else if (attempt.status === "FAIL") stats.failed++
  }

  const topicWeaknessMap: Record<string, number> = {}
  const topicStrengthMap: Record<string, number> = {}

  for (const [topicId, stats] of topicStats) {
    const successRate = stats.total > 0 ? stats.passed / stats.total : 0.5
    // Weakness: inverse of success rate, weighted by attempts
    const weight = Math.min(stats.total / 10, 1) // More attempts = more confident
    topicWeaknessMap[topicId] = Math.round((1 - successRate) * 100 * weight)
    topicStrengthMap[topicId] = Math.round(successRate * 100 * weight)
  }

  // Calculate mistake type frequency
  const mistakeTypeFrequency: Record<string, number> = {}
  for (const log of mistakeLogs) {
    mistakeTypeFrequency[log.mistakeType] = (mistakeTypeFrequency[log.mistakeType] || 0) + 1
  }

  // Calculate streak stability (based on historical streak data)
  const streakStabilityScore = calculateStreakStability(userProgress)

  // Calculate momentum score
  const momentumScore = calculateMomentumScore(
    attempts.slice(0, 20), // Recent 20 attempts
    userProgress,
    dailyMissions
  )

  // Calculate burnout risk
  const burnoutRiskScore = calculateBurnoutRisk(
    userActivities,
    attempts.slice(0, 50),
    userProgress
  )

  // Calculate confidence index
  const confidenceIndex = calculateConfidenceIndex(
    attempts.slice(0, 30),
    mistakeLogs.slice(0, 20)
  )

  // Calculate engagement score
  const engagementScore = calculateEngagementScore(
    userActivities,
    dailyMissions
  )

  // Calculate preferred session length
  const preferredSessionLength = calculatePreferredSessionLength(userActivities)

  // Calculate peak performance hour
  const peakPerformanceHour = calculatePeakPerformanceHour(passedAttempts)

  // Calculate consistency score
  const consistencyScore = calculateConsistencyScore(userActivities)

  // Calculate learning velocity (XP per day trend)
  const learningVelocity = calculateLearningVelocity(userProgress, attempts)

  // Calculate win/lose streaks
  const { winStreak, loseStreak } = calculateCurrentStreaks(attempts.slice(0, 30))

  const result: ProfileCalculationResult = {
    accuracyRate: Math.round(accuracyRate * 100) / 100,
    retryRate: Math.round(retryRate * 100) / 100,
    avgSolveTime,
    avgSolveTimeByDifficulty,
    topicWeaknessMap,
    topicStrengthMap,
    mistakeTypeFrequency,
    streakStabilityScore,
    momentumScore,
    burnoutRiskScore,
    confidenceIndex,
    engagementScore,
    preferredSessionLength,
    peakPerformanceHour,
    consistencyScore,
    learningVelocity,
    totalQuestionsAttempted: totalAttempts,
    totalQuestionsPassed: passedAttempts.length,
    totalMistakes: mistakeLogs.length,
    currentWinStreak: winStreak,
    currentLoseStreak: loseStreak,
  }

  // Update the database
  await db.cognitiveProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...result,
      lastProfileUpdate: new Date(),
    },
    update: {
      ...result,
      lastProfileUpdate: new Date(),
    },
  })

  return result
}

/**
 * Incremental profile update after a single attempt
 * More efficient than full recalculation
 */
export async function updateProfileAfterAttempt(
  userId: string,
  attemptId: string
) {
  const [attempt, profile] = await Promise.all([
    db.attempt.findUnique({
      where: { id: attemptId },
      include: { question: true },
    }),
    getOrCreateProfile(userId),
  ])

  if (!attempt) return profile

  const isPassed = attempt.status === "PASS"
  const isFailed = attempt.status === "FAIL"

  // Update basic counters
  const newTotalAttempted = profile.totalQuestionsAttempted + 1
  const newTotalPassed = profile.totalQuestionsPassed + (isPassed ? 1 : 0)
  const newTotalMistakes = profile.totalMistakes + (isFailed ? 1 : 0)

  // Update accuracy rate (moving average)
  const newAccuracyRate = newTotalAttempted > 0
    ? newTotalPassed / newTotalAttempted
    : 0

  // Update win/lose streaks
  let newWinStreak = profile.currentWinStreak
  let newLoseStreak = profile.currentLoseStreak

  if (isPassed) {
    newWinStreak++
    newLoseStreak = 0
  } else if (isFailed) {
    newLoseStreak++
    newWinStreak = 0
  }

  // Update topic maps
  const topicId = attempt.question.topicId
  const topicWeaknessMap = profile.topicWeaknessMap as Record<string, number>
  const topicStrengthMap = profile.topicStrengthMap as Record<string, number>

  // Simple exponential moving average for topic scores
  const alpha = 0.3 // Learning rate
  if (isPassed) {
    topicStrengthMap[topicId] = Math.min(100,
      Math.round((topicStrengthMap[topicId] || 50) * (1 - alpha) + 100 * alpha)
    )
    topicWeaknessMap[topicId] = Math.max(0,
      Math.round((topicWeaknessMap[topicId] || 50) * (1 - alpha))
    )
  } else if (isFailed) {
    topicWeaknessMap[topicId] = Math.min(100,
      Math.round((topicWeaknessMap[topicId] || 50) * (1 - alpha) + 100 * alpha)
    )
    topicStrengthMap[topicId] = Math.max(0,
      Math.round((topicStrengthMap[topicId] || 50) * (1 - alpha))
    )
  }

  // Update confidence (drops on fail, rises on pass)
  let newConfidence = profile.confidenceIndex
  if (isPassed) {
    newConfidence = Math.min(100, newConfidence + 2)
  } else if (isFailed) {
    newConfidence = Math.max(0, newConfidence - 5)
  }

  // Update momentum (recent performance weighted)
  let newMomentum = profile.momentumScore
  if (isPassed) {
    newMomentum = Math.min(100, newMomentum + 3)
  } else if (isFailed) {
    newMomentum = Math.max(0, newMomentum - 2)
  }

  // Persist updates
  const updated = await db.cognitiveProfile.update({
    where: { userId },
    data: {
      totalQuestionsAttempted: newTotalAttempted,
      totalQuestionsPassed: newTotalPassed,
      totalMistakes: newTotalMistakes,
      accuracyRate: Math.round(newAccuracyRate * 100) / 100,
      currentWinStreak: newWinStreak,
      currentLoseStreak: newLoseStreak,
      topicWeaknessMap,
      topicStrengthMap,
      confidenceIndex: newConfidence,
      momentumScore: newMomentum,
      lastProfileUpdate: new Date(),
    },
  })

  return updated
}

// ==================== HELPER CALCULATIONS ====================

function calculateStreakStability(userProgress: { currentStreak?: number; bestStreak?: number } | null): number {
  if (!userProgress) return 50

  const current = userProgress.currentStreak || 0
  const best = userProgress.bestStreak || 1

  // Stability = how close current is to best, with a base score
  const ratio = current / Math.max(best, 1)
  return Math.min(100, Math.round(30 + ratio * 70))
}

function calculateMomentumScore(
  recentAttempts: { status: string; createdAt: Date }[],
  userProgress: { currentStreak?: number } | null,
  dailyMissions: { completedAt: Date | null }[]
): number {
  if (recentAttempts.length === 0) return 50

  // Factor 1: Recent success rate (last 20 attempts)
  const recentPasses = recentAttempts.filter(a => a.status === "PASS").length
  const recentSuccessRate = recentAttempts.length > 0
    ? recentPasses / recentAttempts.length
    : 0.5

  // Factor 2: Streak contribution
  const streakBonus = Math.min((userProgress?.currentStreak || 0) * 2, 20)

  // Factor 3: Daily mission completion rate (last 7 days)
  const recentMissions = dailyMissions.filter(
    m => m.completedAt && differenceInDays(new Date(), m.completedAt) < 7
  )
  const missionRate = dailyMissions.length > 0
    ? recentMissions.length / Math.min(dailyMissions.length, 21)
    : 0.5

  // Combined momentum
  const momentum = (recentSuccessRate * 50) + streakBonus + (missionRate * 30)
  return Math.min(100, Math.max(0, Math.round(momentum)))
}

function calculateBurnoutRisk(
  activities: { createdAt: Date; activityType: string }[],
  recentAttempts: { status: string; createdAt: Date }[],
  userProgress: { currentStreak?: number; bestStreak?: number } | null
): number {
  let risk = 0

  // Factor 1: High activity followed by sudden drop
  const last7Days = activities.filter(
    a => differenceInDays(new Date(), a.createdAt) < 7
  ).length
  const prev7Days = activities.filter(
    a => differenceInDays(new Date(), a.createdAt) >= 7 &&
         differenceInDays(new Date(), a.createdAt) < 14
  ).length

  if (prev7Days > 0 && last7Days < prev7Days * 0.5) {
    risk += 30 // Activity dropped significantly
  }

  // Factor 2: Losing streak
  const recentFails = recentAttempts
    .slice(0, 10)
    .filter(a => a.status === "FAIL").length
  if (recentFails >= 5) risk += 20
  if (recentFails >= 8) risk += 20

  // Factor 3: Streak at risk after long streak
  const current = userProgress?.currentStreak || 0
  const best = userProgress?.bestStreak || 0
  if (best > 14 && current < 3) {
    risk += 25 // Lost a long streak
  }

  return Math.min(100, risk)
}

function calculateConfidenceIndex(
  recentAttempts: { status: string; hintsUsed: number }[],
  recentMistakes: { severity: number }[]
): number {
  if (recentAttempts.length === 0) return 50

  // Factor 1: Recent success rate
  const passes = recentAttempts.filter(a => a.status === "PASS").length
  const successComponent = (passes / recentAttempts.length) * 40

  // Factor 2: Hint usage (less hints = more confident)
  const avgHints = recentAttempts.reduce((sum, a) => sum + a.hintsUsed, 0) / recentAttempts.length
  const hintComponent = Math.max(0, 30 - avgHints * 10)

  // Factor 3: Mistake severity (low severity = more confident)
  const avgSeverity = recentMistakes.length > 0
    ? recentMistakes.reduce((sum, m) => sum + m.severity, 0) / recentMistakes.length
    : 2
  const severityComponent = Math.max(0, 30 - avgSeverity * 6)

  return Math.round(successComponent + hintComponent + severityComponent)
}

function calculateEngagementScore(
  activities: { createdAt: Date }[],
  dailyMissions: { completedAt: Date | null }[]
): number {
  // Factor 1: Days active in last 14 days
  const uniqueDays = new Set(
    activities
      .filter(a => differenceInDays(new Date(), a.createdAt) < 14)
      .map(a => startOfDay(a.createdAt).toISOString())
  )
  const daysActiveComponent = (uniqueDays.size / 14) * 50

  // Factor 2: Mission completion
  const completedMissions = dailyMissions.filter(m => m.completedAt).length
  const missionComponent = dailyMissions.length > 0
    ? (completedMissions / dailyMissions.length) * 50
    : 25

  return Math.round(daysActiveComponent + missionComponent)
}

function calculatePreferredSessionLength(
  activities: { createdAt: Date; activityType: string; sessionId?: string | null }[]
): number {
  // Group by session and calculate average duration
  const sessions = new Map<string, Date[]>()

  for (const activity of activities) {
    const sessionId = activity.sessionId || activity.createdAt.toISOString().slice(0, 10)
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, [])
    }
    sessions.get(sessionId)!.push(activity.createdAt)
  }

  const durations: number[] = []
  for (const times of sessions.values()) {
    if (times.length >= 2) {
      times.sort((a, b) => a.getTime() - b.getTime())
      const duration = (times[times.length - 1].getTime() - times[0].getTime()) / 60000
      if (duration > 0 && duration < 180) { // Ignore outliers
        durations.push(duration)
      }
    }
  }

  return durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 30
}

function calculatePeakPerformanceHour(
  passedAttempts: { createdAt: Date }[]
): number {
  if (passedAttempts.length === 0) return 14 // Default 2 PM

  const hourCounts = new Map<number, number>()

  for (const attempt of passedAttempts) {
    const hour = getHours(attempt.createdAt)
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
  }

  let peakHour = 14
  let maxCount = 0

  for (const [hour, count] of hourCounts) {
    if (count > maxCount) {
      maxCount = count
      peakHour = hour
    }
  }

  return peakHour
}

function calculateConsistencyScore(
  activities: { createdAt: Date }[]
): number {
  // Look at last 14 days
  const daysActive = new Set(
    activities
      .filter(a => differenceInDays(new Date(), a.createdAt) < 14)
      .map(a => startOfDay(a.createdAt).toISOString())
  )

  // Calculate gaps between active days
  const activeDates = Array.from(daysActive)
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime())

  if (activeDates.length < 2) return 50

  let totalGap = 0
  for (let i = 1; i < activeDates.length; i++) {
    totalGap += differenceInDays(activeDates[i], activeDates[i - 1])
  }

  const avgGap = totalGap / (activeDates.length - 1)

  // Score: 1 day gap = 100, 7 day gap = 0
  return Math.max(0, Math.min(100, Math.round(100 - (avgGap - 1) * 15)))
}

function calculateLearningVelocity(
  userProgress: { xp?: number; createdAt?: Date } | null,
  attempts: { createdAt: Date; status: string }[]
): number {
  if (!userProgress?.xp || attempts.length === 0) return 1.0

  // Calculate XP per day over last 14 days
  const oldestAttempt = attempts[attempts.length - 1]
  const daysActive = Math.max(1, differenceInDays(new Date(), oldestAttempt.createdAt))

  // Estimate XP gained (100 XP per pass on average)
  const passCount = attempts.filter(a => a.status === "PASS").length
  const estimatedXp = passCount * 100

  return Math.round((estimatedXp / daysActive) * 10) / 10
}

function calculateCurrentStreaks(
  recentAttempts: { status: string }[]
): { winStreak: number; loseStreak: number } {
  let winStreak = 0
  let loseStreak = 0

  for (const attempt of recentAttempts) {
    if (attempt.status === "PASS") {
      if (loseStreak > 0) break
      winStreak++
    } else if (attempt.status === "FAIL") {
      if (winStreak > 0) break
      loseStreak++
    }
  }

  return { winStreak, loseStreak }
}
