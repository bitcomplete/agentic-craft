import type { Metadata } from "next"

import { AutonomyContractContent } from "@/views/patterns/autonomy-contract-content"

export const metadata: Metadata = {
  title: "Autonomy Contract",
  description:
    "A pattern card for making agent autonomy visible through a spectrum scrubber, consequence preview, and effective policy surface",
}

export default function AutonomyContractPage() {
  return <AutonomyContractContent />
}
