"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cookie, Shield, BarChart3, Settings2, X } from "lucide-react"

// Cookie preference categories
export interface CookiePreferences {
  essential: boolean // Always true, cannot be disabled
  functional: boolean
  analytics: boolean
  consentDate: string | null
  consentVersion: string
}

const CONSENT_VERSION = "1.0"
const STORAGE_KEY = "cookie-consent"

// Default preferences (essential only)
const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  consentDate: null,
  consentVersion: CONSENT_VERSION,
}

// Cookie category descriptions
const COOKIE_CATEGORIES = [
  {
    id: "essential" as const,
    name: "Essential Cookies",
    nameHe: "עוגיות חיוניות",
    description: "Required for the website to function. These cannot be disabled.",
    descriptionHe: "נדרשות לתפקוד האתר. לא ניתן לבטלן.",
    icon: Shield,
    required: true,
    examples: ["Session authentication", "Security tokens", "CSRF protection"],
  },
  {
    id: "functional" as const,
    name: "Functional Cookies",
    nameHe: "עוגיות פונקציונליות",
    description: "Enable personalized features like theme preferences and saved settings.",
    descriptionHe: "מאפשרות תכונות מותאמות אישית כמו העדפות ערכת נושא והגדרות שמורות.",
    icon: Settings2,
    required: false,
    examples: ["Theme preference", "Language settings", "Editor preferences"],
  },
  {
    id: "analytics" as const,
    name: "Analytics Cookies",
    nameHe: "עוגיות אנליטיקה",
    description: "Help us understand how visitors use our site to improve the experience.",
    descriptionHe: "עוזרות לנו להבין כיצד מבקרים משתמשים באתר שלנו כדי לשפר את החוויה.",
    icon: BarChart3,
    required: false,
    examples: ["Page views", "Session duration", "Feature usage"],
  },
]

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)
  const [isClient, setIsClient] = useState(false)

  // Check for existing consent on mount
  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookiePreferences
        // Check if consent version matches
        if (parsed.consentVersion === CONSENT_VERSION && parsed.consentDate) {
          setPreferences(parsed)
          applyPreferences(parsed)
          return // Don't show banner if valid consent exists
        }
      } catch {
        // Invalid stored data, show banner
      }
    }

    // Show banner after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Apply cookie preferences
  const applyPreferences = useCallback((prefs: CookiePreferences) => {
    // Dispatch event for other scripts to react to
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: prefs }))

      // If analytics disabled, try to opt-out of any existing analytics
      if (!prefs.analytics) {
        // Disable Google Analytics if present
        if (typeof window !== "undefined" && "gtag" in window) {
          (window as unknown as { gtag: (cmd: string, key: string, value: boolean) => void }).gtag("consent", "update", {
            analytics_storage: "denied",
          } as unknown as boolean)
        }
      }
    }
  }, [])

  // Save preferences
  const savePreferences = useCallback((prefs: CookiePreferences) => {
    const withDate: CookiePreferences = {
      ...prefs,
      consentDate: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withDate))
    setPreferences(withDate)
    applyPreferences(withDate)
    setIsVisible(false)
  }, [applyPreferences])

  // Accept all cookies
  const acceptAll = useCallback(() => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      consentDate: null,
      consentVersion: CONSENT_VERSION,
    })
  }, [savePreferences])

  // Reject all non-essential
  const rejectAll = useCallback(() => {
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      consentDate: null,
      consentVersion: CONSENT_VERSION,
    })
  }, [savePreferences])

  // Save custom preferences
  const saveCustom = useCallback(() => {
    savePreferences(preferences)
  }, [preferences, savePreferences])

  // Toggle a category
  const toggleCategory = (category: "functional" | "analytics") => {
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Don't render on server
  if (!isClient || !isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop for details view */}
      {showDetails && (
        <div
          className="absolute inset-0 bg-black/50 pointer-events-auto"
          onClick={() => setShowDetails(false)}
        />
      )}

      <Card className={`
        relative w-full max-w-2xl shadow-2xl border-border/50
        pointer-events-auto transition-all duration-300
        ${showDetails ? "max-h-[80vh] overflow-y-auto" : ""}
      `}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cookie Preferences</CardTitle>
            </div>
            {showDetails && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowDetails(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription className="text-sm">
            We use cookies to enhance your experience. You can customize your preferences below.
            <br />
            <span className="text-xs text-muted-foreground/80" dir="rtl">
              אנו משתמשים בעוגיות לשיפור החוויה שלך. תוכל להתאים את ההעדפות שלך למטה.
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Detailed preferences */}
          {showDetails ? (
            <div className="space-y-4">
              {COOKIE_CATEGORIES.map((category) => {
                const Icon = category.icon
                const isChecked = category.required || preferences[category.id]

                return (
                  <div
                    key={category.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="mt-1">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{category.name}</h4>
                          <p className="text-xs text-muted-foreground" dir="rtl">
                            {category.nameHe}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {category.required && (
                            <span className="text-xs text-muted-foreground">Required</span>
                          )}
                          <Switch
                            checked={isChecked}
                            onCheckedChange={() => {
                              if (!category.required) {
                                toggleCategory(category.id as "functional" | "analytics")
                              }
                            }}
                            disabled={category.required}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                      <p className="text-xs text-muted-foreground/80" dir="rtl">
                        {category.descriptionHe}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {category.examples.map((example) => (
                          <span
                            key={example}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border/50"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button onClick={saveCustom} className="flex-1">
                  Save Preferences
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Read our{" "}
                <Link href="/cookies" className="underline hover:text-primary">
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>{" "}
                for more information.
              </p>
            </div>
          ) : (
            /* Simple consent buttons */
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={acceptAll} className="flex-1">
                  Accept All
                </Button>
                <Button variant="outline" onClick={rejectAll} className="flex-1">
                  Reject Non-Essential
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <button
                  onClick={() => setShowDetails(true)}
                  className="underline hover:text-primary transition-colors"
                >
                  Customize preferences
                </button>
                <div className="flex gap-3">
                  <Link href="/cookies" className="underline hover:text-primary">
                    Cookies
                  </Link>
                  <Link href="/privacy" className="underline hover:text-primary">
                    Privacy
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook to check cookie consent
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch {
        setPreferences(null)
      }
    }

    // Listen for updates
    const handleUpdate = (event: CustomEvent<CookiePreferences>) => {
      setPreferences(event.detail)
    }

    window.addEventListener("cookieConsentUpdated", handleUpdate as EventListener)
    return () => window.removeEventListener("cookieConsentUpdated", handleUpdate as EventListener)
  }, [])

  return {
    preferences,
    hasConsent: preferences?.consentDate !== null,
    canUseAnalytics: preferences?.analytics ?? false,
    canUseFunctional: preferences?.functional ?? false,
  }
}

// Function to open cookie settings (for footer link)
export function openCookieSettings() {
  localStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}
