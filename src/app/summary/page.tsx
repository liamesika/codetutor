"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { PublicHeader } from "@/components/shared/public-header"
import { LegalFooter } from "@/components/shared/legal-footer"
import { LanguageProvider } from "@/lib/i18n"
import { summarySections } from "@/content/summary-data"
import type { SummarySection, SubSection, CodeExample } from "@/content/summary-data"
import {
  ChevronDown,
  ChevronLeft,
  BookOpen,
  Code2,
  Menu,
  X,
  FileText,
  ArrowUp,
} from "lucide-react"

/* ─── Table of Contents (desktop sidebar + mobile drawer) ──────── */

function TableOfContents({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <nav className="space-y-0.5">
      {summarySections.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
            activeId === s.id
              ? "bg-[#8B5CF6]/20 text-[#A78BFA] font-semibold"
              : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-xs text-[#6B7280] ml-2">{s.number}.</span>
          {s.title}
        </button>
      ))}
    </nav>
  )
}

/* ─── Code Block ──────────────────────────────────────────────── */

function CodeBlock({ example }: { example: CodeExample }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(example.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3">
      {example.title && (
        <div className="flex items-center gap-2 mb-1.5 text-xs text-[#A78BFA] font-medium" dir="rtl">
          <Code2 className="size-3.5" />
          {example.title}
        </div>
      )}
      <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-[#0D0D1F]">
        <button
          onClick={handleCopy}
          className="absolute top-2 left-2 px-2 py-1 text-[10px] rounded bg-white/10 text-[#9CA3AF] hover:text-white hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <pre className="p-4 text-[13px] leading-relaxed text-[#E5E7EB] overflow-x-auto font-mono" dir="ltr">
          <code>{example.code}</code>
        </pre>
      </div>
    </div>
  )
}

/* ─── SubSection ──────────────────────────────────────────────── */

function SubSectionBlock({ sub }: { sub: SubSection }) {
  return (
    <div className="mb-6" dir="rtl">
      <h3 className="text-base font-bold text-[#E5E7EB] mb-2 flex items-center gap-2">
        <ChevronLeft className="size-4 text-[#8B5CF6]" />
        {sub.title}
      </h3>
      {sub.points && (
        <ul className="space-y-1.5 mr-5 mb-3">
          {sub.points.map((p, i) => (
            <li key={i} className="text-sm text-[#B0B8C4] leading-relaxed flex gap-2">
              <span className="text-[#8B5CF6] mt-1 flex-shrink-0">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {sub.note && (
        <div className="mr-5 mb-3 px-3 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-xs text-[#FCD34D]">
          {sub.note}
        </div>
      )}
      {sub.code?.map((ex, i) => <CodeBlock key={i} example={ex} />)}
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────── */

function SectionBlock({
  section,
  isExpanded,
  onToggle,
}: {
  section: SummarySection
  isExpanded: boolean
  onToggle: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} id={section.id} className="scroll-mt-24">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-[#0F0F23]/80 border border-white/10 hover:border-[#8B5CF6]/30 transition-colors group"
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#8B5CF6] bg-[#8B5CF6]/15 size-8 rounded-lg flex items-center justify-center flex-shrink-0">
            {section.number}
          </span>
          <h2 className="text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors">
            {section.title}
          </h2>
        </div>
        <ChevronDown
          className={`size-5 text-[#6B7280] transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 px-5 py-4 rounded-xl bg-[#0F0F23]/40 border border-white/5"
        >
          {section.intro && (
            <p className="text-sm text-[#9CA3AF] mb-4 leading-relaxed" dir="rtl">
              {section.intro}
            </p>
          )}
          {section.points && (
            <ul className="space-y-1.5 mb-4" dir="rtl">
              {section.points.map((p, i) => (
                <li key={i} className="text-sm text-[#B0B8C4] leading-relaxed flex gap-2">
                  <span className="text-[#8B5CF6] mt-1 flex-shrink-0">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
          {section.code?.map((ex, i) => <CodeBlock key={i} example={ex} />)}
          {section.note && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-xs text-[#FCD34D]" dir="rtl">
              {section.note}
            </div>
          )}
          {section.subsections?.map((sub) => (
            <SubSectionBlock key={sub.id} sub={sub} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────────────── */

export default function SummaryPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState(summarySections[0]?.id ?? "")
  const [tocOpen, setTocOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSection = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => {
    setExpanded(new Set(summarySections.map((s) => s.id)))
  }

  const collapseAll = () => {
    setExpanded(new Set())
  }

  const scrollToSection = (id: string) => {
    setActiveId(id)
    setTocOpen(false)
    if (!expanded.has(id)) {
      setExpanded((prev) => new Set(prev).add(id))
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#0A0A1B] text-white">
        <PublicHeader />

        {/* Hero */}
        <div className="border-b border-white/10 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl" dir="rtl">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
                <BookOpen className="size-5 text-[#8B5CF6]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  סיכום מבוא למדעי המחשב
                </h1>
                <p className="text-sm text-[#9CA3AF]">סיכום מלא לקראת מבחן גמר</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-xs text-[#A78BFA]">
                <FileText className="size-3" />
                {summarySections.length} נושאים
              </span>
              <button
                onClick={expandAll}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
              >
                פתח הכל
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
              >
                סגור הכל
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex gap-8">
            {/* Desktop sidebar TOC */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3 px-3" dir="rtl">
                  תוכן עניינים
                </h3>
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin">
                  <TableOfContents activeId={activeId} onSelect={scrollToSection} />
                </div>
              </div>
            </aside>

            {/* Sections */}
            <div className="flex-1 min-w-0 space-y-3">
              {summarySections.map((section) => (
                <SectionBlock
                  key={section.id}
                  section={section}
                  isExpanded={expanded.has(section.id)}
                  onToggle={() => {
                    toggleSection(section.id)
                    setActiveId(section.id)
                  }}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Mobile TOC button */}
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="lg:hidden fixed bottom-20 left-4 z-40 size-12 rounded-full bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center"
        >
          {tocOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Mobile TOC drawer */}
        {tocOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setTocOpen(false)}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-[#0F0F23] border-r border-white/10 p-4 pt-16 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              <h3 className="text-sm font-bold text-[#6B7280] uppercase mb-3">תוכן עניינים</h3>
              <TableOfContents activeId={activeId} onSelect={scrollToSection} />
            </motion.div>
          </div>
        )}

        {/* Scroll to top */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-20 right-4 z-40 size-10 rounded-full bg-white/10 border border-white/10 text-[#9CA3AF] hover:text-white hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <ArrowUp className="size-4" />
          </button>
        )}

        <LegalFooter variant="compact" />
      </div>
    </LanguageProvider>
  )
}
