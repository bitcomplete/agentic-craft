import {
  Clock01Icon,
  ComputerIcon,
  DashboardSpeed01Icon,
  File01Icon,
  GridIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type { RunTraceEvent } from "@/components/ui/run-trace"
import type { StatusIndicatorStatus } from "@/components/ui/status-indicator"
import type { UsageMeterItem } from "@/components/ui/usage-meter"

export type OperationalSurface = {
  id: string
  title: string
  label: string
  icon: IconSvgElement
  summary: string
  thesis: string
  userJob: string
  patternUse: string
  rows: {
    label: string
    detail: string
    status: StatusIndicatorStatus
    meta: string
  }[]
}

export const operationalSurfaces: OperationalSurface[] = [
  {
    id: "inbox",
    title: "Inbox",
    label: "Flagged work",
    icon: File01Icon,
    summary:
      "The place where autonomous work asks for review instead of interrupting the thread.",
    thesis: "An inbox turns agent uncertainty into a triageable queue.",
    userJob:
      "Scan what needs attention, approve low-risk changes, and reject items that need more evidence.",
    patternUse:
      "Use locked previews, status indicators, provenance snippets, and clear ownership on every row.",
    rows: [
      {
        label: "Publish checklist",
        detail: "2 blockers remain before preview launch",
        status: "blocked",
        meta: "Needs owner",
      },
      {
        label: "Support coverage note",
        detail: "Ready to attach to release plan",
        status: "pending",
        meta: "Review",
      },
      {
        label: "Billing guardrail copy",
        detail: "Source set changed after approval",
        status: "warning",
        meta: "Re-lock",
      },
    ],
  },
  {
    id: "kanban",
    title: "Kanban",
    label: "Work state",
    icon: GridIcon,
    summary:
      "A board for longer-running agent work where state, owner, and next action matter more than chat order.",
    thesis: "A kanban view makes delegated work sortable by state.",
    userJob:
      "Compare queued, running, blocked, and review items without reading the full transcript.",
    patternUse:
      "Use task cards with phase, source count, owner, and next control. Do not color-code agents.",
    rows: [
      {
        label: "Queued",
        detail: "Legal source refresh",
        status: "pending",
        meta: "2 sources",
      },
      {
        label: "Running",
        detail: "Invite-path browser check",
        status: "active",
        meta: "01:18",
      },
      {
        label: "Review",
        detail: "Decision memo v0.4",
        status: "complete",
        meta: "3 citations",
      },
    ],
  },
  {
    id: "manager-surface",
    title: "Manager Surface",
    label: "Fleet control",
    icon: DashboardSpeed01Icon,
    summary:
      "A control plane for assigning agents, inspecting handoffs, and pausing a run before it drifts.",
    thesis: "The manager surface is where delegation becomes accountable.",
    userJob:
      "See who owns each part of the work, whether an agent is blocked, and what can be stopped.",
    patternUse:
      "Use multi-agent identity, handoff packets, kill switches, and compact operational traces.",
    rows: [
      {
        label: "Research agent",
        detail: "Customer digest summarized",
        status: "complete",
        meta: "handoff sent",
      },
      {
        label: "Browser agent",
        detail: "Invite flow check running",
        status: "active",
        meta: "can pause",
      },
      {
        label: "Writer agent",
        detail: "Waiting on browser evidence",
        status: "blocked",
        meta: "no draft",
      },
    ],
  },
  {
    id: "run-monitor-rollup",
    title: "Run Monitor Rollup",
    label: "Telemetry",
    icon: ComputerIcon,
    summary:
      "A compact rollup for long-running jobs where elapsed time, spend, phase, and failure state must be visible.",
    thesis:
      "A run monitor lets the user inspect progress without opening every trace.",
    userJob:
      "Decide whether to keep the run alive, inspect detail, or stop before cost and time drift.",
    patternUse:
      "Use workflow phases, usage meters, run traces, and expandable agent rows.",
    rows: [
      {
        label: "Collect",
        detail: "7 sources fetched",
        status: "complete",
        meta: "2.8s",
      },
      {
        label: "Validate",
        detail: "2 gates unresolved",
        status: "blocked",
        meta: "$0.18",
      },
      {
        label: "Draft",
        detail: "Memo waiting for approval",
        status: "pending",
        meta: "queued",
      },
    ],
  },
  {
    id: "background-tasks",
    title: "Background Tasks",
    label: "Scheduled work",
    icon: Clock01Icon,
    summary:
      "A place for recurring or deferred agent work that should remain inspectable after the thread is gone.",
    thesis: "Background work needs a receipt, a schedule, and a stop control.",
    userJob:
      "Confirm what will happen later, what sources it can touch, and how to cancel or change scope.",
    patternUse:
      "Use effective policy previews, source scopes, run history, and explicit cancellation states.",
    rows: [
      {
        label: "Daily launch scan",
        detail: "Checks support, billing, and analytics",
        status: "active",
        meta: "08:00",
      },
      {
        label: "Research digest sync",
        detail: "Adds only approved notes to memory",
        status: "pending",
        meta: "tomorrow",
      },
      {
        label: "Risk alert",
        detail: "Stopped after source permission changed",
        status: "error",
        meta: "needs repair",
      },
    ],
  },
]

export const operationalRunTrace: RunTraceEvent[] = [
  {
    id: "run-1",
    title: "Collected active work",
    description: "Grouped inbox, board, manager, monitor, and scheduled tasks.",
    status: "complete",
    timestamp: "11:04",
    duration: "1.6s",
  },
  {
    id: "run-2",
    title: "Checked unresolved gates",
    description: "Found two launch gates without an owner.",
    status: "blocked",
    timestamp: "11:05",
    duration: "0.9s",
    detail:
      "Blocked state remains in the rollup instead of presenting the workflow as ready.",
  },
  {
    id: "run-3",
    title: "Prepared next review queue",
    description: "Queued three review items for the inbox surface.",
    status: "queued",
    timestamp: "11:06",
  },
]

export const operationalUsage: UsageMeterItem[] = [
  {
    id: "active-runs",
    label: "Active runs",
    value: 46,
    valueLabel: "6",
    limitLabel: "13 total",
  },
  {
    id: "review-queue",
    label: "Needs review",
    value: 31,
    valueLabel: "4",
    limitLabel: "2 blocked",
  },
  {
    id: "cost",
    label: "Today's cost",
    value: 18,
    valueLabel: "$0.42",
    limitLabel: "$2.50 budget",
  },
]

export const operationalPrinciples = [
  "Operational surfaces are not chat transcripts. They are work-management views for delegated work.",
  "Rows should show state, evidence, owner, and next control before they show prose.",
  "Use color only as a supplement. Shape, labels, and control placement carry the state.",
  "Every background or autonomous action needs a receipt the user can return to later.",
]

export const operationalComponents = [
  { label: "RunTrace", href: "/registry#primitives" },
  { label: "UsageMeter", href: "/registry#primitives" },
  { label: "WorkflowPhases", href: "/registry#primitives" },
  { label: "StatusIndicator", href: "/registry#primitives" },
  { label: "HandoffPacket", href: "/registry#primitives" },
  { label: "EffectivePolicyPreview", href: "/registry#primitives" },
]
