"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import {
  Flame,
  Trophy,
  Zap,
  Target,
  ChevronRight,
  Play,
  CheckCircle2,
  BookOpen,
  Code2,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressionData {
  xp: number
  level: number
  totalSolved: number
  currentStreak: number
  bestStreak: number
  streakMultiplier: number
  xpToNextLevel: number
  levelProgress: number
}

interface RankData {
  currentRank: string
  weeklyXp: number
  position: number
  totalInRank: number
  promoted: boolean
  demoted: boolean
  xpToNextRank: number
  nextRank: string | null
}

interface CourseProgress {
  totalWeeks: number
  completedWeeks: number
  currentWeek: number
  totalTopics: number
  completedTopics: number
  percentComplete: number
  nextQuestion?: {
    id: string
    title: string
    topicTitle: string
  }
}

const RANK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  BRONZE: { bg: "bg-amber-900/30", text: "text-amber-400", border: "border-amber-600/40" },
  SILVER: { bg: "bg-slate-500/30", text: "text-slate-300", border: "border-slate-400/40" },
  GOLD: { bg: "bg-yellow-600/30", text: "text-yellow-400", border: "border-yellow-500/40" },
  PLATINUM: { bg: "bg-cyan-600/30", text: "text-cyan-300", border: "border-cyan-400/40" },
  DIAMOND: { bg: "bg-purple-500/30", text: "text-purple-300", border: "border-purple-400/40" },
}

// VS Code-style status bar segment
function StatusSegment({
  icon: Icon,
  label,
  value,
  onClick,
  className,
  pulse = false,
  highlight = false,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label?: string
  value?: string | number
  onClick?: () => void
  className?: string
  pulse?: boolean
  highlight?: boolean
  children?: React.ReactNode
}) {
  const Wrapper = onClick ? motion.button : motion.div

  return (
    <Wrapper
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 text-xs font-medium transition-colors",
        onClick && "hover:bg-white/10 cursor-pointer",
        highlight && "bg-primary/20 text-primary",
        className
      )}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {Icon && (
        <motion.div
          animate={pulse ? { scale: [1, 1.15, 1] } : undefined}
          transition={pulse ? { duration: 1.5, repeat: Infinity } : undefined}
        >
          <Icon className="size-3.5" />
        </motion.div>
      )}
      {label && <span className="text-muted-foreground">{label}</span>}
      {value !== undefined && <span>{value}</span>}
      {children}
    </Wrapper>
  )
}

// Animated XP counter
function XPCounter({ xp }: { xp: number }) {
  const [displayXp, setDisplayXp] = useState(xp)

  useEffect(() => {
    if (displayXp !== xp) {
      const diff = xp - displayXp
      const step = Math.max(1, Math.abs(diff) / 20)
      const interval = setInterval(() => {
        setDisplayXp((prev) => {
          const next = prev + (diff > 0 ? step : -step)
          if ((diff > 0 && next >= xp) || (diff < 0 && next <= xp)) {
            clearInterval(interval)
            return xp
          }
          return Math.round(next)
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [xp, displayXp])

  return (
    <span className="font-mono tabular-nums">{Math.round(displayXp).toLocaleString()}</span>
  )
}

// Streak flame with intensity
function StreakFlame({ streak }: { streak: number }) {
  const intensity = Math.min(streak / 7, 1) // Max intensity at 7-day streak
  const isActive = streak > 0

  return (
    <motion.div
      className={cn(
        "flex items-center gap-1",
        isActive ? "text-orange-400" : "text-muted-foreground"
      )}
      animate={isActive ? { scale: [1, 1.05, 1] } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        animate={isActive ? {
          filter: [
            `drop-shadow(0 0 ${2 + intensity * 4}px rgba(251, 146, 60, ${0.3 + intensity * 0.4}))`,
            `drop-shadow(0 0 ${4 + intensity * 6}px rgba(251, 146, 60, ${0.5 + intensity * 0.4}))`,
            `drop-shadow(0 0 ${2 + intensity * 4}px rgba(251, 146, 60, ${0.3 + intensity * 0.4}))`,
          ],
        } : undefined}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <Flame className="size-3.5" />
      </motion.div>
      <span className="font-bold">{streak}</span>
    </motion.div>
  )
}

// Next objective with action
function NextObjective({
  title,
  topicTitle,
  questionId,
  onNavigate,
}: {
  title: string
  topicTitle: string
  questionId: string
  onNavigate: () => void
}) {
  return (
    <motion.button
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all group"
      onClick={onNavigate}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Target className="size-3.5 text-primary shrink-0" />
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-xs text-muted-foreground shrink-0">Next:</span>
        <span className="text-xs font-medium text-foreground truncate max-w-[200px]">
          {title}
        </span>
      </div>
      <ChevronRight className="size-3.5 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </motion.button>
  )
}

// Motivational messages that rotate
function StatusMessage({
  userName,
  rank,
  streak,
  level,
  weeklyXp,
  percentComplete,
}: {
  userName: string
  rank: string
  streak: number
  level: number
  weeklyXp: number
  percentComplete: number
}) {
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = useMemo(() => {
    const msgs: { icon: React.ComponentType<{ className?: string }>; text: string; type: "info" | "success" | "warning" }[] = []

    // Context-aware messages
    if (streak >= 7) {
      msgs.push({ icon: Flame, text: `🔥 ${streak}-day streak! You're on fire!`, type: "success" })
    } else if (streak > 0) {
      msgs.push({ icon: Clock, text: `Keep it up! ${7 - streak} more days to 7-day streak`, type: "info" })
    } else {
      msgs.push({ icon: Flame, text: "Start your streak today!", type: "warning" })
    }

    msgs.push({ icon: TrendingUp, text: `${weeklyXp.toLocaleString()} XP this week`, type: "info" })
    msgs.push({ icon: Sparkles, text: `Level ${level} • ${rank} League`, type: "info" })

    if (percentComplete >= 90) {
      msgs.push({ icon: CheckCircle2, text: `Almost there! ${percentComplete}% complete`, type: "success" })
    } else if (percentComplete >= 50) {
      msgs.push({ icon: BookOpen, text: `${percentComplete}% of course completed`, type: "info" })
    }

    msgs.push({ icon: Code2, text: `Great progress, ${userName.split(' ')[0]}!`, type: "success" })

    return msgs
  }, [userName, rank, streak, level, weeklyXp, percentComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length])

  const currentMessage = messages[messageIndex]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={messageIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <currentMessage.icon className={cn(
          "size-3",
          currentMessage.type === "success" && "text-green-400",
          currentMessage.type === "warning" && "text-amber-400"
        )} />
        <span>{currentMessage.text}</span>
      </motion.div>
    </AnimatePresence>
  )
}

export function MentorHUD() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Animate in on route change
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 150)
    return () => clearTimeout(timer)
  }, [pathname])

  const { data: progression } = useQuery<ProgressionData>({
    queryKey: ["progression"],
    queryFn: async () => {
      const res = await fetch("/api/progression")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    enabled: !!session?.user,
    refetchInterval: 30000,
  })

  const { data: rankData } = useQuery<RankData>({
    queryKey: ["rank"],
    queryFn: async () => {
      const res = await fetch("/api/rank")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    enabled: !!session?.user,
    refetchInterval: 30000,
  })

  const { data: courses } = useQuery<CourseProgress>({
    queryKey: ["courseProgress"],
    queryFn: async () => {
      const res = await fetch("/api/courses")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()

      const enrolled = data.find((c: any) => c.isEnrolled)
      if (!enrolled) {
        return {
          totalWeeks: 9,
          completedWeeks: 0,
          currentWeek: 1,
          totalTopics: 0,
          completedTopics: 0,
          percentComplete: 0,
        }
      }

      const totalTopics = enrolled.weeks?.reduce((acc: number, w: any) => acc + (w.topics?.length || 0), 0) || 0
      const completedTopics = enrolled.weeks?.reduce((acc: number, w: any) => {
        return acc + (w.topics?.filter((t: any) => t.isCompleted).length || 0)
      }, 0) || 0

      return {
        totalWeeks: enrolled.weeks?.length || 9,
        completedWeeks: enrolled.weeks?.filter((w: any) => w.topics?.every((t: any) => t.isCompleted)).length || 0,
        currentWeek: enrolled.currentWeek || 1,
        totalTopics,
        completedTopics,
        percentComplete: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      }
    },
    enabled: !!session?.user,
    refetchInterval: 60000,
  })

  // Fetch next question to practice
  const { data: nextQuestion } = useQuery<{ questionId?: string; title?: string; topicTitle?: string }>({
    queryKey: ["nextQuestionHUD"],
    queryFn: async () => {
      const res = await fetch("/api/next-question")
      if (!res.ok) return {}
      return res.json()
    },
    enabled: !!session?.user && !pathname?.startsWith("/practice"),
    refetchInterval: 60000,
  })

  const handleNavigateToQuestion = useCallback(() => {
    if (nextQuestion?.questionId) {
      router.push(`/practice/${nextQuestion.questionId}`)
    }
  }, [router, nextQuestion])

  // Don't show on auth pages or during practice (use minimal mode there)
  if (!session?.user || pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null
  }

  const userName = session.user.name || session.user.email?.split("@")[0] || "Coder"
  const streak = progression?.currentStreak || 0
  const xp = progression?.xp || 0
  const level = progression?.level || 1
  const rank = rankData?.currentRank || "BRONZE"
  const weeklyXp = rankData?.weeklyXp || 0
  const percentComplete = courses?.percentComplete || 0
  const currentWeek = courses?.currentWeek || 1
  const rankColors = RANK_COLORS[rank] || RANK_COLORS.BRONZE

  // Compact mode for practice pages
  const isPracticePage = pathname?.startsWith("/practice")

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="pointer-events-auto">
            {/* VS Code-style status bar */}
            <div
              className="flex items-center justify-between h-6 px-2 text-[11px] border-t"
              style={{
                background: "linear-gradient(180deg, rgba(30, 27, 45, 0.98) 0%, rgba(20, 18, 35, 0.99) 100%)",
                borderColor: "rgba(79, 70, 229, 0.2)",
              }}
            >
              {/* Left section */}
              <div className="flex items-center gap-0.5">
                {/* Rank badge */}
                <StatusSegment
                  icon={Trophy}
                  value={rank}
                  className={cn(rankColors.text)}
                />

                <div className="w-px h-3 bg-border/50 mx-1" />

                {/* Level */}
                <StatusSegment
                  icon={Sparkles}
                  label="Lv"
                  value={level}
                  className="text-purple-400"
                />

                <div className="w-px h-3 bg-border/50 mx-1" />

                {/* XP */}
                <StatusSegment
                  icon={Zap}
                  className="text-yellow-400"
                >
                  <XPCounter xp={xp} />
                  <span className="text-muted-foreground ml-0.5">XP</span>
                </StatusSegment>

                <div className="w-px h-3 bg-border/50 mx-1" />

                {/* Streak */}
                <div className="flex items-center px-2 py-1">
                  <StreakFlame streak={streak} />
                </div>
              </div>

              {/* Center - rotating status message */}
              <div className="flex-1 flex justify-center items-center min-w-0 px-4">
                <StatusMessage
                  userName={userName}
                  rank={rank}
                  streak={streak}
                  level={level}
                  weeklyXp={weeklyXp}
                  percentComplete={percentComplete}
                />
              </div>

              {/* Right section */}
              <div className="flex items-center gap-0.5">
                {/* Week progress */}
                <StatusSegment
                  icon={BookOpen}
                  label="Week"
                  value={currentWeek}
                  className="text-blue-400"
                />

                <div className="w-px h-3 bg-border/50 mx-1" />

                {/* Course completion */}
                <StatusSegment
                  icon={CheckCircle2}
                  value={`${percentComplete}%`}
                  className={cn(
                    percentComplete >= 80 ? "text-green-400" :
                    percentComplete >= 50 ? "text-blue-400" :
                    "text-muted-foreground"
                  )}
                />

                {/* Next question button - only show when not on practice page */}
                {!isPracticePage && nextQuestion?.questionId && (
                  <>
                    <div className="w-px h-3 bg-border/50 mx-1" />
                    <motion.button
                      className="flex items-center gap-1 px-2 py-1 rounded-sm bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                      onClick={handleNavigateToQuestion}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="size-3 fill-current" />
                      <span className="font-medium">Practice</span>
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Simplified floating status for mobile
export function MentorHUDMobile() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const { data: progression } = useQuery<ProgressionData>({
    queryKey: ["progression"],
    enabled: !!session?.user,
  })

  if (!session?.user || pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null
  }

  const streak = progression?.currentStreak || 0
  const xp = progression?.xp || 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-[60] sm:hidden"
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(30, 27, 45, 0.95) 0%, rgba(20, 18, 35, 0.98) 100%)",
          border: "1px solid rgba(79, 70, 229, 0.3)",
        }}
      >
        <StreakFlame streak={streak} />
        <div className="w-px h-4 bg-border/50" />
        <div className="flex items-center gap-1 text-yellow-400">
          <Zap className="size-3.5" />
          <span className="text-xs font-bold">{xp.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  )
}
