import type { Metadata } from "next"
import { ThreadTimelineContent } from "@/views/thread-timeline-content"

export const metadata: Metadata = {
  title: "Thread Timeline | Agentic Craft",
  description:
    "Timeline minimap, thread navigation, and long-conversation scanning patterns",
}

export default function ThreadTimelinePage() {
  return <ThreadTimelineContent />
}
