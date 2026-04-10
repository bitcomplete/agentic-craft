import type { Metadata } from "next"
import { AuditTrailContent } from "@/views/audit-trail-content"

export const metadata: Metadata = {
  title: "Audit Trail | Agentic Craft",
  description:
    "Canonical pattern reference for immutable review records, evidence bundles, and accountability workflows",
}

export default function AuditTrailPage() {
  return <AuditTrailContent />
}
