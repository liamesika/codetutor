import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const saveDraftSchema = z.object({
  questionId: z.string(),
  code: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { questionId, code } = saveDraftSchema.parse(body)

    const userId = session.user.id

    // Upsert draft
    await db.codeDraft.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
      update: {
        code,
        updatedAt: new Date(),
      },
      create: {
        userId,
        questionId,
        code,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Error saving draft:", error)
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    )
  }
}
