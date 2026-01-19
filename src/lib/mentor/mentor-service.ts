/**
 * AI Mentor Service
 *
 * Stateless mentor that provides pedagogical feedback on code submissions.
 * Uses OpenAI for intelligent analysis while enforcing strict guardrails.
 */

import OpenAI from "openai"
import { db } from "@/lib/db"
import { MentorErrorCategory } from "@prisma/client"
import { classifyError, ClassificationInput, ClassificationOutput } from "./error-classifier"
import { checkMentorRateLimit } from "@/lib/redis"

// Validate environment at module load (server-side only)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY && typeof window === "undefined") {
  console.warn("[Mentor] OPENAI_API_KEY not configured - mentor will return fallback responses")
}

// Initialize OpenAI client (lazy, server-only)
let openai: OpenAI | null = null
function getOpenAIClient(): OpenAI | null {
  if (!OPENAI_API_KEY) return null
  if (!openai) {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      timeout: 30000, // 30 second timeout
      maxRetries: 2,
    })
  }
  return openai
}

// Types
export interface MentorInput {
  userId: string
  questionId: string
  assignmentId?: string
  weekId: string
  code: string
  compileError: string | null
  runtimeError: string | null
  stderr: string | null
  testResults: {
    testIndex: number
    input: string
    expected: string
    actual: string | null
    passed: boolean
    error: string | null
    isHidden?: boolean
  }[]
  executionMs: number | null
  status: string
  // Context
  questionTitle: string
  questionPrompt: string
  questionConstraints: string | null
  starterCode: string
  allowedTopics: string[]
  weekNumber: number
  // Optional student profile
  studentProfile?: {
    recentMistakeTypes: string[]
    weakTopics: string[]
  }
}

export interface MentorResponse {
  errorCategory: MentorErrorCategory
  shortDiagnosis: string
  reasoningHint: string
  guidingQuestions: string[]
  progressiveHints: string[]
  nextActions: string[]
  confidence: number
  // Internal tracking
  preClassification: ClassificationOutput
  modelUsed: string | null
  responseTimeMs: number
}

// System prompt with guardrails
const SYSTEM_PROMPT = `You are an Intro to Computer Science teaching assistant for first-year university students learning Java.

CORE PRINCIPLES:
1. NEVER provide the full solution or complete code
2. Guide students to discover answers through reasoning
3. Only reference concepts from the student's current week topics
4. Focus on understanding WHY something is wrong, not just WHAT is wrong
5. Be encouraging but honest about errors

RESPONSE CONSTRAINTS:
- shortDiagnosis: 1-2 sentences identifying the core issue
- reasoningHint: Step-by-step thinking guidance (NOT the solution)
- guidingQuestions: 2 questions that force the student to think
- progressiveHints: 3 hints - Hint1 (mild direction), Hint2 (stronger nudge), Hint3 (almost-there but NO code)
- nextActions: Max 3 specific actions to take (e.g., "Print the loop variable at each iteration")

GUARDRAILS:
- If student tries to use concepts outside allowed topics, explain it's out of scope
- Never reveal hidden test cases or suggest hardcoding
- Small code snippets (1-3 lines) are OK for illustration, but never the full method/solution
- Reference specific test failures: explain expected vs actual and the concept behind it
- Keep responses concise and structured

ALLOWED TOPICS FOR THIS STUDENT: {allowedTopics}
CURRENT WEEK: {weekNumber}

Respond in valid JSON matching this exact schema:
{
  "errorCategory": "SYNTAX|LOGIC|EDGE_CASE|TIMEOUT|OUTPUT_FORMAT|NULL_HANDLING|OFF_BY_ONE|TYPE_ERROR|RUNTIME_ERROR|OTHER",
  "shortDiagnosis": "string",
  "reasoningHint": "string",
  "guidingQuestions": ["string", "string"],
  "progressiveHints": ["string", "string", "string"],
  "nextActions": ["string", "string", "string"],
  "confidence": number 0-100
}`

/**
 * Build the user prompt with all context
 */
function buildUserPrompt(input: MentorInput, classification: ClassificationOutput): string {
  const { testResults } = input

  // Format test results (hide hidden tests, show first 3 failures)
  const failedTests = testResults
    .filter((t) => !t.passed && !t.isHidden)
    .slice(0, 3)
    .map((t) => `Input: ${t.input}\nExpected: ${t.expected}\nActual: ${t.actual || "no output"}\nError: ${t.error || "none"}`)
    .join("\n---\n")

  const hiddenFailed = testResults.filter((t) => !t.passed && t.isHidden).length

  // Build prompt
  return `## Problem
Title: ${input.questionTitle}
Description: ${input.questionPrompt}
${input.questionConstraints ? `Constraints: ${input.questionConstraints}` : ""}

## Student's Code
\`\`\`java
${input.code}
\`\`\`

## Execution Results
Status: ${input.status}
${input.compileError ? `Compile Error: ${input.compileError}` : ""}
${input.runtimeError ? `Runtime Error: ${input.runtimeError}` : ""}
${input.stderr ? `Stderr: ${input.stderr}` : ""}

## Test Results
Passed: ${testResults.filter((t) => t.passed).length}/${testResults.length}
${hiddenFailed > 0 ? `(${hiddenFailed} hidden tests also failed)` : ""}

### Failed Tests (visible):
${failedTests || "No visible test failures"}

## Pre-Analysis
Category: ${classification.category}
Key Signals: ${classification.keySignals.join(", ") || "none"}
Suggested Focus: ${classification.suggestedFocus}

${input.studentProfile ? `
## Student Context
Recent mistakes: ${input.studentProfile.recentMistakeTypes.join(", ") || "none"}
Weak topics: ${input.studentProfile.weakTopics.join(", ") || "none"}
` : ""}

Provide your analysis following the exact JSON schema specified.`
}

/**
 * Generate fallback response when AI is unavailable
 */
function generateFallbackResponse(classification: ClassificationOutput): Omit<MentorResponse, "preClassification" | "modelUsed" | "responseTimeMs"> {
  const { category, suggestedFocus, keySignals, testAnalysis } = classification

  const categoryAdvice: Record<MentorErrorCategory, { diagnosis: string; hint: string }> = {
    SYNTAX: {
      diagnosis: "Your code has a syntax error that prevents it from compiling.",
      hint: "Read the error message carefully - it usually points to the exact line and type of error.",
    },
    LOGIC: {
      diagnosis: "Your code compiles but produces incorrect results.",
      hint: "Try tracing through your algorithm with a simple example on paper.",
    },
    EDGE_CASE: {
      diagnosis: "Your code fails on certain edge cases or boundary conditions.",
      hint: "Consider what happens with empty input, single elements, or extreme values.",
    },
    TIMEOUT: {
      diagnosis: "Your code takes too long to execute, possibly due to an infinite loop.",
      hint: "Check that your loops have correct termination conditions.",
    },
    OUTPUT_FORMAT: {
      diagnosis: "Your logic may be correct but the output format doesn't match exactly.",
      hint: "Check spacing, newlines, and exact formatting requirements.",
    },
    NULL_HANDLING: {
      diagnosis: "Your code crashes when encountering null or empty values.",
      hint: "Add checks for null or empty input before processing.",
    },
    OFF_BY_ONE: {
      diagnosis: "Your answer is very close but off by one, likely a loop boundary issue.",
      hint: "Check your loop start and end conditions carefully.",
    },
    TYPE_ERROR: {
      diagnosis: "There's a type mismatch or conversion issue in your code.",
      hint: "Review the data types you're using and ensure they're compatible.",
    },
    RUNTIME_ERROR: {
      diagnosis: "Your code crashes during execution with a runtime exception.",
      hint: "Identify what input causes the crash and add appropriate checks.",
    },
    OTHER: {
      diagnosis: "There's an issue with your submission that needs investigation.",
      hint: "Review the test output and compare with expected results.",
    },
  }

  const advice = categoryAdvice[category]

  return {
    errorCategory: category,
    shortDiagnosis: advice.diagnosis,
    reasoningHint: advice.hint,
    guidingQuestions: [
      "What is the expected output for the simplest possible input?",
      "Can you trace through your code line by line with a specific example?",
    ],
    progressiveHints: [
      suggestedFocus,
      keySignals.length > 0 ? `Focus on: ${keySignals[0]}` : "Review your logic step by step",
      testAnalysis.passedTests > 0
        ? `You've passed ${testAnalysis.passedTests} tests - you're close! Check what's different about the failing cases.`
        : "Start by making sure your code handles the basic case correctly.",
    ],
    nextActions: [
      "Add print statements to trace variable values",
      "Test with the simplest possible input first",
      "Compare your output character-by-character with expected output",
    ],
    confidence: 50,
  }
}

/**
 * Call OpenAI API with proper error handling
 */
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<{ response: object | null; modelUsed: string | null; error?: string }> {
  const client = getOpenAIClient()
  if (!client) {
    return { response: null, modelUsed: null, error: "OpenAI not configured" }
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model for tutoring
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return { response: null, modelUsed: "gpt-4o-mini", error: "Empty response" }
    }

    try {
      const parsed = JSON.parse(content)
      return { response: parsed, modelUsed: "gpt-4o-mini" }
    } catch {
      return { response: null, modelUsed: "gpt-4o-mini", error: "Invalid JSON response" }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    // Never log the API key
    console.error("[Mentor] OpenAI error:", message.replace(/sk-[a-zA-Z0-9]+/g, "[REDACTED]"))
    return { response: null, modelUsed: null, error: message }
  }
}

/**
 * Validate AI response matches expected schema
 */
function validateResponse(response: unknown): response is {
  errorCategory: string
  shortDiagnosis: string
  reasoningHint: string
  guidingQuestions: string[]
  progressiveHints: string[]
  nextActions: string[]
  confidence: number
} {
  if (!response || typeof response !== "object") return false

  const r = response as Record<string, unknown>

  return (
    typeof r.errorCategory === "string" &&
    typeof r.shortDiagnosis === "string" &&
    typeof r.reasoningHint === "string" &&
    Array.isArray(r.guidingQuestions) &&
    Array.isArray(r.progressiveHints) &&
    Array.isArray(r.nextActions) &&
    typeof r.confidence === "number"
  )
}

/**
 * Check for full solution in response (guardrail)
 */
function containsFullSolution(response: {
  reasoningHint: string
  progressiveHints: string[]
}): boolean {
  const allText = [response.reasoningHint, ...response.progressiveHints].join("\n")

  // Check for large code blocks (likely full solutions)
  const codeBlocks = allText.match(/```[\s\S]*?```/g) || []
  for (const block of codeBlocks) {
    const lines = block.split("\n").filter((l) => l.trim() && !l.startsWith("```"))
    if (lines.length > 10) {
      return true // Large code block = likely full solution
    }
  }

  // Check for complete method definitions
  if (/public\s+(static\s+)?\w+\s+\w+\s*\([^)]*\)\s*\{[\s\S]{100,}\}/i.test(allText)) {
    return true
  }

  return false
}

/**
 * Main mentor analysis function
 */
export async function analyzeMistake(input: MentorInput): Promise<MentorResponse> {
  const startTime = Date.now()

  // 1. Check rate limit
  const rateLimit = await checkMentorRateLimit(input.userId)
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(rateLimit.resetMs / 1000)} seconds.`)
  }

  // 2. Check mentor config for this week
  const mentorConfig = await db.mentorConfig.findUnique({
    where: { weekId: input.weekId },
  })

  if (mentorConfig && !mentorConfig.mentorEnabled) {
    throw new Error("Mentor is not enabled for this week")
  }

  // 3. Pre-classify the error
  const classificationInput: ClassificationInput = {
    code: input.code,
    compileError: input.compileError,
    runtimeError: input.runtimeError,
    stderr: input.stderr,
    testResults: input.testResults,
    executionMs: input.executionMs,
    status: input.status,
  }

  const preClassification = classifyError(classificationInput)

  // 4. Build prompts
  const systemPrompt = SYSTEM_PROMPT
    .replace("{allowedTopics}", input.allowedTopics.join(", ") || "Basic Java programming")
    .replace("{weekNumber}", String(input.weekNumber))

  const userPrompt = buildUserPrompt(input, preClassification)

  // 5. Call OpenAI (or fallback)
  const { response: aiResponse, modelUsed, error } = await callOpenAI(systemPrompt, userPrompt)

  let finalResponse: MentorResponse

  if (aiResponse && validateResponse(aiResponse)) {
    // Check guardrail: no full solutions
    if (containsFullSolution(aiResponse)) {
      console.warn("[Mentor] Response contained full solution, using fallback")
      const fallback = generateFallbackResponse(preClassification)
      finalResponse = {
        ...fallback,
        preClassification,
        modelUsed: null,
        responseTimeMs: Date.now() - startTime,
      }
    } else {
      // Map AI category to enum (with fallback)
      const categoryMap: Record<string, MentorErrorCategory> = {
        SYNTAX: "SYNTAX",
        LOGIC: "LOGIC",
        EDGE_CASE: "EDGE_CASE",
        TIMEOUT: "TIMEOUT",
        OUTPUT_FORMAT: "OUTPUT_FORMAT",
        NULL_HANDLING: "NULL_HANDLING",
        OFF_BY_ONE: "OFF_BY_ONE",
        TYPE_ERROR: "TYPE_ERROR",
        RUNTIME_ERROR: "RUNTIME_ERROR",
        OTHER: "OTHER",
      }

      finalResponse = {
        errorCategory: categoryMap[aiResponse.errorCategory] || preClassification.category,
        shortDiagnosis: aiResponse.shortDiagnosis,
        reasoningHint: aiResponse.reasoningHint,
        guidingQuestions: aiResponse.guidingQuestions.slice(0, 2),
        progressiveHints: aiResponse.progressiveHints.slice(0, 3),
        nextActions: aiResponse.nextActions.slice(0, 3),
        confidence: Math.min(100, Math.max(0, aiResponse.confidence)),
        preClassification,
        modelUsed,
        responseTimeMs: Date.now() - startTime,
      }
    }
  } else {
    // Use fallback
    if (error) {
      console.log("[Mentor] Using fallback due to:", error)
    }
    const fallback = generateFallbackResponse(preClassification)
    finalResponse = {
      ...fallback,
      preClassification,
      modelUsed: null,
      responseTimeMs: Date.now() - startTime,
    }
  }

  // 6. Persist to database
  await db.mentorMessage.create({
    data: {
      userId: input.userId,
      questionId: input.questionId,
      assignmentId: input.assignmentId,
      weekId: input.weekId,
      inputSnapshot: {
        code: input.code.substring(0, 5000), // Limit stored code
        testResults: input.testResults,
        allowedTopics: input.allowedTopics,
        status: input.status,
      },
      output: {
        errorCategory: finalResponse.errorCategory,
        shortDiagnosis: finalResponse.shortDiagnosis,
        reasoningHint: finalResponse.reasoningHint,
        guidingQuestions: finalResponse.guidingQuestions,
        progressiveHints: finalResponse.progressiveHints,
        nextActions: finalResponse.nextActions,
        confidence: finalResponse.confidence,
      },
      errorCategory: finalResponse.errorCategory,
      confidence: finalResponse.confidence,
      preClassification: preClassification as object,
      responseTimeMs: finalResponse.responseTimeMs,
      modelUsed: finalResponse.modelUsed,
    },
  })

  return finalResponse
}

/**
 * Get mentor history for a question
 */
export async function getMentorHistory(userId: string, questionId: string) {
  return db.mentorMessage.findMany({
    where: { userId, questionId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      errorCategory: true,
      output: true,
      createdAt: true,
    },
  })
}
