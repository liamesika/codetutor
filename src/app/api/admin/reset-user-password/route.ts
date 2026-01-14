import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

type UserRow = {
  id: string
  email: string
  name: string | null
  password: string | null
  role: string
}

export async function POST(request: Request) {
  try {
    const { email, newPassword, secret } = await request.json()

    if (secret !== process.env.ADMIN_SETUP_SECRET && secret !== "codetutor-setup-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and newPassword are required" }, { status: 400 })
    }

    // Check if user exists
    const users = await db.$queryRaw<UserRow[]>`
      SELECT id, email, name, password, role
      FROM "User"
      WHERE email = ${email}
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found", email }, { status: 404 })
    }

    const user = users[0]

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update the password using raw SQL
    await db.$executeRaw`
      UPDATE "User"
      SET password = ${hashedPassword}, "updatedAt" = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hadPassword: !!user.password,
      },
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Failed to reset password", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
