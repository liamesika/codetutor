"use client"

import { useState } from "react"
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
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className={difficultyColors[question.difficulty]}>
              Level {question.difficulty}
            </Badge>
            <Badge variant="secondary">
              {typeLabels[question.type] || question.type}
            </Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">{question.title}</h1>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>~{question.estimatedMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            <span>{question.points} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            <span>{question.hints.length} hints available</span>
          </div>
        </div>

        <Separator />

        {/* Problem description */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Problem</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: question.prompt
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
                  .replace(/`([^`]+)`/g, '<code>$1</code>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br>'),
              }}
            />
          </div>
        </div>

        {/* Constraints */}
        {question.constraints && (
          <>
            <Separator />
            <div className="space-y-2">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Constraints
              </h2>
              <Card className="bg-warning/5 border-warning/20">
                <CardContent className="pt-4 text-sm">
                  {question.constraints}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Hints */}
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Hints
            </h2>
            {availableHints > 0 && !solutionRevealed && (
              <Button
                variant="outline"
                size="sm"
                onClick={onUseHint}
                className="gap-2"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Get Hint
                <Badge variant="secondary" className="ml-1">
                  -{hintPointsCost} XP
                </Badge>
              </Button>
            )}
          </div>

          {hintsUsed > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {question.hints.slice(0, hintsUsed).map((hint, index) => (
                <AccordionItem key={index} value={`hint-${index}`}>
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      Hint {index + 1}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {hint}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hints used yet. Use hints if you&apos;re stuck, but they cost XP!
            </p>
          )}
        </div>

        {/* Solution reveal */}
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Solution
            </h2>
            {!solutionRevealed && (
              <AlertDialog open={showRevealDialog} onOpenChange={setShowRevealDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-3.5 w-3.5" />
                    Reveal Solution
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reveal Solution?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Revealing the solution will cost you <strong>50 XP</strong> and
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
                    >
                      Reveal (-50 XP)
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {solutionRevealed && solutionCode ? (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Solution Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto p-3 bg-background rounded-md border">
                  <code>{solutionCode}</code>
                </pre>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">
              Try to solve it yourself first! The solution is available if you
              get stuck.
            </p>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}
