import type { Metadata } from 'next'
import { ObservabilityContent } from '@/views/observability-content'

export const metadata: Metadata = {
  title: 'Observability | Agentic Craft',
  description: 'Reference patterns for activity, costs, sessions, diagnostics, and operational traces',
}

export default function ObservabilityPage() {
  return <ObservabilityContent />
}
