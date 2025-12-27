"use client"

import { SessionProvider } from "./session-provider"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { LevelUpProvider } from "./level-up-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LevelUpProvider>
            {children}
          </LevelUpProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
