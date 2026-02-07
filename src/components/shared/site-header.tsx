"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Menu, Play, ArrowRight, LogOut, User, LayoutDashboard, Settings } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { MobileDrawer } from "@/components/shared/mobile-drawer"
import { cn } from "@/lib/utils"

interface NavLink {
  href: string
  label: string
  icon?: React.ReactNode
  highlight?: boolean
}

const publicLinks: NavLink[] = [
  { href: "/demo", label: "Try Demo", icon: <Play className="h-4 w-4" /> },
  { href: "/pricing", label: "Pricing" },
  { href: "/#features", label: "Features" },
]

export function SiteHeader() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleNavClick = () => {
    setIsDrawerOpen(false)
  }

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image
            src="/images/logo.png"
            alt="CodeTutor"
            width={150}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors flex items-center gap-1.5",
                link.highlight
                  ? "font-medium text-[#4F46E5] hover:text-[#22D3EE]"
                  : "text-muted-foreground hover:text-foreground",
                isActive(link.href) && "text-foreground"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-20 h-9 bg-muted animate-pulse rounded-lg" />
          ) : session?.user ? (
            <Link href="/dashboard">
              <NeonButton variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Dashboard
              </NeonButton>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <NeonButton variant="ghost" size="sm">
                  Log in
                </NeonButton>
              </Link>
              <Link href="/signup">
                <NeonButton variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Get Started
                </NeonButton>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <nav className="flex flex-col p-4">
          {/* Navigation Links */}
          <div className="space-y-1 mb-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  link.highlight
                    ? "text-[#4F46E5] font-medium hover:bg-[#4F46E5]/10"
                    : "text-foreground hover:bg-muted",
                  isActive(link.href) && "bg-muted"
                )}
              >
                {link.icon && <span className="text-muted-foreground">{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-2" />

          {/* Auth Section */}
          <div className="mt-4 space-y-2">
            {status === "loading" ? (
              <div className="h-12 bg-muted animate-pulse rounded-lg" />
            ) : session?.user ? (
              <>
                {/* User Info */}
                <div className="px-4 py-3 bg-muted/50 rounded-lg mb-4">
                  <p className="font-medium text-sm truncate">{session.user.name || session.user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={handleNavClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={handleNavClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={handleNavClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </Link>

                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#4F46E5] hover:bg-[#4F46E5]/10 transition-colors font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleNavClick()
                    signOut({ callbackUrl: "/" })
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={handleNavClick}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
                  >
                    Log in
                  </motion.button>
                </Link>
                <Link href="/signup" onClick={handleNavClick}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </MobileDrawer>
    </header>
  )
}
