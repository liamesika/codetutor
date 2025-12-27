"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Target,
  CheckCircle2,
  Zap,
  Brain,
  Shield,
  TrendingUp,
  BookOpen,
  Timer,
  Focus,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ProMission {
  id: string
  title: string
  description: string
  missionType: string
  targetValue: number
  progress: number
  xpReward: number
  priorityScore: number
  difficultyLevel: number
  targetTopic?: string | null
  generatedReason?: string | null
  isComplete: boolean
}

interface ProMissionsCardProps {
  className?: string
}

const MISSION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WEAKNESS_TRAINING: Brain,
  MISTAKE_RECOVERY: RefreshCw,
  CONFIDENCE_BOOST: Sparkles,
  MOMENTUM_PUSH: TrendingUp,
  STREAK_PROTECTION: Shield,
  SKILL_UNLOCK: Target,
  REVIEW_SESSION: BookOpen,
  SPEED_CHALLENGE: Timer,
  ACCURACY_FOCUS: Focus,
  BURNOUT_PREVENTION: Zap,
}

const MISSION_COLORS: Record<string, string> = {
  WEAKNESS_TRAINING: "text-purple-500 bg-purple-500/10",
  MISTAKE_RECOVERY: "text-orange-500 bg-orange-500/10",
  CONFIDENCE_BOOST: "text-green-500 bg-green-500/10",
  MOMENTUM_PUSH: "text-blue-500 bg-blue-500/10",
  STREAK_PROTECTION: "text-amber-500 bg-amber-500/10",
  SKILL_UNLOCK: "text-cyan-500 bg-cyan-500/10",
  REVIEW_SESSION: "text-indigo-500 bg-indigo-500/10",
  SPEED_CHALLENGE: "text-red-500 bg-red-500/10",
  ACCURACY_FOCUS: "text-emerald-500 bg-emerald-500/10",
  BURNOUT_PREVENTION: "text-pink-500 bg-pink-500/10",
}

export function ProMissionsCard({ className }: ProMissionsCardProps) {
  const [missions, setMissions] = useState<ProMission[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<{
    total: number
    completed: number
    totalXpPossible: number
    xpEarned: number
  } | null>(null)

  useEffect(() => {
    fetchMissions()
  }, [])

  async function fetchMissions() {
    try {
      setLoading(true)
      const res = await fetch("/api/mentor/missions")
      if (!res.ok) {
        if (res.status === 403) {
          // Not PRO user - silently skip
          setMissions([])
          return
        }
        throw new Error("Failed to fetch missions")
      }
      const data = await res.json()
      setMissions(data.missions || [])
      setSummary(data.summary || null)
    } catch (err) {
      console.error("Failed to fetch PRO missions:", err)
    } finally {
      setLoading(false)
    }
  }

  async function generateMissions() {
    try {
      setLoading(true)
      const res = await fetch("/api/mentor/missions", { method: "POST" })
      if (res.ok) {
        await fetchMissions()
      }
    } catch (err) {
      console.error("Failed to generate missions:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={cn("rounded-xl border bg-card p-4", className)}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (missions.length === 0) {
    return (
      <div className={cn("rounded-xl border bg-card p-4", className)}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="size-5 text-primary" />
          <span className="font-semibold">PRO Missions</span>
        </div>
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-3">
            No missions generated yet
          </p>
          <Button onClick={generateMissions} size="sm" variant="outline">
            <Sparkles className="size-4 mr-2" />
            Generate Missions
          </Button>
        </div>
      </div>
    )
  }

  const completedCount = missions.filter((m) => m.isComplete).length

  return (
    <div className={cn("rounded-xl border bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-primary" />
          <span className="font-semibold">PRO Missions</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {completedCount}/{missions.length}
          </span>
          {summary && (
            <span className="text-primary font-medium">
              +{summary.xpEarned}/{summary.totalXpPossible} XP
            </span>
          )}
        </div>
      </div>

      {/* Missions */}
      <div className="divide-y">
        <AnimatePresence mode="popLayout">
          {missions.map((mission, index) => (
            <MissionItem key={mission.id} mission={mission} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MissionItem({ mission, index }: { mission: ProMission; index: number }) {
  const Icon = MISSION_ICONS[mission.missionType] || Target
  const colorClass = MISSION_COLORS[mission.missionType] || "text-primary bg-primary/10"
  const progressPercent = Math.min(100, (mission.progress / mission.targetValue) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "p-4 transition-colors",
        mission.isComplete && "bg-muted/30"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
            colorClass
          )}
        >
          {mission.isComplete ? (
            <CheckCircle2 className="size-5 text-green-500" />
          ) : (
            <Icon className="size-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "font-medium text-sm truncate",
                mission.isComplete && "line-through text-muted-foreground"
              )}
            >
              {mission.title}
            </h4>
            <span className="flex-shrink-0 text-xs font-medium text-primary">
              +{mission.xpReward} XP
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {mission.description}
          </p>

          {/* Progress */}
          {!mission.isComplete && (
            <div className="mt-2 flex items-center gap-2">
              <Progress value={progressPercent} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground tabular-nums">
                {mission.progress}/{mission.targetValue}
              </span>
            </div>
          )}

          {/* Reason (shown for incomplete high priority) */}
          {!mission.isComplete && mission.priorityScore > 70 && mission.generatedReason && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
              <Sparkles className="size-3" />
              {mission.generatedReason.substring(0, 60)}...
            </p>
          )}
        </div>

        {/* Difficulty dots */}
        <div className="flex-shrink-0 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                level <= mission.difficultyLevel
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
