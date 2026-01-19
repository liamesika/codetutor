/**
 * Pedagogical Feedback Engine
 *
 * Transforms technical errors into meaningful learning feedback.
 * Identifies conceptual misunderstandings and provides guidance.
 */

import { db } from "@/lib/db"
import { MistakeType, ConceptualMistakeCategory } from "@prisma/client"

// ============================================================================
// TYPES
// ============================================================================

export interface PedagogicalAnalysis {
  conceptualCategory: ConceptualMistakeCategory
  subcategory: string | null
  explanation: string
  whyItMatters: string | null
  guidingQuestion: string | null
  hint: string | null
  suggestedTopic: string | null
  relatedConcepts: string[]
  commonMistakeRank: number | null
}

interface AttemptContext {
  code: string
  compileError: string | null
  stderr: string | null
  testResults: Array<{
    passed: boolean
    expected: string
    actual: string | null
    error: string | null
    input: string
  }>
  mistakeType: MistakeType
  skillArea: string | null
  questionTitle?: string
  questionDescription?: string
}

// ============================================================================
// CONCEPTUAL PATTERN MATCHERS
// ============================================================================

interface ConceptualPattern {
  category: ConceptualMistakeCategory
  patterns: RegExp[]
  testPatterns?: (ctx: AttemptContext) => boolean
  explanation: string
  whyItMatters: string
  guidingQuestion: string
  hint: string
  suggestedTopic: string
  relatedConcepts: string[]
  commonMistakeRank: number
}

const CONCEPTUAL_PATTERNS: ConceptualPattern[] = [
  // LOOP ISSUES
  {
    category: "LOOP_BOUNDARY",
    patterns: [/ArrayIndexOutOfBoundsException/i, /StringIndexOutOfBoundsException/i],
    testPatterns: (ctx) => {
      // Check for off-by-one in test results
      const failedTests = ctx.testResults.filter(t => !t.passed)
      return failedTests.some(t => {
        if (!t.actual || !t.expected) return false
        const expNum = parseInt(t.expected)
        const actNum = parseInt(t.actual)
        return !isNaN(expNum) && !isNaN(actNum) && Math.abs(expNum - actNum) === 1
      })
    },
    explanation: "Your loop goes one step too far or stops one step too early. This is called an 'off-by-one' error and it's one of the most common mistakes in programming.",
    whyItMatters: "Loop boundaries are critical because arrays and strings have fixed sizes. Accessing an index that doesn't exist crashes your program.",
    guidingQuestion: "If an array has 5 elements, what is the index of the last element? What should your loop condition be?",
    hint: "Remember: an array of length n has indices from 0 to n-1. Check if you're using < or <= in your loop condition.",
    suggestedTopic: "Loops and Iteration",
    relatedConcepts: ["array indexing", "loop conditions", "zero-based indexing"],
    commonMistakeRank: 1,
  },
  {
    category: "LOOP_INITIALIZATION",
    patterns: [/for\s*\(\s*int\s+\w+\s*=\s*1/],
    testPatterns: (ctx) => {
      // Check if first element is being skipped
      const firstTestFailed = ctx.testResults[0] && !ctx.testResults[0].passed
      return firstTestFailed && ctx.code.includes("for") && /for\s*\(\s*int\s+\w+\s*=\s*1/.test(ctx.code)
    },
    explanation: "Your loop starts from the wrong position. In most cases, array and string indices start from 0, not 1.",
    whyItMatters: "Starting from the wrong index means you'll skip the first element or try to access elements that don't exist.",
    guidingQuestion: "What is the index of the first element in an array? Are you processing all elements?",
    hint: "Most loops processing arrays should start with i = 0, not i = 1.",
    suggestedTopic: "Loops and Iteration",
    relatedConcepts: ["zero-based indexing", "array traversal", "loop initialization"],
    commonMistakeRank: 2,
  },
  {
    category: "LOOP_INCREMENT",
    patterns: [],
    testPatterns: (ctx) => {
      // Check for infinite loop signs or skipping elements
      return ctx.mistakeType === "TIMEOUT" && ctx.code.includes("while")
    },
    explanation: "Your loop may not be making progress toward its exit condition. This can cause an infinite loop.",
    whyItMatters: "Every loop must eventually end. If the loop variable doesn't change correctly, the loop runs forever.",
    guidingQuestion: "How does your loop variable change in each iteration? Will it ever reach the exit condition?",
    hint: "Check that your loop variable is being updated inside the loop and moving toward the termination condition.",
    suggestedTopic: "Loops and Iteration",
    relatedConcepts: ["infinite loops", "loop termination", "loop variable updates"],
    commonMistakeRank: 3,
  },

  // CONDITION ISSUES
  {
    category: "CONDITION_LOGIC",
    patterns: [/&&.*\|\||\|\|.*&&/],
    testPatterns: (ctx) => {
      // Multiple conditions with mixed AND/OR
      return (ctx.code.match(/&&/g) || []).length > 0 && (ctx.code.match(/\|\|/g) || []).length > 0
    },
    explanation: "Your condition combines AND (&&) and OR (||) operators. The order of evaluation might not be what you expect.",
    whyItMatters: "Boolean logic with multiple operators can be tricky. AND has higher precedence than OR, which can change the meaning of your condition.",
    guidingQuestion: "What should happen when the first condition is true but the second is false? Does your code do that?",
    hint: "Use parentheses to make the order of evaluation explicit: (a && b) || c is different from a && (b || c).",
    suggestedTopic: "Conditional Statements",
    relatedConcepts: ["boolean operators", "operator precedence", "De Morgan's laws"],
    commonMistakeRank: 4,
  },
  {
    category: "CONDITION_BOUNDARY",
    patterns: [],
    testPatterns: (ctx) => {
      // Check for boundary condition issues (< vs <=)
      const failedTests = ctx.testResults.filter(t => !t.passed)
      return failedTests.length === 1 && ctx.testResults.length > 2
    },
    explanation: "Your code fails on a boundary case. Check if you're using the right comparison operator (< vs <=, > vs >=).",
    whyItMatters: "Boundary conditions define where your logic changes. A wrong operator means edge cases aren't handled correctly.",
    guidingQuestion: "Should the boundary value itself be included or excluded? What happens exactly at the boundary?",
    hint: "Consider: if the condition is 'less than 10', what happens when the value is exactly 10?",
    suggestedTopic: "Conditional Statements",
    relatedConcepts: ["comparison operators", "edge cases", "boundary testing"],
    commonMistakeRank: 2,
  },

  // ARRAY ISSUES
  {
    category: "ARRAY_INDEXING",
    patterns: [/ArrayIndexOutOfBoundsException/i, /Index\s+\d+\s+out\s+of\s+bounds/i],
    explanation: "You're trying to access an array element that doesn't exist. Arrays have a fixed size and valid indices go from 0 to length-1.",
    whyItMatters: "Accessing invalid array indices causes your program to crash. This is a common source of bugs in many programs.",
    guidingQuestion: "If your array has n elements, what is the valid range of indices? Are you staying within that range?",
    hint: "Before accessing array[i], make sure i >= 0 AND i < array.length.",
    suggestedTopic: "Arrays",
    relatedConcepts: ["array bounds", "index validation", "array length"],
    commonMistakeRank: 1,
  },
  {
    category: "ARRAY_SIZE",
    patterns: [/\.length\s*-\s*1/, /\.length\s*\+\s*1/],
    testPatterns: (ctx) => {
      return ctx.code.includes(".length") && /\.length\s*[-+]\s*\d/.test(ctx.code)
    },
    explanation: "Check your use of array length. Remember that the last valid index is length-1, not length.",
    whyItMatters: "Confusing array length with the last index is a classic mistake. Length tells you how many elements; indices tell you where they are.",
    guidingQuestion: "An array of length 5 has which indices? Is length-1 the last index or one past it?",
    hint: "array.length gives the count of elements. The last element is at array[array.length - 1].",
    suggestedTopic: "Arrays",
    relatedConcepts: ["array length", "zero-based indexing", "array traversal"],
    commonMistakeRank: 2,
  },

  // STRING ISSUES
  {
    category: "STRING_MANIPULATION",
    patterns: [/StringIndexOutOfBoundsException/i, /\.charAt/, /\.substring/],
    explanation: "There's an issue with how you're manipulating strings. String indices work like arrays - they start at 0.",
    whyItMatters: "Strings are sequences of characters with fixed length. Accessing beyond the string's length causes an error.",
    guidingQuestion: "For a string of length n, what are the valid indices for charAt()? What parameters does substring() expect?",
    hint: "charAt(i) needs i to be between 0 and length()-1. substring(start, end) goes from start up to but NOT including end.",
    suggestedTopic: "Strings",
    relatedConcepts: ["string indexing", "substring", "string length"],
    commonMistakeRank: 3,
  },

  // NULL HANDLING
  {
    category: "NULL_HANDLING",
    patterns: [/NullPointerException/i, /null pointer/i],
    explanation: "You're trying to use an object or value that is null (doesn't exist). Always check if something might be null before using it.",
    whyItMatters: "Null represents 'nothing' or 'no value'. Trying to call methods on null crashes your program.",
    guidingQuestion: "What could cause this variable to be null? Did you forget to initialize it, or could a method return null?",
    hint: "Add a null check: if (variable != null) before using the variable.",
    suggestedTopic: "Objects and References",
    relatedConcepts: ["null values", "defensive programming", "initialization"],
    commonMistakeRank: 3,
  },

  // EDGE CASES
  {
    category: "EDGE_CASE_EMPTY",
    patterns: [],
    testPatterns: (ctx) => {
      // Check if empty input causes failure
      return ctx.testResults.some(t => !t.passed && (t.input === "" || t.input === "[]" || t.input === "0"))
    },
    explanation: "Your code doesn't handle empty input correctly. Always consider what happens when there's nothing to process.",
    whyItMatters: "Empty inputs are common in real programs. Your code should handle them gracefully, not crash.",
    guidingQuestion: "What should your program output when given an empty array or string? Does your code handle this case?",
    hint: "Add a check at the beginning: if the input is empty, return the appropriate result immediately.",
    suggestedTopic: "Edge Cases",
    relatedConcepts: ["empty input", "input validation", "defensive programming"],
    commonMistakeRank: 2,
  },
  {
    category: "EDGE_CASE_SINGLE",
    patterns: [],
    testPatterns: (ctx) => {
      // Check if single-element input causes failure
      return ctx.testResults.some(t => !t.passed && (t.input === "1" || t.input.match(/^\[\d\]$/) || t.input.length === 1))
    },
    explanation: "Your code doesn't handle single-element inputs correctly. Some algorithms need special handling for this case.",
    whyItMatters: "Single-element cases often expose assumptions in your code, like expecting at least two elements to compare.",
    guidingQuestion: "What happens in your loop when there's only one element? Does your comparison logic still work?",
    hint: "Test your code mentally with just one element. Does each line still make sense?",
    suggestedTopic: "Edge Cases",
    relatedConcepts: ["single element", "edge cases", "algorithm assumptions"],
    commonMistakeRank: 3,
  },
  {
    category: "EDGE_CASE_BOUNDARY",
    patterns: [/overflow/i, /Integer\.MAX_VALUE/, /Integer\.MIN_VALUE/],
    explanation: "Your code may not handle extreme values correctly (very large or very small numbers).",
    whyItMatters: "Integer overflow can cause unexpected results. Numbers have limits, and exceeding them causes wrap-around.",
    guidingQuestion: "What happens if the input is the largest possible integer? Could your calculations overflow?",
    hint: "Consider using long instead of int for intermediate calculations, or check for potential overflow before it happens.",
    suggestedTopic: "Data Types",
    relatedConcepts: ["integer overflow", "data type limits", "boundary values"],
    commonMistakeRank: 5,
  },

  // ALGORITHM ISSUES
  {
    category: "ALGORITHM_APPROACH",
    patterns: [],
    testPatterns: (ctx) => ctx.mistakeType === "MISUNDERSTANDING",
    explanation: "Your approach to solving this problem may need rethinking. Most tests are failing, suggesting the algorithm itself needs work.",
    whyItMatters: "Choosing the right algorithm is fundamental. A wrong approach can't be fixed by small adjustments.",
    guidingQuestion: "Can you explain your algorithm step by step? Does each step move you toward the correct answer?",
    hint: "Try working through a small example by hand first. What steps do you take? Then translate those steps to code.",
    suggestedTopic: "Problem Solving",
    relatedConcepts: ["algorithm design", "problem decomposition", "step-by-step thinking"],
    commonMistakeRank: 4,
  },
  {
    category: "ALGORITHM_INCOMPLETE",
    patterns: [],
    testPatterns: (ctx) => {
      // Some tests pass, some fail - missing cases
      const passRate = ctx.testResults.filter(t => t.passed).length / ctx.testResults.length
      return passRate > 0.3 && passRate < 0.7
    },
    explanation: "Your algorithm works for some cases but not all. You may be missing a step or not handling certain conditions.",
    whyItMatters: "A partial solution shows you understand the basics but need to consider more scenarios.",
    guidingQuestion: "Look at the failing tests - what do they have in common? Is there a case your code doesn't handle?",
    hint: "Compare a passing test input with a failing one. What's different? That difference might reveal the missing logic.",
    suggestedTopic: "Problem Solving",
    relatedConcepts: ["test analysis", "case coverage", "algorithm completeness"],
    commonMistakeRank: 3,
  },

  // OUTPUT FORMAT
  {
    category: "OUTPUT_FORMAT",
    patterns: [],
    testPatterns: (ctx) => {
      return ctx.testResults.some(t => {
        if (!t.actual || !t.expected || t.passed) return false
        // Check if content is same but format different
        const expClean = t.expected.replace(/\s+/g, "").toLowerCase()
        const actClean = t.actual.replace(/\s+/g, "").toLowerCase()
        return expClean === actClean
      })
    },
    explanation: "Your answer is correct but the format is wrong. Check spacing, newlines, or capitalization.",
    whyItMatters: "In programming, exact output matters. Automated systems compare your output character by character.",
    guidingQuestion: "Compare your output with the expected output carefully. Do you see any differences in spacing or formatting?",
    hint: "Check for extra spaces, missing newlines, or wrong capitalization. The content might be right but the format wrong.",
    suggestedTopic: "Input/Output",
    relatedConcepts: ["output formatting", "whitespace", "string comparison"],
    commonMistakeRank: 1,
  },

  // RECURSION ISSUES
  {
    category: "RECURSION_BASE",
    patterns: [/StackOverflowError/i],
    testPatterns: (ctx) => ctx.code.includes("return") && ctx.mistakeType === "MEMORY",
    explanation: "Your recursive function may be missing a base case or the base case condition is wrong.",
    whyItMatters: "Every recursive function needs a base case that stops the recursion. Without it, the function calls itself forever.",
    guidingQuestion: "What is the simplest input for which you know the answer immediately? That should be your base case.",
    hint: "A base case typically looks like: if (n <= 0) return something; Make sure this condition will eventually be true.",
    suggestedTopic: "Recursion",
    relatedConcepts: ["base case", "recursive calls", "stack overflow"],
    commonMistakeRank: 4,
  },
  {
    category: "RECURSION_PROGRESS",
    patterns: [/StackOverflowError/i],
    testPatterns: (ctx) => {
      // Check if recursive call doesn't reduce problem
      const hasRecursion = /(\w+)\s*\([^)]*\)\s*\{[^}]*\1\s*\(/.test(ctx.code)
      return hasRecursion && ctx.mistakeType === "MEMORY"
    },
    explanation: "Your recursive calls may not be making progress toward the base case. Each call should bring you closer to stopping.",
    whyItMatters: "Recursion must reduce the problem size with each call. If not, you'll never reach the base case.",
    guidingQuestion: "How does each recursive call change the input? Is it getting smaller or closer to the base case?",
    hint: "If you're recursing on n, make sure you call the function with something smaller like n-1, not n or n+1.",
    suggestedTopic: "Recursion",
    relatedConcepts: ["recursive progress", "problem reduction", "base case convergence"],
    commonMistakeRank: 4,
  },

  // TYPE ISSUES
  {
    category: "TYPE_CONVERSION",
    patterns: [/incompatible types/i, /cannot be converted/i, /lossy conversion/i],
    explanation: "You're mixing different data types in a way that doesn't work. Java requires explicit conversion between some types.",
    whyItMatters: "Different data types have different ranges and behaviors. Converting incorrectly can lose data or cause errors.",
    guidingQuestion: "What types are you working with? Does the operation make sense for those types?",
    hint: "To convert an int to a String, use String.valueOf(). To convert a String to an int, use Integer.parseInt().",
    suggestedTopic: "Data Types",
    relatedConcepts: ["type casting", "type conversion", "data types"],
    commonMistakeRank: 3,
  },
  {
    category: "INTEGER_OVERFLOW",
    patterns: [/overflow/i],
    testPatterns: (ctx) => {
      // Large numbers in failing tests
      return ctx.testResults.some(t => !t.passed && /\d{10,}/.test(t.input))
    },
    explanation: "Your calculation may be overflowing. When numbers get too large for int, they wrap around to negative values.",
    whyItMatters: "Integer overflow is a silent bug - your code runs but produces wrong results for large numbers.",
    guidingQuestion: "What's the largest number your calculation could produce? Is it larger than 2,147,483,647 (Integer.MAX_VALUE)?",
    hint: "Use 'long' instead of 'int' for calculations that might exceed int's range. Also consider the order of operations.",
    suggestedTopic: "Data Types",
    relatedConcepts: ["integer overflow", "long vs int", "numeric limits"],
    commonMistakeRank: 5,
  },

  // PROBLEM MISUNDERSTANDING
  {
    category: "PROBLEM_MISREAD",
    patterns: [],
    testPatterns: (ctx) => ctx.mistakeType === "MISUNDERSTANDING",
    explanation: "Most tests are failing, which suggests the problem requirements may have been misunderstood. Re-read the problem carefully.",
    whyItMatters: "Understanding the problem is the first step to solving it. A correct solution to the wrong problem is still wrong.",
    guidingQuestion: "Can you explain in your own words what the problem is asking for? What is the expected input and output?",
    hint: "Look at the examples given. Trace through them step by step. What transformation happens from input to output?",
    suggestedTopic: "Problem Solving",
    relatedConcepts: ["problem comprehension", "requirements analysis", "examples"],
    commonMistakeRank: 2,
  },

  // OPERATOR PRECEDENCE
  {
    category: "OPERATOR_PRECEDENCE",
    patterns: [/\d\s*[+\-]\s*\d\s*[*\/]\s*\d/],
    testPatterns: (ctx) => {
      // Math expression without parentheses
      return /[+\-].*[*\/]|[*\/].*[+\-]/.test(ctx.code) && !/\([^)]*[+\-*\/][^)]*\)/.test(ctx.code)
    },
    explanation: "Your mathematical expression may not evaluate in the order you expect. Multiplication and division happen before addition and subtraction.",
    whyItMatters: "Operator precedence follows mathematical rules, not left-to-right reading. This can produce unexpected results.",
    guidingQuestion: "What is 2 + 3 * 4? Is it 20 or 14? Does your code rely on a specific order of operations?",
    hint: "Use parentheses to make the order explicit: (a + b) * c is different from a + (b * c).",
    suggestedTopic: "Operators",
    relatedConcepts: ["operator precedence", "mathematical expressions", "parentheses"],
    commonMistakeRank: 4,
  },
]

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

export async function generatePedagogicalFeedback(
  attemptId: string,
  mistakeLogId: string
): Promise<PedagogicalAnalysis | null> {
  // Fetch attempt with all context
  const attempt = await db.attempt.findUnique({
    where: { id: attemptId },
    include: {
      testResults: true,
      question: { include: { topic: true } },
      mistakeLogs: {
        where: { id: mistakeLogId },
        take: 1,
      },
    },
  })

  if (!attempt || attempt.mistakeLogs.length === 0) {
    return null
  }

  const mistakeLog = attempt.mistakeLogs[0]

  const context: AttemptContext = {
    code: attempt.code,
    compileError: attempt.compileError,
    stderr: attempt.stderr,
    testResults: attempt.testResults.map(tr => ({
      passed: tr.passed,
      expected: tr.expected,
      actual: tr.actual,
      error: tr.error,
      input: tr.input,
    })),
    mistakeType: mistakeLog.mistakeType,
    skillArea: mistakeLog.skillArea,
    questionTitle: attempt.question.title,
    questionDescription: attempt.question.prompt || undefined,
  }

  // Find the best matching conceptual pattern
  const analysis = findBestMatch(context)

  // Store the feedback
  await db.pedagogicalFeedback.create({
    data: {
      mistakeLogId,
      attemptId,
      conceptualCategory: analysis.conceptualCategory,
      subcategory: analysis.subcategory,
      explanation: analysis.explanation,
      whyItMatters: analysis.whyItMatters,
      guidingQuestion: analysis.guidingQuestion,
      hint: analysis.hint,
      suggestedTopic: analysis.suggestedTopic,
      relatedConcepts: analysis.relatedConcepts,
      commonMistakeRank: analysis.commonMistakeRank,
      aiGenerated: false,
    },
  })

  return analysis
}

function findBestMatch(context: AttemptContext): PedagogicalAnalysis {
  const errorText = [context.compileError, context.stderr].filter(Boolean).join("\n")
  let bestMatch: ConceptualPattern | null = null
  let bestScore = 0

  for (const pattern of CONCEPTUAL_PATTERNS) {
    let score = 0

    // Check regex patterns against error text
    for (const regex of pattern.patterns) {
      if (regex.test(errorText) || regex.test(context.code)) {
        score += 2
      }
    }

    // Check test patterns (contextual analysis)
    if (pattern.testPatterns && pattern.testPatterns(context)) {
      score += 3
    }

    // Bonus for skill area match
    if (context.skillArea && pattern.suggestedTopic.toLowerCase().includes(context.skillArea.toLowerCase())) {
      score += 1
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = pattern
    }
  }

  // If no good match found, return a generic response based on mistake type
  if (!bestMatch || bestScore === 0) {
    return getGenericFeedback(context)
  }

  return {
    conceptualCategory: bestMatch.category,
    subcategory: null,
    explanation: bestMatch.explanation,
    whyItMatters: bestMatch.whyItMatters,
    guidingQuestion: bestMatch.guidingQuestion,
    hint: bestMatch.hint,
    suggestedTopic: bestMatch.suggestedTopic,
    relatedConcepts: bestMatch.relatedConcepts,
    commonMistakeRank: bestMatch.commonMistakeRank,
  }
}

function getGenericFeedback(context: AttemptContext): PedagogicalAnalysis {
  const mistakeTypeDefaults: Record<MistakeType, Partial<PedagogicalAnalysis>> = {
    SYNTAX: {
      conceptualCategory: "OUTPUT_FORMAT",
      explanation: "There's a syntax error in your code. Check for missing semicolons, brackets, or typos in keywords.",
      whyItMatters: "Syntax errors prevent your code from running at all. The computer needs exact syntax to understand your instructions.",
      guidingQuestion: "Look at the error message - it usually tells you the line number. What looks wrong on that line?",
      hint: "Common syntax errors: missing semicolon (;), mismatched brackets {}, wrong spelling of keywords like 'public' or 'static'.",
      suggestedTopic: "Java Syntax",
    },
    LOGIC: {
      conceptualCategory: "ALGORITHM_INCOMPLETE",
      explanation: "Your code runs but produces incorrect results. The logic of your solution needs adjustment.",
      whyItMatters: "Logic errors are tricky because the code runs without crashing. You need to trace through your algorithm carefully.",
      guidingQuestion: "Pick a failing test case and trace through your code step by step. Where does the actual result diverge from expected?",
      hint: "Add print statements to see intermediate values. This helps you find where your logic goes wrong.",
      suggestedTopic: "Debugging",
    },
    TIMEOUT: {
      conceptualCategory: "LOOP_INCREMENT",
      explanation: "Your code took too long to run. This usually means an infinite loop or a very inefficient algorithm.",
      whyItMatters: "Efficiency matters in programming. An infinite loop means your program never finishes.",
      guidingQuestion: "Do all your loops have a way to exit? Is your loop variable changing in the right direction?",
      hint: "Check your while loops especially. Make sure the condition will eventually become false.",
      suggestedTopic: "Loops and Efficiency",
    },
    MISUNDERSTANDING: {
      conceptualCategory: "PROBLEM_MISREAD",
      explanation: "Most tests are failing. This often means the problem requirements weren't fully understood.",
      whyItMatters: "Understanding what to build is as important as knowing how to build it.",
      guidingQuestion: "Re-read the problem statement. What exactly is being asked? What are the inputs and expected outputs?",
      hint: "Work through the given examples by hand before coding. Make sure you can solve it manually first.",
      suggestedTopic: "Problem Solving",
    },
    CARELESS: {
      conceptualCategory: "OUTPUT_FORMAT",
      explanation: "You're very close! The answer is almost right but has a small error - maybe off by one, wrong case, or extra space.",
      whyItMatters: "Details matter in programming. Computers compare outputs exactly, character by character.",
      guidingQuestion: "Compare your output with the expected output very carefully. What's the tiny difference?",
      hint: "Check for: off-by-one errors, uppercase vs lowercase, extra or missing spaces/newlines.",
      suggestedTopic: "Attention to Detail",
    },
    MEMORY: {
      conceptualCategory: "RECURSION_BASE",
      explanation: "Your program ran out of memory. This is often caused by infinite recursion or creating too many objects.",
      whyItMatters: "Memory is limited. Infinite recursion fills up the call stack and crashes your program.",
      guidingQuestion: "If you're using recursion, does every path eventually reach a base case?",
      hint: "Add a base case that returns directly without making another recursive call.",
      suggestedTopic: "Recursion",
    },
    EDGE_CASE: {
      conceptualCategory: "EDGE_CASE_BOUNDARY",
      explanation: "Your code fails on edge cases - unusual inputs like empty arrays, single elements, or extreme values.",
      whyItMatters: "Good code handles all inputs, not just typical ones. Edge cases are where bugs often hide.",
      guidingQuestion: "What happens with empty input? With just one element? With the largest possible value?",
      hint: "Add checks at the beginning of your function for special cases before the main logic.",
      suggestedTopic: "Edge Cases",
    },
    TYPE_ERROR: {
      conceptualCategory: "TYPE_CONVERSION",
      explanation: "There's a type mismatch in your code. You're using values of different types in a way that doesn't work.",
      whyItMatters: "Java is a strongly typed language. Operations must use compatible types.",
      guidingQuestion: "What type is each variable? Are you mixing integers with strings, or using the wrong method for a type?",
      hint: "Check the types of your variables. Use casting or conversion methods when needed.",
      suggestedTopic: "Data Types",
    },
  }

  const defaults = mistakeTypeDefaults[context.mistakeType] || mistakeTypeDefaults.LOGIC

  return {
    conceptualCategory: defaults.conceptualCategory || "ALGORITHM_INCOMPLETE",
    subcategory: null,
    explanation: defaults.explanation || "There's an error in your code.",
    whyItMatters: defaults.whyItMatters || "Understanding errors helps you become a better programmer.",
    guidingQuestion: defaults.guidingQuestion || "Can you identify what part of your code might be causing this?",
    hint: defaults.hint || "Review your code step by step.",
    suggestedTopic: defaults.suggestedTopic || "General Programming",
    relatedConcepts: [],
    commonMistakeRank: null,
  }
}

// ============================================================================
// AGGREGATION & INSIGHTS
// ============================================================================

export async function getStudentMistakeInsights(userId: string) {
  const [
    conceptualBreakdown,
    recurringConcepts,
    improvementAreas,
    recentFeedback,
  ] = await Promise.all([
    // Group by conceptual category
    db.pedagogicalFeedback.groupBy({
      by: ["conceptualCategory"],
      where: {
        mistakeLog: { userId },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Find recurring conceptual issues
    db.pedagogicalFeedback.findMany({
      where: {
        mistakeLog: { userId, isRecurring: true },
      },
      select: {
        conceptualCategory: true,
        suggestedTopic: true,
        explanation: true,
        mistakeLog: {
          select: { createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    // Topics that need work
    db.pedagogicalFeedback.groupBy({
      by: ["suggestedTopic"],
      where: {
        mistakeLog: { userId },
        suggestedTopic: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),

    // Recent feedback
    db.pedagogicalFeedback.findMany({
      where: {
        mistakeLog: { userId },
      },
      include: {
        mistakeLog: {
          include: {
            question: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  return {
    conceptualBreakdown: conceptualBreakdown.map(c => ({
      category: c.conceptualCategory,
      count: c._count.id,
    })),
    recurringConcepts: recurringConcepts.map(r => ({
      category: r.conceptualCategory,
      topic: r.suggestedTopic,
      explanation: r.explanation,
      date: r.mistakeLog.createdAt,
    })),
    improvementAreas: improvementAreas
      .filter(a => a.suggestedTopic)
      .map(a => ({
        topic: a.suggestedTopic!,
        mistakeCount: a._count.id,
      })),
    recentFeedback: recentFeedback.map(f => ({
      category: f.conceptualCategory,
      explanation: f.explanation,
      hint: f.hint,
      guidingQuestion: f.guidingQuestion,
      questionTitle: f.mistakeLog.question.title,
      date: f.createdAt,
    })),
  }
}

export async function getClassMistakeInsights() {
  const [
    topMistakes,
    mistakesByTopic,
    weeklyTrend,
    commonPatterns,
  ] = await Promise.all([
    // Most common conceptual mistakes
    db.pedagogicalFeedback.groupBy({
      by: ["conceptualCategory"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Mistakes by suggested topic
    db.pedagogicalFeedback.groupBy({
      by: ["suggestedTopic"],
      where: { suggestedTopic: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Weekly trend
    db.$queryRaw<Array<{ week: Date; count: bigint }>>`
      SELECT DATE_TRUNC('week', "createdAt") as week, COUNT(*) as count
      FROM "PedagogicalFeedback"
      WHERE "createdAt" > NOW() - INTERVAL '8 weeks'
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY week DESC
    `,

    // Students with most recurring issues
    db.mistakeLog.groupBy({
      by: ["userId"],
      where: { isRecurring: true },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ])

  return {
    topMistakes: topMistakes.map(m => ({
      category: m.conceptualCategory,
      count: m._count.id,
    })),
    mistakesByTopic: mistakesByTopic
      .filter(m => m.suggestedTopic)
      .map(m => ({
        topic: m.suggestedTopic!,
        count: m._count.id,
      })),
    weeklyTrend: weeklyTrend.map(w => ({
      week: w.week,
      count: Number(w.count),
    })),
    studentsNeedingHelp: commonPatterns.map(p => ({
      userId: p.userId,
      recurringMistakes: p._count.id,
    })),
  }
}
