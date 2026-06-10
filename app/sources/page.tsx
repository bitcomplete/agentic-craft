import type { Metadata } from "next"

import { SourcesContent } from "@/views/sources-content"

export const metadata: Metadata = {
  title: "Sources & Artifacts | Agentic Craft",
  description:
    "How an agent answer becomes a cited document the user can still inspect after the conversation ends",
}

export default function SourcesPage() {
  return <SourcesContent />
}
