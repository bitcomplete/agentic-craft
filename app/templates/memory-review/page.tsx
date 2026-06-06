import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Memory Review | Agentic Craft",
}

export default function MemoryReviewPage() {
  return <TemplateDetailContent slug="memory-review" />
}

