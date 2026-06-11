"use client"

import { useCallback, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon, File01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConfidenceDisplaySection() {
  const [confCtrl, confAnimKey, confToggle] = useExclusiveToggle({
    high: true,
    medium: false,
    low: false,
  })
  const [verifyClicked, setVerifyClicked] = useState(false)

  const handleConfToggle = useCallback(
    (key: string) => {
      confToggle(key)
      setVerifyClicked(false)
    },
    [confToggle]
  )

  return (
    <section id="confidence-display" className="page-section">
      <p className="section-label mb-3">Transparency</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Confidence Display
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        How the agent communicates its certainty level through language, visual
        cues, and actionable follow-ups.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "high", label: "High" },
            { key: "medium", label: "Medium" },
            { key: "low", label: "Low" },
          ]}
          active={confCtrl}
          onToggle={handleConfToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={confAnimKey}
        >
          <div className="trust-slide-in">
            {/* High confidence */}
            {confCtrl.high && (
              <div className="flex flex-col gap-4">
                <div className="mb-3 flex items-center justify-end gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-[var(--status-ok)]"
                  />
                  <span className="text-xs text-muted-foreground">
                    High confidence
                  </span>
                </div>
                <div
                  className="agent-prose"
                  style={{ color: "var(--foreground)" }}
                >
                  Export workflow requires CSV and JSON export encryption for
                  all data-at-rest operations. The product implements this
                  through the approved export service referenced by the
                  implementation notes.
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={File01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    Source: Project brief v3, §5.1.1
                  </span>
                </div>
              </div>
            )}

            {/* Medium confidence */}
            {confCtrl.medium && (
              <div className="flex flex-col gap-4">
                <div className="mb-3 flex items-center justify-end gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-[var(--status-warn)]"
                  />
                  <span className="text-xs text-muted-foreground">
                    Medium confidence
                  </span>
                </div>
                <div
                  className="agent-prose"
                  style={{ color: "var(--foreground)" }}
                >
                  Based on the available documentation, Timestamp handling
                  appears to rely on NTP synchronization for timestamp
                  generation — however, the project brief does not explicitly
                  confirm this mechanism. The QA notes reference "reliable
                  timestamps" without specifying the source.
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Alert01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    Qualified — based on indirect source material from QA Notes
                    2026-003
                  </span>
                </div>
              </div>
            )}

            {/* Low confidence */}
            {confCtrl.low && (
              <div className="flex flex-col gap-4">
                <div className="mb-3 flex items-center justify-end gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-[var(--destructive)]"
                  />
                  <span className="text-xs text-muted-foreground">
                    Low confidence
                  </span>
                </div>
                <div
                  className="agent-prose"
                  style={{ color: "var(--foreground)" }}
                >
                  I'm unable to determine whether the current risk review was
                  performed against the latest product version. The referenced
                  report predates the latest configuration update, and I could
                  not locate an updated risk analysis.
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <HugeiconsIcon
                    icon={Alert01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    Uncertain — key documents may be outdated or missing
                  </span>
                </div>
                <Button
                  onClick={() => setVerifyClicked(true)}
                  variant="outline"
                  size="xs"
                  className="mt-2"
                >
                  {verifyClicked ? (
                    <span role="status">
                      Verification request sent to reviewer
                    </span>
                  ) : (
                    "Request reviewer verification"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spec table */}
      <div className="mt-8">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Level
              </TableHead>
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Indicator
              </TableHead>
              <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Language pattern
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                High
              </TableCell>
              <TableCell className="py-2.5 pr-4">Green dot</TableCell>
              <TableCell className="py-2.5">
                Direct assertions with citations
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Medium
              </TableCell>
              <TableCell className="py-2.5 pr-4">Amber dot</TableCell>
              <TableCell className="py-2.5">
                Hedged language: "appears to," "based on"
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Low
              </TableCell>
              <TableCell className="py-2.5 pr-4">Red dot</TableCell>
              <TableCell className="py-2.5">
                Explicit uncertainty + verify action
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
