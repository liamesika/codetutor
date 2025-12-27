"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Key,
  Plus,
  Copy,
  Check,
  Loader2,
  Trash2,
  Users,
  Clock,
  Ban,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "sonner"

interface AccessCode {
  id: string
  codeHash: string
  plan: "BASIC" | "PRO" | "ELITE"
  maxRedemptions: number
  redeemedCount: number
  expiresAt: string | null
  isActive: boolean
  note: string | null
  createdAt: string
  createdBy: {
    name: string | null
    email: string
  } | null
  _count: {
    redemptions: number
  }
}

const PLAN_COLORS = {
  BASIC: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  PRO: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  ELITE: "bg-pink-500/10 text-pink-500 border-pink-500/20",
}

export default function AdminAccessCodesPage() {
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const [createdCode, setCreatedCode] = useState("")
  const [copied, setCopied] = useState(false)

  // Form state
  const [formPlan, setFormPlan] = useState<"BASIC" | "PRO" | "ELITE">("BASIC")
  const [formMaxRedemptions, setFormMaxRedemptions] = useState("1")
  const [formExpiresIn, setFormExpiresIn] = useState<string>("")
  const [formNote, setFormNote] = useState("")

  const { data, isLoading } = useQuery<{
    codes: AccessCode[]
    total: number
  }>({
    queryKey: ["adminAccessCodes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/access-codes")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async (params: {
      plan: string
      maxRedemptions: number
      expiresAt: string | null
      note: string
    }) => {
      const res = await fetch("/api/admin/access-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error("Failed to create code")
      return res.json()
    },
    onSuccess: (data) => {
      setCreatedCode(data.code)
      setShowCreateDialog(false)
      setShowCodeDialog(true)
      queryClient.invalidateQueries({ queryKey: ["adminAccessCodes"] })
      // Reset form
      setFormPlan("BASIC")
      setFormMaxRedemptions("1")
      setFormExpiresIn("")
      setFormNote("")
    },
    onError: () => {
      toast.error("Failed to create access code")
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: async (codeId: string) => {
      const res = await fetch("/api/admin/access-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeId }),
      })
      if (!res.ok) throw new Error("Failed to deactivate code")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Access code deactivated")
      queryClient.invalidateQueries({ queryKey: ["adminAccessCodes"] })
    },
    onError: () => {
      toast.error("Failed to deactivate code")
    },
  })

  const handleCreate = () => {
    let expiresAt: string | null = null
    if (formExpiresIn) {
      const days = parseInt(formExpiresIn)
      if (!isNaN(days) && days > 0) {
        const date = new Date()
        date.setDate(date.getDate() + days)
        expiresAt = date.toISOString()
      }
    }

    createMutation.mutate({
      plan: formPlan,
      maxRedemptions: parseInt(formMaxRedemptions) || 1,
      expiresAt,
      note: formNote,
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(createdCode)
    setCopied(true)
    toast.success("Code copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const activeCodes = data?.codes.filter((c) => c.isActive) || []
  const usedCodes = data?.codes.filter(
    (c) => c.redeemedCount >= c.maxRedemptions
  ) || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Access Codes</h1>
          <p className="text-muted-foreground">
            Create and manage redeemable access codes
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="size-4 mr-2" />
          Create Code
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
            <Key className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCodes.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for redemption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.codes.reduce((acc, c) => acc + c.redeemedCount, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Codes redeemed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fully Used</CardTitle>
            <Check className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedCodes.length}</div>
            <p className="text-xs text-muted-foreground">
              Max redemptions reached
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Codes list */}
      <Card>
        <CardHeader>
          <CardTitle>All Access Codes</CardTitle>
          <CardDescription>
            Click to copy code hash (first 8 chars shown)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : !data?.codes.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Key className="size-12 mx-auto mb-4 opacity-50" />
              <p>No access codes created yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.codes.map((code) => {
                const isExpired =
                  code.expiresAt && new Date(code.expiresAt) < new Date()
                const isFull = code.redeemedCount >= code.maxRedemptions

                return (
                  <div
                    key={code.id}
                    className={`p-4 rounded-lg border ${
                      !code.isActive || isExpired || isFull
                        ? "bg-muted/30 opacity-60"
                        : "bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Key className="size-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono">
                              {code.codeHash.substring(0, 8)}...
                            </code>
                            <Badge
                              variant="outline"
                              className={PLAN_COLORS[code.plan]}
                            >
                              {code.plan}
                            </Badge>
                            {!code.isActive && (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                Deactivated
                              </Badge>
                            )}
                            {isExpired && (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                Expired
                              </Badge>
                            )}
                            {isFull && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Fully Used
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>
                              {code.redeemedCount}/{code.maxRedemptions} redeemed
                            </span>
                            {code.expiresAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                Expires{" "}
                                {format(new Date(code.expiresAt), "MMM d, yyyy")}
                              </span>
                            )}
                            {code.note && (
                              <span className="italic">{code.note}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(code.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {code.isActive && !isFull && !isExpired && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => deactivateMutation.mutate(code.id)}
                          >
                            <Ban className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Access Code</DialogTitle>
            <DialogDescription>
              Generate a new redeemable access code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select
                value={formPlan}
                onValueChange={(v) => setFormPlan(v as typeof formPlan)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                  <SelectItem value="ELITE">Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRedemptions">Max Redemptions</Label>
              <Input
                id="maxRedemptions"
                type="number"
                min="1"
                value={formMaxRedemptions}
                onChange={(e) => setFormMaxRedemptions(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresIn">Expires In (days, optional)</Label>
              <Input
                id="expiresIn"
                type="number"
                min="1"
                placeholder="Never expires"
                value={formExpiresIn}
                onChange={(e) => setFormExpiresIn(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Internal note about this code..."
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              Generate Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code result dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Code Created</DialogTitle>
            <DialogDescription>
              This code will only be shown once. Copy it now!
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="p-4 rounded-lg bg-muted font-mono text-lg text-center tracking-wider">
              {createdCode}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCopy} className="w-full">
              {copied ? (
                <>
                  <Check className="size-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
