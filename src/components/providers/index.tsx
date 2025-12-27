"use client"

import { SessionProvider } from "./session-provider"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { LevelUpProvider } from "./level-up-provider"
import { SkillUnlockProvider } from "./skill-unlock-provider"
import { AppSplashProvider } from "./app-splash-provider"
import { DailyLoginProvider } from "./daily-login-provider"
import { DailyMissionProvider } from "./daily-mission-provider"
import { StreakProtectionProvider } from "./streak-protection-provider"
import { DropOffRecoveryProvider } from "./drop-off-recovery-provider"
import { RankProvider } from "./rank-provider"
import { DopamineProvider } from "./dopamine-provider"
import { ImmersionProvider } from "@/components/immersion"
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
              <DopamineProvider>
                <LevelUpProvider>
                  <RankProvider>
                    <SkillUnlockProvider>
                      <DailyLoginProvider>
                        <DailyMissionProvider>
                          <StreakProtectionProvider>
                            <DropOffRecoveryProvider>
                              <ImmersionProvider>
                                {children}
                              </ImmersionProvider>
                            </DropOffRecoveryProvider>
                          </StreakProtectionProvider>
                        </DailyMissionProvider>
                      </DailyLoginProvider>
                    </SkillUnlockProvider>
                  </RankProvider>
                </LevelUpProvider>
              </DopamineProvider>
            </AppSplashProvider>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </QueryProvider>
      </SessionProvider>
    </AppErrorBoundary>
  )
}
