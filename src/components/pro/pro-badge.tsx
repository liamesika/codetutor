"use client"

import { motion } from "framer-motion"
import { Crown, Sparkles, Zap, Shield, Star } from "lucide-react"
import { cn } from "@/lib/utils"

// Available PRO badge styles
const badgeStyles = {
  "pro-crown": {
    icon: Crown,
    gradient: "from-amber-500 via-yellow-400 to-amber-500",
    glow: "rgba(245, 158, 11, 0.6)",
    label: "PRO",
  },
  "speed-demon": {
    icon: Zap,
    gradient: "from-cyan-500 via-blue-400 to-cyan-500",
    glow: "rgba(34, 211, 238, 0.6)",
    label: "SPEED",
  },
  "perfectionist": {
    icon: Star,
    gradient: "from-purple-500 via-pink-400 to-purple-500",
    glow: "rgba(168, 85, 247, 0.6)",
    label: "PERFECT",
  },
  "mentor": {
    icon: Shield,
    gradient: "from-emerald-500 via-green-400 to-emerald-500",
    glow: "rgba(16, 185, 129, 0.6)",
    label: "MENTOR",
  },
}

interface ProBadgeProps {
  type?: keyof typeof badgeStyles
  size?: "sm" | "md" | "lg"
  animate?: boolean
  showLabel?: boolean
  className?: string
}

export function ProBadge({
  type = "pro-crown",
  size = "md",
  animate = true,
  showLabel = false,
  className,
}: ProBadgeProps) {
  const style = badgeStyles[type] || badgeStyles["pro-crown"]
  const Icon = style.icon

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  }

  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  }

  return (
    <motion.div
      className={cn("relative inline-flex items-center gap-1.5", className)}
      initial={animate ? { scale: 0 } : false}
      animate={animate ? { scale: 1 } : false}
      transition={{ type: "spring", damping: 12 }}
    >
      {/* Outer glow */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${style.glow} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Badge container */}
      <motion.div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          `bg-gradient-to-r ${style.gradient}`,
          sizeClasses[size]
        )}
        style={{
          boxShadow: `0 0 15px ${style.glow}`,
        }}
        animate={animate ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Icon className={cn(iconSizes[size], "text-white drop-shadow-lg")} />
      </motion.div>

      {/* Label */}
      {showLabel && (
        <span
          className={cn(
            "font-bold text-transparent bg-clip-text",
            `bg-gradient-to-r ${style.gradient}`,
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          )}
        >
          {style.label}
        </span>
      )}
    </motion.div>
  )
}

// Animated PRO text with shimmer effect
export function ProText({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }

  return (
    <motion.span
      className={cn(
        "relative font-bold inline-block",
        sizeClasses[size],
        className
      )}
      style={{
        background: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 25%, #FCD34D 50%, #FBBF24 75%, #F59E0B 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      PRO
    </motion.span>
  )
}

// XP Boost indicator
export function XpBoostIndicator({
  boostPercent = 25,
  isActive = true,
}: {
  boostPercent?: number
  isActive?: boolean
}) {
  if (!isActive) return null

  return (
    <motion.div
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 12 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Sparkles className="size-3 text-amber-500" />
      </motion.div>
      <span className="text-xs font-medium text-amber-400">
        +{boostPercent}% XP
      </span>
    </motion.div>
  )
}
