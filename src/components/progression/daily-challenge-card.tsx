"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Trophy,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { routes } from "@/lib/routes"
import { NeonButton } from "@/components/ui/neon-button"
import { Badge } from "@/components/ui/badge"

interface DailyChallengeData {
  challenge: {
    id: string
    date: string
    bonusXp: number
    question: {
      id: string
      title: string
      slug: string
      difficulty: number
      type: string
      estimatedMinutes: number
      points: number
      topic: {
        id: string
        title: string
        weekNumber: number
      }
    }
    isCompleted: boolean
    completedAt?: string
    xpEarned?: number
  } | null
  streak: number
}

interface DailyChallengeCardProps {
  className?: string
  compact?: boolean
}

export function DailyChallengeCard({ className, compact = false }: DailyChallengeCardProps) {
  const router = useRouter()

  const { data, isLoading } = useQuery<DailyChallengeData>({
    queryKey: ["daily-challenge"],
    queryFn: async () => {
      const res = await fetch("/api/daily-challenge")
      if (!res.ok) throw new Error("Failed to load daily challenge")
      return res.json()
    },
    refetchInterval: 60000, // Refresh every minute
  })

  if (isLoading) {
    return (
      <div className={cn("animate-pulse rounded-2xl bg-[#1E1B4B]/50 p-6", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#4F46E5]/20" />
          <div className="flex-1">
            <div className="h-4 w-32 rounded bg-[#4F46E5]/20 mb-2" />
            <div className="h-3 w-24 rounded bg-[#4F46E5]/20" />
          </div>
        </div>
      </div>
    )
  }

  if (!data?.challenge) {
    return null
  }

  const { challenge, streak } = data
  const difficultyLabel = ["Easy", "Medium", "Hard", "Expert"][challenge.question.difficulty - 1] || "Medium"
  const difficultyColor = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-orange-400",
    Expert: "text-red-400",
  }[difficultyLabel]

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-xl bg-gradient-to-r from-[#4F46E5]/20 to-[#22D3EE]/20 border border-[#4F46E5]/30 p-4",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#F59E0B]/20">
              <Calendar className="size-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Daily Challenge</p>
              <p className="text-xs text-[#9CA3AF] truncate max-w-[150px]">
                {challenge.question.title}
              </p>
            </div>
          </div>
          {challenge.isCompleted ? (
            <div className="flex items-center gap-1 text-[#10B981]">
              <CheckCircle2 className="size-4" />
              <span className="text-xs font-medium">Done</span>
            </div>
          ) : (
            <NeonButton
              size="sm"
              onClick={() => router.push(routes.practice(challenge.question.id))}
            >
              Start
            </NeonButton>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        challenge.isCompleted
          ? "bg-gradient-to-br from-[#10B981]/20 to-[#22D3EE]/20"
          : "bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20",
        "border border-[#4F46E5]/30",
        className
      )}
    >
      {/* Animated background glow */}
      {!challenge.isCompleted && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 via-transparent to-[#EF4444]/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-xl",
              challenge.isCompleted ? "bg-[#10B981]/20" : "bg-[#F59E0B]/20"
            )}>
              {challenge.isCompleted ? (
                <Trophy className="size-6 text-[#10B981]" />
              ) : (
                <Calendar className="size-6 text-[#F59E0B]" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                Daily Challenge
                {!challenge.isCompleted && (
                  <Sparkles className="size-4 text-[#F59E0B] animate-pulse" />
                )}
              </h3>
              <p className="text-sm text-[#9CA3AF]">
                {new Date(challenge.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Streak badge */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
              <Flame className="size-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-500">{streak}</span>
            </div>
          )}
        </div>

        {/* Question info */}
        <div className="mb-6 p-4 rounded-xl bg-[#0F0E26]/50 border border-[#4F46E5]/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="font-medium text-white mb-1 line-clamp-2">
                {challenge.question.title}
              </p>
              <p className="text-sm text-[#6B7280]">
                Week {challenge.question.topic.weekNumber} &bull; {challenge.question.topic.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className={cn("border-current", difficultyColor)}>
              {difficultyLabel}
            </Badge>
            <div className="flex items-center gap-1 text-[#6B7280]">
              <Clock className="size-3.5" />
              <span>{challenge.question.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1 text-[#22D3EE]">
              <Zap className="size-3.5" />
              <span>+{challenge.bonusXp} bonus XP</span>
            </div>
          </div>
        </div>

        {/* Action */}
        {challenge.isCompleted ? (
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-[#10B981]" />
              <div>
                <p className="font-medium text-[#10B981]">Completed!</p>
                <p className="text-sm text-[#6B7280]">
                  +{challenge.xpEarned} XP earned
                </p>
              </div>
            </div>
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={() => router.push(routes.practice(challenge.question.id))}
            >
              Review
            </NeonButton>
          </div>
        ) : (
          <NeonButton
            className="w-full"
            onClick={() => router.push(routes.practice(challenge.question.id))}
            rightIcon={<ArrowRight className="size-4" />}
          >
            Start Challenge
          </NeonButton>
        )}
      </div>
    </motion.div>
  )
}
