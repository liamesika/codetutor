/**
 * Adaptive Mission Generator
 *
 * Generates personalized PRO missions based on:
 * - CognitiveProfile analysis
 * - SkillTree gaps
 * - Streak state
 * - Drop-off risk
 * - Burnout risk
 */

import { db } from "@/lib/db"
import { ProMissionType, MistakeType } from "@prisma/client"
import { startOfDay, addDays } from "date-fns"
import { getOrCreateProfile } from "./cognitive-engine"
import { getMistakePatterns } from "./mistake-engine"

interface MissionTemplate {
  type: ProMissionType
  title: string
  description: string
  targetValue: number
  xpReward: number
  difficultyLevel: number
  priorityScore: number
  targetTopicId?: string
  targetSkillArea?: string
  targetMistakeType?: MistakeType
  generatedReason: string
}

interface GenerationContext {
  profile: Awaited<ReturnType<typeof getOrCreateProfile>>
  userProgress: { currentStreak: number; bestStreak: number; xp: number; level: number } | null
  mistakePatterns: Awaited<ReturnType<typeof getMistakePatterns>>
  skillGaps: Array<{ nodeId: string; title: string; progress: number }>
  recentActivity: number // Days since last activity
}

/**
 * Generate daily adaptive missions for a PRO user
 */
export async function generateDailyMissions(
  userId: string,
  count: number = 3
): Promise<MissionTemplate[]> {
  const context = await buildGenerationContext(userId)
  const missions: MissionTemplate[] = []

  // Determine user state and priorities
  const userState = analyzeUserState(context)

  // Generate missions based on state
  if (userState.isBurnoutRisk) {
    missions.push(generateBurnoutPreventionMission(context))
  }

  if (userState.isLosingStreak && context.userProgress?.currentStreak) {
    missions.push(generateStreakProtectionMission(context))
  }

  if (userState.hasRecurringMistakes) {
    missions.push(generateMistakeRecoveryMission(context))
  }

  if (userState.hasWeakTopics) {
    missions.push(generateWeaknessTrainingMission(context))
  }

  if (userState.lowConfidence) {
    missions.push(generateConfidenceBoostMission(context))
  }

  if (userState.lowMomentum) {
    missions.push(generateMomentumPushMission(context))
  }

  if (userState.hasSkillGaps) {
    missions.push(generateSkillUnlockMission(context))
  }

  // Fill remaining slots with balanced missions
  while (missions.length < count) {
    const filler = generateBalancedMission(context, missions)
    if (filler) {
      missions.push(filler)
    } else {
      break
    }
  }

  // Sort by priority and return top N
  return missions
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, count)
}

/**
 * Build context for mission generation
 */
async function buildGenerationContext(userId: string): Promise<GenerationContext> {
  const [profile, userProgress, mistakePatterns, skillUnlocks, lastActivity] =
    await Promise.all([
      getOrCreateProfile(userId),
      db.userProgress.findUnique({ where: { userId } }),
      getMistakePatterns(userId),
      db.skillUnlock.findMany({
        where: { userId, completedAt: null },
        include: { node: true },
        orderBy: { progress: "desc" },
        take: 5,
      }),
      db.userActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ])

  const skillGaps = skillUnlocks.map((su) => ({
    nodeId: su.nodeId,
    title: su.node.title,
    progress: su.progress,
  }))

  const recentActivity = lastActivity
    ? Math.floor((Date.now() - lastActivity.createdAt.getTime()) / (24 * 60 * 60 * 1000))
    : 7

  return {
    profile,
    userProgress: userProgress
      ? {
          currentStreak: userProgress.currentStreak,
          bestStreak: userProgress.bestStreak,
          xp: userProgress.xp,
          level: userProgress.level,
        }
      : null,
    mistakePatterns,
    skillGaps,
    recentActivity,
  }
}

/**
 * Analyze user state to determine mission priorities
 */
function analyzeUserState(context: GenerationContext) {
  const { profile, userProgress, mistakePatterns, skillGaps, recentActivity } = context

  return {
    isBurnoutRisk: profile.burnoutRiskScore > 60,
    isLosingStreak:
      userProgress?.currentStreak &&
      userProgress.currentStreak > 3 &&
      profile.currentLoseStreak > 0,
    hasRecurringMistakes: mistakePatterns.recurringPatterns.length > 0,
    hasWeakTopics:
      Object.values(profile.topicWeaknessMap as Record<string, number>).some(
        (score) => score > 50
      ),
    lowConfidence: profile.confidenceIndex < 40,
    lowMomentum: profile.momentumScore < 40,
    hasSkillGaps: skillGaps.length > 0,
    isReturning: recentActivity > 3,
    isHighPerformer: profile.accuracyRate > 0.8 && profile.momentumScore > 70,
  }
}

/**
 * Generate burnout prevention mission
 */
function generateBurnoutPreventionMission(context: GenerationContext): MissionTemplate {
  return {
    type: "BURNOUT_PREVENTION",
    title: "Quick Win Challenge",
    description: "Complete just 1 easy question today. Sometimes less is more!",
    targetValue: 1,
    xpReward: 30,
    difficultyLevel: 1,
    priorityScore: 95,
    generatedReason: `Burnout risk detected (${context.profile.burnoutRiskScore}%). Light task to maintain habit.`,
  }
}

/**
 * Generate streak protection mission
 */
function generateStreakProtectionMission(context: GenerationContext): MissionTemplate {
  const streak = context.userProgress?.currentStreak || 0
  return {
    type: "STREAK_PROTECTION",
    title: `Protect Your ${streak}-Day Streak!`,
    description: "Complete any question to keep your streak alive.",
    targetValue: 1,
    xpReward: 40 + streak * 2,
    difficultyLevel: 2,
    priorityScore: 90,
    generatedReason: `${streak}-day streak at risk. Priority: maintain momentum.`,
  }
}

/**
 * Generate mistake recovery mission
 */
function generateMistakeRecoveryMission(context: GenerationContext): MissionTemplate {
  const topMistake = context.mistakePatterns.recurringPatterns[0]
  const mistakeType = topMistake?.type || "LOGIC"

  const descriptions: Record<string, string> = {
    LOGIC: "Practice logic problems to strengthen your algorithmic thinking",
    SYNTAX: "Work on syntax drills to build muscle memory",
    TIMEOUT: "Focus on efficiency and avoiding infinite loops",
    MISUNDERSTANDING: "Practice breaking down problem statements",
    CARELESS: "Slow down and double-check your solutions",
    MEMORY: "Review and practice concepts you've forgotten",
    EDGE_CASE: "Practice identifying and handling edge cases",
    TYPE_ERROR: "Focus on type-safe programming patterns",
  }

  return {
    type: "MISTAKE_RECOVERY",
    title: `Fix ${mistakeType.replace("_", " ")} Mistakes`,
    description: descriptions[mistakeType] || "Practice to overcome your weak spots",
    targetValue: 2,
    xpReward: 60,
    difficultyLevel: 2,
    priorityScore: 85,
    targetMistakeType: mistakeType as MistakeType,
    targetSkillArea: topMistake?.skillArea || undefined,
    generatedReason: `Recurring ${mistakeType} errors detected. Targeted practice recommended.`,
  }
}

/**
 * Generate weakness training mission
 */
function generateWeaknessTrainingMission(context: GenerationContext): MissionTemplate {
  const weaknessMap = context.profile.topicWeaknessMap as Record<string, number>
  const weakestTopicId = Object.entries(weaknessMap)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  return {
    type: "WEAKNESS_TRAINING",
    title: "Strengthen Your Weak Spots",
    description: "Focus on topics where you need improvement",
    targetValue: 3,
    xpReward: 75,
    difficultyLevel: 3,
    priorityScore: 80,
    targetTopicId: weakestTopicId,
    generatedReason: "Topic weakness detected. Targeted practice will help.",
  }
}

/**
 * Generate confidence boost mission
 */
function generateConfidenceBoostMission(context: GenerationContext): MissionTemplate {
  return {
    type: "CONFIDENCE_BOOST",
    title: "Confidence Builder",
    description: "Complete 3 questions you're likely to ace. Build momentum!",
    targetValue: 3,
    xpReward: 50,
    difficultyLevel: 1,
    priorityScore: 75,
    generatedReason: `Confidence index low (${context.profile.confidenceIndex}%). Easy wins recommended.`,
  }
}

/**
 * Generate momentum push mission
 */
function generateMomentumPushMission(context: GenerationContext): MissionTemplate {
  return {
    type: "MOMENTUM_PUSH",
    title: "Build Your Momentum",
    description: "Get on a roll! Complete 4 questions in one session.",
    targetValue: 4,
    xpReward: 80,
    difficultyLevel: 2,
    priorityScore: 70,
    generatedReason: `Momentum score low (${context.profile.momentumScore}%). Extended practice session recommended.`,
  }
}

/**
 * Generate skill unlock mission
 */
function generateSkillUnlockMission(context: GenerationContext): MissionTemplate {
  const topGap = context.skillGaps[0]
  return {
    type: "SKILL_UNLOCK",
    title: topGap ? `Unlock: ${topGap.title}` : "Skill Tree Progress",
    description: "Make progress toward unlocking new skills",
    targetValue: 2,
    xpReward: 70,
    difficultyLevel: 3,
    priorityScore: 65,
    generatedReason: topGap
      ? `${topGap.title} is ${Math.round(topGap.progress * 100)}% complete. Keep pushing!`
      : "Work toward skill tree progression.",
  }
}

/**
 * Generate a balanced filler mission
 */
function generateBalancedMission(
  context: GenerationContext,
  existing: MissionTemplate[]
): MissionTemplate | null {
  const existingTypes = new Set(existing.map((m) => m.type))

  // Try different mission types
  const options: MissionTemplate[] = []

  if (!existingTypes.has("REVIEW_SESSION")) {
    options.push({
      type: "REVIEW_SESSION",
      title: "Review Session",
      description: "Revisit and practice questions you've struggled with before",
      targetValue: 2,
      xpReward: 45,
      difficultyLevel: 2,
      priorityScore: 50,
      generatedReason: "Regular review helps retention.",
    })
  }

  if (!existingTypes.has("SPEED_CHALLENGE") && context.profile.accuracyRate > 0.7) {
    options.push({
      type: "SPEED_CHALLENGE",
      title: "Speed Challenge",
      description: "Complete 2 questions faster than your average time",
      targetValue: 2,
      xpReward: 60,
      difficultyLevel: 3,
      priorityScore: 55,
      generatedReason: "Good accuracy. Time to work on speed.",
    })
  }

  if (!existingTypes.has("ACCURACY_FOCUS") && context.profile.accuracyRate < 0.6) {
    options.push({
      type: "ACCURACY_FOCUS",
      title: "Accuracy Focus",
      description: "Complete 2 questions without any failed attempts",
      targetValue: 2,
      xpReward: 55,
      difficultyLevel: 2,
      priorityScore: 60,
      generatedReason: "Focus on getting it right the first time.",
    })
  }

  return options[0] || null
}

/**
 * Save generated missions to the database
 */
export async function saveProMissions(
  userId: string,
  missions: MissionTemplate[],
  scheduledFor: Date = new Date()
): Promise<void> {
  const scheduledDate = startOfDay(scheduledFor)

  // Deactivate previous missions for this date
  await db.proMission.updateMany({
    where: {
      userId,
      scheduledFor: scheduledDate,
      isActive: true,
    },
    data: { isActive: false },
  })

  // Create new missions
  await db.proMission.createMany({
    data: missions.map((m) => ({
      userId,
      title: m.title,
      description: m.description,
      missionType: m.type,
      targetValue: m.targetValue,
      xpReward: m.xpReward,
      difficultyLevel: m.difficultyLevel,
      priorityScore: m.priorityScore,
      targetTopicId: m.targetTopicId,
      targetSkillArea: m.targetSkillArea,
      targetMistakeType: m.targetMistakeType,
      generatedReason: m.generatedReason,
      scheduledFor: scheduledDate,
      expiresAt: addDays(scheduledDate, 1),
      isActive: true,
    })),
  })
}

/**
 * Get active PRO missions for a user
 */
export async function getActiveProMissions(userId: string) {
  const today = startOfDay(new Date())

  return db.proMission.findMany({
    where: {
      userId,
      scheduledFor: today,
      isActive: true,
    },
    orderBy: { priorityScore: "desc" },
  })
}

/**
 * Update mission progress
 */
export async function updateMissionProgress(
  missionId: string,
  incrementBy: number = 1
): Promise<void> {
  const mission = await db.proMission.findUnique({
    where: { id: missionId },
  })

  if (!mission || mission.completedAt) return

  const newProgress = mission.progress + incrementBy
  const isComplete = newProgress >= mission.targetValue

  await db.proMission.update({
    where: { id: missionId },
    data: {
      progress: newProgress,
      completedAt: isComplete ? new Date() : null,
      xpEarned: isComplete ? mission.xpReward : 0,
    },
  })
}

/**
 * Generate and save daily missions for a PRO user
 */
export async function generateAndSaveDailyMissions(userId: string): Promise<void> {
  const missions = await generateDailyMissions(userId, 3)
  await saveProMissions(userId, missions)
}
