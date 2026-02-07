"use client"

import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Crown,
  Zap,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
  questionTitle: string
  questionPrompt: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

const MAX_FOLLOWUPS = 10

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
  SYNTAX: "שגיאת תחביר",
  LOGIC: "שגיאת לוגיקה",
  EDGE_CASE: "מקרה קצה",
  TIMEOUT: "חריגת זמן",
  OUTPUT_FORMAT: "פורמט פלט",
  NULL_HANDLING: "טיפול ב-null",
  OFF_BY_ONE: "שגיאת Off-by-One",
  TYPE_ERROR: "שגיאת טיפוס",
  RUNTIME_ERROR: "שגיאת ריצה",
  OTHER: "אחר",
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
  const [proRequired, setProRequired] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Reset chat when code changes (new submission)
  useEffect(() => {
    setChatMessages([])
    setChatInput("")
  }, [code])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages])

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

      if (res.status === 403) {
        const data = await res.json()
        if (data.code === "PRO_REQUIRED") {
          setProRequired(true)
          throw new Error("PRO_REQUIRED")
        }
      }

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to get mentor feedback")
      }

      return res.json() as Promise<MentorResponse>
    },
  })

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Build history: initial analysis summary + all follow-ups
      const history: { role: "user" | "assistant"; content: string }[] = []

      if (mutation.data) {
        history.push({
          role: "assistant",
          content: `אבחון: ${mutation.data.shortDiagnosis}\nכיוון חשיבה: ${mutation.data.reasoningHint}\nשאלות מנחות: ${mutation.data.guidingQuestions.join(", ")}`,
        })
      }

      for (const msg of chatMessages) {
        history.push({ role: msg.role, content: msg.content })
      }

      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          message,
          code,
          questionTitle: mutation.data?.questionTitle || "",
          questionPrompt: mutation.data?.questionPrompt || "",
          history,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to get response")
      }

      return res.json() as Promise<{ message: string }>
    },
    onSuccess: (data, message) => {
      setChatMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: message },
        { id: crypto.randomUUID(), role: "assistant", content: data.message },
      ])
      setChatInput("")
    },
  })

  const handleAskMentor = () => {
    setRevealedHints(0)
    setChatMessages([])
    setChatInput("")
    mutation.mutate()
  }

  const revealNextHint = () => {
    if (mutation.data && revealedHints < mutation.data.progressiveHints.length) {
      setRevealedHints((prev) => prev + 1)
    }
  }

  const handleSendChat = () => {
    const msg = chatInput.trim()
    if (msg && !chatMutation.isPending) {
      chatMutation.mutate(msg)
    }
  }

  const userFollowUpCount = Math.floor(chatMessages.length / 2)

  return (
    <Card className={cn("border-purple-200 dark:border-purple-800 overflow-hidden", className)} dir="rtl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">AI Mentor</CardTitle>
              <p className="text-xs text-muted-foreground">קבלו עזרה מותאמת אישית</p>
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
        {/* PRO upgrade prompt */}
        {proRequired && (
          <div className="text-center py-6">
            <motion.div
              className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(79, 70, 229, 0.2) 100%)",
                boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
              }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 40px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="h-8 w-8 text-purple-400" />
            </motion.div>
            <h3 className="text-lg font-bold mb-2">AI Mentor הוא פיצ&#39;ר PRO</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-xs mx-auto">
              שדרגו ל-PRO כדי לקבל משוב מותאם אישית מבוסס AI,
              רמזים מדורגים, וניפוי באגים מודרך לכל שאלה.
            </p>
            <div className="space-y-2 mb-6 text-right max-w-xs mx-auto">
              {[
                "אבחון שגיאות מותאם אישית",
                "רמזים מדורגים (בלי ספוילרים)",
                "שאלות חשיבה מנחות",
                "גישה לכל 10 הימים + בחינות",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
            <Link href="/pricing">
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full">
                <Crown className="h-4 w-4" />
                שדרגו ל-PRO
              </Button>
            </Link>
          </div>
        )}

        {/* Initial state - Ask Mentor button */}
        {!proRequired && !mutation.data && !mutation.isPending && !mutation.isError && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              תקועים? קבלו משוב מכוון בלי לחשוף את הפתרון.
            </p>
            <Button
              onClick={handleAskMentor}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              שאלו את המנטור
            </Button>
          </div>
        )}

        {/* Loading state */}
        {!proRequired && mutation.isPending && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">מנתח את הקוד שלכם...</p>
          </div>
        )}

        {/* Error state */}
        {!proRequired && mutation.isError && (
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              {mutation.error instanceof Error ? mutation.error.message : "שגיאה בקבלת משוב"}
            </p>
            <Button variant="outline" size="sm" onClick={handleAskMentor}>
              נסו שוב
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
                <span className="text-xs text-muted-foreground" dir="ltr">
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
                    כיוון חשיבה
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
                    שאלו את עצמכם
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
                      <span>רמזים מדורגים ({revealedHints}/{mutation.data.progressiveHints.length})</span>
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
                            רמז {i + 1}:
                          </span>
                          {i < revealedHints ? (
                            <span>{hint}</span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              לחצו לחשיפה...
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
                        גלה רמז {revealedHints + 1}
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
                    צעדים הבאים
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
                  שאלו שוב (אחרי שינויים)
                </Button>
              </div>

              {/* Follow-up Chat Section */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">
                  יש שאלות המשך? דברו עם המנטור
                </p>

                {/* Chat messages */}
                {chatMessages.length > 0 && (
                  <div
                    ref={chatScrollRef}
                    className="max-h-72 overflow-y-auto space-y-2 scroll-smooth"
                  >
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "p-3 rounded-lg text-sm max-w-[85%]",
                          msg.role === "user"
                            ? "bg-purple-100 dark:bg-purple-900/30 ms-auto"
                            : "bg-muted me-auto"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Chat loading */}
                {chatMutation.isPending && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>חושב...</span>
                  </div>
                )}

                {/* Chat error */}
                {chatMutation.isError && (
                  <p className="text-xs text-red-500">
                    {chatMutation.error instanceof Error ? chatMutation.error.message : "שגיאה"}
                  </p>
                )}

                {/* Chat input */}
                {userFollowUpCount < MAX_FOLLOWUPS && (
                  <div className="flex gap-2">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="שאלו שאלת המשך..."
                      className="min-h-[40px] max-h-24 resize-none text-sm"
                      dir="rtl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendChat()
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleSendChat}
                      disabled={!chatInput.trim() || chatMutation.isPending}
                      className="shrink-0 h-10 w-10"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Follow-up counter */}
                {chatMessages.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    {userFollowUpCount}/{MAX_FOLLOWUPS} שאלות המשך
                  </p>
                )}
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
      {isLoading ? "מנתח..." : "שאלו את המנטור"}
    </Button>
  )
}
