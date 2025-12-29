// Export all questions
export { week1Questions } from "./week1-cli"
export { week2Questions } from "./week2-strings"
export { week3Functions } from "./week3-functions"
export { week4Arrays } from "./week4-arrays"
export { week5_2DArrays } from "./week5-2darrays"
export { week6RecursionFundamentals } from "./week6-recursion-fundamentals"
export { week7RecursionMastery } from "./week7-recursion-mastery"

// Question type for TypeScript
export interface SeedQuestion {
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

// Course structure
export const courseStructure = {
  title: "Introduction to Java Programming",
  slug: "java-intro",
  description: "Master Java programming from basics to advanced concepts",
  weeks: [
    {
      weekNumber: 1,
      title: "Getting Started with Java",
      description: "Learn command line basics, compilation, git, and error handling",
      topics: [
        {
          title: "Command Line & Output",
          slug: "command-line-output",
          description: "Master printing, escape sequences, and basic output formatting",
          questionRange: [0, 15], // Indices in week1Questions
        },
        {
          title: "Variables & Compilation",
          slug: "variables-compilation",
          description: "Declare variables, understand data types, and compile programs",
          questionRange: [15, 25],
        },
        {
          title: "Git Basics",
          slug: "git-basics",
          description: "Version control concepts and Git commands",
          questionRange: [25, 30],
        },
        {
          title: "Error Types & Debugging",
          slug: "error-types-debugging",
          description: "Identify and fix syntax, compile, and runtime errors",
          questionRange: [30, 40],
        },
      ],
    },
    {
      weekNumber: 2,
      title: "Strings & Control Flow",
      description: "String manipulation and program control structures",
      topics: [
        {
          title: "String Methods",
          slug: "string-methods",
          description: "Master Java String class methods and operations",
          questionRange: [0, 15], // Indices in week2Questions
        },
        {
          title: "Conditionals",
          slug: "conditionals",
          description: "If statements, comparisons, and logical operators",
          questionRange: [15, 30],
        },
        {
          title: "Loops",
          slug: "loops",
          description: "For loops, while loops, and loop control",
          questionRange: [30, 50],
        },
      ],
    },
    {
      weekNumber: 3,
      title: "Functions & Methods",
      description: "Modular programming with functions",
      topics: [
        {
          title: "Function Basics",
          slug: "function-basics",
          description: "Define and call methods, understand parameters",
          questionRange: [0, 15], // Indices in week3Functions
        },
        {
          title: "Return Values",
          slug: "return-values",
          description: "Return types, return statements, using return values",
          questionRange: [15, 30],
        },
        {
          title: "Method Overloading",
          slug: "method-overloading",
          description: "Multiple methods with same name, different signatures",
          questionRange: [30, 38],
        },
        {
          title: "Input Validation",
          slug: "input-validation",
          description: "Validate inputs and handle edge cases",
          questionRange: [38, 45],
        },
      ],
    },
    {
      weekNumber: 4,
      title: "Arrays",
      description: "One-dimensional arrays and array operations",
      topics: [
        {
          title: "Array Basics",
          slug: "array-basics",
          description: "Create, access, and modify arrays",
          questionRange: [0, 15], // Indices in week4Arrays
        },
        {
          title: "Array Operations",
          slug: "array-operations",
          description: "Common array algorithms and manipulations",
          questionRange: [15, 30],
        },
        {
          title: "Command Line Arguments",
          slug: "command-line-args",
          description: "Process command line arguments in Java programs",
          questionRange: [30, 40],
        },
        {
          title: "Pass by Value",
          slug: "pass-by-value",
          description: "Understand how Java passes arguments to methods",
          questionRange: [40, 50],
        },
      ],
    },
    {
      weekNumber: 5,
      title: "2D Arrays & I/O",
      description: "Multi-dimensional arrays and input/output operations",
      topics: [
        {
          title: "2D Arrays",
          slug: "2d-arrays",
          description: "Create and manipulate two-dimensional arrays",
          questionRange: [0, 20], // Indices in week5_2DArrays
        },
        {
          title: "Standard I/O",
          slug: "standard-io",
          description: "Read input with Scanner, format output",
          questionRange: [20, 35],
        },
        {
          title: "Matrix Operations",
          slug: "matrix-operations",
          description: "PageRank-style 2D processing and matrix algorithms",
          questionRange: [35, 45],
        },
        {
          title: "Final Keyword",
          slug: "final-keyword",
          description: "Constants and immutable references",
          questionRange: [45, 55],
        },
      ],
    },
    {
      weekNumber: 6,
      title: "Recursion — Fundamentals",
      description: "Master recursive thinking with numbers and strings",
      topics: [
        {
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
          questionRange: [0, 6], // All 6 questions in week6RecursionFundamentals
        },
      ],
    },
    {
      weekNumber: 7,
      title: "Recursion — Mastery",
      description: "Advanced recursion with arrays, optimization, and complex patterns",
      topics: [
        {
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
          questionRange: [0, 9], // All 9 questions in week7RecursionMastery
        },
      ],
    },
  ],
}

// Calculate total questions
export function getTotalQuestionCount(): number {
  const { week1Questions } = require("./week1-cli")
  const { week2Questions } = require("./week2-strings")
  const { week3Functions } = require("./week3-functions")
  const { week4Arrays } = require("./week4-arrays")
  const { week5_2DArrays } = require("./week5-2darrays")
  const { week6RecursionFundamentals } = require("./week6-recursion-fundamentals")
  const { week7RecursionMastery } = require("./week7-recursion-mastery")

  return (
    week1Questions.length +
    week2Questions.length +
    week3Functions.length +
    week4Arrays.length +
    week5_2DArrays.length +
    week6RecursionFundamentals.length +
    week7RecursionMastery.length
  )
}
