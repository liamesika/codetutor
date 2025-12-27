"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Target,
  Lock,
  Flame,
  Zap,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Clock,
  Star,
  Crown
} from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { cn } from "@/lib/utils"

interface Mission {
  id: string
  missionId: string
  title: string
  description: string
  xpReward: number
  type: string
  targetValue: number
  progress: number
  isPremiumOnly: boolean
  difficulty: string
  completed: boolean
}

interface DailyMissionOverlayProps {
  isOpen: boolean
  missions: Mission[]
  isPro: boolean
  onClose: () => void
  onStartMission: (missionId: string) => void
  onUpgrade: () => void
}

// Animated progress ring
function ProgressRing({
  progress,
  target,
  size = 48,
  strokeWidth = 4,
  color = "#22D3EE"
}: {
  progress: number
  target: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percent = Math.min(progress / target, 1)
  const strokeDashoffset = circumference - percent * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {progress}/{target}
        </span>
      </div>
    </div>
  )
}

// Lock shimmer effect for premium missions
function LockShimmer() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "linear",
        }}
      />
    </motion.div>
  )
}

// Mission card component
function MissionCard({
  mission,
  isPro,
  index,
  onStart,
  onUpgrade,
}: {
  mission: Mission
  isPro: boolean
  index: number
  onStart: () => void
  onUpgrade: () => void
}) {
  const isLocked = mission.isPremiumOnly && !isPro
  const isCompleted = mission.completed

  const difficultyConfig = {
    EASY: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "Easy" },
    NORMAL: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Challenge" },
    CHALLENGE: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", label: "Premium" },
  }

  const config = difficultyConfig[mission.difficulty as keyof typeof difficultyConfig] || difficultyConfig.NORMAL

  const typeIcons: Record<string, typeof Target> = {
    SOLVE: Target,
    STREAK: Flame,
    TIME: Clock,
    ACCURACY: Star,
    PERFECT: Trophy,
    TOPIC: Target,
    REVIEW: CheckCircle2,
  }
  const TypeIcon = typeIcons[mission.type] || Target

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={cn(
        "relative p-4 rounded-xl border transition-all",
        isLocked ? "border-amber-500/30 bg-amber-500/5" : "border-primary/20 bg-card/50",
        isCompleted && "border-green-500/50 bg-green-500/10",
        !isLocked && !isCompleted && "hover:border-primary/40 hover:bg-card/70"
      )}
    >
      {/* Premium lock shimmer */}
      {isLocked && <LockShimmer />}

      <div className="flex items-start gap-4">
        {/* Progress ring or lock icon */}
        <div className="flex-shrink-0">
          {isLocked ? (
            <motion.div
              className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="size-5 text-amber-500" />
            </motion.div>
          ) : isCompleted ? (
            <motion.div
              className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <CheckCircle2 className="size-6 text-green-500" />
            </motion.div>
          ) : (
            <ProgressRing
              progress={mission.progress}
              target={mission.targetValue}
              color={config.color.replace("text-", "#")}
            />
          )}
        </div>

        {/* Mission info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TypeIcon className={cn("size-4", config.color)} />
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg, config.border, "border", config.color)}>
              {config.label}
            </span>
            {isLocked && (
              <span className="flex items-center gap-1 text-xs text-amber-500">
                <Crown className="size-3" />
                PRO
              </span>
            )}
          </div>
          <h3 className={cn(
            "font-semibold truncate",
            isLocked ? "text-amber-200/70" : isCompleted ? "text-green-200" : "text-white"
          )}>
            {mission.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {mission.description}
          </p>
        </div>

        {/* XP reward */}
        <div className="flex-shrink-0 text-right">
          <div className={cn(
            "flex items-center gap-1 font-bold",
            isCompleted ? "text-green-400" : "text-cyan-400"
          )}>
            <Zap className="size-4" />
            <span>{mission.xpReward}</span>
          </div>
          <span className="text-xs text-muted-foreground">XP</span>
        </div>
      </div>

      {/* Action button */}
      {!isCompleted && (
        <motion.div
          className="mt-3 pt-3 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          {isLocked ? (
            <button
              onClick={onUpgrade}
              className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <Crown className="size-4" />
              Unlock with PRO
            </button>
          ) : (
            <button
              onClick={onStart}
              className="w-full py-2 px-4 rounded-lg bg-primary/20 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
            >
              Start Mission
              <ChevronRight className="size-4" />
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// Floating particles
function FloatingMotes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: i % 2 === 0 ? "rgba(34, 211, 238, 0.5)" : "rgba(139, 92, 246, 0.5)",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}

export function DailyMissionOverlay({
  isOpen,
  missions,
  isPro,
  onClose,
  onStartMission,
  onUpgrade,
}: DailyMissionOverlayProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAnimationComplete(false)
      const timer = setTimeout(() => setAnimationComplete(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Haptic feedback on open
  useEffect(() => {
    if (isOpen && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([20, 40, 60])
    }
  }, [isOpen])

  const completedCount = missions.filter(m => m.completed).length
  const totalXp = missions.filter(m => m.completed).reduce((sum, m) => sum + m.xpReward, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0F0E26]/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Floating motes */}
          <FloatingMotes />

          {/* Main card */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-gradient-to-b from-card/90 to-card/70 rounded-2xl border border-primary/20 overflow-hidden"
            style={{
              boxShadow: "0 0 60px rgba(79, 70, 229, 0.2), 0 0 120px rgba(79, 70, 229, 0.1)",
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-white/5">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/20 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Target className="size-6 text-primary" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Daily Missions</h2>
                  <p className="text-sm text-muted-foreground">
                    {completedCount}/{missions.length} completed
                  </p>
                </div>
              </motion.div>

              {/* Progress indicator */}
              {completedCount > 0 && (
                <motion.div
                  className="mt-3 flex items-center gap-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Zap className="size-4 text-cyan-400" />
                  <span className="text-cyan-400 font-medium">+{totalXp} XP earned today</span>
                </motion.div>
              )}
            </div>

            {/* Mission list */}
            <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
              {missions.map((mission, index) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isPro={isPro}
                  index={index}
                  onStart={() => onStartMission(mission.missionId)}
                  onUpgrade={onUpgrade}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
              <NeonButton
                onClick={onClose}
                className="w-full py-3"
                rightIcon={<ChevronRight className="size-5" />}
              >
                {completedCount === missions.length ? "All Done!" : "Continue Learning"}
              </NeonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Floating mission card for dashboard (shows once per session)
export function FloatingMissionCard({
  missions,
  isPro,
  onExpand,
  onDismiss,
}: {
  missions: Mission[]
  isPro: boolean
  onExpand: () => void
  onDismiss: () => void
}) {
  const activeMissions = missions.filter(m => !m.completed)
  const completedCount = missions.length - activeMissions.length

  if (activeMissions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="fixed bottom-20 right-4 z-50 w-72"
    >
      <motion.div
        className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-xl border border-primary/20 p-4 cursor-pointer"
        style={{
          boxShadow: "0 0 30px rgba(79, 70, 229, 0.2), 0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onExpand}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-card/80 transition-colors"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Target className="size-4 text-primary" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-white text-sm">Daily Missions</h3>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{missions.length} done
            </p>
          </div>
        </div>

        {/* First active mission preview */}
        {activeMissions[0] && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <ProgressRing
              progress={activeMissions[0].progress}
              target={activeMissions[0].targetValue}
              size={36}
              strokeWidth={3}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {activeMissions[0].title}
              </p>
              <div className="flex items-center gap-1 text-xs text-cyan-400">
                <Zap className="size-3" />
                <span>+{activeMissions[0].xpReward} XP</span>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        )}

        {/* More missions indicator */}
        {activeMissions.length > 1 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            +{activeMissions.length - 1} more missions
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
