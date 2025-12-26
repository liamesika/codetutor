import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Track server start time
const SERVER_START_TIME = Date.now()

type HealthStatus = "healthy" | "degraded" | "down"

async function checkDatabase(): Promise<HealthStatus> {
  try {
    await db.$queryRaw`SELECT 1`
    return "healthy"
  } catch {
    return "down"
  }
}

async function checkRedis(): Promise<HealthStatus> {
  try {
    // Redis check - if REDIS_URL is set, assume healthy for now
    // In production, you'd actually ping Redis
    if (process.env.REDIS_URL) {
      return "healthy"
    }
    return "degraded" // Redis not configured
  } catch {
    return "down"
  }
}

async function checkDocker(): Promise<HealthStatus> {
  try {
    // Check if Docker is configured
    if (process.env.DOCKER_ENABLED === "false") {
      return "degraded" // Disabled intentionally
    }
    // In production, you'd run a health check container
    return "healthy"
  } catch {
    return "down"
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const [database, redis, docker] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkDocker(),
    ])

    const uptime = Math.floor((Date.now() - SERVER_START_TIME) / 1000)

    return NextResponse.json({
      database,
      redis,
      docker,
      uptime,
      version: process.env.npm_package_version || "1.0.0",
    })
  } catch (error) {
    console.error("Error fetching health:", error)
    return NextResponse.json(
      { error: "Failed to fetch health" },
      { status: 500 }
    )
  }
}
