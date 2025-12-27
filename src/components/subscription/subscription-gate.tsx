"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Sparkles, ChevronRight, Crown, Zap } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import Link from "next/link"

interface SubscriptionGateProps {
  isLocked: boolean
  weekNumber?: number
  children: React.ReactNode
}

export function SubscriptionGate({
  isLocked,
  weekNumber,
  children,
}: SubscriptionGateProps) {
  const pathname = usePathname()

  // Store the blocked path for redirect after purchase
  useEffect(() => {
    if (isLocked && pathname) {
      localStorage.setItem("lastBlockedPath", pathname)
    }
  }, [isLocked, pathname])

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-[60vh]">
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none blur-sm opacity-30">
        {children}
      </div>

      {/* Premium overlay */}
      <SubscriptionOverlay weekNumber={weekNumber} />
    </div>
  )
}

interface SubscriptionOverlayProps {
  weekNumber?: number
  onClose?: () => void
}

export function SubscriptionOverlay({ weekNumber }: SubscriptionOverlayProps) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0E26]/80 via-[#0F0E26]/90 to-[#0F0E26]/95 backdrop-blur-md" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-md w-full mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", damping: 20 }}
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            boxShadow:
              "0 0 40px rgba(139, 92, 246, 0.2), inset 0 0 40px rgba(255, 255, 255, 0.02)",
          }}
        >
          {/* Icon */}
          <motion.div
            className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(79, 70, 229, 0.2) 100%)",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
            }}
            animate={{
              boxShadow: [
                "0 0 30px rgba(139, 92, 246, 0.4)",
                "0 0 50px rgba(139, 92, 246, 0.6)",
                "0 0 30px rgba(139, 92, 246, 0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="size-10 text-[#8B5CF6]" />
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {weekNumber
              ? `Week ${weekNumber} is Premium`
              : "Premium Content"}
          </h2>

          {/* Subtitle */}
          <p className="text-[#9CA3AF] mb-6 leading-relaxed">
            Continue your journey with full access — <span className="text-[#22D3EE] font-semibold">₪30/month</span>
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8 text-left">
            {[
              "Full access to all weeks",
              "All challenges & exercises",
              "Daily streak & leagues",
              "Achievements & rank system",
            ].map((feature, i) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3 text-sm text-[#E5E7EB]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="size-5 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="size-3 text-[#8B5CF6]" />
                </div>
                {feature}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/pricing">
            <NeonButton
              className="w-full py-4 text-lg"
              rightIcon={<ChevronRight className="size-5" />}
            >
              Unlock Full Course
            </NeonButton>
          </Link>

          {/* Free tier note */}
          <p className="text-xs text-[#6B7280] mt-4">
            Week 1 is always free. No credit card required.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface SubscriptionBadgeProps {
  status: "free" | "active" | "expired" | "canceled"
}

export function SubscriptionBadge({ status }: SubscriptionBadgeProps) {
  const configs = {
    free: {
      label: "Free",
      color: "#6B7280",
      bgColor: "rgba(107, 114, 128, 0.2)",
    },
    active: {
      label: "Premium",
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.2)",
    },
    expired: {
      label: "Expired",
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.2)",
    },
    canceled: {
      label: "Canceled",
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.2)",
    },
  }

  const config = configs[status]

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}40`,
      }}
    >
      {status === "active" && <Sparkles className="size-3" />}
      {status === "free" && <Lock className="size-3" />}
      {config.label}
    </div>
  )
}

interface WeekLockedCardProps {
  weekNumber: number
  title: string
}

export function WeekLockedCard({ weekNumber, title }: WeekLockedCardProps) {
  return (
    <div
      className="relative rounded-xl p-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.05) 100%)",
        border: "1px solid rgba(107, 114, 128, 0.2)",
      }}
    >
      {/* Lock icon overlay */}
      <div className="absolute top-4 right-4">
        <div
          className="size-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(139, 92, 246, 0.2)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <Lock className="size-5 text-[#8B5CF6]" />
        </div>
      </div>

      {/* Content */}
      <div className="pr-14">
        <p className="text-xs text-[#6B7280] font-medium mb-1">
          Week {weekNumber}
        </p>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-[#9CA3AF]">
          Unlock with{" "}
          <Link
            href="/pricing"
            className="text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
          >
            Premium
          </Link>
        </p>
      </div>
    </div>
  )
}
