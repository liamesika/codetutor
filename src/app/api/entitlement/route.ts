import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserEntitlement, PLAN_INFO, FREE_ACCESS } from "@/lib/entitlement"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const entitlement = await getUserEntitlement(session.user.id)

    return NextResponse.json({
      entitlement: {
        status: entitlement.status,
        plan: entitlement.plan,
        hasAccess: entitlement.hasAccess,
        expiresAt: entitlement.expiresAt,
        grantedAt: entitlement.grantedAt,
      },
      planInfo: entitlement.plan ? PLAN_INFO[entitlement.plan] : null,
      freeAccess: FREE_ACCESS,
    })
  } catch (error) {
    console.error("Entitlement fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch entitlement" },
      { status: 500 }
    )
  }
}
