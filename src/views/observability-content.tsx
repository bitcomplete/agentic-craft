"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  Alert01Icon,
  ArrowRight01Icon,
  Brain01Icon,
  Cancel01Icon,
  Clock01Icon,
  File01Icon,
  Shield01Icon,
  Tick01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
    icon: Brain01Icon,
  },
  {
    time: "1m ago",
    action: "Started requirement gap analysis for ACME Customer Portal",
    type: "message" as const,
    icon: Shield01Icon,
  },
]

const ACTIVITY_HISTORY = [
  {
    time: "11:48 AM",
    action: "Completed requirement gap analysis — 4 gaps identified",
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
    action: "Parsed Launch checklist requirement catalogue — 47 requirements",
    type: "tool" as const,
    icon: Search01Icon,
  },
  {
    time: "11:32 AM",
    action: "Source review complete for dedicated support plan",
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
    action: "Parsed Launch checklist requirement catalogue — 47 requirements",
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

const TOKEN_CONFIGS = {
  low: {
    used: 12400,
    budget: 100000,
    label: "Well within budget",
    sessions: 3,
    costEstimate: "$0.86",
  },
  medium: {
    used: 68000,
    budget: 100000,
    label: "Approaching limit",
    sessions: 14,
    costEstimate: "$4.72",
  },
  high: {
    used: 97200,
    budget: 100000,
    label: "Near budget limit",
    sessions: 28,
    costEstimate: "$6.74",
  },
}

const SESSION_SINGLE = [
  {
    role: "user" as const,
    content:
      "Check if the project brief covers all Export workflow requirements for the ACME Customer Portal.",
  },
  {
    role: "agent" as const,
    content:
      "I reviewed the Project brief v3 against Export workflow and found the export behavior specification references CSV-only export, but the latest Launch Policy v2 expects CSV and JSON exports. This is a gap that should be addressed before the review team session.",
    tool: "Searched document repository",
  },
]

const SESSION_MULTI = [
  {
    role: "user" as const,
    content:
      "Run a gap analysis on the requirement coverage for Launch checklist.",
  },
  {
    role: "agent" as const,
    content:
      "Starting the analysis. I'll cross-reference all 47 requirements from Launch checklist against the current project brief.",
    tool: "Loading requirement catalogue",
  },
  {
    role: "user" as const,
    content:
      "Focus on the network workflow requirements — integration and export sections.",
  },
  {
    role: "agent" as const,
    content:
      "Narrowing scope to network-related requirements. I found 2 gaps: Integration policy lacks a rationale for the chosen trusted channel mechanism, and Retention setting references a deprecated key size.",
    tool: "Cross-referencing project brief",
  },
  {
    role: "user" as const,
    content: "Generate a remediation report for those gaps.",
  },
  {
    role: "agent" as const,
    content:
      "Report generated with remediation steps for both gaps, including estimated effort and references to relevant policy sections. Saved as gap-remediation-2026-03.pdf.",
    tool: "Generating coverage report",
  },
]

const SESSION_AGENT_ROWS: AgentStatusRow[] = [
  {
    id: "reviewer-agent",
    name: "Review Agent",
    role: "Coordinates the session",
    status: "working",
    task: "Comparing the active request against source coverage.",
    progress: 72,
    confidence: 86,
    cost: "$0.16",
    updated: "now",
  },
  {
    id: "source-search",
    name: "Source Search",
    role: "Retrieves documents",
    status: "complete",
    task: "Found the source policy and project brief sections used in the answer.",
    progress: 100,
    confidence: 93,
    cost: "$0.04",
    updated: "12s ago",
  },
  {
    id: "timeline-logger",
    name: "Timeline Logger",
    role: "Records activity",
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
    duration: "running",
  },
]

const ERROR_LIST = [
  {
    time: "11:32 AM",
    severity: "warning" as const,
    title: "Document repository timeout",
    detail:
      "Connection to the review team document repository timed out after 30s while fetching implementation notes source package. Retried successfully on second attempt.",
  },
  {
    time: "10:15 AM",
    severity: "error" as const,
    title: "release governance conformity statement generation failed",
    detail:
      "Missing required field: product boundary description. The Project brief v3 does not include a compliant boundary diagram per release governance Annex I, Section 2.",
  },
  {
    time: "09:48 AM",
    severity: "warning" as const,
    title: "Rate limit approached",
    detail:
      "Token usage reached 85% of the daily budget during the risk scan batch. Subsequent requests were throttled to stay within limits.",
  },
]

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export function ObservabilityContent() {
  // Section 1: Activity Timeline
  const [actCtrl, setActCtrl] = useState<Record<string, boolean>>({
    live: true,
    history: false,
    filtered: false,
  })
  const [actAnim, setActAnim] = useState(0)
  const toggleAct = makeToggle(setActCtrl, setActAnim)

  // Section 2: Token Usage
  const [tokenCtrl, setTokenCtrl] = useState<Record<string, boolean>>({
    low: true,
    medium: false,
    high: false,
  })
  const [tokenAnim, setTokenAnim] = useState(0)
  const toggleToken = makeToggle(setTokenCtrl, setTokenAnim)

  // Section 3: Session Timeline
  // Section 4: Session Timeline
  const [sessionCtrl, setSessionCtrl] = useState<Record<string, boolean>>({
    single: true,
    multi: false,
  })
  const [sessionAnim, setSessionAnim] = useState(0)
  const toggleSession = makeToggle(setSessionCtrl, setSessionAnim)

  // Section 4: Error Log
  // Section 6: Error Log
  const [errCtrl, setErrCtrl] = useState<Record<string, boolean>>({
    empty: true,
    withErrors: false,
  })
  const [errAnim, setErrAnim] = useState(0)
  const toggleErr = makeToggle(setErrCtrl, setErrAnim)

  // Expanded error index
  const [expandedErr, setExpandedErr] = useState<number | null>(null)

  // Derived state
  const activeAct = Object.keys(actCtrl).find((k) => actCtrl[k]) || "live"
  const activityItems =
    activeAct === "live"
      ? ACTIVITY_LIVE
      : activeAct === "history"
        ? ACTIVITY_HISTORY
        : ACTIVITY_FILTERED
  const activeToken = Object.keys(tokenCtrl).find((k) => tokenCtrl[k]) || "low"
  const tokenCfg = TOKEN_CONFIGS[activeToken as keyof typeof TOKEN_CONFIGS]
  const activeSession =
    Object.keys(sessionCtrl).find((k) => sessionCtrl[k]) || "single"
  const sessionItems =
    activeSession === "single" ? SESSION_SINGLE : SESSION_MULTI
  const activeErr = Object.keys(errCtrl).find((k) => errCtrl[k]) || "empty"

  const tokenPct = Math.min((tokenCfg.used / tokenCfg.budget) * 100, 100)
  const isHighUsage = tokenPct > 80

  return (
    <article>
      {/* Page header */}
      <header className="mb-20">
        <p className="section-label mb-4">Observability</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Observability
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Activity timelines, token tracking, session history, and error logs
          for continuous agent oversight.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Activity Timeline                                */}
      {/* ============================================================ */}
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

          <div className="rounded-lg border border-border/40 p-6" key={actAnim}>
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
                    <HugeiconsIcon
                      icon={item.icon}
                      size={12}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{item.action}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.time}</span>
                      <Badge variant="secondary">
                        {item.type === "tool" ? "Tool call" : "Message"}
                      </Badge>
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
                Live indicator
              </TableCell>
              <TableCell className="py-3">
                Pulsing dot with "Streaming" label when in live mode
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Action types
              </TableCell>
              <TableCell className="py-3">
                Tool call and Message — displayed as muted chip badges
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

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          The activity timeline serves as the activity log audit log surface —
          every agent action is recorded with a timestamp, type classification,
          and human-readable description. Live mode streams entries as they
          occur; History and Filtered modes enable retrospective analysis during
          review team sessions.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Token Usage                                      */}
      {/* ============================================================ */}
      <section id="token-usage" className="page-section">
        <p className="section-label mb-3">Economics</p>
        <h2 className="text-xl font-semibold tracking-tight">Token Usage</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A visual meter showing token consumption against the session or daily
          budget, with cost estimates and usage warnings.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "low", label: "Low" },
              { key: "medium", label: "Medium" },
              { key: "high", label: "High" },
            ]}
            active={tokenCtrl}
            onToggle={toggleToken}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            key={tokenAnim}
          >
            <div className="mon-slide-in">
              {/* Usage header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Activity01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-sm font-medium">Token budget</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {tokenCfg.costEstimate} estimated
                </span>
              </div>

              {/* Main meter */}
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-semibold tracking-tight">
                    {tokenCfg.used.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    of {tokenCfg.budget.toLocaleString()} tokens
                  </span>
                </div>
                <Progress value={tokenPct} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{tokenCfg.label}</span>
                  <span>{Math.round(tokenPct)}% used</span>
                </div>
              </div>

              {/* Warning for high usage */}
              {isHighUsage && (
                <div className="mon-fade-in mt-4 flex items-start gap-2 border-l border-foreground/20 bg-foreground/[0.02] py-2 pl-3">
                  <HugeiconsIcon
                    icon={Alert01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div className="text-xs text-muted-foreground">
                    <p>
                      Token usage is approaching the daily budget. Subsequent
                      requests may be throttled. Consider completing the current
                      review task before starting new analyses.
                    </p>
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-border/40">
                <div className="pr-3">
                  <p className="text-xs text-muted-foreground">Sessions</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {tokenCfg.sessions}
                  </p>
                </div>
                <div className="px-3">
                  <p className="text-xs text-muted-foreground">
                    Avg. per session
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    {Math.round(
                      tokenCfg.used / tokenCfg.sessions
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="pl-3">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {(tokenCfg.budget - tokenCfg.used).toLocaleString()}
                  </p>
                </div>
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
                Usage bar
              </TableCell>
              <TableCell className="py-3">
                Height 12px, rounded-md, darkens above 80% threshold
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Warning state
              </TableCell>
              <TableCell className="py-3">
                Appears above 80% with advisory text and subtle border highlight
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Cost estimate
              </TableCell>
              <TableCell className="py-3">
                Dollar amount shown alongside token count — primary metric for
                non-technical users
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Stats grid
              </TableCell>
              <TableCell className="py-3">
                3-column layout: sessions, average per session, remaining tokens
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Token meters translate raw API consumption into a budget metaphor that
          product teams understand. The 80% warning threshold provides time to
          prioritize remaining review tasks before throttling begins —
          particularly important during time-bounded review team session
          sessions.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Session Timeline                                 */}
      {/* ============================================================ */}
      <section id="session-timeline" className="page-section">
        <p className="section-label mb-3">Conversation</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Session Timeline
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A vertical timeline showing the sequence of requests, tool calls, and
          agent responses within an review session.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "single", label: "Single Turn" },
              { key: "multi", label: "Multi Turn" },
            ]}
            active={sessionCtrl}
            onToggle={toggleSession}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            key={sessionAnim}
          >
            <div className="flex flex-col gap-0">
              {sessionItems.map((item, i) => (
                <div
                  key={`${activeSession}-${i}`}
                  className="mon-slide-in relative"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Connector line */}
                  {i < sessionItems.length - 1 && (
                    <div className="absolute top-8 bottom-0 left-3 w-px bg-border" />
                  )}

                  <div className="flex items-start gap-3 pb-4">
                    {/* Node */}
                    <div
                      className={`mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        item.role === "user"
                          ? "bg-muted"
                          : "bg-foreground/[0.06]"
                      }`}
                    >
                      <HugeiconsIcon
                        icon={
                          item.role === "user" ? ArrowRight01Icon : Brain01Icon
                        }
                        size={12}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs text-muted-foreground">
                        {item.role === "user" ? "Reviewer" : "Agent"}
                      </p>
                      {item.role === "user" ? (
                        <p className="text-sm">{item.content}</p>
                      ) : (
                        <>
                          {"tool" in item && item.tool && (
                            <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <HugeiconsIcon
                                icon={Search01Icon}
                                size={11}
                                strokeWidth={1.5}
                              />
                              <span>{item.tool}</span>
                            </div>
                          )}
                          <p
                            className="text-sm"
                            style={{
                              fontFamily: "'Source Serif 4', serif",
                              fontSize: "14px",
                              lineHeight: "22px",
                              letterSpacing: "0px",
                              fontVariationSettings: '"opsz" 12',
                              color: "var(--foreground)",
                            }}
                          >
                            {item.content}
                          </p>
                        </>
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
                Connector
              </TableCell>
              <TableCell className="py-3">
                1px vertical line between nodes, bg-border color
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Node icons
              </TableCell>
              <TableCell className="py-3">
                Arrow for reviewer, brain for agent — rounded-md 24px containers
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Agent prose
              </TableCell>
              <TableCell className="py-3">
                Source Serif 4, 14px/22px, theme-aware foreground color
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Tool annotations
              </TableCell>
              <TableCell className="py-3">
                Shown above agent response as muted text with search icon
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Session timelines provide the conversation-level audit trail that
          review team reviewers need when reviewing how an agent arrived at its
          conclusions. Multi-turn sessions show how iterative refinement (e.g.,
          narrowing scope from all requirements to just FTP/FCS families) leads
          to more targeted analysis.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Error Log                                        */}
      {/* ============================================================ */}
      <section id="error-log" className="page-section">
        <p className="section-label mb-3">Diagnostics</p>
        <h2 className="text-xl font-semibold tracking-tight">Error Log</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A filterable log of errors, warnings, and operational anomalies from
          the current review session with expandable detail views.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "empty", label: "Empty" },
              { key: "withErrors", label: "With Errors" },
            ]}
            active={errCtrl}
            onToggle={toggleErr}
          />

          <div className="rounded-lg border border-border/40 p-6" key={errAnim}>
            {activeErr === "empty" ? (
              <div className="mon-slide-in flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={18}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                </div>
                <p className="text-sm font-medium">
                  No errors in current session
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  All agent operations completed successfully since session
                  start.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {ERROR_LIST.map((err, i) => (
                  <div
                    key={i}
                    className="mon-slide-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <button
                      type="button"
                      aria-label={`Toggle error details: ${err.title}`}
                      onClick={() =>
                        setExpandedErr(expandedErr === i ? null : i)
                      }
                      className="flex w-full items-start gap-3 py-3 text-left transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <div className="mt-0.5 shrink-0">
                        <HugeiconsIcon
                          icon={
                            err.severity === "error"
                              ? Cancel01Icon
                              : Alert01Icon
                          }
                          size={14}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm">{err.title}</p>
                          <Badge variant="secondary">{err.severity}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {err.time}
                        </p>
                      </div>
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="mt-1 shrink-0 text-muted-foreground"
                      />
                    </button>

                    {expandedErr === i && (
                      <div className="mon-expand px-4 py-3">
                        <Separator className="mb-3" />
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {err.detail}
                        </p>
                      </div>
                    )}
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
                Empty state
              </TableCell>
              <TableCell className="py-3">
                Centered check icon with "No errors" message and subtitle
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Error entries
              </TableCell>
              <TableCell className="py-3">
                Clickable rows with severity badge, timestamp, and
                expand/collapse
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Severity levels
              </TableCell>
              <TableCell className="py-3">
                Warning and Error — shown as muted chip badges, no colors
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 text-muted-foreground">
                Expanded detail
              </TableCell>
              <TableCell className="py-3">
                Animated expand with full error description and context
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          The error log provides the diagnostic transparency required by
          activity review (Activity Review) — reviewers can inspect every
          operational anomaly, understand its context, and verify that the
          agent's error handling meets the product's claimed readiness level.
        </div>
      </section>
    </article>
  )
}
