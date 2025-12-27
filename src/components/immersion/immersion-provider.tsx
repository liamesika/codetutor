"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { MentorHUD } from "./mentor-hud"
import { ScrollCompanion } from "./scroll-companion"
import { MentorAvatar } from "./mentor-avatar"
import { AmbientMotion } from "./ambient-motion"
import { MobileNavBar } from "./mobile-nav-bar"

interface ImmersionProviderProps {
  children: React.ReactNode
}

export function ImmersionProvider({ children }: ImmersionProviderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Exclude auth and admin pages from immersion features
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup")
  const isAdminPage = pathname?.startsWith("/admin")
  const showImmersion = session?.user && !isAuthPage && !isAdminPage

  return (
    <>
      {/* Ambient background layer */}
      {showImmersion && <AmbientMotion />}

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Immersion overlays */}
      {showImmersion && (
        <>
          {/* Mentor HUD at top */}
          <MentorHUD />

          {/* Scroll companion nudges */}
          <ScrollCompanion />

          {/* Floating mentor avatar */}
          <MentorAvatar />

          {/* Mobile navigation bar */}
          <MobileNavBar />
        </>
      )}
    </>
  )
}
