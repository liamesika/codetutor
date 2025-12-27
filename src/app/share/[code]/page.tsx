import { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ShareCardVisual } from "@/components/sharing/share-card"
import { Flame, Trophy, Star, Crown, Zap, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params

  try {
    const shared = await db.sharedAchievement.findUnique({
      where: { shareCode: code },
      include: { user: { select: { name: true } } },
    })

    if (!shared) {
      return { title: "Share Not Found | CodeTutor" }
    }

    const metadata = shared.metadata as Record<string, unknown> || {}

    return {
      title: `${shared.title} | CodeTutor`,
      description: `${shared.user.name} achieved ${metadata.value || ""} - ${shared.description || shared.title}`,
      openGraph: {
        title: shared.title,
        description: `${shared.user.name} achieved ${metadata.value || ""} on CodeTutor!`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: shared.title,
        description: `${shared.user.name} achieved ${metadata.value || ""} on CodeTutor!`,
      },
    }
  } catch {
    return { title: "Share | CodeTutor" }
  }
}

export default async function SharePage({ params }: Props) {
  const { code } = await params

  const shared = await db.sharedAchievement.findUnique({
    where: { shareCode: code },
    include: { user: { select: { name: true, image: true } } },
  })

  if (!shared) {
    notFound()
  }

  // Check expiration
  if (shared.expiresAt && shared.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-[#0F0E26] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Share Expired</h1>
          <p className="text-muted-foreground mb-6">This share link has expired.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
          >
            Go to CodeTutor
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Increment view count
  await db.sharedAchievement.update({
    where: { id: shared.id },
    data: { viewCount: { increment: 1 } },
  })

  const metadata = shared.metadata as Record<string, unknown> || {}

  const typeIcons = {
    ACHIEVEMENT: Trophy,
    RANK: Crown,
    STREAK: Flame,
    LEVEL: Star,
    MILESTONE: Zap,
  }

  const Icon = typeIcons[shared.shareType as keyof typeof typeIcons] || Trophy

  return (
    <div className="min-h-screen bg-[#0F0E26] flex flex-col items-center justify-center p-4">
      {/* Background effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Card */}
        <ShareCardVisual
          data={{
            type: shared.shareType as "ACHIEVEMENT" | "RANK" | "STREAK" | "LEVEL" | "MILESTONE",
            title: shared.title,
            value: String(metadata.value || ""),
            subtitle: shared.description || undefined,
            username: shared.user.name || undefined,
            level: typeof metadata.level === "number" ? metadata.level : undefined,
          }}
        />

        {/* View count */}
        <p className="text-sm text-muted-foreground">
          {shared.viewCount + 1} {shared.viewCount === 0 ? "view" : "views"}
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center">
            Want to track your own coding progress?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
          >
            <Zap className="size-5" />
            Join CodeTutor
          </Link>
        </div>

        {/* Branding */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap className="size-4 text-primary" />
          <span className="text-sm">Powered by CodeTutor</span>
        </div>
      </div>
    </div>
  )
}
