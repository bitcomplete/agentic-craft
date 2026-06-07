"use client"

import { useState } from "react"
import {
  File01Icon,
  Globe02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"

import { ArtifactDocument } from "@/components/ui/artifact-document"
import { SourcePreview } from "@/components/ui/source-preview"
import { UsageMeter } from "@/components/ui/usage-meter"

const sources = [
  {
    id: 1,
    title: "Launch Checklist: Support Readiness",
    source: "docs.example.com/launch/support-readiness",
    location: "Page 14",
    icon: File01Icon,
    excerpt:
      "The dedicated support plan requires issue triage procedures, named owners, and response timelines before enterprise release.",
  },
  {
    id: 2,
    title: "Issue Triage Policy",
    source: "docs.internal/customer-portal/triage-policy.pdf",
    location: "Page 8",
    icon: Shield01Icon,
    excerpt:
      "Critical customer-impacting issues require a 72-hour acknowledgment and a 30-day resolution target.",
  },
  {
    id: 3,
    title: "Launch Guidance: Source Scope",
    source: "docs.example.com/launch-guidance/source-scope",
    location: "Page 21",
    icon: Globe02Icon,
    excerpt:
      "Every source document supporting a launch decision must be linked from the final review summary.",
  },
] as const

function SourceBackedArtifact() {
  const [activeSourceId, setActiveSourceId] = useState(1)
  const activeIndex = sources.findIndex((source) => source.id === activeSourceId)
  const activeSource = sources[activeIndex] ?? sources[0]

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        <ArtifactDocument
          title="Launch Review Summary"
          description="Source-backed artifact prepared from the latest brief, launch checklist, and triage policy."
          status="reviewing"
          version="v3"
          sourceCount={sources.length}
          meta={[
            { label: "Owner", value: "Release review" },
            { label: "Updated", value: "18s ago" },
          ]}
          sections={[
            {
              id: "claim",
              title: "Claim",
              status: "cited",
              source: "Launch Checklist, Page 14",
              body: "Enterprise release is blocked until support owners and triage windows are named.",
            },
            {
              id: "gap",
              title: "Gap",
              status: "cited",
              source: "Issue Triage Policy, Page 8",
              body: "The current brief describes escalation, but it does not name the 72-hour acknowledgment owner.",
            },
            {
              id: "next",
              title: "Next action",
              status: "needs-source",
              body: "Ask the launch owner to confirm whether support coverage begins before or after public release.",
            },
          ]}
        />
        <UsageMeter
          className="mt-5"
          title="Run budget"
          description="Show cost and coverage next to source-backed work."
          items={[
            {
              id: "tokens",
              label: "Tokens",
              value: 58,
              valueLabel: "18.2k",
              limitLabel: "31k session budget",
            },
            {
              id: "cost",
              label: "Cost",
              value: 36,
              valueLabel: "$0.42",
              limitLabel: "$1.20 review cap",
            },
            {
              id: "coverage",
              label: "Coverage",
              value: 74,
              valueLabel: "14 / 19",
              limitLabel: "5 still unverified",
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3">
        {sources.map((source) => (
          <button
            key={source.id}
            type="button"
            aria-pressed={activeSourceId === source.id}
            onClick={() => setActiveSourceId(source.id)}
            className="rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-pressed:bg-muted/50"
          >
            {source.title}
          </button>
        ))}
        <SourcePreview
          title={activeSource.title}
          excerpt={activeSource.excerpt}
          location={activeSource.location}
          source={activeSource.source}
          icon={activeSource.icon}
          index={activeIndex}
          total={sources.length}
        />
      </div>
    </div>
  )
}

export { SourceBackedArtifact }
