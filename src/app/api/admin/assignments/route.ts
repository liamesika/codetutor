import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const assignmentSchema = z.object({
  weekId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  isPublished: z.boolean().optional(),
  questionIds: z.array(z.string()).optional(),
})

// GET - List all assignments (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const weekId = searchParams.get("weekId")

    const assignments = await db.assignment.findMany({
      where: weekId ? { weekId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        week: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
          },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
          include: {
            question: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                points: true,
              },
            },
          },
        },
        _count: {
          select: { submissions: true },
        },
      },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    )
  }
}

// POST - Create new assignment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = assignmentSchema.parse(body)

    const assignment = await db.assignment.create({
      data: {
        weekId: data.weekId,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        isPublished: data.isPublished ?? false,
        questions: data.questionIds
          ? {
              create: data.questionIds.map((questionId, index) => ({
                questionId,
                orderIndex: index,
              })),
            }
          : undefined,
      },
      include: {
        week: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
          },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
          include: {
            question: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                points: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Error creating assignment:", error)
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    )
  }
}
