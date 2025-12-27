import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateTopicSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublished: z.boolean().optional(),
  isLocked: z.boolean().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const topic = await db.topic.findUnique({
      where: { id: topicId },
      include: {
        week: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
            course: { select: { id: true, name: true, slug: true } },
          },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
          include: {
            _count: { select: { attempts: true } },
          },
        },
        lessons: {
          orderBy: { orderIndex: "asc" },
        },
      },
    })

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json(topic)
  } catch (error) {
    console.error("Error fetching topic:", error)
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateTopicSchema.parse(body)

    const topic = await db.topic.update({
      where: { id: topicId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(topic)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Error updating topic:", error)
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Soft delete - just unpublish
    await db.topic.update({
      where: { id: topicId },
      data: { isPublished: false, isLocked: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting topic:", error)
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    )
  }
}
