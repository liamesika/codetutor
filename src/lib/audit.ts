import { db } from "./db"
import * as Sentry from "@sentry/nextjs"
import type { Prisma } from "@prisma/client"

// Audit event types
export type AuditEventType =
  | "USER_REGISTERED"
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "CODE_SUBMITTED"
  | "CODE_CHECK"
  | "QUESTION_PASSED"
  | "QUESTION_FAILED"
  | "HINT_USED"
  | "SOLUTION_REVEALED"
  | "ADAPTIVE_SELECTION"
  | "COURSE_ENROLLED"
  | "ACHIEVEMENT_UNLOCKED"
  | "SETTINGS_UPDATED"
  | "TOPIC_UPDATED"
  | "WEEK_UPDATED"
  | "QUESTION_CREATED"
  | "QUESTION_UPDATED"
  | "QUESTION_DELETED"
  | "ADMIN_ACTION"
  | "RATE_LIMIT_EXCEEDED"
  | "SECURITY_ALERT"

export interface AuditLogEntry {
  userId?: string
  eventType: AuditEventType
  payload?: Record<string, unknown>
  metadata?: {
    ip?: string
    userAgent?: string
    sessionId?: string
    [key: string]: unknown
  }
}

/**
 * Log an audit event to the database and Sentry (if severe)
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // Store in database
    await db.eventLog.create({
      data: {
        userId: entry.userId || null,
        eventType: entry.eventType,
        payload: (entry.payload || {}) as Prisma.InputJsonValue,
        metadata: (entry.metadata || {}) as Prisma.InputJsonValue,
      },
    })

    // For security-related events, also log to Sentry
    if (
      entry.eventType === "SECURITY_ALERT" ||
      entry.eventType === "RATE_LIMIT_EXCEEDED"
    ) {
      Sentry.captureMessage(`Security Event: ${entry.eventType}`, {
        level: entry.eventType === "SECURITY_ALERT" ? "warning" : "info",
        tags: {
          eventType: entry.eventType,
          userId: entry.userId || "anonymous",
        },
        extra: entry.payload,
      })
    }
  } catch (error) {
    // Don't throw - audit logging should never break the main flow
    console.error("Failed to log audit event:", error)
    Sentry.captureException(error, {
      tags: { component: "audit" },
      extra: { entry },
    })
  }
}

/**
 * Helper to create audit log entry from request context
 */
export function createAuditContext(request: Request): AuditLogEntry["metadata"] {
  return {
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
  }
}

/**
 * Log a user action with context
 */
export async function logUserAction(
  userId: string,
  eventType: AuditEventType,
  payload: Record<string, unknown>,
  request?: Request
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType,
    payload,
    metadata: request ? createAuditContext(request) : undefined,
  })
}

/**
 * Log a security alert
 */
export async function logSecurityAlert(
  userId: string | undefined,
  reason: string,
  details: Record<string, unknown>,
  request?: Request
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType: "SECURITY_ALERT",
    payload: { reason, ...details },
    metadata: request ? createAuditContext(request) : undefined,
  })
}

/**
 * Query audit logs for a user
 */
export async function getAuditLogsForUser(
  userId: string,
  options: {
    limit?: number
    offset?: number
    eventTypes?: AuditEventType[]
    startDate?: Date
    endDate?: Date
  } = {}
) {
  const { limit = 50, offset = 0, eventTypes, startDate, endDate } = options

  return db.eventLog.findMany({
    where: {
      userId,
      ...(eventTypes && eventTypes.length > 0 && {
        eventType: { in: eventTypes },
      }),
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  })
}

/**
 * Query recent security events
 */
export async function getSecurityEvents(limit = 100) {
  return db.eventLog.findMany({
    where: {
      eventType: {
        in: ["SECURITY_ALERT", "RATE_LIMIT_EXCEEDED"],
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}
