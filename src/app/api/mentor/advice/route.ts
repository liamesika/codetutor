/**
 * Smart Mentor AI Core API
 * POST /api/mentor/advice - Get personalized mentor advice
 *
 * Provides:
 * - Mistake explanations
 * - Training day recommendations
 * - Confidence messages
 * - Recovery vs boost path suggestions
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getOrCreateProfile } from "@/lib/mentor/cognitive-engine"
import { getMistakePatterns } from "@/lib/mentor/mistake-engine"
import { getActiveProMissions } from "@/lib/mentor/mission-generator"
import { checkProAccess } from "@/lib/entitlement"

type AdviceType =
  | "daily_briefing"
  | "mistake_analysis"
  | "confidence_boost"
  | "recovery_plan"
  | "challenge_suggestion"

interface MentorAdvice {
  type: AdviceType
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  actionItems: string[]
  relatedTopics?: string[]
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Check PRO access
    const hasProAccess = await checkProAccess(userId)
    if (!hasProAccess) {
      return NextResponse.json(
        { error: "PRO subscription required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { context } = body || {}

    // Gather all necessary data
    const [profile, userProgress, mistakePatterns, activeMissions, recentAttempts] =
      await Promise.all([
        getOrCreateProfile(userId),
        db.userProgress.findUnique({ where: { userId } }),
        getMistakePatterns(userId),
        getActiveProMissions(userId),
        db.attempt.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { question: { select: { title: true, topicId: true, difficulty: true } } },
        }),
      ])

    // Generate personalized advice based on current state
    const advice = generateMentorAdvice({
      profile,
      userProgress,
      mistakePatterns,
      activeMissions,
      recentAttempts,
      requestContext: context,
    })

    // Get topic names for related topics
    const topicIds = advice.flatMap((a) => a.relatedTopics || [])
    const topics = await db.topic.findMany({
      where: { id: { in: topicIds } },
      select: { id: true, title: true },
    })
    const topicNameMap = Object.fromEntries(topics.map((t) => [t.id, t.title]))

    // Enhance advice with topic names
    const enhancedAdvice = advice.map((a) => ({
      ...a,
      relatedTopics: a.relatedTopics?.map((id) => topicNameMap[id] || id),
    }))

    // Generate greeting based on time of day
    const hour = new Date().getHours()
    const greeting =
      hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : "Good evening"

    // Calculate overall mentor assessment
    const assessment = calculateOverallAssessment(profile)

    return NextResponse.json({
      greeting: `${greeting}, ${session.user.name || "learner"}!`,
      assessment,
      advice: enhancedAdvice,
      stats: {
        momentumScore: profile.momentumScore,
        confidenceIndex: profile.confidenceIndex,
        currentStreak: userProgress?.currentStreak || 0,
        todaysMissions: activeMissions.length,
        completedMissions: activeMissions.filter((m) => m.completedAt).length,
      },
    })
  } catch (error) {
    console.error("Error generating mentor advice:", error)
    return NextResponse.json(
      { error: "Failed to generate advice" },
      { status: 500 }
    )
  }
}

interface AdviceContext {
  profile: Awaited<ReturnType<typeof getOrCreateProfile>>
  userProgress: { currentStreak: number; bestStreak: number; xp: number; level: number } | null
  mistakePatterns: Awaited<ReturnType<typeof getMistakePatterns>>
  activeMissions: Awaited<ReturnType<typeof getActiveProMissions>>
  recentAttempts: Array<{
    status: string
    question: { title: string; topicId: string; difficulty: number }
  }>
  requestContext?: string
}

function generateMentorAdvice(ctx: AdviceContext): MentorAdvice[] {
  const advice: MentorAdvice[] = []

  // 1. Daily Briefing (always first)
  advice.push(generateDailyBriefing(ctx))

  // 2. Burnout Warning (if applicable)
  if (ctx.profile.burnoutRiskScore > 50) {
    advice.push(generateBurnoutWarning(ctx))
  }

  // 3. Mistake Analysis (if recurring mistakes)
  if (ctx.mistakePatterns.recurringPatterns.length > 0) {
    advice.push(generateMistakeAnalysis(ctx))
  }

  // 4. Confidence Boost (if low confidence)
  if (ctx.profile.confidenceIndex < 40) {
    advice.push(generateConfidenceBoost(ctx))
  }

  // 5. Recovery or Challenge based on state
  if (ctx.profile.momentumScore < 40 || ctx.profile.currentLoseStreak > 3) {
    advice.push(generateRecoveryPlan(ctx))
  } else if (ctx.profile.momentumScore > 70 && ctx.profile.confidenceIndex > 60) {
    advice.push(generateChallengeSuggestion(ctx))
  }

  return advice
}

function generateDailyBriefing(ctx: AdviceContext): MentorAdvice {
  const { profile, userProgress, activeMissions } = ctx
  const streak = userProgress?.currentStreak || 0
  const completedMissions = activeMissions.filter((m) => m.completedAt).length
  const totalMissions = activeMissions.length

  let message: string
  let priority: MentorAdvice["priority"] = "medium"

  if (profile.momentumScore > 70) {
    message = `Great momentum! You're on a ${streak}-day streak. ${
      totalMissions > 0
        ? `You have ${totalMissions - completedMissions} missions left today.`
        : "Keep pushing forward!"
    }`
  } else if (profile.momentumScore > 40) {
    message = `Steady progress! ${
      streak > 0 ? `${streak}-day streak going strong.` : "Start building your streak today."
    } Focus on your missions to keep momentum.`
  } else {
    message = `Let's build some momentum today. Start with something easy and work your way up.`
    priority = "high"
  }

  const actionItems: string[] = []
  if (totalMissions > completedMissions) {
    actionItems.push(`Complete your ${totalMissions - completedMissions} remaining missions`)
  }
  if (streak === 0) {
    actionItems.push("Start your streak with any question")
  }
  if (profile.burnoutRiskScore > 30) {
    actionItems.push("Take breaks between sessions")
  }

  return {
    type: "daily_briefing",
    title: "Today's Focus",
    message,
    priority,
    actionItems: actionItems.slice(0, 3),
  }
}

function generateBurnoutWarning(ctx: AdviceContext): MentorAdvice {
  const { profile } = ctx
  const riskLevel = profile.burnoutRiskScore

  let message: string
  if (riskLevel > 80) {
    message =
      "I notice you might be pushing too hard. Consider taking a break today or doing just one easy question. Rest is part of learning!"
  } else if (riskLevel > 60) {
    message =
      "Your activity pattern suggests fatigue. Try a lighter session today - quality over quantity."
  } else {
    message =
      "Watch your energy levels. Mix in some easier problems to avoid burnout."
  }

  return {
    type: "recovery_plan",
    title: "Take Care of Yourself",
    message,
    priority: riskLevel > 80 ? "urgent" : "high",
    actionItems: [
      "Do just 1-2 easy questions today",
      "Take a 10-minute break between problems",
      "Consider reviewing past solutions instead of new challenges",
    ],
  }
}

function generateMistakeAnalysis(ctx: AdviceContext): MentorAdvice {
  const { mistakePatterns } = ctx
  const topPattern = mistakePatterns.recurringPatterns[0]
  const topType = mistakePatterns.byType[0]

  const typeExplanations: Record<string, string> = {
    LOGIC: "Your approach to problems might need adjustment. Try breaking problems into smaller steps.",
    SYNTAX: "Java syntax is tripping you up. Consider reviewing language fundamentals.",
    TIMEOUT: "Watch for infinite loops. Always verify your loop conditions.",
    MISUNDERSTANDING: "Take more time to understand the problem before coding. Read examples carefully.",
    CARELESS: "Slow down and double-check your work. Small errors add up.",
    MEMORY: "Some concepts might need refreshing. Review recent lessons.",
    EDGE_CASE: "Think about edge cases: empty inputs, single elements, negative numbers.",
    TYPE_ERROR: "Pay attention to data types. Java is strict about type compatibility.",
  }

  const mistakeType = topType?.type || "LOGIC"
  const explanation = typeExplanations[mistakeType] || "Keep practicing to improve."

  const relatedTopics = topPattern?.skillArea ? [topPattern.skillArea] : []

  return {
    type: "mistake_analysis",
    title: `Pattern Detected: ${mistakeType.replace("_", " ")} Errors`,
    message: `You've been making similar mistakes. ${explanation}`,
    priority: mistakePatterns.trend.direction === "worsening" ? "high" : "medium",
    actionItems: [
      `Focus on ${mistakeType.toLowerCase().replace("_", " ")} prevention`,
      "Review your recent failed attempts",
      "Try similar problems at a lower difficulty",
    ],
    relatedTopics,
  }
}

function generateConfidenceBoost(ctx: AdviceContext): MentorAdvice {
  const { profile, recentAttempts } = ctx

  // Find topics where user has succeeded
  const successfulTopics = recentAttempts
    .filter((a) => a.status === "PASS")
    .map((a) => a.question.topicId)
    .slice(0, 3)

  let message: string
  if (profile.currentLoseStreak > 5) {
    message =
      "You've hit a rough patch, but that's part of learning. Let's get a win to rebuild momentum."
  } else if (profile.confidenceIndex < 20) {
    message =
      "Remember: every expert was once a beginner. Start with something you know you can do."
  } else {
    message =
      "You've got this! Your past successes show you have the skills. Time for a confidence win."
  }

  return {
    type: "confidence_boost",
    title: "Believe in Yourself",
    message,
    priority: profile.currentLoseStreak > 5 ? "high" : "medium",
    actionItems: [
      "Solve one question you're comfortable with",
      "Review a past solution you're proud of",
      "Celebrate small wins",
    ],
    relatedTopics: successfulTopics,
  }
}

function generateRecoveryPlan(ctx: AdviceContext): MentorAdvice {
  const { profile, mistakePatterns } = ctx

  const weakestArea = Object.entries(
    profile.topicWeaknessMap as Record<string, number>
  )
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  return {
    type: "recovery_plan",
    title: "Recovery Path",
    message:
      "Let's get you back on track. I recommend a structured approach: start easy, build confidence, then tackle challenges.",
    priority: "high",
    actionItems: [
      "Day 1-2: Complete 2-3 easy problems per day",
      "Day 3-4: Mix easy and medium problems",
      "Day 5+: Gradually increase difficulty",
      mistakePatterns.byType[0]
        ? `Focus on avoiding ${mistakePatterns.byType[0].type.toLowerCase()} mistakes`
        : "Review fundamentals",
    ],
    relatedTopics: weakestArea ? [weakestArea] : [],
  }
}

function generateChallengeSuggestion(ctx: AdviceContext): MentorAdvice {
  const { profile, recentAttempts } = ctx

  // Find the most common successful difficulty
  const difficulties = recentAttempts
    .filter((a) => a.status === "PASS")
    .map((a) => a.question.difficulty)

  const avgDifficulty =
    difficulties.length > 0
      ? difficulties.reduce((a, b) => a + b, 0) / difficulties.length
      : 2

  const suggestedDifficulty = Math.min(5, Math.ceil(avgDifficulty) + 1)

  return {
    type: "challenge_suggestion",
    title: "Ready for a Challenge?",
    message: `Your momentum is strong! You're ready to level up. Try problems at difficulty ${suggestedDifficulty}/5.`,
    priority: "low",
    actionItems: [
      `Attempt a difficulty ${suggestedDifficulty} problem`,
      "Set a personal best time",
      "Try solving without hints",
    ],
  }
}

function calculateOverallAssessment(
  profile: Awaited<ReturnType<typeof getOrCreateProfile>>
): {
  status: "excellent" | "good" | "needs_attention" | "struggling"
  summary: string
} {
  const healthScore = Math.round(
    profile.momentumScore * 0.3 +
      profile.confidenceIndex * 0.3 +
      (100 - profile.burnoutRiskScore) * 0.2 +
      profile.engagementScore * 0.2
  )

  if (healthScore >= 75) {
    return {
      status: "excellent",
      summary: "You're doing great! Keep up the excellent work.",
    }
  }

  if (healthScore >= 55) {
    return {
      status: "good",
      summary: "You're on the right track. A bit more focus will take you further.",
    }
  }

  if (healthScore >= 35) {
    return {
      status: "needs_attention",
      summary: "Some areas need attention. Let's work on building momentum.",
    }
  }

  return {
    status: "struggling",
    summary: "Let's take it easy and rebuild your confidence step by step.",
  }
}
