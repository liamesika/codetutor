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

    const weeks = await db.week.findMany({
      orderBy: { weekNumber: "asc" },
      include: {
        topics: {
          orderBy: { orderIndex: "asc" },
          include: {
            _count: {
              select: {
                questions: true,
                lessons: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(weeks)
  } catch (error) {
    console.error("Error fetching weeks:", error)
    return NextResponse.json(
      { error: "Failed to fetch weeks" },
      { status: 500 }
    )
  }
}
