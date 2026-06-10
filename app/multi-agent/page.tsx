import type { Metadata } from "next"
import { MultiAgentContent } from "@/views/multi-agent-content"

export const metadata: Metadata = {
  title: "Multi-Agent",
  description:
    "Interfaces that keep ownership legible when work moves between specialist agents",
}

export default function MultiAgentPage() {
  return <MultiAgentContent />
}
