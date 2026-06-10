import type { Metadata } from "next"
import { MemoryContent } from "@/views/memory-content"

export const metadata: Metadata = {
  title: "Memory",
  description:
    "How an agent earns the right to remember by keeping every piece of durable context reviewable",
}

export default function MemoryPage() {
  return <MemoryContent />
}
