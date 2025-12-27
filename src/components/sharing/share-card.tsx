"use client"

import { motion } from "framer-motion"
import { useRef, useState, useCallback } from "react"
import {
  Share2,
  Download,
  Copy,
  Check,
  Flame,
  Trophy,
  Star,
  Zap,
  Crown,
  Link2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type ShareType = "ACHIEVEMENT" | "RANK" | "STREAK" | "LEVEL" | "MILESTONE"

interface ShareCardData {
  type: ShareType
  title: string
  value: string | number
  subtitle?: string
  username?: string
  rank?: string
  level?: number
}

interface ShareCardProps {
  data: ShareCardData
  onShare?: (shareUrl: string) => void
  className?: string
}

// Get styling based on share type
const typeConfig = {
  ACHIEVEMENT: {
    icon: Trophy,
    gradient: "from-amber-500 via-yellow-400 to-amber-500",
    glow: "rgba(245, 158, 11, 0.4)",
    bg: "from-amber-500/20 to-orange-500/20",
  },
  RANK: {
    icon: Crown,
    gradient: "from-purple-500 via-pink-400 to-purple-500",
    glow: "rgba(168, 85, 247, 0.4)",
    bg: "from-purple-500/20 to-pink-500/20",
  },
  STREAK: {
    icon: Flame,
    gradient: "from-red-500 via-orange-400 to-red-500",
    glow: "rgba(239, 68, 68, 0.4)",
    bg: "from-red-500/20 to-orange-500/20",
  },
  LEVEL: {
    icon: Star,
    gradient: "from-cyan-500 via-blue-400 to-cyan-500",
    glow: "rgba(34, 211, 238, 0.4)",
    bg: "from-cyan-500/20 to-blue-500/20",
  },
  MILESTONE: {
    icon: Zap,
    gradient: "from-emerald-500 via-green-400 to-emerald-500",
    glow: "rgba(16, 185, 129, 0.4)",
    bg: "from-emerald-500/20 to-green-500/20",
  },
}

// The visual share card (can be captured as image)
export function ShareCardVisual({
  data,
  showBranding = true,
}: {
  data: ShareCardData
  showBranding?: boolean
}) {
  const config = typeConfig[data.type]
  const Icon = config.icon

  return (
    <div
      className="relative w-full max-w-sm p-6 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1E1B2E 0%, #0F0E26 100%)",
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${config.glow} 0%, transparent 50%)`,
        }}
      />

      {/* Border gradient */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${config.glow}, transparent 50%)`,
          padding: 1,
        }}
      >
        <div className="w-full h-full rounded-2xl bg-[#0F0E26]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* User info */}
        {data.username && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {data.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{data.username}</p>
              {data.level && (
                <p className="text-xs text-muted-foreground">Level {data.level}</p>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col items-center text-center py-6">
          {/* Icon */}
          <motion.div
            className="relative mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${config.glow.replace('0.4', '0.3')}, ${config.glow.replace('0.4', '0.1')})`,
                boxShadow: `0 0 40px ${config.glow}`,
              }}
            >
              <Icon
                className="size-10"
                style={{
                  color: config.gradient.includes("amber") ? "#F59E0B" :
                         config.gradient.includes("purple") ? "#A855F7" :
                         config.gradient.includes("red") ? "#EF4444" :
                         config.gradient.includes("cyan") ? "#22D3EE" :
                         "#10B981",
                }}
              />
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-lg font-bold text-white mb-2">{data.title}</h2>

          {/* Value */}
          <p
            className="text-5xl font-black mb-2"
            style={{
              background: `linear-gradient(135deg, ${config.gradient.split(" ")[0].replace("from-", "#").replace("-500", "")} 0%, ${config.gradient.split(" ")[2].replace("to-", "#").replace("-500", "")} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 20px ${config.glow})`,
            }}
          >
            {data.value}
          </p>

          {/* Subtitle */}
          {data.subtitle && (
            <p className="text-muted-foreground">{data.subtitle}</p>
          )}
        </div>

        {/* Branding */}
        {showBranding && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
            <Zap className="size-4 text-primary" />
            <span className="text-sm text-muted-foreground">CodeTutor</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Full share card component with actions
export function ShareCard({
  data,
  onShare,
  className,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const createShare = useCallback(async () => {
    setIsCreating(true)
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shareType: data.type,
          title: data.title,
          description: data.subtitle,
          metadata: {
            value: data.value,
            username: data.username,
            rank: data.rank,
            level: data.level,
          },
        }),
      })

      if (!res.ok) throw new Error("Failed to create share")

      const result = await res.json()
      setShareUrl(result.shareUrl)
      onShare?.(result.shareUrl)

      toast.success("Share link created!")
    } catch (error) {
      console.error("Failed to create share:", error)
      toast.error("Failed to create share link")
    } finally {
      setIsCreating(false)
    }
  }, [data, onShare])

  const copyLink = useCallback(async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }, [shareUrl])

  const downloadImage = useCallback(async () => {
    if (!cardRef.current) return

    try {
      // Use html2canvas to capture the card
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0F0E26",
        scale: 2,
      })

      // Download
      const link = document.createElement("a")
      link.download = `codetutor-${data.type.toLowerCase()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      toast.success("Image downloaded!")
    } catch (error) {
      console.error("Failed to download image:", error)
      toast.error("Failed to download image")
    }
  }, [data.type])

  const nativeShare = useCallback(async () => {
    const url = shareUrl || window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: `Check out my ${data.type.toLowerCase()} on CodeTutor: ${data.value}`,
          url,
        })
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      copyLink()
    }
  }, [shareUrl, data, copyLink])

  return (
    <motion.div
      className={cn("flex flex-col gap-4", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Card preview */}
      <div ref={cardRef}>
        <ShareCardVisual data={data} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!shareUrl ? (
          <motion.button
            onClick={createShare}
            disabled={isCreating}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link2 className="size-4" />
            {isCreating ? "Creating..." : "Create Share Link"}
          </motion.button>
        ) : (
          <>
            <motion.button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </motion.button>

            <motion.button
              onClick={nativeShare}
              className="p-3 rounded-xl bg-card border border-primary/30 hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="size-5 text-primary" />
            </motion.button>
          </>
        )}

        <motion.button
          onClick={downloadImage}
          className="p-3 rounded-xl bg-card border border-white/10 hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="size-5 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Share URL display */}
      {shareUrl && (
        <motion.div
          className="p-3 rounded-lg bg-card/50 border border-white/10 text-sm text-muted-foreground truncate"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {shareUrl}
        </motion.div>
      )}
    </motion.div>
  )
}
