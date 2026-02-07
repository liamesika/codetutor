/**
 * Seed Plans Script
 * Run: DATABASE_URL="..." npx tsx prisma/seed-plans.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 79,
    currency: "ILS",
    features: [
      "Full access to all weeks",
      "All challenges",
      "Daily streak & leagues",
      "Achievements & rank system",
    ],
    orderIndex: 0,
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    currency: "ILS",
    features: [
      "Everything in Basic",
      "Advanced algorithms content",
      "Priority support",
      "Exclusive badges",
    ],
    orderIndex: 1,
  },
  {
    id: "elite",
    name: "Elite",
    price: 100,
    currency: "ILS",
    features: [
      "Everything in Pro",
      "1-on-1 mentorship sessions",
      "Code review sessions",
      "Career guidance",
    ],
    orderIndex: 2,
  },
]

async function main() {
  console.log("🌱 Seeding plans...")

  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        features: plan.features,
        orderIndex: plan.orderIndex,
        isActive: true,
      },
      create: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        features: plan.features,
        orderIndex: plan.orderIndex,
        isActive: true,
      },
    })
    console.log(`  ✓ Plan "${plan.name}" seeded`)
  }

  console.log("\n✅ Plans seeded successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding plans:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
