"use client"

import { useState, useCallback, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Alert01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const DECISION_OPTIONS = [
  {
    title: "Flag as finding",
    desc: "Add to the open findings list for reviewer approval in the next review meeting.",
    consequence:
      "Impact: Adds 1 open finding to the launch summary. Requires team response within 10 days.",
    // Escalates to people — strongest accent of the three.
    accent: "border-foreground/40",
  },
  {
    title: "Request source material",
    desc: "Send an automated source request to the developer with a 5-day deadline.",
    consequence:
      "Impact: Review paused for Timestamp handling pending team response.",
    accent: "border-foreground/20",
  },
  {
    title: "Mark for later",
    desc: "Add to the deferred items list for the next review cycle.",
    consequence:
      "Impact: No immediate delay. Risk carried forward to next cycle.",
    accent: "border-muted-foreground/15",
  },
]

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function DecisionsSection() {
  const [decisionState, setDecisionState] = useState({
    pending: true,
    resolved: false,
  })
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const resolvedSummaryRef = useRef<HTMLDivElement>(null)

  const toggleDecisionControl = useCallback((key: string) => {
    if (key === "pending") {
      setDecisionState({ pending: true, resolved: false })
      setSelectedOption(null)
    } else {
      setDecisionState({ pending: false, resolved: true })
      setSelectedOption(1)
    }
  }, [])

  return (
    <section id="decisions" className="page-section">
      <p className="section-label mb-3">Decisions</p>
      <h2 className="text-xl font-semibold tracking-tight">Decision Flow</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        When the agent needs the user to choose between options that have
        different consequences. Each option shows what will happen if selected.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "pending", label: "Pending" },
            { key: "resolved", label: "Resolved" },
          ]}
          active={decisionState}
          onToggle={toggleDecisionControl}
        />

        <div className="flex flex-col gap-3 rounded-lg border border-border/40 p-4 sm:p-6">
          <div className="flex items-start gap-2">
            <HugeiconsIcon
              icon={Alert01Icon}
              size={14}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />
            <p className="text-sm">
              How should I handle the missing audit log entries for Timestamp
              handling?
            </p>
          </div>

          {decisionState.pending ? (
            <div className="flex flex-col gap-2">
              {DECISION_OPTIONS.map((opt, i) => (
                <button
                  key={opt.title}
                  type="button"
                  aria-label={`Choose decision option: ${opt.title}`}
                  onClick={() => {
                    setSelectedOption(i)
                    setDecisionState({ pending: false, resolved: true })
                    requestAnimationFrame(() =>
                      resolvedSummaryRef.current?.focus()
                    )
                  }}
                  className={`w-full rounded-md px-3 py-2.5 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                    selectedOption === i ? "bg-primary/5" : "hover:bg-accent"
                  }`}
                >
                  <span className="text-sm font-medium">{opt.title}</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {opt.desc}
                  </p>
                  <div className={`mt-2 border-l-2 py-1 pl-2.5 ${opt.accent}`}>
                    <div className="flex items-start gap-1.5">
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={11}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-muted-foreground"
                      />
                      <span className="text-[11px] text-muted-foreground">
                        {opt.consequence}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              ref={resolvedSummaryRef}
              tabIndex={-1}
              className="actions-fade-in flex flex-col gap-3"
            >
              {selectedOption !== null && (
                <div className="border-l border-primary bg-primary/5 py-2 pl-3">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="shrink-0 text-muted-foreground"
                    />
                    <span className="text-sm font-medium">
                      {DECISION_OPTIONS[selectedOption].title}
                    </span>
                  </div>
                  <p className="mt-1 pl-[22px] text-xs text-muted-foreground">
                    {DECISION_OPTIONS[selectedOption].desc}
                  </p>
                </div>
              )}
              <div
                role="status"
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={12}
                  strokeWidth={1.5}
                  className="shrink-0"
                />
                <span>
                  Decision confirmed — proceeding with selected action
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Pattern
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Spec
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Pending state",
              "All options clickable with hover effect and consequence preview",
            ],
            [
              "Resolved state",
              "Selected option highlighted, others hidden, confirmation shown",
            ],
            [
              "Selected card",
              "Primary border + subtle primary background tint",
            ],
            [
              "Consequence previews",
              "Border-left callout with arrow indicator inside each option",
            ],
            [
              "Auto-selection",
              "Never auto-select — always wait for explicit user choice",
            ],
          ].map(([pat, spec], i, arr) => (
            <TableRow
              key={pat}
              className={i < arr.length - 1 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-3 pr-6 font-medium">{pat}</TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {spec}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Decisions are the highest-trust pattern in the system — they grant the
        user explicit control over how the agent proceeds. Never bypass them
        with auto-selection or hidden defaults.
      </p>
    </section>
  )
}
