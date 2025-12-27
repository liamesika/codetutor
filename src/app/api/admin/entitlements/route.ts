import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getAllEntitlements,
  grantEntitlement,
  revokeEntitlement,
} from "@/lib/entitlement"
import { EntitlementPlan, EntitlementStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status") as EntitlementStatus | undefined

    const result = await getAllEntitlements({
      limit,
      offset,
      status: status || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Entitlements fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch entitlements" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, plan, reason, expiresAt } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const entitlement = await grantEntitlement({
      userId,
      plan: plan || EntitlementPlan.BASIC,
      grantedByUserId: session.user.id,
      reason,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    })

    return NextResponse.json({
      success: true,
      entitlement,
    })
  } catch (error) {
    console.error("Grant entitlement error:", error)
    return NextResponse.json(
      { error: "Failed to grant entitlement" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, reason } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const entitlement = await revokeEntitlement({
      userId,
      reason,
    })

    return NextResponse.json({
      success: true,
      entitlement,
    })
  } catch (error) {
    console.error("Revoke entitlement error:", error)
    return NextResponse.json(
      { error: "Failed to revoke entitlement" },
      { status: 500 }
    )
  }
}
