import type { Metadata } from 'next'
import { DemoContent } from '@/views/demo-content'

export const metadata: Metadata = {
  title: 'Agentic Craft',
  description: 'HAX-informed reference for agentic UX patterns and interaction models',
}

export default function HomePage() {
  return <DemoContent />
}
