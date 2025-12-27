import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateWeekSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublished: z.boolean().optional(),
  isLocked: z.boolean().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const { weekId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const week = await db.week.findUnique({
      where: { id: weekId },
      include: {
        course: { select: { id: true, name: true, slug: true } },
        topics: {
          orderBy: { orderIndex: "asc" },
          include: {
            questions: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                slug: true,
                title: true,
                type: true,
                difficulty: true,
                isActive: true,
                isPublished: true,
              },
            },
          },
        },
      },
    })

    if (!week) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 })
    }

    return NextResponse.json(week)
  } catch (error) {
    console.error("Error fetching week:", error)
    return NextResponse.json(
      { error: "Failed to fetch week" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const { weekId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateWeekSchema.parse(body)

    const week = await db.week.update({
      where: { id: weekId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(week)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Error updating week:", error)
    return NextResponse.json(
      { error: "Failed to update week" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const { weekId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Soft delete - just unpublish
    await db.week.update({
      where: { id: weekId },
      data: { isPublished: false, isLocked: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting week:", error)
    return NextResponse.json(
      { error: "Failed to delete week" },
      { status: 500 }
    )
  }
}
