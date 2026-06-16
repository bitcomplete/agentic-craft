import type { Metadata } from "next"

import { LandingContent } from "@/views/landing/landing-content"

export const metadata: Metadata = {
  title: "Agentic Craft — interface patterns for agents beyond chat",
  description:
    "A set of carefully designed interaction patterns for agentic products — grounded in research, shipped as working components, installable from a shadcn registry.",
}

export default function HomePage() {
  return <LandingContent />
}
