import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const testCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean().optional(),
  description: z.string().optional(),
  timeLimit: z.number().optional(),
  memoryLimit: z.number().optional(),
})

const updateQuestionSchema = z.object({
  title: z.string().min(1).optional(),
  prompt: z.string().min(1).optional(),
  constraints: z.string().nullable().optional(),
  starterCode: z.string().min(1).optional(),
  solutionCode: z.string().min(1).optional(),
  tests: z.array(testCaseSchema).optional(),
  hints: z.array(z.string()).optional(),
  explanation: z.string().nullable().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  points: z.number().min(1).optional(),
  xpReward: z.number().min(1).optional(),
  timeLimit: z.number().min(1000).optional(),
  memoryLimit: z.number().min(64).optional(),
  estimatedMinutes: z.number().min(1).optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  type: z.enum(["FULL_PROGRAM", "FUNCTION", "FIX_BUG", "PREDICT_OUTPUT"]).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const question = await db.question.findUnique({
      where: { id: questionId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
            week: {
              select: {
                id: true,
                weekNumber: true,
                title: true,
                course: { select: { id: true, name: true } },
              },
            },
          },
        },
        _count: {
          select: { attempts: true, hintUsages: true },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // Get pass rate
    const passCount = await db.attempt.count({
      where: { questionId, status: "PASS" },
    })
    const totalAttempts = question._count.attempts
    const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0

    return NextResponse.json({
      ...question,
      passRate,
      passCount,
    })
  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateQuestionSchema.parse(body)

    const question = await db.question.update({
      where: { id: questionId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(question)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Error updating question:", error)
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Soft delete - just deactivate
    await db.question.update({
      where: { id: questionId },
      data: { isActive: false, isPublished: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    )
  }
}
