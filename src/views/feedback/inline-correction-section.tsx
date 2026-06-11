"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AGENT_PROSE_COLOR } from "./data"

export function InlineCorrectionSection() {
  const [corrState, setCorrState] = useState<Record<string, boolean>>({
    original: true,
    corrected: false,
  })

  const handleCorrToggle = useCallback((key: string) => {
    setCorrState(() => {
      const next: Record<string, boolean> = {
        original: false,
        corrected: false,
      }
      next[key] = true
      return next
    })
  }, [])

  return (
    <section id="inline-correction" className="page-section">
      <p className="section-label mb-3">Editing</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Inline Correction
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Direct editing of agent prose when a specific factual error is
        identified — typically an incorrect launch plan reference or misquoted
        launch requirement.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "original", label: "Original" },
            { key: "corrected", label: "Corrected" },
          ]}
          active={corrState}
          onToggle={handleCorrToggle}
        />

        <div className="rounded-lg border border-border/40 p-4 sm:p-6">
          <div>
            {corrState.original ? (
              <p
                className="agent-prose text-base"
                style={{ color: AGENT_PROSE_COLOR }}
              >
                The launch readiness plan requires{" "}
                <span className="relative inline-flex items-baseline gap-1.5">
                  <span className="rounded-md bg-foreground/[0.06] px-1">
                    dedicated support plan
                  </span>
                  <Button
                    type="button"
                    onClick={() => handleCorrToggle("corrected")}
                    variant="outline"
                    size="xs"
                  >
                    <HugeiconsIcon
                      icon={Edit01Icon}
                      strokeWidth={1.5}
                      data-icon="inline-start"
                    />
                    Fix this
                  </Button>
                </span>{" "}
                for issue triage procedures. This pattern ensures that the team
                has an explicit process to track and correct issues reported by
                users.
              </p>
            ) : (
              <div className="feedback-fade-in">
                <p
                  className="agent-prose text-base"
                  style={{ color: AGENT_PROSE_COLOR }}
                >
                  The launch readiness plan requires{" "}
                  <span className="feedback-highlight-in rounded-md px-1">
                    standard support plan
                  </span>{" "}
                  for issue triage procedures. This pattern ensures that the
                  team has an explicit process to track and correct issues
                  reported by users.
                </p>
                <div className="feedback-slide-in mt-3 flex items-center gap-2">
                  <Badge variant="outline">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      strokeWidth={1.5}
                      data-icon="inline-start"
                    />
                    Applied
                  </Badge>
                  <span className="text-xs text-muted-foreground/70">
                    dedicated support plan → standard support plan
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              State
            </TableHead>
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Visual
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Behavior
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Original",
              "Error text with subtle highlight + edit button",
              "Clicking the edit button transitions to corrected state",
            ],
            [
              "Corrected",
              "Replacement text with green-tinted highlight",
              "Applied tag appears with before → after summary",
            ],
          ].map(([state, visual, behavior], i) => (
            <TableRow
              key={state}
              className={i < 1 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-2.5 pr-6 font-medium">{state}</TableCell>
              <TableCell className="py-2.5 pr-6 text-muted-foreground">
                {visual}
              </TableCell>
              <TableCell className="py-2.5 text-muted-foreground">
                {behavior}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Inline corrections are scoped to specific factual errors — typically
        launch plan misreferences or incorrect readiness level claims. The
        correction is applied in-place so the reviewer sees the fix in context
        rather than receiving a full regeneration.
      </div>
    </section>
  )
}
