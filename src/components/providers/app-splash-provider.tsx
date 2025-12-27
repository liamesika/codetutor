"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SPLASH_KEY = "codetutor_splash_seen"
const MIN_SPLASH_DURATION = 1500

interface AppSplashContextType {
  isReady: boolean
  markReady: () => void
  triggerSplash: () => void
}

const AppSplashContext = createContext<AppSplashContextType>({
  isReady: false,
  markReady: () => {},
  triggerSplash: () => {},
})

export function useAppSplash() {
  return useContext(AppSplashContext)
}

// Particle field component
function ParticleField({ count = 50 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }))
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
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
        return Math.min(prev + Math.random() * 12 + 3, 100)
      })
    }, 80)

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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: "#0A0918",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Deep cinematic gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #1E1B4B 0%, #0A0918 60%, #050510 100%)",
        }}
      />

      {/* Animated mesh background */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute inset-0 opacity-40"
            animate={{
              background: [
                "radial-gradient(circle at 20% 20%, #4F46E5 0%, transparent 40%)",
                "radial-gradient(circle at 80% 80%, #4F46E5 0%, transparent 40%)",
                "radial-gradient(circle at 50% 50%, #4F46E5 0%, transparent 40%)",
                "radial-gradient(circle at 20% 20%, #4F46E5 0%, transparent 40%)",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 opacity-25"
            animate={{
              background: [
                "radial-gradient(circle at 80% 20%, #22D3EE 0%, transparent 35%)",
                "radial-gradient(circle at 20% 80%, #22D3EE 0%, transparent 35%)",
                "radial-gradient(circle at 50% 30%, #22D3EE 0%, transparent 35%)",
                "radial-gradient(circle at 80% 20%, #22D3EE 0%, transparent 35%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Particle field */}
          <ParticleField count={60} />
        </>
      )}

      {/* Content with camera zoom effect */}
      <motion.div
        className="relative flex flex-col items-center gap-8 px-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo container with glow */}
        <div className="relative">
          {/* Outer conic gradient rotating halo */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute -inset-8 md:-inset-12 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent, #4F46E5, #22D3EE, #8B5CF6, transparent)",
                  filter: "blur(30px)",
                  opacity: 0.6,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-6 md:-inset-8 rounded-full"
                style={{
                  background: "conic-gradient(from 180deg, transparent, #22D3EE, #4F46E5, transparent)",
                  filter: "blur(20px)",
                  opacity: 0.5,
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}

          {/* Logo glow pulse */}
          <motion.div
            className="absolute -inset-4 rounded-3xl"
            style={{
              background: "radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(34, 211, 238, 0.15) 100%)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(79, 70, 229, 0.4)",
              boxShadow: "0 0 80px rgba(79, 70, 229, 0.5), 0 0 120px rgba(34, 211, 238, 0.2), inset 0 0 40px rgba(255,255,255,0.05)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-14 h-14 md:w-18 md:h-18"
              fill="none"
              stroke="url(#logoGradientSplash)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 10px rgba(79, 70, 229, 0.6))" }}
            >
              <defs>
                <linearGradient id="logoGradientSplash" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#8B5CF6" />
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
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #4F46E5 0%, #22D3EE 50%, #8B5CF6 100%)",
                filter: "drop-shadow(0 0 20px rgba(79, 70, 229, 0.4))",
              }}
            >
              CodeTutor
            </span>
          </h1>
          <motion.p
            className="text-[#9CA3AF] text-sm md:text-base mt-3 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Master Java, one challenge at a time
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "240px", opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="relative h-1.5 bg-[#1E1B4B]/60 rounded-full overflow-hidden"
          style={{
            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.4)",
          }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, #4F46E5, #22D3EE, #8B5CF6)",
              boxShadow: "0 0 15px rgba(79, 70, 229, 0.6)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3"
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#4F46E5" }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 1, 0.4],
                      }
                }
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-[#6B7280] tracking-wider uppercase">
            Initializing
          </span>
        </motion.div>
      </motion.div>
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

  // Trigger splash manually (e.g., after login)
  const triggerSplash = useCallback(() => {
    // Clear the session flag and show splash
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SPLASH_KEY)
    }
    setMinTimeElapsed(false)
    setIsReady(false)
    setShowSplash(true)
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
    if (!showSplash) return

    const timeout = setTimeout(() => {
      setIsReady(true)
    }, 3000) // Max wait 3s

    return () => clearTimeout(timeout)
  }, [showSplash])

  // Don't render anything until we've checked session storage
  if (!isInitialized) {
    return null
  }

  return (
    <AppSplashContext.Provider value={{ isReady, markReady, triggerSplash }}>
      {children}
      <AnimatePresence mode="wait">
        {showSplash && (
          <AppSplashOverlay onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
    </AppSplashContext.Provider>
  )
}
