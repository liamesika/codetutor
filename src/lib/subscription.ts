/**
 * Subscription System - Content gating and plan management
 */

import { db } from "@/lib/db"
import { SubscriptionStatus } from "@prisma/client"

// Plan definitions
export const PLANS: Record<string, {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
}> = {
  basic: {
    id: "basic",
    name: "Basic",
    price: 79,
    currency: "ILS",
    features: [
      "Full access to all weeks",
      "All challenges",
      "Daily streak & leagues",
      "Achievements & rank system",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 149,
    currency: "ILS",
    features: [
      "Everything in Basic",
      "Advanced algorithms content",
      "Priority support",
      "Exclusive badges",
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: 100,
    currency: "ILS",
    features: [
      "Everything in Pro",
      "1-on-1 mentorship sessions",
      "Code review sessions",
      "Career guidance",
    ],
  },
}

export type PlanId = keyof typeof PLANS

// Free access rules
export const FREE_ACCESS = {
  maxWeek: 1, // Week 1 is free for all users
}

/**
 * Get user's subscription status
 */
export async function getUserSubscription(userId: string) {
  const subscription = await db.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  })

  if (!subscription) {
    return {
      status: SubscriptionStatus.FREE,
      planId: "basic",
      plan: PLANS.basic,
      hasAccess: false,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      lastPaymentStatus: null,
    }
  }

  return {
    status: subscription.status,
    planId: subscription.planId,
    plan: subscription.plan,
    hasAccess: subscription.status === SubscriptionStatus.ACTIVE,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    lastPaymentStatus: subscription.lastPaymentStatus,
  }
}

/**
 * Check if user can access specific week content
 * IMPORTANT: This checks BOTH subscription AND entitlement for access
 */
export async function canAccessWeek(
  userId: string,
  weekNumber: number
): Promise<{ allowed: boolean; reason?: string }> {
  // Week 1 is always free
  if (weekNumber <= FREE_ACCESS.maxWeek) {
    return { allowed: true }
  }

  // Check subscription first
  const subscription = await getUserSubscription(userId)
  if (subscription.hasAccess) {
    return { allowed: true }
  }

  // CRITICAL: Also check entitlement table (PRO access granted via admin)
  // Import is done dynamically to avoid circular dependency
  const { getUserEntitlement } = await import("@/lib/entitlement")
  const entitlement = await getUserEntitlement(userId)

  console.log("[SUBSCRIPTION] Access check for week", weekNumber, {
    userId,
    subscriptionHasAccess: subscription.hasAccess,
    entitlementHasAccess: entitlement.hasAccess,
    entitlementPlan: entitlement.plan,
    entitlementStatus: entitlement.status,
  })

  if (entitlement.hasAccess) {
    return { allowed: true }
  }

  return {
    allowed: false,
    reason: `Week ${weekNumber} requires an active subscription`,
  }
}

/**
 * Check if user can access a topic by its week
 */
export async function canAccessTopic(
  userId: string,
  topicId: string
): Promise<{ allowed: boolean; weekNumber?: number; reason?: string }> {
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
): Promise<{ allowed: boolean; weekNumber?: number; reason?: string }> {
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
 * Create or update subscription for user
 */
export async function createSubscription(
  userId: string,
  planId: string,
  status: SubscriptionStatus = SubscriptionStatus.FREE
) {
  return db.subscription.upsert({
    where: { userId },
    update: { planId, status },
    create: { userId, planId, status },
  })
}

/**
 * Activate user subscription (called after payment)
 */
export async function activateSubscription(userId: string, planId: string) {
  return db.subscription.upsert({
    where: { userId },
    update: {
      planId,
      status: SubscriptionStatus.ACTIVE,
    },
    create: {
      userId,
      planId,
      status: SubscriptionStatus.ACTIVE,
    },
  })
}

/**
 * Cancel user subscription
 */
export async function cancelSubscription(userId: string) {
  return db.subscription.update({
    where: { userId },
    data: { status: SubscriptionStatus.CANCELED },
  })
}

/**
 * Get subscription guard result for UI
 */
export interface SubscriptionGateResult {
  isLocked: boolean
  weekNumber?: number
  subscription: {
    status: SubscriptionStatus
    planId: string
  }
  message?: string
}

export async function checkSubscriptionGate(
  userId: string,
  weekNumber: number
): Promise<SubscriptionGateResult> {
  const subscription = await getUserSubscription(userId)
  const access = await canAccessWeek(userId, weekNumber)

  return {
    isLocked: !access.allowed,
    weekNumber,
    subscription: {
      status: subscription.status,
      planId: subscription.planId,
    },
    message: access.reason,
  }
}

/**
 * Seed plans into database
 */
export async function seedPlans() {
  const plans = Object.values(PLANS)

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i]
    await db.plan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        features: plan.features,
        orderIndex: i,
      },
      create: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        features: plan.features,
        orderIndex: i,
      },
    })
  }

  return plans.length
}

/**
 * Get all active plans
 */
export async function getActivePlans() {
  return db.plan.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  })
}
