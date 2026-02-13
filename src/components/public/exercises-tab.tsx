"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Code2,
  Clock,
  Target,
  Lightbulb,
  Tag,
  Copy,
  Check,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getExerciseGroups,
  type DayExerciseGroup,
  type ExerciseItem,
} from "@/content/exercises/marathon-exercises"

const difficultyLabels: Record<number, string> = {
  1: "קל",
  2: "קל-בינוני",
  3: "בינוני",
  4: "קשה",
  5: "מאתגר",
}

const difficultyColors: Record<number, string> = {
  1: "bg-green-500/10 text-green-500 border-green-500/20",
  2: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  3: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  4: "bg-red-500/10 text-red-500 border-red-500/20",
  5: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

const typeLabels: Record<string, string> = {
  FULL_PROGRAM: "תוכנית מלאה",
  FUNCTION: "פונקציה",
  FIX_BUG: "תקן באג",
  PREDICT_OUTPUT: "חזה פלט",
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs gap-1"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          הועתק
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          העתק
        </>
      )}
    </Button>
  )
}

function ExerciseCard({ exercise }: { exercise: ExerciseItem }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)

  return (
    <Card
      className={cn(
        "glass-card overflow-hidden transition-all duration-300",
        isExpanded && "border-primary/30"
      )}
    >
      <CardHeader
        className="pb-2 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 flex-1 min-w-0">
            <Code2 className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{exercise.title}</span>
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5", difficultyColors[exercise.difficulty])}
            >
              {difficultyLabels[exercise.difficulty]}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 gap-1 hidden sm:flex">
              <Clock className="h-3 w-3" />
              {exercise.estimatedMinutes} דק׳
            </Badge>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-2 border-t border-border/50 space-y-4">
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {typeLabels[exercise.type] || exercise.type}
                </Badge>
                {exercise.tags.slice(0, 4).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs gap-1 text-muted-foreground"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Prompt */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  תיאור התרגיל
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap" dir="ltr">
                  {exercise.prompt}
                </p>
                {exercise.constraints && (
                  <p className="text-xs text-muted-foreground/70 mt-2 italic" dir="ltr">
                    Constraints: {exercise.constraints}
                  </p>
                )}
              </div>

              {/* Hints */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowHints(!showHints)
                  }}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {showHints ? "הסתר רמזים" : `הצג רמזים (${exercise.hints.length})`}
                </Button>
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-2 space-y-1.5 pr-4 list-disc" dir="ltr">
                        {exercise.hints.map((hint, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Solution */}
              <div>
                <Button
                  variant={showSolution ? "default" : "outline"}
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSolution(!showSolution)
                  }}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  {showSolution ? "הסתר פתרון" : "הצג פתרון מלא"}
                </Button>
                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 relative">
                        <div className="absolute top-2 right-2 z-10">
                          <CopyButton text={exercise.solutionCode} />
                        </div>
                        <pre
                          className="bg-muted rounded-lg p-4 overflow-x-auto text-xs font-mono leading-relaxed"
                          dir="ltr"
                        >
                          <code>{exercise.solutionCode}</code>
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function DayAccordion({
  group,
  index,
}: {
  group: DayExerciseGroup
  index: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "glass-card overflow-hidden",
          isExpanded && "border-primary/20"
        )}
      >
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold gradient-neon-text">
                  {group.dayNumber}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg" dir="rtl">
                  יום {group.dayNumber}: {group.dayTitle}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5" dir="rtl">
                  {group.totalExercises} תרגילים &middot;{" "}
                  {group.totalMinutes} דק׳ &middot;{" "}
                  {group.topics.length} נושאים
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 space-y-6">
                {group.topics.map((topic) => (
                  <div key={topic.slug} className="space-y-3">
                    <div className="flex items-center gap-2" dir="rtl">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h4 className="text-sm font-semibold text-foreground">
                        {topic.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        — {topic.description}
                      </span>
                    </div>
                    <div className="space-y-2 pl-0 sm:pl-4">
                      {topic.exercises.map((exercise) => (
                        <ExerciseCard key={exercise.slug} exercise={exercise} />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export function ExercisesTab() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const groups = getExerciseGroups()

  const filteredGroups = selectedDay
    ? groups.filter((g) => g.dayNumber === selectedDay)
    : groups

  const totalExercises = groups.reduce((sum, g) => sum + g.totalExercises, 0)
  const totalMinutes = groups.reduce((sum, g) => sum + g.totalMinutes, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between" dir="rtl">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Code2 className="h-4 w-4 text-indigo-400" />
          </div>
          תרגילים עם פתרונות
        </h2>
        <Badge variant="outline" className="bg-accent/50">
          {totalExercises} תרגילים &middot; {totalMinutes} דק׳
        </Badge>
      </div>

      {/* Day filter */}
      <div className="flex gap-2 flex-wrap" dir="rtl">
        <Button
          variant={selectedDay === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDay(null)}
        >
          כל הימים
        </Button>
        {groups.map((g) => (
          <Button
            key={g.dayNumber}
            variant={selectedDay === g.dayNumber ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDay(g.dayNumber)}
          >
            יום {g.dayNumber}
          </Button>
        ))}
      </div>

      {/* Day groups */}
      <div className="space-y-4">
        {filteredGroups.map((group, index) => (
          <DayAccordion key={group.dayNumber} group={group} index={index} />
        ))}
      </div>
    </div>
  )
}
