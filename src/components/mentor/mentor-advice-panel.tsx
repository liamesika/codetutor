"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Heart,
  Target,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MentorAdvice {
  type: string
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  actionItems: string[]
  relatedTopics?: string[]
}

interface MentorAdvicePanelProps {
  className?: string
  onClose?: () => void
}

const ADVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  daily_briefing: Brain,
  mistake_analysis: AlertTriangle,
  confidence_boost: Sparkles,
  recovery_plan: Heart,
  challenge_suggestion: Target,
}

const PRIORITY_STYLES: Record<string, { border: string; bg: string; icon: string }> = {
  urgent: {
    border: "border-red-500/50",
    bg: "bg-red-500/5",
    icon: "text-red-500",
  },
  high: {
    border: "border-orange-500/50",
    bg: "bg-orange-500/5",
    icon: "text-orange-500",
  },
  medium: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/5",
    icon: "text-blue-500",
  },
  low: {
    border: "border-muted",
    bg: "bg-muted/30",
    icon: "text-muted-foreground",
  },
}

export function MentorAdvicePanel({ className, onClose }: MentorAdvicePanelProps) {
  const [data, setData] = useState<{
    greeting: string
    assessment: { status: string; summary: string }
    advice: MentorAdvice[]
    stats: {
      momentumScore: number
      confidenceIndex: number
      currentStreak: number
      todaysMissions: number
      completedMissions: number
    }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchAdvice()
  }, [])

  async function fetchAdvice() {
    try {
      setLoading(true)
      const res = await fetch("/api/mentor/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: "dashboard" }),
      })
      if (!res.ok) {
        if (res.status === 403) {
          // Not PRO user
          setData(null)
          return
        }
        throw new Error("Failed to fetch advice")
      }
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error("Failed to fetch mentor advice:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={cn("rounded-xl border bg-card p-6", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{data.greeting}</h3>
              <p className="text-sm text-muted-foreground">{data.assessment.summary}</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="size-8">
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary" />
            <span className="font-medium">{data.stats.momentumScore}</span>
            <span className="text-muted-foreground">Momentum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="size-4 text-pink-500" />
            <span className="font-medium">{data.stats.confidenceIndex}</span>
            <span className="text-muted-foreground">Confidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="size-4 text-blue-500" />
            <span className="font-medium">
              {data.stats.completedMissions}/{data.stats.todaysMissions}
            </span>
            <span className="text-muted-foreground">Missions</span>
          </div>
        </div>
      </div>

      {/* Advice Cards */}
      <div className="divide-y">
        <AnimatePresence mode="popLayout">
          {data.advice.map((advice, index) => (
            <AdviceCard
              key={`${advice.type}-${index}`}
              advice={advice}
              isExpanded={expanded === `${advice.type}-${index}`}
              onToggle={() =>
                setExpanded(
                  expanded === `${advice.type}-${index}` ? null : `${advice.type}-${index}`
                )
              }
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Refresh button */}
      <div className="p-3 border-t bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchAdvice}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="size-4 mr-2" />
          Refresh Advice
        </Button>
      </div>
    </div>
  )
}

function AdviceCard({
  advice,
  isExpanded,
  onToggle,
  index,
}: {
  advice: MentorAdvice
  isExpanded: boolean
  onToggle: () => void
  index: number
}) {
  const Icon = ADVICE_ICONS[advice.type] || Lightbulb
  const styles = PRIORITY_STYLES[advice.priority] || PRIORITY_STYLES.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("p-4 transition-colors", styles.bg)}
    >
      <button
        onClick={onToggle}
        className="w-full text-left flex items-start gap-3"
      >
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border",
            styles.border,
            styles.bg
          )}
        >
          <Icon className={cn("size-4", styles.icon)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{advice.title}</h4>
            {advice.priority === "urgent" && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium">
                Urgent
              </span>
            )}
            {advice.priority === "high" && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-medium">
                Important
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {advice.message}
          </p>
        </div>

        <ChevronRight
          className={cn(
            "size-5 text-muted-foreground transition-transform flex-shrink-0",
            isExpanded && "rotate-90"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pl-11 space-y-3">
              {/* Action Items */}
              {advice.actionItems.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                    Action Items
                  </h5>
                  <ul className="space-y-1.5">
                    {advice.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Topics */}
              {advice.relatedTopics && advice.relatedTopics.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                    Related Topics
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {advice.relatedTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
