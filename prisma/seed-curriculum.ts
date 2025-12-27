/**
 * Curriculum Seed Script
 * Idempotent import of curriculum data into database
 * Usage: npx tsx prisma/seed-curriculum.ts
 */

import { PrismaClient, QuestionType } from "@prisma/client"
import { javaCurriculum, type CourseData, type WeekData, type TopicData, type QuestionData } from "../src/content/curriculum/java-curriculum"

const prisma = new PrismaClient()

// Validation errors collection
const validationErrors: string[] = []

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

function validateQuestion(q: QuestionData, topicSlug: string, weekNumber: number): boolean {
  let valid = true
  const prefix = `Week ${weekNumber}, Topic "${topicSlug}", Question "${q.slug}"`

  if (!q.slug || q.slug.trim() === "") {
    validationErrors.push(`${prefix}: Missing slug`)
    valid = false
  }
  if (!q.title || q.title.trim() === "") {
    validationErrors.push(`${prefix}: Missing title`)
    valid = false
  }
  if (!q.prompt || q.prompt.trim() === "") {
    validationErrors.push(`${prefix}: Missing prompt`)
    valid = false
  }
  if (!q.starterCode || q.starterCode.trim() === "") {
    validationErrors.push(`${prefix}: Missing starterCode`)
    valid = false
  }
  if (!q.solutionCode || q.solutionCode.trim() === "") {
    validationErrors.push(`${prefix}: Missing solutionCode`)
    valid = false
  }
  if (!q.tests || q.tests.length === 0) {
    validationErrors.push(`${prefix}: No test cases defined`)
    valid = false
  } else {
    q.tests.forEach((test, idx) => {
      if (test.expectedOutput === undefined || test.expectedOutput === null) {
        validationErrors.push(`${prefix}: Test ${idx} missing expectedOutput`)
        valid = false
      }
    })
  }
  if (q.difficulty < 1 || q.difficulty > 5) {
    validationErrors.push(`${prefix}: Difficulty must be 1-5, got ${q.difficulty}`)
    valid = false
  }

  return valid
}

function validateTopic(topic: TopicData, weekNumber: number): boolean {
  let valid = true
  const prefix = `Week ${weekNumber}, Topic "${topic.slug}"`

  if (!topic.slug || topic.slug.trim() === "") {
    validationErrors.push(`${prefix}: Missing slug`)
    valid = false
  }
  if (!topic.title || topic.title.trim() === "") {
    validationErrors.push(`${prefix}: Missing title`)
    valid = false
  }
  if (!topic.questions || topic.questions.length === 0) {
    validationErrors.push(`${prefix}: No questions defined`)
    valid = false
  }

  // Validate each question
  topic.questions.forEach(q => {
    if (!validateQuestion(q, topic.slug, weekNumber)) {
      valid = false
    }
  })

  return valid
}

function validateWeek(week: WeekData): boolean {
  let valid = true
  const prefix = `Week ${week.weekNumber}`

  if (!week.title || week.title.trim() === "") {
    validationErrors.push(`${prefix}: Missing title`)
    valid = false
  }
  if (!week.topics || week.topics.length === 0) {
    validationErrors.push(`${prefix}: No topics defined`)
    valid = false
  }

  // Check for duplicate topic slugs
  const topicSlugs = new Set<string>()
  week.topics.forEach(topic => {
    if (topicSlugs.has(topic.slug)) {
      validationErrors.push(`${prefix}: Duplicate topic slug "${topic.slug}"`)
      valid = false
    }
    topicSlugs.add(topic.slug)

    if (!validateTopic(topic, week.weekNumber)) {
      valid = false
    }
  })

  return valid
}

function validateCourse(course: CourseData): boolean {
  let valid = true

  if (!course.slug || course.slug.trim() === "") {
    validationErrors.push("Course: Missing slug")
    valid = false
  }
  if (!course.name || course.name.trim() === "") {
    validationErrors.push("Course: Missing name")
    valid = false
  }
  if (!course.weeks || course.weeks.length === 0) {
    validationErrors.push("Course: No weeks defined")
    valid = false
  }

  // Check for duplicate week numbers
  const weekNumbers = new Set<number>()
  course.weeks.forEach(week => {
    if (weekNumbers.has(week.weekNumber)) {
      validationErrors.push(`Course: Duplicate week number ${week.weekNumber}`)
      valid = false
    }
    weekNumbers.add(week.weekNumber)

    if (!validateWeek(week)) {
      valid = false
    }
  })

  return valid
}

async function seedQuestions(topicId: string, questions: QuestionData[]) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const questionType = mapQuestionType(q.type)

    // Convert tests to proper format
    const tests = q.tests.map(t => ({
      input: t.input || "",
      expectedOutput: t.expectedOutput,
      isHidden: t.isHidden || false,
      description: t.description,
      timeLimit: t.timeLimit,
      memoryLimit: t.memoryLimit,
    }))

    await prisma.question.upsert({
      where: { topicId_slug: { topicId, slug: q.slug } },
      update: {
        title: q.title,
        type: questionType,
        prompt: q.prompt,
        constraints: q.constraints || null,
        difficulty: q.difficulty,
        estimatedMinutes: q.estimatedMinutes,
        points: q.points,
        xpReward: q.xpReward || q.points,
        timeLimit: q.timeLimit || 5000,
        memoryLimit: q.memoryLimit || 256,
        starterCode: q.starterCode,
        solutionCode: q.solutionCode,
        tests: tests,
        hints: q.hints,
        explanation: q.explanation || null,
        tags: q.tags,
        orderIndex: i,
        isActive: true,
        isPublished: true,
        updatedAt: new Date(),
      },
      create: {
        topicId,
        slug: q.slug,
        title: q.title,
        type: questionType,
        prompt: q.prompt,
        constraints: q.constraints || null,
        difficulty: q.difficulty,
        estimatedMinutes: q.estimatedMinutes,
        points: q.points,
        xpReward: q.xpReward || q.points,
        timeLimit: q.timeLimit || 5000,
        memoryLimit: q.memoryLimit || 256,
        starterCode: q.starterCode,
        solutionCode: q.solutionCode,
        tests: tests,
        hints: q.hints,
        explanation: q.explanation || null,
        tags: q.tags,
        orderIndex: i,
        isActive: true,
        isPublished: true,
      },
    })
  }
}

async function seedTopics(weekId: string, topics: TopicData[]) {
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]

    const dbTopic = await prisma.topic.upsert({
      where: { weekId_slug: { weekId, slug: topic.slug } },
      update: {
        title: topic.title,
        description: topic.description,
        orderIndex: i,
        isPublished: true,
        updatedAt: new Date(),
      },
      create: {
        weekId,
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        orderIndex: i,
        isLocked: false,
        isPublished: true,
      },
    })

    // Seed lessons if any
    if (topic.lessons) {
      for (let j = 0; j < topic.lessons.length; j++) {
        const lesson = topic.lessons[j]
        await prisma.lesson.upsert({
          where: { topicId_slug: { topicId: dbTopic.id, slug: lesson.slug } },
          update: {
            title: lesson.title,
            content: lesson.content,
            orderIndex: j,
            isPublished: true,
            updatedAt: new Date(),
          },
          create: {
            topicId: dbTopic.id,
            slug: lesson.slug,
            title: lesson.title,
            content: lesson.content,
            orderIndex: j,
            isPublished: true,
          },
        })
      }
    }

    // Seed questions
    await seedQuestions(dbTopic.id, topic.questions)
  }
}

async function seedWeeks(courseId: string, weeks: WeekData[]) {
  for (const week of weeks) {
    const dbWeek = await prisma.week.upsert({
      where: { courseId_weekNumber: { courseId, weekNumber: week.weekNumber } },
      update: {
        title: week.title,
        description: week.description,
        orderIndex: week.weekNumber - 1,
        isPublished: true,
        updatedAt: new Date(),
      },
      create: {
        courseId,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        orderIndex: week.weekNumber - 1,
        isLocked: false,
        isPublished: true,
      },
    })

    await seedTopics(dbWeek.id, week.topics)
  }
}

async function seedCourse(course: CourseData) {
  const dbCourse = await prisma.course.upsert({
    where: { slug: course.slug },
    update: {
      name: course.name,
      description: course.description,
      language: course.language,
      isPublished: true,
      updatedAt: new Date(),
    },
    create: {
      slug: course.slug,
      name: course.name,
      description: course.description,
      language: course.language,
      isLocked: false,
      isPublished: true,
      orderIndex: 0,
    },
  })

  await seedWeeks(dbCourse.id, course.weeks)

  return dbCourse
}

async function main() {
  console.log("🌱 Starting curriculum seed...")
  console.log("")

  // Validate curriculum before seeding
  console.log("📋 Validating curriculum schema...")
  const isValid = validateCourse(javaCurriculum)

  if (!isValid) {
    console.error("")
    console.error("❌ Validation failed with errors:")
    validationErrors.forEach(err => console.error(`   - ${err}`))
    console.error("")
    console.error("Please fix the errors above and try again.")
    process.exit(1)
  }

  console.log("✅ Validation passed")
  console.log("")

  // Seed the curriculum
  console.log("📚 Seeding curriculum...")
  const course = await seedCourse(javaCurriculum)

  // Count results
  const weekCount = await prisma.week.count({ where: { courseId: course.id } })
  const topicCount = await prisma.topic.count({
    where: { week: { courseId: course.id } }
  })
  const questionCount = await prisma.question.count({
    where: { topic: { week: { courseId: course.id } } }
  })

  console.log("")
  console.log("✅ Curriculum seed completed!")
  console.log(`   📅 ${weekCount} weeks`)
  console.log(`   📖 ${topicCount} topics`)
  console.log(`   ❓ ${questionCount} questions`)
  console.log("")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
