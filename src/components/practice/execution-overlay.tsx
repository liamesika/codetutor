"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code2, Loader2, CheckCircle2, XCircle, Zap, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

export type ExecutionPhase = "preparing" | "executing" | "checking" | "complete" | "error"

interface ExecutionOverlayProps {
  isVisible: boolean
  phase: ExecutionPhase
  message?: string
}

const phaseConfig: Record<ExecutionPhase, {
  icon: typeof Code2
  label: string
  color: string
  bgColor: string
}> = {
  preparing: {
    icon: Code2,
    label: "Preparing...",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  executing: {
    icon: Zap,
    label: "Executing...",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
  },
  checking: {
    icon: Timer,
    label: "Checking tests...",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/20",
  },
  complete: {
    icon: CheckCircle2,
    label: "Complete!",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  error: {
    icon: XCircle,
    label: "Error",
    color: "text-destructive",
    bgColor: "bg-destructive/20",
  },
}

export function ExecutionOverlay({ isVisible, phase, message }: ExecutionOverlayProps) {
  const config = phaseConfig[phase]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Animated Icon Container */}
            <div className="relative">
              {/* Glow */}
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-2xl blur-xl",
                  config.bgColor
                )}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Icon */}
              <motion.div
                className={cn(
                  "relative h-16 w-16 rounded-2xl flex items-center justify-center",
                  config.bgColor,
                  "border",
                  config.color.replace("text-", "border-")
                )}
                animate={
                  phase === "complete" || phase === "error"
                    ? {}
                    : { rotate: [0, 5, -5, 0] }
                }
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {phase === "complete" || phase === "error" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={cn("h-8 w-8", config.color)} />
                  </motion.div>
                ) : (
                  <Loader2 className={cn("h-8 w-8 animate-spin", config.color)} />
                )}
              </motion.div>
            </div>

            {/* Label */}
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <p className={cn("font-medium", config.color)}>{config.label}</p>
              {message && (
                <p className="text-sm text-muted-foreground mt-1">{message}</p>
              )}
            </motion.div>

            {/* Progress dots for non-complete phases */}
            {phase !== "complete" && phase !== "error" && (
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={cn("h-2 w-2 rounded-full", config.bgColor)}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to manage execution phases
export function useExecutionPhase() {
  const [phase, setPhase] = useState<ExecutionPhase>("preparing")
  const [isVisible, setIsVisible] = useState(false)

  const start = () => {
    setIsVisible(true)
    setPhase("preparing")

    // Auto-progress through phases
    setTimeout(() => setPhase("executing"), 200)
    setTimeout(() => setPhase("checking"), 800)
  }

  const complete = (success: boolean) => {
    setPhase(success ? "complete" : "error")
    setTimeout(() => setIsVisible(false), 800)
  }

  const reset = () => {
    setIsVisible(false)
    setPhase("preparing")
  }

  return {
    phase,
    isVisible,
    start,
    complete,
    reset,
  }
}
