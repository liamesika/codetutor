import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const { weekId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const week = await db.week.update({
      where: { id: weekId },
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
        eventType: "WEEK_UPDATED",
        payload: { weekId, changes: body },
      },
    })

    return NextResponse.json(week)
  } catch (error) {
    console.error("Error updating week:", error)
    return NextResponse.json(
      { error: "Failed to update week" },
      { status: 500 }
    )
  }
}
