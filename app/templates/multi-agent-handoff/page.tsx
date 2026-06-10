import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Multi-Agent Handoff",
  description:
    "An inspectable packet that makes ownership transfer between agents explicit",
}

export default function MultiAgentHandoffPage() {
  return <TemplateDetailContent slug="multi-agent-handoff" />
}
