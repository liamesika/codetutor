import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { startOfMonth, isSameMonth } from "date-fns"

// PRO features configuration
export const PRO_FEATURES = {
  AI_CREDITS_MONTHLY: 50,
  XP_BOOST_PERCENT: 25,
  STREAK_SHIELD_PER_MONTH: 1,
  PRO_SKILL_PATHS: [
    "advanced-algorithms",
    "system-design",
    "competitive-programming",
    "interview-prep",
  ],
  PROFILE_HIGHLIGHTS: ["gold", "purple", "diamond", "rainbow"],
  BADGES: ["pro-crown", "speed-demon", "perfectionist", "mentor"],
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Check entitlement
    const entitlement = await db.entitlement.findUnique({
      where: { userId },
    })

    const isPro = entitlement?.plan === "PRO"

    if (!isPro) {
      return NextResponse.json({
        isPro: false,
        features: PRO_FEATURES,
        message: "Upgrade to PRO to unlock premium features",
      })
    }

    // Get or create pro profile
    let proProfile = await db.proProfile.findUnique({
      where: { userId },
    })

    // Reset monthly credits if new month
    const now = new Date()
    if (proProfile && !isSameMonth(proProfile.lastResetAt, now)) {
      proProfile = await db.proProfile.update({
        where: { userId },
        data: {
          aiCreditsRemaining: PRO_FEATURES.AI_CREDITS_MONTHLY,
          aiCreditsUsedMonth: 0,
          shieldUsedThisMonth: false,
          lastResetAt: startOfMonth(now),
        },
      })
    }

    if (!proProfile) {
      proProfile = await db.proProfile.create({
        data: {
          userId,
          aiCreditsRemaining: PRO_FEATURES.AI_CREDITS_MONTHLY,
          lastResetAt: startOfMonth(now),
        },
      })
    }

    // Get user progress for streak info
    const userProgress = await db.userProgress.findUnique({
      where: { userId },
    })

    return NextResponse.json({
      isPro: true,
      profile: {
        aiCreditsRemaining: proProfile.aiCreditsRemaining,
        aiCreditsTotal: PRO_FEATURES.AI_CREDITS_MONTHLY,
        shieldAvailable: !proProfile.shieldUsedThisMonth,
        shieldLastUsed: proProfile.shieldLastUsed,
        xpBoostActive: proProfile.xpBoostActive,
        xpBoostPercent: PRO_FEATURES.XP_BOOST_PERCENT,
        unlockedProNodes: proProfile.unlockedProNodes,
        profileHighlight: proProfile.profileHighlight,
        customBadge: proProfile.customBadge,
      },
      features: PRO_FEATURES,
      currentStreak: userProgress?.currentStreak || 0,
    })
  } catch (error) {
    console.error("Error fetching pro profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch pro profile" },
      { status: 500 }
    )
  }
}

// Update pro profile settings
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    // Check entitlement
    const entitlement = await db.entitlement.findUnique({
      where: { userId },
    })

    if (entitlement?.plan !== "PRO") {
      return NextResponse.json({ error: "PRO subscription required" }, { status: 403 })
    }

    const { profileHighlight, customBadge, xpBoostActive } = body

    const updated = await db.proProfile.update({
      where: { userId },
      data: {
        ...(profileHighlight && PRO_FEATURES.PROFILE_HIGHLIGHTS.includes(profileHighlight)
          ? { profileHighlight }
          : {}),
        ...(customBadge !== undefined ? { customBadge } : {}),
        ...(xpBoostActive !== undefined ? { xpBoostActive } : {}),
      },
    })

    return NextResponse.json({ profile: updated })
  } catch (error) {
    console.error("Error updating pro profile:", error)
    return NextResponse.json(
      { error: "Failed to update pro profile" },
      { status: 500 }
    )
  }
}

// Use streak shield
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { action } = body

    // Check entitlement
    const entitlement = await db.entitlement.findUnique({
      where: { userId },
    })

    if (entitlement?.plan !== "PRO") {
      return NextResponse.json({ error: "PRO subscription required" }, { status: 403 })
    }

    const proProfile = await db.proProfile.findUnique({
      where: { userId },
    })

    if (!proProfile) {
      return NextResponse.json({ error: "Pro profile not found" }, { status: 404 })
    }

    if (action === "use-shield") {
      if (proProfile.shieldUsedThisMonth) {
        return NextResponse.json({ error: "Shield already used this month" }, { status: 400 })
      }

      // Protect the streak
      const userProgress = await db.userProgress.findUnique({
        where: { userId },
      })

      if (!userProgress || userProgress.currentStreak === 0) {
        return NextResponse.json({ error: "No streak to protect" }, { status: 400 })
      }

      // Mark shield as used and restore streak
      await db.proProfile.update({
        where: { userId },
        data: {
          shieldUsedThisMonth: true,
          shieldLastUsed: new Date(),
        },
      })

      // Update last active date to today to protect streak
      await db.userProgress.update({
        where: { userId },
        data: {
          lastActiveDate: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Streak protected!",
        streakPreserved: userProgress.currentStreak,
      })
    }

    if (action === "use-ai-credit") {
      if (proProfile.aiCreditsRemaining <= 0) {
        return NextResponse.json({ error: "No AI credits remaining" }, { status: 400 })
      }

      await db.proProfile.update({
        where: { userId },
        data: {
          aiCreditsRemaining: { decrement: 1 },
          aiCreditsUsedMonth: { increment: 1 },
        },
      })

      return NextResponse.json({
        success: true,
        creditsRemaining: proProfile.aiCreditsRemaining - 1,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing pro action:", error)
    return NextResponse.json(
      { error: "Failed to process action" },
      { status: 500 }
    )
  }
}
