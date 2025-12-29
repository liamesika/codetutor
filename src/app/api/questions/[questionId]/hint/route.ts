import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getUserProgress } from "@/lib/progression"

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
        hints: true,
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    const hints = question.hints as string[]

    // Get current hint usage
    const usedHints = await db.hintUsage.findMany({
      where: { userId, questionId },
      orderBy: { hintIndex: "asc" },
    })

    const nextHintIndex = usedHints.length

    if (nextHintIndex >= hints.length) {
      return NextResponse.json(
        { error: "No more hints available" },
        { status: 400 }
      )
    }

    // Calculate hint cost (increases with each hint: 10, 20, 30, ...)
    const hintCost = 10 * (nextHintIndex + 1)

    // CRITICAL: Check if user has sufficient XP before deducting
    const userProgress = await getUserProgress(userId)
    if (userProgress.xp < hintCost) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_XP",
          message: "You don't have enough XP for this hint. Solve more questions to earn XP!",
          required: hintCost,
          available: userProgress.xp,
        },
        { status: 403 }
      )
    }

    // Record hint usage
    await db.hintUsage.create({
      data: {
        userId,
        questionId,
        hintIndex: nextHintIndex,
        pointsCost: hintCost,
      },
    })

    // Deduct XP from user progress (ensure it never goes below 0)
    await db.userProgress.update({
      where: { userId },
      data: {
        xp: { decrement: hintCost },
      },
    })

    // Log to points ledger for audit trail
    await db.pointsLedger.create({
      data: {
        userId,
        amount: -hintCost,
        type: "HINT_PENALTY",
        description: `Used hint ${nextHintIndex + 1} for question`,
        metadata: { questionId, hintIndex: nextHintIndex },
      },
    })

    // Get updated XP after deduction
    const updatedProgress = await getUserProgress(userId)

    return NextResponse.json({
      hintIndex: nextHintIndex,
      hint: hints[nextHintIndex],
      pointsDeducted: hintCost,
      remainingHints: hints.length - nextHintIndex - 1,
      currentXp: updatedProgress.xp,
    })
  } catch (error) {
    console.error("Error using hint:", error)
    return NextResponse.json(
      { error: "Failed to use hint" },
      { status: 500 }
    )
  }
}
