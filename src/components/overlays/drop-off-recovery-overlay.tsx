"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import {
  Bookmark,
  Gift,
  ChevronRight,
  Zap,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { cn } from "@/lib/utils"

interface ResumeQuestion {
  id: string
  title: string
  topicTitle: string
  weekNumber: number
  savedAt: string
}

interface DropOffRecoveryOverlayProps {
  isOpen: boolean
  inactivityStatus: "returning_soon" | "returning" | "long_absence"
  daysInactive: number
  bonusXpAvailable: number
  resumeQuestion: ResumeQuestion | null
  onClose: () => void
  onResume: () => void
  onClaimBonus: () => void
  onStartFresh: () => void
}

// Animated welcome back icon
function WelcomeBackIcon({ status }: { status: string }) {
  const getColor = () => {
    switch (status) {
      case "returning_soon": return "#22D3EE"
      case "returning": return "#8B5CF6"
      case "long_absence": return "#F59E0B"
      default: return "#22D3EE"
    }
  }

  const color = getColor()

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
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Icon container */}
      <motion.div
        className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
          boxShadow: `0 0 40px ${color}50, inset 0 0 20px rgba(255,255,255,0.1)`,
        }}
      >
        {status === "long_absence" ? (
          <Gift className="size-12" style={{ color, filter: `drop-shadow(0 0 15px ${color})` }} />
        ) : (
          <Sparkles className="size-12" style={{ color, filter: `drop-shadow(0 0 15px ${color})` }} />
        )}
      </motion.div>

      {/* Orbiting particles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: color,
            top: "50%",
            left: "50%",
            marginTop: -6,
            marginLeft: -6,
          }}
          animate={{
            x: Math.cos((i * 120 * Math.PI) / 180) * 50,
            y: Math.sin((i * 120 * Math.PI) / 180) * 50,
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  )
}

// Saved question card
function SavedQuestionCard({
  question,
  onResume,
}: {
  question: ResumeQuestion
  onResume: () => void
}) {
  return (
    <motion.button
      onClick={onResume}
      className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-left group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bookmark className="size-5 text-cyan-400" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-cyan-400 font-medium">
              Week {question.weekNumber} • {question.topicTitle}
            </span>
          </div>
          <p className="font-semibold text-white truncate">
            {question.title}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="size-3" />
            Saved your progress
          </p>
        </div>

        <ChevronRight className="size-5 text-cyan-400 group-hover:translate-x-1 transition-transform mt-2" />
      </div>
    </motion.button>
  )
}

// Bonus XP claim button
function BonusClaimButton({
  amount,
  status,
  onClaim,
}: {
  amount: number
  status: string
  onClaim: () => void
}) {
  const getLabel = () => {
    switch (status) {
      case "returning_soon": return "Quick Return Bonus"
      case "returning": return "Welcome Back Bonus"
      case "long_absence": return "We Missed You!"
      default: return "Bonus XP"
    }
  }

  const getColor = () => {
    switch (status) {
      case "returning_soon": return { bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/30", text: "text-cyan-400" }
      case "returning": return { bg: "from-purple-500/10 to-indigo-500/10", border: "border-purple-500/30", text: "text-purple-400" }
      case "long_absence": return { bg: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/30", text: "text-amber-400" }
      default: return { bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/30", text: "text-cyan-400" }
    }
  }

  const colors = getColor()

  return (
    <motion.button
      onClick={onClaim}
      className={cn(
        "w-full p-4 rounded-xl bg-gradient-to-r border transition-colors group",
        colors.bg,
        colors.border,
        "hover:opacity-90"
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}
          style={{ background: `linear-gradient(135deg, currentColor 0%, transparent 100%)` }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Gift className={cn("size-6", colors.text)} />
        </motion.div>

        <div className="flex-1 text-left">
          <p className={cn("font-semibold", colors.text)}>{getLabel()}</p>
          <div className="flex items-center gap-1">
            <Zap className="size-4 text-cyan-400" />
            <span className="text-lg font-bold text-white">+{amount} XP</span>
          </div>
        </div>

        <motion.div
          className={cn(
            "px-4 py-2 rounded-lg font-medium",
            colors.bg,
            colors.text
          )}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Claim
        </motion.div>
      </div>
    </motion.button>
  )
}

export function DropOffRecoveryOverlay({
  isOpen,
  inactivityStatus,
  daysInactive,
  bonusXpAvailable,
  resumeQuestion,
  onClose,
  onResume,
  onClaimBonus,
  onStartFresh,
}: DropOffRecoveryOverlayProps) {
  // Haptic feedback
  useEffect(() => {
    if (isOpen && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([30, 50, 100])
    }
  }, [isOpen])

  const getTitle = () => {
    switch (inactivityStatus) {
      case "returning_soon": return "Good to see you!"
      case "returning": return "Welcome back!"
      case "long_absence": return "We missed you!"
      default: return "Welcome back!"
    }
  }

  const getSubtitle = () => {
    if (daysInactive === 1) {
      return "It's been a day - let's keep the momentum going!"
    } else if (daysInactive < 7) {
      return `It's been ${daysInactive} days - let's get back on track!`
    } else {
      return `It's been ${daysInactive} days - we're glad you're here!`
    }
  }

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

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4 + Math.random() * 6,
                  height: 4 + Math.random() * 6,
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  background: i % 2 === 0 ? "rgba(34, 211, 238, 0.4)" : "rgba(139, 92, 246, 0.4)",
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

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
            {/* Content */}
            <div className="p-6 flex flex-col items-center">
              {/* Icon */}
              <WelcomeBackIcon status={inactivityStatus} />

              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-center mt-6 mb-2"
                style={{
                  background: "linear-gradient(135deg, #fff 0%, #22D3EE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {getTitle()}
              </motion.h2>

              <motion.p
                className="text-muted-foreground text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {getSubtitle()}
              </motion.p>

              {/* Saved question */}
              {resumeQuestion && (
                <div className="w-full mb-4">
                  <motion.p
                    className="text-sm text-muted-foreground mb-2 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Bookmark className="size-4" />
                    We saved your place
                  </motion.p>
                  <SavedQuestionCard question={resumeQuestion} onResume={onResume} />
                </div>
              )}

              {/* Bonus XP */}
              {bonusXpAvailable > 0 && (
                <div className="w-full mb-4">
                  <BonusClaimButton
                    amount={bonusXpAvailable}
                    status={inactivityStatus}
                    onClaim={onClaimBonus}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="w-full space-y-3 mt-2">
                {!resumeQuestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <NeonButton
                      onClick={onStartFresh}
                      className="w-full py-4"
                      rightIcon={<ArrowRight className="size-5" />}
                    >
                      Start Practicing
                    </NeonButton>
                  </motion.div>
                )}

                <motion.button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {resumeQuestion ? "Start Fresh Instead" : "Maybe Later"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Compact banner version for dashboard
export function SavedPlaceBanner({
  question,
  onResume,
}: {
  question: ResumeQuestion
  onResume: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 cursor-pointer hover:bg-cyan-500/20 transition-colors"
      onClick={onResume}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bookmark className="size-5 text-cyan-400" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-cyan-400">Continue where you left off</p>
          <p className="text-xs text-muted-foreground truncate">
            {question.title}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium">
          Resume
        </div>
      </div>
    </motion.div>
  )
}
