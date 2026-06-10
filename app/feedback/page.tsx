import type { Metadata } from "next"
import { FeedbackContent } from "@/views/feedback-content"

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "What happens after a user corrects an agent, and how that correction visibly changes future behavior",
}

export default function FeedbackPage() {
  return <FeedbackContent />
}
