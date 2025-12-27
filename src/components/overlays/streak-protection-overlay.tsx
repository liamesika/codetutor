"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import {
  Flame,
  Clock,
  Shield,
  Crown,
  ChevronRight,
  AlertTriangle,
  Zap
} from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { cn } from "@/lib/utils"

interface StreakProtectionOverlayProps {
  isOpen: boolean
  currentStreak: number
  hoursRemaining: number
  minutesRemaining: number
  hasShield: boolean
  isPro: boolean
  onClose: () => void
  onStartPractice: () => void
  onUseShield: () => void
  onUpgrade: () => void
}

// Animated flame that flickers more urgently
function UrgentFlame({ streak }: { streak: number }) {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 10, delay: 0.2 }}
    >
      {/* Urgent pulsing glow */}
      <motion.div
        className="absolute -inset-8 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(245,158,11,0.2) 50%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Flame container with shake */}
      <motion.div
        className="relative w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(245,158,11,0.2) 100%)",
          boxShadow: "0 0 50px rgba(239,68,68,0.5), inset 0 0 30px rgba(255,255,255,0.1)",
        }}
        animate={{
          rotate: [0, 3, -3, 2, -2, 0],
          scale: [1, 1.02, 0.98, 1],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <motion.div
          animate={{
            scale: [1, 0.9, 1.1, 1],
            y: [0, 2, -2, 0],
          }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          <Flame
            className="size-14"
            style={{
              color: "#EF4444",
              filter: "drop-shadow(0 0 20px #EF4444) drop-shadow(0 0 40px #F59E0B)",
            }}
          />
        </motion.div>

        {/* Streak number badge */}
        <motion.div
          className="absolute -bottom-2 -right-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-full w-10 h-10 flex items-center justify-center border-2 border-white/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
        >
          <span className="text-white font-bold text-sm">{streak}</span>
        </motion.div>
      </motion.div>

      {/* Floating embers */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? "#EF4444" : "#F59E0B",
            left: "50%",
            top: "40%",
          }}
          animate={{
            y: [-20, -60],
            x: [0, (Math.random() - 0.5) * 40],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  )
}

// Countdown timer display
function CountdownDisplay({
  hours,
  minutes,
}: {
  hours: number
  minutes: number
}) {
  const isUrgent = hours < 3

  return (
    <motion.div
      className="flex items-center gap-4 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Hours */}
      <motion.div
        className={cn(
          "flex flex-col items-center px-4 py-2 rounded-xl border",
          isUrgent
            ? "bg-red-500/10 border-red-500/30"
            : "bg-card/50 border-white/10"
        )}
        animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <span
          className={cn(
            "text-3xl font-bold",
            isUrgent ? "text-red-400" : "text-white"
          )}
        >
          {hours.toString().padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">hours</span>
      </motion.div>

      <span className="text-2xl text-muted-foreground">:</span>

      {/* Minutes */}
      <motion.div
        className={cn(
          "flex flex-col items-center px-4 py-2 rounded-xl border",
          isUrgent
            ? "bg-red-500/10 border-red-500/30"
            : "bg-card/50 border-white/10"
        )}
        animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      >
        <span
          className={cn(
            "text-3xl font-bold",
            isUrgent ? "text-red-400" : "text-white"
          )}
        >
          {minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">mins</span>
      </motion.div>
    </motion.div>
  )
}

// Shield option component
function ShieldOption({
  hasShield,
  isPro,
  onUseShield,
  onUpgrade,
}: {
  hasShield: boolean
  isPro: boolean
  onUseShield: () => void
  onUpgrade: () => void
}) {
  if (!isPro) {
    return (
      <motion.button
        onClick={onUpgrade}
        className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Crown className="size-5 text-amber-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-amber-400">Unlock Streak Shield</p>
            <p className="text-xs text-amber-400/70">
              PRO members get 1 shield per month
            </p>
          </div>
          <ChevronRight className="size-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.button>
    )
  }

  if (!hasShield) {
    return (
      <motion.div
        className="w-full p-4 rounded-xl bg-card/50 border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center">
            <Shield className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-muted-foreground">Shield Used</p>
            <p className="text-xs text-muted-foreground/70">
              Shield resets next month
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.button
      onClick={onUseShield}
      className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="size-5 text-purple-400" />
        </motion.div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-purple-300">Use Streak Shield</p>
          <p className="text-xs text-purple-400/70">
            Protect your streak for 24 hours
          </p>
        </div>
        <ChevronRight className="size-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  )
}

export function StreakProtectionOverlay({
  isOpen,
  currentStreak,
  hoursRemaining,
  minutesRemaining,
  hasShield,
  isPro,
  onClose,
  onStartPractice,
  onUseShield,
  onUpgrade,
}: StreakProtectionOverlayProps) {
  // Haptic feedback
  useEffect(() => {
    if (isOpen && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100])
    }
  }, [isOpen])

  const isUrgent = hoursRemaining < 3

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Urgent backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: isUrgent
                ? "radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, rgba(15,14,38,0.98) 50%)"
                : "rgba(15, 14, 38, 0.95)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Pulsing edge warning */}
          {isUrgent && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 100px rgba(239,68,68,0.3)",
              }}
              animate={{
                boxShadow: [
                  "inset 0 0 100px rgba(239,68,68,0.3)",
                  "inset 0 0 150px rgba(239,68,68,0.5)",
                  "inset 0 0 100px rgba(239,68,68,0.3)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          {/* Main content */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-gradient-to-b from-card/90 to-card/70 rounded-2xl border border-red-500/30 overflow-hidden"
            style={{
              boxShadow: "0 0 60px rgba(239, 68, 68, 0.2), 0 0 120px rgba(245, 158, 11, 0.1)",
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            {/* Warning banner */}
            <motion.div
              className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 flex items-center justify-center gap-2"
              animate={{
                backgroundColor: [
                  "rgba(239, 68, 68, 0.2)",
                  "rgba(239, 68, 68, 0.3)",
                  "rgba(239, 68, 68, 0.2)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle className="size-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">
                Streak at Risk!
              </span>
            </motion.div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center">
              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-center mb-2"
                style={{
                  background: "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Don't Lose Your Flame!
              </motion.h2>

              <motion.p
                className="text-muted-foreground text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Your {currentStreak} day streak is about to expire
              </motion.p>

              {/* Flame */}
              <div className="my-6">
                <UrgentFlame streak={currentStreak} />
              </div>

              {/* Countdown */}
              <motion.div
                className="flex items-center gap-2 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Clock className="size-4" />
                <span className="text-sm">Time remaining</span>
              </motion.div>

              <CountdownDisplay hours={hoursRemaining} minutes={minutesRemaining} />

              {/* Actions */}
              <div className="w-full mt-6 space-y-3">
                {/* Primary CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <NeonButton
                    onClick={onStartPractice}
                    className="w-full py-4 text-lg"
                    rightIcon={<Zap className="size-5" />}
                  >
                    Practice Now
                  </NeonButton>
                </motion.div>

                {/* Shield option */}
                <ShieldOption
                  hasShield={hasShield}
                  isPro={isPro}
                  onUseShield={onUseShield}
                  onUpgrade={onUpgrade}
                />

                {/* Skip */}
                <motion.button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Remind me later
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Compact streak warning banner for dashboard
export function StreakWarningBanner({
  currentStreak,
  hoursRemaining,
  minutesRemaining,
  onAction,
}: {
  currentStreak: number
  hoursRemaining: number
  minutesRemaining: number
  onAction: () => void
}) {
  const isUrgent = hoursRemaining < 3

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "w-full p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors",
        isUrgent
          ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
          : "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20"
      )}
      onClick={onAction}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Flame className={cn("size-5", isUrgent ? "text-red-500" : "text-amber-500")} />
      </motion.div>

      <div className="flex-1">
        <p className={cn("text-sm font-medium", isUrgent ? "text-red-400" : "text-amber-400")}>
          {currentStreak} day streak at risk!
        </p>
        <p className="text-xs text-muted-foreground">
          {hoursRemaining}h {minutesRemaining}m remaining
        </p>
      </div>

      <div className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium",
        isUrgent
          ? "bg-red-500/20 text-red-400"
          : "bg-amber-500/20 text-amber-400"
      )}>
        Practice
      </div>
    </motion.div>
  )
}
