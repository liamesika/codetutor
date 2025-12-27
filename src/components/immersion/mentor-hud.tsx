"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { Flame, Trophy, User, Zap } from "lucide-react"

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
}

const RANK_COLORS: Record<string, { primary: string; glow: string }> = {
  BRONZE: { primary: "#CD7F32", glow: "rgba(205, 127, 50, 0.4)" },
  SILVER: { primary: "#C0C0C0", glow: "rgba(192, 192, 192, 0.4)" },
  GOLD: { primary: "#FFD700", glow: "rgba(255, 215, 0, 0.4)" },
  PLATINUM: { primary: "#E5E4E2", glow: "rgba(229, 228, 226, 0.5)" },
  DIAMOND: { primary: "#B9F2FF", glow: "rgba(185, 242, 255, 0.5)" },
}

const MENTOR_MESSAGES = [
  { key: "ahead", template: "You're ahead of {percent}% of students" },
  { key: "rankup", template: "{count} challenges to rank up" },
  { key: "streak", template: "Don't lose your streak today" },
  { key: "unlock", template: "This step unlocks your next rank" },
  { key: "pace", template: "Great pace, {name}!" },
  { key: "close", template: "You're close to {nextRank}" },
  { key: "level", template: "Level {level} unlocked new content" },
  { key: "weekly", template: "{xp} XP earned this week" },
]

function CircularProgress({
  percent,
  size = 32,
  strokeWidth = 3
}: {
  percent: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(79, 70, 229, 0.2)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#4F46E5"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: "drop-shadow(0 0 4px rgba(79, 70, 229, 0.5))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{Math.round(percent)}%</span>
      </div>
    </div>
  )
}

function RankBadge({ rank }: { rank: string }) {
  const colors = RANK_COLORS[rank] || RANK_COLORS.BRONZE

  return (
    <motion.div
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{
        background: `${colors.primary}20`,
        color: colors.primary,
        boxShadow: `0 0 8px ${colors.glow}`,
      }}
      animate={{
        boxShadow: [
          `0 0 8px ${colors.glow}`,
          `0 0 12px ${colors.glow}`,
          `0 0 8px ${colors.glow}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Trophy className="size-3" />
      {rank}
    </motion.div>
  )
}

function StreakCounter({ streak }: { streak: number }) {
  const isActive = streak > 0

  return (
    <motion.div
      className="flex items-center gap-1"
      animate={isActive ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        animate={isActive ? {
          filter: [
            "drop-shadow(0 0 4px rgba(251, 146, 60, 0.5))",
            "drop-shadow(0 0 8px rgba(251, 146, 60, 0.8))",
            "drop-shadow(0 0 4px rgba(251, 146, 60, 0.5))",
          ],
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Flame className={`size-4 ${isActive ? "text-orange-400" : "text-gray-500"}`} />
      </motion.div>
      <span className={`text-sm font-bold ${isActive ? "text-orange-400" : "text-gray-500"}`}>
        {streak}
      </span>
    </motion.div>
  )
}

function MentorMessage({
  name,
  rank,
  nextRank,
  level,
  weeklyXp,
  challengesToRankUp,
}: {
  name: string
  rank: string
  nextRank: string | null
  level: number
  weeklyXp: number
  challengesToRankUp: number
}) {
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = useMemo(() => {
    const available: string[] = []

    // Randomize percent
    const percent = 60 + Math.floor(Math.random() * 30)
    available.push(`You're ahead of ${percent}% of students`)

    if (challengesToRankUp > 0 && challengesToRankUp <= 5) {
      available.push(`${challengesToRankUp} challenge${challengesToRankUp > 1 ? 's' : ''} to rank up`)
    }

    available.push("Don't lose your streak today")

    if (nextRank) {
      available.push(`You're close to ${nextRank}`)
    }

    available.push(`Great pace, ${name.split(' ')[0]}!`)
    available.push(`${weeklyXp} XP earned this week`)
    available.push(`Level ${level} unlocked new content`)

    return available
  }, [name, nextRank, level, weeklyXp, challengesToRankUp])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="text-xs text-[#9CA3AF] italic"
      >
        {messages[messageIndex]}
      </motion.p>
    </AnimatePresence>
  )
}

export function MentorHUD() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  // Animate in on route change
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 100)
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

      // Calculate progress from courses data
      const enrolled = data.find((c: any) => c.isEnrolled)
      if (!enrolled) return { totalWeeks: 9, completedWeeks: 0, currentWeek: 1, totalTopics: 0, completedTopics: 0, percentComplete: 0 }

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

  // Don't show on auth pages
  if (!session?.user || pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null
  }

  const userName = session.user.name || session.user.email?.split("@")[0] || "Coder"
  const streak = progression?.currentStreak || 0
  const rank = rankData?.currentRank || "BRONZE"
  const nextRank = rankData?.nextRank || null
  const level = progression?.level || 1
  const weeklyXp = rankData?.weeklyXp || 0
  const currentWeek = courses?.currentWeek || 1
  const percentComplete = courses?.percentComplete || 0
  const challengesToRankUp = Math.ceil((rankData?.xpToNextRank || 100) / 100)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
          style={{
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          <div
            className="pointer-events-auto mx-auto max-w-4xl px-4 py-2"
          >
            <div
              className="rounded-xl px-4 py-2 flex items-center justify-between gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(15, 14, 38, 0.95) 0%, rgba(30, 27, 75, 0.9) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(79, 70, 229, 0.1)",
              }}
            >
              {/* Left: User */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-7 rounded-full bg-[#4F46E5]/20 flex items-center justify-center shrink-0">
                  <User className="size-4 text-[#4F46E5]" />
                </div>
                <span className="text-sm font-medium text-white truncate hidden sm:block">
                  {userName.split(' ')[0]}
                </span>
              </div>

              {/* Center: Week & Progress */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#9CA3AF]">Week {currentWeek}</span>
                  <CircularProgress percent={percentComplete} size={28} strokeWidth={2.5} />
                </div>
                <MentorMessage
                  name={userName}
                  rank={rank}
                  nextRank={nextRank}
                  level={level}
                  weeklyXp={weeklyXp}
                  challengesToRankUp={challengesToRankUp}
                />
              </div>

              {/* Right: Streak & Rank */}
              <div className="flex items-center gap-3">
                <StreakCounter streak={streak} />
                <RankBadge rank={rank} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
