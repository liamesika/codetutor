import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { completeDailyChallenge } from "@/lib/daily-challenge"
import { z } from "zod"

const completeSchema = z.object({
  challengeId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { challengeId } = completeSchema.parse(body)

    const result = await completeDailyChallenge(session.user.id, challengeId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error completing daily challenge:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Failed to complete daily challenge" },
      { status: 500 }
    )
  }
}
