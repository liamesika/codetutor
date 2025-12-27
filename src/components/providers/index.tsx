"use client"

import { SessionProvider } from "./session-provider"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { LevelUpProvider } from "./level-up-provider"
import { SkillUnlockProvider } from "./skill-unlock-provider"
import { AppSplashProvider } from "./app-splash-provider"
import { AppErrorBoundary } from "@/components/app-error-boundary"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary>
      <SessionProvider>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AppSplashProvider>
              <LevelUpProvider>
                <SkillUnlockProvider>
                  {children}
                </SkillUnlockProvider>
              </LevelUpProvider>
            </AppSplashProvider>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </QueryProvider>
      </SessionProvider>
    </AppErrorBoundary>
  )
}
