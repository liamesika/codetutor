"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Share2, Flame, Trophy, Star, Crown, Zap } from "lucide-react"
import { ShareCard } from "./share-card"
import { cn } from "@/lib/utils"

type ShareType = "ACHIEVEMENT" | "RANK" | "STREAK" | "LEVEL" | "MILESTONE"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareData: {
    type: ShareType
    title: string
    value: string | number
    subtitle?: string
    username?: string
    rank?: string
    level?: number
  }
}

const typeIcons = {
  ACHIEVEMENT: Trophy,
  RANK: Crown,
  STREAK: Flame,
  LEVEL: Star,
  MILESTONE: Zap,
}

export function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  const Icon = typeIcons[shareData.type]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0F0E26]/90 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-gradient-to-b from-card/95 to-card/80 rounded-2xl border border-primary/20 overflow-hidden"
            style={{
              boxShadow: "0 0 60px rgba(79, 70, 229, 0.2)",
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Share2 className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Share Achievement</h2>
                  <p className="text-sm text-muted-foreground">
                    Show off your progress!
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <ShareCard data={shareData} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Quick share button that can be placed anywhere
export function ShareButton({
  type,
  title,
  value,
  subtitle,
  username,
  level,
  variant = "default",
  size = "md",
  className,
}: {
  type: ShareType
  title: string
  value: string | number
  subtitle?: string
  username?: string
  level?: number
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  }

  const iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  }

  const variantClasses = {
    default: "bg-primary/20 hover:bg-primary/30 text-primary",
    outline: "border border-primary/30 hover:bg-primary/10 text-primary",
    ghost: "hover:bg-white/10 text-muted-foreground hover:text-white",
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "rounded-lg transition-colors",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className={iconSizes[size]} />
      </motion.button>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        shareData={{ type, title, value, subtitle, username, level }}
      />
    </>
  )
}

// Import useState that was missing
import { useState } from "react"
