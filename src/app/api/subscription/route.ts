import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserSubscription, getActivePlans } from "@/lib/subscription"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [subscription, plans] = await Promise.all([
      getUserSubscription(session.user.id),
      getActivePlans(),
    ])

    return NextResponse.json({
      subscription: {
        status: subscription.status,
        planId: subscription.planId,
        hasAccess: subscription.hasAccess,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        lastPaymentStatus: subscription.lastPaymentStatus,
      },
      plans,
    })
  } catch (error) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}
