import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import {
  executeCode,
  generateRequestId,
  logExecutorEvent,
  checkExecutorHealth,
  getExecutorConfig,
  type TestCase,
  type ExecutionResponse,
} from "@/lib/executor"
import { checkExecutionRateLimit } from "@/lib/redis"
import { processQuestionCompletion } from "@/lib/progression"
import { updateNodeProgress } from "@/lib/skill-tree"
import { completeDailyChallenge, getDailyChallenge } from "@/lib/daily-challenge"

// Force Node.js runtime - Edge runtime has issues with env vars
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Log ENV at module load to debug production issues
console.log("[/api/execute] Module loaded - EXECUTOR_URL:", !!process.env.EXECUTOR_URL, "EXECUTOR_SECRET:", !!process.env.EXECUTOR_SECRET)

/**
 * Returns executor config diagnostics for debugging
 */
function getConfigDiagnostics() {
  const config = getExecutorConfig()
  return {
    hasExecutorUrl: !!process.env.EXECUTOR_URL,
    hasExecutorSecret: !!process.env.EXECUTOR_SECRET,
    executorUrlNormalized: config.url ? `${config.url.substring(0, 20)}...` : null,
    isConfigured: config.isConfigured,
    env: process.env.NODE_ENV || "unknown",
    vercelEnv: process.env.VERCEL_ENV || "local",
    version: process.env.npm_package_version || "unknown",
  }
}

// Optional Sentry - non-blocking
let Sentry: typeof import("@sentry/nextjs") | null = null
if (process.env.SENTRY_DSN) {
  try {
    Sentry = require("@sentry/nextjs")
  } catch {
    // Sentry not available
  }
}

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

// Hash user ID for logging (privacy)
function hashUserId(userId: string): string {
  return userId.substring(0, 8) + "..."
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", requestId },
        { status: 401 }
      )
    }

    // Check executor config BEFORE proceeding - return 503 with diagnostics if not configured
    const executorConfig = getExecutorConfig()
    if (!executorConfig.isConfigured || !process.env.EXECUTOR_SECRET) {
      const diagnostics = getConfigDiagnostics()

      logExecutorEvent("executor_not_configured", {
        requestId,
        diagnostics,
      })

      return NextResponse.json(
        {
          error: "EXECUTOR_NOT_CONFIGURED",
          message: "Code execution service is not configured. Please ensure EXECUTOR_URL and EXECUTOR_SECRET environment variables are set in your deployment.",
          details: diagnostics,
          requestId,
          actionRequired: "Set EXECUTOR_URL and EXECUTOR_SECRET in Vercel Environment Variables",
          docsUrl: "/api/execute/health",
        },
        {
          status: 503,
          headers: {
            "X-Request-Id": requestId,
            "Retry-After": "60",
          },
        }
      )
    }

    const userId = session.user.id

    // Log request start
    logExecutorEvent("api_request_start", {
      requestId,
      userId: hashUserId(userId),
    })

    // Redis-based rate limiting
    const rateLimit = await checkExecutionRateLimit(userId)
    if (!rateLimit.allowed) {
      logExecutorEvent("rate_limit_exceeded", {
        requestId,
        userId: hashUserId(userId),
        retryAfter: Math.ceil(rateLimit.resetMs / 1000),
      })

      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment.",
          retryAfter: Math.ceil(rateLimit.resetMs / 1000),
          requestId,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-Request-Id": requestId,
          },
        }
      )
    }

    const body = await req.json()
    const { questionId, code, runOnly } = executeSchema.parse(body)

    // Sanitize code
    const validation = sanitizeCode(code)
    if (!validation.safe) {
      logExecutorEvent("code_blocked", {
        requestId,
        userId: hashUserId(userId),
        reason: validation.reason,
      })

      return NextResponse.json(
        {
          error: `Code contains restricted operations: ${validation.reason}`,
          requestId,
        },
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
        { error: "Question not found", requestId },
        { status: 404 }
      )
    }

    // Parse test cases
    const testCases = question.tests as unknown as TestCase[]

    // Get hints used for this question
    const hintsUsed = await db.hintUsage.count({
      where: { userId, questionId },
    })

    // Execute code using new executor service
    const result = await executeCode(code, testCases, requestId)

    // Convert to internal format for DB storage
    const internalStatus = mapExecutionStatus(result)

    // Calculate points and process progression
    let pointsEarned = 0
    let progressionResult = null
    let dailyChallengeBonus = 0

    if (result.passed && !runOnly) {
      // Process question completion through progression system
      progressionResult = await processQuestionCompletion(userId, questionId, {
        hintsUsed,
        executionMs: result.durationMs,
      })

      pointsEarned = progressionResult.xpAwarded

      // Update skill tree node progress
      await updateNodeProgress(userId, question.topicId)

      // Check if this is today's daily challenge
      try {
        const dailyChallenge = await getDailyChallenge(userId)
        if (dailyChallenge && dailyChallenge.question.id === questionId && !dailyChallenge.isCompleted) {
          const challengeResult = await completeDailyChallenge(userId, dailyChallenge.id)
          if (!challengeResult.alreadyCompleted) {
            dailyChallengeBonus = challengeResult.xpEarned
            pointsEarned += dailyChallengeBonus
          }
        }
      } catch {
        // Daily challenge check failed, continue without it
      }

      // Update topic stats
      await updateTopicStats(userId, question.topicId, true, hintsUsed)

      // Check for achievements
      await checkAchievements(userId)
    } else if (!result.passed && !runOnly) {
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
          status: internalStatus,
          stdout: result.stdout,
          stderr: result.stderr,
          compileError: result.compileError,
          executionMs: result.durationMs,
          hintsUsed,
          pointsEarned,
        },
      })

      // Save test results
      if (result.tests.length > 0) {
        await db.attemptTestResult.createMany({
          data: result.tests.map((tr, i) => ({
            attemptId: attempt.id,
            testIndex: i,
            input: tr.isHidden ? "[hidden]" : (testCases[i]?.input || ""),
            expected: tr.expected || "",
            actual: tr.received || "",
            passed: tr.passed,
            error: tr.message || null,
          })),
        })
      }
    }

    // Log event for audit
    const processingMs = Date.now() - startTime
    await db.eventLog.create({
      data: {
        userId,
        eventType: runOnly ? "CODE_RUN" : "CODE_CHECK",
        payload: {
          requestId,
          questionId,
          status: internalStatus,
          executionMs: result.durationMs,
          processingMs,
        },
      },
    })

    logExecutorEvent("api_request_complete", {
      requestId,
      userId: hashUserId(userId),
      questionId,
      status: result.status,
      passed: result.passed,
      durationMs: processingMs,
    })

    // Derive canonical status from test results (SINGLE SOURCE OF TRUTH)
    // This prevents UI showing "Some Tests Failed" when all tests actually passed
    const testResults = result.tests.map((t, i) => ({
      testIndex: i,
      input: t.isHidden ? "[hidden]" : (testCases[i]?.input || ""),
      expected: t.expected || "",
      actual: t.received || "",
      passed: t.passed,
      error: t.message || null,
      isHidden: t.isHidden || false,
    }))

    const totalTests = testResults.length
    const passedTests = testResults.filter(t => t.passed).length
    const allPassed = totalTests > 0 && passedTests === totalTests

    // Derive status: prioritize test results over executor status
    let derivedStatus: "PASS" | "FAIL" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIMEOUT" | "MEMORY_EXCEEDED"
    if (allPassed) {
      derivedStatus = "PASS"
    } else if (result.compileError) {
      derivedStatus = "COMPILE_ERROR"
    } else if (result.runtimeError?.toLowerCase().includes("timeout")) {
      derivedStatus = "TIMEOUT"
    } else if (result.runtimeError?.toLowerCase().includes("memory")) {
      derivedStatus = "MEMORY_EXCEEDED"
    } else if (result.runtimeError) {
      derivedStatus = "RUNTIME_ERROR"
    } else {
      derivedStatus = "FAIL"
    }

    // CONTRACT ASSERTION: Log if there's a mismatch for debugging
    if (allPassed && derivedStatus !== "PASS") {
      console.error("[RESULTS CONTRACT VIOLATION] allPassed=true but derivedStatus=", derivedStatus)
    }
    if (!allPassed && derivedStatus === "PASS") {
      console.error("[RESULTS CONTRACT VIOLATION] allPassed=false but derivedStatus=PASS")
    }

    // Return standardized response with derived status
    return NextResponse.json(
      {
        // Use derived status, not executor's raw status
        status: derivedStatus,
        passed: allPassed,
        // Test summary for UI consumption
        summary: {
          totalTests,
          passedTests,
          allPassed,
          anyFailed: totalTests > 0 && passedTests < totalTests,
        },
        tests: result.tests,
        stdout: result.stdout,
        stderr: result.stderr,
        compileError: result.compileError,
        runtimeError: result.runtimeError,
        durationMs: result.durationMs,
        requestId: result.requestId,
        pointsEarned,
        // Progression data
        progression: progressionResult ? {
          xpAwarded: progressionResult.xpAwarded,
          xpBreakdown: progressionResult.breakdown,
          isFirstPass: progressionResult.isFirstPass,
          leveledUp: progressionResult.leveledUp,
          previousLevel: progressionResult.previousLevel,
          newLevel: progressionResult.progress.level,
          newXp: progressionResult.progress.xp,
          streak: progressionResult.progress.currentStreak,
          dailyChallengeBonus,
        } : null,
        // Test results with canonical shape
        testResults,
        executionMs: result.durationMs,
      },
      {
        headers: {
          "X-Request-Id": requestId,
        },
      }
    )
  } catch (error) {
    const processingMs = Date.now() - startTime

    // Log error
    logExecutorEvent("api_request_error", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs: processingMs,
    })

    // Report to Sentry if available
    if (Sentry) {
      Sentry.withScope((scope) => {
        scope.setTag("requestId", requestId)
        Sentry.captureException(error)
      })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message, requestId },
        { status: 400, headers: { "X-Request-Id": requestId } }
      )
    }

    console.error("Execution error:", error)
    return NextResponse.json(
      { error: "Failed to execute code", requestId },
      { status: 500, headers: { "X-Request-Id": requestId } }
    )
  }
}

// Map execution status to internal status
type AttemptStatus = "PASS" | "FAIL" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIMEOUT" | "MEMORY_EXCEEDED"

function mapExecutionStatus(result: ExecutionResponse): AttemptStatus {
  if (result.passed) return "PASS"
  if (result.compileError) return "COMPILE_ERROR"
  if (result.runtimeError?.includes("timeout")) return "TIMEOUT"
  if (result.runtimeError?.includes("memory")) return "MEMORY_EXCEEDED"
  if (result.runtimeError) return "RUNTIME_ERROR"
  return "FAIL"
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

// Health check endpoint for executor status with config diagnostics
export async function GET() {
  const config = getExecutorConfig()
  const diagnostics = getConfigDiagnostics()

  // If not configured, return 503 with actionable diagnostics
  if (!config.isConfigured || !process.env.EXECUTOR_SECRET) {
    return NextResponse.json(
      {
        status: "not_configured",
        error: "EXECUTOR_NOT_CONFIGURED",
        message: "Code execution service is not configured",
        config: diagnostics,
        actionRequired: "Set EXECUTOR_URL and EXECUTOR_SECRET in Vercel Environment Variables",
        executor: {
          healthy: false,
          message: "Executor not configured",
          checkedAt: new Date().toISOString(),
        },
      },
      { status: 503 }
    )
  }

  // Executor is configured, check actual health
  const health = await checkExecutorHealth()

  return NextResponse.json({
    status: health.healthy ? "healthy" : "unhealthy",
    config: diagnostics,
    executor: {
      healthy: health.healthy,
      message: health.message,
      latencyMs: health.latencyMs,
      checkedAt: health.checkedAt,
    },
  })
}
