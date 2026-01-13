import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// Debug endpoint to check user password - DELETE AFTER USE
export async function POST(request: Request) {
  try {
    const { secret, email, testPassword } = await request.json()

    if (secret !== "codetutor-setup-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user using raw SQL
    const users = await db.$queryRaw<{id: string, email: string, password: string | null, role: string}[]>`
      SELECT id, email, password, role FROM "User" WHERE LOWER(email) = LOWER(${email}) LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found", searchedEmail: email }, { status: 404 })
    }

    const user = users[0]

    if (!user.password) {
      return NextResponse.json({
        error: "User has no password set",
        user: { id: user.id, email: user.email, role: user.role, hasPassword: false }
      })
    }

    // Test password
    const isValid = await bcrypt.compare(testPassword, user.password)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hasPassword: true,
        passwordLength: user.password.length
      },
      passwordTest: {
        testedPassword: testPassword,
        isValid
      }
    })
  } catch (error) {
    console.error("Debug user error:", error)
    return NextResponse.json(
      { error: "Failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
