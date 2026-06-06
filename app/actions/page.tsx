import type { Metadata } from "next"
import { ActionsContent } from "@/views/actions-content"

export const metadata: Metadata = {
  title: "Agent Actions | Agentic Craft",
  description:
    "Reference patterns for tool calls, plans, clarifying questions, decisions, approvals, and parallel execution",
}

export default function ActionsPage() {
  return <ActionsContent />
}
