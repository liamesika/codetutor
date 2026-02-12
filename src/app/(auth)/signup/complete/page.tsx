"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import Link from "next/link"

export default function SignupCompletePage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createAccount = async () => {
      const raw = sessionStorage.getItem("pendingSignup")
      if (!raw) {
        setStatus("error")
        setError("No signup data found. Please sign up again.")
        return
      }

      try {
        const data = JSON.parse(raw)

        // Create the account
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        if (!response.ok) {
          setStatus("error")
          setError(result.error || "Failed to create account")
          return
        }

        // Clear pending data
        sessionStorage.removeItem("pendingSignup")

        // Auto sign in
        const signInResult = await signIn("credentials", {
          email: data.email.toLowerCase(),
          password: data.password,
          redirect: false,
        })

        if (signInResult?.error) {
          // Account created but auto-login failed
          setStatus("success")
          setTimeout(() => router.push("/login"), 2000)
          return
        }

        setStatus("success")
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1500)
      } catch {
        setStatus("error")
        setError("Something went wrong. Please try again.")
      }
    }

    createAccount()
  }, [router])

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 backdrop-blur-xl p-8 text-center"
      >
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 text-[#4F46E5] animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Creating your account...</h2>
            <p className="text-[#9CA3AF]">Payment received. Setting everything up.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Account created!</h2>
            <p className="text-[#9CA3AF]">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-[#9CA3AF]">{error}</p>
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/signup?plan=basic">
                <NeonButton variant="primary" className="w-full">
                  Try Again
                </NeonButton>
              </Link>
              <Link href="/login">
                <NeonButton variant="ghost" className="w-full">
                  Already have an account? Sign in
                </NeonButton>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
