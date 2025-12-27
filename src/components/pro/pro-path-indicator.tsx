"use client"

import { motion } from "framer-motion"
import { Crown, Lock, ChevronRight, Sparkles, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// PRO skill paths configuration
export const PRO_PATHS = {
  "advanced-algorithms": {
    title: "Advanced Algorithms",
    description: "Master complex algorithms and data structures",
    icon: Star,
    color: "from-purple-500 to-indigo-500",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  "system-design": {
    title: "System Design",
    description: "Learn to architect scalable systems",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    glow: "rgba(34, 211, 238, 0.4)",
  },
  "competitive-programming": {
    title: "Competitive Programming",
    description: "Train for coding competitions",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  "interview-prep": {
    title: "Interview Prep",
    description: "Prepare for technical interviews",
    icon: Sparkles,
    color: "from-emerald-500 to-green-500",
    glow: "rgba(16, 185, 129, 0.4)",
  },
}

interface ProPathCardProps {
  pathId: keyof typeof PRO_PATHS
  isUnlocked: boolean
  isPro: boolean
  progress?: number
  onSelect?: () => void
  onUpgrade?: () => void
}

export function ProPathCard({
  pathId,
  isUnlocked,
  isPro,
  progress = 0,
  onSelect,
  onUpgrade,
}: ProPathCardProps) {
  const path = PRO_PATHS[pathId]
  const Icon = path.icon

  const isLocked = !isPro || !isUnlocked

  return (
    <motion.div
      className={cn(
        "relative p-4 rounded-xl border transition-all",
        isLocked
          ? "border-amber-500/30 bg-amber-500/5 cursor-pointer"
          : "border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer"
      )}
      onClick={isLocked ? onUpgrade : onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* PRO badge */}
      <motion.div
        className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        PRO PATH
      </motion.div>

      {/* Lock shimmer effect */}
      {isLocked && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.15) 50%, transparent 100%)",
            }}
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            isLocked
              ? "bg-amber-500/20"
              : `bg-gradient-to-br ${path.color}`
          )}
          style={{
            boxShadow: isLocked ? undefined : `0 0 20px ${path.glow}`,
          }}
          animate={isLocked ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isLocked ? (
            <Lock className="size-5 text-amber-500" />
          ) : (
            <Icon className="size-6 text-white" />
          )}
        </motion.div>

        {/* Info */}
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold mb-1",
            isLocked ? "text-amber-200/70" : "text-white"
          )}>
            {path.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {path.description}
          </p>

          {/* Progress bar if unlocked */}
          {!isLocked && progress > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full bg-gradient-to-r", path.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action indicator */}
        <div className="flex-shrink-0 self-center">
          {isLocked ? (
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1">
              <Crown className="size-3" />
              Unlock
            </div>
          ) : (
            <ChevronRight className="size-5 text-muted-foreground" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Mini path indicator for skill tree nodes
export function ProPathNodeIndicator({
  className,
}: {
  className?: string
}) {
  return (
    <motion.div
      className={cn(
        "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center",
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.3 }}
    >
      <Crown className="size-2.5 text-white" />
    </motion.div>
  )
}

// PRO skill tree section header
export function ProPathSectionHeader({
  isPro,
  onUpgrade,
}: {
  isPro: boolean
  onUpgrade?: () => void
}) {
  return (
    <motion.div
      className="relative p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative flex items-center gap-3">
        <motion.div
          className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Crown className="size-5 text-white" />
        </motion.div>

        <div className="flex-1">
          <h3 className="font-bold text-amber-400">PRO Skill Paths</h3>
          <p className="text-sm text-muted-foreground">
            {isPro ? "Exclusive content for PRO members" : "Unlock with PRO membership"}
          </p>
        </div>

        {!isPro && (
          <motion.button
            onClick={onUpgrade}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upgrade
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
