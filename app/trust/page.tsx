import type { Metadata } from "next"
import { TrustContent } from "@/views/trust-content"

export const metadata: Metadata = {
  title: "Trust & Control Plane | Agentic Craft",
  description:
    "Controls that let users decide how much autonomy an agent gets before it acts on their behalf",
}

export default function TrustPage() {
  return <TrustContent />
}
