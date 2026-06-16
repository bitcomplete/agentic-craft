import type { Metadata } from "next"

import { OperationalSurfacesContent } from "@/views/operational-surfaces-content"

export const metadata: Metadata = {
  title: "Operational Surfaces",
  description:
    "Inbox, kanban, manager surface, run monitor, and background-task surfaces for delegated agent work.",
}

export default function OperationalSurfacesPage() {
  return <OperationalSurfacesContent />
}
