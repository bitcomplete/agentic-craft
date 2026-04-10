'use client'

import { useState, useEffect } from "react"
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

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "multi-agent-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes ma-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ma-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes ma-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes ma-progress {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    .ma-slide-in {
      animation: ma-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .ma-fade-in {
      animation: ma-fade-in 0.2s ease forwards;
    }
    .ma-pulse {
      animation: ma-pulse 1.5s ease-in-out infinite;
    }
    .ma-progress {
      animation: ma-progress 0.6s ease forwards;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Controls                                                           */
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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function makeToggle(
  setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  animSetter: React.Dispatch<React.SetStateAction<number>>,
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
  { name: "Design Reviewer", role: "Check interaction quality", task: "Reviewing the checkout handoff against the latest Figma frames", progress: "12 of 18 screens reviewed" },
  { name: "Code Reviewer", role: "Map implementation to requirements", task: "Comparing the checkout PR against launch checklist items", progress: "24 of 31 checks reviewed" },
  { name: "Release Coordinator", role: "Prepare launch communication", task: "Drafting launch summary and rollout notes", progress: "Handoff draft in progress" },
]

const HANDOFF_STEPS = [
  { label: "Review design artifacts", agent: "Design Reviewer" },
  { label: "Verify implementation coverage", agent: "Code Reviewer" },
  { label: "Generate launch handoff", agent: "Release Coordinator" },
]

const PARALLEL_AGENTS = [
  { name: "QA Analyst", task: "Running smoke checks across checkout flows", result: "47 checks run — 2 follow-ups identified", progress: 72 },
  { name: "Release Coordinator", task: "Gathering launch evidence", result: "18 of 18 artifacts linked — rollout packet complete", progress: 45 },
  { name: "Analytics Checker", task: "Validating launch tracking plan", result: "12 events reviewed — 3 instrumentation deltas", progress: 88 },
]

const ROUTING_AGENTS = ["Code Reviewer", "Design Reviewer", "Release Coordinator"]

const DIRECT_MESSAGES = [
  { from: "Code Reviewer", to: "Design Reviewer", content: "The checkout PR still uses the old summary layout on mobile. Can you confirm whether the Figma file expects the sticky total card?" },
  { from: "Design Reviewer", to: "Code Reviewer", content: "Confirmed. The latest frame uses the sticky total card below 768px and the older stacked summary should be removed before launch." },
  { from: "Code Reviewer", to: "Release Coordinator", content: "Verified. I’m marking the mobile layout issue as a launch blocker until the new summary pattern lands." },
]

const SHARED_CONTEXT_ITEMS = [
  { agent: "Release Coordinator", label: "Launch checklist — linked artifacts complete", type: "Artifact", time: "2m ago" },
  { agent: "Code Reviewer", label: "Mobile summary layout mismatch", type: "Finding", time: "4m ago" },
  { agent: "Design Reviewer", label: "Checkout handoff annotations updated", type: "Draft", time: "5m ago" },
  { agent: "Analytics Checker", label: "Tracking plan delta report", type: "Analysis", time: "8m ago" },
  { agent: "QA Analyst", label: "Failed-card recovery smoke check — needs follow-up", type: "Assessment", time: "12m ago" },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function MultiAgentContent() {
  useEffect(() => {
    ensureStyles()
  }, [])

  /* Section 1 — Agent Cards */
  const [cardCtrl, setCardCtrl] = useState<Record<string, boolean>>({ active: true, idle: false, error: false })
  const [cardAnim, setCardAnim] = useState(0)
  const toggleCard = makeToggle(setCardCtrl, setCardAnim)
  const activeCardMode = cardCtrl.active ? "active" : cardCtrl.idle ? "idle" : "error"

  /* Section 2 — Handoff Flow */
  const [handoffCtrl, setHandoffCtrl] = useState<Record<string, boolean>>({ pending: true, inprogress: false, complete: false })
  const [handoffAnim, setHandoffAnim] = useState(0)
  const toggleHandoff = makeToggle(setHandoffCtrl, setHandoffAnim)
  const activeHandoff = handoffCtrl.pending ? "pending" : handoffCtrl.inprogress ? "inprogress" : "complete"

  /* Section 3 — Parallel Agents */
  const [parallelCtrl, setParallelCtrl] = useState<Record<string, boolean>>({ running: true, complete: false })
  const [parallelAnim, setParallelAnim] = useState(0)
  const toggleParallel = makeToggle(setParallelCtrl, setParallelAnim)
  const activeParallel = parallelCtrl.running ? "running" : "complete"

  /* Section 4 — Agent Routing */
  const [routeCtrl, setRouteCtrl] = useState<Record<string, boolean>>({ auto: true, manual: false })
  const [routeAnim, setRouteAnim] = useState(0)
  const toggleRoute = makeToggle(setRouteCtrl, setRouteAnim)
  const activeRoute = routeCtrl.auto ? "auto" : "manual"
  const [manualSelection, setManualSelection] = useState<string | null>(null)

  /* Section 5 — Agent Communication */
  const [commCtrl, setCommCtrl] = useState<Record<string, boolean>>({ direct: true, shared: false })
  const [commAnim, setCommAnim] = useState(0)
  const toggleComm = makeToggle(setCommCtrl, setCommAnim)
  const activeComm = commCtrl.direct ? "direct" : "shared"

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Orchestration</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Multi-Agent Patterns
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Coordination patterns for orchestrating multiple agents across product,
          design, QA, and release workflows — handoffs, parallel execution,
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
          and active task. Cards reflect the agent's operational state in real time.
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

          <div className="border border-border/40 rounded-lg p-6" key={cardAnim}>
            <div className="grid grid-cols-3 gap-4">
              {AGENT_CARDS.map((agent, i) => (
                <div
                  key={agent.name}
                  className="rounded-md border border-border/40 p-4 space-y-3 ma-slide-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon icon={Brain01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                    {/* Status dot */}
                    {activeCardMode === "active" && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-foreground/70 ma-pulse" />
                    )}
                    {activeCardMode === "idle" && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-muted-foreground/40" />
                    )}
                    {activeCardMode === "error" && (
                      <HugeiconsIcon icon={Alert01Icon} size={14} strokeWidth={1.5} className="mt-1 text-muted-foreground" />
                    )}
                  </div>

                  {/* Status body */}
                  {activeCardMode === "active" && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">{agent.task}</p>
                      <p className="text-[10px] text-muted-foreground/70">{agent.progress}</p>
                    </div>
                  )}
                  {activeCardMode === "idle" && (
                    <div>
                      <p className="text-xs text-muted-foreground">Awaiting instructions</p>
                    </div>
                  )}
                  {activeCardMode === "error" && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Failed to connect to evaluation artifact repository — timeout after 30s
                      </p>
                      <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <HugeiconsIcon icon={RefreshIcon} size={10} strokeWidth={1.5} />
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Card layout</td>
              <td className="py-3">3-column grid, each card with avatar, name, role, status indicator</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Active state</td>
              <td className="py-3">Pulsing dot, current task description, progress info</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Idle state</td>
              <td className="py-3">Muted dot, "Awaiting instructions" placeholder</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Error state</td>
              <td className="py-3">Alert icon, error message, retry action button</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Agent cards provide the identity foundation for multi-agent interfaces.
          In CC evaluation contexts, each card maps to a distinct evaluation
          activity — evidence collection, compliance mapping, or document
          authoring — making it clear which agent is responsible for which
          assurance class deliverable.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Handoff Flow                                     */}
      {/* ============================================================ */}
      <section id="handoff-flow" className="page-section">
        <p className="section-label mb-3">Orchestration</p>
        <h2 className="text-xl font-semibold tracking-tight">Handoff Flow</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Sequential task handoff between agents. Each step produces output
          that becomes input for the next agent in the pipeline.
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

          <div className="border border-border/40 rounded-lg p-6" key={handoffAnim}>
            <div className="flex items-center justify-center gap-0 ma-slide-in">
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
                  <div key={step.label} className="flex items-center">
                    <div
                      className={`flex flex-col items-center gap-2 rounded-md border p-4 w-48 transition-all duration-200 ${
                        stepState === "complete"
                          ? "border-foreground/20 bg-foreground/[0.03]"
                          : stepState === "active"
                            ? "border-foreground/15 bg-foreground/[0.02]"
                            : "border-border/40 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {stepState === "complete" ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground/10">
                            <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={2} className="text-foreground/70" />
                          </div>
                        ) : stepState === "active" ? (
                          <span className="h-2 w-2 rounded-full bg-foreground/70 ma-pulse" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        )}
                        <span className="text-[10px] text-muted-foreground">Step {i + 1}</span>
                      </div>
                      <p className="text-xs text-center leading-snug">{step.label}</p>
                      <p className="text-[10px] text-muted-foreground">{step.agent}</p>
                    </div>
                    {i < HANDOFF_STEPS.length - 1 && (
                      <div className="px-2">
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className={`transition-opacity duration-200 ${
                            (activeHandoff === "complete") ||
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
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Step cards</td>
              <td className="py-3">Fixed-width cards with step number, task label, and assigned agent</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Connectors</td>
              <td className="py-3">Arrow icons between steps, opacity reflects whether handoff has occurred</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Pending state</td>
              <td className="py-3">First step highlighted, remaining steps muted at 50% opacity</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Complete state</td>
              <td className="py-3">All steps show tick icon with subtle background tint</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Handoff flows model the sequential dependencies in cross-functional
          product work — design context must be understood before implementation
          review, and implementation review should happen before launch handoff. Each handoff creates an auditable transition record.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Parallel Agents                                  */}
      {/* ============================================================ */}
      <section id="parallel-agents" className="page-section">
        <p className="section-label mb-3">Concurrency</p>
        <h2 className="text-xl font-semibold tracking-tight">Parallel Agents</h2>
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

          <div className="border border-border/40 rounded-lg p-6" key={parallelAnim}>
            <div className="space-y-3">
              {PARALLEL_AGENTS.map((agent, i) => (
                <div
                  key={agent.name}
                  className="rounded-md border border-border/40 p-4 ma-slide-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon icon={Brain01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {activeParallel === "running" ? agent.task : agent.result}
                          </p>
                        </div>
                        {activeParallel === "running" ? (
                          <span className="h-2 w-2 rounded-full bg-foreground/70 ma-pulse" />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground/10">
                            <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={2} className="text-foreground/70" />
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="h-1 w-full rounded-full bg-muted">
                        <div
                          className={`h-1 rounded-full ma-progress ${
                            activeParallel === "complete" ? "bg-foreground/50" : "bg-foreground/30"
                          }`}
                          style={{ "--target-width": activeParallel === "complete" ? "100%" : `${agent.progress}%` } as React.CSSProperties}
                        />
                      </div>

                      {activeParallel === "running" && (
                        <p className="text-[10px] text-muted-foreground/60">{agent.progress}% complete</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Agent rows</td>
              <td className="py-3">Stacked cards with avatar, name, task description, and status indicator</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Progress bars</td>
              <td className="py-3">Animated fill to individual target width, monochrome foreground tint</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Running state</td>
              <td className="py-3">Pulsing dot, active task label, percentage complete</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Complete state</td>
              <td className="py-3">Tick icon, results summary replaces task description, bar at 100%</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Parallel execution is valuable when design review, QA verification,
          analytics checks, and release coordination can proceed at the same
          time without blocking each other.
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
          type analysis or manual selection by the evaluation supervisor.
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

          <div className="border border-border/40 rounded-lg p-6" key={routeAnim}>
            <div className="ma-slide-in space-y-5">
              {/* Incoming task */}
              <div className="rounded-md border border-border/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HugeiconsIcon icon={Route01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Incoming task</span>
                </div>
                <p className="text-sm">Review checkout launch blockers</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Task type: launch-readiness review
                </p>
              </div>

              {/* Routing arrow */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] text-muted-foreground px-2">
                  {activeRoute === "auto" ? "Auto-routed by task type" : "Select destination agent"}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Agent options */}
              <div className="grid grid-cols-3 gap-3">
                {ROUTING_AGENTS.map((agentName) => {
                  const isSelected =
                    activeRoute === "auto"
                      ? agentName === "Compliance Mapper"
                      : manualSelection === agentName

                  return (
                    <button
                      key={agentName}
                      onClick={() => {
                        if (activeRoute === "manual") {
                          setManualSelection(agentName)
                        }
                      }}
                      className={`rounded-md border p-3 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-foreground/20 bg-foreground/[0.03]"
                          : activeRoute === "manual"
                            ? "border-border/40 hover:border-foreground/10 cursor-pointer"
                            : "border-border/40 opacity-40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                          <HugeiconsIcon icon={Brain01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                        </div>
                        <span className="text-xs">{agentName}</span>
                      </div>
                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={1.5} className="text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {activeRoute === "auto" ? "Best match — launch context" : "Selected"}
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
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Task card</td>
              <td className="py-3">Shows incoming task with detected type classification</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Auto routing</td>
              <td className="py-3">Best-match agent highlighted, others dimmed at 40% opacity</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Manual routing</td>
              <td className="py-3">All agents interactive, click to select destination</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Selection indicator</td>
              <td className="py-3">Arrow icon with context label ("Best match" or "Selected")</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Routing decisions in agent workflows must be transparent and auditable.
          Auto-routing uses task classification to match design work to the
          Design Reviewer, implementation checks to the Code Reviewer,
          and policy tasks to the Policy Analyst. Manual override ensures the
          evaluator retains final authority over agent assignments.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Agent Communication                              */}
      {/* ============================================================ */}
      <section id="agent-communication" className="page-section">
        <p className="section-label mb-3">Collaboration</p>
        <h2 className="text-xl font-semibold tracking-tight">Agent Communication</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Inter-agent information exchange via direct messaging or a shared
          context workspace. Both patterns create auditable communication records.
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

          <div className="border border-border/40 rounded-lg p-6" key={commAnim}>
            {activeComm === "direct" ? (
              <div className="space-y-3 ma-slide-in">
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={Message01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Direct thread — Compliance Mapper and Document Drafter
                  </span>
                </div>
                {DIRECT_MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    className="ma-slide-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className={`flex gap-3 ${msg.from === "Document Drafter" ? "flex-row-reverse" : ""}`}>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon icon={Brain01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                      </div>
                      <div
                        className={`flex-1 rounded-md border border-border/40 p-3 ${
                          msg.from === "Document Drafter" ? "bg-foreground/[0.02]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-medium">{msg.from}</span>
                          <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={1.5} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{msg.to}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 ma-slide-in">
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={Share01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Shared evaluation context — 5 items from 5 agents
                  </span>
                </div>
                {SHARED_CONTEXT_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-border/40 px-4 py-3 ma-slide-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon icon={Brain01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm truncate">{item.label}</p>
                        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {item.type}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.agent} · {item.time}
                      </p>
                    </div>
                    <HugeiconsIcon icon={Search01Icon} size={12} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Direct messages</td>
              <td className="py-3">Chat-style thread between two agents with sender/receiver labels</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Message alignment</td>
              <td className="py-3">Alternating left/right layout based on sender, subtle background tint</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Shared context</td>
              <td className="py-3">List of contributed items with agent attribution, type badge, and timestamp</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Context types</td>
              <td className="py-3">Artifact, Finding, Draft, Analysis, Assessment — shown as muted badges</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Agent communication patterns support the traceability requirements
          of product work. Direct messaging creates point-to-point audit
          trails (e.g., when the Code Reviewer flags a launch blocker for the
          Release Coordinator), while shared context provides a workspace where
          all agents can contribute findings visible to the evaluation team.
        </div>
      </section>
    </article>
  )
}
