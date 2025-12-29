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
