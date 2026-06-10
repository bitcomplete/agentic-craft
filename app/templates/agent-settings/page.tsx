import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Agent Settings | Agentic Craft",
  description:
    "Durable controls that set agent boundaries once instead of prompting at every action",
}

export default function AgentSettingsPage() {
  return <TemplateDetailContent slug="agent-settings" />
}
