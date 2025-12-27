import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { normalizeExecutorUrl } from "@/lib/executor"

interface ExecutorHealthResult {
  app: "ok" | "fail"
  auth: "ok" | "fail"
  executor: "ok" | "fail" | "not_configured"
  reason?: string
  details: {
    executorUrl: string | null
    healthUrl: string | null
    httpStatus?: number
    latencyMs?: number
    errorCode?: string
    hasSecret: boolean
  }
}

/**
 * Execution health check endpoint
 * Returns detailed status of the execution pipeline
 * MUST never throw - returns failure reasons instead
 * Always returns real debug fields for diagnosis
 */
export async function GET() {
  const rawExecutorUrl = process.env.EXECUTOR_URL
  const executorUrl = normalizeExecutorUrl(rawExecutorUrl)
  const executorSecret = process.env.EXECUTOR_SECRET

  const result: ExecutorHealthResult = {
    app: "ok",
    auth: "fail",
    executor: "fail",
    details: {
      executorUrl,
      healthUrl: executorUrl ? `${executorUrl}/health` : null,
      hasSecret: !!executorSecret,
    },
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
  if (!executorUrl) {
    result.executor = "not_configured"
    result.reason = result.reason || (rawExecutorUrl
      ? `Invalid EXECUTOR_URL format: "${rawExecutorUrl}"`
      : "EXECUTOR_URL not configured")
  } else {
    const healthUrl = `${executorUrl}/health`
    const startTime = Date.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(healthUrl, {
        signal: controller.signal,
        headers: {
          "X-Executor-Token": executorSecret || "",
        },
      })
      clearTimeout(timeoutId)

      result.details.latencyMs = Date.now() - startTime
      result.details.httpStatus = response.status

      if (response.ok) {
        result.executor = "ok"
        // Clear reason if both checks pass
        if (result.auth === "ok") {
          delete result.reason
        }
      } else {
        result.executor = "fail"
        result.details.errorCode = `HTTP_${response.status}`

        if (response.status === 401 || response.status === 403) {
          result.reason = result.reason || "Executor auth failed. Check EXECUTOR_SECRET."
        } else {
          result.reason = result.reason || `Executor returned HTTP ${response.status}`
        }
      }
    } catch (error) {
      result.details.latencyMs = Date.now() - startTime
      result.executor = "fail"

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          result.details.errorCode = "TIMEOUT"
          result.reason = result.reason || "Executor health check timed out (5s)"
        } else if (error.message.includes("fetch failed") || error.message.includes("ENOTFOUND")) {
          result.details.errorCode = "DNS_ERROR"
          result.reason = result.reason || `Cannot resolve executor host`
        } else if (error.message.includes("ECONNREFUSED")) {
          result.details.errorCode = "CONNECTION_REFUSED"
          result.reason = result.reason || "Executor refused connection"
        } else {
          result.details.errorCode = "NETWORK_ERROR"
          result.reason = result.reason || error.message
        }
      } else {
        result.details.errorCode = "UNKNOWN_ERROR"
        result.reason = result.reason || "Unknown executor error"
      }
      console.error("Execute health executor check failed:", error)
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
