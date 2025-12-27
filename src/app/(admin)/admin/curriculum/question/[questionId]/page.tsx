"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Plus,
  X,
  CheckCircle2,
  XCircle,
  Trash2,
  FileCode,
  FileQuestion,
  Settings,
  Lightbulb,
  FlaskConical,
  Eye,
  Target,
  BookOpen,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
})

interface TestCase {
  input: string
  expectedOutput: string
  isHidden: boolean
  description?: string
}

interface Question {
  id: string
  title: string
  slug: string
  prompt: string
  constraints: string | null
  starterCode: string
  solutionCode: string
  tests: TestCase[]
  hints: string[]
  explanation: string | null
  difficulty: number
  points: number
  xpReward: number
  timeLimit: number
  memoryLimit: number
  estimatedMinutes: number
  isActive: boolean
  isPublished: boolean
  type: "FULL_PROGRAM" | "FUNCTION" | "FIX_BUG" | "PREDICT_OUTPUT"
  topic: {
    id: string
    title: string
    slug: string
    week: {
      id: string
      weekNumber: number
      title: string
      course: { id: string; name: string }
    }
  }
  passRate?: number
  passCount?: number
  _count?: {
    attempts: number
    hintUsages: number
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

export default function QuestionEditorPage({
  params,
}: {
  params: Promise<{ questionId: string }>
}) {
  const { questionId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: question, isLoading, error } = useQuery({
    queryKey: ["adminQuestion", questionId],
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
        prompt: question.prompt,
        constraints: question.constraints,
        starterCode: question.starterCode,
        solutionCode: question.solutionCode,
        explanation: question.explanation,
        difficulty: question.difficulty,
        points: question.points,
        xpReward: question.xpReward,
        timeLimit: question.timeLimit,
        memoryLimit: question.memoryLimit,
        estimatedMinutes: question.estimatedMinutes,
        isActive: question.isActive,
        isPublished: question.isPublished,
        type: question.type,
      })
      setTestCases(question.tests || [])
      setHints(question.hints || [])
    }
  }, [question])

  const mutation = useMutation({
    mutationFn: (data: Partial<Question>) => updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuestion", questionId] })
      queryClient.invalidateQueries({ queryKey: ["curriculum"] })
      setHasChanges(false)
      toast.success("Question saved successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleSave = () => {
    mutation.mutate({
      ...formData,
      tests: testCases,
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/curriculum">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{question.title}</h1>
            <p className="text-sm text-muted-foreground">
              {question.topic.week.course.name} → Week {question.topic.week.weekNumber} → {question.topic.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {question._count && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
              <span>{question._count.attempts} attempts</span>
              <span>{question.passRate || 0}% pass rate</span>
            </div>
          )}
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
        <Card className="border-destructive">
          <CardContent className="p-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">{mutation.error.message}</span>
          </CardContent>
        </Card>
      )}

      {mutation.isSuccess && (
        <Card className="border-green-500">
          <CardContent className="p-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-green-600">Question saved successfully</span>
          </CardContent>
        </Card>
      )}

      {/* Main content with tabs */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content" className="gap-2">
            <FileQuestion className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-2">
            <FileCode className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="tests" className="gap-2">
            <FlaskConical className="h-4 w-4" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="hints" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Hints & Solution
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g., Print Hello World"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="FULL_PROGRAM">Full Program</SelectItem>
                        <SelectItem value="FUNCTION">Function</SelectItem>
                        <SelectItem value="FIX_BUG">Fix Bug</SelectItem>
                        <SelectItem value="PREDICT_OUTPUT">Predict Output</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Difficulty (1-5)</Label>
                    <Select
                      value={String(formData.difficulty)}
                      onValueChange={(v) => updateField("difficulty", parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Easy</SelectItem>
                        <SelectItem value="2">2 - Medium-Easy</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - Medium-Hard</SelectItem>
                        <SelectItem value="5">5 - Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Problem Statement
                </CardTitle>
                <CardDescription>
                  Use structured format with Goal:, Input:, Output:, Example: for best rendering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.prompt || ""}
                  onChange={(e) => updateField("prompt", e.target.value)}
                  rows={10}
                  placeholder={`Goal: Write a program that prints "Hello World"

Input: None

Output: Hello World

Example:
Input: (none)
Output: Hello World

Notes: Use System.out.println() in Java`}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Constraints
              </CardTitle>
              <CardDescription>
                Time/memory limits, input ranges, or other constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.constraints || ""}
                onChange={(e) => updateField("constraints", e.target.value || null)}
                rows={3}
                placeholder="e.g., 1 ≤ n ≤ 1000, Time limit: 1 second"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Starter Code</CardTitle>
                <CardDescription>
                  The code students start with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <MonacoEditor
                    height="350px"
                    language="java"
                    theme="vs-dark"
                    value={formData.starterCode || ""}
                    onChange={(value) => updateField("starterCode", value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-500" />
                  Solution Code
                </CardTitle>
                <CardDescription>
                  The correct solution (shown when revealed)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <MonacoEditor
                    height="350px"
                    language="java"
                    theme="vs-dark"
                    value={formData.solutionCode || ""}
                    onChange={(value) => updateField("solutionCode", value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  Test Cases
                </CardTitle>
                <CardDescription>
                  Define input/output pairs to validate student submissions
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addTestCase}>
                <Plus className="h-4 w-4 mr-1" />
                Add Test
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {testCases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No test cases defined yet</p>
                  <Button variant="outline" className="mt-4" onClick={addTestCase}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Test Case
                  </Button>
                </div>
              ) : (
                testCases.map((tc, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium">Test Case {index + 1}</span>
                        {tc.isHidden && (
                          <Badge variant="secondary">Hidden</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`hidden-${index}`} className="text-sm">
                            Hidden
                          </Label>
                          <Switch
                            id={`hidden-${index}`}
                            checked={tc.isHidden}
                            onCheckedChange={(checked) =>
                              updateTestCase(index, "isHidden", checked)
                            }
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeTestCase(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Input</Label>
                        <Textarea
                          value={tc.input}
                          onChange={(e) =>
                            updateTestCase(index, "input", e.target.value)
                          }
                          rows={3}
                          className="font-mono text-sm"
                          placeholder="e.g., 5\n3"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Expected Output</Label>
                        <Textarea
                          value={tc.expectedOutput}
                          onChange={(e) =>
                            updateTestCase(index, "expectedOutput", e.target.value)
                          }
                          rows={3}
                          className="font-mono text-sm"
                          placeholder="e.g., 8"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hints & Solution Tab */}
        <TabsContent value="hints" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Hints
                </CardTitle>
                <CardDescription>
                  Progressive hints that cost XP to reveal
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addHint}>
                <Plus className="h-4 w-4 mr-1" />
                Add Hint
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {hints.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No hints added yet. Add hints to help struggling students.
                </p>
              ) : (
                hints.map((hint, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 text-xs flex items-center justify-center font-medium shrink-0 mt-2">
                      {index + 1}
                    </span>
                    <Textarea
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      rows={2}
                      className="flex-1"
                      placeholder={`Hint ${index + 1}: e.g., Think about using a loop...`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeHint(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                Explanation
              </CardTitle>
              <CardDescription>
                Detailed explanation shown after passing or revealing solution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.explanation || ""}
                onChange={(e) => updateField("explanation", e.target.value || null)}
                rows={6}
                placeholder="Explain the solution approach, key concepts, common mistakes, and why the solution works..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rewards & Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={formData.points || 100}
                      onChange={(e) => updateField("points", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="xpReward">XP Reward</Label>
                    <Input
                      id="xpReward"
                      type="number"
                      min="1"
                      value={formData.xpReward || 100}
                      onChange={(e) => updateField("xpReward", parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="estimatedMinutes">Estimated Minutes</Label>
                  <Input
                    id="estimatedMinutes"
                    type="number"
                    min="1"
                    value={formData.estimatedMinutes || 10}
                    onChange={(e) => updateField("estimatedMinutes", parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execution Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timeLimit">Time Limit (ms)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1000"
                    value={formData.timeLimit || 5000}
                    onChange={(e) => updateField("timeLimit", parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 1000ms, recommended 5000ms
                  </p>
                </div>
                <div>
                  <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
                  <Input
                    id="memoryLimit"
                    type="number"
                    min="64"
                    value={formData.memoryLimit || 256}
                    onChange={(e) => updateField("memoryLimit", parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 64MB, recommended 256MB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => updateField("isActive", checked)}
                    />
                    <div>
                      <Label htmlFor="isActive">Active</Label>
                      <p className="text-xs text-muted-foreground">
                        Question can be attempted by students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => updateField("isPublished", checked)}
                    />
                    <div>
                      <Label htmlFor="isPublished">Published</Label>
                      <p className="text-xs text-muted-foreground">
                        Question is visible in the curriculum
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
