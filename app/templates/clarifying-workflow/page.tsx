import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Clarifying Workflow | Agentic Craft",
}

export default function ClarifyingWorkflowPage() {
  return <TemplateDetailContent slug="clarifying-workflow" />
}

