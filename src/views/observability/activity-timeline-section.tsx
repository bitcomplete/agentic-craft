"use client"

import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  File01Icon,
  Idea01Icon,
  Tick01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"
import {
  AgentStatusTable,
  type AgentStatusRow,
} from "@/components/ui/agent-status-table"
import { RunTrace, type RunTraceEvent } from "@/components/ui/run-trace"
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

const ACTIVITY_LIVE = [
  {
    time: "Just now",
    action: "Checking Export workflow algorithm references",
    type: "tool" as const,
    icon: Search01Icon,
  },
  {
    time: "12s ago",
    action: "Cross-referencing Project brief v3 against Launch checklist",
    type: "tool" as const,
    icon: File01Icon,
  },
  {
    time: "34s ago",
    action: "Identified 2 coverage gaps in Access rules requirements",
    type: "message" as const,
    icon: Idea01Icon,
  },
  {
    time: "1m ago",
    action: "Started requirement gap analysis for ACME Customer Portal",
    type: "message" as const,
    icon: Activity01Icon,
  },
]

const ACTIVITY_HISTORY = [
  {
    time: "11:48 AM",
    action: "Completed requirement gap analysis — 2 gaps identified",
    type: "message" as const,
    icon: Tick01Icon,
  },
  {
    time: "11:44 AM",
    action: "Generated coverage matrix for implementation notes",
    type: "tool" as const,
    icon: File01Icon,
  },
  {
    time: "11:40 AM",
    action: "Parsed Launch checklist requirement catalog — 23 requirements",
    type: "tool" as const,
    icon: Search01Icon,
  },
  {
    time: "11:32 AM",
    action: "Source review complete for standard support plan",
    type: "message" as const,
    icon: Tick01Icon,
  },
  {
    time: "11:14 AM",
    action: "Cross-referenced test case mappings — 87 cases",
    type: "tool" as const,
    icon: File01Icon,
  },
]

const ACTIVITY_FILTERED = [
  {
    time: "12s ago",
    action: "Cross-referencing Project brief v3 against Launch checklist",
    type: "tool" as const,
    icon: File01Icon,
  },
  {
    time: "11:44 AM",
    action: "Generated coverage matrix for implementation notes",
    type: "tool" as const,
    icon: File01Icon,
  },
  {
    time: "11:40 AM",
    action: "Parsed Launch checklist requirement catalog — 23 requirements",
    type: "tool" as const,
    icon: Search01Icon,
  },
  {
    time: "11:14 AM",
    action: "Cross-referenced test case mappings — 87 cases",
    type: "tool" as const,
    icon: File01Icon,
  },
]

const SESSION_AGENT_ROWS: AgentStatusRow[] = [
  {
    id: "source-collector",
    name: "Source Collector",
    role: "Retrieves documents",
    status: "complete",
    task: "Found the source policy and project brief sections used in the answer.",
    progress: 100,
    confidence: 93,
    cost: "$0.04",
    updated: "12s ago",
  },
  {
    id: "requirements-mapper",
    name: "Requirements Mapper",
    role: "Maps requirements to controls",
    status: "working",
    task: "Comparing the active request against source coverage.",
    progress: 72,
    confidence: 86,
    cost: "$0.16",
    updated: "now",
  },
  {
    id: "document-drafter",
    name: "Document Drafter",
    role: "Drafts project brief sections",
    status: "idle",
    task: "Waiting for the next user or agent event.",
    progress: 0,
    cost: "$0.00",
    updated: "now",
  },
]

const REVIEW_RUN_TRACE: RunTraceEvent[] = [
  {
    id: "sources",
    title: "Collected launch sources",
    description: "Read the project brief, launch checklist, and triage policy.",
    status: "complete",
    source: "3 sources",
    timestamp: "11:40 AM",
    duration: "18s",
    detail:
      "The trace records touched source objects and completion state, not hidden reasoning.",
  },
  {
    id: "coverage",
    title: "Mapped export coverage",
    description: "Compared CSV-only export text against the current policy.",
    status: "complete",
    source: "Project brief v3",
    timestamp: "11:42 AM",
    duration: "24s",
  },
  {
    id: "threshold",
    title: "Coverage threshold warning",
    description:
      "JSON export is missing from the draft, so the run stays in review.",
    status: "warning",
    source: "Launch Policy v2",
    timestamp: "11:43 AM",
    duration: "visible on hover",
    detail:
      "Warnings should include the affected object, source, and recovery path before escalation.",
  },
  {
    id: "handoff",
    title: "Queued reviewer handoff",
    description: "Prepared a packet for the launch owner to confirm ownership.",
    status: "running",
    source: "Review session",
    timestamp: "now",
  },
]

export function ActivityTimelineSection() {
  const [actCtrl, actAnim, toggleAct] = useExclusiveToggle({
    live: true,
    history: false,
    filtered: false,
  })

  const actCtrlMap = actCtrl as Record<string, boolean>
  const activeAct = Object.keys(actCtrl).find((k) => actCtrlMap[k]) || "live"
  const activityItems =
    activeAct === "live"
      ? ACTIVITY_LIVE
      : activeAct === "history"
        ? ACTIVITY_HISTORY
        : ACTIVITY_FILTERED

  return (
    <section id="activity-timeline" className="page-section">
      <p className="section-label mb-3">Timeline</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Activity Timeline
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        A chronological stream of agent actions — tool invocations, messages,
        and state transitions — for full auditability of review workflows.
      </p>

      <div className="mt-10">
        <div className="mb-5 border-l border-border/70 bg-muted/20 py-3 pr-2 pl-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Threshold warning</Badge>
            <span className="text-sm font-medium text-foreground">
              Source coverage is below release-review minimum
            </span>
          </div>
          <p className="mt-1 max-w-[620px] text-xs leading-5 text-muted-foreground">
            JSON export support is missing from the draft. The run stays in
            review until the owner resolves the gap or accepts the risk.
          </p>
        </div>

        <Controls
          options={[
            { key: "live", label: "Live" },
            { key: "history", label: "History" },
            { key: "filtered", label: "Filtered" },
          ]}
          active={actCtrl}
          onToggle={toggleAct}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={actAnim}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon
                icon={Activity01Icon}
                size={14}
                strokeWidth={1.5}
              />
              <span>
                {activeAct === "live"
                  ? "Live feed"
                  : activeAct === "history"
                    ? "Past actions — Mar 15, 2026"
                    : "Filtered — Tool calls only"}
              </span>
            </div>
            {activeAct === "live" && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="mon-pulse h-1.5 w-1.5 rounded-full bg-foreground/60" />
                Streaming
              </span>
            )}
          </div>

          {/* Activity items */}
          <div className="divide-y divide-border/40">
            {activityItems.map((item, i) => (
              <div
                key={`${activeAct}-${i}`}
                className="mon-slide-in flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                  <HugeiconsIcon icon={item.icon} size={12} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.action}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{item.time}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {item.type === "tool" ? "Tool call" : "Message"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="section-label mb-3">Run state</p>
        <AgentStatusTable agents={SESSION_AGENT_ROWS} />
      </div>

      <div className="mt-6">
        <RunTrace
          title="Export review run trace"
          description="Operational events, source touches, warning state, and queued handoff for the active review."
          events={REVIEW_RUN_TRACE}
        />
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
              Entry animation
            </TableCell>
            <TableCell className="py-3">
              Slide-in from below, 250ms ease-out, staggered 60ms per item
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Action types
            </TableCell>
            <TableCell className="py-3">
              Tool call and Message — quiet text after the timestamp; the row
              icon carries the type
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Filtering
            </TableCell>
            <TableCell className="py-3">
              Filtered view shows only tool call entries for focused audit
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  )
}
