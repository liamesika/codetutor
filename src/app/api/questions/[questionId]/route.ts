import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { canAccessQuestion } from "@/lib/subscription"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params
    const session = await getServerSession(authOptions)

    const question = await db.question.findUnique({
      where: { id: questionId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
            week: {
              select: {
                id: true,
                weekNumber: true,
                title: true,
              },
            },
          },
        },
        questionTags: {
          select: { tag: true },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    // Entitlement check - verify user can access this question's week
    if (session?.user?.id) {
      const access = await canAccessQuestion(session.user.id, questionId)
      if (!access.allowed) {
        return NextResponse.json(
          { error: access.reason || "Content locked", weekNumber: access.weekNumber },
          { status: 403 }
        )
      }
    }

    // Get user's draft and hint usage if logged in
    let draft = null
    let hintsUsed = 0
    let attemptCount = 0
    let hasPassed = false

    if (session?.user?.id) {
      const userId = session.user.id

      const draftRecord = await db.codeDraft.findUnique({
        where: {
          userId_questionId: {
            userId,
            questionId,
          },
        },
      })
      draft = draftRecord?.code || null

      const hintUsageRecords = await db.hintUsage.findMany({
        where: { userId, questionId },
      })
      hintsUsed = hintUsageRecords.length

      attemptCount = await db.attempt.count({
        where: { userId, questionId },
      })

      const passedAttempt = await db.attempt.findFirst({
        where: { userId, questionId, status: "PASS" },
      })
      hasPassed = !!passedAttempt
    }

    // Parse hints from JSON
    const hints = question.hints as string[]

    return NextResponse.json({
      id: question.id,
      title: question.title,
      type: question.type,
      prompt: question.prompt,
      constraints: question.constraints,
      starterCode: question.starterCode,
      difficulty: question.difficulty,
      estimatedMinutes: question.estimatedMinutes,
      points: question.points,
      hints,
      hintsUsed,
      draft,
      attemptCount,
      hasPassed,
      topic: question.topic,
      tags: question.questionTags.map((t) => t.tag),
      // Only include solution if user has revealed it (handled client-side)
    })
  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    )
  }
}
