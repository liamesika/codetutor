/**
 * Script to grant PRO entitlement to a user by email
 * Usage: DATABASE_URL="..." npx tsx scripts/grant-pro-entitlement.ts
 */

import { PrismaClient, EntitlementPlan, EntitlementStatus } from "@prisma/client"

const prisma = new PrismaClient()

const TARGET_EMAIL = "liamesika21@gmail.com"

async function main() {
  console.log(`\n🔍 Looking up user: ${TARGET_EMAIL}`)

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
    include: { entitlement: true },
  })

  if (!user) {
    console.error(`❌ User not found: ${TARGET_EMAIL}`)
    process.exit(1)
  }

  console.log(`✅ Found user:`)
  console.log(`   ID: ${user.id}`)
  console.log(`   Name: ${user.name}`)
  console.log(`   Email: ${user.email}`)

  if (user.entitlement) {
    console.log(`\n📋 Current entitlement:`)
    console.log(`   Plan: ${user.entitlement.plan}`)
    console.log(`   Status: ${user.entitlement.status}`)
    console.log(`   Expires: ${user.entitlement.expiresAt || "Never"}`)
    console.log(`   Granted: ${user.entitlement.grantedAt}`)
  } else {
    console.log(`\n📋 No existing entitlement`)
  }

  // Upsert PRO entitlement
  console.log(`\n🚀 Granting PRO entitlement...`)

  const entitlement = await prisma.entitlement.upsert({
    where: { userId: user.id },
    update: {
      plan: EntitlementPlan.PRO,
      status: EntitlementStatus.ACTIVE,
      grantedAt: new Date(),
      grantedReason: "Admin grant via script - PRO access",
      expiresAt: null, // Never expires (lifetime)
      revokedAt: null,
      revokedReason: null,
    },
    create: {
      userId: user.id,
      plan: EntitlementPlan.PRO,
      status: EntitlementStatus.ACTIVE,
      grantedReason: "Admin grant via script - PRO access",
      expiresAt: null, // Never expires (lifetime)
    },
  })

  console.log(`\n✅ PRO entitlement granted successfully!`)
  console.log(`   Entitlement ID: ${entitlement.id}`)
  console.log(`   Plan: ${entitlement.plan}`)
  console.log(`   Status: ${entitlement.status}`)
  console.log(`   Expires: ${entitlement.expiresAt || "Never (lifetime)"}`)

  // Verify by reading back
  const verification = await prisma.entitlement.findUnique({
    where: { userId: user.id },
  })

  if (verification && verification.status === EntitlementStatus.ACTIVE && verification.plan === EntitlementPlan.PRO) {
    console.log(`\n🎉 Verification PASSED - User ${TARGET_EMAIL} is now PRO!`)
  } else {
    console.error(`\n❌ Verification FAILED - Something went wrong`)
    console.log(verification)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
