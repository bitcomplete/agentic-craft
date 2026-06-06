import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Approval Workflow | Agentic Craft",
}

export default function ApprovalWorkflowPage() {
  return <TemplateDetailContent slug="approval-workflow" />
}

