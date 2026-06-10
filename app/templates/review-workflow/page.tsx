import type { Metadata } from "next"

import { TemplateDetailContent } from "@/views/template-detail-content"

export const metadata: Metadata = {
  title: "Review Workflow",
  description:
    "How an agent reviews source material and produces a cited result a person can approve",
}

export default function ReviewWorkflowPage() {
  return <TemplateDetailContent slug="review-workflow" />
}
