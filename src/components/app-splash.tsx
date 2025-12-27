"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppSplashProps {
  isLoading?: boolean
  onLoadingComplete?: () => void
  minDisplayTime?: number
}

export function AppSplash({
  isLoading = true,
  onLoadingComplete,
  minDisplayTime = 1000,
}: AppSplashProps) {
  const [show, setShow] = useState(true)
  const [hasMinTimePassed, setHasMinTimePassed] = useState(false)

  // Ensure minimum display time for smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMinTimePassed(true)
    }, minDisplayTime)

    return () => clearTimeout(timer)
  }, [minDisplayTime])

  // Hide splash when loading is complete and min time has passed
  useEffect(() => {
    if (!isLoading && hasMinTimePassed) {
      setShow(false)
      onLoadingComplete?.()
    }
  }, [isLoading, hasMinTimePassed, onLoadingComplete])

  // Respect reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F19]"
        >
          {/* Background gradient effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#4F46E5]/20 rounded-full blur-3xl"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#22D3EE]/15 rounded-full blur-3xl"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1.2, 1, 1.2],
                      opacity: [0.15, 0.3, 0.15],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] rounded-2xl blur-xl opacity-50" />

                {/* Logo container */}
                <motion.div
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)]"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          boxShadow: [
                            "0 0 40px rgba(79,70,229,0.4)",
                            "0 0 60px rgba(79,70,229,0.6)",
                            "0 0 40px rgba(79,70,229,0.4)",
                          ],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Code2 className="h-10 w-10 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                CodeTutor
              </span>
            </motion.h1>

            {/* Loading indicator */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated dots loader */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]"
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5],
                          }
                    }
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Loading text */}
              <motion.p
                className="text-sm text-muted-foreground"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        opacity: [0.5, 1, 0.5],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Loading your learning journey...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing app splash state
export function useAppSplash() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  const finishLoading = () => {
    setIsLoading(false)
  }

  const handleLoadingComplete = () => {
    setIsVisible(false)
  }

  return {
    isLoading,
    isVisible,
    finishLoading,
    handleLoadingComplete,
    SplashComponent: isVisible ? (
      <AppSplash
        isLoading={isLoading}
        onLoadingComplete={handleLoadingComplete}
      />
    ) : null,
  }
}
