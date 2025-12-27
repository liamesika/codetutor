"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Check, ChevronRight, Crown, Zap, Trophy, Star } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { EntitlementPlan } from "@prisma/client"

interface AccessUnlockedOverlayProps {
  isVisible: boolean
  onClose: () => void
  plan?: EntitlementPlan
}

function ConfettiParticle({
  index,
  totalParticles,
}: {
  index: number
  totalParticles: number
}) {
  const colors = ["#4F46E5", "#22D3EE", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"]
  const color = colors[index % colors.length]
  const angle = (index / totalParticles) * 360
  const distance = 150 + Math.random() * 200
  const size = 6 + Math.random() * 8
  const delay = Math.random() * 0.3

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        left: "50%",
        top: "50%",
        boxShadow: `0 0 10px ${color}`,
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        scale: [0, 1, 1, 0.5],
        opacity: [1, 1, 0.8, 0],
        rotate: Math.random() * 720,
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: "easeOut",
      }}
    />
  )
}

function StarBurst() {
  const stars = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      delay: i * 0.05,
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute left-1/2 top-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 1,
            delay: 0.2 + star.delay,
            ease: "easeOut",
          }}
        >
          <Star
            className="size-6"
            style={{
              color: "#F59E0B",
              transform: `translate(-50%, -50%) rotate(${star.angle}deg) translateY(-80px)`,
              filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))",
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

function PerkItem({ icon: Icon, text, delay }: { icon: typeof Check; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", damping: 20 }}
      className="flex items-center gap-3"
    >
      <div className="size-8 rounded-lg bg-[#4F46E5]/20 flex items-center justify-center">
        <Icon className="size-4 text-[#4F46E5]" />
      </div>
      <span className="text-[#E5E7EB]">{text}</span>
    </motion.div>
  )
}

const PLAN_NAMES: Record<EntitlementPlan, string> = {
  BASIC: "Basic Access",
  PRO: "Pro Access",
  ELITE: "Elite Access",
}

export function AccessUnlockedOverlay({
  isVisible,
  onClose,
  plan = "BASIC",
}: AccessUnlockedOverlayProps) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const handleContinue = useCallback(() => {
    const lastBlockedPath = localStorage.getItem("lastBlockedPath")
    localStorage.removeItem("lastBlockedPath")

    onClose()

    if (lastBlockedPath && lastBlockedPath !== "/dashboard") {
      router.push(lastBlockedPath)
    } else {
      router.push("/dashboard")
    }
  }, [onClose, router])

  const perks = [
    { icon: Check, text: "All 9 weeks of content unlocked" },
    { icon: Zap, text: "Unlimited code executions" },
    { icon: Trophy, text: "League competitions & rankings" },
    { icon: Crown, text: "Full achievement system" },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              background: "rgba(10, 9, 24, 0.95)",
              backdropFilter: "blur(12px)",
            }}
          />

          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute left-1/2 top-1/2">
                {Array.from({ length: 40 }, (_, i) => (
                  <ConfettiParticle key={i} index={i} totalParticles={40} />
                ))}
              </div>
              <StarBurst />
            </div>
          )}

          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(79, 70, 229, 0.3) 0%, transparent 50%)",
            }}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, delay: 0.1 }}
            className="relative z-10 max-w-md w-full mx-4"
          >
            <div
              className="rounded-3xl p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                boxShadow:
                  "0 0 80px rgba(79, 70, 229, 0.3), inset 0 0 40px rgba(79, 70, 229, 0.05)",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 10,
                  stiffness: 200,
                  delay: 0.2,
                }}
                className="mx-auto mb-6 relative"
              >
                <div
                  className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)",
                    boxShadow: "0 0 40px rgba(79, 70, 229, 0.5)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <Check className="size-10 text-white" strokeWidth={3} />
                  </motion.div>
                </div>

                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles className="size-6 text-[#F59E0B]" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-3"
                  initial={{ scale: 0, rotate: 30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Sparkles className="size-5 text-[#22D3EE]" />
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-black text-center mb-2"
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #4F46E5 0%, #22D3EE 50%, #8B5CF6 100%)",
                  }}
                >
                  Full Course Unlocked!
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mb-6"
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                  style={{
                    background: "rgba(79, 70, 229, 0.2)",
                    border: "1px solid rgba(79, 70, 229, 0.4)",
                  }}
                >
                  <Zap className="size-4 text-[#4F46E5]" />
                  <span className="text-sm font-semibold text-[#4F46E5]">
                    {PLAN_NAMES[plan]} Active
                  </span>
                </div>
              </motion.div>

              <div className="space-y-3 mb-8">
                {perks.map((perk, i) => (
                  <PerkItem
                    key={perk.text}
                    icon={perk.icon}
                    text={perk.text}
                    delay={0.5 + i * 0.1}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <NeonButton
                  className="w-full py-4"
                  rightIcon={<ChevronRight className="size-5" />}
                  onClick={handleContinue}
                >
                  Continue to Week 2
                </NeonButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
