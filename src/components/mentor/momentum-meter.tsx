"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, Zap, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MomentumMeterProps {
  score?: number
  state?: "rising" | "stable" | "declining" | "critical"
  showBreakdown?: boolean
  compact?: boolean
}

export function MomentumMeter({
  score = 50,
  state = "stable",
  showBreakdown = false,
  compact = false,
}: MomentumMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const getColor = () => {
    if (score >= 70) return { primary: "#22C55E", secondary: "#16A34A", bg: "rgba(34, 197, 94, 0.1)" }
    if (score >= 50) return { primary: "#EAB308", secondary: "#CA8A04", bg: "rgba(234, 179, 8, 0.1)" }
    if (score >= 30) return { primary: "#F97316", secondary: "#EA580C", bg: "rgba(249, 115, 22, 0.1)" }
    return { primary: "#EF4444", secondary: "#DC2626", bg: "rgba(239, 68, 68, 0.1)" }
  }

  const getTrendIcon = () => {
    switch (state) {
      case "rising":
        return <TrendingUp className="size-4 text-green-500" />
      case "declining":
        return <TrendingDown className="size-4 text-orange-500" />
      case "critical":
        return <TrendingDown className="size-4 text-red-500" />
      default:
        return <Minus className="size-4 text-yellow-500" />
    }
  }

  const getStateLabel = () => {
    switch (state) {
      case "rising":
        return "Rising"
      case "declining":
        return "Declining"
      case "critical":
        return "Critical"
      default:
        return "Stable"
    }
  }

  const colors = getColor()

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full cursor-help"
              style={{ backgroundColor: colors.bg }}
            >
              <Zap className="size-3.5" style={{ color: colors.primary }} />
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: colors.primary }}
              >
                {score}
              </span>
              {getTrendIcon()}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-semibold">Momentum Score: {score}/100</p>
            <p className="text-sm text-muted-foreground mt-1">
              {state === "rising" && "Great progress! Keep up the momentum."}
              {state === "stable" && "Steady progress. A bit more focus will boost it."}
              {state === "declining" && "Your activity has slowed. Try a quick win."}
              {state === "critical" && "Time to get back on track!"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="size-5" style={{ color: colors.primary }} />
          <span className="font-semibold text-sm">Momentum</span>
        </div>
        <div className="flex items-center gap-1.5">
          {getTrendIcon()}
          <span className="text-xs text-muted-foreground">{getStateLabel()}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-2">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${animatedScore}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: colors.primary }}
        >
          {animatedScore}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>

      {showBreakdown && (
        <div className="mt-4 pt-4 border-t space-y-2">
          <BreakdownItem label="XP Velocity" value={65} />
          <BreakdownItem label="Streak Stability" value={70} />
          <BreakdownItem label="Success Rate" value={58} />
          <BreakdownItem label="Mission Completion" value={45} />
          <BreakdownItem label="Consistency" value={52} />
        </div>
      )}
    </div>
  )
}

function BreakdownItem({ label, value }: { label: string; value: number }) {
  const getColor = () => {
    if (value >= 70) return "#22C55E"
    if (value >= 50) return "#EAB308"
    if (value >= 30) return "#F97316"
    return "#EF4444"
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${value}%`,
              backgroundColor: getColor(),
            }}
          />
        </div>
        <span className="font-medium tabular-nums w-8 text-right" style={{ color: getColor() }}>
          {value}
        </span>
      </div>
    </div>
  )
}
