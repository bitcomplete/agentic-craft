import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Memory Review | Agentic Craft",
  description:
    "A review queue where proposed durable context stays editable until the user saves it",
}

export default function MemoryReviewPage() {
  return <TemplateDetailContent slug="memory-review" />
}
