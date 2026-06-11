"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  File01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons"
import {
  SourcePreview,
  SourcePreviewCitation,
  SourcePreviewPopover,
  SourcePreviewPopoverContent,
  SourcePreviewPopoverTrigger,
} from "@/components/ui/source-preview"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CITATION_REFERENCES = [
  {
    id: 1,
    title: "Launch Checklist: Support Readiness",
    source: "docs.internal/launch/support-readiness",
    location: "Page 14",
    icon: File01Icon,
    excerpt:
      "The standard support plan requires the product team to establish issue triage procedures, named owners, and response timelines before enterprise release.",
  },
  {
    id: 2,
    title: "Issue Triage Policy",
    source: "docs.internal/customer-portal/triage-policy.pdf",
    location: "Page 8",
    icon: Shield01Icon,
    excerpt:
      "Critical customer-impacting issues require a 72-hour acknowledgment and a 30-day resolution target. High-priority issues require weekly status updates.",
  },
  {
    id: 3,
    title: "Launch Guidance: Source Scope",
    source: "docs.internal/launch-guidance/source-scope",
    location: "Page 21",
    icon: Globe02Icon,
    excerpt:
      "All source documents that support a launch decision must be linked from the final review summary, including any modules excluded from the initial boundary.",
  },
] as const

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function CitationsSection() {
  return (
    <section id="citations" className="page-section">
      <p className="section-label mb-3">Sourcing</p>
      <h2 className="text-xl font-semibold tracking-tight">Citations</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Citations ground agent responses in verifiable sources. Hovering or
        focusing a marker opens the preview anchored at the citation itself, so
        verification never leaves the sentence; on touch, tapping the marker
        opens the same card.
      </p>

      <div className="mt-7 border-y border-border/50 py-3">
        <div className="mx-auto max-w-[720px]">
          <div className="bg-muted/20 px-3 py-4 sm:px-4 sm:py-5">
            <div className="agent-prose font-serif text-base">
              <p>
                The launch readiness plan has been set to enterprise release,
                which requires independent risk analysis by the review team
                <SourcePreviewCitation
                  sources={CITATION_REFERENCES}
                  sourceIndex={0}
                  showIcon
                  className="mx-1"
                />
                and a standard support plan with documented issue triage
                timelines
                <SourcePreviewCitation
                  sources={CITATION_REFERENCES}
                  sourceIndex={1}
                  showIcon
                  className="mx-1"
                />
                . The internal launch guidance also requires every
                decision-supporting source to be linked from the final review
                summary, including modules that were excluded from the initial
                boundary
                <SourcePreviewCitation
                  sources={CITATION_REFERENCES}
                  sourceIndex={2}
                  showIcon
                  className="mx-1"
                />
                .
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {CITATION_REFERENCES.map((citation) => (
                <SourcePreviewPopover key={citation.id}>
                  <SourcePreviewPopoverTrigger
                    data-compact-touch
                    aria-label={`Preview source ${citation.id}: ${citation.title}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-[background-color,border-color,color] hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none data-popup-open:border-primary/30 data-popup-open:bg-primary/10 data-popup-open:text-primary"
                  >
                    <HugeiconsIcon
                      icon={citation.icon}
                      size={12}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {citation.title}
                  </SourcePreviewPopoverTrigger>
                  <SourcePreviewPopoverContent side="top" align="start">
                    <SourcePreview
                      title={citation.title}
                      excerpt={citation.excerpt}
                      location={citation.location}
                      source={citation.source}
                      icon={citation.icon}
                    />
                  </SourcePreviewPopoverContent>
                </SourcePreviewPopover>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Element
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Spec
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Inline token",
              "Small numbered source control inside prose; hover, keyboard focus, or tap opens the preview.",
            ],
            [
              "Preview card",
              "Source title, quote excerpt, page chip, view-source affordance, and source pagination; Escape or tapping outside dismisses it.",
            ],
            [
              "Placement",
              "Anchored at the citation marker with a caret, flipping sides when the viewport would clip it.",
            ],
            [
              "Source strip",
              "Readable fallback list for scanning and long source names; each entry opens the same anchored preview.",
            ],
          ].map(([element, spec], index, rows) => (
            <TableRow
              key={element}
              className={
                index < rows.length - 1 ? "border-b border-border/50" : ""
              }
            >
              <TableCell className="py-3 pr-6 font-medium">{element}</TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {spec}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
