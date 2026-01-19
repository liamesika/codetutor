/**
 * Mistake Intelligence Engine
 *
 * Classifies and analyzes mistakes to identify patterns
 * and drive personalized learning recommendations.
 */

import { db } from "@/lib/db"
import { MistakeType, AttemptStatus } from "@prisma/client"

interface MistakeClassification {
  type: MistakeType
  severity: number // 1-5
  description: string
  skillArea: string | null
  isRecurring: boolean
}

interface AttemptContext {
  code: string
  status: AttemptStatus
  compileError: string | null
  stderr: string | null
  stdout: string | null
  executionMs: number | null
  testResults: Array<{
    passed: boolean
    expected: string
    actual: string | null
    error: string | null
  }>
}

// Common Java error patterns for classification
const ERROR_PATTERNS = {
  SYNTAX: [
    /';' expected/i,
    /illegal start of expression/i,
    /reached end of file while parsing/i,
    /unclosed string literal/i,
    /\) expected/i,
    /class, interface, or enum expected/i,
    /missing return statement/i,
    /<identifier> expected/i,
    /not a statement/i,
  ],
  TYPE_ERROR: [
    /incompatible types/i,
    /cannot be converted to/i,
    /cannot find symbol/i,
    /bad operand types/i,
    /possible lossy conversion/i,
    /method.*cannot be applied/i,
    /no suitable method found/i,
  ],
  TIMEOUT: [
    /time limit exceeded/i,
    /execution timed out/i,
    /infinite loop/i,
  ],
  MEMORY: [
    /StackOverflowError/i,
    /OutOfMemoryError/i,
    /java\.lang\.StackOverflowError/i,
  ],
  EDGE_CASE: [
    /ArrayIndexOutOfBoundsException/i,
    /StringIndexOutOfBoundsException/i,
    /NullPointerException/i,
    /ArithmeticException/i,
    /NumberFormatException/i,
  ],
}

// Skill area detection patterns
const SKILL_AREA_PATTERNS: Record<string, RegExp[]> = {
  loops: [/for\s*\(/, /while\s*\(/, /do\s*\{/],
  arrays: [/\[\]/, /new\s+\w+\s*\[/, /\.length/],
  strings: [/String/, /\.charAt/, /\.substring/, /\.equals/],
  conditionals: [/if\s*\(/, /else/, /switch\s*\(/, /\?.*:/],
  methods: [/public\s+\w+\s+\w+\s*\(/, /private\s+\w+\s+\w+\s*\(/, /return\s/],
  classes: [/class\s+\w+/, /new\s+\w+\s*\(/, /this\./],
  recursion: [/(\w+)\s*\([^)]*\)\s*\{[^}]*\1\s*\(/],
  io: [/Scanner/, /System\.(in|out)/, /BufferedReader/],
}

/**
 * Classify a mistake from an attempt
 */
export async function classifyMistake(
  attemptId: string
): Promise<MistakeClassification | null> {
  const attempt = await db.attempt.findUnique({
    where: { id: attemptId },
    include: {
      testResults: true,
      question: { include: { topic: true } },
    },
  })

  if (!attempt || attempt.status === "PASS") {
    return null // No mistake to classify
  }

  const context: AttemptContext = {
    code: attempt.code,
    status: attempt.status,
    compileError: attempt.compileError,
    stderr: attempt.stderr,
    stdout: attempt.stdout,
    executionMs: attempt.executionMs,
    testResults: attempt.testResults.map((tr) => ({
      passed: tr.passed,
      expected: tr.expected,
      actual: tr.actual,
      error: tr.error,
    })),
  }

  // Classify based on attempt status and error content
  const classification = analyzeError(context)

  // Detect skill area from code
  const skillArea = detectSkillArea(attempt.code)

  // Check if this is a recurring mistake
  const isRecurring = await checkRecurring(
    attempt.userId,
    classification.type,
    skillArea
  )

  return {
    ...classification,
    skillArea,
    isRecurring,
  }
}

/**
 * Analyze error content to classify mistake type
 */
function analyzeError(context: AttemptContext): {
  type: MistakeType
  severity: number
  description: string
} {
  const errorText = [
    context.compileError,
    context.stderr,
    ...context.testResults.map((tr) => tr.error).filter(Boolean),
  ]
    .filter(Boolean)
    .join("\n")

  // Check for timeout
  if (
    context.status === "TIMEOUT" ||
    ERROR_PATTERNS.TIMEOUT.some((p) => p.test(errorText))
  ) {
    return {
      type: "TIMEOUT",
      severity: 3,
      description: "Code exceeded time limit - possible infinite loop or inefficient algorithm",
    }
  }

  // Check for memory issues
  if (
    context.status === "MEMORY_EXCEEDED" ||
    ERROR_PATTERNS.MEMORY.some((p) => p.test(errorText))
  ) {
    return {
      type: "MEMORY",
      severity: 4,
      description: "Memory limit exceeded - possible infinite recursion or memory leak",
    }
  }

  // Check for compile/syntax errors
  if (
    context.status === "COMPILE_ERROR" ||
    ERROR_PATTERNS.SYNTAX.some((p) => p.test(errorText))
  ) {
    return {
      type: "SYNTAX",
      severity: 2,
      description: "Syntax error - code could not be compiled",
    }
  }

  // Check for type errors
  if (ERROR_PATTERNS.TYPE_ERROR.some((p) => p.test(errorText))) {
    return {
      type: "TYPE_ERROR",
      severity: 2,
      description: "Type mismatch or incompatible types",
    }
  }

  // Check for edge case/runtime errors
  if (
    context.status === "RUNTIME_ERROR" ||
    ERROR_PATTERNS.EDGE_CASE.some((p) => p.test(errorText))
  ) {
    return {
      type: "EDGE_CASE",
      severity: 3,
      description: "Runtime error - likely missed edge case handling",
    }
  }

  // Analyze test failures for logic vs careless
  const failedTests = context.testResults.filter((tr) => !tr.passed)
  if (failedTests.length > 0) {
    // Check if it's a small difference (careless) or fundamental (logic)
    const isCareless = failedTests.some((tr) => {
      if (!tr.actual || !tr.expected) return false
      const expected = tr.expected.trim()
      const actual = tr.actual.trim()

      // Off by one, case difference, whitespace, etc.
      if (Math.abs(expected.length - actual.length) <= 2) {
        return true
      }

      // Numbers close but not exact
      const expectedNum = parseFloat(expected)
      const actualNum = parseFloat(actual)
      if (!isNaN(expectedNum) && !isNaN(actualNum)) {
        const diff = Math.abs(expectedNum - actualNum)
        if (diff <= 1 || diff / expectedNum < 0.1) {
          return true
        }
      }

      return false
    })

    if (isCareless) {
      return {
        type: "CARELESS",
        severity: 1,
        description: "Close but not exact - small error like off-by-one or formatting",
      }
    }

    // Check if most tests failed vs just some
    const failRate = failedTests.length / context.testResults.length
    if (failRate > 0.7) {
      return {
        type: "MISUNDERSTANDING",
        severity: 4,
        description: "Most tests failed - likely misunderstood the problem requirements",
      }
    }

    return {
      type: "LOGIC",
      severity: 3,
      description: "Logic error - algorithm produces incorrect results",
    }
  }

  // Default to logic error
  return {
    type: "LOGIC",
    severity: 2,
    description: "Unknown error - likely logic issue",
  }
}

/**
 * Detect the primary skill area from code
 */
function detectSkillArea(code: string): string | null {
  const areaScores: Record<string, number> = {}

  for (const [area, patterns] of Object.entries(SKILL_AREA_PATTERNS)) {
    areaScores[area] = patterns.filter((p) => p.test(code)).length
  }

  const topArea = Object.entries(areaScores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])[0]

  return topArea ? topArea[0] : null
}

/**
 * Check if user has made this type of mistake before
 */
async function checkRecurring(
  userId: string,
  mistakeType: MistakeType,
  skillArea: string | null
): Promise<boolean> {
  const recentCount = await db.mistakeLog.count({
    where: {
      userId,
      mistakeType,
      skillArea: skillArea || undefined,
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    },
  })

  return recentCount >= 2 // Recurring if 2+ similar mistakes in 7 days
}

/**
 * Log a mistake to the database and update cognitive profile
 * Returns the created mistake log for further processing
 */
export async function logMistake(
  userId: string,
  attemptId: string,
  questionId: string,
  classification: MistakeClassification
): Promise<{ id: string } | null> {
  const attempt = await db.attempt.findUnique({
    where: { id: attemptId },
    include: { question: true },
  })

  // Create mistake log
  const mistakeLog = await db.mistakeLog.create({
    data: {
      userId,
      questionId,
      attemptId,
      mistakeType: classification.type,
      severity: classification.severity,
      description: classification.description,
      codeContext: attempt?.code?.substring(0, 500), // First 500 chars
      errorMessage: attempt?.compileError || attempt?.stderr,
      isRecurring: classification.isRecurring,
      topicId: attempt?.question.topicId,
      skillArea: classification.skillArea,
    },
    select: { id: true },
  })

  // Update cognitive profile mistake frequency
  const profile = await db.cognitiveProfile.findUnique({
    where: { userId },
  })

  if (profile) {
    const mistakeFreq = (profile.mistakeTypeFrequency as Record<string, number>) || {}
    mistakeFreq[classification.type] = (mistakeFreq[classification.type] || 0) + 1

    await db.cognitiveProfile.update({
      where: { userId },
      data: {
        totalMistakes: { increment: 1 },
        mistakeTypeFrequency: mistakeFreq,
        // Decrease confidence on high severity mistakes
        confidenceIndex: classification.severity >= 3
          ? Math.max(0, profile.confidenceIndex - 3)
          : profile.confidenceIndex,
      },
    })
  }

  return mistakeLog
}

/**
 * Get mistake patterns for a user
 */
export async function getMistakePatterns(userId: string) {
  const [
    byType,
    bySkillArea,
    recurringPatterns,
    recentTrend,
  ] = await Promise.all([
    // Group by mistake type
    db.mistakeLog.groupBy({
      by: ["mistakeType"],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Group by skill area
    db.mistakeLog.groupBy({
      by: ["skillArea"],
      where: { userId, skillArea: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Get recurring patterns
    db.mistakeLog.findMany({
      where: { userId, isRecurring: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { question: { select: { title: true } } },
    }),

    // Recent trend (last 7 days vs previous 7 days)
    Promise.all([
      db.mistakeLog.count({
        where: {
          userId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      db.mistakeLog.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]),
  ])

  const [recentWeek, previousWeek] = recentTrend

  return {
    byType: byType.map((g) => ({
      type: g.mistakeType,
      count: g._count.id,
    })),
    bySkillArea: bySkillArea.map((g) => ({
      area: g.skillArea,
      count: g._count.id,
    })),
    recurringPatterns: recurringPatterns.map((m) => ({
      type: m.mistakeType,
      skillArea: m.skillArea,
      questionTitle: m.question.title,
      description: m.description,
      createdAt: m.createdAt,
    })),
    trend: {
      recentWeek,
      previousWeek,
      direction: recentWeek < previousWeek ? "improving" : recentWeek > previousWeek ? "worsening" : "stable",
      percentChange: previousWeek > 0
        ? Math.round(((recentWeek - previousWeek) / previousWeek) * 100)
        : 0,
    },
  }
}

/**
 * Mark a mistake as resolved (user learned from it)
 */
export async function resolveMistake(
  mistakeId: string,
  lessonsLearned?: string
): Promise<void> {
  await db.mistakeLog.update({
    where: { id: mistakeId },
    data: {
      wasResolved: true,
      resolvedAt: new Date(),
      lessonsLearned,
    },
  })
}

/**
 * Process a failed attempt - classify, log mistake, and generate pedagogical feedback
 */
export async function processfailedAttempt(
  userId: string,
  attemptId: string,
  questionId: string
): Promise<MistakeClassification | null> {
  const classification = await classifyMistake(attemptId)

  if (classification) {
    const mistakeLog = await logMistake(userId, attemptId, questionId, classification)

    // Generate pedagogical feedback (non-blocking)
    if (mistakeLog) {
      import("./pedagogical-engine").then(({ generatePedagogicalFeedback }) => {
        generatePedagogicalFeedback(attemptId, mistakeLog.id).catch((err) => {
          console.error("[Pedagogical] Failed to generate feedback:", err)
        })
      }).catch((err) => {
        console.error("[Pedagogical] Failed to import engine:", err)
      })
    }
  }

  return classification
}
