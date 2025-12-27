"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"

// VS Code-style section transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter")
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      setTransitionStage("exit")
      prevPathname.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    if (transitionStage === "exit") {
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setTransitionStage("enter")
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [transitionStage, children])

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={transitionStage === "enter" ? pathname : `${pathname}-exit`}
      initial={transitionStage === "enter" ? {
        opacity: 0,
        scale: 0.98,
        y: 8,
        filter: "blur(2px)",
      } : false}
      animate={{
        opacity: transitionStage === "enter" ? 1 : 0,
        scale: transitionStage === "enter" ? 1 : 0.98,
        y: transitionStage === "enter" ? 0 : -8,
        filter: transitionStage === "enter" ? "blur(0px)" : "blur(2px)",
      }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        willChange: "transform, opacity, filter",
      }}
    >
      {displayChildren}
    </motion.div>
  )
}

// Layered depth transition for modal-like pages
export function DepthTransition({
  children,
  depth = 1,
}: {
  children: React.ReactNode
  depth?: number
}) {
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95 + depth * 0.01,
        z: -50 * depth,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        z: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.95 + depth * 0.01,
        z: -50 * depth,
      }}
      transition={{
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  )
}

// Staggered children animation
export function StaggerContainer({
  children,
  staggerDelay = 0.05,
  className,
}: {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

  return (
    <motion.div
      variants={{
        hidden: prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 12, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
