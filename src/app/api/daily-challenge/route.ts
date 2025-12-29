import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDailyChallenge, getDailyChallengeStreak } from "@/lib/daily-challenge"

// Generate unique request ID for error tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Default response when no challenge is available
const DEFAULT_RESPONSE = {
  challenge: null,
  streak: 0,
}

export async function GET() {
  const requestId = generateRequestId()

  try {
    // Get session with defensive handling
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (sessionError) {
      console.error(`[DAILY-CHALLENGE API][${requestId}] Session retrieval failed:`, sessionError)
      return NextResponse.json(
        { error: "Unauthorized", ...DEFAULT_RESPONSE },
        { status: 401, headers: { "X-Request-Id": requestId } }
      )
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", ...DEFAULT_RESPONSE },
        { status: 401, headers: { "X-Request-Id": requestId } }
      )
    }

    const userId = session.user.id

    // Get daily challenge (defensive - may return null)
    let challenge = null
    try {
      challenge = await getDailyChallenge(userId)
    } catch (challengeError) {
      console.error(`[DAILY-CHALLENGE API][${requestId}] Failed to get daily challenge:`, challengeError)
      // Continue with null challenge - don't crash
    }

    // Get streak (defensive - default to 0)
    let streak = 0
    try {
      streak = await getDailyChallengeStreak(userId)
    } catch (streakError) {
      console.error(`[DAILY-CHALLENGE API][${requestId}] Failed to get streak:`, streakError)
      // Continue with 0 streak - don't crash
    }

    return NextResponse.json(
      {
        challenge,
        streak: streak ?? 0,
      },
      { headers: { "X-Request-Id": requestId } }
    )
  } catch (error) {
    console.error(`[DAILY-CHALLENGE API][${requestId}] Unexpected error:`, error)
    // Return safe default instead of 500
    return NextResponse.json(
      DEFAULT_RESPONSE,
      {
        status: 200,
        headers: { "X-Request-Id": requestId, "X-Error": "unexpected_error" },
      }
    )
  }
}
