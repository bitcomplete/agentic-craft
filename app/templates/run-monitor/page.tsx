import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Background Run Monitor | Agentic Craft",
}

export default function RunMonitorPage() {
  return <TemplateDetailContent slug="run-monitor" />
}

