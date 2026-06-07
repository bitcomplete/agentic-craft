import type { Metadata } from "next"

import { RegistryContent } from "@/views/registry-content"

export const metadata: Metadata = {
  title: "Registry | Agentic Craft",
}

export default function RegistryPage() {
  return <RegistryContent />
}
