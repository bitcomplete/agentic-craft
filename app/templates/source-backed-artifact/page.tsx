import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Source-Backed Artifact",
  description:
    "A template for turning an agent answer into a cited document with visible source gaps",
}

export default function SourceBackedArtifactPage() {
  return <TemplateDetailContent slug="source-backed-artifact" />
}
