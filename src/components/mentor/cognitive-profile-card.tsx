"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Target,
  Clock,
  Zap,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface CognitiveProfileData {
  profile: {
    accuracyRate: number
    retryRate: number
    avgSolveTime: number
    momentumScore: number
    confidenceIndex: number
    burnoutRiskScore: number
    engagementScore: number
    streakStabilityScore: number
    consistencyScore: number
    learningVelocity: number
    preferredSessionLength: number
    peakPerformanceHour: number
    currentWinStreak: number
    currentLoseStreak: number
    totalQuestionsAttempted: number
    totalQuestionsPassed: number
    totalMistakes: number
    healthScore: number
  }
  weaknesses: Array<{
    topicId: string
    topicName: string
    weaknessScore: number
  }>
  strengths: Array<{
    topicId: string
    topicName: string
    strengthScore: number
  }>
  mistakeTypeFrequency: Record<string, number>
}

interface CognitiveProfileCardProps {
  className?: string
}

export function CognitiveProfileCard({ className }: CognitiveProfileCardProps) {
  const [data, setData] = useState<CognitiveProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState({
    scores: true,
    weaknesses: false,
    strengths: false,
    mistakes: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      setLoading(true)
      const res = await fetch("/api/mentor/profile")
      if (!res.ok) {
        if (res.status === 403) {
          setData(null)
          return
        }
        throw new Error("Failed to fetch profile")
      }
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error("Failed to fetch cognitive profile:", err)
    } finally {
      setLoading(false)
    }
  }

  async function recalculateProfile() {
    try {
      setRecalculating(true)
      const res = await fetch("/api/mentor/profile", { method: "PATCH" })
      if (res.ok) {
        await fetchProfile()
      }
    } catch (err) {
      console.error("Failed to recalculate profile:", err)
    } finally {
      setRecalculating(false)
    }
  }

  if (loading) {
    return (
      <div className={cn("rounded-xl border bg-card p-6", className)}>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 bg-muted rounded animate-pulse" />
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { profile, weaknesses, strengths, mistakeTypeFrequency } = data

  return (
    <div className={cn("rounded-xl border bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Brain className="size-5 text-primary" />
          <span className="font-semibold">Cognitive Profile</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={recalculateProfile}
          disabled={recalculating}
        >
          <RefreshCw
            className={cn("size-4 mr-1.5", recalculating && "animate-spin")}
          />
          {recalculating ? "Updating..." : "Refresh"}
        </Button>
      </div>

      {/* Health Score */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Health</span>
          <HealthBadge score={profile.healthScore} />
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${profile.healthScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Core Scores */}
      <Collapsible
        open={sectionsOpen.scores}
        onOpenChange={(open) =>
          setSectionsOpen((prev) => ({ ...prev, scores: open }))
        }
      >
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
          <span className="font-medium text-sm">Core Metrics</span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              sectionsOpen.scores && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            <MetricCard
              icon={<Zap className="size-4 text-amber-500" />}
              label="Momentum"
              value={profile.momentumScore}
              max={100}
              color="amber"
            />
            <MetricCard
              icon={<Activity className="size-4 text-pink-500" />}
              label="Confidence"
              value={profile.confidenceIndex}
              max={100}
              color="pink"
            />
            <MetricCard
              icon={<Flame className="size-4 text-orange-500" />}
              label="Engagement"
              value={profile.engagementScore}
              max={100}
              color="orange"
            />
            <MetricCard
              icon={<Target className="size-4 text-blue-500" />}
              label="Consistency"
              value={profile.consistencyScore}
              max={100}
              color="blue"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <Collapsible
          open={sectionsOpen.weaknesses}
          onOpenChange={(open) =>
            setSectionsOpen((prev) => ({ ...prev, weaknesses: open }))
          }
        >
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t">
            <div className="flex items-center gap-2">
              <TrendingDown className="size-4 text-red-500" />
              <span className="font-medium text-sm">Weak Areas</span>
            </div>
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                sectionsOpen.weaknesses && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-2">
              {weaknesses.map((w) => (
                <div
                  key={w.topicId}
                  className="flex items-center justify-between p-2 rounded-lg bg-red-500/5"
                >
                  <span className="text-sm">{w.topicName}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${w.weaknessScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-red-500 tabular-nums w-8 text-right">
                      {w.weaknessScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <Collapsible
          open={sectionsOpen.strengths}
          onOpenChange={(open) =>
            setSectionsOpen((prev) => ({ ...prev, strengths: open }))
          }
        >
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-green-500" />
              <span className="font-medium text-sm">Strong Areas</span>
            </div>
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                sectionsOpen.strengths && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-2">
              {strengths.map((s) => (
                <div
                  key={s.topicId}
                  className="flex items-center justify-between p-2 rounded-lg bg-green-500/5"
                >
                  <span className="text-sm">{s.topicName}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${s.strengthScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-green-500 tabular-nums w-8 text-right">
                      {s.strengthScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Mistake Patterns */}
      {Object.keys(mistakeTypeFrequency).length > 0 && (
        <Collapsible
          open={sectionsOpen.mistakes}
          onOpenChange={(open) =>
            setSectionsOpen((prev) => ({ ...prev, mistakes: open }))
          }
        >
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <span className="font-medium text-sm">Mistake Patterns</span>
            </div>
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                sectionsOpen.mistakes && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(mistakeTypeFrequency)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <span
                      key={type}
                      className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                      {type.replace("_", " ")}: {count}
                    </span>
                  ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Stats Footer */}
      <div className="p-4 border-t bg-muted/30 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold">{profile.totalQuestionsAttempted}</div>
          <div className="text-xs text-muted-foreground">Attempted</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-500">
            {profile.totalQuestionsPassed}
          </div>
          <div className="text-xs text-muted-foreground">Passed</div>
        </div>
        <div>
          <div className="text-lg font-bold">
            {Math.round(profile.accuracyRate * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>
    </div>
  )
}

function HealthBadge({ score }: { score: number }) {
  const getStatus = () => {
    if (score >= 75) return { label: "Excellent", color: "text-green-500 bg-green-500/10" }
    if (score >= 55) return { label: "Good", color: "text-blue-500 bg-blue-500/10" }
    if (score >= 35) return { label: "Needs Work", color: "text-amber-500 bg-amber-500/10" }
    return { label: "Struggling", color: "text-red-500 bg-red-500/10" }
  }

  const status = getStatus()

  return (
    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", status.color)}>
      {score} - {status.label}
    </span>
  )
}

function MetricCard({
  icon,
  label,
  value,
  max,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  max: number
  color: string
}) {
  const colors: Record<string, { bar: string; text: string }> = {
    amber: { bar: "bg-amber-500", text: "text-amber-500" },
    pink: { bar: "bg-pink-500", text: "text-pink-500" },
    orange: { bar: "bg-orange-500", text: "text-orange-500" },
    blue: { bar: "bg-blue-500", text: "text-blue-500" },
  }

  const colorStyle = colors[color] || colors.blue

  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className={cn("text-xl font-bold", colorStyle.text)}>{value}</span>
        <div className="flex-1 mx-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", colorStyle.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${(value / max) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        </div>
        <span className="text-xs text-muted-foreground">/{max}</span>
      </div>
    </div>
  )
}
