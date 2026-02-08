import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkDeviceLogin } from "@/lib/device-check"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userAgent = request.headers.get("user-agent") || "unknown"
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      null

    const result = await checkDeviceLogin({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      userName: session.user.name || null,
      userAgent,
      ipAddress,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Device check error:", error)
    return NextResponse.json(
      { error: "Failed to check device" },
      { status: 500 }
    )
  }
}
