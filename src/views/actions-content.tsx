"use client"

import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Wrench01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Brain01Icon,
  Alert01Icon,
  GitBranchIcon,
  CheckListIcon,
  Cancel01Icon,
  DragDropIcon,
  SentIcon,
  Tick01Icon,
  TextIcon,
  CodeIcon,
  Shield01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import {
  ToolTree,
  ToolTreeTrigger,
  ToolTreeContent,
} from "@/components/ui/tool-tree"
import {
  ToolCall,
  ToolCallLabel,
  ToolCallContent,
} from "@/components/ui/tool-call"
import { Badge } from "@/components/ui/badge"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "actions-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes actions-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes actions-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 600px; opacity: 1; }
    }
    @keyframes actions-collapse {
      from { max-height: 600px; opacity: 1; }
      to { max-height: 0; opacity: 0; }
    }
    @keyframes actions-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes actions-progress {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    @keyframes actions-pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes actions-timeline-fill {
      from { width: 0%; }
      to { width: 100%; }
    }
    @keyframes actions-step-enter {
      from { opacity: 0; transform: translateX(-6px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .actions-slide-in {
      animation: actions-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .actions-expand {
      animation: actions-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .actions-fade-in {
      animation: actions-fade-in 0.2s ease forwards;
    }
    .actions-pulse-dot {
      animation: actions-pulse-dot 1.5s ease-in-out infinite;
    }
    .actions-step-enter {
      animation: actions-step-enter 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TOOL_CALLS_DATA = [
  {
    label: "Searching release artifacts",
    duration: "1.2s",
    details: [
      { key: "Query", value: "checkout launch readiness" },
      { key: "Results", value: "18 artifacts matched" },
      { key: "Scope", value: "Spring release" },
    ],
  },
  {
    label: "Loading launch brief and linked specs",
    duration: "0.4s",
    details: [
      { key: "File", value: "checkout-launch-brief.md" },
      { key: "Acceptance criteria", value: "14 tracked" },
      { key: "Linked artifacts", value: "PR, Figma, QA run, release notes" },
    ],
  },
  {
    label: "Cross-referencing rollout checklist",
    duration: "3.4s",
    details: [
      { key: "Checklist items", value: "27 mapped" },
      { key: "Open gaps", value: "2 (rollback note, analytics QA)" },
    ],
  },
  {
    label: "Generating launch review summary",
    duration: "0.9s",
    details: [
      { key: "Coverage", value: "92% of launch checks complete" },
      { key: "Output", value: "launch-review-2026-04.md" },
    ],
  },
]

const ERROR_TOOL = {
  label: "Checking preview environment health",
  duration: "8.2s",
  error:
    "Connection timed out — the preview environment did not respond within 8 seconds during smoke checks.",
}

const SUBAGENT_TOOLS = [
  {
    label: "Checking design review evidence",
    duration: "1.8s",
    details: [
      { key: "Artifacts", value: "Figma file, annotated screenshots" },
      { key: "Status", value: "All linked and current" },
    ],
  },
  {
    label: "Checking QA evidence",
    duration: "0.9s",
    details: [
      { key: "Artifacts", value: "Regression report, smoke checklist" },
      { key: "Status", value: "Complete" },
    ],
  },
  {
    label: "Checking analytics readiness",
    duration: "4.2s",
    details: [
      { key: "Artifacts", value: "Tracking plan, dashboard links" },
      { key: "Status", value: "Pending — 2 events need verification" },
    ],
  },
]

const PLAN_STEPS = [
  "Load launch brief",
  "Parse acceptance criteria",
  "Map PRs and designs to checks",
  "Identify launch gaps",
  "Generate summary",
  "Review with team",
]

const PARALLEL_TASKS = [
  {
    label: "Checking current git status in the project",
    details: [
      { key: "Working dir", value: "/workspace/web-app" },
      { key: "Modified files", value: "3 (checkout.tsx, pricing.ts, release-notes.md)" },
      { key: "Untracked", value: "1 (launch-checklist-2026-04.csv)" },
    ],
  },
  {
    label: "Checking remote configuration",
    details: [
      { key: "Remote", value: "origin → github.com/acme/web-app" },
      { key: "Branch", value: "main (up to date)" },
      { key: "Last push", value: "2026-04-09 09:41 UTC" },
    ],
  },
  {
    label: "Reading rollout checklist definitions",
    details: [
      { key: "File", value: "launch-checklist.json" },
      { key: "Checks parsed", value: "27 requirements" },
      { key: "Groups", value: "UX, QA, DATA, REL, A11Y" },
    ],
  },
]

const APPROVAL_EMAIL = {
  recipient: "product-team@acme.dev",
  subject: "Launch review — Checkout spring release",
  body: "Please find attached the launch review summary for the Checkout spring release. It includes open rollout risks, unresolved QA items, analytics checks, and recommended next actions before wider release.",
}

const APPROVAL_CHANGES = [
  { type: "add" as const, text: "Added rollback checklist for the checkout experiment" },
  { type: "add" as const, text: "Added smoke test for failed-card recovery" },
  { type: "remove" as const, text: "Removed stale screenshot from the handoff note" },
  { type: "add" as const, text: "Added analytics verification note for checkout_completed" },
  { type: "remove" as const, text: "Removed placeholder launch owner field" },
]

const DECISION_OPTIONS = [
  {
    title: "Block release",
    desc: "Keep the launch gated until the missing rollout checks are resolved.",
    consequence: "Impact: Release stays internal-only until blockers are cleared.",
  },
  {
    title: "Request changes",
    desc: "Send a targeted follow-up to engineering and design with a short deadline.",
    consequence: "Impact: Launch is paused while the team closes the identified gaps.",
  },
  {
    title: "Track as follow-up",
    desc: "Proceed with launch but log the issue as a scheduled follow-up item.",
    consequence: "Impact: No immediate delay, but risk is carried into the next release review.",
  },
]

/* ------------------------------------------------------------------ */
/*  Controls component                                                 */
/* ------------------------------------------------------------------ */

function Controls({
  options,
  active,
  onToggle,
}: {
  options: { key: string; label: string }[]
  active: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-5">
      <span className="section-label mr-1">Controls</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className={`
            relative text-xs px-2.5 py-1 rounded-md border transition-all duration-200
            ${active[opt.key]
              ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
        >
          {opt.label}
          {active[opt.key] && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
          )}
        </button>
      ))}
    </div>
  )
}


/* ------------------------------------------------------------------ */
/*  PlanStep sub-component                                             */
/* ------------------------------------------------------------------ */

function PlanStep({
  index,
  label,
  state,
  editable,
  onRemove,
}: {
  index: number
  label: string
  state: "done" | "active" | "pending"
  editable?: boolean
  onRemove?: () => void
}) {
  return (
    <div className="actions-step-enter flex items-center gap-2.5 py-1 group">
      {editable && (
        <HugeiconsIcon
          icon={DragDropIcon}
          size={12}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground/30 cursor-grab"
        />
      )}
      <div
        className={`h-1.5 w-1.5 shrink-0 rounded-sm ${
          state === "done"
            ? "bg-muted-foreground"
            : state === "active"
              ? "bg-foreground actions-pulse-dot"
              : "bg-muted-foreground/30"
        }`}
      />
      <span
        className={`text-sm flex-1 ${
          state === "done"
            ? "text-muted-foreground line-through"
            : state === "active"
              ? "text-foreground"
              : "text-muted-foreground/60"
        }`}
      >
        {index + 1}. {label}
      </span>
      {editable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-foreground transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function ActionsContent() {
  useEffect(ensureStyles, [])

  /* ── Section 1: Tool Calls state ── */
  const [toolState, setToolState] = useState({ expandAll: false, error: false, grouped: false })

  const toggleToolControl = useCallback((key: string) => {
    setToolState((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }, [])

  /* ── Section 2: Subagent state ── */
  const [subagentState, setSubagentState] = useState({ running: true, complete: false })
  const [subagentProgress, setSubagentProgress] = useState(0)
  const [subagentOpen, setSubagentOpen] = useState(true)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const toggleSubagentControl = useCallback((key: string) => {
    setSubagentState((prev) => {
      if (key === "running") {
        return { running: !prev.running, complete: false }
      }
      if (key === "complete") {
        return { running: false, complete: !prev.complete }
      }
      return prev
    })
  }, [])

  useEffect(() => {
    if (progressRef.current) clearInterval(progressRef.current)
    if (subagentState.complete) {
      setSubagentProgress(8)
      return
    }
    if (subagentState.running) {
      setSubagentProgress(0)
      progressRef.current = setInterval(() => {
        setSubagentProgress((prev) => {
          if (prev >= 8) {
            if (progressRef.current) clearInterval(progressRef.current)
            return 8
          }
          return prev + 1
        })
      }, 600)
      return () => {
        if (progressRef.current) clearInterval(progressRef.current)
      }
    } else {
      setSubagentProgress(0)
    }
  }, [subagentState.running, subagentState.complete])

  /* ── Section 3: Plan Cards state ── */
  const [planState, setPlanState] = useState({ executing: true, editable: false })
  const [planSteps, setPlanSteps] = useState(PLAN_STEPS)
  const [activeStep, setActiveStep] = useState(3) // 0-indexed, step 4 is active

  const togglePlanControl = useCallback((key: string) => {
    setPlanState((prev) => {
      if (key === "executing") return { executing: !prev.executing, editable: false }
      if (key === "editable") return { executing: false, editable: !prev.editable }
      return prev
    })
    if (key === "editable") {
      setPlanSteps(PLAN_STEPS)
      setActiveStep(3)
    }
  }, [])

  const removePlanStep = useCallback((idx: number) => {
    setPlanSteps((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const movePlanStep = useCallback((idx: number, dir: -1 | 1) => {
    setPlanSteps((prev) => {
      const arr = [...prev]
      const target = idx + dir
      if (target < 0 || target >= arr.length) return arr
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }, [])

  /* ── Section 4: Parallel Execution state ── */
  const [parallelState, setParallelState] = useState({ sequential: false, parallel: true })
  const [treeOpen, setTreeOpen] = useState(true)
  const [childExpanded, setChildExpanded] = useState<Record<number, boolean>>({})
  const [parallelAnim, setParallelAnim] = useState(0)

  const toggleParallelControl = useCallback((key: string) => {
    setParallelState(() => {
      if (key === "sequential") return { sequential: true, parallel: false }
      return { sequential: false, parallel: true }
    })
    setTreeOpen(true)
    setChildExpanded({})
    setParallelAnim((p) => p + 1)
  }, [])

  const toggleChildExpand = useCallback((idx: number) => {
    setChildExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }, [])

  /* ── Section 5: Decision Flow state ── */
  const [decisionState, setDecisionState] = useState({ pending: true, resolved: false })
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const toggleDecisionControl = useCallback((key: string) => {
    if (key === "pending") {
      setDecisionState({ pending: true, resolved: false })
      setSelectedOption(null)
    } else {
      setDecisionState({ pending: false, resolved: true })
      setSelectedOption(1)
    }
  }, [])

  /* ── Section 6: Structured Ask state ── */
  const [askState, setAskState] = useState({ open: true, answered: false })
  const [askInput, setAskInput] = useState("")
  const [askSubmitted, setAskSubmitted] = useState(false)

  const toggleAskControl = useCallback((key: string) => {
    if (key === "open") {
      setAskState({ open: true, answered: false })
      setAskInput("")
      setAskSubmitted(false)
    } else {
      setAskState({ open: false, answered: true })
      setAskInput("High-risk launch with staged rollout and rollback ready")
      setAskSubmitted(true)
    }
  }, [])

  const handleAskSubmit = useCallback(() => {
    if (!askInput.trim()) return
    setAskSubmitted(true)
    setAskState({ open: false, answered: true })
  }, [askInput])

  /* ── Section 7: Approval Gate state ── */
  const [approvalCtrl, setApprovalCtrl] = useState({ email: true, changes: false })
  const [approvalAnim, setApprovalAnim] = useState(0)
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "denied">("pending")

  const toggleApprovalControl = useCallback((key: string) => {
    setApprovalCtrl(() => {
      if (key === "email") return { email: true, changes: false }
      return { email: false, changes: true }
    })
    setApprovalStatus("pending")
    setApprovalAnim((p) => p + 1)
  }, [])

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Agent Actions
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Tool calls, subagent orchestration, parallel execution, plan cards,
          structured asks, decision flows, and approval gates for agent-driven
          certification and compliance workflows.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Tool Calls                                      */}
      {/* ============================================================ */}
      <section id="tool-calls" className="page-section">
        <p className="section-label mb-3">Actions</p>
        <h2 className="text-xl font-semibold tracking-tight">Tool Calls</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Expandable, human-readable action indicators. Each tool call shows a
          plain-language label — never a function signature. Click to reveal
          key-value details.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "expandAll", label: "Expand All" },
              { key: "error", label: "Error State" },
              { key: "grouped", label: "Grouped" },
            ]}
            active={toolState}
            onToggle={toggleToolControl}
          />

          <div className="border border-border/40 rounded-lg p-6">
            <div className={`space-y-1.5 ${toolState.grouped ? "border-l-2 border-border pl-3" : ""}`}>
              {toolState.error ? (
                <>
                  <ToolCall icon={Wrench01Icon} status="completed" timestamp={TOOL_CALLS_DATA[0].duration}>
                    <ToolCallLabel>{TOOL_CALLS_DATA[0].label}</ToolCallLabel>
                    <ToolCallContent>
                      <div className="space-y-1 text-xs">
                        {TOOL_CALLS_DATA[0].details.map((d) => (
                          <div key={d.key} className="flex gap-2">
                            <span className="text-muted-foreground">{d.key}:</span>
                            <span className="text-foreground">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </ToolCallContent>
                  </ToolCall>
                  <ToolCall icon={Wrench01Icon} status="failed" error={ERROR_TOOL.error} timestamp={ERROR_TOOL.duration}>
                    <ToolCallLabel>{ERROR_TOOL.label}</ToolCallLabel>
                  </ToolCall>
                </>
              ) : (
                TOOL_CALLS_DATA.map((tool) => (
                  <ToolCall key={tool.label} icon={Wrench01Icon} status="completed" timestamp={tool.duration}>
                    <ToolCallLabel>{tool.label}</ToolCallLabel>
                    <ToolCallContent>
                      <div className="space-y-1 text-xs">
                        {tool.details.map((d) => (
                          <div key={d.key} className="flex gap-2">
                            <span className="text-muted-foreground">{d.key}:</span>
                            <span className="text-foreground">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </ToolCallContent>
                  </ToolCall>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Property
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Tool title", "14px sans, font-weight 400 (never bold)"],
              ["Inner detail text", "12px, key in muted, value in foreground"],
              ["Icons", "All monochrome — no colored status indicators"],
              ["Labels", "Human-readable only — no function signatures or code"],
              ["Duration", "Right-aligned in muted text; errors show \"failed ·\" prefix"],
              ["Interaction", "Click anywhere on the header row to expand/collapse"],
            ].map(([prop, spec], i, arr) => (
              <tr key={prop} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 pr-6 font-medium">{prop}</td>
                <td className="py-3 text-muted-foreground">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Tool calls should feel like quiet status updates, not system logs.
          The user glances at them during execution and digs in only when
          something looks wrong.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Subagent Orchestration                          */}
      {/* ============================================================ */}
      <section id="subagents" className="page-section">
        <p className="section-label mb-3">Orchestration</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Subagent Orchestration
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Expandable cards showing delegated subagent work. Each card contains
          its own progress indicator and nested tool calls.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "running", label: "Running" },
              { key: "complete", label: "Complete" },
            ]}
            active={subagentState}
            onToggle={toggleSubagentControl}
          />

          <div className="border border-border/40 rounded-lg p-6">
            <div className="rounded-md border border-border/40">
              <button
                type="button"
                onClick={() => setSubagentOpen(!subagentOpen)}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
              >
                <HugeiconsIcon
                  icon={Brain01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-muted-foreground"
                />
                <span className="text-sm font-normal">
                  Evidence Verification Agent
                </span>
                <Badge variant="secondary" className="shrink-0">
                  {subagentProgress >= 8
                    ? "complete"
                    : `${subagentProgress} of 8 families`}
                </Badge>
                {subagentState.running && subagentProgress < 8 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 actions-pulse-dot" />
                )}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={12}
                  strokeWidth={1.5}
                  className={`ml-auto shrink-0 text-muted-foreground transition-transform duration-200 ${
                    subagentOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {subagentOpen && (
                <div className="actions-expand border-t border-border/40 px-3 py-3 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Validating completeness and traceability of launch evidence
                    across design, implementation, QA, and rollout.
                  </p>
                  {/* Progress bar */}
                  <div className="h-1 rounded-md bg-muted">
                    <div
                      className="h-1 rounded-md bg-foreground/40 transition-all duration-500"
                      style={{ width: `${(subagentProgress / 8) * 100}%` }}
                    />
                  </div>
                  {/* Nested tool calls */}
                  <div className="mt-2 space-y-1.5 pl-2 border-l border-border/60">
                    {SUBAGENT_TOOLS.map((tool) => (
                      <ToolCall key={tool.label} icon={Wrench01Icon} status="completed" timestamp={tool.duration}>
                        <ToolCallLabel>{tool.label}</ToolCallLabel>
                        <ToolCallContent>
                          <div className="space-y-1 text-xs">
                            {tool.details.map((d) => (
                              <div key={d.key} className="flex gap-2">
                                <span className="text-muted-foreground">{d.key}:</span>
                                <span className="text-foreground">{d.value}</span>
                              </div>
                            ))}
                          </div>
                        </ToolCallContent>
                      </ToolCall>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Property
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Progress format", "\"N of M unit\" — concrete, not percentage-based"],
              ["Completion", "\"complete\" badge replaces the progress count"],
              ["Running indicator", "Pulsing dot next to the badge while in-progress"],
              ["Nesting", "Nested tool calls inherit the same collapsed style"],
              ["Progress bar", "1px foreground/40 bar with transition-all duration-500"],
            ].map(([prop, spec], i, arr) => (
              <tr key={prop} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 pr-6 font-medium">{prop}</td>
                <td className="py-3 text-muted-foreground">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Subagent cards let users monitor delegated work without leaving
          their current context. The progress bar provides glanceable status
          while nested tools offer drill-down detail.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Plan Cards                                      */}
      {/* ============================================================ */}
      <section id="plans" className="page-section">
        <p className="section-label mb-3">Planning</p>
        <h2 className="text-xl font-semibold tracking-tight">Plan Cards</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Step-progress cards that show the agent's execution plan. Completed
          steps are muted with line-through; the current step pulses subtly;
          pending steps are dimmed.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "executing", label: "Executing" },
              { key: "editable", label: "Editable" },
            ]}
            active={planState}
            onToggle={togglePlanControl}
          />

          <div className="border border-border/40 rounded-lg p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CheckListIcon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">
                  CC Evaluation Coverage Report
                </span>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {planState.executing
                  ? `${Math.min(activeStep, planSteps.length)} of ${planSteps.length} complete`
                  : planState.editable
                    ? `${planSteps.length} steps`
                    : `${planSteps.length} steps`}
              </Badge>
            </div>

            <div className="space-y-0">
              {planSteps.map((step, i) => {
                let state: "done" | "active" | "pending" = "pending"
                if (planState.executing) {
                  if (i < activeStep) state = "done"
                  else if (i === activeStep) state = "active"
                  else state = "pending"
                }

                return (
                  <PlanStep
                    key={`${step}-${i}`}
                    index={i}
                    label={step}
                    state={planState.editable ? "pending" : state}
                    editable={planState.editable}
                    onRemove={
                      planState.editable ? () => removePlanStep(i) : undefined
                    }
                  />
                )
              })}
            </div>

            {planState.editable && (
              <div className="mt-3 flex gap-2 actions-fade-in">
                <button
                  type="button"
                  onClick={() => movePlanStep(0, 1)}
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                >
                  Reorder steps
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPlanSteps((prev) => [...prev, "New step"])
                  }
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                >
                  + Add step
                </button>
              </div>
            )}

            {planState.executing && (
              <div className="mt-3 flex gap-2 actions-fade-in">
                <button
                  type="button"
                  onClick={() =>
                    setActiveStep((prev) =>
                      prev < planSteps.length ? prev + 1 : prev,
                    )
                  }
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                >
                  Advance step
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Property
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Step indicator", "6px square dot, rounded-sm — not a checkbox or number"],
              ["Done state", "Muted foreground + line-through"],
              ["Active state", "Foreground + pulse animation"],
              ["Pending state", "Muted foreground at 60% opacity"],
              ["Editable mode", "Drag handle + remove button on hover per step"],
              ["Progress badge", "\"N of M complete\" or step count in editable mode"],
            ].map(([prop, spec], i, arr) => (
              <tr key={prop} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 pr-6 font-medium">{prop}</td>
                <td className="py-3 text-muted-foreground">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Plan cards give users a sense of progress and predictability. The
          editable mode allows corrections before the agent commits to an
          approach — a key trust-building pattern.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Parallel Execution                              */}
      {/* ============================================================ */}
      <section id="parallel" className="page-section">
        <p className="section-label mb-3">Concurrency</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Parallel Execution
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          IDE-style tree connectors for operations running concurrently.
          The parent row collapses the branch; each child expands to show
          tool call details inline.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "sequential", label: "Sequential" },
              { key: "parallel", label: "Parallel" },
            ]}
            active={parallelState}
            onToggle={toggleParallelControl}
          />

          <div key={parallelAnim} className="border border-border/40 rounded-lg p-6">
            {parallelState.parallel ? (
              <div className="actions-slide-in">
                <ToolTree open={treeOpen} onOpenChange={setTreeOpen}>
                  <ToolTreeTrigger icon={GitBranchIcon} timestamp="10:44 AM · 1s">
                    Running tasks in parallel
                  </ToolTreeTrigger>
                  <ToolTreeContent>
                    {PARALLEL_TASKS.map((task) => (
                      <ToolCall key={task.label} icon={TextIcon} status="completed" timestamp="10:44 AM · 1s">
                        <ToolCallLabel>{task.label}</ToolCallLabel>
                        <ToolCallContent>
                          <div className="space-y-1 text-xs">
                            {task.details.map((d) => (
                              <div key={d.key} className="flex gap-2">
                                <span className="text-muted-foreground">{d.key}:</span>
                                <span className="text-foreground">{d.value}</span>
                              </div>
                            ))}
                          </div>
                        </ToolCallContent>
                      </ToolCall>
                    ))}
                  </ToolTreeContent>
                </ToolTree>
              </div>
            ) : (
              /* Sequential mode — flat list */
              <div className="actions-slide-in">
                <div className="flex items-center gap-2.5 mb-3">
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground">
                    Running {PARALLEL_TASKS.length} tasks sequentially
                  </span>
                </div>

                <div className="space-y-1">
                  {PARALLEL_TASKS.map((task, i) => (
                    <div key={task.label}>
                      <button
                        type="button"
                        onClick={() => toggleChildExpand(i)}
                        className="flex w-full items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
                      >
                        <HugeiconsIcon
                          icon={CodeIcon}
                          size={13}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm font-normal text-muted-foreground">
                          {task.label}
                        </span>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={11}
                          strokeWidth={1.5}
                          className={`ml-auto shrink-0 text-muted-foreground/50 transition-transform duration-200 ${
                            childExpanded[i] ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      {childExpanded[i] && (
                        <div className="actions-expand ml-[21px] mt-1 mb-1">
                          <div className="space-y-1 rounded-md border border-border/40 px-3 py-2.5">
                            {task.details.map((d) => (
                              <div key={d.key} className="flex gap-2 text-xs">
                                <span className="text-muted-foreground">{d.key}:</span>
                                <span className="text-foreground">{d.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Element
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Vertical spine", "1px line from parent icon to last child, masked by bg-background behind each icon"],
              ["L-connectors", "rounded-bl-lg border-l + border-b connecting spine to each child"],
              ["Icon masking", "size-6 bg-background circle behind size-5 icon creates clean spine breaks"],
              ["Hover state", "Row label and icon transition to text-foreground; timestamp fades in on right"],
              ["Last child", "bg-background mask covers spine below the final L-bend"],
              ["Sequential fallback", "Flat list of bordered rows, no tree connectors"],
            ].map(([el, spec], i, arr) => (
              <tr key={el} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 pr-6 font-medium">{el}</td>
                <td className="py-3 text-muted-foreground">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The tree view uses Perplexity-style connectors — a vertical spine
          with L-shaped branch lines, icons that mask the spine for clean
          breaks, and hover-revealed timestamps. Each child row is
          lightweight: no borders, no cards, just text and an expand chevron.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Decision Flow                                   */}
      {/* ============================================================ */}
      <section id="decisions" className="page-section">
        <p className="section-label mb-3">Decisions</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Decision Flow
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          When the agent needs the user to choose between options that have
          different consequences. Each option shows what will happen if
          selected.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "pending", label: "Pending" },
              { key: "resolved", label: "Resolved" },
            ]}
            active={decisionState}
            onToggle={toggleDecisionControl}
          />

          <div className="border border-border/40 rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-2">
              <HugeiconsIcon
                icon={Alert01Icon}
                size={14}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-muted-foreground"
              />
              <p className="text-sm">
                How should I handle the missing launch audit events for checkout_completed?
              </p>
            </div>

            {decisionState.pending ? (
              <div className="space-y-2">
                {DECISION_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => {
                      setSelectedOption(i)
                      setDecisionState({ pending: false, resolved: true })
                    }}
                    className={`w-full rounded-md border p-3 text-left transition-colors ${
                      selectedOption === i
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <span className="text-sm font-medium">{opt.title}</span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {opt.desc}
                    </p>
                    <div className="mt-2 border-l-2 border-muted-foreground/15 pl-2.5 py-1">
                      <div className="flex items-start gap-1.5">
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={11}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0 text-muted-foreground"
                        />
                        <span className="text-[11px] text-muted-foreground">
                          {opt.consequence}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="actions-fade-in space-y-3">
                {selectedOption !== null && (
                  <div className="rounded-md border border-primary bg-primary/5 p-3">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-sm font-medium">
                        {DECISION_OPTIONS[selectedOption].title}
                      </span>
                    </div>
                    <p className="mt-1 pl-[22px] text-xs text-muted-foreground">
                      {DECISION_OPTIONS[selectedOption].desc}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="shrink-0"
                  />
                  <span>Decision confirmed — proceeding with selected action</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Pattern
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Pending state", "All options clickable with hover effect and consequence preview"],
              ["Resolved state", "Selected option highlighted, others hidden, confirmation shown"],
              ["Selected card", "Primary border + subtle primary background tint"],
              ["Consequence previews", "Border-left callout with arrow indicator inside each option"],
              ["Auto-selection", "Never auto-select — always wait for explicit user choice"],
            ].map(([pat, spec], i, arr) => (
              <tr key={pat} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 pr-6 font-medium">{pat}</td>
                <td className="py-3 text-muted-foreground">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Decisions are the highest-trust pattern in the system — they grant
          the user explicit control over how the agent proceeds. Never bypass
          them with auto-selection or hidden defaults.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Structured Ask                                  */}
      {/* ============================================================ */}
      <section id="ask-blocks" className="page-section">
        <p className="section-label mb-3">Input</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Structured Ask
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          When the agent needs specific text input from the user to proceed.
          Shows a prompt with context and a typed input field.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "open", label: "Open" },
              { key: "answered", label: "Answered" },
            ]}
            active={askState}
            onToggle={toggleAskControl}
          />

          <div className="border border-border/40 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-2">
              <HugeiconsIcon
                icon={TextIcon}
                size={14}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-muted-foreground"
              />
              <div>
                <p className="text-sm">
                  What rollout strategy should I target for this release?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This determines the level of review, the launch blast radius,
                  and the rollback expectations.
                </p>
              </div>
            </div>

            {!askSubmitted ? (
              <div className="actions-fade-in space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Target assurance level
                  </label>
                  <input
                    type="text"
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAskSubmit()
                    }}
                    placeholder="e.g., staged rollout to 10% with rollback ready"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-foreground/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAskSubmit}
                  disabled={!askInput.trim()}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    askInput.trim()
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <HugeiconsIcon
                    icon={SentIcon}
                    size={12}
                    strokeWidth={1.5}
                  />
                  Submit
                </button>
              </div>
            ) : (
              <div className="actions-fade-in space-y-3">
                <div className="rounded-md border border-primary bg-primary/5 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="shrink-0 text-muted-foreground"
                    />
                    <span className="text-sm">{askInput}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="shrink-0"
                  />
                  <span>Input received — continuing with analysis</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Property
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Open state", "Text input with placeholder, submit button disabled until input"],
              ["Answered state", "Selected answer highlighted in primary/5 card with check"],
              ["Input field", "Standard border, bg-background, focus:border-foreground/20"],
              ["Context", "Muted explanation below the question helps inform the answer"],
              ["Submit", "Enter key or button click; button disabled when empty"],
            ].map(([prop, spec], i, arr) => (
              <tr key={prop} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 pr-6 font-medium">{prop}</td>
                <td className="py-3 text-muted-foreground">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Structured asks are for when the agent needs free-text input that
          cannot be reduced to a set of predefined options. Always provide
          context so the user understands what format is expected.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 7 — Approval Gate                                   */}
      {/* ============================================================ */}
      <section id="approval-gate" className="page-section">
        <p className="section-label mb-3">Confirmation</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Approval Gate
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Human-in-the-loop confirmation before the agent performs a
          consequential action. This lens shows the gate inside action-taking
          flows. For the canonical pattern reference, see{" "}
          <Link
            href="/approval-gate"
            className="text-foreground underline underline-offset-4"
          >
            Approval Gate
          </Link>
          . The user reviews the action details and explicitly approves, denies,
          or asks for a revision.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "email", label: "Send Email" },
              { key: "changes", label: "Document Changes" },
            ]}
            active={approvalCtrl}
            onToggle={toggleApprovalControl}
          />

          <div key={approvalAnim} className="border border-border/40 rounded-lg p-6">
            {approvalCtrl.email ? (
              /* Email approval variant */
              <div className="actions-slide-in space-y-4">
                <div className="flex items-start gap-2.5">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <p className="text-sm">
                    I'd like to send the ETR submission email. Please review and approve.
                  </p>
                </div>

                {approvalStatus === "pending" && (
                  <div className="actions-fade-in space-y-4">
                    <div className="rounded-md border border-border/40 bg-muted/30 px-4 py-3 space-y-2">
                      <div className="flex gap-2 text-xs">
                        <span className="text-muted-foreground w-16 shrink-0">To</span>
                        <span className="text-foreground">{APPROVAL_EMAIL.recipient}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-muted-foreground w-16 shrink-0">Subject</span>
                        <span className="text-foreground">{APPROVAL_EMAIL.subject}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-muted-foreground w-16 shrink-0">Body</span>
                        <span className="text-muted-foreground">{APPROVAL_EMAIL.body}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setApprovalStatus("approved")}
                        className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setApprovalStatus("denied")}
                        className="rounded-md border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )}

                {approvalStatus === "approved" && (
                  <div className="actions-fade-in space-y-3">
                    <div className="rounded-md border border-primary bg-primary/5 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm">
                          Approved — sending email to {APPROVAL_EMAIL.recipient}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                    >
                      <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.5} />
                      Reset
                    </button>
                  </div>
                )}

                {approvalStatus === "denied" && (
                  <div className="actions-fade-in space-y-3">
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm">
                          Denied — email will not be sent
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                    >
                      <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.5} />
                      Reset
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Document changes variant */
              <div className="actions-slide-in space-y-4">
                <div className="flex items-start gap-2.5">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <p className="text-sm">
                    I'd like to apply these launch-readiness changes. Please review.
                  </p>
                </div>

                {approvalStatus === "pending" && (
                  <div className="actions-fade-in space-y-4">
                    <div className="rounded-md border border-border/40 bg-muted/30 px-4 py-3 space-y-1.5">
                      {APPROVAL_CHANGES.map((change, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span
                            className={`shrink-0 select-none ${
                              change.type === "add"
                                ? "text-emerald-700/70 dark:text-emerald-400/70"
                                : "text-red-700/70 dark:text-red-400/70"
                            }`}
                          >
                            {change.type === "add" ? "+" : "−"}
                          </span>
                          <span
                            className={
                              change.type === "add"
                                ? "text-emerald-800/80 dark:text-emerald-300/80"
                                : "text-red-800/80 dark:text-red-300/80"
                            }
                          >
                            {change.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setApprovalStatus("approved")}
                        className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setApprovalStatus("denied")}
                        className="rounded-md border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )}

                {approvalStatus === "approved" && (
                  <div className="actions-fade-in space-y-3">
                    <div className="rounded-md border border-primary bg-primary/5 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm">
                          Approved — applying {APPROVAL_CHANGES.filter((c) => c.type === "add").length} additions, {APPROVAL_CHANGES.filter((c) => c.type === "remove").length} removals
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                    >
                      <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.5} />
                      Reset
                    </button>
                  </div>
                )}

                {approvalStatus === "denied" && (
                  <div className="actions-fade-in space-y-3">
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm">
                          Denied — changes will not be applied
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                    >
                      <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.5} />
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Property
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Action summary", "Shield icon + plain-language description of what the agent wants to do"],
              ["Detail panel", "Muted background container with key-value or diff preview"],
              ["Diff format", "Green-ish (+) for additions, red-ish (−) for removals, muted tones"],
              ["Approve button", "Primary fill — should feel deliberate, not default"],
              ["Deny button", "Ghost/outline — lower visual weight than approve"],
              ["Result states", "Success (primary border), denied (destructive border), with reset button"],
            ].map(([prop, spec], i, arr) => (
              <tr key={prop} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 pr-6 font-medium">{prop}</td>
                <td className="py-3 text-muted-foreground">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Approval gates are the most critical trust pattern in the system.
          They ensure the agent never takes consequential actions without
          explicit human confirmation — essential for certification workflows
          where mistakes have regulatory consequences.
        </p>
      </section>
    </article>
  )
}
