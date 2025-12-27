/**
 * Stripe Webhook Handler
 * Processes subscription events from Stripe
 */

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe"
import { db } from "@/lib/db"
import { SubscriptionStatus } from "@prisma/client"
import { nanoid } from "nanoid"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Map Stripe subscription status to our status
function mapStripeStatus(stripeStatus: string): SubscriptionStatus {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE
    case "canceled":
      return SubscriptionStatus.CANCELED
    case "past_due":
    case "unpaid":
      return SubscriptionStatus.ACTIVE // Keep active but flag payment status
    case "incomplete":
    case "incomplete_expired":
      return SubscriptionStatus.FREE
    default:
      return SubscriptionStatus.FREE
  }
}

// Handle subscription created/updated
async function handleSubscriptionEvent(
  subscription: Stripe.Subscription,
  requestId: string
) {
  const userId = subscription.metadata.userId
  if (!userId) {
    console.error(`[${requestId}] Webhook: No userId in subscription metadata`)
    return
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id

  const priceId = subscription.items.data[0]?.price?.id || null
  const status = mapStripeStatus(subscription.status)

  // Access subscription period from the raw object (Stripe API v2024+)
  const subData = subscription as unknown as {
    current_period_end?: number
    cancel_at_period_end?: boolean
    latest_invoice?: string | { id: string; status?: string }
  }

  const currentPeriodEnd = subData.current_period_end
    ? new Date(subData.current_period_end * 1000)
    : new Date()
  const cancelAtPeriodEnd = subData.cancel_at_period_end ?? false

  // Determine last payment status from latest invoice
  let lastPaymentStatus = "succeeded"
  if (subData.latest_invoice) {
    const invoiceId =
      typeof subData.latest_invoice === "string"
        ? subData.latest_invoice
        : subData.latest_invoice.id
    try {
      const invoice = await stripe.invoices.retrieve(invoiceId)
      lastPaymentStatus = invoice.status || "succeeded"
    } catch {
      // Invoice fetch failed, assume succeeded
    }
  }

  console.log(
    `[${requestId}] Webhook: Updating subscription for user ${userId}`,
    {
      status,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      lastPaymentStatus,
    }
  )

  await db.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      lastPaymentStatus,
      lastWebhookAt: new Date(),
    },
    create: {
      userId,
      planId: "basic",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      lastPaymentStatus,
      lastWebhookAt: new Date(),
    },
  })

  console.log(`[${requestId}] Webhook: Subscription updated for user ${userId}`)
}

// Handle subscription deleted
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  requestId: string
) {
  const userId = subscription.metadata.userId
  if (!userId) {
    // Try to find by subscription ID
    const existing = await db.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    })
    if (existing) {
      await db.subscription.update({
        where: { id: existing.id },
        data: {
          status: SubscriptionStatus.CANCELED,
          lastWebhookAt: new Date(),
        },
      })
      console.log(
        `[${requestId}] Webhook: Subscription canceled for ${existing.userId}`
      )
    }
    return
  }

  await db.subscription.update({
    where: { userId },
    data: {
      status: SubscriptionStatus.CANCELED,
      lastWebhookAt: new Date(),
    },
  })

  console.log(`[${requestId}] Webhook: Subscription deleted for user ${userId}`)
}

// Handle checkout completed
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  requestId: string
) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error(`[${requestId}] Webhook: No userId in checkout metadata`)
    return
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id

  if (!customerId || !subscriptionId) {
    console.error(
      `[${requestId}] Webhook: Missing customer or subscription ID`
    )
    return
  }

  // Fetch full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  console.log(
    `[${requestId}] Webhook: Checkout completed for user ${userId}, sub ${subscriptionId}`
  )

  await handleSubscriptionEvent(
    { ...subscription, metadata: { ...subscription.metadata, userId } },
    requestId
  )
}

// Handle invoice payment failed
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  requestId: string
) {
  // Access subscription from raw invoice object (Stripe API v2024+)
  const invoiceData = invoice as unknown as {
    subscription?: string | { id: string }
  }

  const subscriptionId =
    typeof invoiceData.subscription === "string"
      ? invoiceData.subscription
      : invoiceData.subscription?.id

  if (!subscriptionId) return

  const existing = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (existing) {
    await db.subscription.update({
      where: { id: existing.id },
      data: {
        lastPaymentStatus: "payment_failed",
        lastWebhookAt: new Date(),
      },
    })
    console.log(
      `[${requestId}] Webhook: Payment failed for subscription ${subscriptionId}`
    )
  }
}

export async function POST(req: NextRequest) {
  const requestId = nanoid(8)
  const startTime = Date.now()

  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error(`[${requestId}] Webhook: Missing signature`)
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      console.error(`[${requestId}] Webhook: Missing webhook secret`)
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error(`[${requestId}] Webhook: Signature verification failed`, err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log(
      `[${requestId}] Webhook: Received event ${event.type} (${event.id})`
    )

    // Handle events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, requestId)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionEvent(subscription, requestId)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription, requestId)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        // Access subscription from raw invoice object (Stripe API v2024+)
        const invoiceData = invoice as unknown as {
          subscription?: string | { id: string }
        }
        const subscriptionId =
          typeof invoiceData.subscription === "string"
            ? invoiceData.subscription
            : invoiceData.subscription?.id
        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId)
          await handleSubscriptionEvent(subscription, requestId)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice, requestId)
        break
      }

      default:
        console.log(`[${requestId}] Webhook: Unhandled event type ${event.type}`)
    }

    console.log(
      `[${requestId}] Webhook: Processed in ${Date.now() - startTime}ms`
    )

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`[${requestId}] Webhook error:`, error)

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
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
