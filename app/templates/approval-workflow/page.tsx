import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Approval Workflow | Agentic Craft",
  description:
    "A consequence preview that pauses the agent before irreversible or costly actions",
}

export default function ApprovalWorkflowPage() {
  return <TemplateDetailContent slug="approval-workflow" />
}
