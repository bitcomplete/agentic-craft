"use client"

import { useState } from "react"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"
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

const ERROR_LIST = [
  {
    time: "11:32 AM",
    severity: "warning" as const,
    title: "Document repository timeout",
    detail:
      "Connection to the review team document repository timed out after 30s while fetching implementation notes source package. Retried successfully on second attempt.",
  },
  {
    time: "10:15 AM",
    severity: "error" as const,
    title: "release governance conformity statement generation failed",
    detail:
      "Missing required field: product boundary description. The Project brief v3 does not include a compliant boundary diagram per release governance Annex I, Section 2.",
  },
  {
    time: "09:48 AM",
    severity: "warning" as const,
    title: "Rate limit approached",
    detail:
      "Token usage reached 85% of the daily budget during the risk scan batch. Subsequent requests were throttled to stay within limits.",
  },
]

export function ErrorLogSection() {
  const [errCtrl, errAnim, toggleErr] = useExclusiveToggle({
    empty: true,
    withErrors: false,
  })

  const errCtrlMap = errCtrl as Record<string, boolean>
  const activeErr = Object.keys(errCtrl).find((k) => errCtrlMap[k]) || "empty"

  const [expandedErr, setExpandedErr] = useState<number | null>(null)

  return (
    <section id="error-log" className="page-section">
      <p className="section-label mb-3">Diagnostics</p>
      <h2 className="text-xl font-semibold tracking-tight">Error Log</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        A filterable log of errors, warnings, and operational anomalies from the
        current review session with expandable detail views.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "empty", label: "Empty" },
            { key: "withErrors", label: "With Errors" },
          ]}
          active={errCtrl}
          onToggle={toggleErr}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={errAnim}
        >
          {activeErr === "empty" ? (
            <div className="mon-slide-in flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={18}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
              </div>
              <p className="text-sm font-medium">
                No errors in current session
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                All agent operations completed successfully since session start.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {ERROR_LIST.map((err, i) => (
                <div
                  key={i}
                  className="mon-slide-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <button
                    type="button"
                    aria-label={`Toggle error details: ${err.title}`}
                    aria-expanded={expandedErr === i}
                    onClick={() => setExpandedErr(expandedErr === i ? null : i)}
                    className="flex w-full items-start gap-3 py-3 text-left transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <div className="mt-0.5 shrink-0">
                      <HugeiconsIcon
                        icon={
                          err.severity === "error" ? Cancel01Icon : Alert01Icon
                        }
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{err.title}</p>
                        <Badge variant="secondary">{err.severity}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {err.time}
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className={`mt-1 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none ${
                        expandedErr === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedErr === i && (
                    <div className="mon-expand px-4 py-3">
                      <Separator className="mb-3" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {err.detail}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border text-left">
            <TableHead className="pr-6 pb-3 text-xs font-medium text-muted-foreground">
              Element
            </TableHead>
            <TableHead className="pb-3 text-xs font-medium text-muted-foreground">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Empty state
            </TableCell>
            <TableCell className="py-3">
              Centered check icon with "No errors" message and subtitle
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Error entries
            </TableCell>
            <TableCell className="py-3">
              Clickable rows with severity badge, timestamp, and expand/collapse
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Severity levels
            </TableCell>
            <TableCell className="py-3">
              Warning and Error — shown as muted chip badges, no colors
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Expanded detail
            </TableCell>
            <TableCell className="py-3">
              Animated expand with full error description and context
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        The error log provides the diagnostic transparency that activity review
        requires — reviewers can inspect every operational anomaly, understand
        its context, and verify that the agent's error handling meets the
        product's claimed readiness level.
      </div>
    </section>
  )
}
