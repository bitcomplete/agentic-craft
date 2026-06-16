import type { Metadata } from "next"

import { ThreadContent } from "@/views/patterns/thread-content"

export const metadata: Metadata = {
  title: "Thread",
  description:
    "A composable agent thread with streaming messages, tool calls, status, and scroll anchoring.",
}

export default function ThreadPage() {
  return <ThreadContent />
}
