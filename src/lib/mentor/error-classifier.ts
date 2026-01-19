/**
 * Pre-AI Error Classifier
 *
 * Deterministic classifier that analyzes compile errors, runtime errors,
 * and test diffs BEFORE calling AI. Provides signals to enhance AI prompts.
 */

import { MentorErrorCategory } from "@prisma/client"

export interface TestResult {
  testIndex: number
  input: string
  expected: string
  actual: string | null
  passed: boolean
  error: string | null
  isHidden?: boolean
}

export interface ClassificationInput {
  code: string
  compileError: string | null
  runtimeError: string | null
  stderr: string | null
  testResults: TestResult[]
  executionMs: number | null
  status: string
}

export interface ClassificationOutput {
  category: MentorErrorCategory
  severity: number // 1-5
  keySignals: string[]
  patternMatches: string[]
  suggestedFocus: string
  testAnalysis: {
    totalTests: number
    passedTests: number
    failedTests: number
    hiddenTestsFailed: boolean
    commonPattern: string | null
  }
}

// Java-specific syntax error patterns
const SYNTAX_PATTERNS = [
  { pattern: /';' expected/i, signal: "missing semicolon" },
  { pattern: /illegal start of expression/i, signal: "expression syntax error" },
  { pattern: /reached end of file while parsing/i, signal: "unclosed bracket/brace" },
  { pattern: /unclosed string literal/i, signal: "unclosed string" },
  { pattern: /\) expected/i, signal: "missing closing parenthesis" },
  { pattern: /\} expected/i, signal: "missing closing brace" },
  { pattern: /class, interface, or enum expected/i, signal: "structure declaration error" },
  { pattern: /missing return statement/i, signal: "missing return statement" },
  { pattern: /<identifier> expected/i, signal: "missing identifier" },
  { pattern: /not a statement/i, signal: "invalid statement" },
  { pattern: /incompatible types/i, signal: "type mismatch" },
  { pattern: /cannot find symbol/i, signal: "undefined variable/method" },
  { pattern: /variable .* might not have been initialized/i, signal: "uninitialized variable" },
]

// Runtime error patterns
const RUNTIME_PATTERNS = [
  { pattern: /ArrayIndexOutOfBoundsException/i, signal: "array index out of bounds", category: "EDGE_CASE" as MentorErrorCategory },
  { pattern: /StringIndexOutOfBoundsException/i, signal: "string index out of bounds", category: "EDGE_CASE" as MentorErrorCategory },
  { pattern: /NullPointerException/i, signal: "null pointer access", category: "NULL_HANDLING" as MentorErrorCategory },
  { pattern: /ArithmeticException.*divide by zero/i, signal: "division by zero", category: "EDGE_CASE" as MentorErrorCategory },
  { pattern: /NumberFormatException/i, signal: "invalid number format", category: "TYPE_ERROR" as MentorErrorCategory },
  { pattern: /StackOverflowError/i, signal: "infinite recursion", category: "LOGIC" as MentorErrorCategory },
  { pattern: /OutOfMemoryError/i, signal: "memory exceeded", category: "LOGIC" as MentorErrorCategory },
  { pattern: /InputMismatchException/i, signal: "input parsing error", category: "TYPE_ERROR" as MentorErrorCategory },
  { pattern: /ClassCastException/i, signal: "invalid type cast", category: "TYPE_ERROR" as MentorErrorCategory },
]

// Output format patterns
const OUTPUT_PATTERNS = [
  { pattern: /extra whitespace/i, signal: "extra whitespace in output" },
  { pattern: /missing newline/i, signal: "missing newline" },
  { pattern: /trailing space/i, signal: "trailing whitespace" },
  { pattern: /case.*mismatch/i, signal: "case sensitivity issue" },
]

/**
 * Analyze test result differences to detect patterns
 */
function analyzeTestDiffs(testResults: TestResult[]): {
  pattern: string | null
  signals: string[]
} {
  const signals: string[] = []
  const failedTests = testResults.filter((t) => !t.passed && t.actual !== null)

  if (failedTests.length === 0) {
    return { pattern: null, signals }
  }

  // Check for off-by-one patterns
  let offByOneCount = 0
  let outputFormatCount = 0
  let completelyWrongCount = 0

  for (const test of failedTests) {
    if (!test.expected || !test.actual) continue

    const expected = test.expected.trim()
    const actual = test.actual.trim()

    // Check numeric off-by-one
    const expNum = parseFloat(expected)
    const actNum = parseFloat(actual)
    if (!isNaN(expNum) && !isNaN(actNum)) {
      const diff = Math.abs(expNum - actNum)
      if (diff === 1) {
        offByOneCount++
        signals.push(`off-by-one: expected ${expected}, got ${actual}`)
      } else if (diff <= 2) {
        signals.push(`close but wrong: expected ${expected}, got ${actual} (diff: ${diff})`)
      }
    }

    // Check output format issues
    if (expected.toLowerCase() === actual.toLowerCase() && expected !== actual) {
      outputFormatCount++
      signals.push("case mismatch in output")
    }

    if (expected.replace(/\s+/g, "") === actual.replace(/\s+/g, "") && expected !== actual) {
      outputFormatCount++
      signals.push("whitespace difference in output")
    }

    // Check for extra/missing lines
    const expLines = expected.split("\n").length
    const actLines = actual.split("\n").length
    if (expLines !== actLines) {
      signals.push(`line count mismatch: expected ${expLines}, got ${actLines}`)
    }

    // Check if completely wrong (very different)
    if (expected.length > 0 && actual.length > 0) {
      const similarity = calculateSimilarity(expected, actual)
      if (similarity < 0.3) {
        completelyWrongCount++
      }
    }
  }

  // Determine dominant pattern
  let pattern: string | null = null
  if (offByOneCount > failedTests.length / 2) {
    pattern = "off-by-one"
  } else if (outputFormatCount > failedTests.length / 2) {
    pattern = "output-format"
  } else if (completelyWrongCount > failedTests.length / 2) {
    pattern = "logic-error"
  }

  return { pattern, signals }
}

/**
 * Simple string similarity (Jaccard-ish)
 */
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1
  if (!a || !b) return 0

  const aSet = new Set(a.toLowerCase().split(""))
  const bSet = new Set(b.toLowerCase().split(""))

  const intersection = new Set([...aSet].filter((x) => bSet.has(x)))
  const union = new Set([...aSet, ...bSet])

  return intersection.size / union.size
}

/**
 * Analyze code for potential issues
 */
function analyzeCodePatterns(code: string): string[] {
  const signals: string[] = []

  // Check for common loop issues
  if (/for\s*\([^;]*;\s*[^;]*<\s*\w+\.length\s*-\s*1/i.test(code)) {
    signals.push("loop may stop one element early (< length - 1)")
  }
  if (/for\s*\([^;]*;\s*[^;]*<=\s*\w+\.length/i.test(code)) {
    signals.push("loop may go past array bounds (<= length)")
  }
  if (/for\s*\(\s*int\s+\w+\s*=\s*1/i.test(code)) {
    signals.push("loop starts at 1, may miss first element")
  }

  // Check for null handling
  if (/\.length\s*[=<>]/i.test(code) && !(/\w+\s*!=\s*null|null\s*!=\s*\w+/i.test(code))) {
    signals.push("accessing .length without null check")
  }

  // Check for potential integer overflow
  if (/int\s+\w+\s*=\s*\w+\s*\*\s*\w+/i.test(code) && !/long/i.test(code)) {
    signals.push("multiplication may cause integer overflow")
  }

  // Check for hardcoded values (bad practice)
  if (/return\s+\d+\s*;/i.test(code) && !/return\s+0\s*;|return\s+1\s*;|return\s+-1\s*;/i.test(code)) {
    signals.push("contains hardcoded return value")
  }

  // Check for empty input handling
  if (!/\.length\s*==\s*0|\.isEmpty\(\)|\.length\s*<\s*1/i.test(code)) {
    signals.push("may not handle empty input")
  }

  return signals
}

/**
 * Main classification function
 */
export function classifyError(input: ClassificationInput): ClassificationOutput {
  const {
    code,
    compileError,
    runtimeError,
    stderr,
    testResults,
    executionMs,
    status,
  } = input

  const keySignals: string[] = []
  const patternMatches: string[] = []
  let category: MentorErrorCategory = "OTHER"
  let severity = 3
  let suggestedFocus = "Review your logic and test with sample inputs"

  const errorText = [compileError, runtimeError, stderr].filter(Boolean).join("\n")

  // Test analysis
  const totalTests = testResults.length
  const passedTests = testResults.filter((t) => t.passed).length
  const failedTests = totalTests - passedTests
  const hiddenTestsFailed = testResults.some((t) => !t.passed && t.isHidden)

  // 1. Check for timeout
  if (status === "TIMEOUT" || /timeout|time.?limit/i.test(errorText)) {
    category = "TIMEOUT"
    severity = 4
    keySignals.push("execution exceeded time limit")
    suggestedFocus = "Check for infinite loops or inefficient algorithms"
    patternMatches.push("timeout-detected")
  }

  // 2. Check for syntax/compile errors
  else if (status === "COMPILE_ERROR" || compileError) {
    category = "SYNTAX"
    severity = 2

    for (const { pattern, signal } of SYNTAX_PATTERNS) {
      if (pattern.test(errorText)) {
        keySignals.push(signal)
        patternMatches.push(pattern.source.substring(0, 30))
      }
    }

    if (keySignals.length === 0) {
      keySignals.push("compilation failed")
    }

    suggestedFocus = "Fix the syntax error before testing logic"
  }

  // 3. Check for runtime errors
  else if (status === "RUNTIME_ERROR" || /Exception|Error/i.test(errorText)) {
    for (const { pattern, signal, category: cat } of RUNTIME_PATTERNS) {
      if (pattern.test(errorText)) {
        category = cat
        keySignals.push(signal)
        patternMatches.push(pattern.source.substring(0, 30))
        break
      }
    }

    if (category === "OTHER") {
      category = "RUNTIME_ERROR"
      keySignals.push("runtime exception occurred")
    }

    severity = 3
    suggestedFocus = "Identify what input causes the crash and add proper checks"
  }

  // 4. Analyze test failures
  else if (failedTests > 0) {
    const { pattern, signals: diffSignals } = analyzeTestDiffs(testResults)

    keySignals.push(...diffSignals.slice(0, 5)) // Limit to 5 signals

    if (pattern === "off-by-one") {
      category = "OFF_BY_ONE"
      severity = 2
      suggestedFocus = "Check loop boundaries and array indices"
    } else if (pattern === "output-format") {
      category = "OUTPUT_FORMAT"
      severity = 1
      suggestedFocus = "Match the exact output format (spacing, newlines, case)"
    } else if (pattern === "logic-error") {
      category = "LOGIC"
      severity = 4
      suggestedFocus = "Re-read the problem and trace through your algorithm"
    } else {
      category = "LOGIC"
      severity = 3
    }

    // Check if only hidden tests fail
    if (hiddenTestsFailed && passedTests > 0) {
      keySignals.push("fails on hidden edge case tests")
      category = "EDGE_CASE"
      suggestedFocus = "Consider edge cases: empty input, single element, boundaries"
    }
  }

  // 5. Analyze code patterns
  const codeSignals = analyzeCodePatterns(code)
  if (codeSignals.length > 0) {
    keySignals.push(...codeSignals.slice(0, 3))
  }

  // Adjust severity based on pass rate
  if (totalTests > 0) {
    const passRate = passedTests / totalTests
    if (passRate >= 0.8) {
      severity = Math.max(1, severity - 1) // Close to solving
    } else if (passRate === 0) {
      severity = Math.min(5, severity + 1) // Nothing works
    }
  }

  return {
    category,
    severity,
    keySignals: [...new Set(keySignals)], // Dedupe
    patternMatches: [...new Set(patternMatches)],
    suggestedFocus,
    testAnalysis: {
      totalTests,
      passedTests,
      failedTests,
      hiddenTestsFailed,
      commonPattern: failedTests > 0 ? analyzeTestDiffs(testResults).pattern : null,
    },
  }
}

/**
 * Get a human-readable summary of the classification
 */
export function getClassificationSummary(classification: ClassificationOutput): string {
  const { category, severity, keySignals, testAnalysis } = classification

  const categoryDescriptions: Record<MentorErrorCategory, string> = {
    SYNTAX: "Syntax Error",
    LOGIC: "Logic Error",
    EDGE_CASE: "Edge Case Not Handled",
    TIMEOUT: "Time Limit Exceeded",
    OUTPUT_FORMAT: "Output Format Issue",
    NULL_HANDLING: "Null/Empty Handling Issue",
    OFF_BY_ONE: "Off-by-One Error",
    TYPE_ERROR: "Type Error",
    RUNTIME_ERROR: "Runtime Error",
    OTHER: "Unknown Error",
  }

  const severityLabels = ["", "Minor", "Moderate", "Significant", "Major", "Critical"]

  let summary = `${categoryDescriptions[category]} (${severityLabels[severity]})`

  if (testAnalysis.totalTests > 0) {
    summary += `\nTests: ${testAnalysis.passedTests}/${testAnalysis.totalTests} passed`
  }

  if (keySignals.length > 0) {
    summary += `\nSignals: ${keySignals.slice(0, 3).join(", ")}`
  }

  return summary
}
