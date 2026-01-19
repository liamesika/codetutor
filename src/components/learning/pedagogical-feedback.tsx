"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Lightbulb,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Repeat,
  Target,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PedagogicalFeedbackData {
  conceptualCategory: string
  explanation: string
  whyItMatters: string | null
  guidingQuestion: string | null
  hint: string | null
  suggestedTopic: string | null
  relatedConcepts: string[]
  mistakeType: string
  severity: number
  skillArea: string | null
  isRecurring: boolean
}

interface PedagogicalFeedbackProps {
  attemptId: string
  className?: string
}

// Format conceptual category for display
function formatCategory(category: string): string {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

// Get severity color
function getSeverityColor(severity: number): string {
  if (severity <= 1) return "text-yellow-600 bg-yellow-50 border-yellow-200"
  if (severity <= 2) return "text-orange-600 bg-orange-50 border-orange-200"
  if (severity <= 3) return "text-red-500 bg-red-50 border-red-200"
  return "text-red-700 bg-red-100 border-red-300"
}

function getSeverityLabel(severity: number): string {
  if (severity <= 1) return "Minor"
  if (severity <= 2) return "Moderate"
  if (severity <= 3) return "Significant"
  return "Critical"
}

export function PedagogicalFeedback({ attemptId, className }: PedagogicalFeedbackProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showHint, setShowHint] = useState(false)

  const { data, isLoading } = useQuery<{ feedback: PedagogicalFeedbackData | null }>({
    queryKey: ["pedagogicalFeedback", attemptId],
    queryFn: async () => {
      const res = await fetch(`/api/student/feedback?attemptId=${attemptId}`)
      if (!res.ok) throw new Error("Failed to fetch feedback")
      return res.json()
    },
    enabled: !!attemptId,
    staleTime: 60000, // Cache for 1 minute
  })

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-4">
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (!data?.feedback) {
    return null
  }

  const feedback = data.feedback

  return (
    <Card className={cn("border-l-4 border-l-purple-500 overflow-hidden", className)}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Learning Feedback</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {formatCategory(feedback.conceptualCategory)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {feedback.isRecurring && (
                  <Badge variant="outline" className="gap-1 text-orange-600 border-orange-300">
                    <Repeat className="h-3 w-3" />
                    Recurring
                  </Badge>
                )}
                <Badge className={cn("text-xs", getSeverityColor(feedback.severity))}>
                  {getSeverityLabel(feedback.severity)}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Main Explanation */}
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <p className="text-sm">{feedback.explanation}</p>
            </div>

            {/* Why It Matters */}
            {feedback.whyItMatters && (
              <div className="flex gap-3">
                <div className="shrink-0">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                    Why This Matters
                  </p>
                  <p className="text-sm text-muted-foreground">{feedback.whyItMatters}</p>
                </div>
              </div>
            )}

            {/* Guiding Question */}
            {feedback.guidingQuestion && (
              <div className="flex gap-3">
                <div className="shrink-0">
                  <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                    Think About This
                  </p>
                  <p className="text-sm italic">{feedback.guidingQuestion}</p>
                </div>
              </div>
            )}

            {/* Hint (Hidden by Default) */}
            {feedback.hint && (
              <div className="pt-2 border-t">
                {!showHint ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(true)}
                    className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Show Hint
                  </Button>
                ) : (
                  <div className="flex gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <Lightbulb className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                        Hint
                      </p>
                      <p className="text-sm">{feedback.hint}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Suggested Topic & Related Concepts */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {feedback.suggestedTopic && (
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="h-3 w-3" />
                  Review: {feedback.suggestedTopic}
                </Badge>
              )}
              {feedback.skillArea && (
                <Badge variant="outline" className="gap-1">
                  <Target className="h-3 w-3" />
                  {feedback.skillArea}
                </Badge>
              )}
              {feedback.relatedConcepts.map((concept, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {concept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

// Compact version for inline display
export function PedagogicalFeedbackCompact({ attemptId, className }: PedagogicalFeedbackProps) {
  const { data } = useQuery<{ feedback: PedagogicalFeedbackData | null }>({
    queryKey: ["pedagogicalFeedback", attemptId],
    queryFn: async () => {
      const res = await fetch(`/api/student/feedback?attemptId=${attemptId}`)
      if (!res.ok) throw new Error("Failed to fetch feedback")
      return res.json()
    },
    enabled: !!attemptId,
    staleTime: 60000,
  })

  if (!data?.feedback) return null

  return (
    <div className={cn("flex items-start gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800", className)}>
      <Lightbulb className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
          {formatCategory(data.feedback.conceptualCategory)}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {data.feedback.explanation}
        </p>
      </div>
    </div>
  )
}

// Student insights summary component
export function StudentMistakeInsights({ className }: { className?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["studentMistakeInsights"],
    queryFn: async () => {
      const res = await fetch("/api/student/feedback")
      if (!res.ok) throw new Error("Failed to fetch insights")
      return res.json()
    },
  })

  if (isLoading || !data) return null

  const hasData = data.improvementAreas?.length > 0 || data.recentFeedback?.length > 0

  if (!hasData) return null

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="h-5 w-5 text-purple-500" />
          Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Areas to Improve */}
        {data.improvementAreas?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Topics to Practice
            </p>
            <div className="flex flex-wrap gap-2">
              {data.improvementAreas.slice(0, 5).map((area: { topic: string; mistakeCount: number }, i: number) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className={cn(
                    "gap-1",
                    i === 0 && "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                  )}
                >
                  {area.topic}
                  <span className="text-xs opacity-70">({area.mistakeCount})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recent Feedback */}
        {data.recentFeedback?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Recent Feedback
            </p>
            <div className="space-y-2">
              {data.recentFeedback.slice(0, 3).map((feedback: { questionTitle: string; explanation: string; category: string }, i: number) => (
                <div key={i} className="p-2 rounded bg-muted/50 text-sm">
                  <p className="font-medium text-xs text-muted-foreground">
                    {feedback.questionTitle}
                  </p>
                  <p className="line-clamp-1">{feedback.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
