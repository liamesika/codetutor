"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useMemo } from "react"

interface ExecutionOverlayProps {
  isExecuting: boolean
}

// Matrix rain column
function MatrixColumn({ index, height }: { index: number; height: number }) {
  const chars = useMemo(() => {
    const charSet = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01{}[]<>/\\=+-*&^%$#@!?"
    return Array.from({ length: Math.floor(height / 16) }, () =>
      charSet[Math.floor(Math.random() * charSet.length)]
    )
  }, [height])

  const delay = useMemo(() => Math.random() * 2, [])
  const duration = useMemo(() => 1.5 + Math.random() * 2, [])
  const opacity = useMemo(() => 0.3 + Math.random() * 0.5, [])

  return (
    <motion.div
      className="absolute text-xs font-mono leading-4 select-none pointer-events-none"
      style={{
        left: index * 14,
        top: -height,
        color: "#22D3EE",
        textShadow: "0 0 8px #22D3EE, 0 0 16px #22D3EE",
        opacity,
        writingMode: "vertical-rl",
        letterSpacing: "0.1em",
      }}
      initial={{ y: 0 }}
      animate={{ y: height * 2 }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// AI Neural core visualization
function NeuralCore() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "2px solid transparent",
          borderTopColor: "#22D3EE",
          borderRightColor: "#4F46E5",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle rotating ring (opposite direction) */}
      <motion.div
        className="absolute inset-3 rounded-full"
        style={{
          border: "2px solid transparent",
          borderBottomColor: "#8B5CF6",
          borderLeftColor: "#22D3EE",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner pulsing core */}
      <motion.div
        className="absolute inset-6 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(79, 70, 229, 0.1) 70%, transparent 100%)",
          boxShadow: "0 0 40px rgba(34, 211, 238, 0.4), inset 0 0 20px rgba(34, 211, 238, 0.2)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Neural network icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-12 md:w-14 md:h-14"
          fill="none"
          stroke="url(#neuralGradient)"
          strokeWidth="1.5"
        >
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {/* Brain/neural network pattern */}
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
          <circle cx="8" cy="19" r="2" />
          <circle cx="16" cy="19" r="2" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="7" x2="12" y2="9" />
          <line x1="7" y1="12" x2="9" y2="12" />
          <line x1="15" y1="12" x2="17" y2="12" />
          <line x1="9.5" y1="17.5" x2="10" y2="14.5" />
          <line x1="14.5" y1="17.5" x2="14" y2="14.5" />
        </svg>
      </motion.div>

      {/* Orbiting particles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? "#22D3EE" : "#8B5CF6",
            boxShadow: `0 0 10px ${i % 2 === 0 ? "#22D3EE" : "#8B5CF6"}`,
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [
              Math.cos((i * Math.PI) / 2) * 60 - 4,
              Math.cos((i * Math.PI) / 2 + Math.PI) * 60 - 4,
              Math.cos((i * Math.PI) / 2) * 60 - 4,
            ],
            y: [
              Math.sin((i * Math.PI) / 2) * 60 - 4,
              Math.sin((i * Math.PI) / 2 + Math.PI) * 60 - 4,
              Math.sin((i * Math.PI) / 2) * 60 - 4,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Loading text with typing effect
function LoadingText() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-center"
    >
      <p
        className="text-lg md:text-xl font-medium tracking-wider"
        style={{
          color: "#22D3EE",
          textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
        }}
      >
        Neural Executor Running{dots}
      </p>
      <motion.p
        className="text-sm text-[#6B7280] mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Compiling and executing your code
      </motion.p>
    </motion.div>
  )
}

export function ExecutionOverlay({ isExecuting }: ExecutionOverlayProps) {
  const [columns, setColumns] = useState<number[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
        const columnCount = Math.floor(window.innerWidth / 14)
        // Only use subset of columns for performance
        const activeColumns = Math.floor(columnCount * 0.3)
        const selectedIndices: number[] = []
        while (selectedIndices.length < activeColumns) {
          const idx = Math.floor(Math.random() * columnCount)
          if (!selectedIndices.includes(idx)) {
            selectedIndices.push(idx)
          }
        }
        setColumns(selectedIndices)
      }

      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [isExecuting])

  return (
    <AnimatePresence>
      {isExecuting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(10, 9, 24, 0.85)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Matrix rain effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {columns.map((colIndex) => (
              <MatrixColumn
                key={colIndex}
                index={colIndex}
                height={dimensions.height}
              />
            ))}
          </div>

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, rgba(10, 9, 24, 0.8) 100%)",
            }}
          />

          {/* Center content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            <NeuralCore />
            <LoadingText />
          </motion.div>

          {/* Pulse glow effect around edges */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 100px rgba(34, 211, 238, 0.15), inset 0 0 200px rgba(79, 70, 229, 0.1)",
            }}
            animate={{
              boxShadow: [
                "inset 0 0 100px rgba(34, 211, 238, 0.15), inset 0 0 200px rgba(79, 70, 229, 0.1)",
                "inset 0 0 120px rgba(34, 211, 238, 0.25), inset 0 0 220px rgba(79, 70, 229, 0.15)",
                "inset 0 0 100px rgba(34, 211, 238, 0.15), inset 0 0 200px rgba(79, 70, 229, 0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
