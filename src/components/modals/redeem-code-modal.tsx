"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Key, Loader2, AlertCircle } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { EntitlementPlan } from "@prisma/client"

interface RedeemCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (plan: EntitlementPlan) => void
}

export function RedeemCodeModal({
  isOpen,
  onClose,
  onSuccess,
}: RedeemCodeModalProps) {
  const [code, setCode] = useState(["", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    if (isOpen && inputRefs[0].current) {
      inputRefs[0].current.focus()
    }
  }, [isOpen])

  const handleInputChange = (index: number, value: string) => {
    // Only allow alphanumeric characters
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4)
    const newCode = [...code]
    newCode[index] = cleaned
    setCode(newCode)
    setError(null)

    // Auto-advance to next input
    if (cleaned.length === 4 && index < 2) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Go back on backspace if empty
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")

    if (pasted.length >= 12) {
      setCode([pasted.slice(0, 4), pasted.slice(4, 8), pasted.slice(8, 12)])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fullCode = code.join("-")
    if (fullCode.replace(/-/g, "").length !== 12) {
      setError("Please enter a complete 12-character code")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/access-code/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to redeem code")
      }

      onSuccess(data.plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setTimeout(() => {
        setCode(["", "", ""])
        setError(null)
      }, 300)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(10, 9, 24, 0.9)",
              backdropFilter: "blur(8px)",
            }}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(30, 27, 75, 0.95) 100%)",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                boxShadow: "0 0 60px rgba(79, 70, 229, 0.2)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(79, 70, 229, 0.2)",
                      border: "1px solid rgba(79, 70, 229, 0.3)",
                    }}
                  >
                    <Key className="size-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Redeem Access Code
                    </h2>
                    <p className="text-xs text-[#9CA3AF]">
                      Enter your 12-character code
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="size-8 rounded-lg bg-[#1F2937]/50 flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-[#374151]/50 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Code inputs */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        ref={inputRefs[index]}
                        type="text"
                        value={code[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        maxLength={4}
                        placeholder="XXXX"
                        className="w-20 h-14 text-center text-lg font-mono font-bold tracking-wider rounded-xl bg-[#1F2937]/50 border border-[#374151]/50 text-white placeholder-[#4B5563] focus:outline-none focus:border-[#4F46E5]/50 focus:ring-1 focus:ring-[#4F46E5]/50 transition-colors uppercase"
                        style={{
                          caretColor: "#4F46E5",
                        }}
                      />
                      {index < 2 && (
                        <span className="text-[#6B7280] font-bold">-</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
                  >
                    <AlertCircle className="size-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Submit button */}
                <NeonButton
                  type="submit"
                  className="w-full py-3"
                  disabled={isSubmitting || code.join("").length < 12}
                  rightIcon={
                    isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : undefined
                  }
                >
                  {isSubmitting ? "Redeeming..." : "Unlock Access"}
                </NeonButton>

                {/* Hint */}
                <p className="text-xs text-[#6B7280] text-center mt-4">
                  Codes are case-insensitive. Format: XXXX-XXXX-XXXX
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
