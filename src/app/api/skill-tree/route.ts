import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getSkillTree, seedSkillNodesFromTopics } from "@/lib/skill-tree"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tree = await getSkillTree(session.user.id)

    return NextResponse.json(tree)
  } catch (error) {
    console.error("Error fetching skill tree:", error)
    return NextResponse.json(
      { error: "Failed to fetch skill tree" },
      { status: 500 }
    )
  }
}

// POST to seed skill nodes (admin only)
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if admin
    // For now, allow any authenticated user to seed
    const result = await seedSkillNodesFromTopics()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error seeding skill tree:", error)
    return NextResponse.json(
      { error: "Failed to seed skill tree" },
      { status: 500 }
    )
  }
}
