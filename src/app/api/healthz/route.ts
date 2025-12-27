import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { normalizeExecutorUrl } from "@/lib/executor"

// Force Node.js runtime - Edge runtime has issues with env vars
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Track server start time
const serverStartTime = Date.now()

interface ExecutorCheck {
  status: "ok" | "fail" | "not_configured" | "unreachable"
  executorUrl: string | null
  healthUrl: string | null
  httpStatus?: number
  errorCode?: string
  errorMessage?: string
  latencyMs?: number
}

/**
 * Emergency health check endpoint
 * MUST:
 * - Never throw
 * - Never depend on client-side code
 * - Run fast (<1s)
 * - Return "fail" fields instead of crashing
 * - Return real debug fields for executor issues
 */
export async function GET() {
  const checks: Record<string, string | ExecutorCheck> = {}
  let overallStatus = "ok"

  // Check database
  try {
    const start = Date.now()
    await db.$queryRaw`SELECT 1`
    const latency = Date.now() - start
    checks.db = latency < 1000 ? "ok" : "slow"
  } catch (error) {
    checks.db = "fail"
    overallStatus = "degraded"
    console.error("Healthz DB check failed:", error)
  }

  // Check executor with full debug info
  const rawExecutorUrl = process.env.EXECUTOR_URL
  const normalizedUrl = normalizeExecutorUrl(rawExecutorUrl)

  const executorCheck: ExecutorCheck = {
    status: "not_configured",
    executorUrl: normalizedUrl,
    healthUrl: normalizedUrl ? `${normalizedUrl}/health` : null,
  }

  if (!normalizedUrl) {
    executorCheck.status = "not_configured"
    executorCheck.errorMessage = rawExecutorUrl
      ? `Invalid EXECUTOR_URL: "${rawExecutorUrl}"`
      : "EXECUTOR_URL not set"
  } else {
    const healthUrl = `${normalizedUrl}/health`
    const startTime = Date.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const res = await fetch(healthUrl, {
        signal: controller.signal,
        headers: {
          "X-Executor-Token": process.env.EXECUTOR_SECRET || "",
        },
      })
      clearTimeout(timeoutId)

      executorCheck.latencyMs = Date.now() - startTime
      executorCheck.httpStatus = res.status

      if (res.ok) {
        executorCheck.status = "ok"
      } else {
        executorCheck.status = "fail"
        executorCheck.errorCode = `HTTP_${res.status}`

        // Provide specific error messages
        if (res.status === 401 || res.status === 403) {
          executorCheck.errorMessage = "Authentication failed - check EXECUTOR_SECRET"
        } else if (res.status >= 500) {
          executorCheck.errorMessage = "Executor server error"
        } else {
          const text = await res.text().catch(() => "")
          executorCheck.errorMessage = text.substring(0, 200) || `HTTP ${res.status}`
        }
      }
    } catch (error) {
      executorCheck.latencyMs = Date.now() - startTime
      executorCheck.status = "unreachable"

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          executorCheck.errorCode = "TIMEOUT"
          executorCheck.errorMessage = "Health check timed out after 5s"
        } else if (error.message.includes("fetch failed") || error.message.includes("ENOTFOUND")) {
          executorCheck.errorCode = "DNS_ERROR"
          executorCheck.errorMessage = `Cannot resolve host: ${normalizedUrl}`
        } else if (error.message.includes("ECONNREFUSED")) {
          executorCheck.errorCode = "CONNECTION_REFUSED"
          executorCheck.errorMessage = "Connection refused by executor"
        } else {
          executorCheck.errorCode = "NETWORK_ERROR"
          executorCheck.errorMessage = error.message
        }
      } else {
        executorCheck.errorCode = "UNKNOWN_ERROR"
        executorCheck.errorMessage = String(error)
      }
    }
  }

  checks.executor = executorCheck

  // Calculate uptime
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000)

  // Get version info
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local"

  return NextResponse.json(
    {
      status: overallStatus,
      env: process.env.NODE_ENV || "unknown",
      version: `${version}-${commitSha}`,
      uptime: uptimeSeconds,
      checks,
      timestamp: new Date().toISOString(),
    },
    {
      status: overallStatus === "ok" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
