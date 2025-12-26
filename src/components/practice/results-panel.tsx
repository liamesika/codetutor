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
    borderColor: "border-green-500/40",
    glowClass: "success-glow",
  },
  FAIL: {
    label: "Some Tests Failed",
    color: "text-red-500",
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/40",
    glowClass: "error-glow",
  },
  COMPILE_ERROR: {
    label: "Compilation Error",
    color: "text-amber-500",
    icon: Code2,
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/40",
    glowClass: "",
  },
  RUNTIME_ERROR: {
    label: "Runtime Error",
    color: "text-orange-500",
    icon: AlertTriangle,
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/40",
    glowClass: "",
  },
  TIMEOUT: {
    label: "Time Limit Exceeded",
    color: "text-yellow-500",
    icon: Clock,
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/40",
    glowClass: "",
  },
  MEMORY_EXCEEDED: {
    label: "Memory Limit Exceeded",
    color: "text-purple-500",
    icon: MemoryStick,
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
    glowClass: "",
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

  if (!result) {
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

  const config = statusConfig[result.status]
  const StatusIcon = config.icon
  const passedTests = result.testResults?.filter((t) => t.passed).length || 0
  const totalTests = result.testResults?.length || 0

  return (
    <ScrollArea className="h-full scrollbar-thin">
      <div className="p-4 md:p-6 space-y-6">
        {/* Status header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-5 rounded-2xl border-2",
            config.bgColor,
            config.borderColor,
            config.glowClass
          )}
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className={cn(
                "h-14 w-14 rounded-xl flex items-center justify-center",
                result.status === "PASS" ? "bg-green-500" : "bg-muted/50"
              )}
            >
              <StatusIcon
                className={cn(
                  "h-7 w-7",
                  result.status === "PASS" ? "text-white" : config.color
                )}
              />
            </motion.div>
            <div className="flex-1">
              <h2 className={cn("text-xl font-bold", config.color)}>
                {config.label}
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
                {result.status === "PASS" && result.pointsEarned > 0 && (
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
            <motion.button
              onClick={onNextQuestion}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "px-6 py-3 rounded-xl font-semibold text-white",
                "gradient-neon shadow-lg",
                "hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300"
              )}
            >
              Next Question
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          ) : (
            <>
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

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="w-full gap-2 neon-border hover:neon-glow transition-all duration-300"
                  size="lg"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </ScrollArea>
  )
}
