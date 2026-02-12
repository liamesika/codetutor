import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { sendRegistrationConfirmation } from "@/lib/email"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  plan: z.enum(["free", "basic", "pro"]).optional().default("free"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.parse(body)
    const name = parsed.name
    const email = parsed.email.toLowerCase()
    const password = parsed.password
    const plan = parsed.plan

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Auto-enroll in CS Exam Marathon course
    const course = await db.course.findUnique({
      where: { slug: "cs-exam-marathon" },
    })

    if (course) {
      await db.userEnrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
      })
    }

    // Create entitlement with selected plan
    const entitlementPlan = plan === "pro" ? "PRO" : plan === "basic" ? "BASIC" : "FREE"
    await db.entitlement.create({
      data: {
        userId: user.id,
        plan: entitlementPlan,
        status: "ACTIVE",
        grantedReason: "registration",
      },
    })

    // Send registration confirmation email (fire-and-forget)
    sendRegistrationConfirmation({
      email,
      name,
      plan: entitlementPlan,
    })

    // Log event
    await db.eventLog.create({
      data: {
        userId: user.id,
        eventType: "USER_REGISTERED",
        payload: { email, plan },
      },
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
