"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  Edit01Icon,
  Clock01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

const FEEDBACK_HISTORY = [
  {
    id: "fb-1",
    timestamp: "2026-03-14 · 14:32",
    message:
      "The project brief defines 23 requirements across 5 classes. Implementation notes summarize the workflow behavior and open dependencies.",
    type: "positive" as const,
    detail:
      "Accurate requirement count and implementation notes description confirmed against Brief v3.",
  },
  {
    id: "fb-2",
    timestamp: "2026-03-14 · 11:07",
    message:
      "The launch readiness plan requires dedicated support plan for issue triage procedures.",
    type: "correction" as const,
    detail:
      "Corrected dedicated support plan → standard support plan. enterprise release does not require dedicated support coverage.",
  },
  {
    id: "fb-3",
    timestamp: "2026-03-13 · 16:45",
    message:
      "I've mapped each requirement to its corresponding test case in the review plan. Coverage is at 91.3%.",
    type: "negative" as const,
    detail:
      "Fallback behavior and Cleanup behavior were missing from the mapping. Coverage was overstated.",
  },
  {
    id: "fb-4",
    timestamp: "2026-03-13 · 09:20",
    message:
      "Release QA is complete. All functional tests for the export service passed.",
    type: "positive" as const,
    detail: "Test results verified against release QA checklist.",
  },
  {
    id: "fb-5",
    timestamp: "2026-03-12 · 15:10",
    message:
      "The product boundary includes the billing integration and its configuration up to version 2.4.",
    type: "correction" as const,
    detail:
      "Corrected configuration scope: boundary extends to v2.4.1 per the latest ST addendum.",
  },
]

export function FeedbackHistorySection() {
  const [historyState, setHistoryState] = useState<Record<string, boolean>>({
    recent: true,
    all: false,
  })
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const handleHistoryToggle = useCallback((key: string) => {
    setHistoryState(() => {
      const next: Record<string, boolean> = { recent: false, all: false }
      next[key] = true
      return next
    })
    setExpandedRow(null)
  }, [])

  const visibleHistory = historyState.all
    ? FEEDBACK_HISTORY
    : FEEDBACK_HISTORY.slice(0, 3)

  return (
    <section id="feedback-history" className="page-section">
      <p className="section-label mb-3">Record</p>
      <h2 className="text-xl font-semibold tracking-tight">Feedback History</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        A running log of all reviewer feedback — positive signals, negative
        signals, and corrections. Provides an audit trail and training reference
        for the agent.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "recent", label: "Recent" },
            { key: "all", label: "All" },
          ]}
          active={historyState}
          onToggle={handleHistoryToggle}
        />

        <div className="rounded-lg border border-border/40 p-4 sm:p-6">
          <div className="flex flex-col gap-0">
            {visibleHistory.map((entry, i) => {
              const isExpanded = expandedRow === entry.id
              return (
                <div
                  key={entry.id}
                  className={
                    i < visibleHistory.length - 1
                      ? "border-b border-border/40"
                      : ""
                  }
                >
                  <button
                    type="button"
                    aria-label={`Toggle feedback history entry: ${entry.message}`}
                    onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
                    className="flex w-full items-start gap-3 rounded-md px-2 py-3 text-left transition-colors outline-none hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {/* Type indicator */}
                    <span
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                        entry.type === "positive"
                          ? "bg-foreground/[0.04]"
                          : entry.type === "negative"
                            ? "bg-foreground/[0.04]"
                            : "bg-foreground/[0.04]"
                      }`}
                    >
                      {entry.type === "positive" ? (
                        <HugeiconsIcon
                          icon={ThumbsUpIcon}
                          size={11}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      ) : entry.type === "negative" ? (
                        <HugeiconsIcon
                          icon={ThumbsDownIcon}
                          size={11}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={Edit01Icon}
                          size={11}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      )}
                    </span>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground/70">
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            size={10}
                            strokeWidth={1.5}
                            className="mr-1 inline"
                          />
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-foreground/80">
                        {entry.message}
                      </p>
                    </div>

                    {/* Expand arrow */}
                    <HugeiconsIcon
                      icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="mt-1.5 shrink-0 text-muted-foreground/70"
                    />
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="feedback-expand mb-3 ml-8 px-2">
                      <div className="feedback-slide-in border-l border-border/60 bg-foreground/[0.01] py-2 pl-3">
                        <p className="text-sm text-muted-foreground">
                          {entry.detail}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {historyState.recent && (
            <div className="mt-3 flex flex-col gap-3">
              <Separator />
              <Button
                type="button"
                onClick={() => handleHistoryToggle("all")}
                variant="ghost"
                size="xs"
                className="w-fit text-muted-foreground/70 hover:text-muted-foreground"
              >
                Show all {FEEDBACK_HISTORY.length} entries
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Column
            </TableHead>
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Content
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Notes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Type",
              "Positive / Negative / Correction",
              "Icon-coded, monochrome",
            ],
            [
              "Timestamp",
              "Date and time of feedback",
              "Sorted most recent first",
            ],
            [
              "Message",
              "Excerpt of the rated agent response",
              "Truncated to one line, full text on expand",
            ],
            [
              "Detail",
              "Reviewer's note or correction text",
              "Visible only when row is expanded",
            ],
          ].map(([col, content, notes], i) => (
            <TableRow
              key={col}
              className={i < 3 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-2.5 pr-6 font-medium">{col}</TableCell>
              <TableCell className="py-2.5 pr-6 text-muted-foreground">
                {content}
              </TableCell>
              <TableCell className="py-2.5 text-muted-foreground">
                {notes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </section>
  )
}
