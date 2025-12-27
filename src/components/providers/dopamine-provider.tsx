"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Sparkles, CheckCircle2, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"

type FeedbackType = "xp" | "solve" | "streak" | "unlock" | "daily"

interface FeedbackConfig {
  icon: typeof Zap
  color: string
  glowColor: string
  label?: string
}

const FEEDBACK_CONFIGS: Record<FeedbackType, FeedbackConfig> = {
  xp: {
    icon: Zap,
    color: "#22D3EE",
    glowColor: "rgba(34, 211, 238, 0.5)",
  },
  solve: {
    icon: CheckCircle2,
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.5)",
    label: "Solved!",
  },
  streak: {
    icon: Sparkles,
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
  unlock: {
    icon: Unlock,
    color: "#818CF8",
    glowColor: "rgba(129, 140, 248, 0.5)",
    label: "Unlocked!",
  },
  daily: {
    icon: Sparkles,
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
}

interface FeedbackItem {
  id: string
  type: FeedbackType
  value?: number
  label?: string
  x: number
  y: number
}

interface DopamineContextType {
  triggerXpFlyUp: (amount: number, x?: number, y?: number) => void
  triggerSolveFeedback: (x?: number, y?: number) => void
  triggerStreakFeedback: (streak: number, x?: number, y?: number) => void
  triggerUnlockFeedback: (label: string, x?: number, y?: number) => void
  triggerMicroConfetti: (x?: number, y?: number) => void
}

const DopamineContext = createContext<DopamineContextType | null>(null)

export function useDopamine() {
  const context = useContext(DopamineContext)
  if (!context) {
    throw new Error("useDopamine must be used within DopamineProvider")
  }
  return context
}

function XpFlyUp({ item, onComplete }: { item: FeedbackItem; onComplete: () => void }) {
  const config = FEEDBACK_CONFIGS[item.type]
  const Icon = config.icon
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(mediaQuery.matches)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(onComplete, 1500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed pointer-events-none z-[80]"
      style={{ left: item.x, top: item.y }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={
        prefersReducedMotion
          ? { opacity: [0, 1, 0], y: -30, scale: 1 }
          : { opacity: [0, 1, 1, 0], y: -80, scale: [0.5, 1.2, 1] }
      }
      transition={{ duration: prefersReducedMotion ? 0.8 : 1.2 }}
    >
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-lg"
        style={{
          color: config.color,
          backgroundColor: `${config.color}20`,
          boxShadow: `0 0 20px ${config.glowColor}`,
        }}
      >
        <Icon className="size-5" />
        {item.value !== undefined && `+${item.value}`}
        {item.label && item.label}
        {config.label && !item.label && config.label}
      </div>
    </motion.div>
  )
}

function MicroConfetti({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: ["#4F46E5", "#22D3EE", "#10B981", "#F59E0B", "#EF4444"][Math.floor(Math.random() * 5)],
    size: 4 + Math.random() * 4,
    angle: Math.random() * 360,
    distance: 40 + Math.random() * 80,
  }))

  useEffect(() => {
    const timer = setTimeout(onComplete, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="fixed pointer-events-none z-[80]"
      style={{ left: x, top: y }}
    >
      {particles.map(p => {
        const radians = (p.angle * Math.PI) / 180
        const endX = Math.cos(radians) * p.distance
        const endY = Math.sin(radians) * p.distance

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
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
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}

export function DopamineProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [confettiItems, setConfettiItems] = useState<Array<{ id: string; x: number; y: number }>>([])

  const generateId = () => `${Date.now()}-${Math.random()}`

  const getCenter = () => {
    if (typeof window === "undefined") return { x: 0, y: 0 }
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
  }

  const triggerXpFlyUp = useCallback((amount: number, x?: number, y?: number) => {
    const center = getCenter()
    const id = generateId()
    setFeedbacks(prev => [
      ...prev,
      {
        id,
        type: "xp",
        value: amount,
        x: x ?? center.x,
        y: y ?? center.y,
      },
    ])
  }, [])

  const triggerSolveFeedback = useCallback((x?: number, y?: number) => {
    const center = getCenter()
    const id = generateId()
    setFeedbacks(prev => [
      ...prev,
      {
        id,
        type: "solve",
        x: x ?? center.x,
        y: y ?? center.y,
      },
    ])
    // Also trigger confetti
    setConfettiItems(prev => [...prev, { id, x: x ?? center.x, y: y ?? center.y }])
  }, [])

  const triggerStreakFeedback = useCallback((streak: number, x?: number, y?: number) => {
    const center = getCenter()
    const id = generateId()
    setFeedbacks(prev => [
      ...prev,
      {
        id,
        type: "streak",
        label: `${streak} day streak!`,
        x: x ?? center.x,
        y: y ?? center.y,
      },
    ])
  }, [])

  const triggerUnlockFeedback = useCallback((label: string, x?: number, y?: number) => {
    const center = getCenter()
    const id = generateId()
    setFeedbacks(prev => [
      ...prev,
      {
        id,
        type: "unlock",
        label,
        x: x ?? center.x,
        y: y ?? center.y,
      },
    ])
    setConfettiItems(prev => [...prev, { id, x: x ?? center.x, y: y ?? center.y }])
  }, [])

  const triggerMicroConfetti = useCallback((x?: number, y?: number) => {
    const center = getCenter()
    const id = generateId()
    setConfettiItems(prev => [...prev, { id, x: x ?? center.x, y: y ?? center.y }])
  }, [])

  const removeFeedback = useCallback((id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }, [])

  const removeConfetti = useCallback((id: string) => {
    setConfettiItems(prev => prev.filter(c => c.id !== id))
  }, [])

  return (
    <DopamineContext.Provider
      value={{
        triggerXpFlyUp,
        triggerSolveFeedback,
        triggerStreakFeedback,
        triggerUnlockFeedback,
        triggerMicroConfetti,
      }}
    >
      {children}

      {/* XP Fly-ups */}
      <AnimatePresence>
        {feedbacks.map(item => (
          <XpFlyUp
            key={item.id}
            item={item}
            onComplete={() => removeFeedback(item.id)}
          />
        ))}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {confettiItems.map(item => (
          <MicroConfetti
            key={item.id}
            x={item.x}
            y={item.y}
            onComplete={() => removeConfetti(item.id)}
          />
        ))}
      </AnimatePresence>
    </DopamineContext.Provider>
  )
}
