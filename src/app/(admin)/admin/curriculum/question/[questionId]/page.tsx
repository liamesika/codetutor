"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  Play,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
})

interface TestCase {
  input: string
  expectedOutput: string
  isHidden: boolean
}

interface Question {
  id: string
  title: string
  description: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  type: "CODE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER"
  starterCode: string | null
  solution: string | null
  testCases: TestCase[]
  hints: string[]
  explanation: string | null
  xpReward: number
  timeLimit: number
  memoryLimit: number
  isPublished: boolean
  lesson: {
    id: string
    title: string
    topic: {
      id: string
      title: string
      week: {
        id: string
        weekNumber: number
        title: string
      }
    }
  }
}

async function fetchQuestion(id: string): Promise<Question> {
  const res = await fetch(`/api/admin/curriculum/question/${id}`)
  if (!res.ok) throw new Error("Failed to fetch question")
  return res.json()
}

async function updateQuestion(id: string, data: Partial<Question>) {
  const res = await fetch(`/api/admin/curriculum/question/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to update question")
  }
  return res.json()
}

function QuestionEditorSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-[500px]" />
        <Skeleton className="h-[500px]" />
      </div>
    </div>
  )
}

export default function QuestionEditorPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const questionId = params.questionId as string

  const { data: question, isLoading, error } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => fetchQuestion(questionId),
  })

  const [formData, setFormData] = useState<Partial<Question>>({})
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [hints, setHints] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
        type: question.type,
        starterCode: question.starterCode,
        solution: question.solution,
        explanation: question.explanation,
        xpReward: question.xpReward,
        timeLimit: question.timeLimit,
        memoryLimit: question.memoryLimit,
        isPublished: question.isPublished,
      })
      setTestCases(question.testCases || [])
      setHints(question.hints || [])
    }
  }, [question])

  const mutation = useMutation({
    mutationFn: (data: Partial<Question>) => updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] })
      queryClient.invalidateQueries({ queryKey: ["curriculum"] })
      setHasChanges(false)
    },
  })

  const handleSave = () => {
    mutation.mutate({
      ...formData,
      testCases,
      hints,
    })
  }

  const updateField = <K extends keyof Question>(field: K, value: Question[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const addTestCase = () => {
    setTestCases((prev) => [...prev, { input: "", expectedOutput: "", isHidden: false }])
    setHasChanges(true)
  }

  const removeTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    )
    setHasChanges(true)
  }

  const addHint = () => {
    setHints((prev) => [...prev, ""])
    setHasChanges(true)
  }

  const removeHint = (index: number) => {
    setHints((prev) => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  const updateHint = (index: number, value: string) => {
    setHints((prev) => prev.map((h, i) => (i === index ? value : h)))
    setHasChanges(true)
  }

  if (isLoading) return <QuestionEditorSkeleton />

  if (error || !question) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">Failed to load question</p>
            <Link href="/admin/curriculum">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Curriculum
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/curriculum">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{question.title}</h1>
            <p className="text-sm text-muted-foreground">
              Week {question.lesson.topic.week.weekNumber} →{" "}
              {question.lesson.topic.title} → {question.lesson.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              Unsaved changes
            </Badge>
          )}
          <Button
            onClick={handleSave}
            disabled={mutation.isPending || !hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {mutation.isError && (
        <Card className="border-destructive mb-6">
          <CardContent className="p-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">{mutation.error.message}</span>
          </CardContent>
        </Card>
      )}

      {mutation.isSuccess && (
        <Card className="border-green-500 mb-6">
          <CardContent className="p-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-green-600">Question saved successfully</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(v) => updateField("difficulty", v as Question["difficulty"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => updateField("type", v as Question["type"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CODE">Code</SelectItem>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input
                    id="xpReward"
                    type="number"
                    value={formData.xpReward || 10}
                    onChange={(e) => updateField("xpReward", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="timeLimit">Time Limit (s)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit || 5}
                    onChange={(e) => updateField("timeLimit", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="memoryLimit">Memory (MB)</Label>
                  <Input
                    id="memoryLimit"
                    type="number"
                    value={formData.memoryLimit || 128}
                    onChange={(e) => updateField("memoryLimit", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => updateField("isPublished", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hints</CardTitle>
              <Button variant="outline" size="sm" onClick={addHint}>
                <Plus className="h-4 w-4 mr-1" />
                Add Hint
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {hints.map((hint, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground mt-2">
                    {index + 1}.
                  </span>
                  <Textarea
                    value={hint}
                    onChange={(e) => updateHint(index, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHint(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {hints.length === 0 && (
                <p className="text-sm text-muted-foreground">No hints added</p>
              )}
            </CardContent>
          </Card>

          {/* Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.explanation || ""}
                onChange={(e) => updateField("explanation", e.target.value)}
                rows={4}
                placeholder="Explanation shown after the student submits..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Code & Tests */}
        <div className="space-y-6">
          {/* Starter Code */}
          <Card>
            <CardHeader>
              <CardTitle>Starter Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <MonacoEditor
                  height="200px"
                  language="java"
                  theme="vs-dark"
                  value={formData.starterCode || ""}
                  onChange={(value) => updateField("starterCode", value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <MonacoEditor
                  height="200px"
                  language="java"
                  theme="vs-dark"
                  value={formData.solution || ""}
                  onChange={(value) => updateField("solution", value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Test Cases</CardTitle>
              <Button variant="outline" size="sm" onClick={addTestCase}>
                <Plus className="h-4 w-4 mr-1" />
                Add Test
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {testCases.map((tc, index) => (
                <div key={index} className="border rounded-md p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Test {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`hidden-${index}`} className="text-xs">
                        Hidden
                      </Label>
                      <Switch
                        id={`hidden-${index}`}
                        checked={tc.isHidden}
                        onCheckedChange={(checked) =>
                          updateTestCase(index, "isHidden", checked)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTestCase(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Input</Label>
                      <Textarea
                        value={tc.input}
                        onChange={(e) =>
                          updateTestCase(index, "input", e.target.value)
                        }
                        rows={2}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Expected Output</Label>
                      <Textarea
                        value={tc.expectedOutput}
                        onChange={(e) =>
                          updateTestCase(index, "expectedOutput", e.target.value)
                        }
                        rows={2}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {testCases.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No test cases defined
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
