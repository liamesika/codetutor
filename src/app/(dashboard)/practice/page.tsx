"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle, Home, RefreshCw, Code } from "lucide-react"

/**
 * Practice Index Page
 *
 * This page serves as the entry point for the "Practice" button in mobile nav.
 * It uses the adaptive learning algorithm to find the best next question
 * and automatically redirects the user there.
 */
export default function PracticeIndexPage() {
  const { status } = useSession()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push(routes.login())
      return
    }

    // Fetch next question from adaptive algorithm
    async function fetchNextQuestion() {
      try {
        const res = await fetch("/api/next-question")
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Failed to find next question")
          setIsLoading(false)
          return
        }

        if (data.questionId) {
          // Redirect to the question
          router.replace(routes.practice(data.questionId))
        } else if (data.message) {
          // All questions completed
          setError(data.message)
          setIsLoading(false)
        } else {
          // No questions available
          setError("No practice questions available yet. Check back soon!")
          setIsLoading(false)
        }
      } catch {
        setError("Network error. Please try again.")
        setIsLoading(false)
      }
    }

    fetchNextQuestion()
  }, [status, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="h-dvh bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1E1B4B]/80 border-[#4F46E5]/30 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#4F46E5]/20 flex items-center justify-center">
              <Loader2 className="size-10 text-[#4F46E5] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Finding Your Next Challenge
            </h1>
            <p className="text-[#9CA3AF]">
              Our adaptive algorithm is selecting the best question for your skill level...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state - either no questions or API error
  const isCompleted = error?.includes("completed") || error?.includes("Great job")

  return (
    <div className="h-dvh bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] flex items-center justify-center p-4">
      <Card className={`w-full max-w-md backdrop-blur-xl ${isCompleted ? "bg-[#1E1B4B]/80 border-green-500/30" : "bg-[#1E1B4B]/80 border-amber-500/30"}`}>
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isCompleted ? "bg-green-500/20" : "bg-amber-500/20"}`}>
            {isCompleted ? (
              <Code className="size-10 text-green-400" />
            ) : (
              <AlertTriangle className="size-10 text-amber-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isCompleted ? "All Caught Up!" : "No Questions Available"}
          </h1>
          <p className="text-[#9CA3AF] mb-6">
            {error || "No practice questions available. Please check back later."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                setIsLoading(true)
                setError(null)
                router.refresh()
              }}
              variant="outline"
              className="gap-2 border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push(routes.dashboard())}
              className="gap-2 bg-[#4F46E5] hover:bg-[#4F46E5]/80"
            >
              <Home className="size-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
