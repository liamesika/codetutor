"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code2, Loader2, CheckCircle2, XCircle, Zap, Timer, RefreshCw, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type ExecutionPhase = "preparing" | "executing" | "checking" | "complete" | "error" | "timeout"

interface ExecutionOverlayProps {
  isVisible: boolean
  phase: ExecutionPhase
  message?: string
  onRetry?: () => void
  executionTime?: number
}

const phaseConfig: Record<ExecutionPhase, {
  icon: typeof Code2
  label: string
  sublabel?: string
  color: string
  bgColor: string
  glowColor: string
}> = {
  preparing: {
    icon: Code2,
    label: "Preparing",
    sublabel: "Compiling your code...",
    color: "text-[#4F46E5]",
    bgColor: "bg-[#4F46E5]/20",
    glowColor: "rgba(79, 70, 229, 0.4)",
  },
  executing: {
    icon: Zap,
    label: "Executing",
    sublabel: "Running your solution...",
    color: "text-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/20",
    glowColor: "rgba(245, 158, 11, 0.4)",
  },
  checking: {
    icon: Timer,
    label: "Checking Tests",
    sublabel: "Validating output...",
    color: "text-[#22D3EE]",
    bgColor: "bg-[#22D3EE]/20",
    glowColor: "rgba(34, 211, 238, 0.4)",
  },
  complete: {
    icon: CheckCircle2,
    label: "Complete!",
    sublabel: "All tests passed",
    color: "text-[#10B981]",
    bgColor: "bg-[#10B981]/20",
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
  error: {
    icon: XCircle,
    label: "Failed",
    sublabel: "Check the results below",
    color: "text-[#EF4444]",
    bgColor: "bg-[#EF4444]/20",
    glowColor: "rgba(239, 68, 68, 0.4)",
  },
  timeout: {
    icon: AlertTriangle,
    label: "Connection Issue",
    sublabel: "Executor unavailable",
    color: "text-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/20",
    glowColor: "rgba(245, 158, 11, 0.4)",
  },
}

// Progress indicator component
function PhaseProgress({ currentPhase }: { currentPhase: ExecutionPhase }) {
  const phases = ["preparing", "executing", "checking"] as const
  const currentIndex = phases.indexOf(currentPhase as typeof phases[number])
  const isTerminal = currentPhase === "complete" || currentPhase === "error" || currentPhase === "timeout"

  return (
    <div className="flex items-center gap-2 mt-4">
      {phases.map((phase, index) => {
        const isActive = index === currentIndex && !isTerminal
        const isComplete = index < currentIndex || (isTerminal && currentPhase === "complete")
        const isFailed = isTerminal && currentPhase !== "complete" && index >= currentIndex

        return (
          <div key={phase} className="flex items-center">
            <motion.div
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                isComplete && "bg-[#10B981]",
                isActive && "bg-[#22D3EE]",
                isFailed && "bg-[#EF4444]/50",
                !isActive && !isComplete && !isFailed && "bg-[#4F46E5]/30"
              )}
              animate={isActive ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
            />
            {index < phases.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1 transition-colors duration-300",
                  index < currentIndex || (isTerminal && currentPhase === "complete")
                    ? "bg-[#10B981]"
                    : "bg-[#4F46E5]/20"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ExecutionOverlay({ isVisible, phase, message, onRetry, executionTime }: ExecutionOverlayProps) {
  const config = phaseConfig[phase]
  const Icon = config.icon
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(mediaQuery.matches)
    }
  }, [])

  const isTerminal = phase === "complete" || phase === "error" || phase === "timeout"
  const showRetry = phase === "timeout" && onRetry

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: "rgba(15, 14, 38, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Animated background gradient */}
          {!prefersReducedMotion && !isTerminal && (
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  `radial-gradient(circle at 30% 30%, ${config.glowColor} 0%, transparent 50%)`,
                  `radial-gradient(circle at 70% 70%, ${config.glowColor} 0%, transparent 50%)`,
                  `radial-gradient(circle at 30% 30%, ${config.glowColor} 0%, transparent 50%)`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="flex flex-col items-center gap-5 px-8 py-10 rounded-3xl relative"
            style={{
              background: "linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(79, 70, 229, 0.15) 100%)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
              boxShadow: `0 0 60px ${config.glowColor}, inset 0 0 30px rgba(255,255,255,0.02)`,
            }}
          >
            {/* Icon Container with glow */}
            <div className="relative">
              {/* Outer glow ring */}
              {!prefersReducedMotion && !isTerminal && (
                <motion.div
                  className="absolute -inset-4 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, ${config.glowColor}, transparent, ${config.glowColor})`,
                    filter: "blur(12px)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Inner glow */}
              <motion.div
                className={cn("absolute inset-0 rounded-2xl blur-xl", config.bgColor)}
                animate={
                  prefersReducedMotion || isTerminal
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Icon box */}
              <motion.div
                className={cn(
                  "relative h-20 w-20 rounded-2xl flex items-center justify-center",
                  config.bgColor,
                  "border border-current/20"
                )}
                style={{
                  boxShadow: `0 0 30px ${config.glowColor}`,
                }}
                animate={
                  prefersReducedMotion || isTerminal
                    ? {}
                    : { rotate: [0, 3, -3, 0] }
                }
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {isTerminal ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon className={cn("h-10 w-10", config.color)} />
                  </motion.div>
                ) : (
                  <Loader2 className={cn("h-10 w-10 animate-spin", config.color)} />
                )}
              </motion.div>
            </div>

            {/* Labels */}
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <p className={cn("text-xl font-bold", config.color)}>{config.label}</p>
              <p className="text-sm text-[#9CA3AF] mt-1">
                {message || config.sublabel}
              </p>
              {executionTime !== undefined && isTerminal && (
                <p className="text-xs text-[#6B7280] mt-2">
                  Completed in {executionTime}ms
                </p>
              )}
            </motion.div>

            {/* Phase progress indicator */}
            <PhaseProgress currentPhase={phase} />

            {/* Retry button for timeout */}
            {showRetry && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="mt-2 gap-2 border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </motion.div>
            )}

            {/* Animated dots for non-terminal phases */}
            {!isTerminal && (
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={cn("h-2 w-2 rounded-full", config.bgColor)}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3],
                          }
                    }
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

// Enhanced hook to manage execution phases with timeout handling
export function useExecutionPhase(timeoutMs: number = 30000) {
  const [phase, setPhase] = useState<ExecutionPhase>("preparing")
  const [isVisible, setIsVisible] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined)

  const start = useCallback(() => {
    setIsVisible(true)
    setPhase("preparing")
    setStartTime(Date.now())
    setExecutionTime(undefined)

    // Auto-progress through phases with slight delays for visual feedback
    const executeTimer = setTimeout(() => setPhase("executing"), 300)
    const checkTimer = setTimeout(() => setPhase("checking"), 1000)

    // Timeout handler
    const timeoutTimer = setTimeout(() => {
      setPhase("timeout")
    }, timeoutMs)

    return () => {
      clearTimeout(executeTimer)
      clearTimeout(checkTimer)
      clearTimeout(timeoutTimer)
    }
  }, [timeoutMs])

  const complete = useCallback((success: boolean) => {
    if (startTime) {
      setExecutionTime(Date.now() - startTime)
    }
    setPhase(success ? "complete" : "error")

    // Auto-hide after brief display
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, success ? 1200 : 1500)

    return () => clearTimeout(hideTimer)
  }, [startTime])

  const reset = useCallback(() => {
    setIsVisible(false)
    setPhase("preparing")
    setStartTime(null)
    setExecutionTime(undefined)
  }, [])

  const setError = useCallback((isTimeout: boolean = false) => {
    if (startTime) {
      setExecutionTime(Date.now() - startTime)
    }
    setPhase(isTimeout ? "timeout" : "error")
  }, [startTime])

  return {
    phase,
    isVisible,
    executionTime,
    start,
    complete,
    reset,
    setError,
    setPhase,
  }
}
