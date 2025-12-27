/**
 * Entitlement System - Content gating and access management
 * Single source of truth for all access control
 */

import { db } from "@/lib/db"
import { EntitlementPlan, EntitlementStatus } from "@prisma/client"
import crypto from "crypto"

// Free access rules
export const FREE_ACCESS = {
  maxWeek: 1, // Week 1 is free for all users
}

// Plan definitions for display purposes
export const PLAN_INFO: Record<EntitlementPlan, {
  name: string
  description: string
  features: string[]
}> = {
  BASIC: {
    name: "Basic Access",
    description: "Full access to all course content",
    features: [
      "Full access to all weeks",
      "All challenges & exercises",
      "Daily streak & leagues",
      "Achievements & rank system",
    ],
  },
  PRO: {
    name: "Pro Access",
    description: "Advanced features and support",
    features: [
      "Everything in Basic",
      "Advanced algorithms content",
      "Priority support",
      "Exclusive badges",
    ],
  },
  ELITE: {
    name: "Elite Access",
    description: "Premium mentorship experience",
    features: [
      "Everything in Pro",
      "1-on-1 mentorship sessions",
      "Code review sessions",
      "Career guidance",
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
    return {
      status: null,
      plan: null,
      hasAccess: false,
      expiresAt: null,
      grantedAt: null,
    }
  }

  // Check if expired
  const isExpired = entitlement.expiresAt && entitlement.expiresAt < new Date()
  const hasAccess =
    entitlement.status === EntitlementStatus.ACTIVE && !isExpired

  return {
    status: isExpired ? EntitlementStatus.EXPIRED : entitlement.status,
    plan: entitlement.plan,
    hasAccess,
    expiresAt: entitlement.expiresAt?.toISOString() || null,
    grantedAt: entitlement.grantedAt.toISOString(),
  }
}

/**
 * Check if user can access specific week content
 */
export async function canAccessWeek(
  userId: string,
  weekNumber: number
): Promise<{ allowed: boolean; reason?: string }> {
  // Week 1 is always free
  if (weekNumber <= FREE_ACCESS.maxWeek) {
    return { allowed: true }
  }

  const entitlement = await getUserEntitlement(userId)

  if (entitlement.hasAccess) {
    return { allowed: true }
  }

  return {
    allowed: false,
    reason: `Week ${weekNumber} requires Basic Access or higher`,
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
    plan = EntitlementPlan.BASIC,
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

  // Check if user already has active entitlement
  const existing = await getUserEntitlement(userId)
  if (existing.hasAccess) {
    return { success: false, error: "You already have active access" }
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

  // Check if user already has access
  const entitlement = await getUserEntitlement(userId)
  if (entitlement.hasAccess) {
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
  const { requestId, approve, processedBy, plan = EntitlementPlan.BASIC } = params

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
    plan: EntitlementPlan | null
    hasAccess: boolean
  }
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
