import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserProgress, getLeaderboard } from "@/lib/progression"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const progress = await getUserProgress(session.user.id)

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Error fetching progression:", error)
    return NextResponse.json(
      { error: "Failed to fetch progression" },
      { status: 500 }
    )
  }
}
