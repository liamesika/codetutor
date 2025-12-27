"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

type MentorState = "calm" | "proud" | "warning" | "hyped"

interface MentorEvent {
  type: MentorState
  duration?: number
}

// Global event emitter for mentor state changes
const mentorEventListeners = new Set<(event: MentorEvent) => void>()

export function emitMentorEvent(event: MentorEvent) {
  mentorEventListeners.forEach((listener) => listener(event))
}

// Utility hooks for other components to trigger mentor states
export function useMentorTriggers() {
  return {
    onSolveSuccess: () => emitMentorEvent({ type: "proud", duration: 3000 }),
    onSolveFail: () => emitMentorEvent({ type: "warning", duration: 2000 }),
    onRankUp: () => emitMentorEvent({ type: "hyped", duration: 4000 }),
    onStreakMilestone: () => emitMentorEvent({ type: "hyped", duration: 3500 }),
    onDailyLogin: () => emitMentorEvent({ type: "proud", duration: 2500 }),
  }
}

const AVATAR_EXPRESSIONS: Record<MentorState, {
  emoji: string
  color: string
  glow: string
  scale: number
  rotation: number
}> = {
  calm: {
    emoji: "🧑‍💻",
    color: "#4F46E5",
    glow: "rgba(79, 70, 229, 0.3)",
    scale: 1,
    rotation: 0,
  },
  proud: {
    emoji: "🎉",
    color: "#10B981",
    glow: "rgba(16, 185, 129, 0.4)",
    scale: 1.1,
    rotation: 5,
  },
  warning: {
    emoji: "🤔",
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    scale: 0.95,
    rotation: -3,
  },
  hyped: {
    emoji: "🚀",
    color: "#EC4899",
    glow: "rgba(236, 72, 153, 0.5)",
    scale: 1.15,
    rotation: 10,
  },
}

const IDLE_ANIMATIONS = {
  calm: {
    y: [0, -3, 0],
    rotate: [0, 1, 0, -1, 0],
  },
  proud: {
    y: [0, -5, 0],
    rotate: [0, 3, 0, -3, 0],
    scale: [1.1, 1.15, 1.1],
  },
  warning: {
    y: [0, -2, 0],
    rotate: [-3, -5, -3],
  },
  hyped: {
    y: [0, -8, 0, -4, 0],
    rotate: [10, 15, 10, 5, 10],
    scale: [1.15, 1.2, 1.15],
  },
}

export function MentorAvatar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [state, setState] = useState<MentorState>("calm")
  const [isVisible, setIsVisible] = useState(true)

  // Listen for mentor events
  useEffect(() => {
    const handleEvent = (event: MentorEvent) => {
      setState(event.type)
      if (event.duration) {
        setTimeout(() => setState("calm"), event.duration)
      }
    }

    mentorEventListeners.add(handleEvent)
    return () => {
      mentorEventListeners.delete(handleEvent)
    }
  }, [])

  // Hide on auth pages
  const shouldShow = session?.user && !pathname?.startsWith("/login") && !pathname?.startsWith("/signup")

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false)
          } else {
            setIsVisible(true)
          }
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const expression = AVATAR_EXPRESSIONS[state]
  const animation = IDLE_ANIMATIONS[state]

  if (!shouldShow) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-24 right-4 z-50 md:bottom-8"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <motion.div
            className="relative"
            animate={animation}
            transition={{
              duration: state === "hyped" ? 0.5 : state === "proud" ? 1 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  `0 0 15px ${expression.glow}`,
                  `0 0 25px ${expression.glow}`,
                  `0 0 15px ${expression.glow}`,
                ],
              }}
              transition={{
                duration: state === "hyped" ? 0.3 : 1.5,
                repeat: Infinity,
              }}
              style={{
                transform: "scale(1.2)",
              }}
            />

            {/* Avatar bubble */}
            <motion.div
              className="relative size-12 md:size-14 rounded-full flex items-center justify-center cursor-pointer select-none"
              style={{
                background: `linear-gradient(135deg, ${expression.color}30 0%, ${expression.color}10 100%)`,
                border: `2px solid ${expression.color}50`,
                boxShadow: `0 4px 20px ${expression.glow}`,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-2xl md:text-3xl"
                animate={{
                  scale: [expression.scale, expression.scale * 1.05, expression.scale],
                  rotate: [expression.rotation, expression.rotation + 5, expression.rotation],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {expression.emoji}
              </motion.span>
            </motion.div>

            {/* State indicator dot */}
            <motion.div
              className="absolute -top-0.5 -right-0.5 size-3 rounded-full"
              style={{
                background: expression.color,
                boxShadow: `0 0 8px ${expression.color}`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
