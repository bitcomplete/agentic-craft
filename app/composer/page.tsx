import type { Metadata } from 'next'
import { ComposerContent } from '@/views/composer-content'

export const metadata: Metadata = {
  title: 'Composer | Agentic Craft',
  description: 'Canonical pattern reference for the agentic composer surface',
}

export default function ComposerPage() {
  return <ComposerContent />
}
