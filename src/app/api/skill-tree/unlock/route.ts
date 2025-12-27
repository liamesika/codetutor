import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { unlockSkillNode } from "@/lib/skill-tree"
import { z } from "zod"

const unlockSchema = z.object({
  nodeId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { nodeId } = unlockSchema.parse(body)

    const result = await unlockSkillNode(session.user.id, nodeId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error unlocking skill node:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to unlock skill node" },
      { status: 500 }
    )
  }
}
