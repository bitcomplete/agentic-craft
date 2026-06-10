import type { Metadata } from "next"
import { DemoContent } from "@/views/demo-content"

export const metadata: Metadata = {
  title: "Agentic Craft",
  description:
    "Reference guide for designing agentic product interfaces beyond chat",
}

export default function HomePage() {
  return <DemoContent />
}
