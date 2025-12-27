import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getAccessCodes,
  createAccessCode,
  deactivateAccessCode,
} from "@/lib/entitlement"
import { EntitlementPlan } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const activeOnly = searchParams.get("activeOnly") === "true"

    const result = await getAccessCodes({
      limit,
      offset,
      activeOnly,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Access codes fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch access codes" },
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
    const { plan, maxRedemptions, expiresAt, note } = body

    const rawCode = await createAccessCode({
      plan: plan || EntitlementPlan.BASIC,
      maxRedemptions: maxRedemptions || 1,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdByUserId: session.user.id,
      note,
    })

    return NextResponse.json({
      success: true,
      code: rawCode,
      message: "Access code created. This code will only be shown once!",
    })
  } catch (error) {
    console.error("Create access code error:", error)
    return NextResponse.json(
      { error: "Failed to create access code" },
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
    const { codeId } = body

    if (!codeId) {
      return NextResponse.json(
        { error: "Code ID is required" },
        { status: 400 }
      )
    }

    await deactivateAccessCode(codeId)

    return NextResponse.json({
      success: true,
      message: "Access code deactivated",
    })
  } catch (error) {
    console.error("Deactivate access code error:", error)
    return NextResponse.json(
      { error: "Failed to deactivate access code" },
      { status: 500 }
    )
  }
}
