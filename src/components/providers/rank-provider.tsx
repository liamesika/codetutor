"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { RankPromotionOverlay } from "@/components/overlays/rank-promotion-overlay"
import { calculateRank, RANK_CONFIG } from "@/lib/ranks"
import type { Rank } from "@prisma/client"

interface RankContextType {
  currentRank: Rank
  checkRankChange: (previousXp: number, newXp: number) => void
}

const RankContext = createContext<RankContextType | null>(null)

export function useRankContext() {
  const context = useContext(RankContext)
  if (!context) {
    throw new Error("useRankContext must be used within RankProvider")
  }
  return context
}

export function RankProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [currentRank, setCurrentRank] = useState<Rank>("BRONZE")
  const [overlayData, setOverlayData] = useState<{
    isOpen: boolean
    previousRank: Rank
    newRank: Rank
    isPromotion: boolean
  }>({
    isOpen: false,
    previousRank: "BRONZE",
    newRank: "BRONZE",
    isPromotion: true,
  })

  // Fetch initial rank
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchRank = async () => {
      try {
        const res = await fetch("/api/rank")
        if (res.ok) {
          const data = await res.json()
          setCurrentRank(data.currentRank)
        }
      } catch (error) {
        console.error("Failed to fetch rank:", error)
      }
    }

    fetchRank()
  }, [session?.user?.id])

  const checkRankChange = useCallback((previousXp: number, newXp: number) => {
    const previousRank = calculateRank(previousXp)
    const newRank = calculateRank(newXp)

    if (previousRank !== newRank) {
      const ranks: Rank[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]
      const previousIndex = ranks.indexOf(previousRank)
      const newIndex = ranks.indexOf(newRank)
      const isPromotion = newIndex > previousIndex

      // Check if already shown in this session
      const sessionKey = `rank_change_${newRank}_${Date.now()}`
      if (typeof window !== "undefined") {
        const lastShown = sessionStorage.getItem("last_rank_overlay")
        if (lastShown === newRank) {
          return
        }
        sessionStorage.setItem("last_rank_overlay", newRank)
      }

      setCurrentRank(newRank)
      setOverlayData({
        isOpen: true,
        previousRank,
        newRank,
        isPromotion,
      })
    }
  }, [])

  const closeOverlay = useCallback(() => {
    setOverlayData(prev => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <RankContext.Provider value={{ currentRank, checkRankChange }}>
      {children}
      <RankPromotionOverlay
        isOpen={overlayData.isOpen}
        previousRank={overlayData.previousRank}
        newRank={overlayData.newRank}
        isPromotion={overlayData.isPromotion}
        onClose={closeOverlay}
      />
    </RankContext.Provider>
  )
}
