import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reichman University | CodeTutor - Modern CS Education",
  description:
    "A 10-step vision for transforming CS education at Reichman University. Discover how CodeTutor brings innovation into learning, improves measurement accuracy, and enables real-time academic oversight.",
  openGraph: {
    title: "Reichman University | CodeTutor",
    description:
      "Transforming CS Education From Day One - A strategic vision for Reichman University",
    type: "website",
  },
}

export default function ReichmanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
