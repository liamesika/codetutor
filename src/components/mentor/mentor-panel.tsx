"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Brain,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Sparkles,
  Target,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TestResult {
  testIndex: number
  input: string
  expected: string
  actual: string | null
  passed: boolean
  error: string | null
  isHidden?: boolean
}

interface MentorPanelProps {
  questionId: string
  assignmentId?: string
  code: string
  testResults: TestResult[]
  compileError: string | null
  runtimeError: string | null
  stderr: string | null
  executionMs: number | null
  status: string
  className?: string
  onClose?: () => void
}

interface MentorResponse {
  errorCategory: string
  shortDiagnosis: string
  reasoningHint: string
  guidingQuestions: string[]
  progressiveHints: string[]
  nextActions: string[]
  confidence: number
  testAnalysis: {
    totalTests: number
    passedTests: number
    failedTests: number
    hiddenTestsFailed: boolean
    commonPattern: string | null
  }
}

const categoryColors: Record<string, string> = {
  SYNTAX: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  LOGIC: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  EDGE_CASE: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  TIMEOUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  OUTPUT_FORMAT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  NULL_HANDLING: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  OFF_BY_ONE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  TYPE_ERROR: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  RUNTIME_ERROR: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  OTHER: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
}

const categoryLabels: Record<string, string> = {
  SYNTAX: "Syntax Error",
  LOGIC: "Logic Error",
  EDGE_CASE: "Edge Case",
  TIMEOUT: "Timeout",
  OUTPUT_FORMAT: "Output Format",
  NULL_HANDLING: "Null Handling",
  OFF_BY_ONE: "Off-by-One",
  TYPE_ERROR: "Type Error",
  RUNTIME_ERROR: "Runtime Error",
  OTHER: "Other",
}

export function MentorPanel({
  questionId,
  assignmentId,
  code,
  testResults,
  compileError,
  runtimeError,
  stderr,
  executionMs,
  status,
  className,
  onClose,
}: MentorPanelProps) {
  const [revealedHints, setRevealedHints] = useState<number>(0)

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/mentor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          assignmentId,
          code,
          testResults,
          compileError,
          runtimeError,
          stderr,
          executionMs,
          status,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to get mentor feedback")
      }

      return res.json() as Promise<MentorResponse>
    },
  })

  const handleAskMentor = () => {
    setRevealedHints(0)
    mutation.mutate()
  }

  const revealNextHint = () => {
    if (mutation.data && revealedHints < mutation.data.progressiveHints.length) {
      setRevealedHints((prev) => prev + 1)
    }
  }

  return (
    <Card className={cn("border-purple-200 dark:border-purple-800 overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">AI Mentor</CardTitle>
              <p className="text-xs text-muted-foreground">Get personalized help</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Initial state - Ask Mentor button */}
        {!mutation.data && !mutation.isPending && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Stuck? Get guided feedback without revealing the solution.
            </p>
            <Button
              onClick={handleAskMentor}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              Ask Mentor
            </Button>
          </div>
        )}

        {/* Loading state */}
        {mutation.isPending && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Analyzing your code...</p>
          </div>
        )}

        {/* Error state */}
        {mutation.isError && (
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              {mutation.error instanceof Error ? mutation.error.message : "Failed to get feedback"}
            </p>
            <Button variant="outline" size="sm" onClick={handleAskMentor}>
              Try Again
            </Button>
          </div>
        )}

        {/* Response content */}
        <AnimatePresence mode="wait">
          {mutation.data && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Category badge & test summary */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge className={cn("text-xs", categoryColors[mutation.data.errorCategory])}>
                  {categoryLabels[mutation.data.errorCategory] || mutation.data.errorCategory}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {mutation.data.testAnalysis.passedTests}/{mutation.data.testAnalysis.totalTests} tests passed
                </span>
              </div>

              {/* Short diagnosis */}
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <p className="text-sm font-medium">{mutation.data.shortDiagnosis}</p>
              </div>

              {/* Reasoning hint */}
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                    Thinking Direction
                  </p>
                  <p className="text-sm text-muted-foreground">{mutation.data.reasoningHint}</p>
                </div>
              </div>

              {/* Guiding questions */}
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">
                    Ask Yourself
                  </p>
                  <ul className="space-y-2">
                    {mutation.data.guidingQuestions.map((q, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Progressive hints accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="hints" className="border-green-200 dark:border-green-800">
                  <AccordionTrigger className="text-sm py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-green-500" />
                      <span>Progressive Hints ({revealedHints}/{mutation.data.progressiveHints.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    {mutation.data.progressiveHints.map((hint, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: i < revealedHints ? 1 : 0.3,
                          height: "auto",
                        }}
                        className={cn(
                          "p-3 rounded-lg border text-sm",
                          i < revealedHints
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-muted/50 border-transparent cursor-pointer"
                        )}
                        onClick={() => i === revealedHints && revealNextHint()}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">
                            Hint {i + 1}:
                          </span>
                          {i < revealedHints ? (
                            <span>{hint}</span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Click to reveal...
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {revealedHints < mutation.data.progressiveHints.length && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={revealNextHint}
                        className="w-full gap-2"
                      >
                        <Lightbulb className="h-4 w-4" />
                        Reveal Hint {revealedHints + 1}
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Next actions */}
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <Target className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-2">
                    Next Steps
                  </p>
                  <ul className="space-y-1.5">
                    {mutation.data.nextActions.map((action, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ask again button */}
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAskMentor}
                  className="w-full gap-2 text-muted-foreground"
                >
                  <Sparkles className="h-4 w-4" />
                  Ask Again (after changes)
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Compact version for inline use
export function MentorButton({
  onClick,
  isLoading,
  disabled,
  className,
}: {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant="outline"
      size="sm"
      className={cn(
        "gap-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Brain className="h-4 w-4 text-purple-500" />
      )}
      {isLoading ? "Analyzing..." : "Ask Mentor"}
    </Button>
  )
}
