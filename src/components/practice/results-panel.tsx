"use client"

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
}

interface ResultsPanelProps {
  result: ExecutionResult | null
  isLoading?: boolean
  onNextQuestion?: () => void
  onRetry?: () => void
}

const statusConfig = {
  PASS: {
    label: "All Tests Passed!",
    color: "text-green-500",
    icon: CheckCircle2,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  FAIL: {
    label: "Some Tests Failed",
    color: "text-red-500",
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  COMPILE_ERROR: {
    label: "Compilation Error",
    color: "text-amber-500",
    icon: Code2,
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  RUNTIME_ERROR: {
    label: "Runtime Error",
    color: "text-orange-500",
    icon: AlertTriangle,
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  TIMEOUT: {
    label: "Time Limit Exceeded",
    color: "text-yellow-500",
    icon: Clock,
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  MEMORY_EXCEEDED: {
    label: "Memory Limit Exceeded",
    color: "text-purple-500",
    icon: MemoryStick,
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
}

export function ResultsPanel({
  result,
  isLoading,
  onNextQuestion,
  onRetry,
}: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div>
            <p className="font-medium">Running your code...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Compiling and executing tests
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
            <Terminal className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Ready to Run</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click &quot;Run Code&quot; to test your output or &quot;Check&quot; to
              submit against all test cases.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const config = statusConfig[result.status]
  const StatusIcon = config.icon
  const passedTests = result.testResults?.filter((t) => t.passed).length || 0
  const totalTests = result.testResults?.length || 0

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        {/* Status header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-xl border-2",
            config.bgColor,
            config.borderColor
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                result.status === "PASS" ? "bg-green-500" : "bg-muted"
              )}
            >
              <StatusIcon
                className={cn(
                  "h-6 w-6",
                  result.status === "PASS" ? "text-white" : config.color
                )}
              />
            </div>
            <div className="flex-1">
              <h2 className={cn("text-lg font-bold", config.color)}>
                {config.label}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {passedTests}/{totalTests} tests
                </Badge>
                {result.executionMs !== null && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {result.executionMs}ms
                  </Badge>
                )}
                {result.status === "PASS" && result.pointsEarned > 0 && (
                  <Badge className="gap-1 bg-primary">
                    <Zap className="h-3 w-3" />
                    +{result.pointsEarned} XP
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

        {/* Runtime output */}
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
                {result.stdout && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">stdout:</p>
                    <pre className="text-sm overflow-x-auto p-3 bg-muted rounded-lg whitespace-pre-wrap font-mono">
                      {result.stdout}
                    </pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <p className="text-xs text-destructive mb-1">stderr:</p>
                    <pre className="text-sm overflow-x-auto p-3 bg-destructive/10 rounded-lg text-destructive whitespace-pre-wrap font-mono">
                      {result.stderr}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Test results */}
        {result.testResults && result.testResults.length > 0 && !result.compileError && (
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
                <Badge
                  variant={passedTests === totalTests ? "default" : "secondary"}
                >
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
                              Test Case {index + 1}
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

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4 space-y-4"
        >
          {result.status === "PASS" ? (
            <Button onClick={onNextQuestion} className="w-full gap-2" size="lg">
              Next Question
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              {/* Next steps guidance */}
              <Card className="border-muted bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Next Steps</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">1.</span>
                      Review the failing test cases above
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">2.</span>
                      Compare expected vs actual output
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">3.</span>
                      Check for edge cases and off-by-one errors
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={onRetry}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </ScrollArea>
  )
}
