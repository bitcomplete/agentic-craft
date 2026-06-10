import type { Metadata } from "next"
import { ConversationContent } from "@/views/conversation-content"

export const metadata: Metadata = {
  title: "Conversation | Agentic Craft",
  description:
    "Message design for agent conversations, from streaming prose to a composer that carries context",
}

export default function ConversationPage() {
  return <ConversationContent />
}
