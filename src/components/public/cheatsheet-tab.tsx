"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  BookMarked,
  Variable,
  ScanLine,
  Terminal,
  ArrowLeftRight,
  Calculator,
  GitBranch,
  Repeat,
  LayoutList,
  Type,
  Braces,
  Layers,
  Sigma,
  Puzzle,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import {
  cheatSheetCategories,
  type CheatSheetCategory,
  type CodeExample,
} from "@/content/cheatsheet/java-cheatsheet"

const iconMap: Record<string, LucideIcon> = {
  Variable,
  ScanLine,
  Terminal,
  ArrowLeftRight,
  Calculator,
  GitBranch,
  Repeat,
  LayoutList,
  Type,
  Braces,
  Layers,
  Sigma,
  Puzzle,
}

const text = {
  en: {
    title: "Java Quick Reference",
    subtitle: "All the basic Java operations in one place — organized by topic",
    categories: "categories",
    examples: "snippets",
    copied: "Copied",
    copy: "Copy",
    note: "Note",
    filterAll: "All",
  },
  he: {
    title: "דף עזר Java",
    subtitle: "כל הפעולות הבסיסיות של Java במקום אחד — מאורגן לפי נושא",
    categories: "קטגוריות",
    examples: "קטעי קוד",
    copied: "הועתק",
    copy: "העתק",
    note: "שימו לב",
    filterAll: "הכל",
  },
}

function CopyButton({ codeText, locale }: { codeText: string; locale: "en" | "he" }) {
  const [copied, setCopied] = useState(false)
  const t = text[locale]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs gap-1 shrink-0"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          {t.copied}
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {t.copy}
        </>
      )}
    </Button>
  )
}

function CodeExampleCard({
  example,
  locale,
}: {
  example: CodeExample
  locale: "en" | "he"
}) {
  const t = text[locale]
  const description =
    locale === "he" ? example.descriptionHe : example.descriptionEn
  const note = locale === "he" ? example.noteHe : example.noteEn

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
      {/* Description */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/40 border-b border-border/50"
        dir={locale === "he" ? "rtl" : "ltr"}
      >
        <p className="text-sm text-foreground/90 font-medium">{description}</p>
        <CopyButton codeText={example.code} locale={locale} />
      </div>

      {/* Code */}
      <pre
        className="p-3 overflow-x-auto text-xs font-mono leading-relaxed text-cyan-300"
        dir="ltr"
      >
        <code>{example.code}</code>
      </pre>

      {/* Note */}
      {note && (
        <div
          className="flex items-start gap-2 px-3 py-2 bg-yellow-500/5 border-t border-yellow-500/15"
          dir={locale === "he" ? "rtl" : "ltr"}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-500/90">{note}</p>
        </div>
      )}
    </div>
  )
}

function CategoryAccordion({
  category,
  locale,
}: {
  category: CheatSheetCategory
  locale: "en" | "he"
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = iconMap[category.icon] || BookMarked
  const title = locale === "he" ? category.titleHe : category.titleEn
  const description =
    locale === "he" ? category.descriptionHe : category.descriptionEn

  return (
    <Card
      className={cn(
        "glass-card overflow-hidden transition-all duration-300",
        isExpanded && "border-primary/30"
      )}
    >
      <CardHeader
        className="pb-2 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-3">
          <CardTitle
            className="text-base flex items-center gap-3 flex-1 min-w-0"
            dir={locale === "he" ? "rtl" : "ltr"}
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate">{title}</span>
              <span className="text-xs font-normal text-muted-foreground truncate">
                {description}
              </span>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-[10px] px-1.5">
              {category.examples.length}
            </Badge>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-2 border-t border-border/50 space-y-3">
              {category.examples.map((example, i) => (
                <CodeExampleCard
                  key={i}
                  example={example}
                  locale={locale}
                />
              ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export function CheatSheetTab() {
  const { locale } = useLanguage()
  const t = text[locale]
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const totalExamples = cheatSheetCategories.reduce(
    (sum, cat) => sum + cat.examples.length,
    0
  )

  const filteredCategories = activeFilter
    ? cheatSheetCategories.filter((c) => c.slug === activeFilter)
    : cheatSheetCategories

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
        </div>
        <p className="text-muted-foreground" dir={locale === "he" ? "rtl" : "ltr"}>
          {t.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="text-xs gap-1">
            {cheatSheetCategories.length} {t.categories}
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            {totalExamples} {t.examples}
          </Badge>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={activeFilter === null ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
          onClick={() => setActiveFilter(null)}
        >
          {t.filterAll}
        </Button>
        {cheatSheetCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || BookMarked
          const label = locale === "he" ? cat.titleHe : cat.titleEn
          return (
            <Button
              key={cat.slug}
              variant={activeFilter === cat.slug ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() =>
                setActiveFilter(activeFilter === cat.slug ? null : cat.slug)
              }
            >
              <Icon className="h-3 w-3" />
              {label}
            </Button>
          )
        })}
      </div>

      {/* Category Cards */}
      <div className="space-y-3">
        {filteredCategories.map((category) => (
          <CategoryAccordion
            key={category.slug}
            category={category}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}
