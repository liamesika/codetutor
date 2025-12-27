"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronRight } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

interface LevelUpOverlayProps {
  isOpen: boolean
  newLevel: number
  onClose: () => void
}

const MILESTONE_LEVELS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100]

function ConfettiExplosion() {
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    delay: Math.random() * 0.3,
    color: ["#4F46E5", "#22D3EE", "#10B981", "#F59E0B", "#818CF8", "#06B6D4"][
      Math.floor(Math.random() * 6)
    ],
    size: 6 + Math.random() * 10,
    angle: Math.random() * 360,
    distance: 100 + Math.random() * 400,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180
        const endX = Math.cos(radians) * p.distance
        const endY = Math.sin(radians) * p.distance

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: "50%",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 0
            }}
            animate={{
              x: endX,
              y: endY,
              opacity: [1, 1, 0],
              rotate: Math.random() * 720 - 360,
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}

function GlowRing({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background: "linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(34,211,238,0.3) 100%)",
        boxShadow: "0 0 80px rgba(79,70,229,0.5), 0 0 120px rgba(34,211,238,0.3)",
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: [0.8, 1.2, 1],
        opacity: [0, 0.8, 0.6],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: "easeOut",
      }}
    />
  )
}

function PulsingRings() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-[#4F46E5]/30"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.5 + i * 0.3],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  )
}

function CountUpNumber({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(Math.max(1, target - 3))

  useEffect(() => {
    const startValue = Math.max(1, target - 3)
    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const animate = () => {
      const now = Date.now()
      const progress = Math.min(1, (now - startTime) / (duration * 1000))
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(startValue + (target - startValue) * eased)

      setCurrent(value)

      if (now < endTime) {
        requestAnimationFrame(animate)
      }
    }

    const timer = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 500)

    return () => clearTimeout(timer)
  }, [target, duration])

  return <>{current}</>
}

export function LevelUpOverlay({ isOpen, newLevel, onClose }: LevelUpOverlayProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const isMilestone = MILESTONE_LEVELS.includes(newLevel)

  useEffect(() => {
    if (isOpen && isMilestone) {
      const timer = setTimeout(() => setShowConfetti(true), 300)
      return () => clearTimeout(timer)
    }
    setShowConfetti(false)
  }, [isOpen, isMilestone])

  // Haptic feedback for mobile
  useEffect(() => {
    if (isOpen && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 30, 100])
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    // Mark as acknowledged in localStorage
    const key = `levelup-${newLevel}-acknowledged`
    localStorage.setItem(key, "true")
    onClose()
  }, [newLevel, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
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

          {/* Confetti for milestones */}
          {showConfetti && <ConfettiExplosion />}

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 200,
              delay: 0.1
            }}
          >
            {/* Glowing ring container */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
              {/* Base glow */}
              <GlowRing delay={0} />

              {/* Pulsing rings */}
              <PulsingRings />

              {/* Inner ring */}
              <motion.div
                className="absolute inset-4 rounded-full border-4 border-[#22D3EE]/50"
                style={{
                  boxShadow: "inset 0 0 40px rgba(34,211,238,0.3), 0 0 60px rgba(34,211,238,0.4)",
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 0.2
                }}
              />

              {/* Level number */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", damping: 15 }}
              >
                <span
                  className="text-6xl md:text-8xl font-black"
                  style={{
                    background: "linear-gradient(135deg, #4F46E5 0%, #22D3EE 50%, #818CF8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 30px rgba(79,70,229,0.8))",
                  }}
                >
                  <CountUpNumber target={newLevel} />
                </span>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="flex items-center justify-center gap-2 mb-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="size-6 text-[#F59E0B]" />
                <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                  Level Up!
                </h2>
                <Sparkles className="size-6 text-[#F59E0B]" />
              </motion.div>

              <p className="text-lg md:text-xl text-[#9CA3AF]">
                You reached{" "}
                <span className="font-bold text-[#22D3EE]">Level {newLevel}</span>
              </p>

              {isMilestone && (
                <motion.p
                  className="mt-3 text-sm font-medium text-[#F59E0B]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Milestone Achievement Unlocked!
                </motion.p>
              )}
            </motion.div>

            {/* Wave glow effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(79,70,229,0.1) 0%, transparent 70%)",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* CTA Button - Sticky on mobile */}
            <motion.div
              className="w-full max-w-xs fixed bottom-8 left-1/2 -translate-x-1/2 md:relative md:bottom-auto md:left-auto md:translate-x-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <NeonButton
                onClick={handleClose}
                className="w-full py-4 text-lg"
                rightIcon={<ChevronRight className="size-5" />}
              >
                Continue Journey
              </NeonButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to manage level up state
export function useLevelUp() {
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean
    newLevel: number
    previousLevel: number
  }>({
    isOpen: false,
    newLevel: 1,
    previousLevel: 1,
  })

  const triggerLevelUp = useCallback((previousLevel: number, newLevel: number) => {
    // Check if already acknowledged
    const key = `levelup-${newLevel}-acknowledged`
    if (localStorage.getItem(key) === "true") {
      return
    }

    if (newLevel > previousLevel) {
      setLevelUpData({
        isOpen: true,
        newLevel,
        previousLevel,
      })
    }
  }, [])

  const closeLevelUp = useCallback(() => {
    setLevelUpData((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return {
    ...levelUpData,
    triggerLevelUp,
    closeLevelUp,
  }
}
