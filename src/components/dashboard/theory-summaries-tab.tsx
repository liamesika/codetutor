"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, FileDown, BookOpen, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getSummaryGroups, type DaySummaryGroup, type TheorySummary, type PdfResource } from "@/content/theory-summaries/marathon-summaries"

function PdfLink({ pdf }: { pdf: PdfResource }) {
  return (
    <a
      href={pdf.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
        "hover:bg-accent/50 border border-border/50",
        pdf.type === "lecture"
          ? "text-blue-400 hover:text-blue-300"
          : "text-emerald-400 hover:text-emerald-300"
      )}
    >
      <FileDown className="h-4 w-4 shrink-0" />
      <span>{pdf.title}</span>
      <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
    </a>
  )
}

function TopicSummaryCard({ summary }: { summary: TheorySummary }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={cn(
      "glass-card overflow-hidden transition-all duration-300",
      isExpanded && "border-primary/30"
    )}>
      <CardHeader
        className="pb-2 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2" dir="rtl">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <span>{summary.title}</span>
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              {summary.estimatedReadingMinutes} דק׳
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
            <CardContent className="pt-2 border-t border-border/50">
              <div className="prose prose-sm dark:prose-invert max-w-none" dir="rtl">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-base font-semibold mt-5 mb-2 flex items-center gap-2 text-foreground" dir="rtl">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mt-3 mb-1.5 text-foreground" dir="rtl">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-2 list-disc pr-4 space-y-1 text-sm" dir="rtl">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-2 list-decimal pr-4 space-y-1 text-sm" dir="rtl">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-muted-foreground">{children}</li>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm text-muted-foreground my-2">{children}</p>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3" dir="rtl">
                        <table className="min-w-full text-sm border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="border-b border-border/50">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-right text-sm border-t border-border/30">{children}</td>
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className
                      if (isInline) {
                        return (
                          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" dir="ltr">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code className={cn("block bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto", className)} dir="ltr" {...props}>
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-muted rounded-lg p-3 overflow-x-auto my-3" dir="ltr">
                        {children}
                      </pre>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                  }}
                >
                  {summary.markdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function DayAccordion({
  group,
  index,
}: {
  group: DaySummaryGroup
  index: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={cn(
        "glass-card overflow-hidden",
        isExpanded && "border-primary/20"
      )}>
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold gradient-neon-text">
                  {group.dayNumber}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg">
                  יום {group.dayNumber}: {group.dayTitle}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {group.topics.length} נושאים &middot;{" "}
                  {group.topics.reduce((sum, t) => sum + t.estimatedReadingMinutes, 0)} דק׳ קריאה &middot;{" "}
                  {group.pdfResources.length} קבצי PDF
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
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
              <CardContent className="pt-0 space-y-4">
                {/* PDF Resources */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground" dir="rtl">
                    חומרי לימוד (PDF)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.pdfResources.map((pdf) => (
                      <PdfLink key={pdf.url} pdf={pdf} />
                    ))}
                  </div>
                </div>

                {/* Topic Summaries */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground" dir="rtl">
                    סיכומי נושאים
                  </h4>
                  {group.topics.map((summary) => (
                    <TopicSummaryCard key={summary.topicSlug} summary={summary} />
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export function TheorySummariesTab() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const groups = getSummaryGroups()

  const filteredGroups = selectedDay
    ? groups.filter((g) => g.dayNumber === selectedDay)
    : groups

  const totalTopics = groups.reduce((sum, g) => sum + g.topics.length, 0)
  const totalMinutes = groups.reduce(
    (sum, g) => sum + g.topics.reduce((s, t) => s + t.estimatedReadingMinutes, 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between" dir="rtl">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-indigo-400" />
          </div>
          סיכום חומר
        </h2>
        <Badge variant="outline" className="bg-accent/50">
          {totalTopics} נושאים &middot; {totalMinutes} דק׳
        </Badge>
      </div>

      {/* Day filter */}
      <div className="flex gap-2 flex-wrap" dir="rtl">
        <Button
          variant={selectedDay === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDay(null)}
        >
          כל הימים
        </Button>
        {groups.map((g) => (
          <Button
            key={g.dayNumber}
            variant={selectedDay === g.dayNumber ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDay(g.dayNumber)}
          >
            יום {g.dayNumber}
          </Button>
        ))}
      </div>

      {/* Day groups */}
      <div className="space-y-4">
        {filteredGroups.map((group, index) => (
          <DayAccordion key={group.dayNumber} group={group} index={index} />
        ))}
      </div>
    </div>
  )
}
