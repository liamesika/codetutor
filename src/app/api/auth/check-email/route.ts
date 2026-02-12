import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ exists: false })
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    })

    return NextResponse.json({ exists: !!user })
  } catch {
    return NextResponse.json({ exists: false })
  }
}
