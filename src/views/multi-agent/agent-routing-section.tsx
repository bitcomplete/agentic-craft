"use client"

import { useState } from "react"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Brain01Icon,
  Route01Icon,
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

const ROUTING_AGENTS = [
  "Requirements Mapper",
  "Source Collector",
  "Policy Analyst",
]

export function AgentRoutingSection() {
  const [routeCtrl, routeAnim, toggleRoute] = useExclusiveToggle({
    auto: true,
    manual: false,
  })
  const activeRoute = routeCtrl.auto ? "auto" : "manual"
  const [manualSelection, setManualSelection] = useState<string | null>(null)

  return (
    <section id="agent-routing" className="page-section">
      <p className="section-label mb-3">Dispatch</p>
      <h2 className="text-xl font-semibold tracking-tight">Agent Routing</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Routing incoming tasks to the most appropriate agent based on task type
        analysis or manual selection by the workflow owner.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "auto", label: "Auto" },
            { key: "manual", label: "Manual" },
          ]}
          active={routeCtrl}
          onToggle={(key) => {
            toggleRoute(key)
            setManualSelection(null)
          }}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={routeAnim}
        >
          <div className="ma-slide-in flex flex-col gap-5">
            {/* Incoming task */}
            <div className="border-l border-border/60 py-3 pl-4">
              <div className="mb-2 flex items-center gap-2">
                <HugeiconsIcon
                  icon={Route01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <span className="text-[10px] text-muted-foreground">
                  Incoming task
                </span>
              </div>
              <p className="text-sm">
                Review Export workflow export requirements
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Task type: requirements review
              </p>
            </div>

            {/* Routing arrow */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="px-2 text-[10px] text-muted-foreground">
                {activeRoute === "auto"
                  ? "Auto-routed by task type"
                  : "Select destination agent"}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Agent options */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ROUTING_AGENTS.map((agentName) => {
                const isSelected =
                  activeRoute === "auto"
                    ? agentName === "Requirements Mapper"
                    : manualSelection === agentName

                return (
                  <button
                    key={agentName}
                    type="button"
                    aria-label={`Route task to ${agentName}`}
                    onClick={() => {
                      if (activeRoute === "manual") {
                        setManualSelection(agentName)
                      }
                    }}
                    className={`rounded-md p-3 text-left transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                      isSelected
                        ? "bg-foreground/[0.06] text-foreground"
                        : activeRoute === "manual"
                          ? "cursor-pointer hover:bg-foreground/[0.03]"
                          : "opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon
                          icon={Brain01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </div>
                      <span className="min-w-0 text-xs leading-snug">
                        {agentName}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={10}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {activeRoute === "auto"
                            ? "Best match — requirement expertise"
                            : "Selected"}
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
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
              Task card
            </TableCell>
            <TableCell className="py-3">
              Shows incoming task with detected type classification
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Auto routing
            </TableCell>
            <TableCell className="py-3">
              Best-match agent highlighted, others dimmed at 40% opacity
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Manual routing
            </TableCell>
            <TableCell className="py-3">
              All agents interactive, click to select destination
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Selection indicator
            </TableCell>
            <TableCell className="py-3">
              Arrow icon with context label ("Best match" or "Selected")
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Routing decisions in regulated workflows must be transparent and
        auditable. Auto-routing uses task type classification to match
        requirement-related tasks to the Requirements Mapper, source tasks to
        the Source Collector, and policy tasks to the Policy Analyst. Manual
        override ensures the reviewer retains final authority over agent
        assignments.
      </div>
    </section>
  )
}
