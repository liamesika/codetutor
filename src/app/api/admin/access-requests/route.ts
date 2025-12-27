import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAccessRequests, processAccessRequest } from "@/lib/entitlement"
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
    const status = searchParams.get("status") as
      | "PENDING"
      | "APPROVED"
      | "REJECTED"
      | undefined

    const result = await getAccessRequests({
      limit,
      offset,
      status: status || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Access requests fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch access requests" },
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
    const { requestId, approve, plan } = body

    if (!requestId || typeof approve !== "boolean") {
      return NextResponse.json(
        { error: "Request ID and approval status are required" },
        { status: 400 }
      )
    }

    const result = await processAccessRequest({
      requestId,
      approve,
      processedBy: session.user.id,
      plan: plan || EntitlementPlan.BASIC,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: approve ? "Access request approved" : "Access request rejected",
    })
  } catch (error) {
    console.error("Process access request error:", error)
    return NextResponse.json(
      { error: "Failed to process access request" },
      { status: 500 }
    )
  }
}
