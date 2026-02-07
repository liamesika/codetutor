import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { analyzeMistake, MentorInput } from "@/lib/mentor/mentor-service"
import { checkProAccess } from "@/lib/entitlement"

// Force Node.js runtime for OpenAI
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Input validation schema
const analyzeSchema = z.object({
  questionId: z.string(),
  assignmentId: z.string().optional(),
  code: z.string().max(50000, "Code too long"),
  compileError: z.string().nullable(),
  runtimeError: z.string().nullable(),
  stderr: z.string().nullable(),
  testResults: z.array(
    z.object({
      testIndex: z.number(),
      input: z.string(),
      expected: z.string(),
      actual: z.string().nullable(),
      passed: z.boolean(),
      error: z.string().nullable(),
      isHidden: z.boolean().optional(),
    })
  ),
  executionMs: z.number().nullable(),
  status: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // 2. PRO access check
    const hasProAccess = await checkProAccess(userId)
    if (!hasProAccess) {
      return NextResponse.json(
        { error: "PRO subscription required", code: "PRO_REQUIRED" },
        { status: 403 }
      )
    }

    // 3. Parse and validate input
    const body = await req.json()
    const validatedInput = analyzeSchema.parse(body)

    // 4. Get question with topic and week info
    const question = await db.question.findUnique({
      where: { id: validatedInput.questionId },
      include: {
        topic: {
          include: {
            week: {
              include: {
                topics: {
                  select: { title: true },
                },
                mentorConfig: true,
              },
            },
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // 4. Check if mentor is enabled for this week
    if (question.topic.week.mentorConfig?.mentorEnabled === false) {
      return NextResponse.json(
        { error: "Mentor is not available for this week" },
        { status: 403 }
      )
    }

    // 5. Build allowed topics from current week
    const allowedTopics = question.topic.week.topics.map((t) => t.title)

    // 6. Get student's recent mistake patterns (optional enhancement)
    const recentMistakes = await db.mistakeLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { mistakeType: true, skillArea: true },
    })

    const recentMistakeTypes = [...new Set(recentMistakes.map((m) => m.mistakeType))]
    const weakTopics = [...new Set(recentMistakes.map((m) => m.skillArea).filter(Boolean))] as string[]

    // 7. Build mentor input
    const mentorInput: MentorInput = {
      userId,
      questionId: validatedInput.questionId,
      assignmentId: validatedInput.assignmentId,
      weekId: question.topic.week.id,
      code: validatedInput.code,
      compileError: validatedInput.compileError,
      runtimeError: validatedInput.runtimeError,
      stderr: validatedInput.stderr,
      testResults: validatedInput.testResults,
      executionMs: validatedInput.executionMs,
      status: validatedInput.status,
      questionTitle: question.title,
      questionPrompt: question.prompt,
      questionConstraints: question.constraints,
      starterCode: question.starterCode,
      allowedTopics,
      weekNumber: question.topic.week.weekNumber,
      studentProfile: {
        recentMistakeTypes,
        weakTopics,
      },
    }

    // 8. Analyze mistake
    const response = await analyzeMistake(mentorInput)

    // 9. Return response (excluding internal fields)
    return NextResponse.json({
      errorCategory: response.errorCategory,
      shortDiagnosis: response.shortDiagnosis,
      reasoningHint: response.reasoningHint,
      guidingQuestions: response.guidingQuestions,
      progressiveHints: response.progressiveHints,
      nextActions: response.nextActions,
      confidence: response.confidence,
      testAnalysis: response.preClassification.testAnalysis,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Handle rate limit errors
      if (error.message.includes("Rate limit")) {
        return NextResponse.json({ error: error.message }, { status: 429 })
      }

      // Handle mentor disabled
      if (error.message.includes("not enabled")) {
        return NextResponse.json({ error: error.message }, { status: 403 })
      }
    }

    console.error("[Mentor API] Error:", error)
    return NextResponse.json(
      { error: "Failed to analyze code" },
      { status: 500 }
    )
  }
}

// GET - Get mentor history for a question
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // PRO access check
    const hasProAccess = await checkProAccess(session.user.id)
    if (!hasProAccess) {
      return NextResponse.json(
        { error: "PRO subscription required", code: "PRO_REQUIRED" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const questionId = searchParams.get("questionId")

    if (!questionId) {
      return NextResponse.json({ error: "questionId required" }, { status: 400 })
    }

    const history = await db.mentorMessage.findMany({
      where: {
        userId: session.user.id,
        questionId,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        errorCategory: true,
        output: true,
        confidence: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error("[Mentor API] History error:", error)
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    )
  }
}
