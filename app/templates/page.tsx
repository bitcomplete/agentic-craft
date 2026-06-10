import type { Metadata } from "next"

import { TemplatesContent } from "@/views/templates-content"

export const metadata: Metadata = {
  title: "Templates",
  description:
    "End-to-end agentic workflow templates built from registry primitives, documented down to their failure and recovery states",
}

export default function TemplatesPage() {
  return <TemplatesContent />
}
