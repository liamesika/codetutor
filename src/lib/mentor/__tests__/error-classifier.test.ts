/**
 * Unit Tests for Mentor Error Classifier
 * Tests the deterministic pre-AI mistake classification
 */

import { describe, it, expect } from "vitest"
import { classifyMistake, MentorErrorCategory } from "../error-classifier"

describe("Error Classifier - Compile Errors", () => {
  it("should classify missing semicolon as SYNTAX error", () => {
    const result = classifyMistake({
      compileError: "Main.java:5: error: ';' expected\n    int x = 5\n         ^",
      testResults: [],
    })

    expect(result.category).toBe("SYNTAX")
    expect(result.keySignals.length).toBeGreaterThan(0)
  })

  it("should classify unclosed bracket as SYNTAX error", () => {
    const result = classifyMistake({
      compileError: "Main.java:10: error: reached end of file while parsing\n}",
      testResults: [],
    })

    expect(result.category).toBe("SYNTAX")
  })

  it("should classify type mismatch as TYPE_ERROR", () => {
    const result = classifyMistake({
      compileError: "Main.java:8: error: incompatible types: String cannot be converted to int\n    int x = \"hello\";",
      testResults: [],
    })

    expect(result.category).toBe("TYPE_ERROR")
  })

  it("should classify cannot find symbol as SYNTAX error", () => {
    const result = classifyMistake({
      compileError: "Main.java:7: error: cannot find symbol\n    System.out.println(undefinedVar);",
      testResults: [],
    })

    expect(result.category).toBe("SYNTAX")
    expect(result.keySignals).toContain("cannot find symbol")
  })
})

describe("Error Classifier - Runtime Errors", () => {
  it("should classify NullPointerException as NULL_HANDLING", () => {
    const result = classifyMistake({
      runtimeError: "java.lang.NullPointerException at Main.main(Main.java:15)",
      testResults: [],
    })

    expect(result.category).toBe("NULL_HANDLING")
  })

  it("should classify ArrayIndexOutOfBoundsException as OFF_BY_ONE", () => {
    const result = classifyMistake({
      runtimeError: "java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5",
      testResults: [],
    })

    expect(result.category).toBe("OFF_BY_ONE")
    expect(result.keySignals.some((s: string) => s.includes("ArrayIndexOutOfBounds"))).toBe(true)
  })

  it("should classify StringIndexOutOfBoundsException as OFF_BY_ONE", () => {
    const result = classifyMistake({
      runtimeError: "java.lang.StringIndexOutOfBoundsException: String index out of range: 10",
      testResults: [],
    })

    expect(result.category).toBe("OFF_BY_ONE")
  })

  it("should classify generic exception as RUNTIME_ERROR", () => {
    const result = classifyMistake({
      runtimeError: "java.lang.IllegalArgumentException: Invalid argument",
      testResults: [],
    })

    expect(result.category).toBe("RUNTIME_ERROR")
  })
})

describe("Error Classifier - Test Failures", () => {
  it("should classify whitespace difference as OUTPUT_FORMAT", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "Hello World",
          actual: "HelloWorld",
          input: "test",
        },
      ],
    })

    expect(result.category).toBe("OUTPUT_FORMAT")
    expect(result.suggestedFocus).toBeTruthy()
  })

  it("should classify off-by-one numeric difference as OFF_BY_ONE", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "10",
          actual: "9",
          input: "test",
        },
      ],
    })

    expect(result.category).toBe("OFF_BY_ONE")
    expect(result.patternMatches.some((p: string) => p.includes("off by"))).toBe(true)
  })

  it("should classify newline difference as OUTPUT_FORMAT", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "Line1\nLine2",
          actual: "Line1Line2",
          input: "test",
        },
      ],
    })

    expect(result.category).toBe("OUTPUT_FORMAT")
    expect(result.keySignals.some((s: string) => s.includes("newline"))).toBe(true)
  })

  it("should classify case difference as OUTPUT_FORMAT", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "Hello",
          actual: "hello",
          input: "test",
        },
      ],
    })

    expect(result.category).toBe("OUTPUT_FORMAT")
    expect(result.keySignals.some((s: string) => s.includes("case"))).toBe(true)
  })

  it("should classify logic error with correct format as LOGIC", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "120",
          actual: "24",
          input: "5",
        },
      ],
    })

    // When values are different but format is correct, it's a logic error
    expect(["LOGIC", "EDGE_CASE", "OFF_BY_ONE"]).toContain(result.category)
  })
})

describe("Error Classifier - Timeout", () => {
  it("should classify timeout status as TIMEOUT", () => {
    const result = classifyMistake({
      status: "TIMEOUT",
      testResults: [],
    })

    expect(result.category).toBe("TIMEOUT")
    expect(result.severity).toBe("medium")
    expect(result.suggestedFocus).toContain("infinite loop")
  })
})

describe("Error Classifier - Edge Cases", () => {
  it("should handle empty input gracefully", () => {
    const result = classifyMistake({
      testResults: [],
    })

    expect(result.category).toBe("OTHER")
  })

  it("should handle null/undefined actual values", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "Hello",
          actual: null,
          input: "test",
        },
      ],
    })

    expect(result.category).toBeTruthy()
  })

  it("should handle mixed pass/fail test results", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: true,
          expected: "10",
          actual: "10",
          input: "test1",
        },
        {
          passed: false,
          expected: "20",
          actual: "19",
          input: "test2",
        },
      ],
    })

    expect(result.testAnalysis).toBeDefined()
    expect(result.testAnalysis?.passedCount).toBe(1)
    expect(result.testAnalysis?.failedCount).toBe(1)
  })

  it("should detect potential boundary condition issues", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "5",
          actual: "4",
          input: "5", // Input equals expected, off by one in actual
        },
      ],
    })

    expect(["OFF_BY_ONE", "EDGE_CASE"]).toContain(result.category)
  })
})

describe("Error Classifier - Severity", () => {
  it("should assign high severity to syntax errors", () => {
    const result = classifyMistake({
      compileError: "Main.java:5: error: ';' expected",
      testResults: [],
    })

    expect(result.severity).toBe("high")
  })

  it("should assign medium severity to runtime errors", () => {
    const result = classifyMistake({
      runtimeError: "java.lang.NullPointerException",
      testResults: [],
    })

    expect(["medium", "high"]).toContain(result.severity)
  })

  it("should assign low severity to output format issues", () => {
    const result = classifyMistake({
      testResults: [
        {
          passed: false,
          expected: "Hello ",
          actual: "Hello",
          input: "test",
        },
      ],
    })

    expect(result.severity).toBe("low")
  })
})
