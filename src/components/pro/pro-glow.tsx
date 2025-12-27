"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

// Available glow colors for PRO profiles
const glowColors = {
  gold: {
    primary: "rgba(245, 158, 11, 0.4)",
    secondary: "rgba(251, 191, 36, 0.3)",
    border: "rgba(245, 158, 11, 0.5)",
  },
  purple: {
    primary: "rgba(168, 85, 247, 0.4)",
    secondary: "rgba(192, 132, 252, 0.3)",
    border: "rgba(168, 85, 247, 0.5)",
  },
  diamond: {
    primary: "rgba(34, 211, 238, 0.4)",
    secondary: "rgba(103, 232, 249, 0.3)",
    border: "rgba(34, 211, 238, 0.5)",
  },
  rainbow: {
    primary: "rgba(245, 158, 11, 0.3)",
    secondary: "rgba(168, 85, 247, 0.3)",
    border: "rgba(245, 158, 11, 0.4)",
  },
}

interface ProGlowWrapperProps {
  children: ReactNode
  highlight?: keyof typeof glowColors
  enabled?: boolean
  intensity?: "subtle" | "normal" | "strong"
  className?: string
}

// Wrapper component that adds PRO glow effect around its children
export function ProGlowWrapper({
  children,
  highlight = "gold",
  enabled = true,
  intensity = "normal",
  className,
}: ProGlowWrapperProps) {
  if (!enabled) return <>{children}</>

  const colors = glowColors[highlight]

  const intensityMultiplier = {
    subtle: 0.5,
    normal: 1,
    strong: 1.5,
  }[intensity]

  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Outer animated glow */}
      <motion.div
        className="absolute -inset-1 rounded-xl pointer-events-none"
        style={{
          background: highlight === "rainbow"
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, rgba(34, 211, 238, 0.3), ${colors.primary})`
            : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          filter: `blur(${8 * intensityMultiplier}px)`,
          opacity: 0.7 * intensityMultiplier,
        }}
        animate={highlight === "rainbow" ? {
          background: [
            `linear-gradient(0deg, ${colors.primary}, ${colors.secondary}, rgba(34, 211, 238, 0.3))`,
            `linear-gradient(120deg, ${colors.secondary}, rgba(34, 211, 238, 0.3), ${colors.primary})`,
            `linear-gradient(240deg, rgba(34, 211, 238, 0.3), ${colors.primary}, ${colors.secondary})`,
            `linear-gradient(360deg, ${colors.primary}, ${colors.secondary}, rgba(34, 211, 238, 0.3))`,
          ],
        } : {
          opacity: [0.5 * intensityMultiplier, 0.8 * intensityMultiplier, 0.5 * intensityMultiplier],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${colors.border}`,
        }}
        animate={{
          boxShadow: [
            `inset 0 0 0 1px ${colors.border}`,
            `inset 0 0 0 2px ${colors.border}`,
            `inset 0 0 0 1px ${colors.border}`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Avatar glow ring for PRO users
export function ProAvatarGlow({
  children,
  highlight = "gold",
  size = "md",
  enabled = true,
}: {
  children: ReactNode
  highlight?: keyof typeof glowColors
  size?: "sm" | "md" | "lg" | "xl"
  enabled?: boolean
}) {
  if (!enabled) return <>{children}</>

  const colors = glowColors[highlight]

  const sizeClasses = {
    sm: "p-0.5",
    md: "p-1",
    lg: "p-1.5",
    xl: "p-2",
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-full",
        sizeClasses[size]
      )}
      style={{
        background: highlight === "rainbow"
          ? "conic-gradient(from 0deg, #F59E0B, #A855F7, #22D3EE, #10B981, #F59E0B)"
          : `linear-gradient(135deg, ${colors.primary.replace('0.4', '0.8')}, ${colors.secondary.replace('0.3', '0.6')})`,
      }}
      animate={highlight === "rainbow" ? {
        rotate: 360,
      } : {
        opacity: [0.8, 1, 0.8],
      }}
      transition={highlight === "rainbow"
        ? { duration: 3, repeat: Infinity, ease: "linear" }
        : { duration: 2, repeat: Infinity }
      }
    >
      {/* Inner container for avatar */}
      <div className="bg-background rounded-full">
        {children}
      </div>

      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: `0 0 20px ${colors.primary}, 0 0 40px ${colors.secondary}`,
        }}
        animate={{
          boxShadow: [
            `0 0 20px ${colors.primary}, 0 0 40px ${colors.secondary}`,
            `0 0 30px ${colors.primary}, 0 0 60px ${colors.secondary}`,
            `0 0 20px ${colors.primary}, 0 0 40px ${colors.secondary}`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  )
}

// Shimmer effect for PRO elements
export function ProShimmer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "linear",
        }}
      />
    </div>
  )
}

// PRO label tag
export function ProTag({
  variant = "default",
  size = "sm",
  className,
}: {
  variant?: "default" | "outline" | "subtle"
  size?: "xs" | "sm" | "md"
  className?: string
}) {
  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  }

  const variantClasses = {
    default: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    outline: "border border-amber-500/50 text-amber-500 bg-amber-500/10",
    subtle: "bg-amber-500/20 text-amber-400",
  }

  return (
    <motion.span
      className={cn(
        "inline-flex items-center font-bold rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 12 }}
    >
      PRO
    </motion.span>
  )
}
