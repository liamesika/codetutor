import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { normalizeExecutorUrl, getExecutorConfig } from "@/lib/executor"

// Force Node.js runtime - Edge runtime has issues with env vars
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface ConfigDiagnostics {
  hasExecutorUrl: boolean
  hasExecutorSecret: boolean
  executorUrlNormalized: string | null
  isConfigured: boolean
  env: string
  vercelEnv: string
}

interface ExecutorHealthResult {
  app: "ok" | "fail"
  auth: "ok" | "fail"
  executor: "ok" | "fail" | "not_configured"
  reason?: string
  actionRequired?: string
  config: ConfigDiagnostics
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
 * Returns config diagnostics for debugging
 */
function getConfigDiagnostics(): ConfigDiagnostics {
  const config = getExecutorConfig()
  return {
    hasExecutorUrl: !!process.env.EXECUTOR_URL,
    hasExecutorSecret: !!process.env.EXECUTOR_SECRET,
    executorUrlNormalized: config.url,
    isConfigured: config.isConfigured && !!process.env.EXECUTOR_SECRET,
    env: process.env.NODE_ENV || "unknown",
    vercelEnv: process.env.VERCEL_ENV || "local",
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
  const configDiagnostics = getConfigDiagnostics()

  const result: ExecutorHealthResult = {
    app: "ok",
    auth: "fail",
    executor: "fail",
    config: configDiagnostics,
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
  if (!executorUrl || !executorSecret) {
    result.executor = "not_configured"

    // Build specific reason
    const missingVars: string[] = []
    if (!executorUrl) {
      missingVars.push(rawExecutorUrl ? `EXECUTOR_URL invalid format` : "EXECUTOR_URL not set")
    }
    if (!executorSecret) {
      missingVars.push("EXECUTOR_SECRET not set")
    }

    result.reason = result.reason || missingVars.join(", ")
    result.actionRequired = "Set EXECUTOR_URL and EXECUTOR_SECRET in Vercel Dashboard > Settings > Environment Variables"
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
