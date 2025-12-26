"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

export function QuestionPanel({
  question,
  hintsUsed,
  onUseHint,
  onRevealSolution,
  solutionRevealed,
  solutionCode,
}: QuestionPanelProps) {
  const [showRevealDialog, setShowRevealDialog] = useState(false)
  const availableHints = question.hints.length - hintsUsed
  const hintPointsCost = 10 * (hintsUsed + 1)

  return (
    <ScrollArea className="h-full scrollbar-thin">
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

        {/* Problem description */}
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
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted/50 rounded-lg p-4 overflow-x-auto"><code class="language-$1 text-sm">$2</code></pre>')
                  .replace(/`([^`]+)`/g, '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm">$1</code>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>')
                  .replace(/\n/g, '<br>'),
              }}
            />
          </div>
        </div>

        {/* Constraints */}
        {question.constraints && (
          <>
            <Separator className="bg-border/50" />
            <div className="space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-warning" />
                Constraints
              </h2>
              <Card className="bg-warning/5 border-warning/30 neon-border" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <CardContent className="pt-4 text-sm text-muted-foreground">
                  {question.constraints}
                </CardContent>
              </Card>
            </div>
          </>
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUseHint}
                  className="gap-2 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                  Get Hint
                  <Badge variant="secondary" className="ml-1 bg-yellow-500/20 text-yellow-500">
                    -{hintPointsCost} XP
                  </Badge>
                </Button>
              </motion.div>
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

        {/* Solution reveal */}
        <Separator className="bg-border/50" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-cyan" />
              Solution
            </h2>
            {!solutionRevealed && (
              <AlertDialog open={showRevealDialog} onOpenChange={setShowRevealDialog}>
                <AlertDialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-cyan/30 hover:border-cyan/50 hover:bg-cyan/10"
                    >
                      <Eye className="h-3.5 w-3.5 text-cyan" />
                      Reveal Solution
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
            )}
          </div>

          {solutionRevealed && solutionCode ? (
            <Card className="bg-cyan/5 border-cyan/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan" />
                  Solution Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto p-4 bg-background/50 rounded-lg border border-border/50 font-mono">
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
      </motion.div>
    </ScrollArea>
  )
}
