"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { LevelUpOverlay } from "@/components/progression/level-up-overlay"

interface LevelUpContextType {
  triggerLevelUp: (previousLevel: number, newLevel: number) => void
}

const LevelUpContext = createContext<LevelUpContextType | null>(null)

export function useLevelUpContext() {
  const context = useContext(LevelUpContext)
  if (!context) {
    throw new Error("useLevelUpContext must be used within LevelUpProvider")
  }
  return context
}

interface LevelUpProviderProps {
  children: ReactNode
}

export function LevelUpProvider({ children }: LevelUpProviderProps) {
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean
    newLevel: number
  }>({
    isOpen: false,
    newLevel: 1,
  })

  const triggerLevelUp = useCallback((previousLevel: number, newLevel: number) => {
    // Check if already acknowledged in this session
    const sessionKey = `levelup-${newLevel}-session`
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey) === "true") {
      return
    }

    // Check if already acknowledged permanently
    const permanentKey = `levelup-${newLevel}-acknowledged`
    if (typeof window !== "undefined" && localStorage.getItem(permanentKey) === "true") {
      return
    }

    if (newLevel > previousLevel) {
      setLevelUpData({
        isOpen: true,
        newLevel,
      })

      // Mark as shown in this session to prevent duplicate triggers
      if (typeof window !== "undefined") {
        sessionStorage.setItem(sessionKey, "true")
      }
    }
  }, [])

  const closeLevelUp = useCallback(() => {
    // Mark as acknowledged in localStorage
    if (typeof window !== "undefined") {
      const key = `levelup-${levelUpData.newLevel}-acknowledged`
      localStorage.setItem(key, "true")
    }
    setLevelUpData((prev) => ({ ...prev, isOpen: false }))
  }, [levelUpData.newLevel])

  return (
    <LevelUpContext.Provider value={{ triggerLevelUp }}>
      {children}
      <LevelUpOverlay
        isOpen={levelUpData.isOpen}
        newLevel={levelUpData.newLevel}
        onClose={closeLevelUp}
      />
    </LevelUpContext.Provider>
  )
}
