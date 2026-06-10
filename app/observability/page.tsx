import type { Metadata } from "next"
import { ObservabilityContent } from "@/views/observability-content"

export const metadata: Metadata = {
  title: "Observability | Agentic Craft",
  description:
    "Surfaces that show what a run actually did and what it cost while it happened",
}

export default function ObservabilityPage() {
  return <ObservabilityContent />
}
