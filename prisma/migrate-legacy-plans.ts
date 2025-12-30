/**
 * Migration Script: Migrate legacy EntitlementPlan values
 *
 * This script safely migrates any legacy plan values to the new FREE/BASIC/PRO system.
 * It is IDEMPOTENT - safe to run multiple times.
 *
 * Mapping:
 *   - ELITE -> PRO
 *   - PRO -> PRO (no change)
 *   - BASIC -> BASIC (no change)
 *   - FREE -> FREE (no change)
 *   - null/unknown -> FREE (logged)
 *
 * Usage:
 *   DATABASE_URL="..." npx tsx prisma/migrate-legacy-plans.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Valid plans in the new system
const VALID_PLANS = ["FREE", "BASIC", "PRO"] as const

// Legacy plan mapping
const PLAN_MIGRATION_MAP: Record<string, string> = {
  ELITE: "PRO",
  PRO: "PRO",
  BASIC: "BASIC",
  FREE: "FREE",
}

async function migrateLegacyPlans() {
  console.log("=".repeat(60))
  console.log("ENTITLEMENT PLAN MIGRATION")
  console.log("=".repeat(60))
  console.log(`Started at: ${new Date().toISOString()}`)
  console.log("")

  try {
    // 1. Get all entitlements
    const entitlements = await prisma.entitlement.findMany({
      select: {
        id: true,
        userId: true,
        plan: true,
        status: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    })

    console.log(`Found ${entitlements.length} total entitlements`)
    console.log("")

    // 2. Categorize entitlements
    const stats = {
      alreadyValid: 0,
      migratedElite: 0,
      unknownPlans: [] as { id: string; userId: string; email: string; plan: string }[],
    }

    const toMigrate: { id: string; currentPlan: string; newPlan: string; email: string }[] = []

    for (const ent of entitlements) {
      const currentPlan = ent.plan as string

      if (VALID_PLANS.includes(currentPlan as typeof VALID_PLANS[number])) {
        stats.alreadyValid++
        continue
      }

      const mappedPlan = PLAN_MIGRATION_MAP[currentPlan]

      if (mappedPlan) {
        toMigrate.push({
          id: ent.id,
          currentPlan,
          newPlan: mappedPlan,
          email: ent.user?.email || "unknown",
        })
        if (currentPlan === "ELITE") {
          stats.migratedElite++
        }
      } else {
        // Unknown plan - will be set to FREE
        stats.unknownPlans.push({
          id: ent.id,
          userId: ent.userId,
          email: ent.user?.email || "unknown",
          plan: currentPlan,
        })
        toMigrate.push({
          id: ent.id,
          currentPlan,
          newPlan: "FREE",
          email: ent.user?.email || "unknown",
        })
      }
    }

    // 3. Report findings
    console.log("ANALYSIS:")
    console.log(`  - Already valid (FREE/BASIC/PRO): ${stats.alreadyValid}`)
    console.log(`  - ELITE -> PRO migrations needed: ${stats.migratedElite}`)
    console.log(`  - Unknown plans (-> FREE): ${stats.unknownPlans.length}`)
    console.log("")

    if (stats.unknownPlans.length > 0) {
      console.log("WARNING: Unknown plans found:")
      for (const unk of stats.unknownPlans) {
        console.log(`  - User ${unk.email} (${unk.userId}): plan="${unk.plan}" -> FREE`)
      }
      console.log("")
    }

    // 4. Perform migrations
    if (toMigrate.length === 0) {
      console.log("No migrations needed. All entitlements are valid.")
    } else {
      console.log(`MIGRATING ${toMigrate.length} entitlements...`)
      console.log("")

      for (const migration of toMigrate) {
        console.log(`  Migrating ${migration.email}: ${migration.currentPlan} -> ${migration.newPlan}`)

        await prisma.entitlement.update({
          where: { id: migration.id },
          data: {
            plan: migration.newPlan as "FREE" | "BASIC" | "PRO",
          },
        })
      }

      console.log("")
      console.log(`Successfully migrated ${toMigrate.length} entitlements`)
    }

    // 5. Verify final state
    console.log("")
    console.log("VERIFICATION:")

    const finalCounts = await prisma.entitlement.groupBy({
      by: ["plan"],
      _count: { plan: true },
    })

    console.log("  Current plan distribution:")
    for (const row of finalCounts) {
      console.log(`    - ${row.plan}: ${row._count.plan}`)
    }

    // Check for any remaining invalid plans (shouldn't happen)
    const invalidPlans = finalCounts.filter(
      (row) => !VALID_PLANS.includes(row.plan as typeof VALID_PLANS[number])
    )

    if (invalidPlans.length > 0) {
      console.log("")
      console.log("ERROR: Invalid plans still exist after migration!")
      for (const inv of invalidPlans) {
        console.log(`  - ${inv.plan}: ${inv._count.plan}`)
      }
      process.exit(1)
    }

    console.log("")
    console.log("Migration completed successfully!")
    console.log("=".repeat(60))

  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateLegacyPlans()
