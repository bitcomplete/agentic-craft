import type { Metadata } from "next"
import { ActivityTimelineContent } from "@/views/activity-timeline-content"

export const metadata: Metadata = {
  title: "Activity Timeline | Agentic Craft",
  description:
    "Canonical pattern reference for live, historical, and filterable execution timelines in agentic interfaces",
}

export default function ActivityTimelinePage() {
  return <ActivityTimelineContent />
}
