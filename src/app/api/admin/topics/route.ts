import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const topics = await db.topic.findMany({
      orderBy: [
        { week: { weekNumber: "asc" } },
        { orderIndex: "asc" },
      ],
      include: {
        week: {
          select: {
            weekNumber: true,
          },
        },
      },
    })

    return NextResponse.json(topics)
  } catch (error) {
    console.error("Error fetching topics:", error)
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    )
  }
}
