"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Target,
  Clock,
  Zap,
  FileCode,
  Lightbulb,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Code2,
  TestTube,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionFormData {
  title: string
  prompt: string
  constraints: string
  starterCode: string
  solutionCode: string
  hints: string[]
  tests: { input: string; expected: string }[]
  type: string
  difficulty: number
  points: number
  estimatedMinutes: number
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Validate question data
export function validateQuestion(data: QuestionFormData): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields
  if (!data.title.trim()) errors.push("Title is required")
  if (data.title.length < 5) errors.push("Title must be at least 5 characters")
  if (data.title.length > 100) errors.push("Title must be less than 100 characters")

  if (!data.prompt.trim()) errors.push("Prompt is required")
  if (data.prompt.length < 20) errors.push("Prompt must be at least 20 characters")

  if (!data.starterCode.trim()) errors.push("Starter code is required")
  if (!data.solutionCode.trim()) errors.push("Solution code is required")

  // Java-specific validations
  if (data.starterCode && !data.starterCode.includes("class")) {
    warnings.push("Starter code should contain a Java class definition")
  }
  if (data.solutionCode && !data.solutionCode.includes("class")) {
    warnings.push("Solution code should contain a Java class definition")
  }

  // Test cases
  const validTests = data.tests.filter(t => t.expected.trim())
  if (validTests.length === 0) {
    errors.push("At least one test case with expected output is required")
  }
  if (validTests.length < 3) {
    warnings.push("Consider adding more test cases (recommended: 3+)")
  }

  // Hints
  const validHints = data.hints.filter(h => h.trim())
  if (validHints.length === 0) {
    warnings.push("Consider adding hints to help students")
  }

  // Difficulty/points alignment
  const expectedPoints = data.difficulty * 50
  if (Math.abs(data.points - expectedPoints) > 50) {
    warnings.push(`Points (${data.points}) may not match difficulty level ${data.difficulty}`)
  }

  // Time estimation
  if (data.estimatedMinutes < 5 && data.difficulty > 2) {
    warnings.push("Time estimate seems low for the difficulty level")
  }
  if (data.estimatedMinutes > 30 && data.difficulty < 3) {
    warnings.push("Time estimate seems high for the difficulty level")
  }

  // Prompt structure check
  if (!data.prompt.toLowerCase().includes("goal") &&
      !data.prompt.toLowerCase().includes("task") &&
      !data.prompt.toLowerCase().includes("write") &&
      !data.prompt.toLowerCase().includes("create")) {
    warnings.push("Prompt should clearly state the goal/task")
  }

  if (!data.prompt.toLowerCase().includes("example") &&
      !data.prompt.toLowerCase().includes("input") &&
      !data.prompt.toLowerCase().includes("output")) {
    warnings.push("Consider adding input/output examples in the prompt")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Parse structured content from prompt
function parsePromptContent(prompt: string) {
  const sections: {
    goal?: string
    inputOutput?: string[]
    examples?: { input?: string; output?: string; explanation?: string }[]
    notes?: string[]
    rawContent?: string
  } = {}

  const lines = prompt.split('\n')
  let currentSection = ''
  let exampleBuffer: { input?: string; output?: string; explanation?: string } = {}

  const hasGoal = /goal:|objective:|task:/i.test(prompt)
  const hasInput = /input:|inputs:/i.test(prompt)
  const hasOutput = /output:|outputs:|expected:/i.test(prompt)
  const hasExample = /example:|examples:|sample:/i.test(prompt)

  if (hasGoal || hasInput || hasOutput || hasExample) {
    for (const line of lines) {
      const trimmed = line.trim()

      if (/^(goal|objective|task):/i.test(trimmed)) {
        currentSection = 'goal'
        const content = trimmed.replace(/^(goal|objective|task):\s*/i, '')
        if (content) sections.goal = content
      } else if (/^(input|inputs):/i.test(trimmed)) {
        currentSection = 'input'
        sections.inputOutput = sections.inputOutput || []
        const content = trimmed.replace(/^(input|inputs):\s*/i, '')
        if (content) sections.inputOutput.push(`Input: ${content}`)
      } else if (/^(output|outputs|expected):/i.test(trimmed)) {
        currentSection = 'output'
        sections.inputOutput = sections.inputOutput || []
        const content = trimmed.replace(/^(output|outputs|expected):\s*/i, '')
        if (content) sections.inputOutput.push(`Output: ${content}`)
      } else if (/^(example|examples|sample)(\s*\d*)?:/i.test(trimmed)) {
        currentSection = 'example'
        if (exampleBuffer.input || exampleBuffer.output) {
          sections.examples = sections.examples || []
          sections.examples.push(exampleBuffer)
          exampleBuffer = {}
        }
      } else if (/^(note|notes|hint|tips?):/i.test(trimmed)) {
        currentSection = 'notes'
        const content = trimmed.replace(/^(note|notes|hint|tips?):\s*/i, '')
        if (content) {
          sections.notes = sections.notes || []
          sections.notes.push(content)
        }
      } else if (trimmed) {
        if (currentSection === 'goal') {
          sections.goal = (sections.goal || '') + ' ' + trimmed
        } else if (currentSection === 'example') {
          if (/^input/i.test(trimmed)) {
            exampleBuffer.input = trimmed.replace(/^input:?\s*/i, '')
          } else if (/^output|^expected/i.test(trimmed)) {
            exampleBuffer.output = trimmed.replace(/^(output|expected):?\s*/i, '')
          } else if (trimmed.includes('→') || trimmed.includes('->')) {
            const [inp, out] = trimmed.split(/→|->/).map(s => s.trim())
            exampleBuffer.input = inp
            exampleBuffer.output = out
          }
        }
      }
    }

    if (exampleBuffer.input || exampleBuffer.output) {
      sections.examples = sections.examples || []
      sections.examples.push(exampleBuffer)
    }
  } else {
    sections.rawContent = prompt
  }

  return sections
}

const difficultyColors: Record<number, string> = {
  1: "bg-green-500/10 text-green-500 border-green-500/20",
  2: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  3: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  4: "bg-red-500/10 text-red-500 border-red-500/20",
  5: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

const typeLabels: Record<string, string> = {
  FULL_PROGRAM: "Full Program",
  FUNCTION: "Function",
  FIX_BUG: "Fix Bug",
  PREDICT_OUTPUT: "Predict Output",
}

interface QuestionPreviewProps {
  data: QuestionFormData
  showValidation?: boolean
}

export function QuestionPreview({ data, showValidation = true }: QuestionPreviewProps) {
  const validation = useMemo(() => validateQuestion(data), [data])
  const parsedPrompt = useMemo(() => parsePromptContent(data.prompt), [data.prompt])
  const hasStructuredContent = !parsedPrompt.rawContent

  const validHints = data.hints.filter(h => h.trim())
  const validTests = data.tests.filter(t => t.expected.trim())

  return (
    <div className="space-y-4">
      {/* Validation Panel */}
      {showValidation && (
        <Card className={cn(
          "border-2",
          validation.isValid ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5"
        )}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {validation.isValid ? (
                <>
                  <CheckCircle2 className="size-4 text-green-500" />
                  <span className="text-green-500">Valid Question</span>
                </>
              ) : (
                <>
                  <XCircle className="size-4 text-destructive" />
                  <span className="text-destructive">Validation Failed</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <CardContent className="pt-0 space-y-2">
              {validation.errors.map((error, i) => (
                <div key={`error-${i}`} className="flex items-start gap-2 text-sm text-destructive">
                  <XCircle className="size-3.5 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ))}
              {validation.warnings.map((warning, i) => (
                <div key={`warning-${i}`} className="flex items-start gap-2 text-sm text-amber-500">
                  <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Question Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={difficultyColors[data.difficulty] || difficultyColors[1]}>
                Level {data.difficulty}
              </Badge>
              <Badge variant="secondary">
                {typeLabels[data.type] || data.type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold">
              {data.title || <span className="text-muted-foreground italic">No title</span>}
            </h2>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/30">
              <Clock className="size-3.5" />
              <span>~{data.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10">
              <Zap className="size-3.5 text-primary" />
              <span className="text-primary font-medium">{data.points} XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/30">
              <Lightbulb className="size-3.5" />
              <span>{validHints.length} hints</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/30">
              <TestTube className="size-3.5" />
              <span>{validTests.length} tests</span>
            </div>
          </div>

          <Separator />

          {/* Prompt Content */}
          {hasStructuredContent ? (
            <div className="space-y-4">
              {parsedPrompt.goal && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-primary" />
                    Goal
                  </h3>
                  <p className="text-sm text-muted-foreground">{parsedPrompt.goal}</p>
                </div>
              )}

              {parsedPrompt.inputOutput && parsedPrompt.inputOutput.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-blue-500" />
                    Input / Output
                  </h3>
                  <div className="space-y-1">
                    {parsedPrompt.inputOutput.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="size-3.5 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedPrompt.examples && parsedPrompt.examples.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-green-500" />
                    Examples
                  </h3>
                  <div className="space-y-2">
                    {parsedPrompt.examples.map((ex, i) => (
                      <div key={i} className="p-2 rounded bg-green-500/5 border border-green-500/20 text-sm">
                        {ex.input && <div><span className="text-muted-foreground">Input:</span> <code className="bg-muted/50 px-1 rounded">{ex.input}</code></div>}
                        {ex.output && <div><span className="text-muted-foreground">Output:</span> <code className="bg-muted/50 px-1 rounded">{ex.output}</code></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-primary" />
                Problem
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {data.prompt || <span className="italic">No prompt entered</span>}
              </div>
            </div>
          )}

          {/* Constraints */}
          {data.constraints && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-amber-500" />
                  Constraints
                </h3>
                <div className="p-2 rounded bg-amber-500/5 border border-amber-500/20 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="size-3.5 mt-0.5 text-amber-500 shrink-0" />
                    <span className="text-muted-foreground">{data.constraints}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Code Preview */}
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Code2 className="size-3.5" />
                Starter Code
              </h3>
              <pre className="text-xs bg-muted/30 p-2 rounded-lg overflow-x-auto border max-h-32">
                <code>{data.starterCode || "// No starter code"}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <FileCode className="size-3.5 text-green-500" />
                Solution Code
              </h3>
              <pre className="text-xs bg-green-500/5 p-2 rounded-lg overflow-x-auto border border-green-500/20 max-h-32">
                <code>{data.solutionCode || "// No solution"}</code>
              </pre>
            </div>
          </div>

          {/* Test Cases Preview */}
          {validTests.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <TestTube className="size-3.5" />
                  Test Cases ({validTests.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {validTests.slice(0, 4).map((test, i) => (
                    <div key={i} className="p-2 rounded bg-muted/30 border text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">In:</span>
                        <code className="flex-1 truncate">{test.input || "(empty)"}</code>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Out:</span>
                        <code className="flex-1 truncate text-green-500">{test.expected}</code>
                      </div>
                    </div>
                  ))}
                </div>
                {validTests.length > 4 && (
                  <p className="text-xs text-muted-foreground">+{validTests.length - 4} more tests</p>
                )}
              </div>
            </>
          )}

          {/* Hints Preview */}
          {validHints.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Lightbulb className="size-3.5 text-yellow-500" />
                  Hints ({validHints.length})
                </h3>
                <div className="space-y-1">
                  {validHints.map((hint, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="size-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0 font-medium">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Compact validation badge for form header
export function ValidationBadge({ data }: { data: QuestionFormData }) {
  const validation = useMemo(() => validateQuestion(data), [data])

  return (
    <Badge
      variant="outline"
      className={cn(
        validation.isValid
          ? "border-green-500/50 text-green-500 bg-green-500/10"
          : "border-destructive/50 text-destructive bg-destructive/10"
      )}
    >
      {validation.isValid ? (
        <>
          <CheckCircle2 className="size-3 mr-1" />
          Valid
        </>
      ) : (
        <>
          <XCircle className="size-3 mr-1" />
          {validation.errors.length} error{validation.errors.length > 1 ? "s" : ""}
        </>
      )}
      {validation.warnings.length > 0 && (
        <span className="ml-1 text-amber-500">
          ({validation.warnings.length} warning{validation.warnings.length > 1 ? "s" : ""})
        </span>
      )}
    </Badge>
  )
}
