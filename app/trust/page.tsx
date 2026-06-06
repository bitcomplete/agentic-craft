import type { Metadata } from 'next'
import { TrustContent } from '@/views/trust-content'

export const metadata: Metadata = {
  title: 'Trust & Governance | Agentic Craft',
  description: 'Reference patterns for autonomy, consent, confidence, provenance, and auditability',
}

export default function TrustPage() {
  return <TrustContent />
}
