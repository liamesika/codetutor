import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createAccessRequest, getUserEntitlement } from "@/lib/entitlement"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's access request if any
    const request = await db.accessRequest.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ request })
  } catch (error) {
    console.error("Access request fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch access request" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, email, message } = body

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Check if already has access
    const entitlement = await getUserEntitlement(session.user.id)
    if (entitlement.hasAccess) {
      return NextResponse.json(
        { error: "You already have access" },
        { status: 400 }
      )
    }

    const result = await createAccessRequest({
      userId: session.user.id,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      message: message?.trim(),
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Access request submitted successfully!",
    })
  } catch (error) {
    console.error("Access request submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit access request" },
      { status: 500 }
    )
  }
}
