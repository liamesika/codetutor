"use client"

import { PublicHeader } from "@/components/shared/public-header"
import { LegalFooter } from "@/components/shared/legal-footer"
import { VideoCTASection } from "@/components/shared/video-cta-section"
import { TheorySummariesTab } from "@/components/dashboard/theory-summaries-tab"
import { LanguageProvider } from "@/lib/i18n"

export default function TheoryPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#0A0A1B] text-white">
        <PublicHeader />

        <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          <TheorySummariesTab />
          <VideoCTASection />
        </main>

        <LegalFooter variant="compact" />
      </div>
    </LanguageProvider>
  )
}
