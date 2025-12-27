import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courses = await db.course.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        weeks: {
          orderBy: { orderIndex: "asc" },
          include: {
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
                    orderIndex: true,
                    _count: {
                      select: { attempts: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching curriculum:", error)
    return NextResponse.json(
      { error: "Failed to fetch curriculum" },
      { status: 500 }
    )
  }
}
