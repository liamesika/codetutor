"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, Code2, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface TopicIntroProps {
  topicId: string
  title: string
  introMarkdown?: string | null
  className?: string
  defaultExpanded?: boolean
}

export function TopicIntro({
  topicId,
  title,
  introMarkdown,
  className,
  defaultExpanded = true,
}: TopicIntroProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const storageKey = `topic-intro-expanded-${topicId}`

  // Load preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      setIsExpanded(saved === "true")
    }
  }, [storageKey])

  // Save preference
  const toggleExpanded = () => {
    const newValue = !isExpanded
    setIsExpanded(newValue)
    localStorage.setItem(storageKey, String(newValue))
  }

  if (!introMarkdown) {
    return null
  }

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>הקדמה: {title}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="h-8 px-2"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="ml-1 text-xs">{isExpanded ? "סגור" : "פתח"}</span>
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-2">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mt-4 mb-2 flex items-center gap-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mt-3 mb-1.5 flex items-center gap-2">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="my-2 list-disc pl-4 space-y-1 text-sm">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-2 list-decimal pl-4 space-y-1 text-sm">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-muted-foreground">{children}</li>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-muted-foreground my-2">{children}</p>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className={cn("block bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto", className)} {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto my-3">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
              }}
            >
              {introMarkdown}
            </ReactMarkdown>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
