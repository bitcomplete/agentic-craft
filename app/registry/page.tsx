import type { Metadata } from "next"

import { RegistryContent } from "@/views/registry-content"

export const metadata: Metadata = {
  title: "Registry",
  description:
    "Install the primitives behind every demo on this site through the shadcn registry",
}

export default function RegistryPage() {
  return <RegistryContent />
}
