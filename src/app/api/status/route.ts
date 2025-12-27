import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

interface HealthCheck {
  name: string
  status: "healthy" | "degraded" | "unhealthy" | "unknown"
  latency?: number
  message?: string
  lastChecked: string
}

// Track server start time for uptime calculation
const serverStartTime = Date.now()

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now()
  const lastChecked = new Date().toLocaleTimeString()

  try {
    // Simple query to verify DB connectivity
    await db.$queryRaw`SELECT 1`
    const latency = Date.now() - start

    return {
      name: "Database",
      status: latency < 100 ? "healthy" : latency < 500 ? "degraded" : "unhealthy",
      latency,
      message: "PostgreSQL connection active",
      lastChecked,
    }
  } catch (error) {
    return {
      name: "Database",
      status: "unhealthy",
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : "Connection failed",
      lastChecked,
    }
  }
}

async function checkAPI(): Promise<HealthCheck> {
  const start = Date.now()
  const lastChecked = new Date().toLocaleTimeString()

  try {
    // API is healthy if we can process requests (we're in this handler)
    const latency = Date.now() - start

    return {
      name: "API",
      status: "healthy",
      latency,
      message: "Next.js API routes operational",
      lastChecked,
    }
  } catch (error) {
    return {
      name: "API",
      status: "unhealthy",
      message: error instanceof Error ? error.message : "API error",
      lastChecked,
    }
  }
}

async function checkExecutor(): Promise<HealthCheck> {
  const start = Date.now()
  const lastChecked = new Date().toLocaleTimeString()

  const executorUrl = process.env.EXECUTOR_URL || "http://localhost:8080"

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${executorUrl}/health`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const latency = Date.now() - start

    if (response.ok) {
      return {
        name: "Executor",
        status: latency < 200 ? "healthy" : "degraded",
        latency,
        message: "Java sandbox executor ready",
        lastChecked,
      }
    }

    return {
      name: "Executor",
      status: "degraded",
      latency,
      message: `Executor returned status ${response.status}`,
      lastChecked,
    }
  } catch (error) {
    return {
      name: "Executor",
      status: "unhealthy",
      latency: Date.now() - start,
      message:
        error instanceof Error
          ? error.name === "AbortError"
            ? "Connection timeout"
            : "Executor unreachable"
          : "Connection failed",
      lastChecked,
    }
  }
}

async function checkAuth(): Promise<HealthCheck> {
  const start = Date.now()
  const lastChecked = new Date().toLocaleTimeString()

  try {
    const session = await getServerSession(authOptions)
    const latency = Date.now() - start

    return {
      name: "Auth",
      status: "healthy",
      latency,
      message: session ? "Session active" : "Auth service ready",
      lastChecked,
    }
  } catch (error) {
    return {
      name: "Auth",
      status: "unhealthy",
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : "Auth check failed",
      lastChecked,
    }
  }
}

async function checkRedis(): Promise<HealthCheck> {
  const lastChecked = new Date().toLocaleTimeString()

  // Check if Redis URL is configured
  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL

  if (!redisUrl) {
    return {
      name: "Redis",
      status: "unknown",
      message: "Redis not configured (optional)",
      lastChecked,
    }
  }

  const start = Date.now()

  try {
    // For Upstash REST API
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const response = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/ping`,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
        }
      )

      const latency = Date.now() - start

      if (response.ok) {
        return {
          name: "Redis",
          status: latency < 100 ? "healthy" : "degraded",
          latency,
          message: "Upstash Redis connected",
          lastChecked,
        }
      }
    }

    return {
      name: "Redis",
      status: "unknown",
      message: "Redis configured but not verified",
      lastChecked,
    }
  } catch (error) {
    return {
      name: "Redis",
      status: "unhealthy",
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : "Redis check failed",
      lastChecked,
    }
  }
}

export async function GET() {
  try {
    // Run all health checks in parallel
    const [database, api, executor, auth, redis] = await Promise.all([
      checkDatabase(),
      checkAPI(),
      checkExecutor(),
      checkAuth(),
      checkRedis(),
    ])

    const checks = [database, api, executor, auth, redis]

    // Determine overall status
    const hasUnhealthy = checks.some((c) => c.status === "unhealthy")
    const hasDegraded = checks.some((c) => c.status === "degraded")

    let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy"
    if (hasUnhealthy) {
      overallStatus = "unhealthy"
    } else if (hasDegraded) {
      overallStatus = "degraded"
    }

    // Get version info
    const version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"
    const commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev"
    const environment = process.env.NODE_ENV || "development"

    return NextResponse.json({
      version: `${version} (${commitHash})`,
      environment,
      uptime: formatUptime(Date.now() - serverStartTime),
      checks,
      overallStatus,
    })
  } catch (error) {
    console.error("Error in status check:", error)

    return NextResponse.json(
      {
        version: "unknown",
        environment: process.env.NODE_ENV || "unknown",
        uptime: "unknown",
        checks: [],
        overallStatus: "unhealthy" as const,
        error: "Failed to perform health checks",
      },
      { status: 500 }
    )
  }
}
