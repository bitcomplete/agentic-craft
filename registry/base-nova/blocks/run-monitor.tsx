"use client"

import { AgentStatusTable, type AgentStatusRow } from "@/components/ui/agent-status-table"
import { Badge } from "@/components/ui/badge"
import { RunTrace, type RunTraceEvent } from "@/components/ui/run-trace"
import { UsageMeter } from "@/components/ui/usage-meter"

const agents: AgentStatusRow[] = [
  {
    id: "source-search",
    name: "Source Search",
    role: "Retrieves launch documents",
    status: "complete",
    task: "Found the source policy and project brief sections used by the run.",
    progress: 100,
    confidence: 93,
    cost: "$0.04",
    updated: "12s ago",
  },
  {
    id: "coverage-mapper",
    name: "Coverage Mapper",
    role: "Checks requirement coverage",
    status: "working",
    task: "Comparing export requirements against current implementation notes.",
    progress: 72,
    confidence: 86,
    cost: "$0.16",
    updated: "now",
  },
  {
    id: "document-drafter",
    name: "Document Drafter",
    role: "Prepares final summary",
    status: "blocked",
    task: "Waiting on product owner confirmation for unresolved export scope.",
    progress: 48,
    confidence: 68,
    cost: "$0.09",
    updated: "31s ago",
  },
]

const events: RunTraceEvent[] = [
  {
    id: "collect",
    title: "Collected launch sources",
    description: "Read project brief, launch checklist, and triage policy.",
    status: "complete",
    source: "3 sources",
    timestamp: "11:40 AM",
    duration: "18s",
  },
  {
    id: "map",
    title: "Mapped export coverage",
    description: "Compared CSV-only export text against the current policy.",
    status: "complete",
    source: "Project brief v3",
    timestamp: "11:42 AM",
    duration: "24s",
  },
  {
    id: "warn",
    title: "Coverage threshold warning",
    description: "JSON export support is missing from the draft.",
    status: "warning",
    source: "Launch Policy v2",
    timestamp: "11:43 AM",
    duration: "visible on hover",
    detail:
      "Warnings should include the affected object, source, and recovery path before escalation.",
  },
  {
    id: "blocked",
    title: "Product owner confirmation needed",
    description: "The run pauses before drafting the final report.",
    status: "blocked",
    source: "Review session",
    timestamp: "now",
    duration: "paused",
  },
]

function RunMonitorBlock() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            Background run monitor
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
            Track progress, source touches, budget, blockers, and partial
            output after a run leaves the composer.
          </p>
        </div>
        <Badge variant="outline">Registry block</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <RunTrace
          title="Launch review run"
          description="Operational events, warning state, and blocked recovery path."
          events={events}
        />
        <UsageMeter
          title="Run budget"
          description="Keep cost and coverage visible while the run continues."
          items={[
            {
              id: "tokens",
              label: "Tokens",
              value: 62,
              valueLabel: "19.4k",
              limitLabel: "31k session budget",
            },
            {
              id: "cost",
              label: "Cost",
              value: 38,
              valueLabel: "$0.48",
              limitLabel: "$1.20 review cap",
            },
            {
              id: "coverage",
              label: "Coverage",
              value: 74,
              valueLabel: "14 / 19",
              limitLabel: "5 still unverified",
            },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/60">
        <AgentStatusTable agents={agents} />
      </div>
    </div>
  )
}

export { RunMonitorBlock }
