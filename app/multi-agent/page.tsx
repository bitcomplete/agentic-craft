import type { Metadata } from 'next'
import { MultiAgentContent } from '@/views/multi-agent-content'

export const metadata: Metadata = {
  title: 'Multi-Agent | Agentic Craft',
  description: 'Reference patterns for agent identity, handoffs, routing, and collaboration',
}

export default function MultiAgentPage() {
  return <MultiAgentContent />
}
