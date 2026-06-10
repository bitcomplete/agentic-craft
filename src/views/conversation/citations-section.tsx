"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  File01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons"
import { SourcePreview } from "@/components/ui/source-preview"
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
    page: "Page 14",
    icon: File01Icon,
    excerpt:
      "The standard support plan requires the product team to establish issue triage procedures, named owners, and response timelines before enterprise release.",
  },
  {
    id: 2,
    title: "Issue Triage Policy",
    source: "docs.internal/customer-portal/triage-policy.pdf",
    page: "Page 8",
    icon: Shield01Icon,
    excerpt:
      "Critical customer-impacting issues require a 72-hour acknowledgment and a 30-day resolution target. High-priority issues require weekly status updates.",
  },
  {
    id: 3,
    title: "Launch Guidance: Source Scope",
    source: "docs.internal/launch-guidance/source-scope",
    page: "Page 21",
    icon: Globe02Icon,
    excerpt:
      "All source documents that support a launch decision must be linked from the final review summary, including any modules excluded from the initial boundary.",
  },
] as const

type CitationReference = (typeof CITATION_REFERENCES)[number]

function CitationToken({
  citation,
  active,
  onSelect,
  onPreview,
  onClearPreview,
}: {
  citation: CitationReference
  active: boolean
  onSelect: () => void
  onPreview: () => void
  onClearPreview: () => void
}) {
  return (
    <button
      type="button"
      data-compact-touch
      aria-pressed={active}
      aria-label={`${citation.title}, ${citation.page}`}
      onClick={onSelect}
      onMouseEnter={onPreview}
      onMouseLeave={onClearPreview}
      onFocus={onPreview}
      onBlur={onClearPreview}
      className={`mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border px-1.5 py-0.5 font-sans text-xs leading-none transition-[background-color,border-color,color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
        active
          ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <HugeiconsIcon
        icon={citation.icon}
        size={12}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="tabular-nums">{citation.id}</span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function CitationsSection() {
  /* Citation preview state */
  const [activeCitationId, setActiveCitationId] =
    useState<CitationReference["id"]>(2)
  const [previewCitationId, setPreviewCitationId] = useState<
    CitationReference["id"] | null
  >(null)
  const activeCitation =
    CITATION_REFERENCES.find((citation) => citation.id === activeCitationId) ??
    CITATION_REFERENCES[0]
  const previewCitation = previewCitationId
    ? CITATION_REFERENCES.find((citation) => citation.id === previewCitationId)
    : null
  const selectCitation = (id: CitationReference["id"]) => {
    setActiveCitationId(id)
  }

  /* prose style for the citation display */
  const agentProseStyle: React.CSSProperties = {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "16px",
    lineHeight: "26px",
    letterSpacing: "0px",
    fontVariationSettings: '"opsz" 12',
    WebkitFontSmoothing: "antialiased",
  }

  return (
    <section id="citations" className="page-section">
      <p className="section-label mb-3">Sourcing</p>
      <h2 className="text-xl font-semibold tracking-tight">Citations</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Citations ground agent responses in verifiable sources. The best
        version keeps the prose readable while making the selected source
        immediately inspectable.
      </p>

      <div className="mt-7 border-y border-border/50 py-3">
        <div className="relative mx-auto max-w-[720px]">
          {previewCitation && (
            <div className="pointer-events-none absolute top-2 right-2 z-20 w-[min(360px,calc(100%-16px))] animate-in duration-150 fade-in-0 zoom-in-95 motion-reduce:animate-none sm:w-[360px]">
              <SourcePreview
                title={previewCitation.title}
                excerpt={previewCitation.excerpt}
                location={previewCitation.page}
                source={previewCitation.source}
                icon={previewCitation.icon}
              />
            </div>
          )}

          <div className="bg-muted/20 px-3 py-4 sm:px-4 sm:py-5">
            <div className="font-serif text-base" style={agentProseStyle}>
              <p>
                The launch readiness plan has been set to enterprise release,
                which requires independent risk analysis by the review team
                <CitationToken
                  citation={CITATION_REFERENCES[0]}
                  active={activeCitation.id === CITATION_REFERENCES[0].id}
                  onSelect={() => selectCitation(CITATION_REFERENCES[0].id)}
                  onPreview={() =>
                    setPreviewCitationId(CITATION_REFERENCES[0].id)
                  }
                  onClearPreview={() => setPreviewCitationId(null)}
                />
                and a standard support plan with documented issue triage
                timelines
                <CitationToken
                  citation={CITATION_REFERENCES[1]}
                  active={activeCitation.id === CITATION_REFERENCES[1].id}
                  onSelect={() => selectCitation(CITATION_REFERENCES[1].id)}
                  onPreview={() =>
                    setPreviewCitationId(CITATION_REFERENCES[1].id)
                  }
                  onClearPreview={() => setPreviewCitationId(null)}
                />
                . The internal launch guidance also requires every
                decision-supporting source to be linked from the final review
                summary, including modules that were excluded from the initial
                boundary
                <CitationToken
                  citation={CITATION_REFERENCES[2]}
                  active={activeCitation.id === CITATION_REFERENCES[2].id}
                  onSelect={() => selectCitation(CITATION_REFERENCES[2].id)}
                  onPreview={() =>
                    setPreviewCitationId(CITATION_REFERENCES[2].id)
                  }
                  onClearPreview={() => setPreviewCitationId(null)}
                />
                .
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {CITATION_REFERENCES.map((citation) => (
                <button
                  key={citation.id}
                  type="button"
                  data-compact-touch
                  aria-label={`Inspect source ${citation.id}: ${citation.title}`}
                  aria-pressed={activeCitation.id === citation.id}
                  onClick={() => selectCitation(citation.id)}
                  onMouseEnter={() => setPreviewCitationId(citation.id)}
                  onMouseLeave={() => setPreviewCitationId(null)}
                  onFocus={() => setPreviewCitationId(citation.id)}
                  onBlur={() => setPreviewCitationId(null)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-[background-color,border-color,color] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                    activeCitation.id === citation.id
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <HugeiconsIcon
                    icon={citation.icon}
                    size={12}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {citation.title}
                </button>
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
              "Small numbered source control inside prose; selected state is visible but not disruptive.",
            ],
            [
              "Preview card",
              "Source title, quote excerpt, page chip, and source affordance shown only on hover or keyboard focus.",
            ],
            [
              "Placement",
              "Overlaid near the cited prose without reserving permanent vertical space.",
            ],
            [
              "Source strip",
              "Readable fallback list for scanning, keyboard selection, and long source names.",
            ],
          ].map(([element, spec], index, rows) => (
            <TableRow
              key={element}
              className={
                index < rows.length - 1 ? "border-b border-border/50" : ""
              }
            >
              <TableCell className="py-3 pr-6 font-medium">
                {element}
              </TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {spec}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        <p>
          The citation preview should answer "why should I trust this
          sentence?" without forcing the user away from the current answer.
          Keep the quote short, show the exact source location, and make the
          full document one click away.
        </p>
      </div>
    </section>
  )
}
