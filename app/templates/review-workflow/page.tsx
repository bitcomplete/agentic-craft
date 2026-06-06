import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Review Workflow | Agentic Craft",
}

export default function ReviewWorkflowPage() {
  return <TemplateDetailContent slug="review-workflow" />
}

