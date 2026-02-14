import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserEntitlement, grantEntitlement } from "@/lib/entitlement"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const entitlement = await getUserEntitlement(session.user.id)

    if (entitlement.plan === "BASIC" || entitlement.plan === "PRO") {
      return NextResponse.json(
        { error: "Already upgraded", plan: entitlement.plan },
        { status: 409 }
      )
    }

    await grantEntitlement({
      userId: session.user.id,
      plan: "BASIC",
      grantedByUserId: session.user.id,
      reason: "PayPlus payment - auto upgrade",
    })

    return NextResponse.json({ success: true, plan: "BASIC" })
  } catch (error) {
    console.error("Upgrade complete error:", error)
    return NextResponse.json(
      { error: "Failed to complete upgrade" },
      { status: 500 }
    )
  }
}
