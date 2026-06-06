import type { Metadata } from "next"
import { ConversationContent } from "@/views/conversation-content"

export const metadata: Metadata = {
  title: "Conversation | Agentic Craft",
  description:
    "Reference patterns for motion, messages, citations, progress steps, and composers",
}

export default function ConversationPage() {
  return <ConversationContent />
}
