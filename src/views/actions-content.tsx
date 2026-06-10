"use client"

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
  ToolCallTrigger,
  ToolCallLabel,
  ToolCallContent,
  ToolCallError,
} from "@/components/ui/tool-call"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { ActionPreview } from "@/components/ui/action-preview"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Button } from "@/components/ui/button"
import {
  ClarifyingQuestions,
  type ClarifyingQuestion,
} from "@/components/ui/clarifying-questions"
import { DecisionSurface } from "@/components/ui/decision-surface"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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

const TOOL_CALLS_DATA = [
  {
    label: "Searching document repository",
    duration: "1.2s",
    details: [
      { key: "Query", value: "active workflow requirements" },
      { key: "Results", value: "47 documents matched" },
      { key: "Scope", value: "Project brief v3" },
    ],
  },
  {
    label: "Loading project brief definitions",
    duration: "0.4s",
    details: [
      { key: "File", value: "Project-Brief-v3.pdf" },
      { key: "Requirements parsed", value: "23 requirements" },
      { key: "Review criteria parsed", value: "14 review criteria" },
    ],
  },
  {
    label: "Cross-referencing test case mappings",
    duration: "3.4s",
    details: [
      { key: "Test cases", value: "87 mapped" },
      {
        key: "Unmapped requirements",
        value: "2 (Fallback behavior, Cleanup behavior)",
      },
    ],
  },
  {
    label: "Generating coverage matrix",
    duration: "0.9s",
    details: [
      { key: "Coverage", value: "91.3% (21 of 23 requirements)" },
      { key: "Output", value: "coverage-matrix-2026-03.xlsx" },
    ],
  },
]

const ERROR_TOOL = {
  label: "Checking remote syslog connectivity",
  duration: "8.2s",
  error:
    "Connection timed out — the remote syslog server at 10.0.4.22:514 did not respond within 8 seconds.",
}

const SUBAGENT_TOOLS = [
  {
    label: "Checking configuration management source material",
    duration: "1.8s",
    details: [
      { key: "Documents", value: "CM Plan v2.3, CM Records" },
      { key: "Status", value: "All source material present" },
    ],
  },
  {
    label: "Checking delivery readiness source material",
    duration: "0.9s",
    details: [
      { key: "Documents", value: "Delivery procedures rev 4" },
      { key: "Status", value: "Complete" },
    ],
  },
  {
    label: "Checking risk review source material",
    duration: "4.2s",
    details: [
      { key: "Documents", value: "Risk analysis report" },
      { key: "Status", value: "Pending — 2 items missing" },
    ],
  },
]

const PLAN_STEPS = [
  "Load project brief",
  "Parse requirement definitions",
  "Map test cases to requirements",
  "Identify coverage gaps",
  "Generate report",
  "Review with reviewer",
]

const PARALLEL_TASKS = [
  {
    label: "Checking current git status in the project",
    details: [
      { key: "Working dir", value: "/workspace/customer-portal" },
      {
        key: "Modified files",
        value: "3 (coverage-matrix.xlsx, requirement-map.json, notes.md)",
      },
      { key: "Untracked", value: "1 (test-results-2026-03.csv)" },
    ],
  },
  {
    label: "Checking remote configuration",
    details: [
      {
        key: "Remote",
        value: "origin → git.internal/product/customer-portal",
      },
      { key: "Branch", value: "main (up to date)" },
      { key: "Last push", value: "2026-03-14 09:41 UTC" },
    ],
  },
  {
    label: "Reading requirement coverage definitions",
    details: [
      { key: "File", value: "requirement-map.json" },
      { key: "Requirements parsed", value: "23 requirements" },
      { key: "Classes", value: "Access, Export, Audit, Auth, Retention" },
    ],
  },
]

const APPROVAL_EMAIL = {
  recipient: "project-team@acme.internal",
  subject: "Launch Review — customer portal v3.1 (enterprise release)",
  body: "Please find attached the Launch Review Summary for the customer portal v3.1 project brief. This submission covers all review checklist items for enterprise release with standard support coverage. The review was conducted using the current internal launch checklist.",
}

const APPROVAL_CHANGES = [
  {
    type: "add" as const,
    text: "Added Export workflow coverage mapping for CSV and JSON exports",
  },
  {
    type: "add" as const,
    text: "Added test case TC-087 for stale export cleanup",
  },
  {
    type: "remove" as const,
    text: "Removed deprecated Access workflow iteration reference",
  },
  { type: "add" as const, text: "Added current risk review summary" },
  {
    type: "remove" as const,
    text: "Removed placeholder product boundary description",
  },
]

const DECISION_OPTIONS = [
  {
    title: "Flag as finding",
    desc: "Add to the open findings list for reviewer approval in the next review meeting.",
    consequence:
      "Impact: Adds 1 open finding to the launch summary. Requires team response within 10 days.",
    // Escalates to people — strongest accent of the three.
    accent: "border-foreground/40",
  },
  {
    title: "Request source material",
    desc: "Send an automated source request to the developer with a 5-day deadline.",
    consequence:
      "Impact: Review paused for Timestamp handling pending team response.",
    accent: "border-foreground/20",
  },
  {
    title: "Mark for later",
    desc: "Add to the deferred items list for the next review cycle.",
    consequence:
      "Impact: No immediate delay. Risk carried forward to next cycle.",
    accent: "border-muted-foreground/15",
  },
]

const CLARIFYING_OPTIONS = [
  {
    id: "support",
    title: "Support readiness",
    description: "Owners, coverage, response windows.",
  },
  {
    id: "timeline",
    title: "Timeline risk",
    description: "Release date versus review milestones.",
  },
  {
    id: "onboarding",
    title: "Enterprise onboarding",
    description: "Scope, owner, and success criteria.",
  },
  {
    id: "open-assumptions",
    title: "Open assumptions",
    description: "Unresolved decisions before drafting.",
  },
] as const

const CLARIFYING_QUESTION = {
  id: "launch-areas",
  label: "Which launch areas should I inspect before drafting findings?",
  kind: "multiple",
  options: CLARIFYING_OPTIONS.map((option) => ({
    value: option.id,
    label: option.title,
    description: option.description,
  })),
  allowOther: true,
  otherPlaceholder: "Describe a constraint, missing source, or review angle…",
  layout: "inline",
  chipPosition: "right",
  nextLabel: "Continue",
} satisfies ClarifyingQuestion

/* ------------------------------------------------------------------ */
/*  PlanStep sub-component                                             */
/* ------------------------------------------------------------------ */

function PlanStep({
  label,
  state,
  editable,
  onRemove,
}: {
  label: string
  state: "done" | "active" | "pending"
  editable?: boolean
  onRemove?: () => void
}) {
  return (
    <div className="actions-step-enter group flex items-center gap-2.5 py-1">
      {editable && (
        <HugeiconsIcon
          icon={DragDropIcon}
          size={12}
          strokeWidth={1.5}
          className="shrink-0 cursor-grab text-muted-foreground/30"
        />
      )}
      <div
        className={`h-1.5 w-1.5 shrink-0 rounded-sm ${
          state === "done"
            ? "bg-muted-foreground"
            : state === "active"
              ? "actions-pulse-dot bg-foreground"
              : "bg-muted-foreground/30"
        }`}
      />
      <span
        className={`flex-1 text-sm ${
          state === "done"
            ? "text-muted-foreground line-through"
            : state === "active"
              ? "text-foreground"
              : "text-muted-foreground/60"
        }`}
      >
        {label}
      </span>
      {editable && onRemove && (
        <Button
          type="button"
          aria-label={`Remove step: ${label}`}
          onClick={onRemove}
          variant="ghost"
          size="icon-xs"
          className="shrink-0 text-muted-foreground/40 hover:text-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
        </Button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function ActionsContent() {
  /* ── Section 1: Tool Calls state ── */
  const [toolState, setToolState] = useState({
    expandAll: false,
    error: false,
    grouped: false,
  })

  const toggleToolControl = useCallback((key: string) => {
    setToolState((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }, [])

  /* ── Section 2: Subagent state ── */
  const [subagentState, setSubagentState] = useState({
    running: true,
    complete: false,
  })
  const [subagentProgress, setSubagentProgress] = useState(0)
  const [subagentOpen, setSubagentOpen] = useState(true)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const toggleSubagentControl = useCallback(
    (key: string) => {
      if (key === "running") {
        setSubagentState({ running: !subagentState.running, complete: false })
        setSubagentProgress(0)
        return
      }
      if (key === "complete") {
        const nextComplete = !subagentState.complete
        setSubagentState({ running: false, complete: nextComplete })
        setSubagentProgress(nextComplete ? 8 : 0)
      }
    },
    [subagentState.running, subagentState.complete]
  )

  useEffect(() => {
    const stopProgress = () => {
      if (progressRef.current) {
        clearInterval(progressRef.current)
        progressRef.current = null
      }
    }

    const startProgress = () => {
      if (!subagentState.running || document.hidden || progressRef.current) {
        return
      }

      progressRef.current = setInterval(() => {
        // Loop while "Running" is selected so the demo never drifts into the
        // complete state with the Running control still pressed.
        setSubagentProgress((prev) => (prev >= 7 ? 0 : prev + 1))
      }, 600)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopProgress()
        return
      }
      startProgress()
    }

    stopProgress()
    startProgress()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      stopProgress()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [subagentState.running])

  /* ── Section 3: Plan Cards state ── */
  const [planState, setPlanState] = useState({
    executing: true,
    editable: false,
  })
  const [planSteps, setPlanSteps] = useState(PLAN_STEPS)
  const [activeStep, setActiveStep] = useState(3) // 0-indexed, step 4 is active

  const togglePlanControl = useCallback((key: string) => {
    setPlanState((prev) => {
      if (key === "executing")
        return { executing: !prev.executing, editable: false }
      if (key === "editable")
        return { executing: false, editable: !prev.editable }
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
  const [parallelState, setParallelState] = useState({
    sequential: false,
    parallel: true,
  })
  const [treeOpen, setTreeOpen] = useState(true)
  const [childExpanded, setChildExpanded] = useState<Record<number, boolean>>(
    {}
  )
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
  const [decisionState, setDecisionState] = useState({
    pending: true,
    resolved: false,
  })
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const resolvedSummaryRef = useRef<HTMLDivElement>(null)

  const toggleDecisionControl = useCallback((key: string) => {
    if (key === "pending") {
      setDecisionState({ pending: true, resolved: false })
      setSelectedOption(null)
    } else {
      setDecisionState({ pending: false, resolved: true })
      setSelectedOption(1)
    }
  }, [])

  /* ── Section 6: Clarifying Questions state ── */
  const [askState, setAskState] = useState({ open: true, answered: false })
  const [selectedClarifications, setSelectedClarifications] = useState<
    string[]
  >(["support"])
  const [askOther, setAskOther] = useState("")
  const [askSubmitted, setAskSubmitted] = useState(false)

  const toggleAskControl = useCallback((key: string) => {
    if (key === "open") {
      setAskState({ open: true, answered: false })
      setSelectedClarifications(["support"])
      setAskOther("")
      setAskSubmitted(false)
    } else {
      setAskState({ open: false, answered: true })
      setSelectedClarifications(["support", "timeline"])
      setAskOther("Enterprise release with standard support coverage")
      setAskSubmitted(true)
    }
  }, [])

  const handleAskSubmit = useCallback(() => {
    if (selectedClarifications.length === 0 && !askOther.trim()) return
    setAskSubmitted(true)
    setAskState({ open: false, answered: true })
  }, [askOther, selectedClarifications.length])

  const handleAskSkip = useCallback(() => {
    setSelectedClarifications([])
    setAskOther("")
    setAskSubmitted(true)
    setAskState({ open: false, answered: true })
  }, [])

  const answeredClarifications = [
    ...CLARIFYING_OPTIONS.filter((option) =>
      selectedClarifications.includes(option.id)
    ).map((option) => option.title),
    ...(askOther.trim() ? [`Other: ${askOther.trim()}`] : []),
  ]

  /* ── Section 7: Approval Gate state ── */
  const [approvalCtrl, setApprovalCtrl] = useState({
    email: true,
    changes: false,
  })
  const [approvalAnim, setApprovalAnim] = useState(0)
  const [approvalStatus, setApprovalStatus] = useState<
    "pending" | "approved" | "denied"
  >("pending")

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
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Agent Actions
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Tool calls, subagent orchestration, parallel execution, plan cards,
          clarifying questions, decision flows, and approval gates for
          agent-driven approval and product workflows.
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

          <div className="rounded-lg border border-border/40 p-6">
            <div
              className={`flex flex-col gap-1.5 ${toolState.grouped ? "border-l-2 border-border pl-3" : ""}`}
            >
              {toolState.error ? (
                <>
                  <ToolCall
                    key={`error-ok-${toolState.expandAll}`}
                    icon={Wrench01Icon}
                    status="completed"
                    timestamp={TOOL_CALLS_DATA[0].duration}
                    defaultExpanded={toolState.expandAll}
                  >
                    <ToolCallTrigger>
                      <ToolCallLabel>{TOOL_CALLS_DATA[0].label}</ToolCallLabel>
                    </ToolCallTrigger>
                    <ToolCallContent>
                      <div className="flex flex-col gap-1 text-xs">
                        {TOOL_CALLS_DATA[0].details.map((d) => (
                          <div key={d.key} className="flex gap-2">
                            <span className="text-muted-foreground">
                              {d.key}:
                            </span>
                            <span className="text-foreground">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </ToolCallContent>
                  </ToolCall>
                  <ToolCall
                    icon={Wrench01Icon}
                    status="failed"
                    timestamp={ERROR_TOOL.duration}
                  >
                    <ToolCallTrigger>
                      <ToolCallLabel>{ERROR_TOOL.label}</ToolCallLabel>
                    </ToolCallTrigger>
                    <ToolCallError>{ERROR_TOOL.error}</ToolCallError>
                  </ToolCall>
                </>
              ) : (
                TOOL_CALLS_DATA.map((tool) => (
                  <ToolCall
                    key={`${tool.label}-${toolState.expandAll}`}
                    icon={Wrench01Icon}
                    status="completed"
                    timestamp={tool.duration}
                    defaultExpanded={toolState.expandAll}
                  >
                    <ToolCallTrigger>
                      <ToolCallLabel>{tool.label}</ToolCallLabel>
                    </ToolCallTrigger>
                    <ToolCallContent>
                      <div className="flex flex-col gap-1 text-xs">
                        {tool.details.map((d) => (
                          <div key={d.key} className="flex gap-2">
                            <span className="text-muted-foreground">
                              {d.key}:
                            </span>
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
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["Tool title", "14px sans, font-weight 400 (never bold)"],
              ["Inner detail text", "12px, key in muted, value in foreground"],
              ["Icons", "All monochrome — no colored status indicators"],
              [
                "Labels",
                "Human-readable only — no function signatures or code",
              ],
              [
                "Duration",
                'Right-aligned in muted text; errors show "failed ·" prefix',
              ],
              [
                "Interaction",
                "Click anywhere on the header row to expand/collapse",
              ],
            ].map(([prop, spec], i, arr) => (
              <TableRow
                key={prop}
                className={
                  i < arr.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">{prop}</TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Tool calls should feel like quiet status updates, not system logs. The
          user glances at them during execution and digs in only when something
          looks wrong.
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
          Expandable rows showing delegated subagent work. Each row carries its
          own progress indicator and related tool calls.
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

          <div className="rounded-lg border border-border/40 p-6">
            <button
              type="button"
              aria-label="Toggle Source Collector details"
              onClick={() => setSubagentOpen(!subagentOpen)}
              className="flex w-full items-center gap-2.5 py-2.5 text-left"
            >
              <HugeiconsIcon
                icon={Brain01Icon}
                size={14}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground"
              />
              <span className="text-sm font-normal">Source Collector</span>
              {subagentProgress < 8 && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {subagentProgress} of 8 review areas
                </span>
              )}
              <StatusIndicator
                status={subagentProgress >= 8 ? "complete" : "active"}
              />
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
              <div className="actions-expand flex flex-col gap-2 py-3 pl-6">
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Validating completeness and traceability of review source
                  material for each review area.
                </p>
                <Progress value={(subagentProgress / 8) * 100} />
                {/* Nested tool calls */}
                <div className="mt-2 flex flex-col gap-1.5">
                  {SUBAGENT_TOOLS.map((tool) => (
                    <ToolCall
                      key={tool.label}
                      icon={Wrench01Icon}
                      status="completed"
                      timestamp={tool.duration}
                    >
                      <ToolCallTrigger>
                        <ToolCallLabel>{tool.label}</ToolCallLabel>
                      </ToolCallTrigger>
                      <ToolCallContent>
                        <div className="flex flex-col gap-1 text-xs">
                          {tool.details.map((d) => (
                            <div key={d.key} className="flex gap-2">
                              <span className="text-muted-foreground">
                                {d.key}:
                              </span>
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

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Progress format",
                '"N of M unit" — concrete, not percentage-based',
              ],
              ["Completion", '"complete" badge replaces the progress count'],
              [
                "Running indicator",
                "Pulsing dot next to the badge while in-progress",
              ],
              ["Nesting", "Nested tool calls inherit the same collapsed style"],
              [
                "Progress bar",
                "1px foreground/40 bar with transition-transform duration-500",
              ],
            ].map(([prop, spec], i, arr) => (
              <TableRow
                key={prop}
                className={
                  i < arr.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">{prop}</TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Subagent cards let users monitor delegated work without leaving their
          current context. The progress bar provides glanceable status while
          nested tools offer drill-down detail.
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

          <div className="rounded-lg border border-border/40 p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CheckListIcon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">
                  Launch Coverage Report
                </span>
              </div>
              <Badge variant="secondary">
                {planState.executing
                  ? `${Math.min(activeStep, planSteps.length)} of ${planSteps.length} complete`
                  : planState.editable
                    ? `${planSteps.length} steps`
                    : `${planSteps.length} steps`}
              </Badge>
            </div>

            <div className="flex flex-col gap-0">
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
              <div className="actions-fade-in mt-3 flex gap-2">
                <Button
                  type="button"
                  onClick={() => movePlanStep(0, 1)}
                  variant="outline"
                  size="xs"
                >
                  Reorder steps
                </Button>
                <Button
                  type="button"
                  onClick={() => setPlanSteps((prev) => [...prev, "New step"])}
                  variant="outline"
                  size="xs"
                >
                  + Add step
                </Button>
              </div>
            )}

            {planState.executing && (
              <div className="actions-fade-in mt-3 flex gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    setActiveStep((prev) =>
                      prev < planSteps.length ? prev + 1 : prev
                    )
                  }
                  variant="outline"
                  size="xs"
                >
                  Advance step
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  variant="outline"
                  size="xs"
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Step indicator",
                "6px square dot, rounded-sm — not a checkbox or number",
              ],
              ["Done state", "Muted foreground + line-through"],
              ["Active state", "Foreground + pulse animation"],
              ["Pending state", "Muted foreground at 60% opacity"],
              [
                "Editable mode",
                "Drag handle + remove button on hover per step",
              ],
              [
                "Progress badge",
                '"N of M complete" or step count in editable mode',
              ],
            ].map(([prop, spec], i, arr) => (
              <TableRow
                key={prop}
                className={
                  i < arr.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">{prop}</TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
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
          IDE-style tree connectors for operations running concurrently. The
          parent row collapses the branch; each child expands to show tool call
          details inline.
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

          <div
            key={parallelAnim}
            className="rounded-lg border border-border/40 p-6"
          >
            {parallelState.parallel ? (
              <div className="actions-slide-in">
                <ToolTree open={treeOpen} onOpenChange={setTreeOpen}>
                  <ToolTreeTrigger
                    icon={GitBranchIcon}
                    timestamp="10:44 AM · 1s"
                  >
                    Running tasks in parallel
                  </ToolTreeTrigger>
                  <ToolTreeContent>
                    {PARALLEL_TASKS.map((task) => (
                      <ToolCall
                        key={task.label}
                        icon={TextIcon}
                        status="completed"
                        timestamp="10:44 AM · 1s"
                      >
                        <ToolCallTrigger>
                          <ToolCallLabel>{task.label}</ToolCallLabel>
                        </ToolCallTrigger>
                        <ToolCallContent>
                          <div className="flex flex-col gap-1 text-xs">
                            {task.details.map((d) => (
                              <div key={d.key} className="flex gap-2">
                                <span className="text-muted-foreground">
                                  {d.key}:
                                </span>
                                <span className="text-foreground">
                                  {d.value}
                                </span>
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
                <div className="mb-3 flex items-center gap-2.5">
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

                <div className="flex flex-col gap-1">
                  {PARALLEL_TASKS.map((task, i) => (
                    <div key={task.label}>
                      <button
                        type="button"
                        aria-label={`Toggle task details: ${task.label}`}
                        onClick={() => toggleChildExpand(i)}
                        className="flex w-full items-center gap-2.5 border-l border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
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
                        <div className="actions-expand mt-1 mb-1 ml-[21px]">
                          <div className="flex flex-col gap-1 border-l border-border/60 py-2 pl-3">
                            {task.details.map((d) => (
                              <div key={d.key} className="flex gap-2 text-xs">
                                <span className="text-muted-foreground">
                                  {d.key}:
                                </span>
                                <span className="text-foreground">
                                  {d.value}
                                </span>
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
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Element
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Vertical spine",
                "1px line from parent icon to last child, masked by bg-background behind each icon",
              ],
              [
                "L-connectors",
                "rounded-bl-lg border-l + border-b connecting spine to each child",
              ],
              [
                "Icon masking",
                "size-6 bg-background circle behind size-5 icon creates clean spine breaks",
              ],
              [
                "Hover state",
                "Row label and icon transition to text-foreground; timestamp fades in on right",
              ],
              [
                "Last child",
                "bg-background mask covers spine below the final L-bend",
              ],
              [
                "Sequential fallback",
                "Flat list of bordered rows, no tree connectors",
              ],
            ].map(([el, spec], i, arr) => (
              <TableRow
                key={el}
                className={
                  i < arr.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">{el}</TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          The tree view uses Perplexity-style connectors — a vertical spine with
          L-shaped branch lines, icons that mask the spine for clean breaks, and
          hover-revealed timestamps. Each child row is lightweight: no borders,
          no cards, just text and an expand chevron.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Decision Flow                                   */}
      {/* ============================================================ */}
      <section id="decisions" className="page-section">
        <p className="section-label mb-3">Decisions</p>
        <h2 className="text-xl font-semibold tracking-tight">Decision Flow</h2>
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

          <div className="flex flex-col gap-3 rounded-lg border border-border/40 p-6">
            <div className="flex items-start gap-2">
              <HugeiconsIcon
                icon={Alert01Icon}
                size={14}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-muted-foreground"
              />
              <p className="text-sm">
                How should I handle the missing audit log entries for Timestamp
                handling?
              </p>
            </div>

            {decisionState.pending ? (
              <div className="flex flex-col gap-2">
                {DECISION_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.title}
                    type="button"
                    aria-label={`Choose decision option: ${opt.title}`}
                    onClick={() => {
                      setSelectedOption(i)
                      setDecisionState({ pending: false, resolved: true })
                      requestAnimationFrame(() =>
                        resolvedSummaryRef.current?.focus()
                      )
                    }}
                    className={`w-full rounded-md px-3 py-2.5 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                      selectedOption === i ? "bg-primary/5" : "hover:bg-accent"
                    }`}
                  >
                    <span className="text-sm font-medium">{opt.title}</span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {opt.desc}
                    </p>
                    <div
                      className={`mt-2 border-l-2 py-1 pl-2.5 ${opt.accent}`}
                    >
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
              <div
                ref={resolvedSummaryRef}
                tabIndex={-1}
                className="actions-fade-in flex flex-col gap-3"
              >
                {selectedOption !== null && (
                  <div className="border-l border-primary bg-primary/5 py-2 pl-3">
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
                <div
                  role="status"
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="shrink-0"
                  />
                  <span>
                    Decision confirmed — proceeding with selected action
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Pattern
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Pending state",
                "All options clickable with hover effect and consequence preview",
              ],
              [
                "Resolved state",
                "Selected option highlighted, others hidden, confirmation shown",
              ],
              [
                "Selected card",
                "Primary border + subtle primary background tint",
              ],
              [
                "Consequence previews",
                "Border-left callout with arrow indicator inside each option",
              ],
              [
                "Auto-selection",
                "Never auto-select — always wait for explicit user choice",
              ],
            ].map(([pat, spec], i, arr) => (
              <TableRow
                key={pat}
                className={
                  i < arr.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">{pat}</TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Decisions are the highest-trust pattern in the system — they grant the
          user explicit control over how the agent proceeds. Never bypass them
          with auto-selection or hidden defaults.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Clarifying Questions                            */}
      {/* ============================================================ */}
      <section id="ask-blocks" className="page-section">
        <p className="section-label mb-3">Clarification</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Clarifying Questions
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          When the agent is blocked by missing intent, ask a focused question
          with answerable options, optional free text, and a clear skip path.
          This keeps clarification out of a vague back-and-forth chat loop.
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

          {!askSubmitted ? (
            <ClarifyingQuestions.Root
              className="actions-fade-in mt-5"
              onSubmit={(event) => {
                event.preventDefault()
                handleAskSubmit()
              }}
            >
              <ClarifyingQuestions.Step
                question={CLARIFYING_QUESTION}
                index={0}
                total={1}
                value={selectedClarifications}
                otherValue={askOther}
                onValueChange={(_, value) =>
                  setSelectedClarifications(
                    Array.isArray(value) ? value : value ? [value] : []
                  )
                }
                onOtherValueChange={(_, value) => setAskOther(value)}
                onSkip={handleAskSkip}
                onContinue={handleAskSubmit}
              />
            </ClarifyingQuestions.Root>
          ) : (
            <div className="actions-fade-in mt-5 flex flex-col gap-3 border-l border-border/60 bg-foreground/[0.02] px-3 py-3">
              <div>
                {answeredClarifications.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {answeredClarifications.map((answer) => (
                      <span
                        key={answer}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 text-xs text-foreground"
                      >
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        {answer}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Clarification skipped
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={12}
                  strokeWidth={1.5}
                  className="shrink-0"
                />
                <span>Answer recorded — continuing with scoped analysis</span>
              </div>
            </div>
          )}
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Question shape",
                "One focused question with 2-5 answerable options",
              ],
              [
                "Selection",
                "Single or multi-select rows with explicit selected state",
              ],
              [
                "Other input",
                "Inline textarea for constraints that do not fit the options",
              ],
              [
                "Skip path",
                "Visible skip control when the agent can continue with defaults",
              ],
              [
                "Submit",
                "Continue disabled until an option or free-text answer exists",
              ],
              [
                "Answered state",
                "Selected answers collapse into readable chips before work resumes",
              ],
            ].map(([prop, spec], i, arr) => (
              <TableRow
                key={prop}
                className={
                  i < arr.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">{prop}</TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Clarifying questions should reduce ambiguity, not create a survey.
          Prefer choices when the agent can name the likely answers. Use the
          free-text row only for constraints, missing context, or edge cases.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 7 — Approval Gate                                   */}
      {/* ============================================================ */}
      <section id="approval-gate" className="page-section">
        <p className="section-label mb-3">Confirmation</p>
        <h2 className="text-xl font-semibold tracking-tight">Approval Gate</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Human-in-the-loop confirmation before the agent performs a
          consequential action. The user reviews the action details and
          explicitly approves or denies.
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

          <div
            key={approvalAnim}
            className="rounded-lg border border-border/40 p-6"
          >
            {approvalCtrl.email ? (
              /* Email approval variant */
              <div className="actions-slide-in flex flex-col gap-4">
                <div className="flex items-start gap-2.5">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <p className="text-sm">
                    I'd like to send the launch summary submission email. Please
                    review and approve.
                  </p>
                </div>

                {approvalStatus === "pending" && (
                  <div className="actions-fade-in flex flex-col gap-4">
                    <ActionPreview
                      title="Send launch summary email"
                      description={APPROVAL_EMAIL.body}
                      status="locked"
                      items={[
                        {
                          label: "Recipient",
                          value: APPROVAL_EMAIL.recipient,
                        },
                        {
                          label: "Subject",
                          value: APPROVAL_EMAIL.subject,
                        },
                        {
                          label: "Affected object",
                          value: "Project launch summary email",
                        },
                        {
                          label: "Consequence",
                          emphasis: true,
                          value:
                            "External communication is sent and cannot be recalled.",
                        },
                        {
                          label: "Cost / time",
                          value: "$0.09 estimated / under 1 min",
                        },
                        {
                          label: "Rollback",
                          emphasis: true,
                          value: "Follow-up correction only",
                        },
                      ]}
                    />

                    <div className="flex items-center gap-2">
                      <DecisionSurface.Root>
                        <DecisionSurface.Trigger
                          render={<Button type="button" size="sm" />}
                        >
                          Approve
                        </DecisionSurface.Trigger>
                        <DecisionSurface.Content>
                          <DecisionSurface.Header>
                            <DecisionSurface.Title>
                              Send this email?
                            </DecisionSurface.Title>
                            <DecisionSurface.Description>
                              The agent will send this message to the listed
                              recipient. Review the impact before approving.
                            </DecisionSurface.Description>
                          </DecisionSurface.Header>
                          <DecisionSurface.Body>
                            <DecisionSurface.ImpactList>
                              <DecisionSurface.ImpactItem label="Recipient">
                                {APPROVAL_EMAIL.recipient}
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Subject">
                                {APPROVAL_EMAIL.subject}
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Affected object">
                                Project launch summary email
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Cost / time">
                                $0.09 estimated / under 1 min
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Permission">
                                External communication approval
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Source">
                                Project brief, roadmap, launch checklist
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Reversibility">
                                Not reversible after send
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Rollback">
                                Follow-up correction only
                              </DecisionSurface.ImpactItem>
                            </DecisionSurface.ImpactList>
                          </DecisionSurface.Body>
                          <DecisionSurface.Footer>
                            <DecisionSurface.Cancel />
                            <DecisionSurface.Confirm
                              onClick={() => setApprovalStatus("approved")}
                            >
                              Approve
                            </DecisionSurface.Confirm>
                          </DecisionSurface.Footer>
                        </DecisionSurface.Content>
                      </DecisionSurface.Root>
                      <Button
                        type="button"
                        onClick={() => setApprovalStatus("denied")}
                        variant="outline"
                        size="sm"
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                )}

                {approvalStatus === "approved" && (
                  <div className="actions-fade-in flex flex-col gap-3">
                    <div
                      role="status"
                      className="border-l border-primary bg-primary/5 py-2 pl-3"
                    >
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
                    <Button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      variant="outline"
                      size="xs"
                    >
                      <HugeiconsIcon
                        icon={RefreshIcon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Reset
                    </Button>
                  </div>
                )}

                {approvalStatus === "denied" && (
                  <div className="actions-fade-in flex flex-col gap-3">
                    <div className="border-l border-destructive/50 bg-destructive/5 py-2 pl-3">
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
                    <Button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      variant="outline"
                      size="xs"
                    >
                      <HugeiconsIcon
                        icon={RefreshIcon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Document changes variant */
              <div className="actions-slide-in flex flex-col gap-4">
                <div className="flex items-start gap-2.5">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <p className="text-sm">
                    I'd like to apply these changes to the project brief. Please
                    review.
                  </p>
                </div>

                {approvalStatus === "pending" && (
                  <div className="actions-fade-in flex flex-col gap-4">
                    <ActionPreview
                      title="Apply project brief changes"
                      description="The exact additions and removals below are locked before approval. If source material changes, this approval expires."
                      status="locked"
                      items={[
                        {
                          label: "Adds",
                          value: `${APPROVAL_CHANGES.filter((change) => change.type === "add").length} changes`,
                        },
                        {
                          label: "Removes",
                          value: `${APPROVAL_CHANGES.filter((change) => change.type === "remove").length} references`,
                        },
                        {
                          label: "Affected object",
                          value: "Project-Brief-v3.pdf",
                        },
                        {
                          label: "Consequence",
                          emphasis: true,
                          value:
                            "Document content changes and downstream review summaries must be regenerated.",
                        },
                        {
                          label: "Reversibility",
                          value: "Reversible through document history",
                        },
                        {
                          label: "Rollback",
                          emphasis: true,
                          value: "Restore previous document version",
                        },
                      ]}
                    >
                      <div className="flex flex-col gap-1.5">
                        {APPROVAL_CHANGES.map((change, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs"
                          >
                            <span className="shrink-0 text-muted-foreground select-none">
                              {change.type === "add" ? "+" : "-"}
                            </span>
                            <span className="text-muted-foreground">
                              {change.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ActionPreview>

                    <div className="flex items-center gap-2">
                      <DecisionSurface.Root>
                        <DecisionSurface.Trigger
                          render={<Button type="button" size="sm" />}
                        >
                          Approve
                        </DecisionSurface.Trigger>
                        <DecisionSurface.Content>
                          <DecisionSurface.Header>
                            <DecisionSurface.Title>
                              Apply these document changes?
                            </DecisionSurface.Title>
                            <DecisionSurface.Description>
                              The agent will update the document with the
                              reviewed additions and removals.
                            </DecisionSurface.Description>
                          </DecisionSurface.Header>
                          <DecisionSurface.Body>
                            <DecisionSurface.ImpactList>
                              <DecisionSurface.ImpactItem label="Adds">
                                {
                                  APPROVAL_CHANGES.filter(
                                    (change) => change.type === "add"
                                  ).length
                                }{" "}
                                changes
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Removes">
                                {
                                  APPROVAL_CHANGES.filter(
                                    (change) => change.type === "remove"
                                  ).length
                                }{" "}
                                references
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Affected object">
                                Project-Brief-v3.pdf
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Cost / time">
                                $0.04 estimated / under 1 min
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Permission">
                                Document edit approval
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Source">
                                Launch Policy v2 and roadmap notes
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Reversibility">
                                Reversible through document history
                              </DecisionSurface.ImpactItem>
                              <DecisionSurface.ImpactItem label="Rollback">
                                Restore previous document version
                              </DecisionSurface.ImpactItem>
                            </DecisionSurface.ImpactList>
                          </DecisionSurface.Body>
                          <DecisionSurface.Footer>
                            <DecisionSurface.Cancel />
                            <DecisionSurface.Confirm
                              onClick={() => setApprovalStatus("approved")}
                            >
                              Apply changes
                            </DecisionSurface.Confirm>
                          </DecisionSurface.Footer>
                        </DecisionSurface.Content>
                      </DecisionSurface.Root>
                      <Button
                        type="button"
                        onClick={() => setApprovalStatus("denied")}
                        variant="outline"
                        size="sm"
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                )}

                {approvalStatus === "approved" && (
                  <div className="actions-fade-in flex flex-col gap-3">
                    <div className="border-l border-primary bg-primary/5 py-2 pl-3">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm">
                          Approved — applying{" "}
                          {
                            APPROVAL_CHANGES.filter((c) => c.type === "add")
                              .length
                          }{" "}
                          additions,{" "}
                          {
                            APPROVAL_CHANGES.filter((c) => c.type === "remove")
                              .length
                          }{" "}
                          removals
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      variant="outline"
                      size="xs"
                    >
                      <HugeiconsIcon
                        icon={RefreshIcon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Reset
                    </Button>
                  </div>
                )}

                {approvalStatus === "denied" && (
                  <div className="actions-fade-in flex flex-col gap-3">
                    <div className="border-l border-destructive/50 bg-destructive/5 py-2 pl-3">
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
                    <Button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      variant="outline"
                      size="xs"
                    >
                      <HugeiconsIcon
                        icon={RefreshIcon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Spec
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Action summary",
                "Shield icon + plain-language description of what the agent wants to do",
              ],
              [
                "Detail panel",
                "Muted background container with key-value or diff preview",
              ],
              [
                "Diff format",
                "Green-ish (+) for additions, red-ish (−) for removals, muted tones",
              ],
              [
                "Approve button",
                "Primary fill — should feel deliberate, not default",
              ],
              [
                "Deny button",
                "Ghost/outline — lower visual weight than approve",
              ],
              [
                "Result states",
                "Success (primary border), denied (destructive border), with reset button",
              ],
            ].map(([prop, spec], i, arr) => (
              <TableRow
                key={prop}
                className={
                  i < arr.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">{prop}</TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Approval gates are the most critical trust pattern in the system. They
          ensure the agent never takes consequential actions without explicit
          human confirmation — essential for high-trust workflows where mistakes
          have regulatory consequences.
        </p>
      </section>
    </article>
  )
}
