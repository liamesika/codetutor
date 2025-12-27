/**
 * Stripe Billing Portal API
 * Creates a portal session for subscription management
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { createBillingPortalSession } from "@/lib/stripe"
import { nanoid } from "nanoid"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const requestId = nanoid(8)

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      )
    }

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || ""
    const returnUrl = `${origin}/billing`

    console.log(
      `[${requestId}] Portal: Creating session for customer ${subscription.stripeCustomerId}`
    )

    const portalSession = await createBillingPortalSession(
      subscription.stripeCustomerId,
      returnUrl
    )

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error(`[${requestId}] Portal error:`, error)
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    )
  }
}
