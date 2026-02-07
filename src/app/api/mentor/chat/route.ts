import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { chatWithMentor } from "@/lib/mentor/mentor-service"
import { checkProAccess } from "@/lib/entitlement"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const chatSchema = z.object({
  questionId: z.string(),
  message: z.string().min(1).max(1000, "Message too long"),
  code: z.string().max(50000),
  questionTitle: z.string(),
  questionPrompt: z.string(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20),
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

    // 3. Parse input
    const body = await req.json()
    const input = chatSchema.parse(body)

    // 4. Look up question for week context
    const question = await db.question.findUnique({
      where: { id: input.questionId },
      include: {
        topic: {
          include: {
            week: {
              include: {
                topics: { select: { title: true } },
              },
            },
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const allowedTopics = question.topic.week.topics.map((t) => t.title)

    // 5. Call chat service
    const result = await chatWithMentor({
      userId,
      questionId: input.questionId,
      weekId: question.topic.week.id,
      message: input.message,
      code: input.code,
      questionTitle: input.questionTitle,
      questionPrompt: input.questionPrompt,
      allowedTopics,
      weekNumber: question.topic.week.weekNumber,
      history: input.history,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes("Rate limit")) {
      return NextResponse.json({ error: error.message }, { status: 429 })
    }

    console.error("[Mentor Chat API] Error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}
