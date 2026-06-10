"use client"

import {
  AgentStatusTable,
  type AgentStatusRow,
} from "@/components/ui/agent-status-table"
import { Badge } from "@/components/ui/badge"
import { HandoffPacket } from "@/components/ui/handoff-packet"
import { RunTrace, type RunTraceEvent } from "@/components/ui/run-trace"

const agents: AgentStatusRow[] = [
  {
    id: "source-collector",
    name: "Source Collector",
    role: "Gather project artifacts",
    status: "complete",
    task: "Collected the source bundle required for export coverage review.",
    progress: 100,
    confidence: 91,
    cost: "$0.14",
    updated: "18s ago",
  },
  {
    id: "requirements-mapper",
    name: "Requirements Mapper",
    role: "Map requirements to controls",
    status: "handoff",
    task: "Sending coverage gap to Document Drafter for remediation text.",
    progress: 78,
    confidence: 82,
    cost: "$0.09",
    updated: "now",
  },
  {
    id: "document-drafter",
    name: "Document Drafter",
    role: "Author project brief sections",
    status: "working",
    task: "Accepting the handoff packet and updating implementation notes.",
    progress: 28,
    confidence: 74,
    cost: "$0.03",
    updated: "now",
  },
]

const trace: RunTraceEvent[] = [
  {
    id: "sender",
    title: "Sender packaged the gap",
    description: "Requirements Mapper bundled the finding and source basis.",
    status: "complete",
    source: "Launch Policy v2",
    timestamp: "11:42 AM",
    duration: "9s",
  },
  {
    id: "transfer",
    title: "Handoff packet sent",
    description:
      "Document Drafter received payload, source basis, and recovery path.",
    status: "running",
    source: "Export workflow",
    timestamp: "now",
    duration: "running",
  },
  {
    id: "accept",
    title: "Acceptance required",
    description:
      "Downstream drafting waits until the receiver accepts ownership.",
    status: "queued",
    source: "Review session",
    timestamp: "pending",
  },
]

function MultiAgentHandoffBlock() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            Multi-agent handoff
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
            Show the owner, receiver, payload, source basis, and recovery path
            before downstream work starts.
          </p>
        </div>
        <Badge variant="outline">Registry block</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <HandoffPacket
          sender="Requirements Mapper"
          receiver="Document Drafter"
          title="Export workflow coverage packet"
          description="Ownership transfer for a requirement gap that must be resolved before the review report can be finalized."
          status="sent"
          items={[
            {
              label: "Payload",
              value:
                "Requirement coverage delta for Export workflow, including missing JSON export support.",
            },
            {
              label: "Source basis",
              value:
                "Project brief v3, Launch Policy v2, Support readiness checklist",
            },
            {
              label: "Receiver action",
              value:
                "Update implementation notes section 6.1.3 or reject with missing context.",
            },
            {
              label: "Recovery",
              value:
                "Rejecting the packet returns the run to Source Collector with a request for more evidence.",
            },
          ]}
        />
        <RunTrace
          title="Ownership trace"
          description="Records sender package, receiver handoff, and acceptance state."
          events={trace}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/60">
        <AgentStatusTable agents={agents} />
      </div>
    </div>
  )
}

export { MultiAgentHandoffBlock }
