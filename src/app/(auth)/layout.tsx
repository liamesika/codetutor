"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Play, CreditCard } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),transparent_50%)]" />
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#22D3EE]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0A0A1B]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
              CodeTutor
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/demo">
              <NeonButton variant="ghost" size="sm" leftIcon={<Play className="h-4 w-4" />}>
                <span className="hidden sm:inline">Try Demo</span>
              </NeonButton>
            </Link>
            <Link href="/pricing">
              <NeonButton variant="ghost" size="sm" leftIcon={<CreditCard className="h-4 w-4" />}>
                <span className="hidden sm:inline">Pricing</span>
              </NeonButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-[#4F46E5]" />
            <span>CodeTutor</span>
          </div>
          <p>Java Mastery for CS Students</p>
        </div>
      </footer>
    </div>
  )
}
