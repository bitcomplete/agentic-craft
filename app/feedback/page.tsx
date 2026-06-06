import type { Metadata } from 'next'
import { FeedbackContent } from '@/views/feedback-content'

export const metadata: Metadata = {
  title: 'Feedback | Agentic Craft',
  description: 'Reference patterns for correction, ratings, adaptation, and feedback history',
}

export default function FeedbackPage() {
  return <FeedbackContent />
}
