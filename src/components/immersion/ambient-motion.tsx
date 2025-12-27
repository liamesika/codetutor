"use client"

import { useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"

// GPU-optimized ambient background layer
export function AmbientMotion() {
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

  if (prefersReducedMotion) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Breathing gradient orbs */}
      <BreathingGradients />

      {/* Noise texture overlay */}
      <NoiseOverlay />

      {/* Parallax grid */}
      <ParallaxGrid />

      {/* Subtle glow pulses */}
      <GlowPulses />
    </div>
  )
}

function BreathingGradients() {
  return (
    <>
      {/* Primary gradient orb - top right */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          willChange: "transform, opacity",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary gradient orb - bottom left */}
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          willChange: "transform, opacity",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.25, 0.4],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Accent gradient - center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 60%)",
          filter: "blur(100px)",
          willChange: "transform, opacity",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </>
  )
}

function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      generateNoise()
    }

    // Generate static noise texture
    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value     // R
        data[i + 1] = value // G
        data[i + 2] = value // B
        data[i + 3] = 8     // Very low alpha for subtle effect
      }

      ctx.putImageData(imageData, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-30 mix-blend-overlay"
      style={{ willChange: "auto" }}
    />
  )
}

function ParallaxGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationId: number
    let scrollY = 0
    let targetScrollY = 0

    const animate = () => {
      scrollY += (targetScrollY - scrollY) * 0.1

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`
      }

      animationId = requestAnimationFrame(animate)
    }

    const handleScroll = () => {
      targetScrollY = window.scrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      ref={gridRef}
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(79, 70, 229, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(79, 70, 229, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        willChange: "transform",
      }}
    />
  )
}

function GlowPulses() {
  const pulses = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      delay: i * 3,
      duration: 6 + Math.random() * 4,
    }))
  }, [])

  return (
    <>
      {pulses.map((pulse) => (
        <motion.div
          key={pulse.id}
          className="absolute w-32 h-32 rounded-full"
          style={{
            left: `${pulse.x}%`,
            top: `${pulse.y}%`,
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            willChange: "transform, opacity",
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: pulse.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: pulse.delay,
          }}
        />
      ))}
    </>
  )
}

// Exportable background component for specific pages
export function PageBackground({ variant = "default" }: { variant?: "default" | "practice" | "dashboard" }) {
  const gradients = {
    default: {
      primary: "rgba(79, 70, 229, 0.1)",
      secondary: "rgba(139, 92, 246, 0.08)",
    },
    practice: {
      primary: "rgba(16, 185, 129, 0.08)",
      secondary: "rgba(34, 211, 238, 0.06)",
    },
    dashboard: {
      primary: "rgba(79, 70, 229, 0.12)",
      secondary: "rgba(236, 72, 153, 0.06)",
    },
  }

  const colors = gradients[variant]

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top right, ${colors.primary} 0%, transparent 50%),
            radial-gradient(ellipse at bottom left, ${colors.secondary} 0%, transparent 50%)
          `,
        }}
      />
    </div>
  )
}
