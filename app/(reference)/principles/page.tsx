import type { Metadata } from "next"

import { PrinciplesContent } from "@/views/principles-content"

export const metadata: Metadata = {
  title: "Principles",
  description:
    "Ten research-backed principles for designing agentic product interfaces.",
}

export default function PrinciplesPage() {
  return <PrinciplesContent />
}
