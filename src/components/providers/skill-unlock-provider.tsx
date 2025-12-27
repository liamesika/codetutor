"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { SkillUnlockOverlay } from "@/components/progression/skill-unlock-overlay"

interface SkillUnlockNode {
  id: string
  title: string
  description: string
  icon: string
  color: string
  branchPath: string[]
}

interface SkillUnlockContextType {
  triggerSkillUnlock: (node: SkillUnlockNode) => void
}

const SkillUnlockContext = createContext<SkillUnlockContextType | null>(null)

export function useSkillUnlockContext() {
  const context = useContext(SkillUnlockContext)
  if (!context) {
    throw new Error("useSkillUnlockContext must be used within SkillUnlockProvider")
  }
  return context
}

interface SkillUnlockProviderProps {
  children: ReactNode
}

export function SkillUnlockProvider({ children }: SkillUnlockProviderProps) {
  const [unlockData, setUnlockData] = useState<{
    isOpen: boolean
    node: SkillUnlockNode | null
  }>({
    isOpen: false,
    node: null,
  })

  const triggerSkillUnlock = useCallback((node: SkillUnlockNode) => {
    // Check sessionStorage first to prevent duplicate triggers in same session
    const sessionKey = `skillunlock-${node.id}-session`
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey) === "true") {
      return
    }

    // Check localStorage for permanent acknowledgment
    const permanentKey = `skillunlock-${node.id}-acknowledged`
    if (typeof window !== "undefined" && localStorage.getItem(permanentKey) === "true") {
      return
    }

    setUnlockData({
      isOpen: true,
      node,
    })

    // Mark in session to prevent duplicate triggers
    if (typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, "true")
    }
  }, [])

  const handleClose = useCallback(() => {
    setUnlockData((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <SkillUnlockContext.Provider value={{ triggerSkillUnlock }}>
      {children}
      <SkillUnlockOverlay
        isOpen={unlockData.isOpen}
        node={unlockData.node}
        onClose={handleClose}
      />
    </SkillUnlockContext.Provider>
  )
}
