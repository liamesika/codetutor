"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

export type Locale = "en" | "he"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  dir: "ltr" | "rtl"
  isHebrew: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "he",
  setLocale: () => {},
  dir: "rtl",
  isHebrew: true,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("he")

  useEffect(() => {
    const saved = localStorage.getItem("codetutor-lang") as Locale | null
    if (saved === "he" || saved === "en") {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("codetutor-lang", newLocale)
  }, [])

  const dir = locale === "he" ? "rtl" : "ltr"
  const isHebrew = locale === "he"

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, isHebrew }}>
      <div
        dir={dir}
        lang={locale}
        style={isHebrew ? { fontFamily: "var(--font-rubik), system-ui, sans-serif" } : undefined}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
