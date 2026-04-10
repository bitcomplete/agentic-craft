import type { Metadata } from "next"
import { ApprovalGateContent } from "@/views/approval-gate-content"

export const metadata: Metadata = {
  title: "Approval Gate | Agentic Craft",
  description:
    "Canonical pattern reference for human approval before consequential agent actions",
}

export default function ApprovalGatePage() {
  return <ApprovalGateContent />
}
