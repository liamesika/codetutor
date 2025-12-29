"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Trophy,
  Flame,
  Zap,
} from "lucide-react"
import { Sidebar } from "./sidebar"
import { useXp } from "@/components/providers/xp-provider"

interface HeaderProps {
  weeks?: {
    id: string
    weekNumber: number
    title: string
    isLocked: boolean
    topics: {
      id: string
      title: string
      slug: string
      isLocked: boolean
      progress?: number
      isCompleted?: boolean
    }[]
    progress?: number
  }[]
  currentCourse?: string
  userStats?: {
    streak: number
    totalPoints: number
  }
}

export function Header({ weeks = [], currentCourse, userStats }: HeaderProps) {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()

  // Use centralized XP provider for real-time XP updates
  const { xp, streak, isLoading: xpLoading } = useXp()

  // Prefer XP provider values if available, fall back to userStats prop
  const displayXp = xp ?? userStats?.totalPoints ?? 0
  const displayStreak = streak ?? userStats?.streak ?? 0

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar weeks={weeks} currentCourse={currentCourse} />
          </SheetContent>
        </Sheet>

        {/* Logo (mobile only) */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="CodeTutor"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex-1" />

        {/* Stats (desktop) */}
        {(userStats || xp !== undefined) && (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{displayStreak}</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{displayXp.toLocaleString()}</span>
              <span className="text-muted-foreground">XP</span>
            </div>
          </div>
        )}

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User menu */}
        {status === "loading" ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.image || undefined}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Mobile stats */}
              {(userStats || xp !== undefined) && (
                <>
                  <div className="md:hidden px-2 py-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{displayStreak} day streak</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span>{displayXp.toLocaleString()} XP</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="md:hidden" />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/achievements" className="cursor-pointer">
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
