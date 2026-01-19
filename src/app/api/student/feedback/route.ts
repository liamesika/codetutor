import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStudentMistakeInsights } from "@/lib/mentor/pedagogical-engine"
import { db } from "@/lib/db"

// GET /api/student/feedback - Get student's mistake insights and recent feedback
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const attemptId = searchParams.get("attemptId")

    // If attemptId provided, get feedback for specific attempt
    if (attemptId) {
      const feedback = await db.pedagogicalFeedback.findFirst({
        where: {
          attemptId,
          mistakeLog: { userId: session.user.id },
        },
        include: {
          mistakeLog: {
            select: {
              mistakeType: true,
              severity: true,
              skillArea: true,
              isRecurring: true,
            },
          },
        },
      })

      if (!feedback) {
        return NextResponse.json({ feedback: null })
      }

      return NextResponse.json({
        feedback: {
          conceptualCategory: feedback.conceptualCategory,
          explanation: feedback.explanation,
          whyItMatters: feedback.whyItMatters,
          guidingQuestion: feedback.guidingQuestion,
          hint: feedback.hint,
          suggestedTopic: feedback.suggestedTopic,
          relatedConcepts: feedback.relatedConcepts,
          mistakeType: feedback.mistakeLog.mistakeType,
          severity: feedback.mistakeLog.severity,
          skillArea: feedback.mistakeLog.skillArea,
          isRecurring: feedback.mistakeLog.isRecurring,
        },
      })
    }

    // Otherwise, get full insights
    const insights = await getStudentMistakeInsights(session.user.id)

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Student feedback error:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}
