import { PrismaClient, QuestionType } from "@prisma/client"
import { week1Questions } from "./questions/week1-cli"
import { week2Questions } from "./questions/week2-strings"
import { week3Functions } from "./questions/week3-functions"
import { week4Arrays } from "./questions/week4-arrays"
import { week5_2DArrays } from "./questions/week5-2darrays"
import { week6RecursionFundamentals } from "./questions/week6-recursion-fundamentals"
import { week7RecursionMastery } from "./questions/week7-recursion-mastery"
import { topicIntros } from "./topic-intros"
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

  // Create 30 demo students with realistic names
  console.log("Creating demo students...")

  const studentNames = [
    "Emma Cohen", "Noam Levy", "Maya Friedman", "Daniel Shapiro", "Yael Goldberg",
    "Omer Rosenberg", "Noa Katz", "Itai Schwartz", "Tamar Weiss", "Eitan Mizrahi",
    "Shira Ben-David", "Amit Peretz", "Yonatan Levi", "Michal Avraham", "Ido Cohen",
    "Liora Stern", "Ariel Blum", "Nirit Golan", "Ron Berkowitz", "Gal Feldman",
    "Shai Rubin", "Ofir Carmel", "Hila Ofer", "Yuval Segal", "Dana Klein",
    "Tomer Raz", "Shaked Mor", "Ori Navon", "Naomi Hadar", "Lior Yosef"
  ]

  const demoStudents: { id: string; email: string; name: string; studentExternalId: string }[] = []

  for (let i = 0; i < studentNames.length; i++) {
    const name = studentNames[i]
    const email = `student${i + 1}@university.edu`
    const studentExternalId = `STU${String(2024001 + i).padStart(7, '0')}` // e.g., STU2024001
    const student = await prisma.user.upsert({
      where: { email },
      update: { name, studentExternalId },
      create: {
        email,
        name,
        password: hashedPassword,
        role: "USER",
        studentExternalId,
      },
    })
    demoStudents.push({ id: student.id, email: student.email, name: student.name || name, studentExternalId })
  }

  console.log(`   Created ${demoStudents.length} demo students`)

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

  // Enroll all demo students in the course
  console.log("Enrolling demo students...")
  for (const student of demoStudents) {
    await prisma.userEnrollment.upsert({
      where: {
        userId_courseId: { userId: student.id, courseId: course.id },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
        isActive: true,
      },
    })
  }

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
    update: { introMarkdown: topicIntros["command-line-output"] },
    create: {
      weekId: week1.id,
      title: "Command Line & Output",
      slug: "command-line-output",
      description:
        "Master printing, escape sequences, and basic output formatting",
      introMarkdown: topicIntros["command-line-output"],
      orderIndex: 0,
    },
  })
  await seedQuestions(topic1_1.id, week1Questions.slice(0, 15) as SeedQuestion[])

  const topic1_2 = await prisma.topic.upsert({
    where: {
      weekId_slug: { weekId: week1.id, slug: "variables-compilation" },
    },
    update: { introMarkdown: topicIntros["variables-compilation"] },
    create: {
      weekId: week1.id,
      title: "Variables & Compilation",
      slug: "variables-compilation",
      description:
        "Declare variables, understand data types, and compile programs",
      introMarkdown: topicIntros["variables-compilation"],
      orderIndex: 1,
    },
  })
  await seedQuestions(topic1_2.id, week1Questions.slice(15, 25) as SeedQuestion[])

  const topic1_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week1.id, slug: "git-basics" } },
    update: { introMarkdown: topicIntros["git-basics"] },
    create: {
      weekId: week1.id,
      title: "Git Basics",
      slug: "git-basics",
      description: "Version control concepts and Git commands",
      introMarkdown: topicIntros["git-basics"],
      orderIndex: 2,
    },
  })
  await seedQuestions(topic1_3.id, week1Questions.slice(25, 30) as SeedQuestion[])

  const topic1_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week1.id, slug: "error-types-debugging" } },
    update: { introMarkdown: topicIntros["error-types-debugging"] },
    create: {
      weekId: week1.id,
      title: "Error Types & Debugging",
      slug: "error-types-debugging",
      description: "Identify and fix syntax, compile, and runtime errors",
      introMarkdown: topicIntros["error-types-debugging"],
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
    update: { introMarkdown: topicIntros["string-methods"] },
    create: {
      weekId: week2.id,
      title: "String Methods",
      slug: "string-methods",
      description: "Master Java String class methods and operations",
      introMarkdown: topicIntros["string-methods"],
      orderIndex: 0,
    },
  })
  await seedQuestions(topic2_1.id, week2Questions.slice(0, 15) as SeedQuestion[])

  const topic2_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week2.id, slug: "conditionals" } },
    update: { introMarkdown: topicIntros["conditionals"] },
    create: {
      weekId: week2.id,
      title: "Conditionals",
      slug: "conditionals",
      description: "If statements, comparisons, and logical operators",
      introMarkdown: topicIntros["conditionals"],
      orderIndex: 1,
    },
  })
  await seedQuestions(topic2_2.id, week2Questions.slice(15, 30) as SeedQuestion[])

  const topic2_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week2.id, slug: "loops" } },
    update: { introMarkdown: topicIntros["loops"] },
    create: {
      weekId: week2.id,
      title: "Loops",
      slug: "loops",
      description: "For loops, while loops, and loop control",
      introMarkdown: topicIntros["loops"],
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
    update: { introMarkdown: topicIntros["function-basics"] },
    create: {
      weekId: week3.id,
      title: "Function Basics",
      slug: "function-basics",
      description: "Define and call methods, understand parameters",
      introMarkdown: topicIntros["function-basics"],
      orderIndex: 0,
    },
  })
  await seedQuestions(topic3_1.id, week3Functions.slice(0, 6) as SeedQuestion[])

  const topic3_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week3.id, slug: "return-values" } },
    update: { introMarkdown: topicIntros["return-values"] },
    create: {
      weekId: week3.id,
      title: "Return Values",
      slug: "return-values",
      description: "Return types, return statements, using return values",
      introMarkdown: topicIntros["return-values"],
      orderIndex: 1,
    },
  })
  await seedQuestions(topic3_2.id, week3Functions.slice(6, 21) as SeedQuestion[])

  const topic3_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week3.id, slug: "method-overloading" } },
    update: { introMarkdown: topicIntros["method-overloading"] },
    create: {
      weekId: week3.id,
      title: "Method Overloading",
      slug: "method-overloading",
      description: "Multiple methods with same name, different signatures",
      introMarkdown: topicIntros["method-overloading"],
      orderIndex: 2,
    },
  })
  await seedQuestions(topic3_3.id, week3Functions.slice(21, 24) as SeedQuestion[])

  const topic3_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week3.id, slug: "input-validation" } },
    update: { introMarkdown: topicIntros["input-validation"] },
    create: {
      weekId: week3.id,
      title: "Input Validation",
      slug: "input-validation",
      description: "Validate inputs and handle edge cases",
      introMarkdown: topicIntros["input-validation"],
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
    update: { introMarkdown: topicIntros["array-basics"] },
    create: {
      weekId: week4.id,
      title: "Array Basics",
      slug: "array-basics",
      description: "Create, access, and modify arrays",
      introMarkdown: topicIntros["array-basics"],
      orderIndex: 0,
    },
  })
  await seedQuestions(topic4_1.id, week4Arrays.slice(0, 15) as SeedQuestion[])

  const topic4_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week4.id, slug: "array-operations" } },
    update: { introMarkdown: topicIntros["array-operations"] },
    create: {
      weekId: week4.id,
      title: "Array Operations",
      slug: "array-operations",
      description: "Common array algorithms and manipulations",
      introMarkdown: topicIntros["array-operations"],
      orderIndex: 1,
    },
  })
  await seedQuestions(topic4_2.id, week4Arrays.slice(15, 27) as SeedQuestion[])

  const topic4_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week4.id, slug: "command-line-args" } },
    update: { introMarkdown: topicIntros["command-line-args"] },
    create: {
      weekId: week4.id,
      title: "Command Line Arguments",
      slug: "command-line-args",
      description: "Process command line arguments in Java programs",
      introMarkdown: topicIntros["command-line-args"],
      orderIndex: 2,
    },
  })
  await seedQuestions(topic4_3.id, week4Arrays.slice(27, 32) as SeedQuestion[])

  const topic4_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week4.id, slug: "pass-by-value" } },
    update: { introMarkdown: topicIntros["pass-by-value"] },
    create: {
      weekId: week4.id,
      title: "Pass by Value",
      slug: "pass-by-value",
      description: "Understand how Java passes arguments to methods",
      introMarkdown: topicIntros["pass-by-value"],
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
    update: { introMarkdown: topicIntros["2d-arrays"] },
    create: {
      weekId: week5.id,
      title: "2D Arrays",
      slug: "2d-arrays",
      description: "Create and manipulate two-dimensional arrays",
      introMarkdown: topicIntros["2d-arrays"],
      orderIndex: 0,
    },
  })
  await seedQuestions(topic5_1.id, week5_2DArrays.slice(0, 20) as SeedQuestion[])

  const topic5_2 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week5.id, slug: "standard-io" } },
    update: { introMarkdown: topicIntros["standard-io"] },
    create: {
      weekId: week5.id,
      title: "Standard I/O",
      slug: "standard-io",
      description: "Read input with Scanner, format output",
      introMarkdown: topicIntros["standard-io"],
      orderIndex: 1,
    },
  })
  await seedQuestions(topic5_2.id, week5_2DArrays.slice(20, 32) as SeedQuestion[])

  const topic5_3 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week5.id, slug: "matrix-operations" } },
    update: { introMarkdown: topicIntros["matrix-operations"] },
    create: {
      weekId: week5.id,
      title: "Matrix Operations & PageRank",
      slug: "matrix-operations",
      description: "PageRank-style 2D processing and matrix algorithms",
      introMarkdown: topicIntros["matrix-operations"],
      orderIndex: 2,
    },
  })
  await seedQuestions(topic5_3.id, week5_2DArrays.slice(32, 45) as SeedQuestion[])

  const topic5_4 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week5.id, slug: "final-keyword" } },
    update: { introMarkdown: topicIntros["final-keyword"] },
    create: {
      weekId: week5.id,
      title: "Final Keyword & Constants",
      slug: "final-keyword",
      description: "Constants and immutable references",
      introMarkdown: topicIntros["final-keyword"],
      orderIndex: 3,
    },
  })
  await seedQuestions(topic5_4.id, week5_2DArrays.slice(45, 55) as SeedQuestion[])

  // ==================== WEEK 6 ====================
  console.log("Seeding Week 6 (Recursion Fundamentals)...")

  const week6 = await prisma.week.upsert({
    where: {
      courseId_weekNumber: { courseId: course.id, weekNumber: 6 },
    },
    update: {},
    create: {
      courseId: course.id,
      weekNumber: 6,
      title: "Recursion — Fundamentals",
      description: "Master recursive thinking with numbers and strings",
      orderIndex: 5,
    },
  })

  const topic6_1 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week6.id, slug: "recursion-fundamentals" } },
    update: {
      introMarkdown: `## What is Recursion?

**Recursion** is a programming technique where a function calls itself to solve a problem. Instead of using loops, you break down a complex problem into smaller, identical subproblems.

Every recursive function has two essential parts:
- **Base case** – The simplest scenario where we return a result without calling ourselves again
- **Recursive step** – Where we call ourselves with a "smaller" version of the problem

## When to Use Recursion

Use recursion when:
- The problem can be broken into smaller versions of itself
- There's a clear "base case" that stops the recursion
- The solution builds naturally from smaller solutions
- Tree/graph traversal is needed

## How It Works: The Call Stack

\`\`\`java
// Computing factorial(3)
factorial(3)
  → 3 * factorial(2)
      → 2 * factorial(1)
          → 1 (base case!)
      → 2 * 1 = 2
  → 3 * 2 = 6
\`\`\`

Each call waits for its inner call to finish, then multiplies.

## Mini Example: Sum 1 to N

\`\`\`java
public static int sumTo(int n) {
    if (n == 1) return 1;      // Base case
    return n + sumTo(n - 1);   // Recursive step
}
// sumTo(4) → 4 + 3 + 2 + 1 = 10
\`\`\`

**Key insight:** Trust that the recursive call works, then combine its result.`,
    },
    create: {
      weekId: week6.id,
      title: "Recursion — Numbers & Strings",
      slug: "recursion-fundamentals",
      description: "Learn base cases, recursion steps, and apply to numbers and strings",
      introMarkdown: `## What is Recursion?

**Recursion** is a programming technique where a function calls itself to solve a problem. Instead of using loops, you break down a complex problem into smaller, identical subproblems.

Every recursive function has two essential parts:
- **Base case** – The simplest scenario where we return a result without calling ourselves again
- **Recursive step** – Where we call ourselves with a "smaller" version of the problem

## When to Use Recursion

Use recursion when:
- The problem can be broken into smaller versions of itself
- There's a clear "base case" that stops the recursion
- The solution builds naturally from smaller solutions
- Tree/graph traversal is needed

## How It Works: The Call Stack

\`\`\`java
// Computing factorial(3)
factorial(3)
  → 3 * factorial(2)
      → 2 * factorial(1)
          → 1 (base case!)
      → 2 * 1 = 2
  → 3 * 2 = 6
\`\`\`

Each call waits for its inner call to finish, then multiplies.

## Mini Example: Sum 1 to N

\`\`\`java
public static int sumTo(int n) {
    if (n == 1) return 1;      // Base case
    return n + sumTo(n - 1);   // Recursive step
}
// sumTo(4) → 4 + 3 + 2 + 1 = 10
\`\`\`

**Key insight:** Trust that the recursive call works, then combine its result.`,
      orderIndex: 0,
    },
  })
  await seedQuestions(topic6_1.id, week6RecursionFundamentals as SeedQuestion[])

  // ==================== WEEK 7 ====================
  console.log("Seeding Week 7 (Recursion Mastery)...")

  const week7 = await prisma.week.upsert({
    where: {
      courseId_weekNumber: { courseId: course.id, weekNumber: 7 },
    },
    update: {},
    create: {
      courseId: course.id,
      weekNumber: 7,
      title: "Recursion — Mastery",
      description: "Advanced recursion with arrays, optimization, and complex patterns",
      orderIndex: 6,
    },
  })

  const topic7_1 = await prisma.topic.upsert({
    where: { weekId_slug: { weekId: week7.id, slug: "recursion-mastery" } },
    update: {
      introMarkdown: `## Recursion with Arrays

When working with arrays recursively, we typically:
- Process one element at a time
- Use an **index parameter** to track our position
- Base case: index reaches the array length (or start/end meet)

## Common Array Recursion Patterns

**Pattern 1: Accumulator Pattern**
\`\`\`java
// Sum all elements
public static int sumArray(int[] arr, int index) {
    if (index == arr.length) return 0;          // Base case
    return arr[index] + sumArray(arr, index + 1); // Add current + rest
}
\`\`\`

**Pattern 2: Search/Filter Pattern**
\`\`\`java
// Find max value
public static int findMax(int[] arr, int index) {
    if (index == arr.length - 1) return arr[index];
    return Math.max(arr[index], findMax(arr, index + 1));
}
\`\`\`

## Memoization: Speed Up Recursion

Some recursive solutions recalculate the same values many times. **Memoization** stores results to avoid redundant work.

\`\`\`java
// Fibonacci without memoization: O(2^n) - very slow!
// Fibonacci with memoization: O(n) - fast!
static long[] memo = new long[100];
public static long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];  // Already computed?
    memo[n] = fib(n-1) + fib(n-2);     // Store result
    return memo[n];
}
\`\`\`

## Binary Search: Divide and Conquer

Recursion shines when dividing problems in half:
\`\`\`java
// Find target in sorted array
public static int binarySearch(int[] arr, int target, int low, int high) {
    if (low > high) return -1;  // Not found
    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return binarySearch(arr, target, low, mid - 1);
    return binarySearch(arr, target, mid + 1, high);
}
\`\`\`

**Complexity:** O(log n) — each call eliminates half the array!`,
    },
    create: {
      weekId: week7.id,
      title: "Recursion — Arrays & Advanced Patterns",
      slug: "recursion-mastery",
      description: "Apply recursion to arrays, use memoization, and solve complex recursive problems",
      introMarkdown: `## Recursion with Arrays

When working with arrays recursively, we typically:
- Process one element at a time
- Use an **index parameter** to track our position
- Base case: index reaches the array length (or start/end meet)

## Common Array Recursion Patterns

**Pattern 1: Accumulator Pattern**
\`\`\`java
// Sum all elements
public static int sumArray(int[] arr, int index) {
    if (index == arr.length) return 0;          // Base case
    return arr[index] + sumArray(arr, index + 1); // Add current + rest
}
\`\`\`

**Pattern 2: Search/Filter Pattern**
\`\`\`java
// Find max value
public static int findMax(int[] arr, int index) {
    if (index == arr.length - 1) return arr[index];
    return Math.max(arr[index], findMax(arr, index + 1));
}
\`\`\`

## Memoization: Speed Up Recursion

Some recursive solutions recalculate the same values many times. **Memoization** stores results to avoid redundant work.

\`\`\`java
// Fibonacci without memoization: O(2^n) - very slow!
// Fibonacci with memoization: O(n) - fast!
static long[] memo = new long[100];
public static long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];  // Already computed?
    memo[n] = fib(n-1) + fib(n-2);     // Store result
    return memo[n];
}
\`\`\`

## Binary Search: Divide and Conquer

Recursion shines when dividing problems in half:
\`\`\`java
// Find target in sorted array
public static int binarySearch(int[] arr, int target, int low, int high) {
    if (low > high) return -1;  // Not found
    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return binarySearch(arr, target, low, mid - 1);
    return binarySearch(arr, target, mid + 1, high);
}
\`\`\`

**Complexity:** O(log n) — each call eliminates half the array!`,
      orderIndex: 0,
    },
  })
  await seedQuestions(topic7_1.id, week7RecursionMastery as SeedQuestion[])

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

  // ==================== HOMEWORK ASSIGNMENTS ====================
  console.log("Seeding homework assignments...")

  // Get questions from each week for assignments
  const hw1Questions = await prisma.question.findMany({
    where: { topic: { week: { weekNumber: 1, courseId: course.id } }, isActive: true },
    orderBy: { orderIndex: "asc" },
    take: 5,
  })

  const hw2Questions = await prisma.question.findMany({
    where: { topic: { week: { weekNumber: 2, courseId: course.id } }, isActive: true },
    orderBy: { orderIndex: "asc" },
    take: 5,
  })

  const hw3Questions = await prisma.question.findMany({
    where: { topic: { week: { weekNumber: 3, courseId: course.id } }, isActive: true },
    orderBy: { orderIndex: "asc" },
    take: 4,
  })

  const hw4Questions = await prisma.question.findMany({
    where: { topic: { week: { weekNumber: 4, courseId: course.id } }, isActive: true },
    orderBy: { orderIndex: "asc" },
    take: 5,
  })

  const hw5Questions = await prisma.question.findMany({
    where: { topic: { week: { weekNumber: 5, courseId: course.id } }, isActive: true },
    orderBy: { orderIndex: "asc" },
    take: 4,
  })

  const hw6Questions = await prisma.question.findMany({
    where: { topic: { week: { weekNumber: 6, courseId: course.id } }, isActive: true },
    orderBy: { orderIndex: "asc" },
    take: 4,
  })

  const hw7Questions = await prisma.question.findMany({
    where: { topic: { week: { weekNumber: 7, courseId: course.id } }, isActive: true },
    orderBy: { orderIndex: "asc" },
    take: 4,
  })

  // Define semesters
  const SEMESTER_FALL_2024 = "Fall 2024"
  const SEMESTER_SPRING_2025 = "Spring 2025"

  // Create Assignments for Fall 2024 (Weeks 1-4)
  const assignment1 = await prisma.assignment.upsert({
    where: { id: "demo-week1-hw" },
    update: {
      title: "Homework 1: Java Basics",
      description: "Practice command line output, variables, and basic Java concepts.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-09-15"),
    },
    create: {
      id: "demo-week1-hw",
      weekId: week1.id,
      title: "Homework 1: Java Basics",
      description: "Practice command line output, variables, and basic Java concepts.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-09-15"),
    },
  })

  const assignment2 = await prisma.assignment.upsert({
    where: { id: "demo-week2-hw" },
    update: {
      title: "Homework 2: Strings & Control Flow",
      description: "Practice string manipulation and conditional statements.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-09-22"),
    },
    create: {
      id: "demo-week2-hw",
      weekId: week2.id,
      title: "Homework 2: Strings & Control Flow",
      description: "Practice string manipulation and conditional statements.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-09-22"),
    },
  })

  const assignment3 = await prisma.assignment.upsert({
    where: { id: "demo-week3-hw" },
    update: {
      title: "Homework 3: Functions & Methods",
      description: "Practice writing functions, parameters, and return values.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-09-29"),
    },
    create: {
      id: "demo-week3-hw",
      weekId: week3.id,
      title: "Homework 3: Functions & Methods",
      description: "Practice writing functions, parameters, and return values.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-09-29"),
    },
  })

  const assignment4 = await prisma.assignment.upsert({
    where: { id: "demo-week4-hw" },
    update: {
      title: "Homework 4: Arrays",
      description: "Practice array creation, manipulation, and algorithms.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-10-06"),
    },
    create: {
      id: "demo-week4-hw",
      weekId: week4.id,
      title: "Homework 4: Arrays",
      description: "Practice array creation, manipulation, and algorithms.",
      isPublished: true,
      semester: SEMESTER_FALL_2024,
      dueDate: new Date("2024-10-06"),
    },
  })

  // Create Assignments for Spring 2025 (Weeks 5-7)
  const assignment5 = await prisma.assignment.upsert({
    where: { id: "demo-week5-hw" },
    update: {
      title: "Homework 5: 2D Arrays",
      description: "Practice two-dimensional arrays and matrix operations.",
      isPublished: true,
      semester: SEMESTER_SPRING_2025,
      dueDate: new Date("2025-01-20"),
    },
    create: {
      id: "demo-week5-hw",
      weekId: week5.id,
      title: "Homework 5: 2D Arrays",
      description: "Practice two-dimensional arrays and matrix operations.",
      isPublished: true,
      semester: SEMESTER_SPRING_2025,
      dueDate: new Date("2025-01-20"),
    },
  })

  const assignment6 = await prisma.assignment.upsert({
    where: { id: "demo-week6-hw" },
    update: {
      title: "Homework 6: Recursion Fundamentals",
      description: "Practice basic recursive functions and patterns.",
      isPublished: true,
      semester: SEMESTER_SPRING_2025,
      dueDate: new Date("2025-01-27"),
    },
    create: {
      id: "demo-week6-hw",
      weekId: week6.id,
      title: "Homework 6: Recursion Fundamentals",
      description: "Practice basic recursive functions and patterns.",
      isPublished: true,
      semester: SEMESTER_SPRING_2025,
      dueDate: new Date("2025-01-27"),
    },
  })

  const assignment7 = await prisma.assignment.upsert({
    where: { id: "demo-week7-hw" },
    update: {
      title: "Homework 7: Recursion Mastery",
      description: "Advanced recursion with arrays and optimization.",
      isPublished: true,
      semester: SEMESTER_SPRING_2025,
      dueDate: new Date("2025-02-03"),
    },
    create: {
      id: "demo-week7-hw",
      weekId: week7.id,
      title: "Homework 7: Recursion Mastery",
      description: "Advanced recursion with arrays and optimization.",
      isPublished: true,
      semester: SEMESTER_SPRING_2025,
      dueDate: new Date("2025-02-03"),
    },
  })

  const assignments = [
    { assignment: assignment1, questions: hw1Questions },
    { assignment: assignment2, questions: hw2Questions },
    { assignment: assignment3, questions: hw3Questions },
    { assignment: assignment4, questions: hw4Questions },
    { assignment: assignment5, questions: hw5Questions },
    { assignment: assignment6, questions: hw6Questions },
    { assignment: assignment7, questions: hw7Questions },
  ]

  // Clear and recreate assignment questions
  for (const { assignment, questions } of assignments) {
    await prisma.assignmentQuestion.deleteMany({ where: { assignmentId: assignment.id } })
    for (let i = 0; i < questions.length; i++) {
      await prisma.assignmentQuestion.create({
        data: {
          assignmentId: assignment.id,
          questionId: questions[i].id,
          orderIndex: i,
        },
      })
    }
  }

  const totalHwQuestions = hw1Questions.length + hw2Questions.length + hw3Questions.length +
    hw4Questions.length + hw5Questions.length + hw6Questions.length + hw7Questions.length
  console.log(`   📝 Created 7 assignments (${SEMESTER_FALL_2024}: 4, ${SEMESTER_SPRING_2025}: 3) with ${totalHwQuestions} total questions`)

  // ==================== SEED REALISTIC SUBMISSIONS & GRADES ====================
  console.log("Seeding student submissions and grades...")

  // Clear existing submissions and attempts for demo students
  const demoStudentIds = demoStudents.map(s => s.id)
  await prisma.assignmentSubmission.deleteMany({
    where: { userId: { in: demoStudentIds } }
  })
  await prisma.attemptTestResult.deleteMany({
    where: { attempt: { userId: { in: demoStudentIds } } }
  })
  await prisma.attempt.deleteMany({
    where: { userId: { in: demoStudentIds } }
  })

  // Helper to create pass attempt for a question
  async function createPassAttempt(userId: string, questionId: string) {
    await prisma.attempt.create({
      data: {
        userId,
        questionId,
        code: "// Solution code",
        status: "PASS",
        executionMs: Math.floor(Math.random() * 500) + 100,
        pointsEarned: 10,
      },
    })
  }

  // Distribution for Assignment 1 (Week 1 - most submitted, varied grades)
  // 22 submitted, 5 in progress, 3 not started
  const a1Submitted = demoStudents.slice(0, 22)
  const a1InProgress = demoStudents.slice(22, 27)
  // a1NotStarted = demoStudents.slice(27, 30)

  for (let i = 0; i < a1Submitted.length; i++) {
    const student = a1Submitted[i]
    // Realistic grade distribution: mostly good, some mediocre, few poor
    let passedCount: number
    if (i < 8) passedCount = 5      // 8 students: 100%
    else if (i < 14) passedCount = 4 // 6 students: 80%
    else if (i < 18) passedCount = 3 // 4 students: 60%
    else if (i < 20) passedCount = 2 // 2 students: 40%
    else passedCount = 1              // 2 students: 20%

    // Create pass attempts
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw1Questions[q].id)
    }

    // Create submission
    const grade = Math.round((passedCount / hw1Questions.length) * 100)
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment1.id,
        userId: student.id,
        status: "SUBMITTED",
        submittedAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000),
        grade,
      },
    })
  }

  // In progress students for Assignment 1 (some questions passed, not submitted)
  for (let i = 0; i < a1InProgress.length; i++) {
    const student = a1InProgress[i]
    const passedCount = Math.floor(Math.random() * 3) + 1 // 1-3 questions
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw1Questions[q].id)
    }
    // Create IN_PROGRESS submission
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment1.id,
        userId: student.id,
        status: "IN_PROGRESS",
      },
    })
  }

  // Distribution for Assignment 2 (Week 2 - moderate submission)
  // 15 submitted, 8 in progress, 7 not started
  const a2Submitted = demoStudents.slice(0, 15)
  const a2InProgress = demoStudents.slice(15, 23)

  for (let i = 0; i < a2Submitted.length; i++) {
    const student = a2Submitted[i]
    let passedCount: number
    if (i < 5) passedCount = 5       // 5 students: 100%
    else if (i < 10) passedCount = 4 // 5 students: 80%
    else if (i < 13) passedCount = 3 // 3 students: 60%
    else passedCount = 2             // 2 students: 40%

    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw2Questions[q].id)
    }

    const grade = Math.round((passedCount / hw2Questions.length) * 100)
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment2.id,
        userId: student.id,
        status: "SUBMITTED",
        submittedAt: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000),
        grade,
      },
    })
  }

  for (let i = 0; i < a2InProgress.length; i++) {
    const student = a2InProgress[i]
    const passedCount = Math.floor(Math.random() * 2) + 1
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw2Questions[q].id)
    }
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment2.id,
        userId: student.id,
        status: "IN_PROGRESS",
      },
    })
  }

  // Distribution for Assignment 3 (Week 3)
  // 18 submitted, 7 in progress, 5 not started
  const a3Submitted = demoStudents.slice(0, 18)
  const a3InProgress = demoStudents.slice(18, 25)

  for (let i = 0; i < a3Submitted.length; i++) {
    const student = a3Submitted[i]
    let passedCount: number
    if (i < 7) passedCount = 4       // 7 students: 100%
    else if (i < 12) passedCount = 3 // 5 students: 75%
    else if (i < 16) passedCount = 2 // 4 students: 50%
    else passedCount = 1             // 2 students: 25%

    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw3Questions[q].id)
    }

    const grade = Math.round((passedCount / hw3Questions.length) * 100)
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment3.id,
        userId: student.id,
        status: "SUBMITTED",
        submittedAt: new Date(Date.now() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000),
        grade,
      },
    })
  }

  for (let i = 0; i < a3InProgress.length; i++) {
    const student = a3InProgress[i]
    const passedCount = Math.floor(Math.random() * 2) + 1
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw3Questions[q].id)
    }
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment3.id,
        userId: student.id,
        status: "IN_PROGRESS",
      },
    })
  }

  // Distribution for Assignment 4 (Week 4 - Arrays)
  // 16 submitted, 6 in progress, 8 not started
  const a4Submitted = demoStudents.slice(0, 16)
  const a4InProgress = demoStudents.slice(16, 22)

  for (let i = 0; i < a4Submitted.length; i++) {
    const student = a4Submitted[i]
    let passedCount: number
    if (i < 6) passedCount = 5       // 6 students: 100%
    else if (i < 10) passedCount = 4 // 4 students: 80%
    else if (i < 14) passedCount = 3 // 4 students: 60%
    else passedCount = 2             // 2 students: 40%

    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw4Questions[q].id)
    }

    const grade = Math.round((passedCount / hw4Questions.length) * 100)
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment4.id,
        userId: student.id,
        status: "SUBMITTED",
        submittedAt: new Date("2024-10-05"),
        grade,
      },
    })
  }

  for (let i = 0; i < a4InProgress.length; i++) {
    const student = a4InProgress[i]
    const passedCount = Math.floor(Math.random() * 3) + 1
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw4Questions[q].id)
    }
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment4.id,
        userId: student.id,
        status: "IN_PROGRESS",
      },
    })
  }

  // Distribution for Assignment 5 (Week 5 - 2D Arrays, Spring 2025)
  // 12 submitted, 8 in progress, 10 not started
  const a5Submitted = demoStudents.slice(0, 12)
  const a5InProgress = demoStudents.slice(12, 20)

  for (let i = 0; i < a5Submitted.length; i++) {
    const student = a5Submitted[i]
    let passedCount: number
    if (i < 4) passedCount = 4       // 4 students: 100%
    else if (i < 8) passedCount = 3  // 4 students: 75%
    else passedCount = 2             // 4 students: 50%

    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw5Questions[q].id)
    }

    const grade = Math.round((passedCount / hw5Questions.length) * 100)
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment5.id,
        userId: student.id,
        status: "SUBMITTED",
        submittedAt: new Date("2025-01-19"),
        grade,
      },
    })
  }

  for (let i = 0; i < a5InProgress.length; i++) {
    const student = a5InProgress[i]
    const passedCount = Math.floor(Math.random() * 2) + 1
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw5Questions[q].id)
    }
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment5.id,
        userId: student.id,
        status: "IN_PROGRESS",
      },
    })
  }

  // Distribution for Assignment 6 (Week 6 - Recursion Fundamentals)
  // 8 submitted, 10 in progress, 12 not started
  const a6Submitted = demoStudents.slice(0, 8)
  const a6InProgress = demoStudents.slice(8, 18)

  for (let i = 0; i < a6Submitted.length; i++) {
    const student = a6Submitted[i]
    let passedCount: number
    if (i < 3) passedCount = 4       // 3 students: 100%
    else if (i < 6) passedCount = 3  // 3 students: 75%
    else passedCount = 2             // 2 students: 50%

    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw6Questions[q].id)
    }

    const grade = Math.round((passedCount / hw6Questions.length) * 100)
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment6.id,
        userId: student.id,
        status: "SUBMITTED",
        submittedAt: new Date("2025-01-26"),
        grade,
      },
    })
  }

  for (let i = 0; i < a6InProgress.length; i++) {
    const student = a6InProgress[i]
    const passedCount = Math.floor(Math.random() * 2) + 1
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw6Questions[q].id)
    }
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment6.id,
        userId: student.id,
        status: "IN_PROGRESS",
      },
    })
  }

  // Distribution for Assignment 7 (Week 7 - Recursion Mastery, newest)
  // 5 submitted, 8 in progress, 17 not started
  const a7Submitted = demoStudents.slice(0, 5)
  const a7InProgress = demoStudents.slice(5, 13)

  for (let i = 0; i < a7Submitted.length; i++) {
    const student = a7Submitted[i]
    let passedCount: number
    if (i < 2) passedCount = 4       // 2 students: 100%
    else if (i < 4) passedCount = 3  // 2 students: 75%
    else passedCount = 2             // 1 student: 50%

    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw7Questions[q].id)
    }

    const grade = Math.round((passedCount / hw7Questions.length) * 100)
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment7.id,
        userId: student.id,
        status: "SUBMITTED",
        submittedAt: new Date("2025-02-02"),
        grade,
      },
    })
  }

  for (let i = 0; i < a7InProgress.length; i++) {
    const student = a7InProgress[i]
    const passedCount = Math.floor(Math.random() * 2) + 1
    for (let q = 0; q < passedCount; q++) {
      await createPassAttempt(student.id, hw7Questions[q].id)
    }
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment7.id,
        userId: student.id,
        status: "IN_PROGRESS",
      },
    })
  }

  console.log("   ✅ Seeded realistic submission distribution across 7 assignments:")
  console.log("      Fall 2024:")
  console.log("        HW1: 22 submitted, 5 in-progress, 3 not-started")
  console.log("        HW2: 15 submitted, 8 in-progress, 7 not-started")
  console.log("        HW3: 18 submitted, 7 in-progress, 5 not-started")
  console.log("        HW4: 16 submitted, 6 in-progress, 8 not-started")
  console.log("      Spring 2025:")
  console.log("        HW5: 12 submitted, 8 in-progress, 10 not-started")
  console.log("        HW6: 8 submitted, 10 in-progress, 12 not-started")
  console.log("        HW7: 5 submitted, 8 in-progress, 17 not-started")

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
