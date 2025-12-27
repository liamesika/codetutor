"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Sparkles, ChevronRight, AlertTriangle, Gift, Zap } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

interface DailyLoginOverlayProps {
  isOpen: boolean
  streak: number
  bonusXp: number
  streakReset: boolean
  previousStreak: number
  onClose: () => void
}

function MicroConfetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 30,
    delay: Math.random() * 0.4,
    color: ["#F59E0B", "#EF4444", "#22D3EE", "#10B981", "#4F46E5"][
      Math.floor(Math.random() * 5)
    ],
    size: 4 + Math.random() * 6,
    angle: Math.random() * 360,
    distance: 80 + Math.random() * 200,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180
        const endX = Math.cos(radians) * p.distance
        const endY = Math.sin(radians) * p.distance

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: "40%",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: endX,
              y: endY,
              opacity: [1, 1, 0],
              scale: [0, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}

function XpFlyUp({ amount }: { amount: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: -80, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.8 }}
    >
      <div className="flex items-center gap-1 text-2xl font-bold text-[#22D3EE]">
        <Zap className="size-6" />
        +{amount} XP
      </div>
    </motion.div>
  )
}

function FlameIcon({ streak }: { streak: number }) {
  const isMilestone = [7, 14, 30, 60, 100].includes(streak)

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 12, delay: 0.2 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-6 rounded-full"
        style={{
          background: isMilestone
            ? "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Flame container */}
      <motion.div
        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center"
        style={{
          background: isMilestone
            ? "linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(239,68,68,0.2) 100%)"
            : "linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(249,115,22,0.2) 100%)",
          boxShadow: isMilestone
            ? "0 0 40px rgba(245,158,11,0.5), inset 0 0 20px rgba(255,255,255,0.1)"
            : "0 0 30px rgba(239,68,68,0.4), inset 0 0 20px rgba(255,255,255,0.1)",
        }}
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Flame
          className="size-12 md:size-16"
          style={{
            color: isMilestone ? "#F59E0B" : "#EF4444",
            filter: "drop-shadow(0 0 15px currentColor)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

function StreakCounter({ streak }: { streak: number }) {
  const [displayStreak, setDisplayStreak] = useState(Math.max(1, streak - 2))

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayStreak(prev => {
          if (prev >= streak) {
            clearInterval(interval)
            return streak
          }
          return prev + 1
        })
      }, 100)

      return () => clearInterval(interval)
    }, 600)

    return () => clearTimeout(timer)
  }, [streak])

  return (
    <motion.div
      className="text-5xl md:text-7xl font-black"
      style={{
        background: "linear-gradient(135deg, #EF4444 0%, #F59E0B 50%, #EF4444 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 0 20px rgba(239,68,68,0.6))",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.4, type: "spring", damping: 10 }}
    >
      {displayStreak}
    </motion.div>
  )
}

export function DailyLoginOverlay({
  isOpen,
  streak,
  bonusXp,
  streakReset,
  previousStreak,
  onClose,
}: DailyLoginOverlayProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const isMilestone = [7, 14, 30, 60, 100].includes(streak)

  useEffect(() => {
    if (isOpen && !streakReset) {
      const timer = setTimeout(() => setShowConfetti(true), 300)
      return () => clearTimeout(timer)
    }
    setShowConfetti(false)
  }, [isOpen, streakReset])

  // Haptic feedback
  useEffect(() => {
    if (isOpen && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([30, 50, 100])
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center"
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
          />

          {/* Confetti */}
          {showConfetti && <MicroConfetti />}

          {/* XP Fly up */}
          <XpFlyUp amount={bonusXp} />

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-md"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -30 }}
            transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
          >
            {/* Streak reset message */}
            {streakReset && previousStreak > 1 && (
              <motion.div
                className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AlertTriangle className="size-5 text-amber-500" />
                <span className="text-sm text-amber-400">
                  {previousStreak} day streak reset, but your progress stays!
                </span>
              </motion.div>
            )}

            {/* Flame icon */}
            <FlameIcon streak={streak} />

            {/* Streak number */}
            <div className="mt-6 mb-2 text-center">
              <StreakCounter streak={streak} />
              <motion.p
                className="text-lg text-[#9CA3AF] mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Day Streak
              </motion.p>
            </div>

            {/* Title */}
            <motion.div
              className="text-center mt-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {isMilestone ? (
                  <>
                    <Gift className="size-5 text-[#F59E0B]" />
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      Milestone Reached!
                    </h2>
                    <Gift className="size-5 text-[#F59E0B]" />
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 text-[#F59E0B]" />
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      Welcome Back!
                    </h2>
                    <Sparkles className="size-5 text-[#F59E0B]" />
                  </>
                )}
              </div>

              <p className="text-[#9CA3AF]">
                You earned{" "}
                <span className="font-bold text-[#22D3EE]">+{bonusXp} XP</span>
                {" "}today
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <NeonButton
                onClick={onClose}
                className="w-full py-4 text-lg"
                rightIcon={<ChevronRight className="size-5" />}
              >
                Continue
              </NeonButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
