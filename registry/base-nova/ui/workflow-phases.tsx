"use client"

import { cn } from "@/lib/utils"
import { StatusIndicator } from "@/components/ui/status-indicator"
import type { StatusIndicatorStatus } from "@/components/ui/status-indicator"

/* ──────────────────────────────────────────────────────────────────────── */
/*  Types                                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

export type PhaseStatus = "done" | "active" | "queued" | "failed"

export type WorkflowPhase = {
  id: string
  title: string
  status: PhaseStatus
  /** Number of agents in this phase */
  agentCount?: number
  /** Formatted token count, e.g. "12,450" */
  tokens?: string
  /** Formatted elapsed duration, e.g. "3:24" */
  elapsed?: string
}

type WorkflowPhasesProps = {
  phases: WorkflowPhase[]
  /** Currently selected phase id — controls the fleet table below */
  activePhaseId?: string | null
  onPhaseSelect?: (phaseId: string | null) => void
  className?: string
  "aria-label"?: string
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Status mapping                                                         */
/* ──────────────────────────────────────────────────────────────────────── */

function phaseToIndicatorStatus(status: PhaseStatus): StatusIndicatorStatus {
  switch (status) {
    case "done":
      return "complete"
    case "active":
      return "active"
    case "queued":
      return "pending"
    case "failed":
      return "error"
  }
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Phase button                                                           */
/* ──────────────────────────────────────────────────────────────────────── */

function PhaseButton({
  phase,
  isSelected,
  onSelect,
  isLast,
}: {
  phase: WorkflowPhase
  isSelected: boolean
  onSelect: () => void
  isLast: boolean
}) {
  const indicatorStatus = phaseToIndicatorStatus(phase.status)
  const isActive = phase.status === "active"
  const isFailed = phase.status === "failed"

  return (
    <div className="relative flex min-w-0 flex-1 items-center">
      <button
        type="button"
        data-compact-touch
        data-slot="workflow-phase-button"
        aria-current={isActive ? "step" : undefined}
        aria-pressed={isSelected}
        onClick={onSelect}
        className={cn(
          "group/phase relative flex min-h-[44px] w-full min-w-0 flex-col items-start gap-1 rounded-md px-3 py-2 text-left transition-colors duration-150",
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          "hover:bg-muted/50",
          isSelected && "bg-foreground/[0.04]",
          isFailed && "bg-destructive/5 hover:bg-destructive/8"
        )}
      >
        {/* Status + title row */}
        <div className="flex w-full min-w-0 items-center gap-2">
          {/* Active phase: ambient pulse dot; others: static StatusIndicator */}
          {isActive ? (
            <span className="relative flex size-5 shrink-0 items-center justify-center">
              <span
                className="wf-phase-pulse absolute size-2 rounded-full bg-foreground/70"
                aria-hidden="true"
              />
              <span className="sr-only">Active</span>
            </span>
          ) : (
            <StatusIndicator
              status={indicatorStatus}
              label={
                phase.status === "done"
                  ? "Done"
                  : phase.status === "queued"
                    ? "Queued"
                    : "Failed"
              }
            />
          )}
          <span
            className={cn(
              "min-w-0 truncate text-sm leading-snug font-medium",
              phase.status === "queued" && "text-muted-foreground",
              isFailed && "text-destructive"
            )}
          >
            {phase.title}
          </span>
        </div>

        {/* Roll-up metadata */}
        {(phase.agentCount !== undefined || phase.tokens || phase.elapsed) && (
          <p
            className={cn(
              "pl-7 text-[11px] leading-none tabular-nums",
              phase.status === "queued"
                ? "text-muted-foreground/60"
                : "text-muted-foreground"
            )}
          >
            {[
              phase.agentCount !== undefined
                ? `${phase.agentCount} agent${phase.agentCount === 1 ? "" : "s"}`
                : null,
              phase.tokens ? `${phase.tokens} tokens` : null,
              phase.elapsed ?? null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </button>

      {/* Connector between phases */}
      {!isLast && (
        <span
          className="mx-1 h-px w-4 shrink-0 bg-border/60"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  WorkflowPhases                                                        */
/* ──────────────────────────────────────────────────────────────────────── */

function WorkflowPhases({
  phases,
  activePhaseId,
  onPhaseSelect,
  className,
  "aria-label": ariaLabel = "Workflow phases",
}: WorkflowPhasesProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="workflow-phases"
      className={cn("flex min-w-0 items-stretch overflow-x-auto", className)}
    >
      {phases.map((phase, i) => (
        <PhaseButton
          key={phase.id}
          phase={phase}
          isSelected={activePhaseId === phase.id}
          onSelect={() => {
            if (onPhaseSelect) {
              onPhaseSelect(activePhaseId === phase.id ? null : phase.id)
            }
          }}
          isLast={i === phases.length - 1}
        />
      ))}
    </div>
  )
}

export { WorkflowPhases, type WorkflowPhasesProps }
