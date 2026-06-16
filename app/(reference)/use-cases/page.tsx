import type { Metadata } from "next"

import { UseCasesContent } from "@/views/use-cases/use-cases-content"

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Three variants of one agent thread surface: refreshed conversation, context blocks, and contextual side panel.",
}

export default function UseCasesPage() {
  return <UseCasesContent />
}
