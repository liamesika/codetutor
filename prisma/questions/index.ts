// Export all questions
export { week1Questions } from "./week1-cli"
export { week2Questions } from "./week2-strings"
export { week3Functions } from "./week3-functions"
export { week4Arrays } from "./week4-arrays"
export { week5_2DArrays } from "./week5-2darrays"

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
  ],
}

// Calculate total questions
export function getTotalQuestionCount(): number {
  const { week1Questions } = require("./week1-cli")
  const { week2Questions } = require("./week2-strings")
  const { week3Functions } = require("./week3-functions")
  const { week4Arrays } = require("./week4-arrays")
  const { week5_2DArrays } = require("./week5-2darrays")

  return (
    week1Questions.length +
    week2Questions.length +
    week3Functions.length +
    week4Arrays.length +
    week5_2DArrays.length
  )
}
