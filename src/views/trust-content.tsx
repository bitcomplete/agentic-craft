'use client'

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert01Icon,
  Tick01Icon,
  Cancel01Icon,
  Clock01Icon,
  Shield01Icon,
  Activity01Icon,
  Brain01Icon,
  File01Icon,
  LinkSquare01Icon,
  Target01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "trust-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes trust-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes trust-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes trust-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 800px; opacity: 1; }
    }
    @keyframes trust-progress {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    @keyframes trust-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes trust-press {
      0% { transform: scale(1); }
      50% { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    .trust-slide-in {
      animation: trust-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .trust-fade-in {
      animation: trust-fade-in 0.2s ease forwards;
    }
    .trust-expand {
      animation: trust-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .trust-pulse {
      animation: trust-pulse 1.5s ease-in-out infinite;
    }
    .trust-press {
      animation: trust-press 0.15s ease;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AUDIT_ENTRIES = [
  {
    time: "14:02:11",
    action: "Opened checkout launch brief",
    user: "Agent",
    outcome: "Loaded 14 acceptance criteria",
    evidence: "checkout-launch-brief.md",
  },
  {
    time: "14:02:14",
    action: "Cross-referenced mobile checkout screenshots",
    user: "Agent",
    outcome: "2 of 3 key states matched the latest design",
    evidence: "checkout-redesign.fig, frame 18",
  },
  {
    time: "14:02:18",
    action: "Flagged mobile summary mismatch for review",
    user: "Agent",
    outcome: "Added to launch blockers",
    evidence: "launch-review-2026-04.md, blocker #2",
  },
  {
    time: "14:02:22",
    action: "Product lead approved blocker classification",
    user: "A. Chen (product)",
    outcome: "Issue confirmed as release blocker",
    evidence: "launch-thread-2026-04, reply #14",
  },
]

const PROVENANCE_SOURCES = [
  {
    document: "Checkout launch brief",
    section: "Acceptance criteria — Mobile summary",
    confidence: 0.94,
    type: "Primary",
  },
  {
    document: "Figma handoff",
    section: "Frame 18 — Mobile summary state",
    confidence: 0.87,
    type: "Design",
  },
  {
    document: "Previous release retro",
    section: "Launch blockers summary",
    confidence: 0.71,
    type: "Reference",
  },
]

const PROVENANCE_CHAIN = [
  { step: "Source", label: "Launch brief", detail: "Mobile checkout must use the sticky total card below 768px" },
  { step: "Extracted", label: "Requirement", detail: "The production implementation should match the approved mobile summary layout" },
  { step: "Inference", label: "Gap analysis", detail: "Current PR still renders the older stacked summary pattern on mobile" },
  { step: "Conclusion", label: "Finding", detail: "Release blocker — update the mobile summary before wider rollout" },
]

const COST_BREAKDOWN = {
  model: "claude-opus-4-6",
  inputTokens: 12_847,
  outputTokens: 3_291,
  inputCost: 0.19,
  outputCost: 0.05,
  totalCost: 0.24,
  elapsed: "4.2s",
}

const AUTONOMY_LEVELS = [
  {
    level: 2,
    name: "Human-in-Command",
    description: "AI drafts outputs and proposes actions; a human approves every external or high-stakes step.",
    uiPattern: "Approval modal",
    capabilities: [
      "Draft launch summaries for review",
      "Propose requirement-to-artifact mappings",
      "Suggest follow-ups for engineering or design",
    ],
    restrictions: [
      "Cannot send updates without approval",
      "Cannot change rollout settings",
      "Cannot close blockers on its own",
    ],
  },
  {
    level: 3,
    name: "Human-Delegated",
    description: "AI handles routine review tasks autonomously; humans review only flagged exceptions.",
    uiPattern: "Inbox of flagged items",
    capabilities: [
      "Automatically compare launch artifacts",
      "Generate routine status reports",
      "Send pre-approved handoff templates",
    ],
    restrictions: [
      "Flags novel blockers for human review",
      "Cannot trigger a production rollout",
      "Escalates if confidence drops below 70%",
    ],
  },
  {
    level: 4,
    name: "Human-in-the-Loop",
    description: "AI executes freely but escalates when confidence drops below a set threshold.",
    uiPattern: "Confidence slider",
    capabilities: [
      "Execute end-to-end launch review workflows",
      "Send updates and create blockers autonomously",
      "Update release notes and audit trails",
    ],
    restrictions: [
      "Escalates on confidence below threshold",
      "Cannot approve the final launch decision",
      "Human monitors via activity dashboard",
    ],
  },
]

const MODE_CONFIGS = {
  design: {
    label: "Design",
    focus: "Checking interaction quality, design fidelity, and consistency across screens and states.",
    tools: [
      "Design diff reviewer",
      "Screenshot comparison",
      "Component consistency checker",
      "Handoff artifact scanner",
    ],
  },
  implementation: {
    label: "Implementation",
    focus: "Reviewing PRs, rollout logic, instrumentation, and implementation constraints.",
    tools: [
      "Diff reviewer",
      "Analytics verifier",
      "Technical document analyzer",
      "Release checklist scanner",
    ],
  },
  launch: {
    label: "Launch",
    focus: "Reviewing launch readiness, blockers, rollback confidence, and communication artifacts.",
    tools: [
      "Launch summary generator",
      "Blocker classifier",
      "Rollback readiness checker",
      "Handoff checklist",
    ],
  },
}

const SCOPE_CONFIGS = {
  designOnly: {
    label: "Design Only",
    scope: "Checkout redesign",
    documents: [
      { name: "Figma handoff", section: "Latest approved frames" },
      { name: "Design notes", section: "Mobile checkout states" },
    ],
  },
  repoDesign: {
    label: "Repo + Design",
    scope: "Checkout release",
    documents: [
      { name: "Launch brief", section: "Full document" },
      { name: "Checkout PR", section: "Current diff" },
      { name: "Figma handoff", section: "Relevant frames" },
      { name: "QA report", section: "Smoke + regression results" },
    ],
  },
  global: {
    label: "Full Launch Bundle",
    scope: "All release artifacts",
    documents: [
      { name: "Launch brief", section: "Full document" },
      { name: "Checkout PR", section: "Current diff" },
      { name: "Figma handoff", section: "Relevant frames" },
      { name: "QA report", section: "All results" },
      { name: "Analytics plan", section: "Tracked events" },
      { name: "Previous launch retro", section: "Blockers and learnings" },
    ],
  },
}

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
/*  Agent prose helper                                                 */
/* ------------------------------------------------------------------ */

const PROSE_STYLE: React.CSSProperties = {
  fontFamily: "'Source Serif 4', serif",
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
  color: "oklch(0.2642 0.013 93.9)",
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function TrustContent() {
  useEffect(() => { ensureStyles() }, [])

  /* — Autonomy Level — */
  const [autoCtrl, setAutoCtrl] = useState<Record<string, boolean>>({ level2: true, level3: false, level4: false })
  const [autoAnimKey, setAutoAnimKey] = useState(0)

  /* — Mode Toggles — */
  const [modeCtrl, setModeCtrl] = useState<Record<string, boolean>>({ design: true, implementation: false, launch: false })
  const [modeAnimKey, setModeAnimKey] = useState(0)

  /* — Context Scope — */
  const [scopeCtrl, setScopeCtrl] = useState<Record<string, boolean>>({ designOnly: true, repoDesign: false, global: false })
  const [scopeAnimKey, setScopeAnimKey] = useState(0)

  /* — Consent Flow — */
  const [consentCtrl, setConsentCtrl] = useState<Record<string, boolean>>({ prompt: true, accepted: false, declined: false })
  const [consentAnimKey, setConsentAnimKey] = useState(0)

  /* — Confidence Display — */
  const [confCtrl, setConfCtrl] = useState<Record<string, boolean>>({ high: true, medium: false, low: false })
  const [confAnimKey, setConfAnimKey] = useState(0)
  const [verifyClicked, setVerifyClicked] = useState(false)

  /* — Kill Switch — */
  const [killCtrl, setKillCtrl] = useState<Record<string, boolean>>({ idle: true, running: false, stopped: false })
  const [killAnimKey, setKillAnimKey] = useState(0)

  /* — Cost Transparency — */
  const [costCtrl, setCostCtrl] = useState<Record<string, boolean>>({ compact: true, detailed: false })
  const [costAnimKey, setCostAnimKey] = useState(0)

  /* — Data Provenance — */
  const [provCtrl, setProvCtrl] = useState<Record<string, boolean>>({ sources: true, chain: false })
  const [provAnimKey, setProvAnimKey] = useState(0)

  /* — Audit Trail — */
  const [auditCtrl, setAuditCtrl] = useState<Record<string, boolean>>({ summary: true, detailed: false })
  const [auditAnimKey, setAuditAnimKey] = useState(0)

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

  /* Resolve active autonomy level */
  const activeLevel = autoCtrl.level2 ? AUTONOMY_LEVELS[0] : autoCtrl.level3 ? AUTONOMY_LEVELS[1] : AUTONOMY_LEVELS[2]

  /* Resolve active mode */
  const activeMode = modeCtrl.design ? MODE_CONFIGS.design : modeCtrl.implementation ? MODE_CONFIGS.implementation : MODE_CONFIGS.launch

  /* Resolve active scope */
  const activeScope = scopeCtrl.designOnly ? SCOPE_CONFIGS.designOnly : scopeCtrl.repoDesign ? SCOPE_CONFIGS.repoDesign : SCOPE_CONFIGS.global

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Trust &amp; Safety
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Autonomy governance, operational configuration, transparency, and
          guardrail patterns that establish and maintain user trust in agentic
          experiences.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Autonomy Level                                   */}
      {/* ============================================================ */}
      <section id="autonomy-level" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Autonomy Level</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Select how much independence the agent has. Higher levels increase speed
          but reduce oversight. Uses the 6-level autonomy scale from foundations.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "level2", label: "Level 2" },
              { key: "level3", label: "Level 3" },
              { key: "level4", label: "Level 4" },
            ]}
            active={autoCtrl}
            onToggle={makeToggle(setAutoCtrl, setAutoAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={autoAnimKey}>
            <div className="trust-slide-in">
              {/* Stepped indicator */}
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={`h-2 w-full rounded-md transition-colors duration-200 ${
                        n <= activeLevel.level
                          ? "bg-foreground/20"
                          : "bg-muted"
                      }`}
                    />
                    <span className={`text-[10px] tabular-nums ${
                      n === activeLevel.level ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                      {n}
                    </span>
                  </div>
                ))}
              </div>

              {/* Level details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">Level {activeLevel.level}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-sm font-medium">{activeLevel.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activeLevel.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Capabilities</p>
                    <div className="space-y-1.5">
                      {activeLevel.capabilities.map((cap) => (
                        <div key={cap} className="flex items-start gap-2">
                          <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Restrictions</p>
                    <div className="space-y-1.5">
                      {activeLevel.restrictions.map((r) => (
                        <div key={r} className="flex items-start gap-2">
                          <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    UI: {activeLevel.uiPattern}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Property</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Value</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Scale</td>
                <td className="py-2.5 pr-4">6 levels (1–6)</td>
                <td className="py-2.5">From Human-Augmented to Human-Out-of-the-Loop</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Default</td>
                <td className="py-2.5 pr-4">Level 2</td>
                <td className="py-2.5">Start conservative, unlock higher levels over time</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Indicator</td>
                <td className="py-2.5 pr-4">Stepped bar</td>
                <td className="py-2.5">Discrete steps, not a continuous slider</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Autonomy levels should be progressive — start at Level 2 for new evaluations and
          unlock higher levels only after the agent has demonstrated reliability. Never
          default to full autonomy for evaluation tasks that affect certification outcomes.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Mode Toggles                                     */}
      {/* ============================================================ */}
      <section id="mode-toggles" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Mode Toggles</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Switch the agent's operational mode to focus on different aspects of the
          evaluation workflow. Each mode changes available tools and priorities.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "design", label: "Design" },
              { key: "implementation", label: "Implementation" },
              { key: "launch", label: "Launch" },
            ]}
            active={modeCtrl}
            onToggle={makeToggle(setModeCtrl, setModeAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={modeAnimKey}>
            <div className="trust-slide-in">
              <div className="space-y-4">
                {/* Mode header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={modeCtrl.design ? Shield01Icon : modeCtrl.implementation ? Search01Icon : Target01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activeMode.label} mode</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>

                {/* Focus */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Focus</p>
                  <p className="text-sm text-muted-foreground">{activeMode.focus}</p>
                </div>

                {/* Available tools */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Available tools</p>
                  <div className="grid grid-cols-2 gap-2">
                    {activeMode.tools.map((tool, i) => (
                      <div
                        key={tool}
                        className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 trust-slide-in"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <HugeiconsIcon icon={Brain01Icon} size={12} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                        <span className="text-xs">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mode selector as toggle buttons */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Switch mode</p>
                  <div className="inline-flex rounded-md border border-border bg-muted/30 p-0.5">
                    {(["design", "implementation", "launch"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => makeToggle(setModeCtrl, setModeAnimKey)(m)}
                        className={`rounded-md px-3 py-1.5 text-xs transition-all duration-150 ${
                          modeCtrl[m]
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {MODE_CONFIGS[m].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Mode</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Focus</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Tools</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Design</td>
                <td className="py-2.5 pr-4">Interaction quality and design fidelity</td>
                <td className="py-2.5">4 design-specific tools</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Implementation</td>
                <td className="py-2.5 pr-4">PR, instrumentation, and rollout logic review</td>
                <td className="py-2.5">4 implementation-specific tools</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Launch</td>
                <td className="py-2.5 pr-4">Launch readiness, blockers, and handoff review</td>
                <td className="py-2.5">4 launch-specific tools</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Mode switching should be instant — no confirmation dialog needed since it only changes
          tool availability and focus, not data access. Evaluators typically switch modes
          multiple times during a single evaluation session.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Context Scope                                    */}
      {/* ============================================================ */}
      <section id="context-scope" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Context Scope</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Define which documents and evaluation artifacts the agent can access.
          Narrower scopes reduce noise; wider scopes enable cross-referencing.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "designOnly", label: "Design Only" },
              { key: "repoDesign", label: "Repo + Design" },
              { key: "global", label: "Full Launch Bundle" },
            ]}
            active={scopeCtrl}
            onToggle={makeToggle(setScopeCtrl, setScopeAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={scopeAnimKey}>
            <div className="trust-slide-in">
              <div className="space-y-4">
                {/* Scope indicator */}
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon icon={Target01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activeScope.label}</p>
                    <p className="text-xs text-muted-foreground">{activeScope.scope}</p>
                  </div>
                </div>

                {/* Document list */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Accessible documents</p>
                  <div className="space-y-2">
                    {activeScope.documents.map((doc, i) => (
                      <div
                        key={doc.name}
                        className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 trust-slide-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <HugeiconsIcon icon={File01Icon} size={12} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium">{doc.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">— {doc.section}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope size indicator */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {activeScope.documents.length} document{activeScope.documents.length !== 1 ? "s" : ""} in scope
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    {["designOnly", "repoDesign", "global"].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 w-4 rounded-md transition-colors ${
                          (s === "designOnly") ||
                          (s === "repoDesign" && (scopeCtrl.repoDesign || scopeCtrl.global)) ||
                          (s === "global" && scopeCtrl.global)
                            ? "bg-foreground/20"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Scope</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Documents</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Use case</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Design Only</td>
                <td className="py-2.5 pr-4">2 documents</td>
                <td className="py-2.5">Focused work on a single design surface</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Repo + Design</td>
                <td className="py-2.5 pr-4">4 documents</td>
                <td className="py-2.5">Comparing implementation against design and launch requirements</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Global</td>
                <td className="py-2.5 pr-4">6 documents</td>
                <td className="py-2.5">Cross-referencing across full evaluation</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Context scope directly affects response quality and cost. A narrower scope
          produces faster, cheaper answers but may miss cross-document dependencies.
          For OR preparation, always use Global scope to ensure nothing is overlooked.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Consent Flow                                     */}
      {/* ============================================================ */}
      <section id="consent-flow" className="page-section">
        <p className="section-label mb-3">Permissions</p>
        <h2 className="text-xl font-semibold tracking-tight">Consent Flow</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Explicit user consent before the agent takes sensitive or irreversible
          actions. Users can accept, decline, or learn more before deciding.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "prompt", label: "Prompt" },
              { key: "accepted", label: "Accepted" },
              { key: "declined", label: "Declined" },
            ]}
            active={consentCtrl}
            onToggle={makeToggle(setConsentCtrl, setConsentAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={consentAnimKey}>
            <div className="trust-slide-in">
              {/* Consent prompt state */}
              {consentCtrl.prompt && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon icon={Shield01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Action requires your approval</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        The agent wants to send an evaluation finding summary to the
                        developer contact for TOE SmartCard-v3.1.
                      </p>
                    </div>
                  </div>
                  <div className="ml-10 rounded-md border border-border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground mb-1">Action preview</p>
                    <p className="text-sm">
                      Email 2 findings (FCS_COP.1, FPT_STM.1) to vendor-contact@example.com
                      with a 10-day response deadline.
                    </p>
                  </div>
                  <div className="ml-10 flex items-center gap-3">
                    <button
                      onClick={() => makeToggle(setConsentCtrl, setConsentAnimKey)("accepted")}
                      className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => makeToggle(setConsentCtrl, setConsentAnimKey)("declined")}
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-muted active:scale-[0.97]"
                    >
                      Decline
                    </button>
                    <button className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
                      Learn more
                    </button>
                  </div>
                </div>
              )}

              {/* Accepted state */}
              {consentCtrl.accepted && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
                      <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Action approved</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Email sent to vendor-contact@example.com with 2 findings.
                        Response deadline: March 25, 2026.
                      </p>
                    </div>
                  </div>
                  <div className="ml-10">
                    <button
                      onClick={() => makeToggle(setConsentCtrl, setConsentAnimKey)("prompt")}
                      className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                    >
                      Reset demo
                    </button>
                  </div>
                </div>
              )}

              {/* Declined state */}
              {consentCtrl.declined && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-500/10">
                      <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Action declined</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        The email was not sent. You can change this in settings or
                        approve the action later from the activity log.
                      </p>
                    </div>
                  </div>
                  <div className="ml-10">
                    <button
                      onClick={() => makeToggle(setConsentCtrl, setConsentAnimKey)("prompt")}
                      className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                    >
                      Reset demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Property</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Value</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Trigger</td>
                <td className="py-2.5 pr-4">Sensitive or irreversible actions</td>
                <td className="py-2.5">Emails, deletions, external API calls</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">States</td>
                <td className="py-2.5 pr-4">Prompt → Accepted / Declined</td>
                <td className="py-2.5">Three mutually exclusive states</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Action preview</td>
                <td className="py-2.5 pr-4">Required</td>
                <td className="py-2.5">Shows exactly what will happen before user decides</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Reversibility</td>
                <td className="py-2.5 pr-4">Settings override</td>
                <td className="py-2.5">Declined actions can be re-approved later</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Consent flows should be lightweight enough that users don't develop "approval fatigue."
          Reserve them for actions with real consequences — sending external communications,
          modifying evaluation records, or deleting evidence.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Confidence Display                               */}
      {/* ============================================================ */}
      <section id="confidence-display" className="page-section">
        <p className="section-label mb-3">Transparency</p>
        <h2 className="text-xl font-semibold tracking-tight">Confidence Display</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          How the agent communicates its certainty level through language,
          visual cues, and actionable follow-ups.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "high", label: "High" },
              { key: "medium", label: "Medium" },
              { key: "low", label: "Low" },
            ]}
            active={confCtrl}
            onToggle={makeToggle(setConfCtrl, setConfAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={confAnimKey}>
            <div className="trust-slide-in">
              {/* High confidence */}
              {confCtrl.high && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">High confidence</span>
                  </div>
                  <div style={PROSE_STYLE}>
                    FCS_COP.1 requires AES-256-CBC encryption for all data-at-rest
                    operations. The TOE implements this through the OpenSSL 3.0 library,
                    validated under CAVP certificate #A4271.
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <HugeiconsIcon icon={File01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Source: Checkout launch brief, acceptance criteria
                    </span>
                  </div>
                </div>
              )}

              {/* Medium confidence */}
              {confCtrl.medium && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-muted-foreground">Medium confidence</span>
                  </div>
                  <div style={PROSE_STYLE}>
                    Based on the available documentation, FPT_STM.1 appears to rely
                    on NTP synchronization for timestamp generation — however, the
                    Security Target does not explicitly confirm this mechanism. The
                    test report references "reliable timestamps" without specifying
                    the source.
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <HugeiconsIcon icon={Alert01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Qualified — based on indirect evidence from TR-2026-003
                    </span>
                  </div>
                </div>
              )}

              {/* Low confidence */}
              {confCtrl.low && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">Low confidence</span>
                  </div>
                  <div style={PROSE_STYLE}>
                    I'm unable to determine whether AVA_VAN.3 vulnerability testing
                    was performed against the current TOE version. The referenced
                    test report (TR-2025-041) predates the latest firmware update,
                    and I could not locate an updated vulnerability analysis.
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <HugeiconsIcon icon={Alert01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Uncertain — key documents may be outdated or missing
                    </span>
                  </div>
                  <button
                    onClick={() => setVerifyClicked(true)}
                    className="mt-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-muted active:scale-[0.97]"
                  >
                    {verifyClicked ? "Verification request sent to evaluator" : "Request evaluator verification"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Level</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Indicator</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Language pattern</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">High</td>
                <td className="py-2.5 pr-4">Green dot</td>
                <td className="py-2.5">Direct assertions with citations</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Medium</td>
                <td className="py-2.5 pr-4">Amber dot</td>
                <td className="py-2.5">Hedged language: "appears to," "based on"</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Low</td>
                <td className="py-2.5 pr-4">Red dot</td>
                <td className="py-2.5">Explicit uncertainty + verify action</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Confidence indicators should never be hidden from the user. Even when
          the agent is highly confident, showing the source builds trust over time.
          Low-confidence responses must always offer a path to human verification.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Kill Switch                                      */}
      {/* ============================================================ */}
      <section id="kill-switch" className="page-section">
        <p className="section-label mb-3">Control</p>
        <h2 className="text-xl font-semibold tracking-tight">Kill Switch</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Always-available mechanism to immediately halt agent execution.
          The stop control adapts its prominence to the agent's current state.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "idle", label: "Idle" },
              { key: "running", label: "Running" },
              { key: "stopped", label: "Stopped" },
            ]}
            active={killCtrl}
            onToggle={makeToggle(setKillCtrl, setKillAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={killAnimKey}>
            <div className="trust-slide-in">
              {/* Idle state */}
              {killCtrl.idle && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon icon={Brain01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm">Agent idle</p>
                        <p className="text-xs text-muted-foreground">Waiting for instructions</p>
                      </div>
                    </div>
                    <button className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted">
                      Stop
                    </button>
                  </div>
                </div>
              )}

              {/* Running state */}
              {killCtrl.running && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon icon={Activity01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground trust-pulse" />
                      </div>
                      <div>
                        <p className="text-sm">Analyzing SFR coverage matrix</p>
                        <p className="text-xs text-muted-foreground">Processing 23 requirements…</p>
                      </div>
                    </div>
                    <button
                      onClick={() => makeToggle(setKillCtrl, setKillAnimKey)("stopped")}
                      className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-foreground transition-all duration-150 hover:bg-red-500/20 active:scale-[0.97]"
                    >
                      Stop agent
                    </button>
                  </div>
                  <div className="ml-10">
                    <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-foreground/20"
                        style={{ width: "62%", animation: "trust-progress 1s ease forwards", ["--target-width" as string]: "62%" }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">14 of 23 SFRs processed</p>
                  </div>
                </div>
              )}

              {/* Stopped state */}
              {killCtrl.stopped && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10">
                        <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm">Agent stopped</p>
                        <p className="text-xs text-muted-foreground">
                          Halted at 14 of 23 SFRs. Partial results saved.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-10 flex items-center gap-3">
                    <button
                      onClick={() => makeToggle(setKillCtrl, setKillAnimKey)("running")}
                      className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => makeToggle(setKillCtrl, setKillAnimKey)("idle")}
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                    >
                      Discard &amp; reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">State</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Button style</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Behavior</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Idle</td>
                <td className="py-2.5 pr-4">Subtle border</td>
                <td className="py-2.5">Present but low prominence</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Running</td>
                <td className="py-2.5 pr-4">Red-tinted background</td>
                <td className="py-2.5">Prominent, immediately accessible</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Stopped</td>
                <td className="py-2.5 pr-4">Resume + Discard options</td>
                <td className="py-2.5">Partial results preserved, user chooses next step</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The stop button must always be reachable within one click. During long-running
          operations like batch SFR analysis, it should be the most prominent UI element.
          Stopped agents must preserve partial work — never discard without explicit user consent.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 7 — Cost Transparency                                */}
      {/* ============================================================ */}
      <section id="cost-transparency" className="page-section">
        <p className="section-label mb-3">Transparency</p>
        <h2 className="text-xl font-semibold tracking-tight">Cost Transparency</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Showing users the computational cost of agent operations. Compact mode
          provides a glanceable summary; detailed mode breaks down token usage and pricing.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "compact", label: "Compact" },
              { key: "detailed", label: "Detailed" },
            ]}
            active={costCtrl}
            onToggle={makeToggle(setCostCtrl, setCostAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={costAnimKey}>
            <div className="trust-slide-in">
              {/* Compact */}
              {costCtrl.compact && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Activity01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">16,138 tokens</span>
                  </div>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">${COST_BREAKDOWN.totalCost.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Clock01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{COST_BREAKDOWN.elapsed}</span>
                  </div>
                </div>
              )}

              {/* Detailed */}
              {costCtrl.detailed && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={Activity01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-sm">Operation cost breakdown</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Input tokens</p>
                      <p className="text-sm font-medium tabular-nums">{COST_BREAKDOWN.inputTokens.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Output tokens</p>
                      <p className="text-sm font-medium tabular-nums">{COST_BREAKDOWN.outputTokens.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Input cost</p>
                      <p className="text-sm font-medium tabular-nums">${COST_BREAKDOWN.inputCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Output cost</p>
                      <p className="text-sm font-medium tabular-nums">${COST_BREAKDOWN.outputCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Model</p>
                      <p className="text-sm font-mono text-muted-foreground">{COST_BREAKDOWN.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time elapsed</p>
                      <p className="text-sm font-medium tabular-nums">{COST_BREAKDOWN.elapsed}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total cost</span>
                    <span className="text-sm font-medium tabular-nums">${COST_BREAKDOWN.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Mode</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Shows</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Use case</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Compact</td>
                <td className="py-2.5 pr-4">Total tokens, cost, elapsed time</td>
                <td className="py-2.5">Inline display after each response</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Detailed</td>
                <td className="py-2.5 pr-4">Input/output split, model, pricing</td>
                <td className="py-2.5">Budget review and cost optimization</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Cost transparency builds trust with procurement teams and lab managers
          who need to justify AI spending. The compact format should be
          unobtrusive; detailed mode is for when users actively want to understand costs.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 8 — Data Provenance                                  */}
      {/* ============================================================ */}
      <section id="data-provenance" className="page-section">
        <p className="section-label mb-3">Transparency</p>
        <h2 className="text-xl font-semibold tracking-tight">Data Provenance</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Tracing information back to its origin. Sources mode shows where data came from;
          chain mode shows the full reasoning path from source to conclusion.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "sources", label: "Sources" },
              { key: "chain", label: "Chain" },
            ]}
            active={provCtrl}
            onToggle={makeToggle(setProvCtrl, setProvAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={provAnimKey}>
            <div className="trust-slide-in">
              {/* Sources */}
              {provCtrl.sources && (
                <div className="space-y-3">
                  {PROVENANCE_SOURCES.map((src, i) => (
                    <div
                      key={src.document}
                      className="flex items-start gap-3 rounded-md border border-border/60 p-3 trust-slide-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon icon={File01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{src.document}</p>
                          <span className="shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {src.type}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{src.section}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-foreground/20"
                              style={{ width: `${src.confidence * 100}%`, animation: "trust-progress 0.6s ease forwards", ["--target-width" as string]: `${src.confidence * 100}%`, animationDelay: `${i * 80 + 200}ms` }}
                            />
                          </div>
                          <span className="text-[10px] tabular-nums text-muted-foreground">{(src.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Chain */}
              {provCtrl.chain && (
                <div className="space-y-0">
                  {PROVENANCE_CHAIN.map((node, i) => (
                    <div key={node.step}>
                      <div
                        className="flex items-start gap-3 trust-slide-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                            {i + 1}
                          </div>
                          {i < PROVENANCE_CHAIN.length - 1 && (
                            <div className="w-px h-6 bg-border/60 my-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{node.step}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs font-medium">{node.label}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{node.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center gap-2 trust-fade-in" style={{ animationDelay: "400ms" }}>
                    <HugeiconsIcon icon={LinkSquare01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Full chain: 4 steps from source to conclusion
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Mode</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Shows</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">When to use</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Sources</td>
                <td className="py-2.5 pr-4">Document, section, confidence, type</td>
                <td className="py-2.5">Quick verification of data origin</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Chain</td>
                <td className="py-2.5 pr-4">Source → fact → inference → conclusion</td>
                <td className="py-2.5">Auditing the full reasoning path</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          In CC evaluations, every claim must be traceable to evidence. Data provenance
          mirrors the evaluator's own methodology — showing the chain from source
          document through extracted requirement to analytical conclusion. This makes
          agent outputs auditable by evaluation facilities.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 9 — Audit Trail                                      */}
      {/* ============================================================ */}
      <section id="audit-trail" className="page-section">
        <p className="section-label mb-3">Accountability</p>
        <h2 className="text-xl font-semibold tracking-tight">Audit Trail</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Immutable log of all agent actions for compliance and review. Summary
          mode shows a compact timeline; detailed mode expands each entry with
          full context and evidence links.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "summary", label: "Summary" },
              { key: "detailed", label: "Detailed" },
            ]}
            active={auditCtrl}
            onToggle={makeToggle(setAuditCtrl, setAuditAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={auditAnimKey}>
            <div className="trust-slide-in">
              {/* Summary */}
              {auditCtrl.summary && (
                <div className="space-y-2">
                  {AUDIT_ENTRIES.map((entry, i) => (
                    <div
                      key={entry.time}
                      className="flex items-center gap-3 trust-slide-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground font-mono">
                        {entry.time}
                      </span>
                      <div className="h-px flex-1 bg-border/40" />
                      <span className="text-sm">{entry.action}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed */}
              {auditCtrl.detailed && (
                <div className="space-y-4">
                  {AUDIT_ENTRIES.map((entry, i) => (
                    <div
                      key={entry.time}
                      className="rounded-md border border-border/60 p-3 trust-slide-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] tabular-nums text-muted-foreground font-mono">
                            {entry.time}
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{entry.user}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{entry.outcome}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <HugeiconsIcon icon={File01Icon} size={11} strokeWidth={1.5} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{entry.evidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Mode</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Shows</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Audience</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Summary</td>
                <td className="py-2.5 pr-4">Timestamp + action description</td>
                <td className="py-2.5">Quick scan during evaluation</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Detailed</td>
                <td className="py-2.5 pr-4">User, outcome, evidence links</td>
                <td className="py-2.5">Formal audit and compliance review</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Audit trails are a regulatory requirement in CC and CRA contexts. Every
          agent action must be logged with enough detail for an ITSEF evaluator to
          reconstruct exactly what happened. The summary view keeps daily work
          manageable while the detailed view satisfies formal audit needs.
        </div>
      </section>
    </article>
  )
}
