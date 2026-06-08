"use client"

import { useState } from "react"
import {
  ArrowExpand01Icon,
  File01Icon,
  Globe02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ArtifactDocument } from "@/components/ui/artifact-document"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetContentClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SourcePreview } from "@/components/ui/source-preview"
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

const artifactSections = [
  {
    id: "claim",
    title: "Claim",
    status: "cited" as const,
    source: "Launch Checklist, Page 14",
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

function SourceMarker({
  id,
  active,
  onSelect,
}: {
  id: number
  active?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      data-compact-touch
      aria-label={`Inspect source ${id}`}
      aria-pressed={active}
      onClick={onSelect}
      className="inline-flex translate-y-[-1px] items-center rounded-md border border-border bg-background px-1.5 py-0.5 font-sans text-xs leading-none text-muted-foreground transition-[background-color,border-color,color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-pressed:border-primary/30 aria-pressed:bg-primary/10 aria-pressed:text-primary"
    >
      {id}
    </button>
  )
}

export function SourcesContent() {
  const [activeSourceId, setActiveSourceId] = useState(1)
  const activeIndex = sources.findIndex((source) => source.id === activeSourceId)
  const activeSource = sources[activeIndex] ?? sources[0]
  const selectOffset = (offset: number) => {
    const next = (activeIndex + offset + sources.length) % sources.length
    setActiveSourceId(sources[next].id)
  }

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
          Inline marker to source preview
        </h2>
        <p className="mt-3 max-w-[660px] text-sm leading-relaxed text-muted-foreground">
          Desktop can reveal the source on hover or focus. Mobile should use an
          explicit sheet because cramped tooltips make source inspection feel
          fragile.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="border-y border-border/70 py-5">
            <p className="font-serif text-base leading-7 text-foreground">
              The launch readiness plan is set to enterprise release, which
              requires named support owners
              <SourceMarker
                id={1}
                active={activeSourceId === 1}
                onSelect={() => setActiveSourceId(1)}
              />{" "}
              and a documented triage policy
              <SourceMarker
                id={2}
                active={activeSourceId === 2}
                onSelect={() => setActiveSourceId(2)}
              />
              . Every final claim should link back to the source scope used for
              the review
              <SourceMarker
                id={3}
                active={activeSourceId === 3}
                onSelect={() => setActiveSourceId(3)}
              />
              .
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button type="button" variant="outline" />
                  }
                >
                  Inspect selected source
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-xl">
                  <SheetHeader>
                    <SheetTitle>{activeSource.title}</SheetTitle>
                    <SheetDescription>
                      {activeSource.location} - {activeSource.source}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="px-4 pb-4">
                    <SourcePreview
                      title={activeSource.title}
                      excerpt={activeSource.excerpt}
                      location={activeSource.location}
                      source={activeSource.source}
                      icon={activeSource.icon}
                      index={activeIndex}
                      total={sources.length}
                      onPrevious={() => selectOffset(-1)}
                      onNext={() => selectOffset(1)}
                      className="shadow-none"
                    />
                  </div>
                  <SheetContentClose />
                </SheetContent>
              </Sheet>
              <Badge variant="outline">Hover/focus on desktop</Badge>
              <Badge variant="outline">Bottom sheet on mobile</Badge>
            </div>
          </div>

          <SourcePreview
            title={activeSource.title}
            excerpt={activeSource.excerpt}
            location={activeSource.location}
            source={activeSource.source}
            icon={activeSource.icon}
            index={activeIndex}
            total={sources.length}
            onPrevious={() => selectOffset(-1)}
            onNext={() => selectOffset(1)}
            className="hidden lg:block"
          />
        </div>
      </section>

      <section id="source-list" className="page-section">
        <p className="section-label mb-3">Source companion</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Sources remain inspectable after the answer
        </h2>
        <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
          {sources.map((source) => (
            <button
              key={source.id}
              type="button"
              data-compact-touch
              aria-label={`Inspect source ${source.id}: ${source.title}`}
              onClick={() => setActiveSourceId(source.id)}
              className="grid w-full gap-2 px-0 py-3 text-left transition-colors hover:bg-muted/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:grid-cols-[32px_1fr_auto]"
            >
              <span className="flex size-7 items-center justify-center rounded-md border border-border text-xs tabular-nums text-muted-foreground">
                {source.id}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  {source.title}
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {source.source}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                {source.location}
                <HugeiconsIcon
                  icon={ArrowExpand01Icon}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="artifact-document" className="page-section">
        <p className="section-label mb-3">Artifact output</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Document as the output surface
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
          Cost and limit surfaces
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
          Required states
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
                <TableCell>Hover, focus, selected, broken, mobile sheet</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Source preview</TableCell>
                <TableCell>Excerpt, location, navigation, open-source action</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Artifact document</TableCell>
                <TableCell>Cited, draft, needs-source, blocked, approved</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Usage meter</TableCell>
                <TableCell>Tokens, cost, source coverage, threshold warning</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 grid gap-2 md:hidden">
          {[
            ["Inline citation", "Hover, focus, selected, broken, mobile sheet"],
            ["Source preview", "Excerpt, location, navigation, open-source action"],
            ["Artifact document", "Cited, draft, needs-source, blocked, approved"],
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
