import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Track server start time
const serverStartTime = Date.now()

/**
 * Emergency health check endpoint
 * MUST:
 * - Never throw
 * - Never depend on client-side code
 * - Run fast (<1s)
 * - Return "fail" fields instead of crashing
 */
export async function GET() {
  const checks: Record<string, string> = {}
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

  // Check executor (non-blocking)
  const executorUrl = process.env.EXECUTOR_URL
  if (executorUrl) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const res = await fetch(`${executorUrl}/health`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      checks.executor = res.ok ? "ok" : "fail"
    } catch {
      checks.executor = "unreachable"
      // Don't mark as degraded - executor is optional for health
    }
  } else {
    checks.executor = "not_configured"
  }

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
