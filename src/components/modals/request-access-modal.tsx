"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Loader2, Check, Mail, User } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

interface RequestAccessModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
  userName?: string
}

export function RequestAccessModal({
  isOpen,
  onClose,
  userEmail = "",
  userName = "",
}: RequestAccessModalProps) {
  const [fullName, setFullName] = useState(userName)
  const [email, setEmail] = useState(userEmail)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request")
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      // Reset state after animation completes
      setTimeout(() => {
        setFullName(userName)
        setEmail(userEmail)
        setMessage("")
        setIsSuccess(false)
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
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(10, 9, 24, 0.9)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Modal */}
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
                    <Send className="size-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Request Access
                    </h2>
                    <p className="text-xs text-[#9CA3AF]">
                      We&apos;ll review your request shortly
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
              <div className="p-6">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div
                      className="size-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #22D3EE 100%)",
                        boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      <Check className="size-8 text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Request Submitted!
                    </h3>
                    <p className="text-[#9CA3AF] mb-6">
                      We&apos;ll review your request and get back to you soon.
                    </p>
                    <NeonButton onClick={handleClose} className="px-8">
                      Done
                    </NeonButton>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field */}
                    <div>
                      <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6B7280]" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1F2937]/50 border border-[#374151]/50 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5]/50 focus:ring-1 focus:ring-[#4F46E5]/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6B7280]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1F2937]/50 border border-[#374151]/50 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5]/50 focus:ring-1 focus:ring-[#4F46E5]/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Message field */}
                    <div>
                      <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                        Message{" "}
                        <span className="text-[#6B7280]">(optional)</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us a bit about yourself..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-[#1F2937]/50 border border-[#374151]/50 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5]/50 focus:ring-1 focus:ring-[#4F46E5]/50 transition-colors resize-none"
                      />
                    </div>

                    {/* Error message */}
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                      >
                        {error}
                      </motion.p>
                    )}

                    {/* Submit button */}
                    <NeonButton
                      type="submit"
                      className="w-full py-3"
                      disabled={isSubmitting}
                      rightIcon={
                        isSubmitting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Send className="size-4" />
                        )
                      }
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </NeonButton>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
