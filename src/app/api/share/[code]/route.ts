import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Get shared achievement by code (public endpoint)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code) {
      return NextResponse.json({ error: "Share code required" }, { status: 400 })
    }

    const shared = await db.sharedAchievement.findUnique({
      where: { shareCode: code },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!shared) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 })
    }

    // Check expiration
    if (shared.expiresAt && shared.expiresAt < new Date()) {
      return NextResponse.json({ error: "Share has expired" }, { status: 410 })
    }

    // Increment view count
    await db.sharedAchievement.update({
      where: { id: shared.id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({
      shareType: shared.shareType,
      title: shared.title,
      description: shared.description,
      metadata: shared.metadata,
      user: {
        name: shared.user.name,
        image: shared.user.image,
      },
      viewCount: shared.viewCount + 1,
      createdAt: shared.createdAt,
    })
  } catch (error) {
    console.error("Error fetching shared achievement:", error)
    return NextResponse.json(
      { error: "Failed to fetch share" },
      { status: 500 }
    )
  }
}
