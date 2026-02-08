"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

interface DeviceWarningOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function DeviceWarningOverlay({
  isOpen,
  onClose,
}: DeviceWarningOverlayProps) {
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(onClose, 8000)
    return () => clearTimeout(timer)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Red backdrop */}
          <motion.div
            className="absolute inset-0 bg-red-950/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -30 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 200,
              delay: 0.1,
            }}
          >
            {/* Shield icon with pulsing red glow */}
            <motion.div
              className="relative mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
            >
              <motion.div
                className="absolute -inset-6 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(239,68,68,0.4) 0%, rgba(185,28,28,0.3) 100%)",
                  boxShadow:
                    "0 0 50px rgba(239,68,68,0.6), inset 0 0 20px rgba(255,255,255,0.1)",
                }}
              >
                <ShieldAlert
                  className="size-12 text-red-400"
                  style={{ filter: "drop-shadow(0 0 15px currentColor)" }}
                />
              </div>
            </motion.div>

            {/* Warning title */}
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-red-400 mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ filter: "drop-shadow(0 0 10px rgba(239,68,68,0.4))" }}
            >
              אזהרת אבטחה
            </motion.h2>

            {/* Warning text */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              dir="rtl"
            >
              <p className="text-lg text-red-200 leading-relaxed mb-3">
                זוהתה התחברות ממכשיר חדש.
              </p>
              <p className="text-base text-red-300/80 leading-relaxed">
                על פי תנאי השימוש, שיתוף חשבון עלול לגרום לחסימת החשבון לצמיתות.
              </p>
            </motion.div>

            {/* Reported notice */}
            <motion.div
              className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              dir="rtl"
            >
              <p className="text-sm text-red-300/70 text-center">
                פעולה זו תועדה ודווחה למנהל המערכת.
              </p>
            </motion.div>

            {/* Dismiss button */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <NeonButton onClick={onClose} className="w-full py-4 text-lg">
                הבנתי
              </NeonButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
