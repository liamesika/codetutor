"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, CreditCard } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"

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
            <Image
              src="/images/logo.png"
              alt="CodeTutor"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
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
      <LegalFooter variant="compact" />
    </div>
  )
}
