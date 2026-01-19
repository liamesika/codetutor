/**
 * Entitlement System - Content gating and access management
 * Single source of truth for all access control
 *
 * TIER DEFINITIONS:
 * - FREE: Week 1 only (onboarding, no premium features)
 * - BASIC: Weeks 1-10 (practice only, no learning explanations, no missions, no AI)
 * - PRO: All weeks + all premium features (learning, missions, analytics, AI coming soon)
 */

import { db } from "@/lib/db"
import { EntitlementPlan, EntitlementStatus } from "@prisma/client"
import crypto from "crypto"

// Valid plans in the system
const VALID_PLANS = ["FREE", "BASIC", "PRO"] as const

// Track if we've logged unknown plan warning (log only once per unknown plan)
const loggedUnknownPlans = new Set<string>()

/**
 * Safely normalize a plan value - guards against legacy/invalid values
 * Returns FREE for any unknown plan (with one-time warning log)
 */
export function normalizePlan(plan: string | null | undefined): EntitlementPlan {
  if (!plan) return "FREE"

  // Valid plan - return as-is
  if (VALID_PLANS.includes(plan as typeof VALID_PLANS[number])) {
    return plan as EntitlementPlan
  }

  // Legacy mapping: ELITE -> PRO
  if (plan === "ELITE") {
    return "PRO"
  }

  // Unknown plan - log once and treat as FREE
  if (!loggedUnknownPlans.has(plan)) {
    loggedUnknownPlans.add(plan)
    console.warn(
      `[ENTITLEMENT] Unknown plan value "${plan}" encountered - treating as FREE. ` +
      `Run migration script: npx tsx prisma/migrate-legacy-plans.ts`
    )
  }

  return "FREE"
}

// Tier-based access rules
export const TIER_ACCESS = {
  FREE: {
    maxWeek: 1,
    hasLearningExplanations: false,
    hasMissions: false,
    hasAnalytics: false,
    hasAIMentor: false,
    hasXPBoost: false,
    hasPremiumChallenges: false,
  },
  BASIC: {
    maxWeek: 10,
    hasLearningExplanations: false,
    hasMissions: false,
    hasAnalytics: false,
    hasAIMentor: false,
    hasXPBoost: false,
    hasPremiumChallenges: false,
  },
  PRO: {
    maxWeek: Infinity, // All weeks
    hasLearningExplanations: true,
    hasMissions: true,
    hasAnalytics: true,
    hasAIMentor: true, // Coming soon
    hasXPBoost: true,
    hasPremiumChallenges: true,
  },
} as const

// Legacy export for backward compatibility
export const FREE_ACCESS = {
  maxWeek: TIER_ACCESS.FREE.maxWeek,
}

// Plan pricing info
export const PLAN_PRICING = {
  FREE: {
    priceUSD: 0,
    priceILS: 0,
    period: "forever",
  },
  BASIC: {
    priceUSD: 9.99,
    priceILS: 30,
    period: "month",
  },
  PRO: {
    priceUSD: 21.90,
    priceILS: 75,
    period: "month",
  },
} as const

// Plan definitions for display purposes
export const PLAN_INFO: Record<EntitlementPlan, {
  name: string
  description: string
  features: string[]
  notIncluded?: string[]
}> = {
  FREE: {
    name: "Free",
    description: "Get started with Week 1",
    features: [
      "Week 1 Java Fundamentals",
      "Real-time code execution",
      "Progress tracking",
      "Daily streak tracking",
    ],
    notIncluded: [
      "Weeks 2-10 curriculum",
      "Learning explanations",
      "Missions & challenges",
      "AI Mentor",
    ],
  },
  BASIC: {
    name: "Basic",
    description: "Full practice access (Weeks 1-10)",
    features: [
      "Weeks 1-10 curriculum",
      "All exercises & practice",
      "XP / Levels / Streak",
      "Leaderboards",
    ],
    notIncluded: [
      "Learning explanations",
      "Missions & challenges",
      "Advanced analytics",
      "AI Mentor",
    ],
  },
  PRO: {
    name: "Pro",
    description: "Complete learning experience",
    features: [
      "All weeks (unlimited)",
      "Full learning explanations",
      "Missions & challenges",
      "Advanced analytics",
      "PRO badge & XP boosts",
      "Premium challenges",
      "AI Mentor (coming soon)",
    ],
  },
}

/**
 * Get user's entitlement status
 */
export async function getUserEntitlement(userId: string) {
  const entitlement = await db.entitlement.findUnique({
    where: { userId },
  })

  if (!entitlement) {
    // No entitlement = FREE tier
    return {
      status: null,
      plan: "FREE" as EntitlementPlan,
      hasAccess: true, // FREE users have access to Week 1
      expiresAt: null,
      grantedAt: null,
      tier: TIER_ACCESS.FREE,
    }
  }

  // Check if expired
  const isExpired = entitlement.expiresAt && entitlement.expiresAt < new Date()
  const isActive = entitlement.status === EntitlementStatus.ACTIVE && !isExpired

  // If expired or not active, treat as FREE
  if (!isActive) {
    return {
      status: isExpired ? EntitlementStatus.EXPIRED : entitlement.status,
      plan: "FREE" as EntitlementPlan,
      hasAccess: true,
      expiresAt: entitlement.expiresAt?.toISOString() || null,
      grantedAt: entitlement.grantedAt.toISOString(),
      tier: TIER_ACCESS.FREE,
    }
  }

  // Normalize plan to guard against legacy/invalid values
  const plan = normalizePlan(entitlement.plan)
  const tier = TIER_ACCESS[plan]

  return {
    status: entitlement.status,
    plan,
    hasAccess: true,
    expiresAt: entitlement.expiresAt?.toISOString() || null,
    grantedAt: entitlement.grantedAt.toISOString(),
    tier,
  }
}

/**
 * Get max week accessible by user's plan
 */
export function getMaxWeekForPlan(plan: EntitlementPlan | null): number {
  const normalizedPlan = normalizePlan(plan)
  return TIER_ACCESS[normalizedPlan].maxWeek
}

/**
 * Check if user is an admin (has ADMIN role)
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role === "ADMIN"
}

/**
 * Check if user can access specific week content
 * Admin users bypass all restrictions and have full access
 */
export async function canAccessWeek(
  userId: string,
  weekNumber: number
): Promise<{ allowed: boolean; reason?: string; requiredPlan?: EntitlementPlan }> {
  // Admin bypass - admins can access all weeks regardless of entitlement
  if (await isUserAdmin(userId)) {
    return { allowed: true }
  }

  const entitlement = await getUserEntitlement(userId)
  const maxWeek = entitlement.tier.maxWeek

  if (weekNumber <= maxWeek) {
    return { allowed: true }
  }

  // Determine which plan is needed
  if (weekNumber <= TIER_ACCESS.BASIC.maxWeek) {
    return {
      allowed: false,
      reason: `Week ${weekNumber} requires Basic or Pro plan`,
      requiredPlan: "BASIC" as EntitlementPlan,
    }
  }

  return {
    allowed: false,
    reason: `Week ${weekNumber} requires Pro plan`,
    requiredPlan: "PRO" as EntitlementPlan,
  }
}

/**
 * Check if user can access a topic by its week
 */
export async function canAccessTopic(
  userId: string,
  topicId: string
): Promise<{ allowed: boolean; weekNumber?: number; reason?: string; requiredPlan?: EntitlementPlan }> {
  const topic = await db.topic.findUnique({
    where: { id: topicId },
    include: {
      week: true,
    },
  })

  if (!topic) {
    return { allowed: false, reason: "Topic not found" }
  }

  const weekNumber = topic.week.weekNumber
  const access = await canAccessWeek(userId, weekNumber)

  return {
    ...access,
    weekNumber,
  }
}

/**
 * Check if user can access a question by its topic's week
 */
export async function canAccessQuestion(
  userId: string,
  questionId: string
): Promise<{ allowed: boolean; weekNumber?: number; reason?: string; requiredPlan?: EntitlementPlan }> {
  const question = await db.question.findUnique({
    where: { id: questionId },
    include: {
      topic: {
        include: { week: true },
      },
    },
  })

  if (!question) {
    return { allowed: false, reason: "Question not found" }
  }

  const weekNumber = question.topic.week.weekNumber
  const access = await canAccessWeek(userId, weekNumber)

  return {
    ...access,
    weekNumber,
  }
}

/**
 * Check if user has a premium feature
 */
export async function hasFeature(
  userId: string,
  feature: keyof typeof TIER_ACCESS.PRO
): Promise<boolean> {
  const entitlement = await getUserEntitlement(userId)
  return entitlement.tier[feature] === true
}

/**
 * Check if user has PRO access
 */
export async function checkProAccess(userId: string): Promise<boolean> {
  const entitlement = await getUserEntitlement(userId)
  return entitlement.plan === "PRO"
}

/**
 * Check if user has BASIC or higher access
 */
export async function checkBasicAccess(userId: string): Promise<boolean> {
  const entitlement = await getUserEntitlement(userId)
  return entitlement.plan === "BASIC" || entitlement.plan === "PRO"
}

/**
 * Grant entitlement to a user (admin action)
 */
export async function grantEntitlement(params: {
  userId: string
  plan: EntitlementPlan
  grantedByUserId: string
  reason?: string
  expiresAt?: Date | null
}) {
  const { userId, plan, grantedByUserId, reason, expiresAt } = params

  return db.entitlement.upsert({
    where: { userId },
    update: {
      plan,
      status: EntitlementStatus.ACTIVE,
      grantedByUserId,
      grantedReason: reason,
      grantedAt: new Date(),
      expiresAt,
      revokedAt: null,
      revokedReason: null,
    },
    create: {
      userId,
      plan,
      status: EntitlementStatus.ACTIVE,
      grantedByUserId,
      grantedReason: reason,
      expiresAt,
    },
  })
}

/**
 * Revoke user's entitlement (admin action)
 */
export async function revokeEntitlement(params: {
  userId: string
  reason?: string
}) {
  const { userId, reason } = params

  return db.entitlement.update({
    where: { userId },
    data: {
      status: EntitlementStatus.REVOKED,
      revokedAt: new Date(),
      revokedReason: reason,
    },
  })
}

/**
 * Hash an access code for secure storage
 */
export function hashAccessCode(code: string): string {
  return crypto.createHash("sha256").update(code.toUpperCase().trim()).digest("hex")
}

/**
 * Generate a random access code
 */
export function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // No I, O, 0, 1 to avoid confusion
  let code = ""
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-"
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

/**
 * Create an access code (admin action)
 */
export async function createAccessCode(params: {
  plan?: EntitlementPlan
  maxRedemptions?: number
  expiresAt?: Date | null
  createdByUserId: string
  note?: string
}) {
  const {
    plan = "BASIC" as EntitlementPlan,
    maxRedemptions = 1,
    expiresAt,
    createdByUserId,
    note,
  } = params

  const rawCode = generateAccessCode()
  const codeHash = hashAccessCode(rawCode)

  await db.accessCode.create({
    data: {
      codeHash,
      plan,
      maxRedemptions,
      expiresAt,
      createdByUserId,
      note,
    },
  })

  // Return the raw code (only shown once)
  return rawCode
}

/**
 * Redeem an access code
 */
export async function redeemAccessCode(params: {
  code: string
  userId: string
  ip?: string
  userAgent?: string
}): Promise<{ success: boolean; error?: string; plan?: EntitlementPlan }> {
  const { code, userId, ip, userAgent } = params
  const codeHash = hashAccessCode(code)

  const accessCode = await db.accessCode.findUnique({
    where: { codeHash },
    include: {
      redemptions: {
        where: { userId },
      },
    },
  })

  if (!accessCode) {
    return { success: false, error: "Invalid access code" }
  }

  if (!accessCode.isActive) {
    return { success: false, error: "This code has been deactivated" }
  }

  if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
    return { success: false, error: "This code has expired" }
  }

  if (accessCode.redeemedCount >= accessCode.maxRedemptions) {
    return { success: false, error: "This code has reached its redemption limit" }
  }

  if (accessCode.redemptions.length > 0) {
    return { success: false, error: "You have already redeemed this code" }
  }

  // Check if user already has a better plan
  const existing = await getUserEntitlement(userId)
  const planHierarchy: Record<EntitlementPlan, number> = { FREE: 0, BASIC: 1, PRO: 2 }
  if (planHierarchy[existing.plan] >= planHierarchy[accessCode.plan]) {
    return { success: false, error: "You already have equal or better access" }
  }

  // Redeem the code
  await db.$transaction([
    db.accessCodeRedemption.create({
      data: {
        accessCodeId: accessCode.id,
        userId,
        ip,
        userAgent,
      },
    }),
    db.accessCode.update({
      where: { id: accessCode.id },
      data: {
        redeemedCount: { increment: 1 },
      },
    }),
    db.entitlement.upsert({
      where: { userId },
      update: {
        plan: accessCode.plan,
        status: EntitlementStatus.ACTIVE,
        grantedAt: new Date(),
        grantedReason: `Redeemed access code`,
        revokedAt: null,
        revokedReason: null,
      },
      create: {
        userId,
        plan: accessCode.plan,
        status: EntitlementStatus.ACTIVE,
        grantedReason: `Redeemed access code`,
      },
    }),
  ])

  return { success: true, plan: accessCode.plan }
}

/**
 * Create an access request
 */
export async function createAccessRequest(params: {
  userId: string
  fullName: string
  email: string
  message?: string
}) {
  const { userId, fullName, email, message } = params

  // Check if user already has pending request
  const existing = await db.accessRequest.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
  })

  if (existing) {
    return { success: false, error: "You already have a pending request" }
  }

  // Check if user already has BASIC or PRO access
  const entitlement = await getUserEntitlement(userId)
  if (entitlement.plan !== "FREE") {
    return { success: false, error: "You already have access" }
  }

  await db.accessRequest.create({
    data: {
      userId,
      fullName,
      email,
      message,
    },
  })

  return { success: true }
}

/**
 * Process an access request (admin action)
 */
export async function processAccessRequest(params: {
  requestId: string
  approve: boolean
  processedBy: string
  plan?: EntitlementPlan
}) {
  const { requestId, approve, processedBy, plan = "BASIC" as EntitlementPlan } = params

  const request = await db.accessRequest.findUnique({
    where: { id: requestId },
  })

  if (!request) {
    return { success: false, error: "Request not found" }
  }

  if (request.status !== "PENDING") {
    return { success: false, error: "Request already processed" }
  }

  if (approve) {
    await db.$transaction([
      db.accessRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          processedAt: new Date(),
          processedBy,
        },
      }),
      db.entitlement.upsert({
        where: { userId: request.userId },
        update: {
          plan,
          status: EntitlementStatus.ACTIVE,
          grantedByUserId: processedBy,
          grantedReason: "Access request approved",
          grantedAt: new Date(),
          revokedAt: null,
          revokedReason: null,
        },
        create: {
          userId: request.userId,
          plan,
          status: EntitlementStatus.ACTIVE,
          grantedByUserId: processedBy,
          grantedReason: "Access request approved",
        },
      }),
    ])
  } else {
    await db.accessRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        processedAt: new Date(),
        processedBy,
      },
    })
  }

  return { success: true }
}

/**
 * Get entitlement guard result for UI
 */
export interface EntitlementGateResult {
  isLocked: boolean
  weekNumber?: number
  entitlement: {
    status: EntitlementStatus | null
    plan: EntitlementPlan
    hasAccess: boolean
  }
  requiredPlan?: EntitlementPlan
  message?: string
}

export async function checkEntitlementGate(
  userId: string,
  weekNumber: number
): Promise<EntitlementGateResult> {
  const entitlement = await getUserEntitlement(userId)
  const access = await canAccessWeek(userId, weekNumber)

  return {
    isLocked: !access.allowed,
    weekNumber,
    entitlement: {
      status: entitlement.status,
      plan: entitlement.plan,
      hasAccess: entitlement.hasAccess,
    },
    requiredPlan: access.requiredPlan,
    message: access.reason,
  }
}

/**
 * Get all access codes with stats (admin)
 */
export async function getAccessCodes(params?: {
  limit?: number
  offset?: number
  activeOnly?: boolean
}) {
  const { limit = 50, offset = 0, activeOnly = false } = params || {}

  const where = activeOnly ? { isActive: true } : {}

  const [codes, total] = await Promise.all([
    db.accessCode.findMany({
      where,
      include: {
        createdBy: { select: { name: true, email: true } },
        _count: { select: { redemptions: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.accessCode.count({ where }),
  ])

  return { codes, total }
}

/**
 * Get all access requests (admin)
 */
export async function getAccessRequests(params?: {
  limit?: number
  offset?: number
  status?: "PENDING" | "APPROVED" | "REJECTED"
}) {
  const { limit = 50, offset = 0, status } = params || {}

  const where = status ? { status } : {}

  const [requests, total] = await Promise.all([
    db.accessRequest.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.accessRequest.count({ where }),
  ])

  return { requests, total }
}

/**
 * Get all entitlements (admin)
 */
export async function getAllEntitlements(params?: {
  limit?: number
  offset?: number
  status?: EntitlementStatus
}) {
  const { limit = 50, offset = 0, status } = params || {}

  const where = status ? { status } : {}

  const [entitlements, total] = await Promise.all([
    db.entitlement.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        grantedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.entitlement.count({ where }),
  ])

  return { entitlements, total }
}

/**
 * Deactivate an access code (admin)
 */
export async function deactivateAccessCode(codeId: string) {
  return db.accessCode.update({
    where: { id: codeId },
    data: { isActive: false },
  })
}

/**
 * Legacy function for backward compatibility
 */
export async function checkEliteAccess(userId: string): Promise<boolean> {
  // ELITE no longer exists, map to PRO
  return checkProAccess(userId)
}
