import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Rubik } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://codetutor.vercel.app"),
  title: {
    default: "CodeTutor - מערכת למידה למבחן במדמח",
    template: "%s | CodeTutor",
  },
  description:
    "מערכת למידה 10 ימים למבחן במדמח ואתם מוכנים. כל הנושאים מחולק ליום, הרצת קוד ובדיקה שלו, תרגול של יותר מ-90 תרגילים וסימולציות והכל במערכת אחת.",
  keywords: [
    "Java",
    "programming",
    "learning",
    "CS",
    "computer science",
    "coding",
    "education",
    "מדמח",
    "מבחן",
    "תרגול",
  ],
  authors: [{ name: "CodeTutor" }],
  creator: "CodeTutor",
  openGraph: {
    title: "CodeTutor - מערכת למידה למבחן במדמח",
    description:
      "מערכת למידה 10 ימים למבחן במדמח ואתם מוכנים. כל הנושאים מחולק ליום, הרצת קוד ובדיקה שלו, תרגול של יותר מ-90 תרגילים וסימולציות והכל במערכת אחת.",
    type: "website",
    locale: "he_IL",
    siteName: "CodeTutor",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "CodeTutor Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeTutor - מערכת למידה למבחן במדמח",
    description:
      "מערכת למידה 10 ימים למבחן במדמח ואתם מוכנים. כל הנושאים מחולק ליום, הרצת קוד ובדיקה שלו, תרגול של יותר מ-90 תרגילים וסימולציות והכל במערכת אחת.",
    images: ["/images/logo.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f12" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${rubik.variable} font-sans antialiased overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
