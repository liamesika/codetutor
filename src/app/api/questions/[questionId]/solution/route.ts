import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const question = await db.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        solutionCode: true,
        points: true,
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    // Deduct points for revealing solution
    const penaltyAmount = -50

    await db.pointsLedger.create({
      data: {
        userId,
        amount: penaltyAmount,
        type: "REVEAL_PENALTY",
        description: `Revealed solution for question`,
        metadata: { questionId },
      },
    })

    // Log event
    await db.eventLog.create({
      data: {
        userId,
        eventType: "SOLUTION_REVEALED",
        payload: { questionId },
      },
    })

    return NextResponse.json({
      solutionCode: question.solutionCode,
      pointsDeducted: Math.abs(penaltyAmount),
    })
  } catch (error) {
    console.error("Error revealing solution:", error)
    return NextResponse.json(
      { error: "Failed to reveal solution" },
      { status: 500 }
    )
  }
}
