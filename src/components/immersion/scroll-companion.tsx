"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Sparkles, Zap, Target, TrendingUp } from "lucide-react"

const NUDGE_MESSAGES = [
  { text: "Nice pace", icon: Zap },
  { text: "Almost there", icon: Target },
  { text: "Keep going", icon: TrendingUp },
  { text: "You're crushing it", icon: Sparkles },
  { text: "This one levels you up", icon: Zap },
  { text: "You're close to ranking up", icon: TrendingUp },
  { text: "Great focus", icon: Target },
  { text: "Momentum building", icon: Sparkles },
]

interface Nudge {
  id: number
  message: typeof NUDGE_MESSAGES[0]
  position: "left" | "right"
  y: number
}

export function ScrollCompanion() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [nudges, setNudges] = useState<Nudge[]>([])
  const lastScrollY = useRef(0)
  const lastNudgeY = useRef(0)
  const nudgeIdRef = useRef(0)
  const isScrollingDown = useRef(true)

  // Only show on learning/practice pages
  const shouldShow = pathname?.includes("/learn") || pathname?.includes("/practice")

  const addNudge = useCallback(() => {
    const message = NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)]
    const position = Math.random() > 0.5 ? "left" : "right"
    const y = window.scrollY + window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.4

    const newNudge: Nudge = {
      id: nudgeIdRef.current++,
      message,
      position,
      y,
    }

    setNudges((prev) => [...prev.slice(-2), newNudge])

    // Auto-remove after animation
    setTimeout(() => {
      setNudges((prev) => prev.filter((n) => n.id !== newNudge.id))
    }, 3000)
  }, [])

  useEffect(() => {
    if (!shouldShow || !session?.user) return

    const handleScroll = () => {
      const currentY = window.scrollY
      const scrollDelta = currentY - lastScrollY.current
      isScrollingDown.current = scrollDelta > 0

      // Only trigger when scrolling down and past threshold
      if (
        isScrollingDown.current &&
        currentY - lastNudgeY.current > window.innerHeight * 2.5
      ) {
        addNudge()
        lastNudgeY.current = currentY
      }

      lastScrollY.current = currentY
    }

    // Throttle scroll handler
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledScroll)
  }, [shouldShow, session?.user, addNudge])

  // Reset on route change
  useEffect(() => {
    lastScrollY.current = 0
    lastNudgeY.current = 0
    setNudges([])
  }, [pathname])

  if (!shouldShow || !session?.user) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {nudges.map((nudge) => (
          <motion.div
            key={nudge.id}
            initial={{
              opacity: 0,
              x: nudge.position === "left" ? -50 : 50,
              y: nudge.y,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: nudge.position === "left" ? -30 : 30,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className={`absolute ${nudge.position === "left" ? "left-4" : "right-4"}`}
            style={{
              top: 0,
              transform: `translateY(${nudge.y}px)`,
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                boxShadow: "0 0 20px rgba(79, 70, 229, 0.2)",
              }}
            >
              <nudge.message.icon className="size-3.5 text-[#8B5CF6]" />
              <span className="text-xs font-medium text-[#E5E7EB]">
                {nudge.message.text}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
