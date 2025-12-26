import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const topic = await db.topic.findUnique({
      where: { id: topicId },
      include: {
        week: true,
        lessons: { orderBy: { orderIndex: "asc" } },
        questions: { orderBy: { orderIndex: "asc" } },
      },
    })

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      )
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const topic = await db.topic.update({
      where: { id: topicId },
      data: {
        title: body.title,
        description: body.description,
        isLocked: body.isLocked,
      },
    })

    // Log the action
    await db.eventLog.create({
      data: {
        userId: session.user.id,
        eventType: "TOPIC_UPDATED",
        payload: { topicId, changes: body },
      },
    })

    return NextResponse.json(topic)
  } catch (error) {
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await db.topic.delete({
      where: { id: topicId },
    })

    // Log the action
    await db.eventLog.create({
      data: {
        userId: session.user.id,
        eventType: "TOPIC_DELETED",
        payload: { topicId },
      },
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
