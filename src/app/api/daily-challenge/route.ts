import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDailyChallenge, getDailyChallengeStreak } from "@/lib/daily-challenge"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const challenge = await getDailyChallenge(session.user.id)
    const streak = await getDailyChallengeStreak(session.user.id)

    return NextResponse.json({
      challenge,
      streak,
    })
  } catch (error) {
    console.error("Error fetching daily challenge:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    )
  }
}
