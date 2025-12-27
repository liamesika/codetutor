"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Flame, Zap, Trophy, ChevronUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserProgressData {
  xp: number
  level: number
  xpToNextLevel: number
  xpProgress: number
  currentStreak: number
  bestStreak: number
  totalSolved: number
}

interface ProgressHeaderProps {
  compact?: boolean
  className?: string
}

export function ProgressHeader({ compact = false, className }: ProgressHeaderProps) {
  const { data: progress, isLoading } = useQuery<UserProgressData>({
    queryKey: ["user-progress"],
    queryFn: async () => {
      const res = await fetch("/api/progression")
      if (!res.ok) throw new Error("Failed to load progress")
      return res.json()
    },
    refetchInterval: 30000, // Refresh every 30s
  })

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#1E1B4B]" />
          <div className="flex-1">
            <div className="h-3 w-24 rounded bg-[#1E1B4B] mb-2" />
            <div className="h-2 w-full rounded bg-[#1E1B4B]" />
          </div>
        </div>
      </div>
    )
  }

  if (!progress) return null

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {/* Level badge */}
        <div className="relative">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center">
            <span className="text-xs font-bold text-white">{progress.level}</span>
          </div>
        </div>

        {/* XP mini bar */}
        <div className="flex-1 max-w-[100px]">
          <div className="h-1.5 bg-[#1E1B4B] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]"
              initial={{ width: 0 }}
              animate={{ width: `${progress.xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Streak */}
        {progress.currentStreak > 0 && (
          <div className="flex items-center gap-1">
            <Flame className="size-4 text-orange-500" />
            <span className="text-xs font-medium text-orange-500">{progress.currentStreak}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main progress row */}
      <div className="flex items-center gap-4">
        {/* Level badge */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] blur-lg opacity-50" />

          <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <span className="text-xs text-white/80 font-medium -mb-0.5">LVL</span>
            <span className="text-xl font-bold text-white">{progress.level}</span>
          </div>
        </motion.div>

        {/* XP section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-[#22D3EE]" />
              <span className="text-sm font-medium text-white">
                {progress.xp.toLocaleString()} XP
              </span>
            </div>
            <span className="text-xs text-[#6B7280]">
              {progress.xpToNextLevel.toLocaleString()} to level {progress.level + 1}
            </span>
          </div>

          {/* XP progress bar */}
          <div className="relative h-3 bg-[#1E1B4B] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4F46E5] via-[#22D3EE] to-[#10B981] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.xpProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6">
        {/* Streak */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={cn(
            "p-2 rounded-xl",
            progress.currentStreak > 0 ? "bg-orange-500/20" : "bg-[#1E1B4B]"
          )}>
            <Flame className={cn(
              "size-5",
              progress.currentStreak > 0 ? "text-orange-500" : "text-[#6B7280]"
            )} />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Streak</p>
            <p className={cn(
              "font-bold",
              progress.currentStreak > 0 ? "text-orange-500" : "text-[#6B7280]"
            )}>
              {progress.currentStreak} {progress.currentStreak === 1 ? "day" : "days"}
            </p>
          </div>
        </motion.div>

        {/* Best streak */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-2 rounded-xl bg-yellow-500/20">
            <Trophy className="size-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Best</p>
            <p className="font-bold text-yellow-500">{progress.bestStreak} days</p>
          </div>
        </motion.div>

        {/* Problems solved */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-2 rounded-xl bg-[#10B981]/20">
            <Sparkles className="size-5 text-[#10B981]" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Solved</p>
            <p className="font-bold text-[#10B981]">{progress.totalSolved}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface XPGainAnimationProps {
  amount: number
  breakdown?: { label: string; amount: number }[]
  leveledUp?: boolean
  onComplete?: () => void
}

export function XPGainAnimation({ amount, breakdown, leveledUp, onComplete }: XPGainAnimationProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={onComplete}
      >
        {/* XP gain popup */}
        <motion.div
          className="bg-[#1E1B4B]/95 backdrop-blur-xl border border-[#4F46E5]/30 rounded-2xl p-6 shadow-[0_0_60px_rgba(79,70,229,0.4)]"
          initial={{ scale: 0.5, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex flex-col items-center gap-3">
            {/* Main XP gain */}
            <motion.div
              className="flex items-center gap-2 text-2xl font-bold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Zap className="size-8 text-[#22D3EE]" />
              <span className="text-[#22D3EE]">+{amount} XP</span>
            </motion.div>

            {/* Breakdown */}
            {breakdown && breakdown.length > 0 && (
              <div className="space-y-1.5 w-full">
                {breakdown.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <span className="text-[#9CA3AF]">{item.label}</span>
                    <span className="text-[#22D3EE]">+{item.amount}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Level up */}
            {leveledUp && (
              <motion.div
                className="flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B]/20 to-[#EF4444]/20 border border-[#F59E0B]/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <ChevronUp className="size-5 text-[#F59E0B]" />
                <span className="font-bold text-[#F59E0B]">Level Up!</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Confetti for level up */}
        {leveledUp && <Confetti />}
      </motion.div>
    </AnimatePresence>
  )
}

function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ["#4F46E5", "#22D3EE", "#10B981", "#F59E0B", "#EF4444"][Math.floor(Math.random() * 5)],
    size: 4 + Math.random() * 8,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: "120vh",
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  )
}
