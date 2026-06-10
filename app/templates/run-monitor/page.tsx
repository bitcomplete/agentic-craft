import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Background Run Monitor | Agentic Craft",
  description:
    "A status surface for tracking background agent work after the user leaves the conversation",
}

export default function RunMonitorPage() {
  return <TemplateDetailContent slug="run-monitor" />
}
