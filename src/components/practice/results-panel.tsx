"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Code2,
  Terminal,
  ChevronRight,
  MemoryStick,
  AlertCircle,
  Loader2,
  Home,
  RefreshCw,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TestResult {
  testIndex: number
  input: string
  expected: string
  actual: string | null
  passed: boolean
  error: string | null
  isHidden?: boolean
}

interface ExecutionResult {
  status: "PASS" | "FAIL" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIMEOUT" | "MEMORY_EXCEEDED"
  stdout: string | null
  stderr: string | null
  compileError: string | null
  executionMs: number | null
  testResults: TestResult[]
  pointsEarned: number
  summary?: {
    totalTests: number
    passedTests: number
    allPassed: boolean
    anyFailed: boolean
  }
}

interface ResultsPanelProps {
  result: ExecutionResult | null
  isLoading?: boolean
  onNextQuestion?: () => void
  onRetryNext?: () => void
  onRetry?: () => void
  onViewHint?: () => void
  onBackToWeek?: () => void
  nextError?: string | null
  isLoadingNext?: boolean
}

// Derive state from result - SINGLE SOURCE OF TRUTH
type ResultState = "SUCCESS" | "FAILURE" | "NO_TESTS" | "LOADING" | "EMPTY"

function deriveResultState(result: ExecutionResult | null, isLoading?: boolean): ResultState {
  if (isLoading) return "LOADING"
  if (!result) return "EMPTY"

  const totalTests = result.testResults?.length ?? 0
  const passedTests = result.testResults?.filter(t => t.passed).length ?? 0

  // No tests available
  if (totalTests === 0) return "NO_TESTS"

  // All tests passed = SUCCESS (regardless of status field)
  if (passedTests === totalTests) return "SUCCESS"

  // Any test failed or error = FAILURE
  return "FAILURE"
}

export function ResultsPanel({
  result,
  isLoading,
  onNextQuestion,
  onRetryNext,
  onRetry,
  onViewHint,
  onBackToWeek,
  nextError,
  isLoadingNext,
}: ResultsPanelProps) {
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const state = deriveResultState(result, isLoading)

  // Derive test counts from actual test results
  const totalTests = result?.testResults?.length ?? 0
  const passedTests = result?.testResults?.filter(t => t.passed).length ?? 0

  // Focus Next Question button on success for keyboard users
  useEffect(() => {
    if (state === "SUCCESS" && nextButtonRef.current && !nextError && !isLoadingNext) {
      // Small delay to ensure animation completes
      const timer = setTimeout(() => {
        nextButtonRef.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [state, nextError, isLoadingNext])

  // ============================================
  // STATE: LOADING
  // ============================================
  if (state === "LOADING") {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-muted/30" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Code2 className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-lg">Running your code...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Compiling and executing tests
            </p>
          </div>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // ============================================
  // STATE: EMPTY (no result yet)
  // ============================================
  if (state === "EMPTY") {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-20 h-20 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto neon-border">
            <Terminal className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Ready to Run</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Click <span className="text-primary font-medium">&quot;Run&quot;</span> to test your output or{" "}
              <span className="gradient-neon-text font-medium">&quot;Check Solution&quot;</span> to
              submit against all test cases.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============================================
  // STATE: NO_TESTS (degraded state)
  // ============================================
  if (state === "NO_TESTS") {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="h-10 w-10 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-amber-500">No Tests Available</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              This question doesn&apos;t have test cases configured.
              Please report this issue or go back to the dashboard.
            </p>
          </div>
          {/* Output section if available */}
          {(result?.stdout || result?.stderr) && (
            <Card className="text-left mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result?.stdout && (
                  <pre className="text-sm overflow-x-auto p-3 bg-muted rounded-lg whitespace-pre-wrap font-mono">
                    {result.stdout}
                  </pre>
                )}
                {result?.stderr && (
                  <pre className="text-sm overflow-x-auto p-3 bg-destructive/10 rounded-lg text-destructive whitespace-pre-wrap font-mono">
                    {result.stderr}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}
          <Button
            variant="outline"
            onClick={onBackToWeek}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Week
          </Button>
        </motion.div>
      </div>
    )
  }

  // ============================================
  // STATE: SUCCESS (all tests passed)
  // ============================================
  if (state === "SUCCESS" && result) {
    return (
      <ScrollArea className="h-full scrollbar-thin">
        <div className="p-4 md:p-6 space-y-6 pb-safe">
          {/* Success Header with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-5 rounded-2xl border-2 overflow-hidden bg-green-500/10 border-green-500/40"
          >
            {/* Animated success glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Success pulse effect */}
            <motion.div
              className="absolute inset-0 bg-green-500/10 rounded-2xl"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            <div className="relative flex items-center gap-4">
              {/* Success icon with bounce */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 bg-green-500"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                >
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </motion.div>
              </motion.div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-green-500">
                  All Tests Passed!
                </h2>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-500 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    {passedTests}/{totalTests} tests
                  </Badge>
                  {result.executionMs !== null && (
                    <Badge variant="outline" className="gap-1 border-border/50">
                      <Clock className="h-3 w-3" />
                      {result.executionMs}ms
                    </Badge>
                  )}
                  {result.pointsEarned > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      <Badge className="gap-1 gradient-neon text-white">
                        <Zap className="h-3 w-3" />
                        +{result.pointsEarned} XP
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Output section (stdout only, no stderr emphasis on success) */}
          {result.stdout && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm overflow-x-auto p-3 bg-muted rounded-lg whitespace-pre-wrap font-mono">
                    {result.stdout}
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Test Results (collapsed view for success) */}
          {result.testResults && result.testResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    Test Results
                  </h3>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    {passedTests}/{totalTests} passed
                  </Badge>
                </div>

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {result.testResults.map((test, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border border-green-500/30 bg-green-500/5">
                          <CardHeader className="py-3 pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Test Case {index + 1}
                                {test.isHidden && (
                                  <Badge variant="outline" className="text-xs">
                                    Hidden
                                  </Badge>
                                )}
                              </CardTitle>
                              <Badge className="text-xs bg-green-500/20 text-green-500">
                                PASSED
                              </Badge>
                            </div>
                          </CardHeader>
                          {!test.isHidden && (
                            <CardContent className="py-2 space-y-2 text-sm">
                              {test.input && (
                                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                  <span className="text-muted-foreground">Input:</span>
                                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                                    {test.input || "(none)"}
                                  </code>
                                </div>
                              )}
                              <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                <span className="text-muted-foreground">Expected:</span>
                                <code className="bg-muted px-2 py-1 rounded font-mono text-xs whitespace-pre-wrap">
                                  {test.expected}
                                </code>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Primary CTA: Next Question - STICKY on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pb-4 -mb-4 space-y-3"
          >
            {/* Error state for Next button */}
            {nextError && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <span className="text-sm text-destructive">{nextError}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetryNext}
                    className="shrink-0 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            <motion.button
              ref={nextButtonRef}
              onClick={onNextQuestion}
              disabled={isLoadingNext}
              whileHover={{ scale: isLoadingNext ? 1 : 1.02 }}
              whileTap={{ scale: isLoadingNext ? 1 : 0.98 }}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "px-6 py-4 rounded-xl font-semibold text-white",
                "gradient-neon shadow-lg",
                "hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
            >
              {isLoadingNext ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading Next...
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>

            {/* Secondary: Back to Week (only show if no error) */}
            {!nextError && onBackToWeek && (
              <Button
                variant="ghost"
                onClick={onBackToWeek}
                className="w-full gap-2 text-muted-foreground"
                size="sm"
              >
                <Home className="h-4 w-4" />
                Back to Week
              </Button>
            )}
          </motion.div>
        </div>
      </ScrollArea>
    )
  }

  // ============================================
  // STATE: FAILURE (any test failed or error)
  // ============================================
  if (state === "FAILURE" && result) {
    const isCompileError = result.status === "COMPILE_ERROR" || !!result.compileError
    const isRuntimeError = result.status === "RUNTIME_ERROR"
    const isTimeout = result.status === "TIMEOUT"
    const isMemoryExceeded = result.status === "MEMORY_EXCEEDED"

    // Determine header config based on error type
    let headerLabel = "Some Tests Failed"
    let headerColor = "text-red-500"
    let headerBg = "bg-red-500/10"
    let headerBorder = "border-red-500/40"
    let HeaderIcon = XCircle
    let iconBg = "bg-red-500/20"

    if (isCompileError) {
      headerLabel = "Compilation Error"
      headerColor = "text-amber-500"
      headerBg = "bg-amber-500/10"
      headerBorder = "border-amber-500/40"
      HeaderIcon = Code2
      iconBg = "bg-amber-500/20"
    } else if (isRuntimeError) {
      headerLabel = "Runtime Error"
      headerColor = "text-orange-500"
      headerBg = "bg-orange-500/10"
      headerBorder = "border-orange-500/40"
      HeaderIcon = AlertTriangle
      iconBg = "bg-orange-500/20"
    } else if (isTimeout) {
      headerLabel = "Time Limit Exceeded"
      headerColor = "text-yellow-500"
      headerBg = "bg-yellow-500/10"
      headerBorder = "border-yellow-500/40"
      HeaderIcon = Clock
      iconBg = "bg-yellow-500/20"
    } else if (isMemoryExceeded) {
      headerLabel = "Memory Limit Exceeded"
      headerColor = "text-purple-500"
      headerBg = "bg-purple-500/10"
      headerBorder = "border-purple-500/40"
      HeaderIcon = MemoryStick
      iconBg = "bg-purple-500/20"
    }

    // Sort tests: failed first
    const sortedTests = [...(result.testResults || [])].sort((a, b) => {
      if (a.passed === b.passed) return 0
      return a.passed ? 1 : -1
    })

    return (
      <ScrollArea className="h-full scrollbar-thin">
        <div className="p-4 md:p-6 space-y-6 pb-safe">
          {/* Failure Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative p-5 rounded-2xl border-2 overflow-hidden",
              headerBg,
              headerBorder
            )}
          >
            <div className="relative flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className={cn("h-14 w-14 rounded-xl flex items-center justify-center shrink-0", iconBg)}
              >
                <HeaderIcon className={cn("h-7 w-7", headerColor)} />
              </motion.div>

              <div className="flex-1">
                <h2 className={cn("text-xl font-bold", headerColor)}>
                  {headerLabel}
                </h2>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="gap-1 bg-background/50">
                    <CheckCircle2 className="h-3 w-3" />
                    {passedTests}/{totalTests} tests
                  </Badge>
                  {result.executionMs !== null && (
                    <Badge variant="outline" className="gap-1 border-border/50">
                      <Clock className="h-3 w-3" />
                      {result.executionMs}ms
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Compile error with helpful info */}
          {result.compileError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="border-amber-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Compilation Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm overflow-x-auto p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg whitespace-pre-wrap font-mono text-amber-200">
                    {result.compileError}
                  </pre>
                </CardContent>
              </Card>

              {/* How to fix section */}
              <Card className="border-muted">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">How to Fix</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Check the error message for the line number and error type.
                    Common issues include:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Missing semicolons at the end of statements
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Unmatched brackets or parentheses
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Typos in variable or method names
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Runtime output - stderr prominently displayed */}
          {(result.stdout || result.stderr) && !result.compileError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Show stderr first (prominently) on failure */}
                  {result.stderr && (
                    <div>
                      <p className="text-xs text-destructive mb-1 font-medium">stderr:</p>
                      <pre className="text-sm overflow-x-auto p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive whitespace-pre-wrap font-mono">
                        {result.stderr}
                      </pre>
                    </div>
                  )}
                  {result.stdout && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">stdout:</p>
                      <pre className="text-sm overflow-x-auto p-3 bg-muted rounded-lg whitespace-pre-wrap font-mono">
                        {result.stdout}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Test results - failed tests first */}
          {sortedTests.length > 0 && !result.compileError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    Test Results
                  </h3>
                  <Badge variant="secondary">
                    {passedTests}/{totalTests} passed
                  </Badge>
                </div>

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {sortedTests.map((test, index) => (
                      <motion.div
                        key={test.testIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={cn(
                            "border",
                            test.passed
                              ? "border-green-500/30 bg-green-500/5"
                              : "border-red-500/30 bg-red-500/5"
                          )}
                        >
                          <CardHeader className="py-3 pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                {test.passed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                Test Case {test.testIndex + 1}
                                {test.isHidden && (
                                  <Badge variant="outline" className="text-xs">
                                    Hidden
                                  </Badge>
                                )}
                              </CardTitle>
                              <Badge
                                variant={test.passed ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {test.passed ? "PASSED" : "FAILED"}
                              </Badge>
                            </div>
                          </CardHeader>
                          {!test.isHidden && (
                            <CardContent className="py-2 space-y-2 text-sm">
                              {test.input && (
                                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                  <span className="text-muted-foreground">Input:</span>
                                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                                    {test.input || "(none)"}
                                  </code>
                                </div>
                              )}
                              <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                <span className="text-muted-foreground">Expected:</span>
                                <code className="bg-muted px-2 py-1 rounded font-mono text-xs whitespace-pre-wrap">
                                  {test.expected}
                                </code>
                              </div>
                              {!test.passed && test.actual !== null && (
                                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                  <span className="text-red-500">Actual:</span>
                                  <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded font-mono text-xs whitespace-pre-wrap">
                                    {test.actual || "(empty)"}
                                  </code>
                                </div>
                              )}
                              {test.error && (
                                <div className="text-red-400 text-xs mt-2 flex items-start gap-2">
                                  <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                                  {test.error}
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action buttons - sticky on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4 space-y-4 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pb-4 -mb-4"
          >
            {/* Next steps guidance */}
            <Card className="border-border/50 bg-accent/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Next Steps</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">1</span>
                    Review the failing test cases above
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">2</span>
                    Compare expected vs actual output
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">3</span>
                    Check for edge cases and off-by-one errors
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Primary CTA: Try Again */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onRetry}
                variant="outline"
                className="w-full gap-2 neon-border hover:neon-glow transition-all duration-300 py-6"
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </motion.div>

            {/* Secondary CTA: View Hint */}
            {onViewHint && (
              <Button
                onClick={onViewHint}
                variant="ghost"
                className="w-full gap-2 text-muted-foreground"
                size="sm"
              >
                <Lightbulb className="h-4 w-4" />
                View Hint
              </Button>
            )}
          </motion.div>
        </div>
      </ScrollArea>
    )
  }

  // Fallback (should never reach)
  return null
}
