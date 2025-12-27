"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  Lock,
  Check,
  ChevronRight,
  Sparkles,
  Code,
  FileCode,
  Brackets,
  Terminal,
  Cpu,
  Database,
  GitBranch,
  Boxes,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { NeonButton } from "@/components/ui/neon-button"
import type { SkillNodeData } from "@/lib/skill-tree"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileCode,
  Brackets,
  Terminal,
  Cpu,
  Database,
  GitBranch,
  Boxes,
  Zap,
}

interface SkillNodeProps {
  node: SkillNodeData
  isActive: boolean
  onSelect: (node: SkillNodeData) => void
  onUnlock: (nodeId: string) => void
  depth: number
}

function SkillNode({ node, isActive, onSelect, onUnlock, depth }: SkillNodeProps) {
  const Icon = iconMap[node.icon] || Code
  const isLocked = !node.isUnlocked && !node.canUnlock
  const canUnlock = node.canUnlock
  const isCompleted = node.isCompleted

  return (
    <div className="flex flex-col items-center">
      {/* Connection line from parent */}
      {depth > 0 && (
        <div
          className={cn(
            "w-0.5 h-8 -mt-1 mb-2",
            node.isUnlocked
              ? "bg-gradient-to-b from-[#4F46E5] to-[#22D3EE]"
              : "bg-[#4F46E5]/20"
          )}
        />
      )}

      {/* Node */}
      <motion.button
        onClick={() => isLocked ? null : onSelect(node)}
        disabled={isLocked && !canUnlock}
        className={cn(
          "relative group",
          isLocked && "cursor-not-allowed"
        )}
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
      >
        {/* Glow effect */}
        {(isActive || isCompleted) && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-2xl blur-xl opacity-60",
              isCompleted
                ? "bg-gradient-to-r from-[#10B981] to-[#22D3EE]"
                : "bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]"
            )}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Main node card */}
        <div
          className={cn(
            "relative w-24 h-24 md:w-28 md:h-28 rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-300",
            isCompleted
              ? "bg-gradient-to-br from-[#10B981]/20 to-[#22D3EE]/20 border-2 border-[#10B981]"
              : node.isUnlocked
              ? "bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 border-2 border-[#4F46E5]"
              : canUnlock
              ? "bg-[#1E1B4B]/50 border-2 border-dashed border-[#4F46E5]/50"
              : "bg-[#1E1B4B]/30 border border-[#4F46E5]/20 blur-[2px]",
            isActive && !isCompleted && "ring-2 ring-[#22D3EE] ring-offset-2 ring-offset-[#0F0E26]"
          )}
          style={{ backgroundColor: isLocked ? undefined : `${node.color}10` }}
        >
          {/* Lock overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#0F0E26]/80">
              <Lock className="size-8 text-[#4F46E5]/50" />
            </div>
          )}

          {/* Can unlock indicator */}
          {canUnlock && (
            <motion.div
              className="absolute -top-2 -right-2 size-6 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="size-3.5 text-white" />
            </motion.div>
          )}

          {/* Completed check */}
          {isCompleted && (
            <div className="absolute -top-2 -right-2 size-6 rounded-full bg-gradient-to-r from-[#10B981] to-[#22D3EE] flex items-center justify-center">
              <Check className="size-3.5 text-white" />
            </div>
          )}

          {/* Icon */}
          <Icon
            className={cn(
              "size-8 md:size-10 mb-1",
              isCompleted
                ? "text-[#10B981]"
                : node.isUnlocked
                ? "text-[#22D3EE]"
                : "text-[#4F46E5]/50"
            )}
          />

          {/* Progress bar */}
          {node.isUnlocked && !isCompleted && (
            <div className="w-full h-1.5 bg-[#1E1B4B] rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]"
                initial={{ width: 0 }}
                animate={{ width: `${node.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <p
          className={cn(
            "mt-2 text-xs md:text-sm font-medium text-center max-w-24 md:max-w-28 truncate",
            isCompleted
              ? "text-[#10B981]"
              : node.isUnlocked
              ? "text-[#E5E7EB]"
              : "text-[#6B7280]"
          )}
        >
          {node.title}
        </p>
      </motion.button>

      {/* Children nodes */}
      {node.children.length > 0 && (
        <div className="flex flex-wrap gap-6 mt-4 justify-center">
          {node.children.map((child) => (
            <SkillNode
              key={child.id}
              node={child}
              isActive={false}
              onSelect={onSelect}
              onUnlock={onUnlock}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface NodeDetailSheetProps {
  node: SkillNodeData | null
  onClose: () => void
  onUnlock: (nodeId: string) => void
  onPractice: (topicId: string) => void
}

function NodeDetailSheet({ node, onClose, onUnlock, onPractice }: NodeDetailSheetProps) {
  if (!node) return null

  const Icon = iconMap[node.icon] || Code

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg mx-4 mb-4 md:mb-0"
        >
          <div className="rounded-2xl bg-[#1E1B4B]/90 backdrop-blur-xl border border-[#4F46E5]/30 p-6 shadow-[0_0_60px_rgba(79,70,229,0.3)]">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${node.color}20`, color: node.color }}
              >
                <Icon className="size-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{node.title}</h3>
                <p className="text-[#9CA3AF] text-sm">{node.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-[#0F0E26]/50">
                <p className="text-[#6B7280] text-xs mb-1">Level Req</p>
                <p className="text-white font-bold">{node.requiredLevel}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[#0F0E26]/50">
                <p className="text-[#6B7280] text-xs mb-1">XP Reward</p>
                <p className="text-[#22D3EE] font-bold">+{node.xpReward}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[#0F0E26]/50">
                <p className="text-[#6B7280] text-xs mb-1">Progress</p>
                <p className="text-[#10B981] font-bold">{Math.round(node.progress)}%</p>
              </div>
            </div>

            {/* Progress bar */}
            {node.isUnlocked && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                  <span>Progress</span>
                  <span>{Math.round(node.progress)}%</span>
                </div>
                <div className="h-2 bg-[#0F0E26] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]"
                    initial={{ width: 0 }}
                    animate={{ width: `${node.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {node.canUnlock ? (
                <NeonButton
                  onClick={() => onUnlock(node.id)}
                  className="flex-1"
                  leftIcon={<Sparkles className="size-4" />}
                >
                  Unlock Skill
                </NeonButton>
              ) : node.isUnlocked && node.topicId ? (
                <NeonButton
                  onClick={() => onPractice(node.topicId!)}
                  className="flex-1"
                  leftIcon={<ChevronRight className="size-4" />}
                >
                  {node.isCompleted ? "Review Topic" : "Continue Practice"}
                </NeonButton>
              ) : (
                <NeonButton variant="secondary" onClick={onClose} className="flex-1">
                  Close
                </NeonButton>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function SkillTreeMap() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedNode, setSelectedNode] = useState<SkillNodeData | null>(null)

  const { data: tree, isLoading } = useQuery<SkillNodeData[]>({
    queryKey: ["skill-tree"],
    queryFn: async () => {
      const res = await fetch("/api/skill-tree")
      if (!res.ok) throw new Error("Failed to load skill tree")
      return res.json()
    },
  })

  const unlockMutation = useMutation({
    mutationFn: async (nodeId: string) => {
      const res = await fetch("/api/skill-tree/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId }),
      })
      if (!res.ok) throw new Error("Failed to unlock node")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill-tree"] })
      setSelectedNode(null)
    },
  })

  const handleUnlock = (nodeId: string) => {
    unlockMutation.mutate(nodeId)
  }

  const handlePractice = (topicId: string) => {
    router.push(`/learn/${topicId}`)
    setSelectedNode(null)
  }

  // Find next unlockable node for mobile CTA
  const findNextNode = (nodes: SkillNodeData[]): SkillNodeData | null => {
    for (const node of nodes) {
      if (node.canUnlock) return node
      if (node.isUnlocked && !node.isCompleted) return node
      const childNode = findNextNode(node.children)
      if (childNode) return childNode
    }
    return null
  }

  const nextNode = tree ? findNextNode(tree) : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="size-12 rounded-full border-4 border-[#4F46E5] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (!tree || tree.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">No skill nodes available yet.</p>
        <NeonButton
          variant="secondary"
          className="mt-4"
          onClick={() => {
            fetch("/api/skill-tree", { method: "POST" })
              .then(() => queryClient.invalidateQueries({ queryKey: ["skill-tree"] }))
          }}
        >
          Initialize Skill Tree
        </NeonButton>
      </div>
    )
  }

  return (
    <div className="relative pb-24 md:pb-8">
      {/* Tree container */}
      <div className="overflow-x-auto py-8 px-4">
        <div className="flex flex-col items-center min-w-max">
          {tree.map((rootNode) => (
            <SkillNode
              key={rootNode.id}
              node={rootNode}
              isActive={selectedNode?.id === rootNode.id}
              onSelect={setSelectedNode}
              onUnlock={handleUnlock}
              depth={0}
            />
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {nextNode && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-2xl bg-[#1E1B4B]/95 backdrop-blur-xl border border-[#4F46E5]/30 p-4 shadow-[0_0_40px_rgba(79,70,229,0.4)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-[#4F46E5]/20">
                <Zap className="size-5 text-[#22D3EE]" />
              </div>
              <div className="flex-1">
                <p className="text-[#6B7280] text-xs">Up next</p>
                <p className="text-white font-medium truncate">{nextNode.title}</p>
              </div>
            </div>
            <NeonButton
              className="w-full"
              onClick={() => setSelectedNode(nextNode)}
              rightIcon={<ChevronRight className="size-4" />}
            >
              Continue Path
            </NeonButton>
          </motion.div>
        </div>
      )}

      {/* Node detail sheet */}
      {selectedNode && (
        <NodeDetailSheet
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUnlock={handleUnlock}
          onPractice={handlePractice}
        />
      )}
    </div>
  )
}
