"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  FileQuestion,
  BookOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  GraduationCap,
  Users,
  ClipboardList,
  Brain,
  Menu,
  X,
  Lightbulb,
} from "lucide-react"

const navSections = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Students",
        href: "/admin/students",
        icon: Users,
      },
      {
        title: "Assignments",
        href: "/admin/assignments",
        icon: ClipboardList,
      },
      {
        title: "Curriculum",
        href: "/admin/curriculum",
        icon: BookOpen,
      },
      {
        title: "Questions",
        href: "/admin/questions",
        icon: FileQuestion,
      },
      {
        title: "Topics & Lessons",
        href: "/admin/topics",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Gradebook",
        href: "/admin/gradebook",
        icon: GraduationCap,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Mistake Insights",
        href: "/admin/mistake-insights",
        icon: Lightbulb,
      },
      {
        title: "Adaptive Algorithm",
        href: "/admin/adaptive",
        icon: Brain,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center animate-pulse">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== "ADMIN") {
    router.push("/dashboard")
    return null
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full",
      mobile ? "pt-4" : ""
    )}>
      {/* Header */}
      <div className={cn(
        "px-4 pb-4 border-b",
        mobile ? "" : "pt-4"
      )}>
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Academic</h1>
            <p className="text-xs text-muted-foreground leading-tight">Control Center</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))

                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start transition-all",
                          isActive && "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium"
                        )}
                      >
                        <item.icon className={cn(
                          "mr-2 h-4 w-4",
                          isActive && "text-purple-600 dark:text-purple-400"
                        )} />
                        {item.title}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/30">
        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
          <Button variant="outline" className="w-full justify-start gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <ChevronLeft className="h-4 w-4" />
            Back to App
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-card/80 backdrop-blur-sm flex-col shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Academic Control</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-sm pt-16">
          <Sidebar mobile />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        {children}
      </main>
    </div>
  )
}
