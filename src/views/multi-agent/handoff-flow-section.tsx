"use client"

import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { HandoffPacket } from "@/components/ui/handoff-packet"
import { StatusIndicator } from "@/components/ui/status-indicator"
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

const HANDOFF_STEPS = [
  { label: "Parse project brief", agent: "Document Drafter" },
  { label: "Map requirement coverage", agent: "Requirements Mapper" },
  { label: "Generate review report", agent: "Report Generator" },
]

const HANDOFF_PACKET_ITEMS = [
  {
    label: "Payload",
    value:
      "Requirement coverage delta for Export workflow, including missing JSON export support.",
  },
  {
    label: "Source basis",
    value: "Project brief v3, Launch Policy v2, Support readiness checklist",
  },
  {
    label: "Receiver action",
    value:
      "Confirm whether Document Drafter should update implementation notes section 6.1.3.",
  },
  {
    label: "Recovery",
    value:
      "Rejecting the packet keeps the run blocked and asks Source Collector to gather more evidence.",
  },
]

export function HandoffFlowSection() {
  const [handoffCtrl, handoffAnim, toggleHandoff] = useExclusiveToggle({
    pending: true,
    inprogress: false,
    complete: false,
  })
  const activeHandoff = handoffCtrl.pending
    ? "pending"
    : handoffCtrl.inprogress
      ? "inprogress"
      : "complete"

  return (
    <section id="handoff-flow" className="page-section">
      <p className="section-label mb-3">Orchestration</p>
      <h2 className="text-xl font-semibold tracking-tight">Handoff Flow</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Sequential task handoff between agents. Each step produces output that
        becomes input for the next agent in the pipeline.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "pending", label: "Pending" },
            { key: "inprogress", label: "In Progress" },
            { key: "complete", label: "Complete" },
          ]}
          active={handoffCtrl}
          onToggle={toggleHandoff}
        />

        <HandoffPacket
          className="mb-5"
          sender="Requirements Mapper"
          receiver="Document Drafter"
          title="Export workflow coverage packet"
          description="Ownership transfer for a requirement gap that must be resolved before the review report can be finalized."
          status={
            activeHandoff === "complete"
              ? "accepted"
              : activeHandoff === "inprogress"
                ? "sent"
                : "draft"
          }
          items={HANDOFF_PACKET_ITEMS}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={handoffAnim}
        >
          <div className="ma-slide-in flex flex-col items-stretch gap-0 sm:flex-row sm:items-center sm:justify-center">
            {HANDOFF_STEPS.map((step, i) => {
              let stepState: "pending" | "active" | "complete" = "pending"
              if (activeHandoff === "pending") {
                stepState = i === 0 ? "active" : "pending"
              } else if (activeHandoff === "inprogress") {
                if (i === 0) stepState = "complete"
                else if (i === 1) stepState = "active"
                else stepState = "pending"
              } else {
                stepState = "complete"
              }

              return (
                <div
                  key={step.label}
                  className="flex flex-col items-stretch sm:flex-row sm:items-center"
                >
                  <div
                    className={`flex w-full flex-col items-center gap-2 border-l-2 px-4 py-3 transition-colors duration-200 sm:w-48 sm:border-t-2 sm:border-l-0 ${
                      stepState === "complete"
                        ? "border-foreground/25 bg-foreground/[0.03]"
                        : stepState === "active"
                          ? "border-foreground/15 bg-foreground/[0.02]"
                          : "border-border/40 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <StatusIndicator
                        status={stepState}
                        label={
                          stepState === "complete"
                            ? "Completed step"
                            : stepState === "active"
                              ? "Active step"
                              : "Pending step"
                        }
                      />
                      <span className="text-[10px] text-muted-foreground">
                        Step {i + 1}
                      </span>
                    </div>
                    <p className="text-center text-xs leading-snug">
                      {step.label}
                    </p>
                    <p className="text-center text-[10px] text-muted-foreground">
                      {step.agent}
                    </p>
                  </div>
                  {i < HANDOFF_STEPS.length - 1 && (
                    <div className="flex justify-center py-2 sm:px-2 sm:py-0">
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className={`rotate-90 transition-[color,transform] duration-200 sm:rotate-0 ${
                          activeHandoff === "complete" ||
                          (activeHandoff === "inprogress" && i === 0)
                            ? "text-foreground/50"
                            : "text-muted-foreground/50"
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
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
              Step cards
            </TableCell>
            <TableCell className="py-3">
              Responsive step cards with step number, task label, and assigned
              agent
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Connectors
            </TableCell>
            <TableCell className="py-3">
              Arrow icons between steps, opacity reflects whether handoff has
              occurred
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Pending state
            </TableCell>
            <TableCell className="py-3">
              First step highlighted, remaining steps gently muted
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Complete state
            </TableCell>
            <TableCell className="py-3">
              All steps show tick icon with subtle background tint
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Handoff flows model the sequential dependencies in complex review
        workflows — a project brief must be parsed before requirement coverage
        can be mapped, and coverage must be mapped before the review report can
        be generated. Each handoff creates an auditable transition record.
      </div>
    </section>
  )
}
