"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Plus,
  BookOpen,
  FileQuestion,
  Edit,
  Trash2,
  Lock,
  Unlock,
  ChevronRight,
  Loader2,
  GripVertical,
} from "lucide-react"

interface Topic {
  id: string
  title: string
  slug: string
  description: string | null
  introMarkdown: string | null
  isLocked: boolean
  orderIndex: number
  week: {
    weekNumber: number
  }
  _count?: {
    questions: number
    lessons: number
  }
}

interface Week {
  id: string
  weekNumber: number
  title: string
  description: string | null
  isLocked: boolean
  topics: Topic[]
}

export default function AdminTopicsPage() {
  const queryClient = useQueryClient()
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)

  const { data: weeks, isLoading } = useQuery<Week[]>({
    queryKey: ["adminWeeks"],
    queryFn: async () => {
      const res = await fetch("/api/admin/weeks")
      if (!res.ok) throw new Error("Failed to fetch weeks")
      return res.json()
    },
  })

  const toggleLockMutation = useMutation({
    mutationFn: async ({ id, isLocked, type }: { id: string; isLocked: boolean; type: "topic" | "week" }) => {
      const res = await fetch(`/api/admin/${type}s/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLocked }),
      })
      if (!res.ok) throw new Error("Failed to update")
    },
    onSuccess: () => {
      toast.success("Updated successfully")
      queryClient.invalidateQueries({ queryKey: ["adminWeeks"] })
    },
    onError: () => {
      toast.error("Failed to update")
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Topics & Lessons
          </h1>
          <p className="text-muted-foreground">
            Manage course structure, topics, and lesson content
          </p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <Accordion type="multiple" className="space-y-4">
          {weeks?.map((week) => (
            <AccordionItem
              key={week.id}
              value={week.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4 flex-1">
                  <Badge variant="outline" className="shrink-0">
                    Week {week.weekNumber}
                  </Badge>
                  <span className="font-semibold">{week.title}</span>
                  {week.isLocked && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="ml-auto flex items-center gap-2 mr-4">
                    <Badge variant="secondary">
                      {week.topics.length} topics
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <p className="text-sm text-muted-foreground">
                      {week.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {week.isLocked ? "Locked" : "Unlocked"}
                      </span>
                      <Switch
                        checked={!week.isLocked}
                        onCheckedChange={(checked) =>
                          toggleLockMutation.mutate({
                            id: week.id,
                            isLocked: !checked,
                            type: "week",
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {week.topics.map((topic, index) => (
                      <Card key={topic.id} className="border">
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center gap-4">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{topic.title}</span>
                                {topic.isLocked && (
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {topic.slug}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="gap-1">
                                <FileQuestion className="h-3 w-3" />
                                {topic._count?.questions || 0} questions
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <BookOpen className="h-3 w-3" />
                                {topic._count?.lessons || 0} lessons
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={!topic.isLocked}
                                  onCheckedChange={(checked) =>
                                    toggleLockMutation.mutate({
                                      id: topic.id,
                                      isLocked: !checked,
                                      type: "topic",
                                    })
                                  }
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingTopic(topic)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      {/* Edit Topic Dialog */}
      <Dialog open={!!editingTopic} onOpenChange={() => setEditingTopic(null)}>
        <DialogContent aria-describedby="topic-edit-description">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Topic</DialogTitle>
            <DialogDescription id="topic-edit-description">
              Update topic details
            </DialogDescription>
          </DialogHeader>
          {editingTopic && (
            <TopicEditForm
              topic={editingTopic}
              onSuccess={() => {
                setEditingTopic(null)
                queryClient.invalidateQueries({ queryKey: ["adminWeeks"] })
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TopicEditForm({
  topic,
  onSuccess,
}: {
  topic: Topic
  onSuccess: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: topic.title,
    description: topic.description || "",
    introMarkdown: topic.introMarkdown || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/admin/topics/${topic.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update")

      toast.success("Topic updated")
      onSuccess()
    } catch {
      toast.error("Failed to update topic")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Topic</DialogTitle>
        <DialogDescription>Update topic details</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Introduction Markdown</Label>
          <p className="text-xs text-muted-foreground">
            Markdown content shown at the top of the topic page. Supports headings, lists, code blocks, and tables.
          </p>
          <Textarea
            value={formData.introMarkdown}
            onChange={(e) =>
              setFormData({ ...formData, introMarkdown: e.target.value })
            }
            rows={10}
            placeholder="## What is this topic?&#10;&#10;Add a conceptual introduction here..."
            className="font-mono text-sm"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  )
}
