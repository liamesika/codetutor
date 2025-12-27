import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { processDailyLogin, getDailyLoginStatus } from "@/lib/daily-login"
import { getUserRankData } from "@/lib/ranks"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const status = await getDailyLoginStatus(session.user.id)
    const rankData = await getUserRankData(session.user.id)

    return NextResponse.json({
      ...status,
      rank: rankData,
    })
  } catch (error) {
    console.error("Daily login status error:", error)
    return NextResponse.json(
      { error: "Failed to get daily login status" },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await processDailyLogin(session.user.id)
    const rankData = await getUserRankData(session.user.id)

    return NextResponse.json({
      ...result,
      rank: rankData,
    })
  } catch (error) {
    console.error("Daily login error:", error)
    return NextResponse.json(
      { error: "Failed to process daily login" },
      { status: 500 }
    )
  }
}
