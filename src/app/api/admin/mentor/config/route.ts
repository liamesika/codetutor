import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// GET - Get current mentor configuration
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create the global mentor config
    let config = await db.mentorConfig.findFirst()

    if (!config) {
      // Create default config
      config = await db.mentorConfig.create({
        data: {
          mentorEnabled: true,
          maxCallsPerDay: 50,
          allowedModels: ["gpt-4o-mini"],
        },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching mentor config:", error)
    return NextResponse.json(
      { error: "Failed to fetch mentor configuration" },
      { status: 500 }
    )
  }
}

// Schema for updating mentor config
const updateConfigSchema = z.object({
  mentorEnabled: z.boolean().optional(),
  maxCallsPerDay: z.number().min(1).max(500).optional(),
  systemPromptOverride: z.string().max(5000).nullable().optional(),
  allowedModels: z.array(z.string()).optional(),
})

// PUT - Update mentor configuration
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = updateConfigSchema.parse(body)

    // Get or create the global mentor config
    let config = await db.mentorConfig.findFirst()

    if (!config) {
      // Create with provided values
      config = await db.mentorConfig.create({
        data: {
          mentorEnabled: validated.mentorEnabled ?? true,
          maxCallsPerDay: validated.maxCallsPerDay ?? 50,
          systemPromptOverride: validated.systemPromptOverride ?? null,
          allowedModels: validated.allowedModels ?? ["gpt-4o-mini"],
        },
      })
    } else {
      // Update existing config
      config = await db.mentorConfig.update({
        where: { id: config.id },
        data: {
          ...(validated.mentorEnabled !== undefined && { mentorEnabled: validated.mentorEnabled }),
          ...(validated.maxCallsPerDay !== undefined && { maxCallsPerDay: validated.maxCallsPerDay }),
          ...(validated.systemPromptOverride !== undefined && { systemPromptOverride: validated.systemPromptOverride }),
          ...(validated.allowedModels !== undefined && { allowedModels: validated.allowedModels }),
          updatedAt: new Date(),
        },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating mentor config:", error)
    return NextResponse.json(
      { error: "Failed to update mentor configuration" },
      { status: 500 }
    )
  }
}
