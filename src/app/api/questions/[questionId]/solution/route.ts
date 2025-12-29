import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getUserProgress } from "@/lib/progression"

// Solution reveal costs 50 XP
const SOLUTION_COST = 50

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

    // CRITICAL: Check if user has sufficient XP before deducting
    const userProgress = await getUserProgress(userId)
    if (userProgress.xp < SOLUTION_COST) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_XP",
          message: "You don't have enough XP to reveal the solution. Solve more questions to earn XP!",
          required: SOLUTION_COST,
          available: userProgress.xp,
        },
        { status: 403 }
      )
    }

    // Deduct XP from user progress
    await db.userProgress.update({
      where: { userId },
      data: {
        xp: { decrement: SOLUTION_COST },
      },
    })

    // Log to points ledger for audit trail
    await db.pointsLedger.create({
      data: {
        userId,
        amount: -SOLUTION_COST,
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

    // Get updated XP after deduction
    const updatedProgress = await getUserProgress(userId)

    return NextResponse.json({
      solutionCode: question.solutionCode,
      pointsDeducted: SOLUTION_COST,
      currentXp: updatedProgress.xp,
    })
  } catch (error) {
    console.error("Error revealing solution:", error)
    return NextResponse.json(
      { error: "Failed to reveal solution" },
      { status: 500 }
    )
  }
}
