import type { Metadata } from 'next'
import { MemoryContent } from '@/views/memory-content'

export const metadata: Metadata = {
  title: 'Memory | Agentic Craft',
  description:
    'Reference patterns for memory panels, memory editing, context awareness, and privacy controls',
}

export default function MemoryPage() {
  return <MemoryContent />
}
