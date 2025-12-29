"use client"

import Link from "next/link"
import { Code2 } from "lucide-react"

const legalLinks = [
  { href: "/terms", label: "Terms", labelHe: "תנאים" },
  { href: "/privacy", label: "Privacy", labelHe: "פרטיות" },
  { href: "/cookies", label: "Cookies", labelHe: "עוגיות" },
  { href: "/security", label: "Security", labelHe: "אבטחה" },
  { href: "/accessibility", label: "Accessibility", labelHe: "נגישות" },
  { href: "/data-rights", label: "My Data", labelHe: "הנתונים שלי" },
]

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A1B]/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
              CodeTutor
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/login"
            className="text-sm text-[#22D3EE] hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6B7280] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company info */}
          <div className="text-center text-sm text-[#6B7280]">
            <p className="mb-2">
              <span className="text-white font-medium">Lia Mesika</span> | Business ID: 213754476 | Israel
            </p>
            <p className="mb-4">
              Contact: <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a>
            </p>
            <div className="flex items-center justify-center gap-2">
              <Code2 className="h-4 w-4 text-[#4F46E5]" />
              <span>CodeTutor - Java Mastery for CS Students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
