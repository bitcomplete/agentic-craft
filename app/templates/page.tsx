import type { Metadata } from "next"

import { TemplatesContent } from "@/views/templates-content"

export const metadata: Metadata = {
  title: "Templates | Agentic Craft",
  description:
    "End-to-end workflow templates for review, approval, clarifying questions, memory review, run monitoring, handoffs, and agent settings.",
}

export default function TemplatesPage() {
  return <TemplatesContent />
}
