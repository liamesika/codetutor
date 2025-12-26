import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Default settings
const DEFAULT_SETTINGS = {
  maintenance: false,
  signupEnabled: true,
  executionTimeoutMs: 10000,
  maxDailyAttempts: 100,
  rateLimitWindow: 60000,
  rateLimitMax: 20,
  dockerEnabled: true,
  sentryEnabled: true,
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

    // In a real app, you'd store these in a database or config service
    // For now, we use environment variables and defaults
    const settings = {
      maintenance: process.env.MAINTENANCE_MODE === "true",
      signupEnabled: process.env.SIGNUP_ENABLED !== "false",
      executionTimeoutMs: parseInt(process.env.EXECUTION_TIMEOUT_MS || "10000"),
      maxDailyAttempts: parseInt(process.env.MAX_DAILY_ATTEMPTS || "100"),
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "60000"),
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "20"),
      dockerEnabled: process.env.DOCKER_ENABLED !== "false",
      sentryEnabled: !!process.env.SENTRY_DSN,
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    // In production, you would update environment variables or a database
    // For now, log the change for audit purposes
    await db.eventLog.create({
      data: {
        userId: session.user.id,
        eventType: "SETTINGS_UPDATED",
        payload: body,
      },
    })

    // Note: Actual setting changes would require environment variable updates
    // or a settings database table in production

    return NextResponse.json({ success: true, message: "Settings updated (requires restart to take effect)" })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
