import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserRankData, getLeagueLeaderboard } from "@/lib/ranks"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rankData = await getUserRankData(session.user.id)
    const leaderboard = await getLeagueLeaderboard(20)

    return NextResponse.json({
      ...rankData,
      leaderboard,
    })
  } catch (error) {
    console.error("Rank data error:", error)
    return NextResponse.json(
      { error: "Failed to get rank data" },
      { status: 500 }
    )
  }
}
