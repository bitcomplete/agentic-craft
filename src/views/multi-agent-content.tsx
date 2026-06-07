"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Alert01Icon,
  Tick01Icon,
  Brain01Icon,
  Message01Icon,
  Search01Icon,
  RefreshIcon,
  Route01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  AgentStatusTable,
  type AgentStatusRow,
} from "@/components/ui/agent-status-table"
import { Badge } from "@/components/ui/badge"
import { HandoffPacket } from "@/components/ui/handoff-packet"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function makeToggle(
  setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  animSetter: React.Dispatch<React.SetStateAction<number>>
) {
  return (key: string) => {
    setter((prev) => {
      const next: Record<string, boolean> = {}
      for (const k of Object.keys(prev)) next[k] = false
      next[key] = true
      return next
    })
    animSetter((n) => n + 1)
  }
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AGENT_CARDS = [
  {
    name: "Source Collector",
    role: "Gather project artifacts",
    task: "Collecting delivery readiness delivery artifacts",
    progress: "12 of 18 items gathered",
  },
  {
    name: "Requirements Mapper",
    role: "Map requirements to controls",
    task: "Mapping Export workflow to internal control library",
    progress: "24 of 31 requirements mapped",
  },
  {
    name: "Document Drafter",
    role: "Author project brief sections",
    task: "Drafting implementation notes product summary",
    progress: "Section 6.2 in progress",
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

const PARALLEL_AGENTS = [
  {
    name: "Risk Scanner",
    task: "Scanning incident database against launch scope",
    result: "847 incidents scanned — 0 critical blockers",
    progress: 72,
  },
  {
    name: "Source Collector",
    task: "Gathering release readiness source material",
    result: "18 of 18 artifacts collected — 100% coverage",
    progress: 45,
  },
  {
    name: "Policy Analyst",
    task: "Analysing launch policy",
    result: "47 requirements parsed — 4 deltas from previous version",
    progress: 88,
  },
]

const ROUTING_AGENTS = [
  "Requirements Mapper",
  "Source Collector",
  "Policy Analyst",
]

const DIRECT_MESSAGES = [
  {
    from: "Requirements Mapper",
    to: "Document Drafter",
    content:
      "I found that Export workflow references CSV-only export in the project brief, but the launch policy Launch Policy v2 requires CSV and JSON exports. Can you update section 6.1.3?",
  },
  {
    from: "Document Drafter",
    to: "Requirements Mapper",
    content:
      "Confirmed. I have updated the export behavior table in implementation notes to reference CSV and JSON export. The rationale now cites the data export policy.",
  },
  {
    from: "Requirements Mapper",
    to: "Document Drafter",
    content:
      "Verified. Export workflow mapping now aligns with the policy requirement. Marking this requirement as fully covered.",
  },
]

const SHARED_CONTEXT_ITEMS = [
  {
    agent: "Source Collector",
    label: "delivery readiness.1 delivery procedures",
    type: "Artifact",
    time: "2m ago",
  },
  {
    agent: "Requirements Mapper",
    label: "Export workflow coverage gap — missing JSON option",
    type: "Finding",
    time: "4m ago",
  },
  {
    agent: "Document Drafter",
    label: "implementation notes section 6.1.3 — updated",
    type: "Draft",
    time: "5m ago",
  },
  {
    agent: "Policy Analyst",
    label: "Launch Policy v1.2 requirement delta report",
    type: "Analysis",
    time: "8m ago",
  },
  {
    agent: "Risk Scanner",
    label: "Incident-2025-3891 disposition — not applicable",
    type: "Assessment",
    time: "12m ago",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function MultiAgentContent() {
  /* Section 1 — Agent Cards */
  const [cardCtrl, setCardCtrl] = useState<Record<string, boolean>>({
    active: true,
    idle: false,
    error: false,
  })
  const [cardAnim, setCardAnim] = useState(0)
  const toggleCard = makeToggle(setCardCtrl, setCardAnim)
  const activeCardMode = cardCtrl.active
    ? "active"
    : cardCtrl.idle
      ? "idle"
      : "error"

  /* Section 2 — Handoff Flow */
  const [handoffCtrl, setHandoffCtrl] = useState<Record<string, boolean>>({
    pending: true,
    inprogress: false,
    complete: false,
  })
  const [handoffAnim, setHandoffAnim] = useState(0)
  const toggleHandoff = makeToggle(setHandoffCtrl, setHandoffAnim)
  const activeHandoff = handoffCtrl.pending
    ? "pending"
    : handoffCtrl.inprogress
      ? "inprogress"
      : "complete"

  /* Section 3 — Parallel Agents */
  const [parallelCtrl, setParallelCtrl] = useState<Record<string, boolean>>({
    running: true,
    complete: false,
  })
  const [parallelAnim, setParallelAnim] = useState(0)
  const toggleParallel = makeToggle(setParallelCtrl, setParallelAnim)
  const activeParallel = parallelCtrl.running ? "running" : "complete"

  /* Section 4 — Agent Routing */
  const [routeCtrl, setRouteCtrl] = useState<Record<string, boolean>>({
    auto: true,
    manual: false,
  })
  const [routeAnim, setRouteAnim] = useState(0)
  const toggleRoute = makeToggle(setRouteCtrl, setRouteAnim)
  const activeRoute = routeCtrl.auto ? "auto" : "manual"
  const [manualSelection, setManualSelection] = useState<string | null>(null)

  /* Section 5 — Agent Communication */
  const [commCtrl, setCommCtrl] = useState<Record<string, boolean>>({
    direct: true,
    shared: false,
  })
  const [commAnim, setCommAnim] = useState(0)
  const toggleComm = makeToggle(setCommCtrl, setCommAnim)
  const activeComm = commCtrl.direct ? "direct" : "shared"

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Orchestration</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Multi-Agent Patterns
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Coordination primitives for orchestrating multiple agents across
          product requirements review workflows — handoffs, parallel execution,
          routing, and inter-agent communication.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Agent Cards                                      */}
      {/* ============================================================ */}
      <section id="agent-cards" className="page-section">
        <p className="section-label mb-3">Identity</p>
        <h2 className="text-xl font-semibold tracking-tight">Agent Cards</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Individual agent identity cards showing name, role, current status,
          and active task. Cards reflect the agent's operational state in real
          time.
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
                  className="ma-slide-in min-w-0 flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:px-4 sm:py-0 sm:first:pl-0 sm:last:pr-0"
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
                      <p className="text-xs text-muted-foreground">
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
                        Awaiting instructions
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
                "Awaiting instructions" placeholder
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
          Agent cards provide the identity foundation for multi-agent
          interfaces. In review workflow contexts, each card maps to a distinct
          review activity — source collection, requirements mapping, or document
          authoring — making it clear which agent is responsible for which
          workstream deliverable.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Handoff Flow                                     */}
      {/* ============================================================ */}
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
                            : "border-border/40 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {stepState === "complete" ? (
                          <div className="flex size-5 items-center justify-center rounded-md bg-foreground/10">
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              size={12}
                              strokeWidth={2}
                              className="text-foreground/70"
                            />
                          </div>
                        ) : stepState === "active" ? (
                          <span className="ma-pulse h-2 w-2 rounded-full bg-foreground/70" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        )}
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
                              : "text-muted-foreground/30"
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
                First step highlighted, remaining steps muted at 50% opacity
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
          can be mapped, and coverage must be mapped before the review report
          can be generated. Each handoff creates an auditable transition record.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Parallel Agents                                  */}
      {/* ============================================================ */}
      <section id="parallel-agents" className="page-section">
        <p className="section-label mb-3">Concurrency</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Parallel Agents
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Multiple agents executing independent tasks simultaneously. Each agent
          reports individual progress toward its own objective.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "running", label: "Running" },
              { key: "complete", label: "Complete" },
            ]}
            active={parallelCtrl}
            onToggle={toggleParallel}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            key={parallelAnim}
          >
            <div className="divide-y divide-border/40">
              {PARALLEL_AGENTS.map((agent, i) => (
                <div
                  key={agent.name}
                  className="ma-slide-in py-4 first:pt-0 last:pb-0"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Brain01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {activeParallel === "running"
                              ? agent.task
                              : agent.result}
                          </p>
                        </div>
                        {activeParallel === "running" ? (
                          <span className="ma-pulse h-2 w-2 rounded-full bg-foreground/70" />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground/10">
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              size={12}
                              strokeWidth={2}
                              className="text-foreground/70"
                            />
                          </div>
                        )}
                      </div>

                      <Progress
                        value={
                          activeParallel === "complete" ? 100 : agent.progress
                        }
                      />

                      {activeParallel === "running" && (
                        <p className="text-[10px] text-muted-foreground/60">
                          {agent.progress}% complete
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                Agent rows
              </TableCell>
              <TableCell className="py-3">
                Stacked cards with avatar, name, task description, and status
                indicator
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Progress bars
              </TableCell>
              <TableCell className="py-3">
                Animated fill to individual target width, monochrome foreground
                tint
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Running state
              </TableCell>
              <TableCell className="py-3">
                Pulsing dot, active task label, percentage complete
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Complete state
              </TableCell>
              <TableCell className="py-3">
                Tick icon, results summary replaces task description, bar at
                100%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Parallel execution is critical for complex review workflows where
          independent review workstreams — risk scanning (risk review), source
          material collection (ALC), and launch policy analysis — can proceed
          concurrently without blocking each other.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Agent Routing                                    */}
      {/* ============================================================ */}
      <section id="agent-routing" className="page-section">
        <p className="section-label mb-3">Dispatch</p>
        <h2 className="text-xl font-semibold tracking-tight">Agent Routing</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Routing incoming tasks to the most appropriate agent based on task
          type analysis or manual selection by the workflow owner.
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
                  Task type: requirement requirements review
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
          Routing decisions in CC workflows must be transparent and auditable.
          Auto-routing uses task type classification to match
          requirement-related tasks to the Requirements Mapper, source tasks to
          the Source Collector, and policy tasks to the Policy Analyst. Manual
          override ensures the reviewer retains final authority over agent
          assignments.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Agent Communication                              */}
      {/* ============================================================ */}
      <section id="agent-communication" className="page-section">
        <p className="section-label mb-3">Collaboration</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Agent Communication
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Inter-agent information exchange via direct messaging or a shared
          context workspace. Both patterns create auditable communication
          records.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "direct", label: "Direct" },
              { key: "shared", label: "Shared Context" },
            ]}
            active={commCtrl}
            onToggle={toggleComm}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            key={commAnim}
          >
            {activeComm === "direct" ? (
              <div className="ma-slide-in flex flex-col gap-3">
                <div className="mb-4 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Message01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    Direct thread — Requirements Mapper and Document Drafter
                  </span>
                </div>
                {DIRECT_MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    className="ma-slide-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div
                      className={`flex gap-3 ${msg.from === "Document Drafter" ? "flex-row-reverse" : ""}`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon
                          icon={Brain01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div
                        className={`flex-1 border-l border-border/50 py-2 pl-3 ${
                          msg.from === "Document Drafter"
                            ? "bg-foreground/[0.02]"
                            : ""
                        }`}
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {msg.from}
                          </span>
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={10}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            {msg.to}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ma-slide-in flex flex-col gap-3">
                <div className="mb-4 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Share01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    Shared project context — 5 items from 5 agents
                  </span>
                </div>
                {SHARED_CONTEXT_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="ma-slide-in flex items-center gap-3 border-b border-border/40 py-3 last:border-b-0"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Brain01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm">{item.label}</p>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.agent} · {item.time}
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="shrink-0 text-muted-foreground"
                    />
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
                Direct messages
              </TableCell>
              <TableCell className="py-3">
                Chat-style thread between two agents with sender/receiver labels
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Message alignment
              </TableCell>
              <TableCell className="py-3">
                Alternating left/right layout based on sender, subtle background
                tint
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Shared context
              </TableCell>
              <TableCell className="py-3">
                List of contributed items with agent attribution, type badge,
                and timestamp
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Context types
              </TableCell>
              <TableCell className="py-3">
                Artifact, Finding, Draft, Analysis, Assessment — shown as muted
                badges
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Agent communication patterns support the traceability requirements of
          complex review workflows. Direct messaging creates point-to-point
          audit trails (e.g., when the Requirements Mapper flags an requirement
          gap for the Document Drafter), while shared context provides a
          workspace where all agents can contribute findings visible to the
          project team.
        </div>
      </section>
    </article>
  )
}
