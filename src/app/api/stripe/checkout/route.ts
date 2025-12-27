/**
 * Stripe Checkout Session API
 * Creates a checkout session for subscription purchase
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  stripe,
  STRIPE_PRICES,
  getOrCreateStripeCustomer,
  createCheckoutSession,
} from "@/lib/stripe"
import { nanoid } from "nanoid"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const requestId = nanoid(8)
  const startTime = Date.now()

  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.log(`[${requestId}] Checkout: Unauthorized`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await req.json()

    // Only BASIC is purchasable
    if (planId !== "basic") {
      console.log(`[${requestId}] Checkout: Invalid plan ${planId}`)
      return NextResponse.json(
        { error: "Only Basic plan is currently available" },
        { status: 400 }
      )
    }

    // Check price ID exists
    const priceId = STRIPE_PRICES.basic
    if (!priceId) {
      console.error(`[${requestId}] Checkout: Missing STRIPE_PRICE_BASIC env`)
      return NextResponse.json(
        { error: "Payment configuration error" },
        { status: 500 }
      )
    }

    // Get user
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if already active
    if (user.subscription?.status === "ACTIVE") {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      )
    }

    console.log(`[${requestId}] Checkout: Creating session for user ${user.id}`)

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email,
      user.name,
      user.subscription?.stripeCustomerId
    )

    // Update subscription record with customer ID if not set
    if (!user.subscription?.stripeCustomerId) {
      await db.subscription.upsert({
        where: { userId: user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: user.id,
          planId: "basic",
          status: "FREE",
          stripeCustomerId: customerId,
        },
      })
    }

    // Build URLs
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || ""
    const successUrl = `${origin}/dashboard?purchase=success`
    const cancelUrl = `${origin}/pricing?canceled=true`

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      successUrl,
      cancelUrl,
    })

    console.log(
      `[${requestId}] Checkout: Session created ${checkoutSession.id} in ${Date.now() - startTime}ms`
    )

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error(`[${requestId}] Checkout error:`, error)

    // Sentry capture if available
    if (process.env.SENTRY_DSN) {
      try {
        const Sentry = await import("@sentry/nextjs")
        Sentry.captureException(error, {
          extra: { requestId },
        })
      } catch {
        // Sentry not available
      }
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
