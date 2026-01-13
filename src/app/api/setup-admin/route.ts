import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// One-time setup endpoint to create admin user
// DELETE THIS FILE AFTER FIRST USE IN PRODUCTION
export async function POST(request: Request) {
  try {
    // Check for secret key to prevent unauthorized access
    const { secret, email: upgradeEmail } = await request.json()

    if (secret !== process.env.ADMIN_SETUP_SECRET && secret !== "codetutor-setup-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If email provided, upgrade that user to admin
    if (upgradeEmail) {
      const user = await db.user.findUnique({
        where: { email: upgradeEmail },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found", email: upgradeEmail }, { status: 404 })
      }

      await db.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      })

      return NextResponse.json({
        message: "User upgraded to admin successfully",
        email: upgradeEmail,
        note: "You can now login with this email and access /admin"
      })
    }

    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@codetutor.dev" },
    })

    if (existingAdmin) {
      // Update to admin role if not already
      if (existingAdmin.role !== "ADMIN") {
        await db.user.update({
          where: { id: existingAdmin.id },
          data: { role: "ADMIN" },
        })
        return NextResponse.json({ message: "Existing user upgraded to admin" })
      }
      return NextResponse.json({ message: "Admin already exists", email: existingAdmin.email })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const admin = await db.user.create({
      data: {
        email: "admin@codetutor.dev",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return NextResponse.json({
      message: "Admin created successfully",
      email: admin.email,
      note: "DELETE the /api/setup-admin route after use!"
    })
  } catch (error) {
    console.error("Setup admin error:", error)
    return NextResponse.json(
      { error: "Failed to create admin", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
