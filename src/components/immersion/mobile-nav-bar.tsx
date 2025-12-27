"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, Code, LayoutDashboard, Trophy, Flame, ChevronRight } from "lucide-react"

interface ProgressionData {
  currentStreak: number
}

interface RankData {
  currentRank: string
}

const NAV_ITEMS = [
  { id: "learn", label: "Learn", icon: BookOpen, path: "/dashboard", color: "#4F46E5" },
  { id: "practice", label: "Practice", icon: Code, path: "/practice", color: "#10B981" },
  { id: "dashboard", label: "Stats", icon: LayoutDashboard, path: "/leaderboard", color: "#F59E0B" },
]

const RANK_COLORS: Record<string, string> = {
  BRONZE: "#CD7F32",
  SILVER: "#C0C0C0",
  GOLD: "#FFD700",
  PLATINUM: "#E5E4E2",
  DIAMOND: "#B9F2FF",
}

export function MobileNavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const x = useMotionValue(0)

  // Determine active tab based on pathname
  useEffect(() => {
    if (pathname?.includes("/practice") || pathname?.includes("/learn")) {
      if (pathname.includes("/practice")) {
        setActiveIndex(1)
      } else {
        setActiveIndex(0)
      }
    } else if (pathname?.includes("/leaderboard") || pathname?.includes("/achievements")) {
      setActiveIndex(2)
    } else {
      setActiveIndex(0)
    }
  }, [pathname])

  const { data: progression } = useQuery<ProgressionData>({
    queryKey: ["progression"],
    queryFn: async () => {
      const res = await fetch("/api/progression")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    enabled: !!session?.user,
  })

  const { data: rankData } = useQuery<RankData>({
    queryKey: ["rank"],
    queryFn: async () => {
      const res = await fetch("/api/rank")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    enabled: !!session?.user,
  })

  const handleNavigation = useCallback((index: number) => {
    setActiveIndex(index)
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
    router.push(NAV_ITEMS[index].path)
  }, [router])

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50
      if (info.offset.x > threshold && activeIndex > 0) {
        handleNavigation(activeIndex - 1)
      } else if (info.offset.x < -threshold && activeIndex < NAV_ITEMS.length - 1) {
        handleNavigation(activeIndex + 1)
      }
    },
    [activeIndex, handleNavigation]
  )

  // Hide on auth pages and admin
  const shouldShow = session?.user &&
    !pathname?.startsWith("/login") &&
    !pathname?.startsWith("/signup") &&
    !pathname?.startsWith("/admin")

  if (!shouldShow) return null

  const streak = progression?.currentStreak || 0
  const rank = rankData?.currentRank || "BRONZE"
  const rankColor = RANK_COLORS[rank] || RANK_COLORS.BRONZE

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="mx-2 mb-2"
      >
        <div
          className="rounded-2xl px-2 py-3"
          style={{
            background: "linear-gradient(135deg, rgba(15, 14, 38, 0.98) 0%, rgba(30, 27, 75, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
            boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.4), 0 0 40px rgba(79, 70, 229, 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Nav items */}
            <div className="flex-1 flex items-center justify-around">
              {NAV_ITEMS.map((item, index) => {
                const isActive = activeIndex === index
                const Icon = item.icon

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(index)}
                    className="relative flex flex-col items-center gap-1 px-4 py-1"
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `${item.color}15`,
                          border: `1px solid ${item.color}30`,
                        }}
                        transition={{ type: "spring", damping: 25 }}
                      />
                    )}

                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        color: isActive ? item.color : "#6B7280",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="size-5" />
                    </motion.div>

                    <motion.span
                      className="text-[10px] font-medium"
                      animate={{
                        color: isActive ? item.color : "#6B7280",
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-[#374151]/50" />

            {/* Stats section */}
            <div className="flex items-center gap-3 px-3">
              {/* Streak */}
              <div className="flex items-center gap-1">
                <motion.div
                  animate={streak > 0 ? {
                    filter: [
                      "drop-shadow(0 0 2px rgba(251, 146, 60, 0.5))",
                      "drop-shadow(0 0 6px rgba(251, 146, 60, 0.8))",
                      "drop-shadow(0 0 2px rgba(251, 146, 60, 0.5))",
                    ],
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Flame className={`size-4 ${streak > 0 ? "text-orange-400" : "text-gray-500"}`} />
                </motion.div>
                <span className={`text-xs font-bold ${streak > 0 ? "text-orange-400" : "text-gray-500"}`}>
                  {streak}
                </span>
              </div>

              {/* Rank */}
              <motion.div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{
                  background: `${rankColor}20`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 4px ${rankColor}40`,
                    `0 0 8px ${rankColor}60`,
                    `0 0 4px ${rankColor}40`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="size-3" style={{ color: rankColor }} />
                <span className="text-[10px] font-bold" style={{ color: rankColor }}>
                  {rank.charAt(0)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Next action hint */}
          <motion.div
            className="mt-2 mx-2 px-3 py-1.5 rounded-lg flex items-center justify-between"
            style={{
              background: "rgba(79, 70, 229, 0.1)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-xs text-[#9CA3AF]">Continue where you left off</span>
            <ChevronRight className="size-4 text-[#4F46E5]" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
