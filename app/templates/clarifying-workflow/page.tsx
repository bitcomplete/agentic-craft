import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Clarifying Workflow | Agentic Craft",
  description:
    "Structured questions that ask only for missing decisions while defaults stay visible",
}

export default function ClarifyingWorkflowPage() {
  return <TemplateDetailContent slug="clarifying-workflow" />
}
