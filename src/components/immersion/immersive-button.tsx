"use client"

import { forwardRef, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface ImmersiveButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  success?: boolean
  locked?: boolean
  glow?: boolean
  children?: React.ReactNode
}

export const ImmersiveButton = forwardRef<HTMLButtonElement, ImmersiveButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      loading,
      success,
      locked,
      glow = true,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
    const [isHovered, setIsHovered] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const buttonRef = useRef<HTMLButtonElement>(null)
    const rippleIdRef = useRef(0)

    const isDisabled = disabled || loading || locked

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (isDisabled) return

        // Add ripple
        const rect = buttonRef.current?.getBoundingClientRect()
        if (rect) {
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const newRipple = { id: rippleIdRef.current++, x, y }
          setRipples((prev) => [...prev, newRipple])

          // Remove ripple after animation
          setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
          }, 600)
        }

        // Haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate(10)
        }

        onClick?.(e)
      },
      [isDisabled, onClick]
    )

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (isDisabled) return
        const rect = buttonRef.current?.getBoundingClientRect()
        if (rect) {
          setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          })
        }
      },
      [isDisabled]
    )

    const variants = {
      primary: {
        base: "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white",
        hover: "from-[#5B52F5] to-[#7375FF]",
        glow: "rgba(79, 70, 229, 0.5)",
        ripple: "rgba(255, 255, 255, 0.4)",
      },
      secondary: {
        base: "bg-[#1F2937] text-white border border-[#374151]",
        hover: "bg-[#374151]",
        glow: "rgba(55, 65, 81, 0.5)",
        ripple: "rgba(255, 255, 255, 0.2)",
      },
      ghost: {
        base: "bg-transparent text-[#E5E7EB] hover:bg-[#1F2937]/50",
        hover: "bg-[#1F2937]/80",
        glow: "rgba(31, 41, 55, 0.3)",
        ripple: "rgba(255, 255, 255, 0.1)",
      },
      danger: {
        base: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        hover: "from-red-600 to-red-700",
        glow: "rgba(239, 68, 68, 0.5)",
        ripple: "rgba(255, 255, 255, 0.4)",
      },
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
      md: "px-4 py-2.5 text-sm rounded-xl gap-2",
      lg: "px-6 py-3.5 text-base rounded-xl gap-2.5",
    }

    const currentVariant = variants[variant]

    return (
      <motion.button
        ref={(node) => {
          // @ts-ignore
          buttonRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        className={cn(
          "relative overflow-hidden font-semibold inline-flex items-center justify-center transition-all duration-200",
          sizes[size],
          currentVariant.base,
          isDisabled && "opacity-50 cursor-not-allowed",
          locked && "cursor-not-allowed",
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        style={{
          boxShadow: glow && !isDisabled
            ? isHovered
              ? `0 0 20px ${currentVariant.glow}, 0 4px 12px rgba(0, 0, 0, 0.3)`
              : `0 0 10px ${currentVariant.glow}, 0 2px 8px rgba(0, 0, 0, 0.2)`
            : undefined,
        }}
        {...props}
      >
        {/* Hover light reflection */}
        {!isDisabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          />
        )}

        {/* Locked shimmer */}
        {locked && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              backgroundPosition: ["200% 0%", "-200% 0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        )}

        {/* Ripples */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: currentVariant.ripple,
            }}
            initial={{ width: 0, height: 0, opacity: 0.5, x: 0, y: 0 }}
            animate={{
              width: 300,
              height: 300,
              opacity: 0,
              x: -150,
              y: -150,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}

        {/* Success glow pulse */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <span className="relative z-10 flex items-center gap-inherit">
          {loading ? (
            <motion.div
              className="size-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            leftIcon
          )}
          {children}
          {!loading && rightIcon}
        </span>
      </motion.button>
    )
  }
)

ImmersiveButton.displayName = "ImmersiveButton"
