"use client"

import Link from "next/link"
import { ArrowRight, Rocket } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { useLanguage } from "@/lib/i18n"

const text = {
  en: {
    videoTitle: "See the Platform in",
    videoHighlight: "Action",
    videoSub: "A quick look at what the marathon experience looks like.",
    ctaTitle: "Ready to Try",
    ctaHighlight: "Day 1 Free",
    ctaSub: "Start practicing now — no credit card required.",
    ctaButton: "Start Free",
    ctaNote: "Day 1 is free. Upgrade anytime for full access.",
  },
  he: {
    videoTitle: "צפו במערכת",
    videoHighlight: "בפעולה",
    videoSub: "הצצה קצרה לחוויית המרתון מבפנים.",
    ctaTitle: "מוכנים לנסות",
    ctaHighlight: "יום 1 חינם",
    ctaSub: "התחילו לתרגל עכשיו — בלי כרטיס אשראי.",
    ctaButton: "התחילו חינם",
    ctaNote: "יום 1 חינם. שדרגו בכל עת לגישה מלאה.",
  },
}

export function VideoCTASection() {
  const { locale } = useLanguage()
  const t = text[locale]

  return (
    <section className="py-16 md:py-24 space-y-16 md:space-y-24">
      {/* Video */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t.videoTitle}{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
              {t.videoHighlight}
            </span>
          </h2>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto">{t.videoSub}</p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(79,70,229,0.15)]">
          <video
            src="/images/VID.mov"
            autoPlay
            muted
            loop
            playsInline
            className="w-full"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto text-center relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#4F46E5]/15 rounded-full blur-3xl" />
        </div>

        <div className="rounded-2xl p-8 md:p-12 border border-white/10 bg-[#0F0F23]/80 backdrop-blur-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
            <Rocket className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t.ctaTitle}{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
              {t.ctaHighlight}
            </span>
            ?
          </h2>
          <p className="text-[#9CA3AF] mb-6 text-lg max-w-xl mx-auto">{t.ctaSub}</p>
          <Link href="/signup?plan=free">
            <NeonButton variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              {t.ctaButton}
            </NeonButton>
          </Link>
          <p className="text-sm text-[#6B7280] mt-5">{t.ctaNote}</p>
        </div>
      </div>
    </section>
  )
}
