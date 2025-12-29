"use client"

import { motion } from "framer-motion"
import { Lock, Sparkles, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type PlanTier = "free" | "basic" | "pro"

interface PremiumLockProps {
  children: React.ReactNode
  isLocked?: boolean
  featureName?: string
  className?: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
  showBadge?: boolean
  requiredPlan?: PlanTier
}

const PLAN_LABELS: Record<PlanTier, { label: string; color: string }> = {
  free: { label: "FREE", color: "#22D3EE" },
  basic: { label: "BASIC", color: "#4F46E5" },
  pro: { label: "PRO", color: "#F59E0B" },
}

export function PremiumLock({
  children,
  isLocked = true,
  featureName = "Premium Feature",
  className,
  tooltipSide = "top",
  showBadge = true,
  requiredPlan = "pro",
}: PremiumLockProps) {
  const planConfig = PLAN_LABELS[requiredPlan]
  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative group cursor-not-allowed", className)}>
            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0F0E26]/60 backdrop-blur-[2px] rounded-inherit">
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${planConfig.color}20 0%, ${planConfig.color}10 100%)`,
                    border: `1px solid ${planConfig.color}30`,
                  }}
                >
                  <Lock className="size-5" style={{ color: planConfig.color }} />
                </div>
              </motion.div>
            </div>

            {/* Premium badge */}
            {showBadge && (
              <div
                className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${planConfig.color}20 0%, ${planConfig.color}10 100%)`,
                  border: `1px solid ${planConfig.color}30`,
                }}
              >
                <Crown className="size-3" style={{ color: planConfig.color }} />
                <span className="text-xs font-medium" style={{ color: planConfig.color }}>
                  {planConfig.label}
                </span>
              </div>
            )}

            {/* Dimmed content */}
            <div className="opacity-40 pointer-events-none select-none">
              {children}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={tooltipSide}
          className="bg-[#1E1B4B] border-[#4F46E5]/30 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" style={{ color: planConfig.color }} />
            <div>
              <p className="font-medium text-white text-sm">{featureName}</p>
              <p className="text-xs text-[#9CA3AF]">
                Unlocks in {planConfig.label}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface PremiumBadgeProps {
  size?: "sm" | "md" | "lg"
  className?: string
  plan?: PlanTier
}

export function PremiumBadge({ size = "md", className, plan = "pro" }: PremiumBadgeProps) {
  const planConfig = PLAN_LABELS[plan]

  const sizes = {
    sm: "px-1.5 py-0.5 text-xs gap-0.5",
    md: "px-2 py-1 text-sm gap-1",
    lg: "px-3 py-1.5 text-base gap-1.5",
  }

  const iconSizes = {
    sm: "size-2.5",
    md: "size-3.5",
    lg: "size-4",
  }

  return (
    <motion.div
      className={cn(
        "inline-flex items-center rounded-full",
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${planConfig.color}20 0%, ${planConfig.color}10 100%)`,
        border: `1px solid ${planConfig.color}30`,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Crown className={iconSizes[size]} style={{ color: planConfig.color }} />
      <span className="font-semibold" style={{ color: planConfig.color }}>
        {planConfig.label}
      </span>
    </motion.div>
  )
}

interface PremiumCardOverlayProps {
  className?: string
  plan?: PlanTier
}

export function PremiumCardOverlay({ className, plan = "pro" }: PremiumCardOverlayProps) {
  const planConfig = PLAN_LABELS[plan]

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center",
        "bg-gradient-to-b from-[#0F0E26]/80 to-[#1E1B4B]/80",
        "backdrop-blur-sm rounded-inherit",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 p-6 text-center"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${planConfig.color}20 0%, ${planConfig.color}10 100%)`,
            border: `1px solid ${planConfig.color}30`,
          }}
        >
          <Lock className="size-7" style={{ color: planConfig.color }} />
        </div>
        <div>
          <p className="font-bold text-white mb-1">Premium Content</p>
          <p className="text-sm text-[#9CA3AF]">Unlocks in {planConfig.label}</p>
        </div>
        <PremiumBadge size="md" plan={plan} />
      </motion.div>
    </div>
  )
}
