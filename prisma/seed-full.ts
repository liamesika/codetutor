import { PrismaClient, QuestionType } from "@prisma/client"
import { week1Questions } from "./questions/week1-cli"
import { week2Questions } from "./questions/week2-strings"
import { week3Functions } from "./questions/week3-functions"
import { week4Arrays } from "./questions/week4-arrays"
import { week5_2DArrays } from "./questions/week5-2darrays"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

interface SeedQuestion {
  title: string
  slug: string
  type: string
  prompt: string
  constraints: string | null
  difficulty: number
  estimatedMinutes: number
  points: number
  starterCode: string
  solutionCode: string
  tests: { input: string; expectedOutput: string; isHidden?: boolean }[]
  hints: string[]
  tags: string[]
}

// Map question types to valid enum values
function mapQuestionType(type: string): QuestionType {
  const typeMap: Record<string, QuestionType> = {
    "CODE": QuestionType.FULL_PROGRAM,
    "FULL_PROGRAM": QuestionType.FULL_PROGRAM,
    "FUNCTION": QuestionType.FUNCTION,
    "FIX_BUG": QuestionType.FIX_BUG,
    "PREDICT_OUTPUT": QuestionType.PREDICT_OUTPUT,
  }
  return typeMap[type] || QuestionType.FULL_PROGRAM
}

async function seedQuestions(
  topicId: string,
  questions: SeedQuestion[],
  startIndex: number = 0
) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const questionType = mapQuestionType(q.type)
    await prisma.question.upsert({
      where: { topicId_slug: { topicId, slug: q.slug } },
      update: {
        title: q.title,
        prompt: q.prompt,
        constraints: q.constraints,
        difficulty: q.difficulty,
        estimatedMinutes: q.estimatedMinutes,
        points: q.points,
        starterCode: q.starterCode,
        solutionCode: q.solutionCode,
        tests: q.tests,
        hints: q.hints,
        tags: q.tags,
        orderIndex: startIndex + i,
        isActive: true,
      },
      create: {
        topicId,
        title: q.title,
        slug: q.slug,
        type: questionType,
        prompt: q.prompt,
        constraints: q.constraints,
        difficulty: q.difficulty,
        estimatedMinutes: q.estimatedMinutes,
        points: q.points,
        starterCode: q.starterCode,
        solutionCode: q.solutionCode,
        tests: q.tests,
        hints: q.hints,
        tags: q.tags,
        orderIndex: startIndex + i,
        isActive: true,
      },
    })
  }
}

async function main() {
  console.log("🌱 Starting comprehensive seed...")

  // Create demo accounts
  console.log("Creating demo accounts...")

  const hashedPassword = await bcrypt.hash("demo123", 10)
  const adminHashedPassword = await bcrypt.hash("admin123", 10)

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@codetutor.dev" },
    update: {},
    create: {
      email: "demo@codetutor.dev",
      name: "Demo User",
      password: hashedPassword,
      role: "USER",
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@codetutor.dev" },
    update: {},
    create: {
      email: "admin@codetutor.dev",
      name: "Admin User",
      password: adminHashedPassword,
      role: "ADMIN",
    },
  })

  // Create course
  console.log("Creating course...")

  const course = await prisma.course.upsert({
    where: { slug: "java-weeks-1-5" },
    update: {},
    create: {
      name: "Java Fundamentals (Weeks 1-5)",
      slug: "java-weeks-1-5",
      description:
        "Master Java basics: command line, variables, control flow, functions, and arrays. Perfect for CS students starting their programming journey.",
      language: "java",
      isLocked: false,
      orderIndex: 0,
    },
  })

  // Auto-enroll demo users in the course
  console.log("Enrolling demo users...")

  await prisma.userEnrollment.upsert({
    where: {
      userId_courseId: { userId: demoUser.id, courseId: course.id },
    },
    update: {},
    create: {
      userId: demoUser.id,
      courseId: course.id,
      isActive: true,
    },
  })

  await prisma.userEnrollment.upsert({
    where: {
      userId_courseId: { userId: adminUser.id, courseId: course.id },
    },
    update: {},
    create: {
      userId: adminUser.id,
      courseId: course.id,
      isActive: true,
    },
  })

  // ==================== WEEK 1 ====================
  console.log("Seeding Week 1...")

  const week1 = await prisma.week.upsert({
    where: {
      courseId_weekNumber: { courseId: course.id, weekNumber: 1 },
    },
    update: {},
    create: {
      courseId: course.id,
      weekNumber: 1,
      title: "Getting Started with Java",
      description:
        "Learn the fundamentals: command line, compiling Java, Git basics, and understanding errors.",
      orderIndex: 0,
    },
  })

  // Week 1 Topics
  const topic1_1 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week1.id, slug: "command-line-output" } },
    update: {},
    create: {
      weekId: week1.id,
      title: "Command Line & Output",
      slug: "command-line-output",
      description:
        "Master printing, escape sequences, and basic output formatting",
      orderIndex: 0,
    },
  })
  await seedQuestions(topic1_1.id, week1Questions.slice(0, 15) as SeedQuestion[])

  const topic1_2 = await prisma.topic.upsert({
    where: {
      weekId_slug: { weekId: week1.id, slug: "variables-compilation" },
    },
    update: {},
    create: {
      weekId: week1.id,
      title: "Variables & Compilation",
      slug: "variables-compilation",
      description:
        "Declare variables, understand data types, and compile programs",
      orderIndex: 1,
    },
  })
  await seedQuestions(topic1_2.id, week1Questions.slice(15, 25) as SeedQuestion[])

  const topic1_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week1.id, slug: "git-basics" } },
    update: {},
    create: {
      weekId: week1.id,
      title: "Git Basics",
      slug: "git-basics",
      description: "Version control concepts and Git commands",
      orderIndex: 2,
    },
  })
  await seedQuestions(topic1_3.id, week1Questions.slice(25, 30) as SeedQuestion[])

  const topic1_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week1.id, slug: "error-types-debugging" } },
    update: {},
    create: {
      weekId: week1.id,
      title: "Error Types & Debugging",
      slug: "error-types-debugging",
      description: "Identify and fix syntax, compile, and runtime errors",
      orderIndex: 3,
    },
  })
  await seedQuestions(topic1_4.id, week1Questions.slice(30, 40) as SeedQuestion[])

  // ==================== WEEK 2 ====================
  console.log("Seeding Week 2...")

  const week2 = await prisma.week.upsert({
    where: {
      courseId_weekNumber: { courseId: course.id, weekNumber: 2 },
    },
    update: {},
    create: {
      courseId: course.id,
      weekNumber: 2,
      title: "Strings & Control Flow",
      description: "String manipulation and program control structures",
      orderIndex: 1,
    },
  })

  const topic2_1 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week2.id, slug: "string-methods" } },
    update: {},
    create: {
      weekId: week2.id,
      title: "String Methods",
      slug: "string-methods",
      description: "Master Java String class methods and operations",
      orderIndex: 0,
    },
  })
  await seedQuestions(topic2_1.id, week2Questions.slice(0, 15) as SeedQuestion[])

  const topic2_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week2.id, slug: "conditionals" } },
    update: {},
    create: {
      weekId: week2.id,
      title: "Conditionals",
      slug: "conditionals",
      description: "If statements, comparisons, and logical operators",
      orderIndex: 1,
    },
  })
  await seedQuestions(topic2_2.id, week2Questions.slice(15, 30) as SeedQuestion[])

  const topic2_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week2.id, slug: "loops" } },
    update: {},
    create: {
      weekId: week2.id,
      title: "Loops",
      slug: "loops",
      description: "For loops, while loops, and loop control",
      orderIndex: 2,
    },
  })
  await seedQuestions(topic2_3.id, week2Questions.slice(30, 50) as SeedQuestion[])

  // ==================== WEEK 3 ====================
  console.log("Seeding Week 3...")

  const week3 = await prisma.week.upsert({
    where: {
      courseId_weekNumber: { courseId: course.id, weekNumber: 3 },
    },
    update: {},
    create: {
      courseId: course.id,
      weekNumber: 3,
      title: "Functions & Methods",
      description: "Modular programming with functions",
      orderIndex: 2,
    },
  })

  const topic3_1 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week3.id, slug: "function-basics" } },
    update: {},
    create: {
      weekId: week3.id,
      title: "Function Basics",
      slug: "function-basics",
      description: "Define and call methods, understand parameters",
      orderIndex: 0,
    },
  })
  await seedQuestions(topic3_1.id, week3Functions.slice(0, 6) as SeedQuestion[])

  const topic3_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week3.id, slug: "return-values" } },
    update: {},
    create: {
      weekId: week3.id,
      title: "Return Values",
      slug: "return-values",
      description: "Return types, return statements, using return values",
      orderIndex: 1,
    },
  })
  await seedQuestions(topic3_2.id, week3Functions.slice(6, 21) as SeedQuestion[])

  const topic3_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week3.id, slug: "method-overloading" } },
    update: {},
    create: {
      weekId: week3.id,
      title: "Method Overloading",
      slug: "method-overloading",
      description: "Multiple methods with same name, different signatures",
      orderIndex: 2,
    },
  })
  await seedQuestions(topic3_3.id, week3Functions.slice(21, 24) as SeedQuestion[])

  const topic3_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week3.id, slug: "input-validation" } },
    update: {},
    create: {
      weekId: week3.id,
      title: "Input Validation",
      slug: "input-validation",
      description: "Validate inputs and handle edge cases",
      orderIndex: 3,
    },
  })
  await seedQuestions(topic3_4.id, week3Functions.slice(24, 31) as SeedQuestion[])

  // ==================== WEEK 4 ====================
  console.log("Seeding Week 4...")

  const week4 = await prisma.week.upsert({
    where: {
      courseId_weekNumber: { courseId: course.id, weekNumber: 4 },
    },
    update: {},
    create: {
      courseId: course.id,
      weekNumber: 4,
      title: "Arrays",
      description: "One-dimensional arrays and array operations",
      orderIndex: 3,
    },
  })

  const topic4_1 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week4.id, slug: "array-basics" } },
    update: {},
    create: {
      weekId: week4.id,
      title: "Array Basics",
      slug: "array-basics",
      description: "Create, access, and modify arrays",
      orderIndex: 0,
    },
  })
  await seedQuestions(topic4_1.id, week4Arrays.slice(0, 15) as SeedQuestion[])

  const topic4_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week4.id, slug: "array-operations" } },
    update: {},
    create: {
      weekId: week4.id,
      title: "Array Operations",
      slug: "array-operations",
      description: "Common array algorithms and manipulations",
      orderIndex: 1,
    },
  })
  await seedQuestions(topic4_2.id, week4Arrays.slice(15, 27) as SeedQuestion[])

  const topic4_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week4.id, slug: "command-line-args" } },
    update: {},
    create: {
      weekId: week4.id,
      title: "Command Line Arguments",
      slug: "command-line-args",
      description: "Process command line arguments in Java programs",
      orderIndex: 2,
    },
  })
  await seedQuestions(topic4_3.id, week4Arrays.slice(27, 32) as SeedQuestion[])

  const topic4_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week4.id, slug: "pass-by-value" } },
    update: {},
    create: {
      weekId: week4.id,
      title: "Pass by Value",
      slug: "pass-by-value",
      description: "Understand how Java passes arguments to methods",
      orderIndex: 3,
    },
  })
  await seedQuestions(topic4_4.id, week4Arrays.slice(32, 37) as SeedQuestion[])

  // ==================== WEEK 5 ====================
  console.log("Seeding Week 5...")

  const week5 = await prisma.week.upsert({
    where: {
      courseId_weekNumber: { courseId: course.id, weekNumber: 5 },
    },
    update: {},
    create: {
      courseId: course.id,
      weekNumber: 5,
      title: "2D Arrays & I/O",
      description: "Multi-dimensional arrays and input/output operations",
      orderIndex: 4,
    },
  })

  const topic5_1 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week5.id, slug: "2d-arrays" } },
    update: {},
    create: {
      weekId: week5.id,
      title: "2D Arrays",
      slug: "2d-arrays",
      description: "Create and manipulate two-dimensional arrays",
      orderIndex: 0,
    },
  })
  await seedQuestions(topic5_1.id, week5_2DArrays.slice(0, 20) as SeedQuestion[])

  const topic5_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week5.id, slug: "standard-io" } },
    update: {},
    create: {
      weekId: week5.id,
      title: "Standard I/O",
      slug: "standard-io",
      description: "Read input with Scanner, format output",
      orderIndex: 1,
    },
  })
  await seedQuestions(topic5_2.id, week5_2DArrays.slice(20, 32) as SeedQuestion[])

  const topic5_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week5.id, slug: "matrix-operations" } },
    update: {},
    create: {
      weekId: week5.id,
      title: "Matrix Operations & PageRank",
      slug: "matrix-operations",
      description: "PageRank-style 2D processing and matrix algorithms",
      orderIndex: 2,
    },
  })
  await seedQuestions(topic5_3.id, week5_2DArrays.slice(32, 45) as SeedQuestion[])

  const topic5_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week5.id, slug: "final-keyword" } },
    update: {},
    create: {
      weekId: week5.id,
      title: "Final Keyword & Constants",
      slug: "final-keyword",
      description: "Constants and immutable references",
      orderIndex: 3,
    },
  })
  await seedQuestions(topic5_4.id, week5_2DArrays.slice(45, 55) as SeedQuestion[])

  // ==================== ACHIEVEMENTS ====================
  console.log("Seeding achievements...")

  const achievements = [
    {
      name: "First Blood",
      code: "first-blood",
      description: "Complete your first question",
      icon: "🎯",
      points: 50,
      criteria: { type: "first_pass" },
    },
    {
      name: "Streak Master",
      code: "streak-master",
      description: "Get a 5-question streak",
      icon: "🔥",
      points: 100,
      criteria: { type: "streak", count: 5 },
    },
    {
      name: "On Fire",
      code: "on-fire",
      description: "Get a 10-question streak",
      icon: "💥",
      points: 200,
      criteria: { type: "streak", count: 10 },
    },
    {
      name: "No Hints Needed",
      code: "no-hints-needed",
      description: "Complete 5 questions without hints",
      icon: "🧠",
      points: 150,
      criteria: { type: "no_hints", count: 5 },
    },
    {
      name: "Week Warrior",
      code: "week-warrior",
      description: "Complete all questions in a week",
      icon: "🏆",
      points: 500,
      criteria: { type: "complete_week" },
    },
    {
      name: "Speed Demon",
      code: "speed-demon",
      description: "Complete a question in under 1 minute",
      icon: "⚡",
      points: 75,
      criteria: { type: "time_limit", seconds: 60 },
    },
    {
      name: "Perfect Score",
      code: "perfect-score",
      description: "Complete a topic with 100% first-try passes",
      icon: "💯",
      points: 300,
      criteria: { type: "perfect_topic" },
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: {},
      create: achievement,
    })
  }

  // Count questions
  const questionCount = await prisma.question.count()
  const topicCount = await prisma.topic.count()

  console.log("✅ Seed completed!")
  console.log(`   📚 ${topicCount} topics created`)
  console.log(`   ❓ ${questionCount} questions created`)
  console.log(`   🏆 ${achievements.length} achievements created`)
  console.log("")
  console.log("Demo accounts:")
  console.log("   User: demo@codetutor.dev / demo123")
  console.log("   Admin: admin@codetutor.dev / admin123")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
