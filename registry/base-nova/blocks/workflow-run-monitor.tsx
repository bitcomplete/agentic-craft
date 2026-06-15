"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UsageMeter } from "@/components/ui/usage-meter"
import {
  WorkflowPhases,
  WorkflowPhaseGlyph,
  type WorkflowPhase,
  type WorkflowAgentDot,
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

// Narrator lines — what the script surfaces via log() at each point
const LOG_LINES: Record<RunState, string> = {
  running: "14 of 29 requirements verified — delta audit one round behind",
  paused: "paused at 4:32 — journal holds 9 completed agents",
  completed: "all phases complete — 3 gaps, 0 blockers, report ready",
  failed: "verify failed after 3 automatic retries — recovery available",
}

// Phase data per run state
function getPhasesForState(
  state: RunState,
  retried?: boolean,
  skipped?: boolean
): WorkflowPhase[] {
  // A retried phase is live again: cached agents replayed, failed ones
  // re-run. Its roll-up restarts with the current attempt (1,872 cached +
  // 486 re-run = 2,358) — the failed attempt's spend lives on the meter only.
  if (state === "failed" && retried) {
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
        tokens: "2,358",
        elapsed: "0:19",
      },
      {
        id: "draft",
        title: "Draft report",
        status: "queued",
        agentCount: 1,
      },
    ]
  }
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
      // A skipped phase stays failed in the record — completion doesn't
      // rewrite what happened to it
      return [
        {
          id: "scan",
          title: "Scan sources",
          status: "done",
          agentCount: 8,
          tokens: "12,450",
          elapsed: "3:24",
        },
        skipped
          ? {
              id: "verify",
              title: "Verify findings",
              status: "failed",
              agentCount: 5,
              tokens: "4,213",
              elapsed: "1:08",
            }
          : {
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
// Eight agents to match the rail; rows beyond the density threshold collapse
// into the +N summary. Per-agent tokens sum to the phase roll-up:
// 8,530 visible + 3,920 collapsed = 12,450.
const SCAN_AGENTS: AgentStatusRow[] = [
  {
    id: "dep-scanner",
    name: "Dependency Scanner",
    role: "Maps third-party risks",
    status: "complete",
    task: "Catalogued 143 direct and transitive dependencies",
    progress: 100,
    cost: "$0.03",
    updated: "4m ago",
    detail: {
      model: "haiku",
      tokens: "1,742",
      tools: 14,
      elapsed: "0:41",
      returned: "{ deps: 143, advisories: 9, critical: 0 }",
    },
  },
  {
    id: "policy-reader",
    name: "Policy Reader",
    role: "Extracts launch requirements",
    status: "complete",
    task: "Read 6 policy documents — 29 requirements parsed",
    progress: 100,
    cost: "$0.04",
    updated: "4m ago",
    detail: {
      model: "sonnet",
      tokens: "2,201",
      tools: 21,
      elapsed: "1:12",
      output:
        "Export controls appear twice with conflicting thresholds — flagged for the verify phase.",
    },
  },
  {
    id: "source-collector",
    name: "Source Collector",
    role: "Gather project artifacts",
    status: "complete",
    task: "Collected 18 of 18 source artifacts for scope",
    progress: 100,
    cost: "$0.04",
    updated: "3m ago",
    detail: {
      model: "haiku",
      tokens: "1,408",
      tools: 12,
      elapsed: "0:58",
      returned: "{ artifacts: 18, refetched: 2 }",
    },
  },
  {
    id: "change-log-reader",
    name: "Change Log Reader",
    role: "Identifies recent deltas",
    status: "complete",
    task: "Parsed 47 commits since last audit baseline",
    progress: 100,
    cost: "$0.02",
    updated: "4m ago",
    detail: {
      model: "haiku",
      tokens: "1,217",
      tools: 9,
      elapsed: "0:47",
      returned: "{ commits: 47, exportTouching: 12 }",
    },
  },
  {
    id: "incident-checker",
    name: "Incident Checker",
    role: "Reviews prior incidents",
    status: "complete",
    task: "Scanned 847 incidents — 0 critical blockers flagged",
    progress: 100,
    cost: "$0.03",
    updated: "3m ago",
    detail: {
      model: "sonnet",
      tokens: "1,962",
      tools: 17,
      elapsed: "1:03",
      output:
        "One recurring timeout cluster in the incident archive, noted as a risk to later phases.",
    },
  },
  {
    id: "license-auditor",
    name: "License Auditor",
    role: "Checks licence compatibility",
    status: "complete",
    task: "All 143 dependency licences cleared for distribution",
    progress: 100,
    cost: "$0.02",
    updated: "4m ago",
    detail: { model: "haiku", tokens: "1,384", tools: 8, elapsed: "0:36" },
  },
  {
    id: "config-differ",
    name: "Config Differ",
    role: "Diffs environment configs",
    status: "complete",
    task: "Compared staging and production configs — 2 drifts noted",
    progress: 100,
    cost: "$0.01",
    updated: "3m ago",
    detail: { model: "haiku", tokens: "1,096", tools: 6, elapsed: "0:29" },
  },
  {
    id: "api-surface-mapper",
    name: "API Surface Mapper",
    role: "Maps public API surface",
    status: "complete",
    task: "Mapped 61 public endpoints against the export spec",
    progress: 100,
    cost: "$0.02",
    updated: "4m ago",
    detail: { model: "haiku", tokens: "1,440", tools: 11, elapsed: "0:33" },
  },
]

// Agents for phase 2 (verify) — varies by state
function getVerifyAgents(
  state: RunState,
  retried?: boolean,
  skipped?: boolean
): AgentStatusRow[] {
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
        cost: "$0.06",
        updated: "43s ago",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          tools: 13,
          elapsed: "0:52",
          returned: "{ verified: 14, of: 29 }",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "working",
        task: "Correlating 12 open deltas with requirements list",
        progress: 61,
        cost: "$0.07",
        updated: "now",
        detail: {
          model: "sonnet",
          tokens: "1,204",
          tools: 16,
          elapsed: "1:08",
          output:
            "7 of 12 map cleanly; 3 wait on the conflicting export thresholds Policy Reader flagged.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "working",
        task: "Mapping export workflow to internal control library",
        progress: 48,
        cost: "$0.05",
        updated: "now",
        detail: {
          model: "sonnet",
          tokens: "1,137",
          tools: 9,
          elapsed: "1:02",
          output:
            "11 of 29 requirements matched so far; both export threshold variants present in the library.",
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
      // The journal caches completed agent() calls only — in-flight agents
      // re-run from the start on resume; partial progress is never cached.
      {
        id: "coverage-verifier",
        name: "Coverage Verifier",
        role: "Cross-checks requirement coverage",
        status: "complete",
        task: "Verified 14 of 29 requirements — journaled",
        progress: 100,
        cost: "$0.06",
        updated: "cached",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          tools: 13,
          elapsed: "0:52",
          returned: "{ verified: 14, of: 29 }",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "idle",
        task: "Was in flight at 61% — re-runs from the start on resume",
        progress: 61,
        cost: "$0.07",
        updated: "paused",
        detail: {
          model: "sonnet",
          tokens: "1,204",
          tools: 16,
          elapsed: "1:08",
          note: "Partial progress isn’t journaled — only completed agents are cached. On resume this agent re-runs its full prompt.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "idle",
        task: "Was in flight at 48% — re-runs from the start on resume",
        progress: 48,
        cost: "$0.05",
        updated: "paused",
        detail: {
          model: "sonnet",
          tokens: "1,137",
          tools: 9,
          elapsed: "1:02",
          note: "Partial progress isn’t journaled — only completed agents are cached. On resume this agent re-runs its full prompt.",
        },
      },
      {
        id: "risk-assessor",
        name: "Risk Assessor",
        role: "Rates unverified items",
        status: "idle",
        task: "Queued — starts on resume",
        progress: 0,
        cost: "$0.00",
        updated: "paused",
      },
      {
        id: "findings-summariser",
        name: "Findings Summariser",
        role: "Prepares phase summary",
        status: "idle",
        task: "Queued — starts on resume",
        progress: 0,
        cost: "$0.00",
        updated: "paused",
      },
    ]
  }

  // Completed after a skip: the verify fleet is frozen exactly where the
  // failure left it — skipping moves the run on, it doesn't rewrite history.
  if (state === "completed" && skipped) {
    return [
      {
        id: "coverage-verifier",
        name: "Coverage Verifier",
        role: "Cross-checks requirement coverage",
        status: "complete",
        task: "Verified 14 of 29 requirements — journaled",
        progress: 100,
        cost: "$0.06",
        updated: "cached",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          tools: 13,
          elapsed: "0:52",
          returned: "{ verified: 14, of: 29 }",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "error",
        task: "Failed — phase skipped before any retry",
        progress: 61,
        cost: "$0.07",
        updated: "skipped",
        detail: {
          model: "sonnet",
          tokens: "1,204",
          tools: 16,
          elapsed: "1:08",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "error",
        task: "Failed — phase skipped before any retry",
        progress: 48,
        cost: "$0.05",
        updated: "skipped",
        detail: {
          model: "sonnet",
          tokens: "1,137",
          tools: 9,
          elapsed: "1:02",
        },
      },
      {
        id: "risk-assessor",
        name: "Risk Assessor",
        role: "Rates unverified items",
        status: "idle",
        task: "Skipped with the phase — never started, no tokens spent",
        progress: 0,
        cost: "$0.00",
        updated: "skipped",
      },
      {
        id: "findings-summariser",
        name: "Findings Summariser",
        role: "Prepares phase summary",
        status: "idle",
        task: "Skipped with the phase — never started, no tokens spent",
        progress: 0,
        cost: "$0.00",
        updated: "skipped",
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
        cost: "$0.06",
        updated: "2m ago",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          tools: 13,
          elapsed: "0:52",
          returned: "{ verified: 29, gaps: 3, blockers: 0 }",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "complete",
        task: "4 unresolved deltas escalated for review",
        progress: 100,
        cost: "$0.09",
        updated: "3m ago",
        detail: {
          model: "sonnet",
          tokens: "2,318",
          tools: 19,
          elapsed: "1:21",
          output:
            "The four unresolved changes all touch the export pipeline; the rest reconcile cleanly.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "complete",
        task: "29 requirements mapped — export workflow coverage confirmed",
        progress: 100,
        cost: "$0.07",
        updated: "3m ago",
        detail: {
          model: "sonnet",
          tokens: "2,094",
          tools: 15,
          elapsed: "1:14",
          output:
            "Both export threshold variants reconcile in the control library.",
        },
      },
      {
        id: "risk-assessor",
        name: "Risk Assessor",
        role: "Rates unverified items",
        status: "complete",
        task: "Scored 3 gaps: 2 medium, 1 low — no critical risks",
        progress: 100,
        cost: "$0.05",
        updated: "2m ago",
        detail: {
          model: "haiku",
          tokens: "1,517",
          tools: 7,
          elapsed: "0:46",
          returned: "{ medium: 2, low: 1, critical: 0 }",
        },
      },
      {
        id: "findings-summariser",
        name: "Findings Summariser",
        role: "Prepares phase summary",
        status: "complete",
        task: "Phase summary ready — 3 gaps, 0 blockers",
        progress: 100,
        cost: "$0.04",
        updated: "2m ago",
        detail: {
          model: "haiku",
          tokens: "1,106",
          tools: 5,
          elapsed: "0:38",
          output:
            "Recommends a conditional go, with the export logging gap closed before launch.",
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
        task: "Verified 14 of 29 requirements — replayed from the journal",
        progress: 100,
        cost: "$0.06",
        updated: "cached",
        detail: {
          model: "sonnet",
          tokens: "1,872",
          tools: 13,
          elapsed: "0:52",
          returned: "{ verified: 14, of: 29 }",
          note: "Replayed instantly from the run journal — completed agents are never re-run on retry.",
        },
      },
      {
        id: "delta-auditor",
        name: "Delta Auditor",
        role: "Flags unresolved changes",
        status: "working",
        task: "Re-running in full — the archive is reachable again",
        progress: 38,
        cost: "$0.03",
        updated: "now",
        detail: {
          model: "sonnet",
          tokens: "486",
          tools: 4,
          elapsed: "0:19",
          note: "A failed agent keeps nothing — this run starts over from the original prompt.",
        },
      },
      {
        id: "requirements-mapper",
        name: "Requirements Mapper",
        role: "Map requirements to controls",
        status: "idle",
        task: "Queued — waits on delta results before re-running",
        progress: 0,
        cost: "$0.00",
        updated: "just now",
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

  // failed, not retried — completed agents stay cached; failed agents
  // exhausted their 3 automatic retries and re-run on Retry phase
  return [
    {
      id: "coverage-verifier",
      name: "Coverage Verifier",
      role: "Cross-checks requirement coverage",
      status: "complete",
      task: "Verified 14 of 29 requirements — journaled, survives retry",
      progress: 100,
      cost: "$0.06",
      updated: "cached",
      detail: {
        model: "sonnet",
        tokens: "1,872",
        tools: 13,
        elapsed: "0:52",
        returned: "{ verified: 14, of: 29 }",
      },
    },
    {
      id: "delta-auditor",
      name: "Delta Auditor",
      role: "Flags unresolved changes",
      status: "error",
      task: "Failed: incident archive unavailable — 3 automatic retries exhausted",
      progress: 61,
      cost: "$0.07",
      updated: "just now",
      detail: {
        model: "sonnet",
        tokens: "1,204",
        tools: 16,
        elapsed: "1:08",
        note: "An agent re-runs whole or not at all — Retry phase starts this one over.",
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
        tools: 9,
        elapsed: "1:02",
        note: "Re-runs in full when the phase is retried — a failed agent keeps nothing.",
      },
    },
    {
      id: "risk-assessor",
      name: "Risk Assessor",
      role: "Rates unverified items",
      status: "idle",
      task: "Queued — never started, no tokens spent",
      progress: 0,
      cost: "$0.00",
      updated: "1m ago",
    },
    {
      id: "findings-summariser",
      name: "Findings Summariser",
      role: "Prepares phase summary",
      status: "idle",
      task: "Queued — never started, no tokens spent",
      progress: 0,
      cost: "$0.00",
      updated: "1m ago",
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
    cost: "$0.11",
    updated: "1m ago",
    detail: {
      model: "sonnet",
      tokens: "3,129",
      tools: 12,
      elapsed: "0:47",
      output:
        "Recommends a conditional go — close the export logging gap before launch; owner assigned in annex 2.",
    },
  },
]

// Before the draft phase starts, its one agent is still a real, countable
// member of the fleet — the all-agents view and the meter agree on 14
const DRAFT_AGENTS_QUEUED: AgentStatusRow[] = [
  {
    id: "document-drafter",
    name: "Document Drafter",
    role: "Prepares final summary",
    status: "idle",
    task: "Queued — starts when verify completes",
    progress: 0,
    cost: "$0.00",
    updated: "—",
  },
]

// Draft phase after a skipped verify — the report is honest about the gap
const DRAFT_AGENTS_SKIPPED: AgentStatusRow[] = [
  {
    id: "document-drafter",
    name: "Document Drafter",
    role: "Prepares final summary",
    status: "complete",
    task: "Report drafted from partial verification — gap annex added",
    progress: 100,
    cost: "$0.11",
    updated: "1m ago",
    detail: {
      model: "sonnet",
      tokens: "3,129",
      tools: 12,
      elapsed: "0:47",
      output:
        "Recommends holding launch until the 15 unverified requirements are checked — the gap annex lists each one with an owner.",
    },
  },
]

// Usage meter data by state
function getUsageItems(state: RunState, retried?: boolean, skipped?: boolean) {
  if (state === "failed" && retried) {
    return [
      {
        id: "tokens",
        label: "Tokens used",
        value: 55,
        valueLabel: "17,149",
        limitLabel: "31k run budget",
      },
      {
        id: "cost",
        label: "Cost",
        value: 32,
        valueLabel: "$0.38",
        limitLabel: "$1.20 run cap",
      },
      {
        id: "agents",
        label: "Agents complete",
        value: 64,
        valueLabel: "9 / 14",
        limitLabel: "1 cached replay · 1 re-running",
      },
    ]
  }
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
        value: 64,
        valueLabel: "9 / 14",
        limitLabel: "2 running · 3 queued",
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
        value: 64,
        valueLabel: "9 / 14",
        limitLabel: "2 in-flight re-run on resume",
      },
    ]
  }
  if (state === "completed") {
    // Skipped completion costs less and finishes fewer agents — the meter
    // carries the same record the phase rail does
    if (skipped) {
      return [
        {
          id: "tokens",
          label: "Tokens used",
          value: 64,
          valueLabel: "19,792",
          limitLabel: "31k run budget",
        },
        {
          id: "cost",
          label: "Cost",
          value: 38,
          valueLabel: "$0.46",
          limitLabel: "$1.20 run cap",
        },
        {
          id: "agents",
          label: "Agents complete",
          value: 71,
          valueLabel: "10 / 14",
          limitLabel: "2 failed · 2 skipped with the phase",
        },
      ]
    }
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
      value: 64,
      valueLabel: "9 / 14",
      limitLabel: "2 failed — recovery available",
    },
  ]
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Plan-as-provenance                                                     */
/* ──────────────────────────────────────────────────────────────────────── */

// One dot per agent in the phase — the fleet minimap Claude's own surfaces
// draw on each phase row. Derived from the real agent lists.
function getPhaseAgentStatuses(
  phaseId: string,
  state: RunState,
  retried: boolean,
  skipped: boolean
): AgentStatusRow["status"][] {
  if (phaseId === "scan") return SCAN_AGENTS.map((a) => a.status)
  if (phaseId === "verify")
    return getVerifyAgents(state, retried, skipped).map((a) => a.status)
  return getDraftAgents(state, skipped).map((a) => a.status)
}

// Agents for phase 3 (draft) — queued until the run completes
function getDraftAgents(state: RunState, skipped?: boolean): AgentStatusRow[] {
  if (state !== "completed") return DRAFT_AGENTS_QUEUED
  return skipped ? DRAFT_AGENTS_SKIPPED : DRAFT_AGENTS_COMPLETE
}

const AGENT_DOT: Record<AgentStatusRow["status"], WorkflowAgentDot> = {
  complete: "done",
  working: "running",
  handoff: "running",
  idle: "queued",
  blocked: "queued",
  error: "failed",
}

/* The orchestration script — provenance, not surface. Rendered only inside
   the Plan disclosure, with phase glyphs in the gutter and a band tracking
   the live phase. */
function PlanScript({
  phases,
  effectiveActivePhaseId,
  paused,
}: {
  phases: WorkflowPhase[]
  effectiveActivePhaseId: string | null
  paused: boolean
}) {
  return (
    <div className="font-mono text-xs leading-5 text-muted-foreground">
      {PLAN_LINES.map((line, i) => {
        const isHighlighted =
          line.phaseId !== null && line.phaseId === effectiveActivePhaseId
        const startsBand =
          isHighlighted && PLAN_LINES[i - 1]?.phaseId !== line.phaseId
        const endsBand =
          isHighlighted && PLAN_LINES[i + 1]?.phaseId !== line.phaseId
        const startsPhase =
          line.phaseId !== null && PLAN_LINES[i - 1]?.phaseId !== line.phaseId
        const phase = startsPhase
          ? phases.find((p) => p.id === line.phaseId)
          : undefined
        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 px-2",
              isHighlighted && "bg-muted",
              startsBand && "rounded-t-sm",
              endsBand && "rounded-b-sm"
            )}
          >
            {phase ? (
              <WorkflowPhaseGlyph status={phase.status} paused={paused} />
            ) : (
              <span className="size-5 shrink-0" aria-hidden="true" />
            )}
            <span
              className={cn(
                phase &&
                  (phase.status === "failed"
                    ? "text-destructive"
                    : "text-foreground")
              )}
            >
              {line.code || "\u00A0"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Density collapse row                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

const DENSITY_THRESHOLD = 5

// How long the demo retry runs before it succeeds
const RETRY_RESOLVE_MS = 3000

/* The collapsed-fleet roll-up is a real disclosure: the summary line is the
   control that reveals the rows it counts */
function CollapsedAgentSummary({
  done,
  queued,
  running,
  failed,
  tokens,
  expanded,
  onToggle,
}: {
  done: number
  queued: number
  running: number
  failed: number
  tokens?: string
  expanded: boolean
  onToggle: () => void
}) {
  const parts: string[] = []
  if (done > 0) parts.push(`${done} done`)
  if (running > 0) parts.push(`${running} running`)
  if (failed > 0) parts.push(`${failed} failed`)
  if (queued > 0) parts.push(`${queued} queued`)
  if (tokens) parts.push(`${tokens} tokens`)
  return (
    <button
      type="button"
      data-compact-touch
      aria-expanded={expanded}
      onClick={onToggle}
      className="flex min-h-9 w-full items-center gap-1.5 border-t border-border/40 px-3 py-2 text-left text-sm text-muted-foreground tabular-nums transition-colors duration-150 outline-none hover:bg-muted/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        strokeWidth={1.5}
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
          !expanded && "-rotate-90"
        )}
      />
      <span>
        {expanded
          ? "Show fewer"
          : `+${done + queued + running + failed} more: ${parts.join(" · ")}`}
      </span>
    </button>
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
  const [skipped, setSkipped] = React.useState(false)
  const [planOpen, setPlanOpen] = React.useState(false)
  const [fleetExpanded, setFleetExpanded] = React.useState(false)
  const statusRef = React.useRef<HTMLParagraphElement>(null)
  // Outcomes receive focus when the triggering control unmounts
  const pauseRef = React.useRef<HTMLButtonElement>(null)
  const resumeRef = React.useRef<HTMLButtonElement>(null)
  const logRef = React.useRef<HTMLParagraphElement>(null)
  // The demo retry resolves after a beat — kept cancellable so pausing or
  // switching scenarios never races a stale transition
  const retryTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearRetryTimer = React.useCallback(() => {
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
  }, [])
  React.useEffect(() => clearRetryTimer, [clearRetryTimer])

  const phases = getPhasesForState(runState, retried, skipped)
  // Fleet-dot minimaps, derived from the same agent lists the table renders
  const phasesWithDots = phases.map((phase) => ({
    ...phase,
    agentDots: getPhaseAgentStatuses(phase.id, runState, retried, skipped).map(
      (status) => AGENT_DOT[status]
    ),
  }))

  // Determine which agents to show based on selected phase filter.
  // No selection means all of them — the heading says "All agents" and the
  // table has to honor it: all 14, errored rows included, grouped by phase.
  const agentsToShow: AgentStatusRow[] = React.useMemo(() => {
    if (activePhaseId === "scan") return SCAN_AGENTS
    if (activePhaseId === "verify")
      return getVerifyAgents(runState, retried, skipped)
    if (activePhaseId === "draft") return getDraftAgents(runState, skipped)
    return [
      ...SCAN_AGENTS.map((a) => ({ ...a, group: "Scan sources" })),
      ...getVerifyAgents(runState, retried, skipped).map((a) => ({
        ...a,
        group: "Verify findings",
      })),
      ...getDraftAgents(runState, skipped).map((a) => ({
        ...a,
        group: "Draft report",
      })),
    ]
  }, [activePhaseId, runState, retried, skipped])

  // For density rule: cap at DENSITY_THRESHOLD visible rows. The summary row
  // carries its own roll-up so collapsed work still counts.
  const visibleAgents = fleetExpanded
    ? agentsToShow
    : agentsToShow.slice(0, DENSITY_THRESHOLD)
  const hiddenAgents = agentsToShow.slice(DENSITY_THRESHOLD)
  const hiddenCount = hiddenAgents.length
  const hiddenDone = hiddenAgents.filter((a) => a.status === "complete").length
  const hiddenQueued = hiddenAgents.filter((a) => a.status === "idle").length
  const hiddenRunning = hiddenAgents.filter(
    (a) => a.status === "working"
  ).length
  const hiddenFailed = hiddenAgents.filter((a) => a.status === "error").length
  const hiddenTokenSum = hiddenAgents.reduce(
    (sum, a) =>
      sum +
      (a.detail?.tokens ? parseInt(a.detail.tokens.replace(/,/g, ""), 10) : 0),
    0
  )
  const hiddenTokens =
    hiddenTokenSum > 0 ? hiddenTokenSum.toLocaleString("en-US") : undefined

  function announce(msg: string) {
    if (statusRef.current) {
      statusRef.current.textContent = msg
    }
  }

  function handleStateChange(state: RunState) {
    clearRetryTimer()
    setRunState(state)
    setRetried(false)
    setSkipped(false)
    setFleetExpanded(false)
    // Set sensible default phase selection per state
    if (state === "running" || state === "paused") {
      setActivePhaseId("verify")
    } else if (state === "completed") {
      setActivePhaseId("draft")
    } else if (state === "failed") {
      setActivePhaseId("verify")
    }
    const labels: Record<RunState, string> = {
      running:
        "Run resumed — cached agents replayed instantly, the rest run live",
      paused:
        "Run paused — 9 completed agents stay cached; in-flight agents re-run on resume",
      completed: "Run completed — all phases finished",
      failed:
        "Verify findings failed — completed agents cached, recovery available",
    }
    announce(labels[state])
  }

  function handleRetry() {
    setRetried(true)
    announce(
      "Retrying phase — cached agents replay, failed agents re-run in full"
    )
    // The recovery banner unmounts — hand focus to the live Pause control
    setTimeout(() => pauseRef.current?.focus(), 0)
    // The retry resolves: the re-run completes and the run finishes — the
    // journal/replay lesson gets its payoff instead of hanging mid-flight
    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null
      const pauseHadFocus = document.activeElement === pauseRef.current
      setRunState("completed")
      setRetried(false)
      setSkipped(false)
      setFleetExpanded(false)
      setActivePhaseId("draft")
      announce("Retry succeeded — verify completed, report drafted")
      // Pause unmounts on completion — the log line is the outcome
      if (pauseHadFocus) {
        setTimeout(() => logRef.current?.focus(), 0)
      }
    }, RETRY_RESOLVE_MS)
  }

  function handleSkipAndContinue() {
    setRunState("completed")
    setSkipped(true)
    setActivePhaseId("draft")
    announce(
      "Skipped failed phase — report drafted from the 14 verified requirements"
    )
    // The outcome is the record itself — focus the log line, which now
    // carries the skipped-completion entry
    setTimeout(() => logRef.current?.focus(), 0)
  }

  function handlePause() {
    clearRetryTimer()
    setRunState("paused")
    announce(
      "Run paused — the journal keeps completed agents; resume re-runs the rest"
    )
    // Pause unmounts itself — Resume is the outcome
    setTimeout(() => resumeRef.current?.focus(), 0)
  }

  function handleResume() {
    handleStateChange("running")
    // Resume unmounts itself — the live Pause control is the outcome
    setTimeout(() => pauseRef.current?.focus(), 0)
  }

  const logLine =
    runState === "failed" && retried
      ? "retrying verify — cached agents replayed instantly, 1 re-running"
      : runState === "completed" && skipped
        ? "completed with verify skipped — report flags 15 unverified requirements"
        : LOG_LINES[runState]

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
        {/* "Scenario", not "State" — the chips pick which run to demo; live
            status belongs to the phases, the log line, and the meter */}
        <span className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Scenario
        </span>
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

        {/* Pause button — visible whenever agents are live, including a
            retry. An honest verb: nothing is destroyed, the journal keeps
            completed agents and Resume replays them */}
        {(runState === "running" || (runState === "failed" && retried)) && (
          <Button
            ref={pauseRef}
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handlePause}
          >
            Pause run
          </Button>
        )}
      </div>

      {/* Phases, humanized — the run reads as phases and agents; the script
          is provenance, one disclosure away */}
      <div className="rounded-lg border border-border/40 p-4">
        {/* The run gets a visible name — a monitor should say what it's
            monitoring, not keep it in an aria-label */}
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Phases
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Launch readiness audit
          </p>
        </div>
        <WorkflowPhases
          phases={phasesWithDots}
          activePhaseId={activePhaseId}
          onPhaseSelect={(phaseId) => {
            setActivePhaseId(phaseId)
            setFleetExpanded(false)
          }}
          paused={runState === "paused"}
          aria-label="Launch readiness audit phases"
        />

        {/* Plan disclosure — like the TUI's prompt expand */}
        <div className="mt-3 border-t border-border/40 pt-2">
          <button
            type="button"
            data-compact-touch
            aria-expanded={planOpen}
            onClick={() => setPlanOpen((open) => !open)}
            className="flex min-h-8 w-full items-center gap-1.5 rounded-sm text-left text-xs text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={1.5}
              aria-hidden="true"
              className={cn(
                "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                !planOpen && "-rotate-90"
              )}
            />
            <span className="font-medium tracking-widest uppercase">Plan</span>
            <span className="font-mono text-[11px] tabular-nums">
              {`workflow script · ${PLAN_LINES.length} lines`}
            </span>
          </button>
          {planOpen && (
            <div className="mt-2">
              <PlanScript
                phases={phases}
                effectiveActivePhaseId={effectiveActivePhaseId}
                paused={runState === "paused"}
              />
            </div>
          )}
        </div>

        {/* Narrator line — what the script's log() calls surface. Also a
            programmatic focus target (tabIndex -1, no tab stop): when Skip
            or a resolved retry ends the run, the record itself is the
            outcome that receives focus */}
        <p
          ref={logRef}
          tabIndex={-1}
          className="mt-3 flex items-baseline gap-2 rounded-sm border-t border-border/40 pt-3 text-xs text-muted-foreground tabular-nums outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="shrink-0 font-mono text-[11px]" aria-hidden="true">
            log
          </span>
          <span>{logLine}</span>
        </p>
      </div>

      {/* Paused banner */}
      {runState === "paused" && (
        <div className="flex items-center justify-between gap-4 rounded-md border border-border/60 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Paused — 9 completed agents cached in the journal
          </p>
          <Button
            ref={resumeRef}
            variant="outline"
            size="sm"
            onClick={handleResume}
          >
            Resume
          </Button>
        </div>
      )}

      {/* Failed recovery banner — both paths price themselves before the
          click; Retry carries the primary weight as the recommended path */}
      {runState === "failed" && !retried && (
        <div className="flex flex-col gap-3 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-destructive">
              Verify findings failed — 14 of 29 requirements verified ·
              completed agents cached
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Retry replays 1 cached agent and re-runs 2 failed · skipping flags
              the 15 unverified requirements in the report
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" onClick={handleRetry}>
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
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {activePhaseId
              ? `${phases.find((p) => p.id === activePhaseId)?.title ?? "Phase"} — agents`
              : "All agents"}
          </p>
          {/* The re-click-to-deselect gesture is real but undiscoverable —
              this is the visible path to the whole fleet */}
          {activePhaseId && (
            <button
              type="button"
              data-compact-touch
              onClick={() => {
                setActivePhaseId(null)
                setFleetExpanded(false)
              }}
              className="shrink-0 rounded-sm text-xs text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Show all agents
            </button>
          )}
        </div>

        {agentsToShow.length === 0 ? (
          <p className="py-3 text-sm text-muted-foreground">
            Queued — agents start when this phase begins
          </p>
        ) : (
          <div className="rounded-lg border border-border/40">
            <AgentStatusTable
              agents={visibleAgents}
              aria-label={`${
                activePhaseId
                  ? (phases.find((p) => p.id === activePhaseId)?.title ??
                    "Phase")
                  : "All"
              } agents`}
            />
            {hiddenCount > 0 && (
              <CollapsedAgentSummary
                done={hiddenDone}
                queued={hiddenQueued}
                running={hiddenRunning}
                failed={hiddenFailed}
                tokens={hiddenTokens}
                expanded={fleetExpanded}
                onToggle={() => setFleetExpanded((open) => !open)}
              />
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
              ? skipped
                ? "Final run cost — verify skipped, the report carries the gap"
                : "Final run cost — all phases complete"
              : runState === "failed"
                ? "Partial cost — recovery will add to this total"
                : "Live — updating as agents complete"
        }
        items={getUsageItems(runState, retried, skipped)}
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
