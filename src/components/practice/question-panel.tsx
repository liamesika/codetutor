"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Lightbulb,
  Clock,
  Target,
  Zap,
  Eye,
  Copy,
  Check,
  ArrowRight,
  FileCode,
  AlertCircle,
  BookOpen,
  Lock,
  Languages,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useXp, useHintCost, useSolutionCost } from "@/components/providers/xp-provider"

interface QuestionPanelProps {
  question: {
    id: string
    title: string
    prompt: string
    constraints: string | null
    type: string
    difficulty: number
    estimatedMinutes: number
    points: number
    hints: string[]
  }
  hintsUsed: number
  onUseHint: () => void
  onRevealSolution: () => void
  solutionRevealed: boolean
  solutionCode?: string
  hideSolution?: boolean
  showOnlySolution?: boolean
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

// Parse structured sections from prompt text
function parseStructuredContent(prompt: string) {
  const sections: {
    goal?: string
    inputOutput?: string[]
    examples?: { input?: string; output?: string; explanation?: string }[]
    notes?: string[]
    rawContent?: string
  } = {}

  // Try to detect common patterns
  const lines = prompt.split('\n')
  let currentSection = ''
  let exampleBuffer: { input?: string; output?: string; explanation?: string } = {}

  // Check for explicit section markers
  const hasGoal = /goal:|objective:|task:/i.test(prompt)
  const hasInput = /input:|inputs:/i.test(prompt)
  const hasOutput = /output:|outputs:|expected:/i.test(prompt)
  const hasExample = /example:|examples:|sample:/i.test(prompt)

  if (hasGoal || hasInput || hasOutput || hasExample) {
    // Structured content detected - parse sections
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
        // Add to current section
        if (currentSection === 'goal') {
          sections.goal = (sections.goal || '') + ' ' + trimmed
        } else if (currentSection === 'input') {
          sections.inputOutput = sections.inputOutput || []
          sections.inputOutput.push(trimmed)
        } else if (currentSection === 'output') {
          sections.inputOutput = sections.inputOutput || []
          sections.inputOutput.push(trimmed)
        } else if (currentSection === 'example') {
          // Try to parse example content
          if (/^input/i.test(trimmed)) {
            exampleBuffer.input = trimmed.replace(/^input:?\s*/i, '')
          } else if (/^output|^expected/i.test(trimmed)) {
            exampleBuffer.output = trimmed.replace(/^(output|expected):?\s*/i, '')
          } else if (trimmed.includes('→') || trimmed.includes('->')) {
            const [inp, out] = trimmed.split(/→|->/).map(s => s.trim())
            exampleBuffer.input = inp
            exampleBuffer.output = out
          } else {
            exampleBuffer.explanation = (exampleBuffer.explanation || '') + ' ' + trimmed
          }
        } else if (currentSection === 'notes') {
          sections.notes = sections.notes || []
          sections.notes.push(trimmed)
        }
      }
    }

    // Add final example if exists
    if (exampleBuffer.input || exampleBuffer.output) {
      sections.examples = sections.examples || []
      sections.examples.push(exampleBuffer)
    }
  } else {
    // No structured content - use raw
    sections.rawContent = prompt
  }

  return sections
}

// Copy button component
function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

// Constraints section with Hebrew translation toggle
function ConstraintsSection({ constraints }: { constraints: string }) {
  const [showHebrew, setShowHebrew] = useState(false)
  const [hebrewText, setHebrewText] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = useCallback(async () => {
    if (hebrewText) {
      setShowHebrew(!showHebrew)
      return
    }
    setIsTranslating(true)
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: constraints, targetLang: "he" }),
      })
      if (res.ok) {
        const data = await res.json()
        setHebrewText(data.translated)
        setShowHebrew(true)
      }
    } catch {
      // Silently fail - user can try again
    } finally {
      setIsTranslating(false)
    }
  }, [constraints, hebrewText, showHebrew])

  // Split constraints by sentence boundaries for better readability
  const constraintItems = constraints
    .split(/(?<=[.!?\n])\s+/)
    .map(s => s.trim())
    .filter(Boolean)

  const hebrewItems = hebrewText
    ? hebrewText.split(/(?<=[.!?\n])\s+/).map(s => s.trim()).filter(Boolean)
    : []

  const displayItems = showHebrew && hebrewItems.length > 0 ? hebrewItems : constraintItems

  return (
    <>
      <Separator className="bg-border/50" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-warning" />
            <AlertCircle className="h-5 w-5 text-warning" />
            {showHebrew ? "אילוצים" : "Constraints"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {isTranslating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Languages className="h-3.5 w-3.5" />
            )}
            {showHebrew ? "English" : "עברית"}
          </Button>
        </div>
        <Card className="bg-warning/5 border-warning/30 neon-border" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <CardContent className="pt-4 text-sm text-muted-foreground">
            <p className="text-xs font-medium text-warning mb-3" dir={showHebrew ? "rtl" : "ltr"}>
              {showHebrew
                ? "שימו לב לאילוצים הבאים בפתרון שלכם:"
                : "Pay attention to the following constraints in your solution:"}
            </p>
            <ul className="space-y-2" dir={showHebrew ? "rtl" : "ltr"}>
              {displayItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-warning shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export function QuestionPanel({
  question,
  hintsUsed,
  onUseHint,
  onRevealSolution,
  solutionRevealed,
  solutionCode,
  hideSolution = false,
  showOnlySolution = false,
}: QuestionPanelProps) {
  const [showRevealDialog, setShowRevealDialog] = useState(false)
  const availableHints = question.hints.length - hintsUsed
  const hintPointsCost = 10 * (hintsUsed + 1)

  // XP purchase guards
  const { xp, canAfford, isLoading: xpLoading } = useXp()
  const nextHintCost = useHintCost(hintsUsed)
  const solutionCost = useSolutionCost()
  const canAffordHint = canAfford(nextHintCost)
  const canAffordSolution = canAfford(solutionCost)

  // Parse structured content
  const structured = parseStructuredContent(question.prompt)
  const hasStructuredContent = !structured.rawContent

  // Solution-only view
  if (showOnlySolution) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-cyan-500" />
            Solution
          </h2>
        </div>

        {solutionRevealed && solutionCode ? (
          <Card className="bg-cyan-500/5 border-cyan-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-cyan-500" />
                  Solution Code
                </span>
                <CopyButton text={solutionCode} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm overflow-x-auto p-4 bg-background/50 rounded-lg border border-border/50 font-mono whitespace-pre-wrap">
                <code>{solutionCode}</code>
              </pre>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-accent/20 border-border/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                {canAffordSolution ? (
                  <Eye className="h-8 w-8 text-cyan-500" />
                ) : (
                  <Lock className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Solution Not Revealed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {canAffordSolution
                    ? "Try to solve it yourself first! Revealing the solution costs 50 XP and you won't earn points for this question."
                    : `You need ${solutionCost} XP to reveal the solution. You currently have ${xp ?? 0} XP. Solve more questions to earn XP!`
                  }
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <AlertDialog open={showRevealDialog} onOpenChange={canAffordSolution ? setShowRevealDialog : undefined}>
                          <AlertDialogTrigger asChild disabled={!canAffordSolution}>
                            <Button
                              variant="outline"
                              disabled={!canAffordSolution || xpLoading}
                              className={cn(
                                "gap-2",
                                canAffordSolution
                                  ? "border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10"
                                  : "border-muted-foreground/20 opacity-60 cursor-not-allowed"
                              )}
                            >
                              {canAffordSolution ? (
                                <Eye className="h-4 w-4 text-cyan-500" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                              Reveal Solution
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "ml-1",
                                  canAffordSolution
                                    ? "bg-cyan-500/20 text-cyan-500"
                                    : "bg-destructive/20 text-destructive"
                                )}
                              >
                                -{solutionCost} XP
                              </Badge>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-card">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reveal Solution?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Revealing the solution will cost you <strong className="text-destructive">50 XP</strong> and
                                you won&apos;t earn any points for this question. Are you sure
                                you want to continue?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Trying</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  onRevealSolution()
                                  setShowRevealDialog(false)
                                }}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Reveal (-50 XP)
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </span>
                    </TooltipTrigger>
                    {!canAffordSolution && (
                      <TooltipContent side="bottom" className="bg-destructive text-destructive-foreground">
                        <p>Not enough XP ({xp ?? 0}/{solutionCost} XP needed)</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              difficultyColors[question.difficulty]
            )}
          >
            Level {question.difficulty}
          </Badge>
          <Badge variant="secondary" className="bg-accent/50">
            {typeLabels[question.type] || question.type}
          </Badge>
        </div>
        <h1 className="text-xl md:text-2xl font-bold gradient-neon-text">
          {question.title}
        </h1>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/30">
          <Clock className="h-4 w-4" />
          <span>~{question.estimatedMinutes} min</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-primary font-medium">{question.points} XP</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/30">
          <Target className="h-4 w-4" />
          <span>{question.hints.length} hints</span>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* STRUCTURED CONTENT RENDERING */}
      {hasStructuredContent ? (
        <div className="space-y-6">
          {/* Goal Section */}
          {structured.goal && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-primary" />
                Goal
              </h2>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed">{structured.goal}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Input/Output Section */}
          {structured.inputOutput && structured.inputOutput.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500" />
                Input / Output
              </h2>
              <div className="space-y-2">
                {structured.inputOutput.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples Section */}
          {structured.examples && structured.examples.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-green-500" />
                Examples
              </h2>
              <div className="space-y-3">
                {structured.examples.map((example, i) => (
                  <Card key={i} className="bg-green-500/5 border-green-500/20">
                    <CardContent className="pt-4 space-y-2">
                      {example.input && (
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Input:</span>
                            <pre className="text-sm bg-muted/50 rounded px-2 py-1 font-mono">
                              {example.input}
                            </pre>
                          </div>
                          <CopyButton text={example.input} />
                        </div>
                      )}
                      {example.output && (
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Output:</span>
                            <pre className="text-sm bg-muted/50 rounded px-2 py-1 font-mono">
                              {example.output}
                            </pre>
                          </div>
                          <CopyButton text={example.output} />
                        </div>
                      )}
                      {example.explanation && (
                        <p className="text-xs text-muted-foreground italic mt-2">
                          {example.explanation}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {structured.notes && structured.notes.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amber-500" />
                Notes
              </h2>
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {structured.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <BookOpen className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        /* RAW CONTENT - Fallback rendering with smart formatting */
        <div className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-primary" />
            Problem
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: question.prompt
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted/50 rounded-lg p-4 overflow-x-auto my-3"><code class="language-$1 text-sm font-mono">$2</code></pre>')
                  .replace(/`([^`]+)`/g, '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                  .replace(/\n\n/g, '</p><p class="my-2">')
                  .replace(/\n/g, '<br>'),
              }}
            />
          </div>
        </div>
      )}

      {/* Constraints */}
      {question.constraints && (
        <ConstraintsSection constraints={question.constraints} />
      )}

      {/* Hints */}
      <Separator className="bg-border/50" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-yellow-500" />
            Hints
          </h2>
          {availableHints > 0 && !solutionRevealed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={canAffordHint ? { scale: 1.02 } : undefined} whileTap={canAffordHint ? { scale: 0.98 } : undefined}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={canAffordHint ? onUseHint : undefined}
                      disabled={!canAffordHint || xpLoading}
                      className={cn(
                        "gap-2",
                        canAffordHint
                          ? "border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                          : "border-muted-foreground/20 opacity-60 cursor-not-allowed"
                      )}
                    >
                      {canAffordHint ? (
                        <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      Get Hint
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-1",
                          canAffordHint
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-destructive/20 text-destructive"
                        )}
                      >
                        -{hintPointsCost} XP
                      </Badge>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                {!canAffordHint && (
                  <TooltipContent side="bottom" className="bg-destructive text-destructive-foreground">
                    <p>Not enough XP ({xp ?? 0}/{nextHintCost} XP needed)</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {hintsUsed > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {question.hints.slice(0, hintsUsed).map((hint, index) => (
              <AccordionItem
                key={index}
                value={`hint-${index}`}
                className="border border-border/50 rounded-lg px-4 bg-accent/20"
              >
                <AccordionTrigger className="text-sm hover:no-underline py-3">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    Hint {index + 1}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {hint}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground px-3 py-2 rounded-lg bg-accent/20">
            No hints used yet. Use hints if you&apos;re stuck, but they cost XP!
          </p>
        )}
      </div>

      {/* Solution reveal - only show if not hidden */}
      {!hideSolution && (
        <>
          <Separator className="bg-border/50" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-cyan-500" />
                Solution
              </h2>
              {!solutionRevealed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <AlertDialog open={showRevealDialog} onOpenChange={canAffordSolution ? setShowRevealDialog : undefined}>
                          <AlertDialogTrigger asChild disabled={!canAffordSolution}>
                            <motion.div whileHover={canAffordSolution ? { scale: 1.02 } : undefined} whileTap={canAffordSolution ? { scale: 0.98 } : undefined}>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!canAffordSolution || xpLoading}
                                className={cn(
                                  "gap-2",
                                  canAffordSolution
                                    ? "border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10"
                                    : "border-muted-foreground/20 opacity-60 cursor-not-allowed"
                                )}
                              >
                                {canAffordSolution ? (
                                  <Eye className="h-3.5 w-3.5 text-cyan-500" />
                                ) : (
                                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                Reveal Solution
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "ml-1",
                                    canAffordSolution
                                      ? "bg-cyan-500/20 text-cyan-500"
                                      : "bg-destructive/20 text-destructive"
                                  )}
                                >
                                  -{solutionCost} XP
                                </Badge>
                              </Button>
                            </motion.div>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-card">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reveal Solution?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Revealing the solution will cost you <strong className="text-destructive">50 XP</strong> and
                                you won&apos;t earn any points for this question. Are you sure
                                you want to continue?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Trying</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  onRevealSolution()
                                  setShowRevealDialog(false)
                                }}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Reveal (-50 XP)
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </span>
                    </TooltipTrigger>
                    {!canAffordSolution && (
                      <TooltipContent side="bottom" className="bg-destructive text-destructive-foreground">
                        <p>Not enough XP ({xp ?? 0}/{solutionCost} XP needed)</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {solutionRevealed && solutionCode ? (
              <Card className="bg-cyan-500/5 border-cyan-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-cyan-500" />
                      Solution Code
                    </span>
                    <CopyButton text={solutionCode} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm overflow-x-auto p-4 bg-background/50 rounded-lg border border-border/50 font-mono whitespace-pre-wrap">
                    <code>{solutionCode}</code>
                  </pre>
                </CardContent>
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground px-3 py-2 rounded-lg bg-accent/20">
                Try to solve it yourself first! The solution is available if you
                get stuck.
              </p>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
