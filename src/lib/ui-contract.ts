/**
 * UI Contract - Safe icon handling and UI utilities
 * Ensures icons never cause crashes due to undefined values
 */

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Trophy,
  Zap,
  Flame,
  Target,
  Calendar,
  Star,
  Award,
  Clock,
  Code2,
  Terminal,
  Server,
  Database,
  Shield,
  Wifi,
  Activity,
  Lock,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"

/**
 * Default icon mapping by semantic type
 * Used when an item doesn't have an icon or has an invalid one
 */
export const defaultIconMap: Record<string, LucideIcon> = {
  // Status icons
  success: CheckCircle2,
  pass: CheckCircle2,
  error: XCircle,
  fail: XCircle,
  warning: AlertTriangle,
  info: Info,
  unknown: HelpCircle,

  // Gamification icons
  xp: Zap,
  achievement: Trophy,
  streak: Flame,
  target: Target,
  calendar: Calendar,
  star: Star,
  award: Award,
  sparkles: Sparkles,

  // System icons
  clock: Clock,
  code: Code2,
  terminal: Terminal,
  server: Server,
  database: Database,
  shield: Shield,
  wifi: Wifi,
  activity: Activity,
  lock: Lock,
}

/**
 * Icon name mapping - converts string icon names to actual components
 */
export const iconNameMap: Record<string, LucideIcon> = {
  Trophy,
  Star,
  CheckCircle2,
  Flame,
  Target,
  Calendar,
  Zap,
  Award,
  Sparkles,
  Clock,
  Code2,
  Terminal,
  Server,
  Database,
  Shield,
  Wifi,
  Activity,
  Lock,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
}

/**
 * Default fallback icon when nothing else works
 */
export const FallbackIcon: LucideIcon = HelpCircle

/**
 * Get a safe icon component from a string name
 */
export function getIconByName(iconName: string | undefined | null): LucideIcon {
  if (!iconName) return FallbackIcon
  return iconNameMap[iconName] || defaultIconMap[iconName.toLowerCase()] || FallbackIcon
}

/**
 * Interface for items that may have icons
 */
export interface WithIcon {
  icon?: LucideIcon | string | null
  type?: string
  status?: string
}

/**
 * Ensures an item has a valid icon property
 * Works with both icon components and icon name strings
 */
export function withSafeIcon<T extends WithIcon>(item: T): T & { icon: LucideIcon } {
  // Already has a valid icon component
  if (item.icon && typeof item.icon === "function") {
    return item as T & { icon: LucideIcon }
  }

  // Icon is a string name - resolve it
  if (item.icon && typeof item.icon === "string") {
    return {
      ...item,
      icon: getIconByName(item.icon),
    }
  }

  // No icon - derive from type or status
  let resolvedIcon: LucideIcon = FallbackIcon

  if (item.type) {
    resolvedIcon = defaultIconMap[item.type.toLowerCase()] || FallbackIcon
  } else if (item.status) {
    resolvedIcon = defaultIconMap[item.status.toLowerCase()] || FallbackIcon
  }

  return {
    ...item,
    icon: resolvedIcon,
  }
}

/**
 * Ensures all items in an array have valid icons
 */
export function withSafeIcons<T extends WithIcon>(items: T[] | undefined | null): (T & { icon: LucideIcon })[] {
  if (!items || !Array.isArray(items)) return []
  return items.map(withSafeIcon)
}

/**
 * Type guard to check if a value is a valid icon component
 */
export function isValidIcon(icon: unknown): icon is LucideIcon {
  return typeof icon === "function"
}

/**
 * Get icon with proper fallback - use this in render
 */
export function getSafeIcon(
  icon: LucideIcon | string | null | undefined,
  fallbackType?: string
): LucideIcon {
  // Already a valid icon component
  if (icon && typeof icon === "function") {
    return icon
  }

  // Icon is a string name
  if (icon && typeof icon === "string") {
    return getIconByName(icon)
  }

  // Use fallback type
  if (fallbackType) {
    return defaultIconMap[fallbackType.toLowerCase()] || FallbackIcon
  }

  return FallbackIcon
}
