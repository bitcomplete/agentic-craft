"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UsageMeter } from "@/components/ui/usage-meter"
import {
  WorkflowPhases,
  type WorkflowPhase,
} from "@/components/ui/workflow-phases"
import {
  AgentStatusTable,
  type AgentStatusRow,
} from "@/components/ui/agent-status-table"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────────────── */
/*  Types                                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

type RunState = "running" | "paused" | "completed" | "failed"

/* ──────────────────────────────────────────────────────────────────────── */
/*  Demo data — "Launch readiness audit" for Meridian                     */
/* ──────────────────────────────────────────────────────────────────────── */

const PLAN_LINES = [
  { code: "phase('Scan sources')", phaseId: "scan" },
  { code: "const findings = await parallel(scanners)", phaseId: "scan" },
  { code: "", phaseId: null },
  { code: "phase('Verify findings')", phaseId: "verify" },
  { code: "const verified = await parallel(verifiers)", phaseId: "verify" },
  { code: "", phaseId: null },
  { code: "phase('Draft report')", phaseId: "draft" },
  { code: "await agent(`Draft report: ${verified}`)", phaseId: "draft" },
]

// Phase data per run state
function getPhasesForState(state: RunState): WorkflowPhase[] {
  switch (state) {
    case "running":
      return [
        {
          id: "scan",
          title: "Scan sources",
          status: "done",
          agentCount: 8,
          tokens: "12,450",
          elapsed: "3:24",
        },
        {
          id: "verify",
          title: "Verify findings",
          status: "active",
          agentCount: 5,
          tokens: "4,213",
          elapsed: "1:08",
        },
        {
          id: "draft",
          title: "Draft report",
          status: "queued",
          agentCount: 1,
        },
      ]
    case "paused":
      return [
        {
          id: "scan",
          title: "Scan sources",
          status: "done",
          agentCount: 8,
          tokens: "12,450",
          elapsed: "3:24",
        },
        {
          id: "verify",
          title: "Verify findings",
          status: "active",
          agentCount: 5,
          tokens: "4,213",
          elapsed: "1:08",
        },
        {
          id: "draft",
          title: "Draft report",
          status: "queued",
          agentCount: 1,
        },
      ]
    case "completed":
      return [
        {
          id: "scan",
          title: "Scan sources",
          status: "done",
          agentCount: 8,
          tokens: "12,450",
          elapsed: "3:24",
        },
        {
          id: "verify",
          title: "Verify findings",
          status: "done",
          agentCount: 5,
          tokens: "8,907",
          elapsed: "2:51",
        },
        {
          id: "draft",
          title: "Draft report",
          status: "done",
          agentCount: 1,
          tokens: "3,129",
          elapsed: "0:47",
        },
      ]
    case "failed":
      return [
        {
          id: "scan",
          title: "Scan sources",
          status: "done",
          agentCount: 8,
          tokens: "12,450",
          elapsed: "3:24",
        },
        {
          id: "verify",
          title: "Verify findings",
          status: "failed",
          agentCount: 5,
          tokens: "4,213",
          elapsed: "1:08",
        },
        {
          id: "draft",
          title: "Draft report",
          status: "queued",
          agentCount: 1,
        },
      ]
  }
}

// Agents for the "Scan sources" phase (phase 1 — always done).
// Per-agent tokens sum to the phase roll-up: 12,450.
const SCAN_AGENTS: AgentStatusRow[] = [
  {
    id: "dep-scanner",
    name: "Dependency Scanner",
    role: "Maps third-party risks",
    status: "complete",
    task: "Catalogued 143 direct and transitive dependencies",
    progress: 100,
    confidence: 97,
    cost: "$0.03",
    updated: "4m ago",
    detail: {
      model: "haiku",
      tokens: "2,317",
      elapsed: "0:41",
      output:
        "Catalogued 143 dependencies. Nine carry known advisories, none above moderate severity; the two flagged in the last audit were upgraded.",
    },
  },
  {
    id: "policy-reader",
    name: "Policy Reader",
    role: "Extracts launch requirements",
    status: "complete",
    task: "Read 6 policy documents — 29 requirements parsed",
    progress: 100,
    confidence: 92,
    cost: "$0.04",
    updated: "4m ago",
    detail: {
      model: "sonnet",
      tokens: "3,108",
      elapsed: "1:12",
      output:
        "Parsed 29 launch requirements from 6 policy documents. Export controls appear twice with conflicting thresholds — flagged for the verify phase.",
    },
  },
  {
    id: "source-collector",
    name: "Source Collector",
    role: "Gather project artifacts",
    status: "complete",
    task: "Collected 18 of 18 source artifacts for scope",
    progress: 100,
    confidence: 94,
    cost: "$0.04",
    updated: "3m ago",
    detail: {
      model: "haiku",
      tokens: "2,194",
      elapsed: "0:58",
      output:
        "Collected all 18 artifacts in scope. Build manifests were stale by two commits and were re-fetched before handoff.",
    },
  },
  {
    id: "change-log-reader",
    name: "Change Log Reader",
    role: "Identifies recent deltas",
    status: "complete",
    task: "Parsed 47 commits since last audit baseline",
    progress: 100,
    confidence: 89,
    cost: "$0.02",
    updated: "4m ago",
    detail: {
      model: "haiku",
      tokens: "1,983",
      elapsed: "0:47",
      output:
        "47 commits since the audit baseline; 12 touch the export workflow and feed directly into the delta audit.",
    },
  },
  {
    id: "incident-checker",
    name: "Incident Checker",
    role: "Reviews prior incidents",
    status: "complete",
    task: "Scanned 847 incidents — 0 critical blockers flagged",
    progress: 100,
    confidence: 98,
    cost: "$0.03",
    updated: "3m ago",
    detail: {
      model: "sonnet",
      tokens: "2,848",
      elapsed: "1:03",
      output:
        "Reviewed 847 incidents. No critical blockers; one recurring timeout cluster in the incident archive noted as a risk to later phases.",
    },
  },
]

// Agents for phase 2 (verify) — varies by state
function getVerifyAgents(state: RunState, retried?: boolean): AgentStatusRow[] {
  // Working and complete agents carry detail; idle agents have nothing to
  // reveal yet, so their rows render no disclosure. Tokens sum to 4,213.
  if (state === "running") {
    return [
      {
        id: "coverage-verifier",
        name: "Coverage Verifier",
        role: "Cross-checks requirement coverage",
        status: "complete",
        task: "Verified 14 of 29 requirements against source artifacts",
        progress: 100,
        confidence: 91,
        cost: "$0.06",
        updated: "43s ago",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          elapsed: "0:52",
          output:
            "Verified 14 of 29 requirements against source artifacts. Export workflow coverage holds against Launch Policy v2 so far.",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "working",
        task: "Correlating 12 open deltas with requirements list",
        progress: 61,
        confidence: 84,
        cost: "$0.07",
        updated: "now",
        detail: {
          model: "sonnet",
          tokens: "1,204",
          elapsed: "1:08",
          output:
            "Correlating 12 open deltas: 7 map cleanly, 3 wait on the conflicting export thresholds Policy Reader flagged.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "working",
        task: "Mapping export workflow to internal control library",
        progress: 48,
        confidence: 79,
        cost: "$0.05",
        updated: "now",
        detail: {
          model: "sonnet",
          tokens: "1,137",
          elapsed: "1:02",
          output:
            "11 of 29 requirements matched to the internal control library; export workflow mapping in progress.",
        },
      },
      {
        id: "risk-assessor",
        name: "Risk Assessor",
        role: "Rates unverified items",
        status: "idle",
        task: "Waiting for delta audit results before scoring",
        progress: 0,
        cost: "$0.00",
        updated: "1m ago",
      },
      {
        id: "findings-summariser",
        name: "Findings Summariser",
        role: "Prepares phase summary",
        status: "idle",
        task: "Waiting on all verifiers before drafting phase summary",
        progress: 0,
        cost: "$0.00",
        updated: "1m ago",
      },
    ]
  }

  if (state === "paused") {
    return [
      {
        id: "coverage-verifier",
        name: "Coverage Verifier",
        role: "Cross-checks requirement coverage",
        status: "complete",
        task: "Verified 14 of 29 requirements — results cached",
        progress: 100,
        confidence: 91,
        cost: "$0.06",
        updated: "paused",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          elapsed: "0:52",
          output:
            "Verified 14 of 29 requirements against source artifacts. Export workflow coverage holds against Launch Policy v2 so far.",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "idle",
        task: "Paused at 61% — cached partial results retained",
        progress: 61,
        cost: "$0.07",
        updated: "paused",
        detail: {
          model: "sonnet",
          tokens: "1,204",
          elapsed: "1:08",
          output:
            "Cached at 61%: 7 of 12 deltas correlated. Resume continues from here without re-running completed work.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "idle",
        task: "Paused at 48% — cached partial results retained",
        progress: 48,
        cost: "$0.05",
        updated: "paused",
        detail: {
          model: "sonnet",
          tokens: "1,137",
          elapsed: "1:02",
          output:
            "Cached at 48%: 11 of 29 requirements matched to the control library. Resume picks up at requirement 12.",
        },
      },
      {
        id: "risk-assessor",
        name: "Risk Assessor",
        role: "Rates unverified items",
        status: "idle",
        task: "Hold — waiting for delta audit on resume",
        progress: 0,
        cost: "$0.00",
        updated: "paused",
      },
      {
        id: "findings-summariser",
        name: "Findings Summariser",
        role: "Prepares phase summary",
        status: "idle",
        task: "Hold — waiting on all verifiers on resume",
        progress: 0,
        cost: "$0.00",
        updated: "paused",
      },
    ]
  }

  // Completed phase: tokens sum to the 8,907 roll-up.
  if (state === "completed") {
    return [
      {
        id: "coverage-verifier",
        name: "Coverage Verifier",
        role: "Cross-checks requirement coverage",
        status: "complete",
        task: "Verified all 29 requirements — 3 gaps flagged",
        progress: 100,
        confidence: 91,
        cost: "$0.06",
        updated: "2m ago",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          elapsed: "0:52",
          output:
            "Verified all 29 requirements. Three gaps flagged, all in export logging coverage; none block the launch on their own.",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "complete",
        task: "4 unresolved deltas escalated for review",
        progress: 100,
        confidence: 87,
        cost: "$0.09",
        updated: "3m ago",
        detail: {
          model: "sonnet",
          tokens: "2,318",
          elapsed: "1:21",
          output:
            "All 12 deltas correlated. Four unresolved changes escalated for human review; the rest reconcile against the requirements list.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "complete",
        task: "29 requirements mapped — export workflow coverage confirmed",
        progress: 100,
        confidence: 93,
        cost: "$0.07",
        updated: "3m ago",
        detail: {
          model: "sonnet",
          tokens: "2,094",
          elapsed: "1:14",
          output:
            "All 29 requirements mapped to the internal control library. Export workflow coverage confirmed, including both threshold variants.",
        },
      },
      {
        id: "risk-assessor",
        name: "Risk Assessor",
        role: "Rates unverified items",
        status: "complete",
        task: "Scored 3 gaps: 2 medium, 1 low — no critical risks",
        progress: 100,
        confidence: 88,
        cost: "$0.05",
        updated: "2m ago",
        detail: {
          model: "haiku",
          tokens: "1,517",
          elapsed: "0:46",
          output:
            "Scored 3 gaps: 2 medium, 1 low. No critical risk; the export logging gap carries the highest exposure.",
        },
      },
      {
        id: "findings-summariser",
        name: "Findings Summariser",
        role: "Prepares phase summary",
        status: "complete",
        task: "Phase summary ready — 3 gaps, 0 blockers",
        progress: 100,
        confidence: 95,
        cost: "$0.04",
        updated: "2m ago",
        detail: {
          model: "haiku",
          tokens: "1,106",
          elapsed: "0:38",
          output:
            "Phase summary ready: 3 gaps, 0 blockers. Recommends a conditional go with the logging gap closed before launch.",
        },
      },
    ]
  }

  // failed state
  if (retried) {
    return [
      {
        id: "coverage-verifier",
        name: "Coverage Verifier",
        role: "Cross-checks requirement coverage",
        status: "complete",
        task: "Verified 14 of 29 requirements — held from prior run",
        progress: 100,
        confidence: 91,
        cost: "$0.06",
        updated: "retried",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          elapsed: "0:52",
          output:
            "Results held from the prior run — 14 of 29 requirements verified. Not re-run on retry.",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "complete",
        task: "Correlating deltas — held from prior run",
        progress: 100,
        confidence: 84,
        cost: "$0.07",
        updated: "retried",
        detail: {
          model: "sonnet",
          tokens: "1,204",
          elapsed: "1:08",
          output:
            "Cached correlations re-used; the remaining 5 deltas resolved against the refreshed incident archive.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "working",
        task: "Retrying: mapping export workflow to control library",
        progress: 31,
        cost: "$0.02",
        updated: "now",
        detail: {
          model: "sonnet",
          tokens: "412",
          elapsed: "0:14",
          output:
            "Retrying with cached delta results — re-mapping export workflow controls from requirement 12.",
        },
      },
      {
        id: "risk-assessor",
        name: "Risk Assessor",
        role: "Rates unverified items",
        status: "idle",
        task: "Waiting for retry to complete",
        progress: 0,
        cost: "$0.00",
        updated: "just now",
      },
      {
        id: "findings-summariser",
        name: "Findings Summariser",
        role: "Prepares phase summary",
        status: "idle",
        task: "Waiting on all verifiers before drafting phase summary",
        progress: 0,
        cost: "$0.00",
        updated: "just now",
      },
    ]
  }

  // failed, not retried — show the 3 completed + error
  return [
    {
      id: "coverage-verifier",
      name: "Coverage Verifier",
      role: "Cross-checks requirement coverage",
      status: "complete",
      task: "Verified 14 of 29 requirements — progress retained",
      progress: 100,
      confidence: 91,
      cost: "$0.06",
      updated: "1m ago",
      detail: {
        model: "sonnet",
        tokens: "1,872",
        elapsed: "0:52",
        output:
          "Verified 14 of 29 requirements before the phase failed. Results are cached and survive a retry.",
      },
    },
    {
      id: "delta-auditor",
      name: "Delta Auditor",
      role: "Flags unresolved changes",
      status: "error",
      task: "Failed: source unavailable after 30s timeout — 3 of 5 verified",
      progress: 61,
      cost: "$0.07",
      updated: "just now",
      detail: {
        model: "sonnet",
        tokens: "1,204",
        elapsed: "1:08",
        output:
          "Incident archive unavailable after a 30-second timeout. Seven of 12 delta correlations were already complete and are cached for retry.",
      },
    },
    {
      id: "requirements-mapper",
      name: "Requirements Mapper",
      role: "Map requirements to controls",
      status: "error",
      task: "Failed: could not complete mapping without delta results",
      progress: 48,
      cost: "$0.05",
      updated: "just now",
      detail: {
        model: "sonnet",
        tokens: "1,137",
        elapsed: "1:02",
        output:
          "Mapping stopped at requirement 11 — the remaining controls depend on delta results. The partial map is cached for retry.",
      },
    },
  ]
}

// Agents for phase 3 (draft)
const DRAFT_AGENTS_COMPLETE: AgentStatusRow[] = [
  {
    id: "document-drafter",
    name: "Document Drafter",
    role: "Prepares final summary",
    status: "complete",
    task: "Launch readiness report drafted — 7 sections, 3 annexes",
    progress: 100,
    confidence: 94,
    cost: "$0.11",
    updated: "1m ago",
    detail: {
      model: "sonnet",
      tokens: "3,129",
      elapsed: "0:47",
      output:
        "Launch readiness report drafted: 7 sections, 3 annexes. Recommends a conditional go — close the export logging gap before launch, owner assigned.",
    },
  },
]

// Usage meter data by state
function getUsageItems(state: RunState) {
  if (state === "running") {
    return [
      {
        id: "tokens",
        label: "Tokens used",
        value: 53,
        valueLabel: "16,663",
        limitLabel: "31k run budget",
      },
      {
        id: "cost",
        label: "Cost",
        value: 29,
        valueLabel: "$0.35",
        limitLabel: "$1.20 run cap",
      },
      {
        id: "agents",
        label: "Agents complete",
        value: 62,
        valueLabel: "8 / 13",
        limitLabel: "5 still active",
      },
    ]
  }
  if (state === "paused") {
    return [
      {
        id: "tokens",
        label: "Tokens used",
        value: 53,
        valueLabel: "16,663",
        limitLabel: "31k run budget",
      },
      {
        id: "cost",
        label: "Cost",
        value: 29,
        valueLabel: "$0.35",
        limitLabel: "$1.20 run cap — paused",
      },
      {
        id: "agents",
        label: "Agents complete",
        value: 62,
        valueLabel: "8 / 13",
        limitLabel: "5 hold cached results",
      },
    ]
  }
  if (state === "completed") {
    return [
      {
        id: "tokens",
        label: "Tokens used",
        value: 78,
        valueLabel: "24,486",
        limitLabel: "31k run budget",
      },
      {
        id: "cost",
        label: "Cost",
        value: 64,
        valueLabel: "$0.77",
        limitLabel: "$1.20 run cap",
      },
      {
        id: "agents",
        label: "Agents complete",
        value: 100,
        valueLabel: "14 / 14",
        limitLabel: "All agents finished",
      },
    ]
  }
  // failed
  return [
    {
      id: "tokens",
      label: "Tokens used",
      value: 53,
      valueLabel: "16,663",
      limitLabel: "31k run budget",
    },
    {
      id: "cost",
      label: "Cost",
      value: 29,
      valueLabel: "$0.35",
      limitLabel: "$1.20 run cap",
    },
    {
      id: "agents",
      label: "Agents complete",
      value: 38,
      valueLabel: "5 / 13",
      limitLabel: "2 failed — recovery available",
    },
  ]
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Plan-as-code inset                                                    */
/* ──────────────────────────────────────────────────────────────────────── */

function PlanCode({ activePhaseId }: { activePhaseId: string | null }) {
  return (
    <pre className="overflow-x-auto font-mono text-xs leading-5 text-muted-foreground">
      {PLAN_LINES.map((line, i) => {
        const isHighlighted =
          line.phaseId !== null && line.phaseId === activePhaseId
        // Round only the outer corners so consecutive lines of one phase
        // read as a single band
        const startsBand =
          isHighlighted && PLAN_LINES[i - 1]?.phaseId !== line.phaseId
        const endsBand =
          isHighlighted && PLAN_LINES[i + 1]?.phaseId !== line.phaseId
        return (
          <div
            key={i}
            className={cn(
              "px-2 transition-colors duration-150",
              isHighlighted && "bg-muted",
              startsBand && "rounded-t-sm",
              endsBand && "rounded-b-sm"
            )}
          >
            {line.code || " "}
          </div>
        )
      })}
    </pre>
  )
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Density collapse row                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

const DENSITY_THRESHOLD = 5

function CollapsedAgentSummary({
  queued,
  running,
}: {
  queued: number
  running: number
}) {
  const parts: string[] = []
  if (queued > 0) parts.push(`${queued} queued`)
  if (running > 0) parts.push(`${running} running`)
  return (
    <tr>
      <td
        colSpan={7}
        className="px-3 py-2 text-xs text-muted-foreground tabular-nums"
      >
        +{queued + running} more: {parts.join(" · ")}
      </td>
    </tr>
  )
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Main block component                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

function WorkflowRunMonitorBlock() {
  const [runState, setRunState] = React.useState<RunState>("running")
  const [activePhaseId, setActivePhaseId] = React.useState<string | null>(
    "verify"
  )
  const [retried, setRetried] = React.useState(false)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  const phases = getPhasesForState(runState)

  // Determine which agents to show based on selected phase filter
  const agentsToShow: AgentStatusRow[] = React.useMemo(() => {
    const phaseId = activePhaseId
    if (!phaseId || phaseId === "scan") return SCAN_AGENTS
    if (phaseId === "verify") return getVerifyAgents(runState, retried)
    if (phaseId === "draft") {
      if (runState === "completed") return DRAFT_AGENTS_COMPLETE
      return []
    }
    // No filter — show active phase agents
    if (runState === "running" || runState === "paused") {
      return getVerifyAgents(runState, retried)
    }
    if (runState === "completed") return DRAFT_AGENTS_COMPLETE
    return getVerifyAgents(runState, retried)
  }, [activePhaseId, runState, retried])

  // For density rule: cap at DENSITY_THRESHOLD visible rows
  const visibleAgents = agentsToShow.slice(0, DENSITY_THRESHOLD)
  const hiddenCount = agentsToShow.length - visibleAgents.length
  const hiddenQueued = agentsToShow
    .slice(DENSITY_THRESHOLD)
    .filter((a) => a.status === "idle").length
  const hiddenRunning = agentsToShow
    .slice(DENSITY_THRESHOLD)
    .filter((a) => a.status === "working").length

  function announce(msg: string) {
    if (statusRef.current) {
      statusRef.current.textContent = msg
    }
  }

  function handleStateChange(state: RunState) {
    setRunState(state)
    setRetried(false)
    // Set sensible default phase selection per state
    if (state === "running" || state === "paused") {
      setActivePhaseId("verify")
    } else if (state === "completed") {
      setActivePhaseId("draft")
    } else if (state === "failed") {
      setActivePhaseId("verify")
    }
    const labels: Record<RunState, string> = {
      running: "Run resumed — live agents active",
      paused: "Run paused — 5 agents hold cached results",
      completed: "Run completed — all phases finished",
      failed: "Phase 2 failed — 3 of 5 verified — recovery available",
    }
    announce(labels[state])
  }

  function handleRetry() {
    setRetried(true)
    setRunState("running")
    announce("Retrying phase — incomplete agents re-running")
  }

  function handleSkipAndContinue() {
    setRunState("completed")
    setActivePhaseId("draft")
    announce("Skipped failed phase — continuing to draft report")
  }

  function handleStop() {
    setRunState("paused")
    announce("Run stopped — agents hold cached results")
  }

  function handleResume() {
    handleStateChange("running")
  }

  // The plan strip tracks where the script is: the active phase, or — when a
  // run fails — the phase it stopped in
  const activePhase =
    phases.find((p) => p.status === "active") ??
    phases.find((p) => p.status === "failed")
  const effectiveActivePhaseId = activePhase?.id ?? null

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            Workflow run monitor
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
            Track a multi-phase agent run in real time — phases, fleet health,
            cost, and recovery when a phase fails.
          </p>
        </div>
        <Badge variant="outline">Registry block</Badge>
      </div>

      {/* Demo controls */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="section-label">State</span>
        <div className="flex flex-wrap gap-1">
          {(["running", "paused", "completed", "failed"] as RunState[]).map(
            (s) => (
              <button
                key={s}
                type="button"
                data-compact-touch
                aria-pressed={runState === s}
                onClick={() => handleStateChange(s)}
                className="min-h-8 rounded-md px-2.5 py-1 text-xs text-muted-foreground capitalize transition-colors duration-150 outline-none hover:bg-muted/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-foreground/[0.04] aria-pressed:text-foreground"
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Stop button — visible while running */}
        {runState === "running" && (
          <Button
            variant="destructive"
            size="sm"
            className="ml-auto"
            onClick={handleStop}
            aria-label="Stop run"
          >
            Stop run
          </Button>
        )}
      </div>

      {/* Phase rail with the plan-as-code strip beneath it — one instrument */}
      <div className="rounded-lg border border-border/40 p-4">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Phases
        </p>
        <WorkflowPhases
          phases={phases}
          activePhaseId={activePhaseId}
          onPhaseSelect={setActivePhaseId}
          aria-label="Launch readiness audit phases"
          className={cn(
            runState === "paused" &&
              "[&_.wf-phase-pulse]:[animation-play-state:paused]"
          )}
        />
        <div className="mt-4 border-t border-border/40 pt-3">
          <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Plan
          </p>
          <PlanCode activePhaseId={effectiveActivePhaseId} />
        </div>
      </div>

      {/* Paused banner */}
      {runState === "paused" && (
        <div className="flex items-center justify-between gap-4 rounded-md border border-border/60 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Paused — 5 agents hold cached results
          </p>
          <Button variant="outline" size="sm" onClick={handleResume}>
            Resume
          </Button>
        </div>
      )}

      {/* Failed recovery banner */}
      {runState === "failed" && !retried && (
        <div className="flex flex-col gap-3 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-destructive">
            Phase 2 failed — 3 of 5 verified · progress retained
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry phase
            </Button>
            <Button variant="outline" size="sm" onClick={handleSkipAndContinue}>
              Skip and continue
            </Button>
          </div>
        </div>
      )}

      {/* Fleet table */}
      <div>
        <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {activePhaseId
            ? `${phases.find((p) => p.id === activePhaseId)?.title ?? "Phase"} — agents`
            : "All agents"}
        </p>

        {agentsToShow.length === 0 ? (
          <p className="py-3 text-sm text-muted-foreground">
            Queued — agents start when this phase begins
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/40">
            <AgentStatusTable agents={visibleAgents} />
            {hiddenCount > 0 && (
              <table className="w-full border-t border-border/40">
                <tbody>
                  <CollapsedAgentSummary
                    queued={hiddenQueued}
                    running={hiddenRunning}
                  />
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Usage meter */}
      <UsageMeter
        title="Run budget"
        description={
          runState === "paused"
            ? "Cost frozen while paused — resume continues from cached state"
            : runState === "completed"
              ? "Final run cost — all phases complete"
              : runState === "failed"
                ? "Partial cost — recovery will add to this total"
                : "Live — updating as agents complete"
        }
        items={getUsageItems(runState)}
      />

      {/* Accessibility live region */}
      <p
        ref={statusRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  )
}

export { WorkflowRunMonitorBlock }
