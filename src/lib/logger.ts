/**
 * Structured logging utility for CodeTutor
 * Provides consistent log formatting with levels and context
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
  userId?: string
  route?: string
  action?: string
  duration?: number
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Get minimum log level from environment
const MIN_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "info"
const IS_PRODUCTION = process.env.NODE_ENV === "production"

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL]
}

function formatLogEntry(entry: LogEntry): string {
  if (IS_PRODUCTION) {
    // JSON format for production (structured logs)
    return JSON.stringify(entry)
  }

  // Pretty format for development
  const timestamp = entry.timestamp.split("T")[1].split(".")[0]
  const levelColors: Record<LogLevel, string> = {
    debug: "\x1b[36m", // cyan
    info: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
  }
  const reset = "\x1b[0m"
  const color = levelColors[entry.level]

  let output = `${color}[${timestamp}] ${entry.level.toUpperCase().padEnd(5)}${reset} ${entry.message}`

  if (entry.context && Object.keys(entry.context).length > 0) {
    output += ` ${JSON.stringify(entry.context)}`
  }

  if (entry.error) {
    output += `\n  Error: ${entry.error.message}`
    if (entry.error.stack && !IS_PRODUCTION) {
      output += `\n${entry.error.stack}`
    }
  }

  return output
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    error: error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : undefined,
  }
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (!shouldLog("debug")) return
    console.debug(formatLogEntry(createLogEntry("debug", message, context)))
  },

  info(message: string, context?: LogContext): void {
    if (!shouldLog("info")) return
    console.info(formatLogEntry(createLogEntry("info", message, context)))
  },

  warn(message: string, context?: LogContext, error?: Error): void {
    if (!shouldLog("warn")) return
    console.warn(formatLogEntry(createLogEntry("warn", message, context, error)))
  },

  error(message: string, context?: LogContext, error?: Error): void {
    if (!shouldLog("error")) return
    console.error(formatLogEntry(createLogEntry("error", message, context, error)))

    // Send to Sentry in production
    if (IS_PRODUCTION && error) {
      try {
        const Sentry = require("@sentry/nextjs")
        Sentry.captureException(error, {
          extra: context,
          tags: {
            route: context?.route,
            action: context?.action,
          },
        })
      } catch {
        // Sentry not available
      }
    }
  },

  // Helper for timing operations
  time(label: string): () => number {
    const start = Date.now()
    return () => {
      const duration = Date.now() - start
      logger.debug(`${label} completed`, { duration })
      return duration
    }
  },

  // Helper for API route logging
  apiRequest(
    route: string,
    method: string,
    userId?: string
  ): { end: (status: number) => void } {
    const start = Date.now()
    logger.info(`${method} ${route}`, { route, userId, action: "request" })

    return {
      end(status: number) {
        const duration = Date.now() - start
        const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info"
        logger[level](`${method} ${route} -> ${status}`, {
          route,
          userId,
          action: "response",
          duration,
          status,
        } as LogContext)
      },
    }
  },
}

/**
 * User-friendly error messages
 * Maps technical errors to human-readable messages
 */
export const userFriendlyErrors: Record<string, string> = {
  // Auth errors
  UNAUTHORIZED: "Please sign in to continue",
  FORBIDDEN: "You don't have permission to do this",
  SESSION_EXPIRED: "Your session has expired. Please sign in again",

  // Database errors
  P2002: "This record already exists",
  P2025: "Record not found",
  DATABASE_ERROR: "We're having trouble saving your data. Please try again",

  // Validation errors
  VALIDATION_ERROR: "Please check your input and try again",
  INVALID_INPUT: "The provided data is invalid",

  // Network errors
  NETWORK_ERROR: "Unable to connect. Please check your internet connection",
  TIMEOUT: "The request took too long. Please try again",

  // Executor errors
  EXECUTOR_UNAVAILABLE: "The code execution service is temporarily unavailable",
  COMPILATION_ERROR: "Your code has compilation errors",
  RUNTIME_ERROR: "Your code encountered a runtime error",
  TIMEOUT_EXCEEDED: "Your code took too long to execute",

  // Generic fallback
  UNKNOWN_ERROR: "Something went wrong. Please try again later",
}

export function getUserFriendlyMessage(
  error: Error | string,
  fallback?: string
): string {
  const errorKey =
    typeof error === "string" ? error : (error as { code?: string }).code || error.message

  // Check for Prisma error codes
  if (errorKey.startsWith("P")) {
    return userFriendlyErrors[errorKey] || userFriendlyErrors.DATABASE_ERROR
  }

  return (
    userFriendlyErrors[errorKey] ||
    fallback ||
    userFriendlyErrors.UNKNOWN_ERROR
  )
}

/**
 * Creates a standardized API error response
 */
export function createErrorResponse(
  error: Error | string,
  status: number = 500,
  context?: LogContext
) {
  const message =
    typeof error === "string" ? error : getUserFriendlyMessage(error)

  if (error instanceof Error) {
    logger.error("API Error", context, error)
  } else {
    logger.error("API Error", { ...context, errorMessage: error })
  }

  return {
    error: message,
    status,
  }
}
