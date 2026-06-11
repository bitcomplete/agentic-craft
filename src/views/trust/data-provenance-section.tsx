"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon, LinkSquare01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Progress } from "@/components/ui/progress"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PROVENANCE_SOURCES = [
  {
    document: "Project brief v3",
    section: "§5.1 — Requirement Definitions",
    confidence: 0.94,
    type: "Primary",
  },
  {
    document: "Operating playbook",
    section: "§12.4 — Reviewer Actions",
    confidence: 0.87,
    type: "Guidance",
  },
  {
    document: "Previous launch review (2025-08)",
    section: "§6 — Findings Summary",
    confidence: 0.71,
    type: "Reference",
  },
]

const PROVENANCE_CHAIN = [
  {
    step: "Source",
    label: "Brief v3, §5.1",
    detail: "Export workflow specifies CSV and JSON export",
  },
  {
    step: "Extracted",
    label: "Requirement",
    detail:
      "product must implement CSV and JSON export per the internal data policy",
  },
  {
    step: "Inference",
    label: "Gap analysis",
    detail:
      "Test case TC-047 covers CSV exports but not JSON pagination edge cases",
  },
  {
    step: "Conclusion",
    label: "Finding",
    detail: "Partial coverage — recommend an additional large-export test",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DataProvenanceSection() {
  const [provCtrl, provAnimKey, provToggle] = useExclusiveToggle({
    sources: true,
    chain: false,
  })

  return (
    <section id="data-provenance" className="page-section">
      <p className="section-label mb-3">Transparency</p>
      <h2 className="text-xl font-semibold tracking-tight">Data Provenance</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Tracing information back to its origin. Sources mode shows where data
        came from; chain mode shows the full reasoning path from source to
        conclusion.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "sources", label: "Sources" },
            { key: "chain", label: "Chain" },
          ]}
          active={provCtrl}
          onToggle={provToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={provAnimKey}
        >
          <div className="trust-slide-in">
            {/* Sources */}
            {provCtrl.sources && (
              <div className="flex flex-col gap-3">
                {PROVENANCE_SOURCES.map((src, i) => (
                  <div
                    key={src.document}
                    className="trust-slide-in flex items-start gap-3 border-b border-border/40 py-3 last:border-b-0"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={File01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex min-w-0 items-baseline gap-2">
                        <span className="truncate text-sm font-medium">
                          {src.document}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {src.type}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {src.section}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress
                          value={src.confidence * 100}
                          className="flex-1"
                        />
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {(src.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chain */}
            {provCtrl.chain && (
              <div className="flex flex-col gap-0">
                {PROVENANCE_CHAIN.map((node, i) => (
                  <div key={node.step}>
                    <div
                      className="trust-slide-in flex items-start gap-3"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                          {i + 1}
                        </div>
                        {i < PROVENANCE_CHAIN.length - 1 && (
                          <div className="my-1 h-6 w-px bg-border/60" />
                        )}
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                            {node.step}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ·
                          </span>
                          <span className="text-xs font-medium">
                            {node.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {node.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  className="trust-fade-in mt-3 flex items-center gap-2"
                  style={{ animationDelay: "400ms" }}
                >
                  <HugeiconsIcon
                    icon={LinkSquare01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    Full chain: 4 steps from source to conclusion
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}
