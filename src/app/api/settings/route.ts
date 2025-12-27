import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const settingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  notifications: z
    .object({
      dailyChallenge: z.boolean(),
      weeklyProgress: z.boolean(),
      achievements: z.boolean(),
    })
    .optional(),
  preferences: z
    .object({
      codeEditorTheme: z.string(),
      fontSize: z.number().min(10).max(24),
    })
    .optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return safe defaults since settings field doesn't exist yet
    return NextResponse.json({
      name: user.name || "",
      email: user.email || "",
      notifications: {
        dailyChallenge: true,
        weeklyProgress: true,
        achievements: true,
      },
      preferences: {
        codeEditorTheme: "vs-dark",
        fontSize: 14,
      },
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = settingsSchema.parse(body)

    // Update user name only (settings field doesn't exist in schema)
    if (parsed.name) {
      await db.user.update({
        where: { id: session.user.id },
        data: { name: parsed.name },
      })
    }

    // For now, just return success
    // TODO: Add settings field to User model for full settings persistence
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid settings data", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
