/**
 * Premium Features Infrastructure - Gating system for premium content
 */

import { db } from "@/lib/db"
import { PremiumType } from "@prisma/client"

// Premium feature codes
export const PREMIUM_FEATURES = {
  // Skill nodes
  ADVANCED_ALGORITHMS: "skill_advanced_algorithms",
  DATA_STRUCTURES_DEEP: "skill_data_structures_deep",
  SYSTEM_DESIGN: "skill_system_design",

  // Challenges
  WEEKLY_CHALLENGE: "challenge_weekly",
  BOSS_CHALLENGE: "challenge_boss",
  SPEED_RUN: "challenge_speed_run",

  // Rewards
  EXCLUSIVE_BADGE: "reward_exclusive_badge",
  XP_MULTIPLIER: "reward_xp_multiplier",
  PRIORITY_SUPPORT: "reward_priority_support",

  // Features
  UNLIMITED_HINTS: "feature_unlimited_hints",
  CODE_REVIEW: "feature_code_review",
  SOLUTION_WALKTHROUGH: "feature_solution_walkthrough",
} as const

export type PremiumFeatureCode = (typeof PREMIUM_FEATURES)[keyof typeof PREMIUM_FEATURES]

/**
 * Check if a feature is premium-gated
 */
export async function isPremiumFeature(code: string): Promise<boolean> {
  const feature = await db.premiumFeature.findUnique({
    where: { code },
  })
  return feature !== null && feature.isActive
}

/**
 * Check if user has access to a premium feature
 * For now, this always returns false since we don't have payments
 */
export async function userHasPremiumAccess(
  userId: string,
  featureCode: string
): Promise<boolean> {
  // TODO: Check user subscription status when payments are implemented
  return false
}

/**
 * Get all premium features by type
 */
export async function getPremiumFeatures(type?: PremiumType) {
  const where = type ? { type, isActive: true } : { isActive: true }
  return db.premiumFeature.findMany({ where })
}

/**
 * Seed premium features (run once on setup)
 */
export async function seedPremiumFeatures() {
  const features = [
    // Premium skill nodes
    {
      code: PREMIUM_FEATURES.ADVANCED_ALGORITHMS,
      name: "Advanced Algorithms",
      description: "Master complex algorithmic patterns and optimization techniques",
      type: PremiumType.SKILL_NODE,
    },
    {
      code: PREMIUM_FEATURES.DATA_STRUCTURES_DEEP,
      name: "Deep Data Structures",
      description: "Advanced data structure implementations and use cases",
      type: PremiumType.SKILL_NODE,
    },
    {
      code: PREMIUM_FEATURES.SYSTEM_DESIGN,
      name: "System Design Basics",
      description: "Learn to design scalable systems",
      type: PremiumType.SKILL_NODE,
    },

    // Premium challenges
    {
      code: PREMIUM_FEATURES.WEEKLY_CHALLENGE,
      name: "Weekly Challenge",
      description: "Compete in exclusive weekly coding challenges",
      type: PremiumType.CHALLENGE,
    },
    {
      code: PREMIUM_FEATURES.BOSS_CHALLENGE,
      name: "Boss Challenges",
      description: "Take on difficult multi-part coding challenges",
      type: PremiumType.CHALLENGE,
    },
    {
      code: PREMIUM_FEATURES.SPEED_RUN,
      name: "Speed Run Mode",
      description: "Race against the clock in timed challenges",
      type: PremiumType.CHALLENGE,
    },

    // Premium rewards
    {
      code: PREMIUM_FEATURES.EXCLUSIVE_BADGE,
      name: "Exclusive Badges",
      description: "Unlock premium-only achievement badges",
      type: PremiumType.REWARD,
    },
    {
      code: PREMIUM_FEATURES.XP_MULTIPLIER,
      name: "2x XP Multiplier",
      description: "Earn double XP on all activities",
      type: PremiumType.REWARD,
    },

    // Premium features
    {
      code: PREMIUM_FEATURES.UNLIMITED_HINTS,
      name: "Unlimited Hints",
      description: "Get unlimited hints without XP penalty",
      type: PremiumType.FEATURE,
    },
    {
      code: PREMIUM_FEATURES.CODE_REVIEW,
      name: "AI Code Review",
      description: "Get detailed AI-powered code review and suggestions",
      type: PremiumType.FEATURE,
    },
    {
      code: PREMIUM_FEATURES.SOLUTION_WALKTHROUGH,
      name: "Solution Walkthroughs",
      description: "Step-by-step video walkthroughs for solutions",
      type: PremiumType.FEATURE,
    },
  ]

  for (const feature of features) {
    await db.premiumFeature.upsert({
      where: { code: feature.code },
      update: feature,
      create: feature,
    })
  }

  return features.length
}

/**
 * Premium gate check result
 */
export interface PremiumGateResult {
  isLocked: boolean
  feature: {
    code: string
    name: string
    description: string
    type: PremiumType
  } | null
  message: string
}

/**
 * Check premium gate for a feature
 */
export async function checkPremiumGate(
  userId: string,
  featureCode: string
): Promise<PremiumGateResult> {
  const feature = await db.premiumFeature.findUnique({
    where: { code: featureCode },
  })

  if (!feature || !feature.isActive) {
    return {
      isLocked: false,
      feature: null,
      message: "",
    }
  }

  const hasAccess = await userHasPremiumAccess(userId, featureCode)

  if (hasAccess) {
    return {
      isLocked: false,
      feature: {
        code: feature.code,
        name: feature.name,
        description: feature.description,
        type: feature.type,
      },
      message: "",
    }
  }

  return {
    isLocked: true,
    feature: {
      code: feature.code,
      name: feature.name,
      description: feature.description,
      type: feature.type,
    },
    message: "Unlocks with Premium",
  }
}
