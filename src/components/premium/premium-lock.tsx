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

interface PremiumLockProps {
  children: React.ReactNode
  isLocked?: boolean
  featureName?: string
  className?: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
  showBadge?: boolean
}

export function PremiumLock({
  children,
  isLocked = true,
  featureName = "Premium Feature",
  className,
  tooltipSide = "top",
  showBadge = true,
}: PremiumLockProps) {
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20 flex items-center justify-center border border-[#F59E0B]/30">
                  <Lock className="size-5 text-[#F59E0B]" />
                </div>
              </motion.div>
            </div>

            {/* Premium badge */}
            {showBadge && (
              <div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F59E0B]/20 to-[#EF4444]/20 border border-[#F59E0B]/30">
                <Crown className="size-3 text-[#F59E0B]" />
                <span className="text-xs font-medium text-[#F59E0B]">PRO</span>
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
            <Sparkles className="size-4 text-[#F59E0B]" />
            <div>
              <p className="font-medium text-white text-sm">{featureName}</p>
              <p className="text-xs text-[#9CA3AF]">Unlocks with Premium</p>
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
}

export function PremiumBadge({ size = "md", className }: PremiumBadgeProps) {
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
        "bg-gradient-to-r from-[#F59E0B]/20 to-[#EF4444]/20",
        "border border-[#F59E0B]/30",
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Crown className={cn(iconSizes[size], "text-[#F59E0B]")} />
      <span className="font-semibold text-[#F59E0B]">PRO</span>
    </motion.div>
  )
}

interface PremiumCardOverlayProps {
  className?: string
}

export function PremiumCardOverlay({ className }: PremiumCardOverlayProps) {
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
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20 flex items-center justify-center border border-[#F59E0B]/30">
          <Lock className="size-7 text-[#F59E0B]" />
        </div>
        <div>
          <p className="font-bold text-white mb-1">Premium Content</p>
          <p className="text-sm text-[#9CA3AF]">Upgrade to unlock</p>
        </div>
        <PremiumBadge size="md" />
      </motion.div>
    </div>
  )
}
