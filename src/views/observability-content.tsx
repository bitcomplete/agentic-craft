"use client"

import { ActivityTimelineSection } from "./observability/activity-timeline-section"
import { TokenUsageSection } from "./observability/token-usage-section"
import { SessionTimelineSection } from "./observability/session-timeline-section"
import { ErrorLogSection } from "./observability/error-log-section"

export function ObservabilityContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Observability</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Observability
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Activity timelines, token tracking, session history, and error logs
          for continuous agent oversight.
        </p>
      </header>

      <ActivityTimelineSection />
      <TokenUsageSection />
      <SessionTimelineSection />
      <ErrorLogSection />
    </article>
  )
}
