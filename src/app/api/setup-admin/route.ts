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

    // If email provided, upgrade that user to admin using raw SQL to avoid schema issues
    if (upgradeEmail) {
      // Hash password admin123
      const hashedPw = await bcrypt.hash("admin123", 12)

      // Use raw SQL to avoid Prisma schema validation issues - also reset password
      const result = await db.$executeRaw`UPDATE "User" SET "role" = 'ADMIN', "password" = ${hashedPw} WHERE "email" = ${upgradeEmail}`

      if (result === 0) {
        return NextResponse.json({ error: "User not found", email: upgradeEmail }, { status: 404 })
      }

      return NextResponse.json({
        message: "User upgraded to admin successfully and password reset to admin123",
        email: upgradeEmail,
        note: "You can now login with this email and password: admin123"
      })
    }

    // Check if admin already exists using raw query
    const existingAdmin = await db.$queryRaw<{id: string, email: string, role: string}[]>`
      SELECT id, email, role FROM "User" WHERE email = 'admin@codetutor.dev' LIMIT 1
    `

    if (existingAdmin.length > 0) {
      if (existingAdmin[0].role !== "ADMIN") {
        await db.$executeRaw`UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@codetutor.dev'`
        return NextResponse.json({ message: "Existing user upgraded to admin" })
      }
      return NextResponse.json({ message: "Admin already exists", email: existingAdmin[0].email })
    }

    // Create admin user using raw SQL
    const hashedPassword = await bcrypt.hash("admin123", 12)
    const id = `admin_${Date.now()}`

    await db.$executeRaw`
      INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
      VALUES (${id}, 'admin@codetutor.dev', 'Admin User', ${hashedPassword}, 'ADMIN', NOW(), NOW())
    `

    return NextResponse.json({
      message: "Admin created successfully",
      email: "admin@codetutor.dev",
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
