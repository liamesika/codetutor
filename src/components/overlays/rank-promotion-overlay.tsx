"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, TrendingUp, TrendingDown, ChevronRight, Sparkles, Shield, Gem, Diamond } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { RANK_CONFIG } from "@/lib/ranks"
import type { Rank } from "@prisma/client"

interface RankPromotionOverlayProps {
  isOpen: boolean
  previousRank: Rank
  newRank: Rank
  isPromotion: boolean
  onClose: () => void
}

function ConfettiExplosion() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    delay: Math.random() * 0.3,
    color: ["#4F46E5", "#22D3EE", "#10B981", "#F59E0B", "#818CF8"][
      Math.floor(Math.random() * 5)
    ],
    size: 5 + Math.random() * 8,
    angle: Math.random() * 360,
    distance: 100 + Math.random() * 300,
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
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: "45%",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: endX,
              y: endY,
              opacity: [1, 1, 0],
              scale: [0, 1, 0.4],
              rotate: Math.random() * 720 - 360,
            }}
            transition={{
              duration: 1.4,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}

function getRankIcon(rank: Rank) {
  switch (rank) {
    case "DIAMOND":
      return Diamond
    case "PLATINUM":
      return Gem
    case "GOLD":
      return Crown
    default:
      return Shield
  }
}

export function RankPromotionOverlay({
  isOpen,
  previousRank,
  newRank,
  isPromotion,
  onClose,
}: RankPromotionOverlayProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const config = RANK_CONFIG[newRank]
  const RankIcon = getRankIcon(newRank)

  useEffect(() => {
    if (isOpen && isPromotion) {
      const timer = setTimeout(() => setShowConfetti(true), 200)
      return () => clearTimeout(timer)
    }
    setShowConfetti(false)
  }, [isOpen, isPromotion])

  // Haptic feedback
  useEffect(() => {
    if (isOpen && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(isPromotion ? [50, 30, 100, 30, 50] : [100, 50])
    }
  }, [isOpen, isPromotion])

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

          {/* Confetti for promotions */}
          {showConfetti && isPromotion && <ConfettiExplosion />}

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-md"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -30 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            {/* Rank badge */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
            >
              {/* Glow */}
              <motion.div
                className="absolute -inset-8 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Badge */}
              <div
                className={`relative w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center bg-gradient-to-br ${config.bgGradient} border-2`}
                style={{
                  borderColor: config.color,
                  boxShadow: `0 0 50px ${config.glowColor}, inset 0 0 30px rgba(255,255,255,0.1)`,
                }}
              >
                <RankIcon
                  className="size-14 md:size-18"
                  style={{ color: config.color }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                {isPromotion ? (
                  <>
                    <TrendingUp className="size-6 text-[#10B981]" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                      Promoted!
                    </h2>
                    <TrendingUp className="size-6 text-[#10B981]" />
                  </>
                ) : (
                  <>
                    <TrendingDown className="size-6 text-[#EF4444]" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                      Demoted
                    </h2>
                    <TrendingDown className="size-6 text-[#EF4444]" />
                  </>
                )}
              </div>

              <p className="text-lg text-[#9CA3AF]">
                {isPromotion ? "You reached" : "You dropped to"}{" "}
                <span className="font-bold" style={{ color: config.color }}>
                  {config.name}
                </span>
              </p>

              {isPromotion && (
                <motion.div
                  className="flex items-center justify-center gap-1 mt-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Sparkles className="size-4 text-[#F59E0B]" />
                  <span className="text-sm text-[#F59E0B]">
                    Keep climbing the ranks!
                  </span>
                  <Sparkles className="size-4 text-[#F59E0B]" />
                </motion.div>
              )}

              {!isPromotion && (
                <motion.p
                  className="mt-3 text-sm text-[#6B7280]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Don&apos;t give up! You can climb back up.
                </motion.p>
              )}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <NeonButton
                onClick={onClose}
                className="w-full py-4 text-lg"
                rightIcon={<ChevronRight className="size-5" />}
              >
                {isPromotion ? "Keep Going" : "Try Again"}
              </NeonButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
