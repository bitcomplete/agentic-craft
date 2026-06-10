"use client"

import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert01Icon,
  Brain01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  AgentStatusTable,
  type AgentStatusRow,
} from "@/components/ui/agent-status-table"
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

const AGENT_CARDS = [
  {
    name: "Source Collector",
    role: "Gather project artifacts",
    task: "Collecting delivery readiness artifacts",
    progress: "12 of 18 items gathered",
    idleNote: "No collection target — waiting for a review scope",
  },
  {
    name: "Requirements Mapper",
    role: "Map requirements to controls",
    task: "Mapping Export workflow to internal control library",
    progress: "24 of 31 requirements mapped",
    idleNote: "Waiting for a source packet to map",
  },
  {
    name: "Document Drafter",
    role: "Author project brief sections",
    task: "Drafting implementation notes product summary",
    progress: "Section 6.2 in progress",
    idleNote: "Waiting for mapped requirements to draft against",
  },
]

const AGENT_STATUS_ROWS: AgentStatusRow[] = [
  {
    id: "source-collector",
    name: "Source Collector",
    role: "Gather project artifacts",
    status: "working",
    task: "Collecting delivery readiness artifacts",
    progress: 67,
    confidence: 91,
    cost: "$0.14",
    updated: "18s ago",
  },
  {
    id: "requirements-mapper",
    name: "Requirements Mapper",
    role: "Map requirements to controls",
    status: "handoff",
    task: "Waiting for source packet before final coverage mapping",
    progress: 58,
    confidence: 82,
    cost: "$0.09",
    updated: "42s ago",
  },
  {
    id: "document-drafter",
    name: "Document Drafter",
    role: "Author project brief sections",
    status: "idle",
    task: "No drafting until mapped requirements are confirmed",
    progress: 0,
    cost: "$0.00",
    updated: "2m ago",
  },
]

export function AgentCardsSection() {
  const [cardCtrl, cardAnim, toggleCard] = useExclusiveToggle({
    active: true,
    idle: false,
    error: false,
  })
  const activeCardMode = cardCtrl.active
    ? "active"
    : cardCtrl.idle
      ? "idle"
      : "error"

  return (
    <section id="agent-cards" className="page-section">
      <p className="section-label mb-3">Identity</p>
      <h2 className="text-xl font-semibold tracking-tight">Agent Cards</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Individual agent identity cards showing name, role, current status, and
        active task. Cards reflect the agent's operational state in real time.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "active", label: "Active" },
            { key: "idle", label: "Idle" },
            { key: "error", label: "Error" },
          ]}
          active={cardCtrl}
          onToggle={toggleCard}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={cardAnim}
        >
          <div className="grid grid-cols-1 divide-y divide-border/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {AGENT_CARDS.map((agent, i) => (
              <div
                key={agent.name}
                className="ma-slide-in flex min-w-0 flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:px-4 sm:py-0 sm:first:pl-0 sm:last:pr-0"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={Brain01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug font-medium">
                      {agent.name}
                    </p>
                    {/* Reserve two lines so a wrapping role doesn't break
                        the rhythm across the three-card grid */}
                    <p className="min-h-[2lh] text-xs text-muted-foreground">
                      {agent.role}
                    </p>
                  </div>
                  {activeCardMode === "error" && (
                    <HugeiconsIcon
                      icon={Alert01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="mt-1 text-muted-foreground"
                    />
                  )}
                </div>

                {/* Status body */}
                {activeCardMode === "active" && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground">
                      {agent.task}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {agent.progress}
                    </p>
                  </div>
                )}
                {activeCardMode === "idle" && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {agent.idleNote}
                    </p>
                  </div>
                )}
                {activeCardMode === "error" && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">
                      Failed to connect to project source repository — timeout
                      after 30s
                    </p>
                    <button
                      type="button"
                      aria-label={`Retry ${agent.name}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <HugeiconsIcon
                        icon={RefreshIcon}
                        size={10}
                        strokeWidth={1.5}
                      />
                      Retry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="section-label mb-3">Operational table</p>
        <AgentStatusTable agents={AGENT_STATUS_ROWS} />
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
              Card layout
            </TableCell>
            <TableCell className="py-3">
              Responsive grid, each card with avatar, name, role, and
              state-specific details
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Active state
            </TableCell>
            <TableCell className="py-3">
              Current task description and progress info
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Idle state
            </TableCell>
            <TableCell className="py-3">
              Role-specific waiting note ("Waiting for a source packet to map")
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Error state
            </TableCell>
            <TableCell className="py-3">
              Alert icon, error message, retry action button
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Agent cards provide the identity foundation for multi-agent interfaces.
        In review workflow contexts, each card maps to a distinct review
        activity — source collection, requirements mapping, or document
        authoring — making it clear which agent is responsible for which
        workstream deliverable.
      </div>
    </section>
  )
}
