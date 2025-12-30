import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getUserRankData } from "@/lib/ranks"
import { getDailyLoginStatus, getStreakMilestones } from "@/lib/daily-login"
import { getUserProgress } from "@/lib/progression"
import { getUserEntitlement, TIER_ACCESS } from "@/lib/entitlement"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch all profile data in parallel
    const [user, progress, rankData, dailyStatus, achievements, entitlement] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      }),
      getUserProgress(userId),
      getUserRankData(userId),
      getDailyLoginStatus(userId),
      db.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: true,
        },
        orderBy: { earnedAt: "desc" },
        take: 10,
      }),
      getUserEntitlement(userId),
    ])

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get topic stats
    const topicStats = await db.userTopicStats.aggregate({
      where: { userId },
      _sum: {
        passCount: true,
        attemptsCount: true,
        totalPoints: true,
      },
      _count: true,
    })

    // Get streak milestones
    const streakMilestones = getStreakMilestones(dailyStatus.streak)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        memberSince: user.createdAt,
      },
      stats: {
        xp: progress.xp,
        level: progress.level,
        xpProgress: progress.xpProgress,
        xpToNextLevel: progress.xpToNextLevel,
        totalSolved: progress.totalSolved,
        currentStreak: progress.currentStreak,
        bestStreak: progress.bestStreak,
        topicsCompleted: topicStats._count,
        totalAttempts: topicStats._sum.attemptsCount || 0,
        totalPassed: topicStats._sum.passCount || 0,
      },
      rank: rankData,
      daily: {
        ...dailyStatus,
        milestones: streakMilestones,
      },
      achievements: achievements.map(ua => ({
        id: ua.achievement.id,
        code: ua.achievement.code,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        points: ua.achievement.points,
        earnedAt: ua.earnedAt,
      })),
      entitlement: {
        plan: entitlement.plan,
        status: entitlement.status,
        maxWeek: entitlement.tier.maxWeek === Infinity ? "unlimited" : entitlement.tier.maxWeek,
        features: {
          hasLearningExplanations: entitlement.tier.hasLearningExplanations,
          hasMissions: entitlement.tier.hasMissions,
          hasAnalytics: entitlement.tier.hasAnalytics,
          hasAIMentor: entitlement.tier.hasAIMentor,
          hasXPBoost: entitlement.tier.hasXPBoost,
        },
      },
    })
  } catch (error) {
    console.error("Profile data error:", error)
    return NextResponse.json(
      { error: "Failed to get profile data" },
      { status: 500 }
    )
  }
}
