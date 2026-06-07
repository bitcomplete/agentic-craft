import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Source-Backed Artifact | Agentic Craft",
}

export default function SourceBackedArtifactPage() {
  return <TemplateDetailContent slug="source-backed-artifact" />
}
