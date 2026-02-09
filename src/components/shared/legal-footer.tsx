"use client"

import Link from "next/link"
import { Code2 } from "lucide-react"

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/security", label: "Security" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/cancellation", label: "Cancellation Policy" },
]

interface LegalFooterProps {
  className?: string
  variant?: "full" | "compact"
}

export function LegalFooter({ className = "", variant = "full" }: LegalFooterProps) {
  if (variant === "compact") {
    return (
      <footer className={`relative z-10 border-t border-white/5 py-6 px-4 ${className}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#6B7280]">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#4F46E5]" />
              <span>CodeTutor</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-3 text-xs">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#6B7280] hover:text-[#22D3EE] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`border-t border-white/5 py-12 px-4 ${className}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                CodeTutor
              </span>
            </Link>
            <p className="text-sm text-[#6B7280]">
              Java Mastery for CS Students.<br />
              Built with care.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Product</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/demo" className="text-sm text-[#6B7280] hover:text-[#22D3EE] transition-colors">
                Try Demo
              </Link>
              <Link href="/pricing" className="text-sm text-[#6B7280] hover:text-[#22D3EE] transition-colors">
                Pricing
              </Link>
              <Link href="/signup" className="text-sm text-[#6B7280] hover:text-[#22D3EE] transition-colors">
                Sign Up
              </Link>
              <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#22D3EE] transition-colors">
                Log In
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Legal</h3>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#6B7280] hover:text-[#22D3EE] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()} Lia Mesika. All rights reserved.
          </p>
          <p className="text-xs text-[#6B7280]">
            Business ID: 213754476 | Or Akiva, Israel | Tel: 058-7878676
          </p>
        </div>
      </div>
    </footer>
  )
}
