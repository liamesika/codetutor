/**
 * Skill Tree System - Node management and unlocking logic
 */

import { db } from "@/lib/db"
import { awardXP, XP_CONFIG, calculateLevel } from "./progression"
import type { SkillNode } from "@prisma/client"

export interface SkillNodeData {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  color: string
  parentId: string | null
  requiredLevel: number
  requiredXp: number
  xpReward: number
  orderIndex: number
  topicId: string | null
  // Computed fields
  isUnlocked: boolean
  isCompleted: boolean
  progress: number
  canUnlock: boolean
  children: SkillNodeData[]
}

/**
 * Get skill tree for a user
 */
export async function getSkillTree(userId: string): Promise<SkillNodeData[]> {
  // Get all nodes
  const nodes = await db.skillNode.findMany({
    orderBy: [{ orderIndex: "asc" }],
    include: {
      topic: {
        include: {
          questions: { where: { isActive: true }, select: { id: true } },
        },
      },
    },
  })

  // Get user unlocks
  const unlocks = await db.skillUnlock.findMany({
    where: { userId },
  })

  const unlockMap = new Map(unlocks.map((u) => [u.nodeId, u]))

  // Get user progress for level check
  const userProgress = await db.userProgress.findUnique({
    where: { userId },
  })

  const userLevel = userProgress ? calculateLevel(userProgress.xp) : 1
  const userXp = userProgress?.xp ?? 0

  // Get topic progress for completion check
  const topicStats = await db.userTopicStats.findMany({
    where: { userId },
  })

  const topicStatsMap = new Map(topicStats.map((t) => [t.topicId, t]))

  // Calculate node data
  const nodeDataMap = new Map<string, SkillNodeData>()

  for (const node of nodes) {
    const unlock = unlockMap.get(node.id)
    const topicStat = node.topicId ? topicStatsMap.get(node.topicId) : null

    // Calculate progress based on topic questions solved
    let progress = 0
    if (node.topic && node.topic.questions.length > 0) {
      const totalQuestions = node.topic.questions.length
      const solvedCount = topicStat?.passCount ?? 0
      progress = Math.min(100, (solvedCount / totalQuestions) * 100)
    } else if (unlock?.completedAt) {
      progress = 100
    } else if (unlock) {
      progress = unlock.progress * 100
    }

    const isUnlocked = !!unlock
    const isCompleted = progress >= 100

    // Check if can unlock
    const meetsLevelReq = userLevel >= node.requiredLevel
    const meetsXpReq = userXp >= node.requiredXp
    const parentUnlocked = !node.parentId || unlockMap.has(node.parentId)
    const canUnlock = !isUnlocked && meetsLevelReq && meetsXpReq && parentUnlocked

    nodeDataMap.set(node.id, {
      id: node.id,
      slug: node.slug,
      title: node.title,
      description: node.description,
      icon: node.icon,
      color: node.color,
      parentId: node.parentId,
      requiredLevel: node.requiredLevel,
      requiredXp: node.requiredXp,
      xpReward: node.xpReward,
      orderIndex: node.orderIndex,
      topicId: node.topicId,
      isUnlocked,
      isCompleted,
      progress,
      canUnlock,
      children: [],
    })
  }

  // Build tree structure
  const rootNodes: SkillNodeData[] = []

  for (const node of nodeDataMap.values()) {
    if (node.parentId) {
      const parent = nodeDataMap.get(node.parentId)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      rootNodes.push(node)
    }
  }

  return rootNodes
}

/**
 * Unlock a skill node
 */
export async function unlockSkillNode(userId: string, nodeId: string) {
  const node = await db.skillNode.findUnique({
    where: { id: nodeId },
  })

  if (!node) {
    throw new Error("Node not found")
  }

  // Check if already unlocked
  const existing = await db.skillUnlock.findUnique({
    where: { userId_nodeId: { userId, nodeId } },
  })

  if (existing) {
    return { success: true, alreadyUnlocked: true }
  }

  // Check requirements
  const userProgress = await db.userProgress.findUnique({
    where: { userId },
  })

  const userLevel = userProgress ? calculateLevel(userProgress.xp) : 1
  const userXp = userProgress?.xp ?? 0

  if (userLevel < node.requiredLevel) {
    throw new Error(`Requires level ${node.requiredLevel}`)
  }

  if (userXp < node.requiredXp) {
    throw new Error(`Requires ${node.requiredXp} XP`)
  }

  // Check parent is unlocked
  if (node.parentId) {
    const parentUnlock = await db.skillUnlock.findUnique({
      where: { userId_nodeId: { userId, nodeId: node.parentId } },
    })

    if (!parentUnlock) {
      throw new Error("Parent node not unlocked")
    }
  }

  // Create unlock
  await db.skillUnlock.create({
    data: {
      userId,
      nodeId,
    },
  })

  return { success: true, alreadyUnlocked: false }
}

/**
 * Complete a skill node (auto-called when topic is mastered)
 */
export async function completeSkillNode(userId: string, nodeId: string) {
  const node = await db.skillNode.findUnique({
    where: { id: nodeId },
  })

  if (!node) return null

  // Ensure unlocked first
  const unlock = await db.skillUnlock.upsert({
    where: { userId_nodeId: { userId, nodeId } },
    update: {
      completedAt: new Date(),
      progress: 1,
    },
    create: {
      userId,
      nodeId,
      completedAt: new Date(),
      progress: 1,
    },
  })

  // Award XP for completion
  await awardXP(userId, node.xpReward, "Skill node completed", {
    nodeId,
    nodeTitle: node.title,
  })

  return unlock
}

/**
 * Update node progress based on topic
 */
export async function updateNodeProgress(userId: string, topicId: string) {
  // Find node linked to this topic
  const node = await db.skillNode.findFirst({
    where: { topicId },
    include: {
      topic: {
        include: {
          questions: { where: { isActive: true }, select: { id: true } },
        },
      },
    },
  })

  if (!node || !node.topic) return null

  // Calculate progress
  const totalQuestions = node.topic.questions.length
  if (totalQuestions === 0) return null

  const passedAttempts = await db.attempt.findMany({
    where: {
      userId,
      questionId: { in: node.topic.questions.map((q) => q.id) },
      status: "PASS",
    },
    distinct: ["questionId"],
  })

  const progress = passedAttempts.length / totalQuestions

  // Update or create unlock
  const unlock = await db.skillUnlock.upsert({
    where: { userId_nodeId: { userId, nodeId: node.id } },
    update: {
      progress,
      completedAt: progress >= 1 ? new Date() : null,
    },
    create: {
      userId,
      nodeId: node.id,
      progress,
      completedAt: progress >= 1 ? new Date() : null,
    },
  })

  // If just completed, award XP
  if (progress >= 1 && !unlock.completedAt) {
    await awardXP(userId, node.xpReward, "Skill node completed", {
      nodeId: node.id,
      nodeTitle: node.title,
    })
  }

  return { node, progress, isCompleted: progress >= 1 }
}

/**
 * Seed default skill nodes from topics
 */
export async function seedSkillNodesFromTopics(): Promise<{ success: boolean }> {
  const weeks = await db.week.findMany({
    orderBy: { weekNumber: "asc" },
    include: {
      topics: {
        orderBy: { orderIndex: "asc" },
      },
    },
  })

  const nodeColors: string[] = [
    "#4F46E5", // Indigo
    "#22D3EE", // Cyan
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
  ]

  const nodeIcons: string[] = [
    "Code",
    "FileCode",
    "Brackets",
    "Terminal",
    "Cpu",
    "Database",
    "GitBranch",
    "Boxes",
  ]

  let lastNodeId: string | null = null

  for (const week of weeks) {
    for (let ti = 0; ti < week.topics.length; ti++) {
      const topic = week.topics[ti]

      const existingNode = await db.skillNode.findFirst({
        where: { topicId: topic.id },
      })

      if (existingNode) {
        lastNodeId = existingNode.id
        continue
      }

      const newNode: SkillNode = await db.skillNode.create({
        data: {
          slug: `week-${week.weekNumber}-${topic.slug}`,
          title: topic.title,
          description: topic.description || `Master ${topic.title}`,
          icon: nodeIcons[ti % nodeIcons.length] as string,
          color: nodeColors[(week.weekNumber - 1) % nodeColors.length] as string,
          parentId: lastNodeId,
          requiredLevel: week.weekNumber,
          requiredXp: (week.weekNumber - 1) * 100,
          xpReward: 100,
          orderIndex: ti,
          topicId: topic.id,
        },
      })
      lastNodeId = newNode.id
    }
  }

  return { success: true }
}
