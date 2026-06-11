"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AUDIT_ENTRIES = [
  {
    time: "14:02:11",
    action: "Opened Project brief v3",
    user: "Agent",
    outcome: "Loaded 23 requirement definitions",
    source: "Project-Brief-v3.pdf",
  },
  {
    time: "14:02:14",
    action: "Cross-referenced Export workflow QA notes",
    user: "Agent",
    outcome: "3 of 4 checks passed",
    source: "QA Notes 2026-003, §4.2",
  },
  {
    time: "14:02:18",
    action: "Flagged Export workflow for reviewer approval",
    user: "Agent",
    outcome: "Added to OR agenda item #7",
    source: "Review-Agenda-2026-03.docx",
  },
  {
    time: "14:02:22",
    action: "Reviewer approved finding classification",
    user: "Morgan Lee (review team)",
    outcome: "Finding confirmed as minor",
    source: "Launch-Review-2026-v2.pdf, §6.1",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AuditTrailSection() {
  const [auditCtrl, auditAnimKey, auditToggle] = useExclusiveToggle({
    summary: true,
    detailed: false,
  })

  return (
    <section id="audit-trail" className="page-section">
      <p className="section-label mb-3">Accountability</p>
      <h2 className="text-xl font-semibold tracking-tight">Audit Trail</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Immutable log of all agent actions for requirements and review. Summary
        mode shows a compact timeline; detailed mode expands each entry with
        full context and source links.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "summary", label: "Summary" },
            { key: "detailed", label: "Detailed" },
          ]}
          active={auditCtrl}
          onToggle={auditToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={auditAnimKey}
        >
          <div className="trust-slide-in">
            {/* Summary */}
            {auditCtrl.summary && (
              <div className="flex flex-col gap-2">
                {AUDIT_ENTRIES.map((entry, i) => (
                  <div
                    key={entry.time}
                    className="trust-slide-in flex items-center gap-3"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                      {entry.time}
                    </span>
                    <div className="h-px flex-1 bg-border/40" />
                    <span className="text-sm">{entry.action}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed */}
            {auditCtrl.detailed && (
              <div className="flex flex-col gap-4">
                {AUDIT_ENTRIES.map((entry, i) => (
                  <div
                    key={entry.time}
                    className="trust-slide-in border-l border-border/60 py-2 pl-3"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                          {entry.time}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {entry.user}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.outcome}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={File01Icon}
                        size={11}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {entry.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}
