import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get XP from UserProgress (single source of truth, same as /api/progression)
    const userProgress = await db.userProgress.findUnique({
      where: { userId },
    })
    const totalPoints = userProgress?.xp ?? 0
    const streak = userProgress?.currentStreak ?? 0

    // Get attempts summary
    const attemptsCount = await db.attempt.count({
      where: { userId },
    })

    const passCount = await db.attempt.count({
      where: { userId, status: "PASS" },
    })

    // Get achievements count
    const achievementsCount = await db.userAchievement.count({
      where: { userId },
    })

    // Get weakest topics
    const weakTopics = await db.userTopicStats.findMany({
      where: {
        userId,
        attemptsCount: { gt: 0 },
      },
      orderBy: [
        { skillLevel: "asc" },
        { attemptsCount: "desc" },
      ],
      take: 3,
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    // Get recent activity
    const recentAttempts = await db.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        question: {
          select: {
            id: true,
            title: true,
            topic: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      totalPoints,
      streak,
      attemptsCount,
      passCount,
      passRate: attemptsCount > 0 ? Math.round((passCount / attemptsCount) * 100) : 0,
      achievementsCount,
      weakTopics: weakTopics.map((wt) => ({
        topicId: wt.topic.id,
        topicTitle: wt.topic.title,
        topicSlug: wt.topic.slug,
        skillLevel: Math.round(wt.skillLevel * 100),
        passRate: wt.attemptsCount > 0
          ? Math.round((wt.passCount / wt.attemptsCount) * 100)
          : 0,
      })),
      recentAttempts: recentAttempts.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        questionTitle: a.question.title,
        topicTitle: a.question.topic.title,
        status: a.status,
        pointsEarned: a.pointsEarned,
        createdAt: a.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    )
  }
}
