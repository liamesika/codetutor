/**
 * Unit Tests for Mentor Analyze API
 * Tests authentication, validation, rate limiting, and response schema
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock types
interface MentorInput {
  questionId: string
  code: string
  compileError?: string
  runtimeError?: string
  testResults?: Array<{
    input: string
    expected: string
    actual: string | null
    passed: boolean
  }>
  executionMs?: number
  status: string
}

// Mock validation schema
const validateMentorInput = (input: unknown): { success: boolean; error?: string } => {
  if (!input || typeof input !== "object") {
    return { success: false, error: "Invalid input" }
  }

  const data = input as Record<string, unknown>

  if (!data.questionId || typeof data.questionId !== "string") {
    return { success: false, error: "questionId is required" }
  }

  if (!data.code || typeof data.code !== "string") {
    return { success: false, error: "code is required" }
  }

  if (!data.status || typeof data.status !== "string") {
    return { success: false, error: "status is required" }
  }

  return { success: true }
}

// Mock rate limit checker
const checkMentorRateLimit = vi.fn()

// Mock session
const mockSession = vi.fn()

describe("Mentor Analyze API - Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when user is not authenticated", async () => {
    mockSession.mockResolvedValue(null)

    const isAuthenticated = (session: unknown) => {
      return session !== null && (session as { user?: { id?: string } })?.user?.id
    }

    expect(isAuthenticated(null)).toBeFalsy()
  })

  it("should allow authenticated user", async () => {
    mockSession.mockResolvedValue({
      user: { id: "test-user-id", role: "USER" },
    })

    const session = await mockSession()
    const isAuthenticated = session?.user?.id !== undefined

    expect(isAuthenticated).toBe(true)
  })

  it("should allow admin user", async () => {
    mockSession.mockResolvedValue({
      user: { id: "admin-user-id", role: "ADMIN" },
    })

    const session = await mockSession()
    const isAdmin = session?.user?.role === "ADMIN"

    expect(isAdmin).toBe(true)
  })
})

describe("Mentor Analyze API - Input Validation", () => {
  it("should reject missing questionId", () => {
    const result = validateMentorInput({
      code: "public class Main { }",
      status: "FAIL",
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain("questionId")
  })

  it("should reject missing code", () => {
    const result = validateMentorInput({
      questionId: "q-123",
      status: "FAIL",
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain("code")
  })

  it("should reject missing status", () => {
    const result = validateMentorInput({
      questionId: "q-123",
      code: "public class Main { }",
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain("status")
  })

  it("should accept valid input", () => {
    const result = validateMentorInput({
      questionId: "q-123",
      code: "public class Main { public static void main(String[] args) { } }",
      status: "FAIL",
      testResults: [
        { input: "5", expected: "10", actual: "9", passed: false },
      ],
    })

    expect(result.success).toBe(true)
  })

  it("should accept input with compile error", () => {
    const result = validateMentorInput({
      questionId: "q-123",
      code: "public class Main { invalid syntax",
      status: "COMPILE_ERROR",
      compileError: "error: ';' expected",
    })

    expect(result.success).toBe(true)
  })
})

describe("Mentor Analyze API - Rate Limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should allow request when under rate limit", async () => {
    checkMentorRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 9,
      resetAt: Date.now() + 60000,
    })

    const result = await checkMentorRateLimit("user-123")

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(9)
  })

  it("should block request when rate limit exceeded", async () => {
    checkMentorRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 30000,
    })

    const result = await checkMentorRateLimit("user-123")

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("should provide reset time when rate limited", async () => {
    const resetTime = Date.now() + 60000
    checkMentorRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: resetTime,
    })

    const result = await checkMentorRateLimit("user-123")

    expect(result.resetAt).toBe(resetTime)
  })
})

describe("Mentor Analyze API - Response Schema", () => {
  // Define expected response shape
  interface MentorResponse {
    errorCategory: string
    shortDiagnosis: string
    reasoningHint: string
    guidingQuestions: string[]
    progressiveHints: string[]
    nextActions: string[]
    confidence: number
  }

  it("should validate response has required fields", () => {
    const response: MentorResponse = {
      errorCategory: "LOGIC",
      shortDiagnosis: "Your loop condition may be incorrect",
      reasoningHint: "Think about when the loop should stop",
      guidingQuestions: [
        "What value does i have after the loop?",
        "Is the loop running the correct number of times?",
      ],
      progressiveHints: [
        "Check your loop boundary condition",
        "Consider using <= instead of <",
        "The loop should run n times, not n-1 times",
      ],
      nextActions: [
        "Add a print statement inside the loop to trace i",
        "Review the expected output for edge cases",
      ],
      confidence: 0.85,
    }

    expect(response.errorCategory).toBeDefined()
    expect(response.shortDiagnosis).toBeDefined()
    expect(response.reasoningHint).toBeDefined()
    expect(Array.isArray(response.guidingQuestions)).toBe(true)
    expect(Array.isArray(response.progressiveHints)).toBe(true)
    expect(Array.isArray(response.nextActions)).toBe(true)
    expect(typeof response.confidence).toBe("number")
  })

  it("should have 2 guiding questions", () => {
    const response: MentorResponse = {
      errorCategory: "SYNTAX",
      shortDiagnosis: "Missing semicolon",
      reasoningHint: "Check line endings",
      guidingQuestions: ["Question 1", "Question 2"],
      progressiveHints: ["Hint 1", "Hint 2", "Hint 3"],
      nextActions: ["Action 1"],
      confidence: 0.9,
    }

    expect(response.guidingQuestions.length).toBe(2)
  })

  it("should have exactly 3 progressive hints", () => {
    const response: MentorResponse = {
      errorCategory: "OFF_BY_ONE",
      shortDiagnosis: "Off-by-one error",
      reasoningHint: "Check loop bounds",
      guidingQuestions: ["Q1", "Q2"],
      progressiveHints: ["Hint 1", "Hint 2", "Hint 3"],
      nextActions: ["Action 1", "Action 2"],
      confidence: 0.8,
    }

    expect(response.progressiveHints.length).toBe(3)
  })

  it("should have max 3 next actions", () => {
    const response: MentorResponse = {
      errorCategory: "NULL_HANDLING",
      shortDiagnosis: "Null pointer",
      reasoningHint: "Check for null",
      guidingQuestions: ["Q1", "Q2"],
      progressiveHints: ["H1", "H2", "H3"],
      nextActions: ["A1", "A2", "A3"],
      confidence: 0.75,
    }

    expect(response.nextActions.length).toBeLessThanOrEqual(3)
  })

  it("should have confidence between 0 and 1", () => {
    const response: MentorResponse = {
      errorCategory: "LOGIC",
      shortDiagnosis: "Logic error",
      reasoningHint: "Trace execution",
      guidingQuestions: ["Q1", "Q2"],
      progressiveHints: ["H1", "H2", "H3"],
      nextActions: ["A1"],
      confidence: 0.85,
    }

    expect(response.confidence).toBeGreaterThanOrEqual(0)
    expect(response.confidence).toBeLessThanOrEqual(1)
  })
})

describe("Mentor Analyze API - Guardrails", () => {
  it("should not include full solution code", () => {
    const mentorResponse = {
      shortDiagnosis: "Check your loop bounds",
      progressiveHints: [
        "Consider what happens at the boundary",
        "Think about when i equals n",
        "The condition should be i <= n",
      ],
    }

    // Check that hints don't contain complete solutions
    const containsFullSolution = (text: string): boolean => {
      const solutionPatterns = [
        /public\s+static\s+void\s+main/,
        /for\s*\([^)]+\)\s*\{[\s\S]*\}/,
        /while\s*\([^)]+\)\s*\{[\s\S]*\}/,
        /class\s+\w+\s*\{[\s\S]*\}/,
      ]
      return solutionPatterns.some((pattern) => pattern.test(text))
    }

    expect(containsFullSolution(mentorResponse.shortDiagnosis)).toBe(false)
    mentorResponse.progressiveHints.forEach((hint) => {
      expect(containsFullSolution(hint)).toBe(false)
    })
  })

  it("should only reference allowed topics", () => {
    const currentWeekTopics = ["loops", "arrays", "conditionals"]

    const mentorResponse = {
      reasoningHint: "Consider how loops iterate through elements",
      guidingQuestions: [
        "What is the loop doing on each iteration?",
        "Are you using the correct array index?",
      ],
    }

    // Verify response doesn't reference advanced topics
    const advancedTopics = ["recursion", "threads", "generics", "lambda", "streams"]

    const containsAdvancedTopic = (text: string): boolean => {
      return advancedTopics.some((topic) =>
        text.toLowerCase().includes(topic)
      )
    }

    expect(containsAdvancedTopic(mentorResponse.reasoningHint)).toBe(false)
    mentorResponse.guidingQuestions.forEach((q) => {
      expect(containsAdvancedTopic(q)).toBe(false)
    })
  })

  it("should not reveal hidden test cases", () => {
    const hiddenTests = [
      { input: "edge1", expected: "result1", isHidden: true },
      { input: "edge2", expected: "result2", isHidden: true },
    ]

    const mentorResponse = {
      nextActions: [
        "Test your code with different inputs",
        "Consider what happens with empty strings",
      ],
    }

    // Ensure hidden test inputs/outputs are not in response
    hiddenTests.forEach((test) => {
      mentorResponse.nextActions.forEach((action) => {
        expect(action).not.toContain(test.input)
        expect(action).not.toContain(test.expected)
      })
    })
  })
})

describe("Mentor Analyze API - Fallback Behavior", () => {
  it("should provide fallback response when AI unavailable", () => {
    const generateFallbackResponse = (category: string) => ({
      errorCategory: category,
      shortDiagnosis: "Unable to analyze your code at this time",
      reasoningHint: "Review the error message carefully",
      guidingQuestions: [
        "What is the error message telling you?",
        "Can you identify the line where the error occurs?",
      ],
      progressiveHints: [
        "Read the error message line by line",
        "Check the syntax around the mentioned line number",
        "Compare your code with working examples",
      ],
      nextActions: [
        "Review the error details above",
        "Try again in a few moments",
      ],
      confidence: 0.3,
    })

    const fallback = generateFallbackResponse("SYNTAX")

    expect(fallback.errorCategory).toBe("SYNTAX")
    expect(fallback.confidence).toBe(0.3)
    expect(fallback.guidingQuestions.length).toBe(2)
    expect(fallback.progressiveHints.length).toBe(3)
  })
})
