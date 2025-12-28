import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { EntitlementPlan, EntitlementStatus } from "@prisma/client"

// Force dynamic - no caching
export const dynamic = "force-dynamic"

// Admin emails allowed to grant PRO access
const ADMIN_EMAILS = [
  "liamesika21@gmail.com",
  "admin@codetutor.dev",
]

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, plan = "PRO" } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find the user by email
    const user = await db.user.findUnique({
      where: { email },
      include: { entitlement: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: `User not found: ${email}` },
        { status: 404 }
      )
    }

    // Validate plan
    const validPlans = ["BASIC", "PRO", "ELITE"]
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: `Invalid plan: ${plan}. Valid plans: ${validPlans.join(", ")}` },
        { status: 400 }
      )
    }

    // Grant entitlement
    const entitlement = await db.entitlement.upsert({
      where: { userId: user.id },
      update: {
        plan: plan as EntitlementPlan,
        status: EntitlementStatus.ACTIVE,
        grantedAt: new Date(),
        grantedByUserId: session.user.id,
        grantedReason: `Admin grant via API by ${session.user.email}`,
        expiresAt: null, // Lifetime access
        revokedAt: null,
        revokedReason: null,
      },
      create: {
        userId: user.id,
        plan: plan as EntitlementPlan,
        status: EntitlementStatus.ACTIVE,
        grantedByUserId: session.user.id,
        grantedReason: `Admin grant via API by ${session.user.email}`,
        expiresAt: null, // Lifetime access
      },
    })

    console.log(`[ADMIN] PRO access granted to ${email} by ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: `${plan} access granted to ${email}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      entitlement: {
        id: entitlement.id,
        plan: entitlement.plan,
        status: entitlement.status,
        grantedAt: entitlement.grantedAt,
        expiresAt: entitlement.expiresAt,
      },
    })
  } catch (error) {
    console.error("[ADMIN] Error granting PRO access:", error)
    return NextResponse.json(
      { error: "Failed to grant access" },
      { status: 500 }
    )
  }
}

// GET endpoint to check current entitlement
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      )
    }

    // Find the user by email
    const user = await db.user.findUnique({
      where: { email },
      include: { entitlement: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: `User not found: ${email}` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      entitlement: user.entitlement
        ? {
            id: user.entitlement.id,
            plan: user.entitlement.plan,
            status: user.entitlement.status,
            grantedAt: user.entitlement.grantedAt,
            expiresAt: user.entitlement.expiresAt,
          }
        : null,
    })
  } catch (error) {
    console.error("[ADMIN] Error checking entitlement:", error)
    return NextResponse.json(
      { error: "Failed to check entitlement" },
      { status: 500 }
    )
  }
}
