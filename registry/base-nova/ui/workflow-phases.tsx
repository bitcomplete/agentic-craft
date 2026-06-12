"use client"

import { cn } from "@/lib/utils"
import { StatusIndicator } from "@/components/ui/status-indicator"
import type { StatusIndicatorStatus } from "@/components/ui/status-indicator"

/* ──────────────────────────────────────────────────────────────────────── */
/*  Types                                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

export type PhaseStatus = "done" | "active" | "queued" | "failed"

/** Per-agent status for the fleet-dot minimap on a phase row */
export type WorkflowAgentDot = "done" | "running" | "queued" | "failed"

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
  /** One entry per agent — renders the fleet-dot minimap and done/total count */
  agentDots?: WorkflowAgentDot[]
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
/*  Glyph + fleet dots                                                     */
/* ──────────────────────────────────────────────────────────────────────── */

/** The phase status glyph — the active phase carries the page's only
    ambient loop; everything else is a static StatusIndicator */
function WorkflowPhaseGlyph({ status }: { status: PhaseStatus }) {
  if (status === "active") {
    return (
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <span
          className="wf-phase-pulse absolute size-2 rounded-full bg-foreground/70"
          aria-hidden="true"
        />
        <span className="sr-only">Active</span>
      </span>
    )
  }
  return (
    <StatusIndicator
      status={phaseToIndicatorStatus(status)}
      label={
        status === "done" ? "Done" : status === "queued" ? "Queued" : "Failed"
      }
    />
  )
}

function PhaseDots({ dots }: { dots: WorkflowAgentDot[] }) {
  return (
    <span className="flex shrink-0 items-center gap-[3px]" aria-hidden="true">
      {dots.map((dot, i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            dot === "done" && "bg-foreground/75",
            dot === "running" && "bg-foreground/35",
            dot === "failed" && "bg-destructive",
            dot === "queued" && "border border-muted-foreground/50"
          )}
        />
      ))}
    </span>
  )
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Phase row                                                              */
/* ──────────────────────────────────────────────────────────────────────── */

function PhaseRow({
  phase,
  index,
  isSelected,
  isCurrent,
  onSelect,
}: {
  phase: WorkflowPhase
  index: number
  isSelected: boolean
  /** Carries aria-current="step" — at most one phase, even when a pipelined
      run holds several active phases at once */
  isCurrent: boolean
  onSelect: () => void
}) {
  const isFailed = phase.status === "failed"

  const metaGroups = [
    phase.agentCount !== undefined
      ? `${phase.agentCount} agent${phase.agentCount === 1 ? "" : "s"}`
      : null,
    phase.tokens ? `${phase.tokens} tokens` : null,
    phase.elapsed ?? null,
  ].filter((group): group is string => group !== null)

  const doneCount = phase.agentDots?.filter((dot) => dot === "done").length

  return (
    <button
      type="button"
      data-compact-touch
      data-slot="workflow-phase-button"
      aria-current={isCurrent ? "step" : undefined}
      aria-pressed={isSelected}
      onClick={onSelect}
      className={cn(
        "flex min-h-[44px] w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors duration-150",
        "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        "hover:bg-muted/50",
        isSelected && "bg-foreground/[0.04]",
        isFailed && "bg-destructive/5 hover:bg-destructive/8"
      )}
    >
      <span className="w-3 shrink-0 pt-0.5 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
        {index + 1}
      </span>
      <span className="mt-0.5">
        <WorkflowPhaseGlyph status={phase.status} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "block truncate text-sm leading-snug font-medium",
              phase.status === "queued" && "text-muted-foreground",
              isFailed && "text-destructive"
            )}
          >
            {phase.title}
          </span>
          {phase.agentDots && phase.agentDots.length > 0 && (
            <span className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {doneCount}/{phase.agentDots.length}
              </span>
              <PhaseDots dots={phase.agentDots} />
            </span>
          )}
        </span>

        {/* Roll-up metadata — separator stays attached to the preceding group
            so narrow containers wrap between groups, never mid-pair */}
        {metaGroups.length > 0 && (
          <span className="block text-[11px] leading-4 text-muted-foreground tabular-nums">
            {metaGroups.map((group, gi) => [
              gi > 0 ? " " : null,
              <span key={group} className="whitespace-nowrap">
                {group}
                {gi < metaGroups.length - 1 ? " ·" : null}
              </span>,
            ])}
          </span>
        )}
      </span>
    </button>
  )
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  WorkflowPhases                                                        */
/* ──────────────────────────────────────────────────────────────────────── */

/** Humanized phase list — runs render as numbered phases with fleet-dot
    minimaps, the way Claude's own surfaces draw them; the orchestration
    script never appears here (keep it one disclosure away) */
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
      className={cn("flex min-w-0 flex-col gap-0.5", className)}
    >
      {phases.map((phase, i) => (
        <PhaseRow
          key={phase.id}
          phase={phase}
          index={i}
          isSelected={activePhaseId === phase.id}
          isCurrent={phase.id === phases.find((p) => p.status === "active")?.id}
          onSelect={() => {
            if (onPhaseSelect) {
              onPhaseSelect(activePhaseId === phase.id ? null : phase.id)
            }
          }}
        />
      ))}
    </div>
  )
}

export { WorkflowPhases, WorkflowPhaseGlyph, type WorkflowPhasesProps }
