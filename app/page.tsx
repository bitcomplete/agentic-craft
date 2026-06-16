import type { Metadata } from "next"

import { LandingContent } from "@/views/landing/landing-content"

export const metadata: Metadata = {
  title: "Agentic Craft — interface patterns for agents beyond chat",
  description:
    "A set of carefully designed interaction patterns for agentic products, grounded in research and shipped as installable shadcn registry components.",
}

export default function HomePage() {
  return <LandingContent />
}
