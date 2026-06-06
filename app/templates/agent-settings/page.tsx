import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Agent Settings | Agentic Craft",
}

export default function AgentSettingsPage() {
  return <TemplateDetailContent slug="agent-settings" />
}

