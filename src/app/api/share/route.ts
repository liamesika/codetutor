import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { nanoid } from "nanoid"

// Create a shareable achievement
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { shareType, title, description, metadata } = body

    if (!shareType || !title) {
      return NextResponse.json({ error: "Share type and title required" }, { status: 400 })
    }

    const validTypes = ["ACHIEVEMENT", "RANK", "STREAK", "LEVEL", "MILESTONE"]
    if (!validTypes.includes(shareType)) {
      return NextResponse.json({ error: "Invalid share type" }, { status: 400 })
    }

    // Generate unique share code
    const shareCode = nanoid(10)

    // Create shared achievement
    const shared = await db.sharedAchievement.create({
      data: {
        shareCode,
        userId,
        shareType,
        title,
        description: description || "",
        metadata: metadata || {},
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    // Get base URL from headers
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codetutor.dev"
    const shareUrl = `${baseUrl}/share/${shareCode}`

    return NextResponse.json({
      success: true,
      shareCode,
      shareUrl,
      expiresAt: shared.expiresAt,
    })
  } catch (error) {
    console.error("Error creating share:", error)
    return NextResponse.json(
      { error: "Failed to create share" },
      { status: 500 }
    )
  }
}

// Get shareable data for current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get user progress for sharing
    const userProgress = await db.userProgress.findUnique({
      where: { userId },
    })

    // Get user with league placements for rank
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        leaguePlacements: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    // Calculate level from XP
    const xp = userProgress?.xp || 0
    const level = Math.floor(xp / 100) + 1

    // Get total questions solved
    const questionsCompleted = await db.attempt.count({
      where: {
        userId,
        status: "PASS",
      },
    })

    // Get recent achievements
    const recentAchievements = await db.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: "desc" },
      take: 5,
    })

    // Get shared items by user
    const sharedItems = await db.sharedAchievement.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json({
      shareableData: {
        username: user?.name || "Coder",
        level,
        xp,
        currentStreak: userProgress?.currentStreak || 0,
        longestStreak: userProgress?.bestStreak || 0,
        questionsCompleted,
        rank: user?.leaguePlacements?.[0]?.rank || "BRONZE",
        achievements: recentAchievements.map(ua => ({
          id: ua.achievement.id,
          name: ua.achievement.name,
          icon: ua.achievement.icon,
        })),
      },
      recentShares: sharedItems.map(s => ({
        id: s.id,
        shareCode: s.shareCode,
        shareType: s.shareType,
        title: s.title,
        viewCount: s.viewCount,
        createdAt: s.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching share data:", error)
    return NextResponse.json(
      { error: "Failed to fetch share data" },
      { status: 500 }
    )
  }
}
