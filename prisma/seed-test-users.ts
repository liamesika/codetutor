/**
 * Seed Test Users for E2E Verification
 * Creates 3 users: Admin, FREE student, PRO student
 * Mirrors the normal registration flow (bcrypt, enrollment, entitlement)
 * Usage: npx tsx prisma/seed-test-users.ts
 */

import { PrismaClient, UserRole, EntitlementPlan, EntitlementStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const TEST_USERS = [
  {
    name: "Admin Tester",
    email: "admin-test@codetutor.dev",
    password: "Admin2026!",
    role: UserRole.ADMIN,
    entitlement: null, // Admins bypass entitlement checks
  },
  {
    name: "Free Student",
    email: "free-test@codetutor.dev",
    password: "Free2026!",
    role: UserRole.USER,
    entitlement: null, // No entitlement = FREE tier (maxWeek: 1)
  },
  {
    name: "Pro Student",
    email: "pro-test@codetutor.dev",
    password: "Pro2026!",
    role: UserRole.USER,
    entitlement: EntitlementPlan.PRO,
  },
]

async function main() {
  console.log("Creating test users...")
  console.log("")

  // Find the marathon course for enrollment
  const course = await prisma.course.findUnique({
    where: { slug: "cs-exam-marathon" },
  })

  if (!course) {
    console.error("ERROR: cs-exam-marathon course not found. Run seed:marathon first.")
    process.exit(1)
  }

  let adminUserId: string | null = null

  for (const testUser of TEST_USERS) {
    // Hash password (same as register route: bcrypt, 12 rounds)
    const hashedPassword = await bcrypt.hash(testUser.password, 12)

    // Upsert user (safe to re-run)
    const user = await prisma.user.upsert({
      where: { email: testUser.email },
      update: {
        name: testUser.name,
        password: hashedPassword,
        role: testUser.role,
      },
      create: {
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role,
      },
    })

    if (testUser.role === UserRole.ADMIN) {
      adminUserId = user.id
    }

    // Enroll in marathon course (same as register route)
    await prisma.userEnrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        courseId: course.id,
      },
    })

    // Grant entitlement if specified
    if (testUser.entitlement) {
      await prisma.entitlement.upsert({
        where: { userId: user.id },
        update: {
          plan: testUser.entitlement,
          status: EntitlementStatus.ACTIVE,
          grantedByUserId: adminUserId,
          grantedReason: "Test user setup",
          grantedAt: new Date(),
          expiresAt: null,
          revokedAt: null,
          revokedReason: null,
        },
        create: {
          userId: user.id,
          plan: testUser.entitlement,
          status: EntitlementStatus.ACTIVE,
          grantedByUserId: adminUserId,
          grantedReason: "Test user setup",
          expiresAt: null,
        },
      })
    } else {
      // Remove any existing entitlement for FREE users
      if (testUser.role !== UserRole.ADMIN) {
        await prisma.entitlement.deleteMany({
          where: { userId: user.id },
        })
      }
    }

    const tier = testUser.role === UserRole.ADMIN
      ? "ADMIN"
      : testUser.entitlement || "FREE"

    console.log(`  ${tier.padEnd(6)} | ${testUser.email} | ${testUser.password}`)
  }

  console.log("")
  console.log("Test users ready.")
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
