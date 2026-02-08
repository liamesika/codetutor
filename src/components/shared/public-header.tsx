"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Menu, ArrowRight, LogOut, LayoutDashboard, Home } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { MobileDrawer } from "@/components/shared/mobile-drawer"
import { useLanguage, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const text = {
  en: {
    home: "Home",
    pricing: "Pricing",
    login: "Log in",
    cta: "Join the Marathon",
    dashboard: "Dashboard",
    signOut: "Sign Out",
  },
  he: {
    home: "דף הבית",
    pricing: "מחירון",
    login: "התחברות",
    cta: "הצטרפו למרתון",
    dashboard: "לוח בקרה",
    signOut: "התנתקות",
  },
}

export function PublicHeader() {
  const { data: session, status } = useSession()
  const { locale, setLocale } = useLanguage()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const t = text[locale]

  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <header className="relative z-10 border-b border-white/5 bg-[#0A0A1B]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
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
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
          >
            {t.pricing}
          </Link>
          <Link
            href="/"
            className="text-sm text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Home className="h-3.5 w-3.5" />
            {t.home}
          </Link>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle locale={locale} setLocale={setLocale} />

          {status === "loading" ? (
            <div className="w-20 h-9 bg-white/5 animate-pulse rounded-lg" />
          ) : session?.user ? (
            <Link href="/dashboard">
              <NeonButton
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {t.dashboard}
              </NeonButton>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <NeonButton variant="ghost" size="sm">
                  {t.login}
                </NeonButton>
              </Link>
              <Link href="/pricing">
                <NeonButton
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {t.cta}
                </NeonButton>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle locale={locale} setLocale={setLocale} />
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer}>
        <nav className="flex flex-col p-4">
          <div className="space-y-1 mb-6">
            <Link
              href="/pricing"
              onClick={closeDrawer}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {t.pricing}
            </Link>
            <Link
              href="/"
              onClick={closeDrawer}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Home className="h-4 w-4 text-[#9CA3AF]" />
              {t.home}
            </Link>
          </div>

          <div className="h-px bg-white/10 my-2" />

          <div className="mt-4 space-y-2">
            {status === "loading" ? (
              <div className="h-12 bg-white/5 animate-pulse rounded-lg" />
            ) : session?.user ? (
              <>
                <div className="px-4 py-3 bg-white/5 rounded-lg mb-4">
                  <p className="font-medium text-sm truncate text-white">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-xs text-[#9CA3AF] truncate">
                    {session.user.email}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#9CA3AF]" />
                  {t.dashboard}
                </Link>
                <button
                  onClick={() => {
                    closeDrawer()
                    import("next-auth/react").then((m) =>
                      m.signOut({ callbackUrl: "/" })
                    )
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeDrawer}>
                  <button className="w-full px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
                    {t.login}
                  </button>
                </Link>
                <Link href="/pricing" onClick={closeDrawer}>
                  <button className="w-full px-4 py-3 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90 transition-colors font-medium flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    {t.cta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </MobileDrawer>
    </header>
  )
}

function LanguageToggle({
  locale,
  setLocale,
}: {
  locale: Locale
  setLocale: (l: Locale) => void
}) {
  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5">
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
          locale === "en"
            ? "bg-[#4F46E5] text-white"
            : "text-[#9CA3AF] hover:text-white"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("he")}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
          locale === "he"
            ? "bg-[#4F46E5] text-white"
            : "text-[#9CA3AF] hover:text-white"
        )}
      >
        עב
      </button>
    </div>
  )
}
