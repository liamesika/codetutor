import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redeemAccessCode } from "@/lib/entitlement"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Access code is required" },
        { status: 400 }
      )
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined
    const userAgent = request.headers.get("user-agent") || undefined

    const result = await redeemAccessCode({
      code: code.trim(),
      userId: session.user.id,
      ip,
      userAgent,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      plan: result.plan,
      message: "Access code redeemed successfully!",
    })
  } catch (error) {
    console.error("Access code redemption error:", error)
    return NextResponse.json(
      { error: "Failed to redeem access code" },
      { status: 500 }
    )
  }
}
