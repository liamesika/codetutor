import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

export const runtime = "nodejs"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

let openai: OpenAI | null = null
function getClient(): OpenAI | null {
  if (!OPENAI_API_KEY) return null
  if (!openai) {
    openai = new OpenAI({ apiKey: OPENAI_API_KEY, timeout: 10000 })
  }
  return openai
}

// Simple in-memory cache to avoid re-translating the same text
const cache = new Map<string, string>()

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, targetLang } = await req.json()
    if (!text || typeof text !== "string" || text.length > 2000) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    if (targetLang !== "he") {
      return NextResponse.json({ error: "Only Hebrew translation supported" }, { status: 400 })
    }

    const cacheKey = `${targetLang}:${text}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json({ translated: cached })
    }

    const client = getClient()
    if (!client) {
      return NextResponse.json({ error: "Translation unavailable" }, { status: 503 })
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a translator. Translate the following programming constraint text to Hebrew. Keep code keywords (like variable names, class names) in English. Return ONLY the translated text, nothing else.",
        },
        { role: "user", content: text },
      ],
      temperature: 0.1,
      max_tokens: 500,
    })

    const translated = completion.choices[0]?.message?.content?.trim() || text
    cache.set(cacheKey, translated)

    return NextResponse.json({ translated })
  } catch (error) {
    console.error("[Translate API] Error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
