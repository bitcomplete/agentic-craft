"use client"

import { useState } from "react"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

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
            <div className="mon-slide-in py-3">
              <p className="text-xs text-muted-foreground">
                No anomalies since session start · 11:32 AM
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {ERROR_LIST.map((err, i) => {
                const isOpen = expandedErr === i
                return (
                  <Collapsible
                    key={i}
                    open={isOpen}
                    onOpenChange={(open) => setExpandedErr(open ? i : null)}
                    className="mon-slide-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <CollapsibleTrigger
                      aria-label={`Toggle error details: ${err.title}`}
                      className="flex w-full items-start gap-3 py-3 text-left transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <div className="mt-0.5 shrink-0">
                        <HugeiconsIcon
                          icon={
                            err.severity === "error"
                              ? Cancel01Icon
                              : Alert01Icon
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
                        className={cn(
                          "mt-1 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
                          isOpen && "rotate-180"
                        )}
                      />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mon-expand px-4 py-3">
                      <Separator className="mb-3" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {err.detail}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
