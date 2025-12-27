import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Execution health check endpoint
 * Returns detailed status of the execution pipeline
 * MUST never throw - returns failure reasons instead
 */
export async function GET() {
  const result: {
    app: "ok" | "fail"
    auth: "ok" | "fail"
    executor: "ok" | "fail" | "not_configured"
    reason?: string
    details?: Record<string, unknown>
  } = {
    app: "ok",
    auth: "fail",
    executor: "fail",
  }

  // Check auth
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      result.auth = "ok"
    } else {
      result.reason = "Not authenticated. Please log in."
    }
  } catch (error) {
    result.auth = "fail"
    result.reason = "Auth check failed"
    console.error("Execute health auth check failed:", error)
  }

  // Check executor
  const executorUrl = process.env.EXECUTOR_URL
  const executorSecret = process.env.EXECUTOR_SECRET

  if (!executorUrl) {
    result.executor = "not_configured"
    result.reason = result.reason || "Executor URL not configured"
  } else {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const headers: Record<string, string> = {}
      if (executorSecret) {
        headers["X-Executor-Secret"] = executorSecret
      }

      const response = await fetch(`${executorUrl}/health`, {
        signal: controller.signal,
        headers,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        result.executor = "ok"
        // Clear reason if both checks pass
        if (result.auth === "ok") {
          delete result.reason
        }
      } else {
        result.executor = "fail"
        result.reason = result.reason || `Executor returned ${response.status}`

        // Check for SSO/auth issues
        if (response.status === 401 || response.status === 403) {
          result.reason = "Executor blocked by authentication. Check EXECUTOR_URL configuration."
        }
      }
    } catch (error) {
      result.executor = "fail"
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          result.reason = result.reason || "Executor timeout (5s)"
        } else {
          result.reason = result.reason || "Executor unreachable"
        }
      }
      console.error("Execute health executor check failed:", error)
    }
  }

  // Add debug details in development
  if (process.env.NODE_ENV === "development") {
    result.details = {
      executorUrl: executorUrl ? `${executorUrl.substring(0, 30)}...` : "not set",
      hasExecutorSecret: !!executorSecret,
      nodeEnv: process.env.NODE_ENV,
    }
  }

  const isHealthy = result.app === "ok" && result.auth === "ok" && result.executor === "ok"

  return NextResponse.json(result, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
