import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const questionSchema = z.object({
  topicId: z.string(),
  type: z.enum(["FULL_PROGRAM", "FUNCTION", "FIX_BUG", "PREDICT_OUTPUT"]),
  title: z.string().min(1),
  prompt: z.string().min(1),
  constraints: z.string().optional(),
  starterCode: z.string().min(1),
  solutionCode: z.string().min(1),
  hints: z.array(z.string()),
  tests: z.array(z.object({
    input: z.string(),
    expected: z.string(),
  })),
  difficulty: z.number().min(1).max(5),
  points: z.number().min(10).max(500),
  estimatedMinutes: z.number().min(1).max(60),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const questions = await db.question.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        topic: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: { attempts: true },
        },
      },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = questionSchema.parse(body)

    // Get next order index for topic
    const lastQuestion = await db.question.findFirst({
      where: { topicId: data.topicId },
      orderBy: { orderIndex: "desc" },
    })
    const orderIndex = (lastQuestion?.orderIndex ?? -1) + 1

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) + "-" + orderIndex

    const question = await db.question.create({
      data: {
        topicId: data.topicId,
        slug,
        type: data.type,
        title: data.title,
        prompt: data.prompt,
        constraints: data.constraints || null,
        starterCode: data.starterCode,
        solutionCode: data.solutionCode,
        hints: data.hints,
        tests: data.tests,
        difficulty: data.difficulty,
        points: data.points,
        estimatedMinutes: data.estimatedMinutes,
        isActive: data.isActive ?? true,
        orderIndex,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Error creating question:", error)
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    )
  }
}
