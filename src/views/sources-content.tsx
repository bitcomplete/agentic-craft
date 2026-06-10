"use client"

import {
  ArrowExpand01Icon,
  File01Icon,
  Globe02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ArtifactDocument } from "@/components/ui/artifact-document"
import { ContextualWorkbench } from "@/components/ui/contextual-workbench"
import {
  SourcePreview,
  SourcePreviewCitation,
  SourcePreviewPopover,
  SourcePreviewPopoverContent,
  SourcePreviewPopoverTrigger,
} from "@/components/ui/source-preview"
import { UsageMeter } from "@/components/ui/usage-meter"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const sources = [
  {
    id: 1,
    title: "Launch Checklist: Support Readiness",
    source: "docs.internal/launch/support-readiness",
    location: "§3 — Support readiness",
    icon: File01Icon,
    excerpt:
      "The standard support plan requires issue triage procedures, named owners, and response timelines before enterprise release.",
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
    source: "docs.internal/launch-guidance/source-scope",
    location: "§5 — Source scope",
    icon: Globe02Icon,
    excerpt:
      "Every source document supporting a launch decision must be linked from the final review summary.",
  },
] as const

const artifactSections = [
  {
    id: "claim",
    title: "Claim",
    status: "cited" as const,
    source: "Launch Checklist, §3",
    body: "Enterprise release is blocked until support owners and triage windows are named.",
  },
  {
    id: "gap",
    title: "Gap",
    status: "cited" as const,
    source: "Issue Triage Policy, Page 8",
    body: "The current brief describes escalation, but it does not name the 72-hour acknowledgment owner.",
  },
  {
    id: "next",
    title: "Next action",
    status: "needs-source" as const,
    body: "Ask the launch owner to confirm whether support coverage begins before or after public release.",
  },
]

export function SourcesContent() {
  return (
    <article>
      <header className="mb-12 sm:mb-20">
        <p className="section-label mb-3">PROVENANCE</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Sources &amp; Artifacts
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Source-backed answers, citation previews, output documents, and usage
          meters. This page turns provenance into an inspectable product surface
          instead of a small citation number at the end of a sentence.
        </p>
      </header>

      <section id="citations" className="page-section">
        <p className="section-label mb-3">Citation system</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Inline Marker to Source Preview
        </h2>
        <p className="mt-3 max-w-[660px] text-sm leading-relaxed text-muted-foreground">
          Hovering or focusing a citation marker opens the source preview
          anchored at the marker itself, so verification never leaves the
          sentence. On touch, tapping the marker opens the same card; Escape or
          tapping outside dismisses it.
        </p>

        <div className="mt-8 border-y border-border/70 py-5">
          <p className="font-serif text-base leading-7 text-foreground">
            The launch readiness plan is set to enterprise release, which
            requires named support owners
            <SourcePreviewCitation sources={sources} sourceIndex={0} /> and a
            documented triage policy
            <SourcePreviewCitation sources={sources} sourceIndex={1} />. Every
            final claim should link back to the source scope used for the review
            <SourcePreviewCitation sources={sources} sourceIndex={2} />.
          </p>
        </div>
      </section>

      <section id="source-list" className="page-section">
        <p className="section-label mb-3">Source companion</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Sources Remain Inspectable After the Answer
        </h2>
        <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
          {sources.map((source) => (
            <SourcePreviewPopover key={source.id}>
              <SourcePreviewPopoverTrigger
                data-compact-touch
                aria-label={`Inspect source ${source.id}: ${source.title}`}
                className="grid w-full gap-2 px-0 py-3 text-left transition-colors hover:bg-muted/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:grid-cols-[32px_1fr_auto]"
              >
                <span className="flex size-7 items-center justify-center rounded-md border border-border text-xs text-muted-foreground tabular-nums">
                  {source.id}
                </span>
                <span className="min-w-0">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {source.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {source.location}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {source.source}
                  </span>
                </span>
                <span className="inline-flex items-center self-center text-muted-foreground">
                  <HugeiconsIcon
                    icon={ArrowExpand01Icon}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
              </SourcePreviewPopoverTrigger>
              <SourcePreviewPopoverContent side="top" align="start">
                <SourcePreview
                  title={source.title}
                  excerpt={source.excerpt}
                  location={source.location}
                  source={source.source}
                  icon={source.icon}
                />
              </SourcePreviewPopoverContent>
            </SourcePreviewPopover>
          ))}
        </div>
      </section>

      <section id="contextual-workbench" className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          Side Panel Work Surface
        </h2>
        <div className="mt-6 md:-mx-14 lg:-mx-28">
          <ContextualWorkbench />
        </div>
      </section>

      <section id="artifact-document" className="page-section">
        <p className="section-label mb-3">Artifact output</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Document as the Output Surface
        </h2>
        <p className="mt-3 max-w-[660px] text-sm leading-relaxed text-muted-foreground">
          An agent output can be more than a message. A document surface shows
          which sections are cited, which are draft-only, and what still needs
          human input.
        </p>
        <div className="mt-8">
          <ArtifactDocument
            title="Launch Review Summary"
            description="Source-backed artifact prepared from the latest brief, launch checklist, and triage policy."
            status="reviewing"
            version="v3"
            sourceCount={3}
            meta={[
              { label: "Owner", value: "Release review" },
              { label: "Updated", value: "18s ago" },
            ]}
            sections={artifactSections}
          />
        </div>
      </section>

      <section id="usage-meter" className="page-section">
        <p className="section-label mb-3">Usage</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Cost and Limit Surfaces
        </h2>
        <div className="mt-8">
          <UsageMeter
            title="Run budget"
            description="Usage is shown near source-backed work so teams can judge whether to continue, pause, or narrow scope."
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
                id: "sources",
                label: "Source coverage",
                value: 74,
                valueLabel: "14 / 19",
                limitLabel: "5 still unverified",
              },
            ]}
          />
        </div>
      </section>

      <section id="implementation" className="page-section">
        <p className="section-label mb-3">Implementation</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Required States
        </h2>
        <div className="mt-8 hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern</TableHead>
                <TableHead>Must cover</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Inline citation</TableCell>
                <TableCell>
                  Hover, focus, touch tap, broken, escape dismiss
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Source preview</TableCell>
                <TableCell>
                  Excerpt, location, navigation, open-source action
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Artifact document</TableCell>
                <TableCell>
                  Cited, draft, needs-source, blocked, approved
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contextual workbench</TableCell>
                <TableCell>
                  Closed, open, active, review, blocked, mobile switch
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Usage meter</TableCell>
                <TableCell>
                  Tokens, cost, source coverage, threshold warning
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 grid gap-2 md:hidden">
          {[
            [
              "Inline citation",
              "Hover, focus, touch tap, broken, escape dismiss",
            ],
            [
              "Source preview",
              "Excerpt, location, navigation, open-source action",
            ],
            [
              "Artifact document",
              "Cited, draft, needs-source, blocked, approved",
            ],
            [
              "Contextual workbench",
              "Closed, open, active, review, blocked, mobile switch",
            ],
            ["Usage meter", "Tokens, cost, source coverage, threshold warning"],
          ].map(([pattern, requirement]) => (
            <div
              key={pattern}
              className="border-y border-border/70 py-3 first:border-t last:border-b"
            >
              <p className="text-sm font-medium text-foreground">{pattern}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {requirement}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
