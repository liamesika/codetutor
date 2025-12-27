"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronRight, Zap } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

interface SkillUnlockNode {
  id: string
  title: string
  description: string
  icon: string
  color: string
  branchPath: string[]
}

interface SkillUnlockOverlayProps {
  isOpen: boolean
  node: SkillUnlockNode | null
  onClose: () => void
}

// Particle burst on unlock
function ParticleWaveBurst() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    angle: (i / 60) * 360,
    delay: Math.random() * 0.2,
    color: ["#4F46E5", "#22D3EE", "#10B981", "#818CF8", "#06B6D4"][
      Math.floor(Math.random() * 5)
    ],
    size: 3 + Math.random() * 6,
    distance: 150 + Math.random() * 200,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180
        const endX = Math.cos(radians) * p.distance
        const endY = Math.sin(radians) * p.distance

        return (
          <motion.div
            key={p.id}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 0,
            }}
            animate={{
              x: endX,
              y: endY,
              opacity: [1, 1, 0],
              scale: [0, 1.5, 0.5],
            }}
            transition={{
              duration: 1.2,
              delay: 0.3 + p.delay,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}

// Energy orb with expansion burst
function EnergyOrb({ color }: { color: string }) {
  return (
    <div className="relative w-40 h-40 md:w-52 md:h-52">
      {/* Core orb */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}60 0%, ${color}20 50%, transparent 70%)`,
          boxShadow: `
            0 0 60px ${color}80,
            0 0 120px ${color}40,
            inset 0 0 60px ${color}30
          `,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 100,
          delay: 0.1,
        }}
      />

      {/* Expansion burst */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `3px solid ${color}`,
          boxShadow: `0 0 40px ${color}60`,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1.5, 1.2],
          opacity: [0, 1, 0.6],
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: "easeOut",
        }}
      />

      {/* Shockwave rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}40`,
          }}
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 2 + i * 0.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.5,
            delay: 0.4 + i * 0.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Inner glow */}
      <motion.div
        className="absolute inset-8 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Zap
          className="size-12 md:size-16"
          style={{ color, filter: `drop-shadow(0 0 20px ${color})` }}
        />
      </motion.div>
    </div>
  )
}

// Branch path breadcrumb
function BranchPath({ path, color }: { path: string[]; color: string }) {
  if (path.length === 0) return null

  return (
    <motion.div
      className="flex items-center justify-center flex-wrap gap-2 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {path.map((node, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.span
            className="text-xs md:text-sm px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${color}20`,
              color: color,
              border: `1px solid ${color}40`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            {node}
          </motion.span>
          {i < path.length - 1 && (
            <ChevronRight
              className="size-4 text-[#6B7280]"
              style={{ opacity: 0.5 }}
            />
          )}
        </div>
      ))}
    </motion.div>
  )
}

export function SkillUnlockOverlay({
  isOpen,
  node,
  onClose,
}: SkillUnlockOverlayProps) {
  const nodeColor = node?.color || "#4F46E5"

  // Haptic feedback for mobile
  useEffect(() => {
    if (isOpen && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([30, 20, 80, 30, 50])
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (node) {
      // Mark as acknowledged in localStorage
      const key = `skillunlock-${node.id}-acknowledged`
      localStorage.setItem(key, "true")
    }
    onClose()
  }, [node, onClose])

  return (
    <AnimatePresence>
      {isOpen && node && (
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

          {/* Particle wave burst */}
          <ParticleWaveBurst />

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
              delay: 0.1,
            }}
          >
            {/* Energy orb */}
            <div className="mb-6">
              <EnergyOrb color={nodeColor} />
            </div>

            {/* Subtitle */}
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="size-4 text-[#F59E0B]" />
              <span className="text-sm uppercase tracking-widest text-[#9CA3AF]">
                New Skill Unlocked
              </span>
              <Sparkles className="size-4 text-[#F59E0B]" />
            </motion.div>

            {/* Node title */}
            <motion.h2
              className="text-2xl md:text-4xl font-black text-center mb-3"
              style={{
                background: `linear-gradient(135deg, ${nodeColor} 0%, #22D3EE 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 0 20px ${nodeColor}80)`,
              }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.4,
                type: "spring",
                damping: 15,
              }}
            >
              {node.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-center text-[#9CA3AF] text-sm md:text-base mb-6 max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {node.description}
            </motion.p>

            {/* Branch path breadcrumb */}
            <BranchPath path={node.branchPath} color={nodeColor} />

            {/* Wave glow effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${nodeColor}15 0%, transparent 60%)`,
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
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
              className="w-full max-w-xs fixed bottom-8 left-1/2 -translate-x-1/2 md:relative md:bottom-auto md:left-auto md:translate-x-0 mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <NeonButton
                onClick={handleClose}
                className="w-full py-4 text-lg"
                rightIcon={<ChevronRight className="size-5" />}
                style={{
                  "--neon-color": nodeColor,
                } as React.CSSProperties}
              >
                Start Skill Path
              </NeonButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to manage skill unlock state
export function useSkillUnlock() {
  const [unlockData, setUnlockData] = useState<{
    isOpen: boolean
    node: SkillUnlockNode | null
  }>({
    isOpen: false,
    node: null,
  })

  const triggerSkillUnlock = useCallback((node: SkillUnlockNode) => {
    // Check if already acknowledged
    const key = `skillunlock-${node.id}-acknowledged`
    if (typeof window !== "undefined" && localStorage.getItem(key) === "true") {
      return
    }

    // Check session to prevent multiple triggers in same session
    const sessionKey = `skillunlock-${node.id}-session`
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey) === "true") {
      return
    }

    setUnlockData({
      isOpen: true,
      node,
    })

    // Mark in session
    if (typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, "true")
    }
  }, [])

  const closeSkillUnlock = useCallback(() => {
    setUnlockData((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return {
    ...unlockData,
    triggerSkillUnlock,
    closeSkillUnlock,
  }
}
