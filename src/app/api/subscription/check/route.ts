import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkSubscriptionGate, canAccessTopic, canAccessQuestion } from "@/lib/subscription"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { weekNumber, topicId, questionId } = body

    // Check by week number
    if (weekNumber !== undefined) {
      const result = await checkSubscriptionGate(session.user.id, weekNumber)
      return NextResponse.json(result)
    }

    // Check by topic ID
    if (topicId) {
      const result = await canAccessTopic(session.user.id, topicId)
      return NextResponse.json({
        isLocked: !result.allowed,
        weekNumber: result.weekNumber,
        message: result.reason,
      })
    }

    // Check by question ID
    if (questionId) {
      const result = await canAccessQuestion(session.user.id, questionId)
      return NextResponse.json({
        isLocked: !result.allowed,
        weekNumber: result.weekNumber,
        message: result.reason,
      })
    }

    return NextResponse.json(
      { error: "Must provide weekNumber, topicId, or questionId" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Subscription check error:", error)
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    )
  }
}
