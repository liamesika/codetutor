"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const SPLASH_KEY = "codetutor_splash_seen"
const MIN_SPLASH_DURATION = 900

interface AppSplashContextType {
  isReady: boolean
  markReady: () => void
}

const AppSplashContext = createContext<AppSplashContextType>({
  isReady: false,
  markReady: () => {},
})

export function useAppSplash() {
  return useContext(AppSplashContext)
}

function AppSplashOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return Math.min(prev + Math.random() * 15 + 5, 100)
      })
    }, 100)

    // Minimum duration before allowing completion
    const timer = setTimeout(() => {
      onComplete()
    }, MIN_SPLASH_DURATION)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0F0E26 0%, #1E1B4B 50%, #0F0E26 100%)",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Animated mesh background */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 20%, #4F46E5 0%, transparent 50%)",
                "radial-gradient(circle at 80% 80%, #4F46E5 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, #4F46E5 0%, transparent 50%)",
                "radial-gradient(circle at 20% 20%, #4F46E5 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 80% 20%, #22D3EE 0%, transparent 40%)",
                "radial-gradient(circle at 20% 80%, #22D3EE 0%, transparent 40%)",
                "radial-gradient(circle at 50% 30%, #22D3EE 0%, transparent 40%)",
                "radial-gradient(circle at 80% 20%, #22D3EE 0%, transparent 40%)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 px-4">
        {/* Logo container with glow */}
        <div className="relative">
          {/* Glow ring */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute -inset-4 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #4F46E5, #22D3EE, #4F46E5)",
                filter: "blur(20px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(79, 70, 229, 0.3)",
              boxShadow: "0 0 60px rgba(79, 70, 229, 0.4), inset 0 0 30px rgba(255,255,255,0.05)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 md:w-16 md:h-16"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 4" />
            </svg>
          </motion.div>
        </div>

        {/* Brand text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#22D3EE] to-[#4F46E5] bg-clip-text text-transparent">
              CodeTutor
            </span>
          </h1>
          <p className="text-[#9CA3AF] text-sm md:text-base mt-2">
            Master Java, one challenge at a time
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative h-1 bg-[#1E1B4B]/50 rounded-full overflow-hidden"
          style={{
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, #4F46E5, #22D3EE)",
              boxShadow: "0 0 10px rgba(79, 70, 229, 0.5)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#4F46E5]"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }
              }
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function AppSplashProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  // Check session storage on mount
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    const hasSeenSplash = sessionStorage.getItem(SPLASH_KEY)

    if (!hasSeenSplash) {
      setShowSplash(true)
    }

    setIsInitialized(true)
  }, [])

  const handleSplashComplete = useCallback(() => {
    setMinTimeElapsed(true)
  }, [])

  const markReady = useCallback(() => {
    setIsReady(true)
  }, [])

  // Hide splash when both conditions are met
  useEffect(() => {
    if (minTimeElapsed && (isReady || !showSplash)) {
      sessionStorage.setItem(SPLASH_KEY, "true")
      setShowSplash(false)
    }
  }, [minTimeElapsed, isReady, showSplash])

  // Automatically mark ready after a timeout as fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true)
    }, 2500) // Max wait 2.5s

    return () => clearTimeout(timeout)
  }, [])

  // Don't render anything until we've checked session storage
  if (!isInitialized) {
    return null
  }

  return (
    <AppSplashContext.Provider value={{ isReady, markReady }}>
      {children}
      <AnimatePresence mode="wait">
        {showSplash && (
          <AppSplashOverlay onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
    </AppSplashContext.Provider>
  )
}
