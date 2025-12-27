"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Loader2, Cpu, Zap, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExecutionOverlayProps {
  isExecuting: boolean
  stage?: "compiling" | "running" | "evaluating"
  testProgress?: { current: number; total: number }
}

// Compact loading indicator with stages
function ExecutionIndicator({
  stage = "compiling",
  testProgress,
}: {
  stage?: "compiling" | "running" | "evaluating"
  testProgress?: { current: number; total: number }
}) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const stages = {
    compiling: { icon: Cpu, label: "Compiling", color: "text-cyan-400" },
    running: { icon: Zap, label: "Executing", color: "text-yellow-400" },
    evaluating: { icon: CheckCircle2, label: "Evaluating", color: "text-green-400" },
  }

  const currentStage = stages[stage]
  const StageIcon = currentStage.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Main indicator card */}
      <div
        className="flex items-center gap-4 px-6 py-4 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(30, 27, 45, 0.95) 0%, rgba(20, 18, 35, 0.98) 100%)",
          border: "1px solid rgba(79, 70, 229, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(79, 70, 229, 0.1)",
        }}
      >
        {/* Animated icon */}
        <motion.div
          className={cn("relative", currentStage.color)}
          animate={{
            rotate: stage === "compiling" ? 360 : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: stage === "compiling" ? Infinity : 0,
            ease: "linear",
          }}
        >
          <StageIcon className="size-8" />
          {stage === "running" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 20px currentColor" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Stage info */}
        <div className="flex flex-col">
          <span className={cn("text-lg font-semibold", currentStage.color)}>
            {currentStage.label}{dots}
          </span>
          {testProgress && stage === "evaluating" && (
            <span className="text-sm text-muted-foreground">
              Test {testProgress.current} of {testProgress.total}
            </span>
          )}
          {!testProgress && (
            <span className="text-sm text-muted-foreground">
              {stage === "compiling" && "Building your code"}
              {stage === "running" && "Executing tests"}
              {stage === "evaluating" && "Checking results"}
            </span>
          )}
        </div>

        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="size-5 text-primary" />
        </motion.div>
      </div>

      {/* Progress bar */}
      {testProgress && (
        <div className="w-64">
          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(testProgress.current / testProgress.total) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Floating particles for ambient effect
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: i % 2 === 0 ? "rgba(34, 211, 238, 0.4)" : "rgba(139, 92, 246, 0.4)",
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function ExecutionOverlay({
  isExecuting,
  stage = "compiling",
  testProgress,
}: ExecutionOverlayProps) {
  // Auto-progress through stages for demo feel
  const [internalStage, setInternalStage] = useState<"compiling" | "running" | "evaluating">("compiling")

  useEffect(() => {
    if (isExecuting) {
      setInternalStage("compiling")

      // Progress through stages automatically
      const timer1 = setTimeout(() => setInternalStage("running"), 800)
      const timer2 = setTimeout(() => setInternalStage("evaluating"), 1800)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [isExecuting])

  // Use prop stage if provided, otherwise use internal
  const displayStage = stage || internalStage

  return (
    <AnimatePresence>
      {isExecuting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          {/* Glass backdrop - shows code behind with blur/dim */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0"
            style={{
              background: "rgba(10, 9, 24, 0.6)",
            }}
          />

          {/* Subtle gradient overlay for focus */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 20%, rgba(10, 9, 24, 0.4) 100%)",
            }}
          />

          {/* Ambient floating particles */}
          <FloatingParticles />

          {/* Edge glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 80px rgba(79, 70, 229, 0.1)",
            }}
            animate={{
              boxShadow: [
                "inset 0 0 80px rgba(79, 70, 229, 0.1)",
                "inset 0 0 100px rgba(79, 70, 229, 0.15)",
                "inset 0 0 80px rgba(79, 70, 229, 0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center content */}
          <div className="relative z-10">
            <ExecutionIndicator stage={displayStage} testProgress={testProgress} />
          </div>

          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Compact inline version for embedded use
export function ExecutionIndicatorInline({
  isExecuting,
  stage = "compiling",
}: {
  isExecuting: boolean
  stage?: "compiling" | "running" | "evaluating"
}) {
  if (!isExecuting) return null

  const stages = {
    compiling: { icon: Cpu, label: "Compiling", color: "text-cyan-400" },
    running: { icon: Zap, label: "Running", color: "text-yellow-400" },
    evaluating: { icon: CheckCircle2, label: "Checking", color: "text-green-400" },
  }

  const currentStage = stages[stage]
  const StageIcon = currentStage.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn("flex items-center gap-2 text-sm", currentStage.color)}
    >
      <motion.div
        animate={{ rotate: stage === "compiling" ? 360 : 0 }}
        transition={{ duration: 1, repeat: stage === "compiling" ? Infinity : 0, ease: "linear" }}
      >
        <StageIcon className="size-4" />
      </motion.div>
      <span className="font-medium">{currentStage.label}</span>
      <Loader2 className="size-3 animate-spin" />
    </motion.div>
  )
}
