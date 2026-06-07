import type { Metadata } from "next"

import { SourcesContent } from "@/views/sources-content"

export const metadata: Metadata = {
  title: "Sources & Artifacts | Agentic Craft",
}

export default function SourcesPage() {
  return <SourcesContent />
}
