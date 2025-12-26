import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { executeJavaCode, TestCase } from "@/lib/sandbox/docker-executor"
import { checkExecutionRateLimit } from "@/lib/redis"

// Optional Sentry
const Sentry = process.env.SENTRY_DSN ? require("@sentry/nextjs") : null

const executeSchema = z.object({
  questionId: z.string(),
  code: z.string().max(50000, "Code too long"),
  runOnly: z.boolean().optional(),
})

// Dangerous patterns that must be blocked
const DANGEROUS_PATTERNS = [
  /Runtime\.getRuntime\(\)/,
  /ProcessBuilder/,
  /System\.exit/,
  /java\.lang\.reflect/,
  /java\.net\./,
  /java\.nio\.file\.Files/,
  /ClassLoader/,
  /SecurityManager/,
  /java\.awt/,
  /javax\.swing/,
  /Thread\.sleep\s*\(\s*\d{5,}\s*\)/, // Sleep > 10 seconds
]

function sanitizeCode(code: string): { safe: boolean; reason?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Blocked: ${pattern.source.substring(0, 30)}...`,
      }
    }
  }
  return { safe: true }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Redis-based rate limiting
    const rateLimit = await checkExecutionRateLimit(userId)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment.",
          retryAfter: Math.ceil(rateLimit.resetMs / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        }
      )
    }

    const body = await req.json()
    const { questionId, code, runOnly } = executeSchema.parse(body)

    // Sanitize code
    const validation = sanitizeCode(code)
    if (!validation.safe) {
      return NextResponse.json(
        { error: `Code contains restricted operations: ${validation.reason}` },
        { status: 400 }
      )
    }

    // Get question details
    const question = await db.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        tests: true,
        solutionCode: true,
        points: true,
        topicId: true,
        difficulty: true,
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    // Parse test cases
    const testCases = question.tests as unknown as TestCase[]

    // Get hints used for this question
    const hintsUsed = await db.hintUsage.count({
      where: { userId, questionId },
    })

    // Execute code using Docker sandbox
    const result = await executeJavaCode(code, testCases)

    // Calculate points
    let pointsEarned = 0
    if (result.status === "PASS" && !runOnly) {
      // Check if user has already passed this question
      const existingPass = await db.attempt.findFirst({
        where: { userId, questionId, status: "PASS" },
      })

      if (!existingPass) {
        // Base points
        pointsEarned = question.points

        // Deduct for hints used
        const hintPenalty = hintsUsed * 10
        pointsEarned = Math.max(pointsEarned - hintPenalty, 10)

        // Add points to ledger
        await db.pointsLedger.create({
          data: {
            userId,
            amount: pointsEarned,
            type: "QUESTION_PASS",
            description: `Passed question`,
            metadata: { questionId, hintsUsed },
          },
        })

        // Update topic stats
        await updateTopicStats(userId, question.topicId, true, hintsUsed)

        // Check for achievements
        await checkAchievements(userId)
      }
    } else if (result.status !== "PASS" && !runOnly) {
      // Update topic stats for failed attempt
      await updateTopicStats(userId, question.topicId, false, hintsUsed)
    }

    // Save attempt (only for check, not run)
    if (!runOnly) {
      const attempt = await db.attempt.create({
        data: {
          userId,
          questionId,
          code,
          status: result.status,
          stdout: result.stdout,
          stderr: result.stderr,
          compileError: result.compileError,
          executionMs: result.executionMs,
          hintsUsed,
          pointsEarned,
        },
      })

      // Save test results
      if (result.testResults.length > 0) {
        await db.attemptTestResult.createMany({
          data: result.testResults.map((tr) => ({
            attemptId: attempt.id,
            testIndex: tr.testIndex,
            input: tr.input,
            expected: tr.expected,
            actual: tr.actual,
            passed: tr.passed,
            error: tr.error,
          })),
        })
      }
    }

    // Log event for audit
    await db.eventLog.create({
      data: {
        userId,
        eventType: runOnly ? "CODE_RUN" : "CODE_CHECK",
        payload: {
          questionId,
          status: result.status,
          executionMs: result.executionMs,
          processingMs: Date.now() - startTime,
        },
      },
    })

    return NextResponse.json({
      ...result,
      pointsEarned,
    })
  } catch (error) {
    if (Sentry) Sentry.captureException(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Execution error:", error)
    return NextResponse.json(
      { error: "Failed to execute code" },
      { status: 500 }
    )
  }
}

async function updateTopicStats(
  userId: string,
  topicId: string,
  passed: boolean,
  hintsUsed: number
) {
  const stats = await db.userTopicStats.findUnique({
    where: {
      userId_topicId: { userId, topicId },
    },
  })

  if (stats) {
    const newAttemptsCount = stats.attemptsCount + 1
    const newPassCount = passed ? stats.passCount + 1 : stats.passCount
    const newFailCount = passed ? stats.failCount : stats.failCount + 1
    const newAvgHints = (stats.avgHintsUsed * stats.attemptsCount + hintsUsed) / newAttemptsCount
    const newStreak = passed ? stats.streak + 1 : 0
    const newBestStreak = Math.max(newStreak, stats.bestStreak)
    const passRate = newPassCount / newAttemptsCount
    const newSkillLevel = Math.min(0.95, Math.max(0.05, passRate))

    await db.userTopicStats.update({
      where: { id: stats.id },
      data: {
        attemptsCount: newAttemptsCount,
        passCount: newPassCount,
        failCount: newFailCount,
        avgHintsUsed: newAvgHints,
        streak: newStreak,
        bestStreak: newBestStreak,
        skillLevel: newSkillLevel,
        lastAttemptAt: new Date(),
      },
    })
  } else {
    await db.userTopicStats.create({
      data: {
        userId,
        topicId,
        attemptsCount: 1,
        passCount: passed ? 1 : 0,
        failCount: passed ? 0 : 1,
        avgHintsUsed: hintsUsed,
        streak: passed ? 1 : 0,
        bestStreak: passed ? 1 : 0,
        skillLevel: passed ? 0.6 : 0.4,
        lastAttemptAt: new Date(),
      },
    })
  }
}

async function checkAchievements(userId: string) {
  // Get user's total stats
  const totalPasses = await db.attempt.count({
    where: { userId, status: "PASS" },
  })

  const achievements = await db.achievement.findMany()
  const userAchievements = await db.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  })
  const earnedIds = new Set(userAchievements.map((a) => a.achievementId))

  for (const achievement of achievements) {
    if (earnedIds.has(achievement.id)) continue

    const criteria = achievement.criteria as { type: string; count?: number }

    let earned = false

    switch (criteria.type) {
      case "first_pass":
        earned = totalPasses >= 1
        break
      case "streak":
        const maxStreak = await db.userTopicStats.aggregate({
          where: { userId },
          _max: { bestStreak: true },
        })
        earned = (maxStreak._max.bestStreak || 0) >= (criteria.count || 0)
        break
      case "no_hints":
        const noHintPasses = await db.attempt.count({
          where: { userId, status: "PASS", hintsUsed: 0 },
        })
        earned = noHintPasses >= (criteria.count || 0)
        break
    }

    if (earned) {
      await db.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      })

      // Award achievement points
      if (achievement.points > 0) {
        await db.pointsLedger.create({
          data: {
            userId,
            amount: achievement.points,
            type: "ACHIEVEMENT",
            description: `Earned achievement: ${achievement.name}`,
            metadata: { achievementId: achievement.id },
          },
        })
      }
    }
  }
}
