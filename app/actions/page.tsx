import type { Metadata } from "next"
import { ActionsContent } from "@/views/actions-content"

export const metadata: Metadata = {
  title: "Agent Actions",
  description:
    "How an agent shows its work while it acts, from tool calls to the approval gate before anything irreversible happens",
}

export default function ActionsPage() {
  return <ActionsContent />
}
