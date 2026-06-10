"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert01Icon,
  Tick01Icon,
  Cancel01Icon,
  Clock01Icon,
  Shield01Icon,
  Activity01Icon,
  Brain01Icon,
  Coins01Icon,
  File01Icon,
  LinkSquare01Icon,
  Target01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Button } from "@/components/ui/button"
import {
  EffectivePolicyPreview,
  type EffectivePolicy,
} from "@/components/ui/effective-policy-preview"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
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

const AUDIT_ENTRIES = [
  {
    time: "14:02:11",
    action: "Opened Project brief v3",
    user: "Agent",
    outcome: "Loaded 23 requirement definitions",
    source: "Project-Brief-v3.pdf",
  },
  {
    time: "14:02:14",
    action: "Cross-referenced Export workflow QA notes",
    user: "Agent",
    outcome: "3 of 4 checks passed",
    source: "QA Notes 2026-003, §4.2",
  },
  {
    time: "14:02:18",
    action: "Flagged Export workflow for reviewer approval",
    user: "Agent",
    outcome: "Added to OR agenda item #7",
    source: "Review-Agenda-2026-03.docx",
  },
  {
    time: "14:02:22",
    action: "Reviewer approved finding classification",
    user: "Morgan Lee (review team)",
    outcome: "Finding confirmed as minor",
    source: "Launch-Review-2026-v2.pdf, §6.1",
  },
]

const PROVENANCE_SOURCES = [
  {
    document: "Project brief v3",
    section: "§5.1 — Requirement Definitions",
    confidence: 0.94,
    type: "Primary",
  },
  {
    document: "Operating playbook",
    section: "§12.4 — Reviewer Actions",
    confidence: 0.87,
    type: "Guidance",
  },
  {
    document: "Previous launch review (2025-08)",
    section: "§6 — Findings Summary",
    confidence: 0.71,
    type: "Reference",
  },
]

const PROVENANCE_CHAIN = [
  {
    step: "Source",
    label: "Brief v3, §5.1",
    detail: "Export workflow specifies CSV and JSON export",
  },
  {
    step: "Extracted",
    label: "Requirement",
    detail:
      "product must implement CSV and JSON export per the internal data policy",
  },
  {
    step: "Inference",
    label: "Gap analysis",
    detail:
      "Test case TC-047 covers CSV exports but not JSON pagination edge cases",
  },
  {
    step: "Conclusion",
    label: "Finding",
    detail: "Partial coverage — recommend an additional large-export test",
  },
]

const COST_BREAKDOWN = {
  model: "claude-opus-4-6",
  inputTokens: 12_847,
  outputTokens: 287,
  inputCost: 0.19,
  outputCost: 0.02,
  totalCost: 0.21,
  elapsed: "4.2s",
}

const AUTONOMY_LEVELS = [
  {
    level: 2,
    name: "Human-in-Command",
    description:
      "AI drafts outputs and proposes actions; human approves every one before execution.",
    uiPattern: "Approval modal",
    capabilities: [
      "Draft project findings for review",
      "Propose requirement-to-test-case mappings",
      "Suggest source requests to developer",
    ],
    restrictions: [
      "Cannot send emails without approval",
      "Cannot modify project records",
      "Cannot create or close findings",
    ],
  },
  {
    level: 3,
    name: "Human-Delegated",
    description:
      "AI handles routine tasks autonomously; human reviews only flagged exceptions.",
    uiPattern: "Inbox of flagged items",
    capabilities: [
      "Automatically cross-reference requirement coverage",
      "Generate routine status reports",
      "Send pre-approved notification templates",
    ],
    restrictions: [
      "Flags novel findings for human review",
      "Cannot submit source packages to lab",
      "Escalates if confidence drops below 70%",
    ],
  },
  {
    level: 4,
    name: "Human-in-the-Loop",
    description:
      "AI executes freely but escalates when confidence drops below a set threshold.",
    uiPattern: "Confidence slider",
    capabilities: [
      "Execute full review workflows end-to-end",
      "Send emails and create findings autonomously",
      "Update project brief revision history",
    ],
    restrictions: [
      "Escalates on confidence below threshold",
      "Cannot approve final launch summary submission",
      "Human monitors via activity dashboard",
    ],
  },
]

const SETTINGS_TEMPLATES = [
  {
    id: "autonomy-settings",
    title: "Autonomy Settings",
    description:
      "Set the maximum independence level, escalation threshold, and allowed action classes.",
    enabled: true,
  },
  {
    id: "notification-settings",
    title: "Notification Settings",
    description:
      "Choose when background runs, blockers, approvals, and completions notify users.",
    enabled: true,
  },
  {
    id: "approval-policy-settings",
    title: "Approval Policy Settings",
    description:
      "Require confirmation for external communication, spending, publishing, and destructive edits.",
    enabled: true,
  },
  {
    id: "memory-privacy-settings",
    title: "Memory & Privacy Settings",
    description:
      "Control durable memory review, workspace scope, expiry, and removal behavior.",
    enabled: false,
  },
] as const

const MODE_CONFIGS = {
  requirements: {
    label: "Requirements",
    focus:
      "Ensuring all source material meets operating playbook requirements and policy alignment claims.",
    tools: [
      "Source completeness checker",
      "Requirement coverage matrix generator",
      "Policy alignment validator",
      "Lifecycle document scanner",
    ],
  },
  research: {
    label: "Research",
    focus:
      "Investigating technical aspects of the product, analyzing risk reports, and reviewing export implementations.",
    tools: [
      "Risk database search",
      "Export behavior verifier",
      "Technical document analyzer",
      "Platform capability lookup",
    ],
  },
  review: {
    label: "Review",
    focus:
      "Reviewing project deliverables, checking consistency across documents, and preparing for stakeholder reviews.",
    tools: [
      "Cross-document consistency checker",
      "Launch summary section reviewer",
      "Finding classification advisor",
      "Audit preparation checklist",
    ],
  },
}

const SCOPE_CONFIGS = {
  portal: {
    label: "Portal Only",
    scope: "ACME Customer Portal v3.1",
    documents: [
      { name: "Project brief v3", section: "Full document" },
      { name: "QA Notes 2026-003", section: "Product-specific checks" },
    ],
  },
  portalPolicy: {
    label: "Portal + Policy",
    scope: "ACME Customer Portal v3.1 + Launch Policy v2",
    documents: [
      { name: "Project brief v3", section: "Full document" },
      { name: "QA Notes 2026-003", section: "All check results" },
      { name: "Launch Policy v2", section: "Requirement definitions" },
      { name: "Policy Review Report", section: "Alignment claims" },
    ],
  },
  global: {
    label: "Global",
    scope: "All project artifacts",
    documents: [
      { name: "Project brief v3", section: "Full document" },
      { name: "QA Notes 2026-003", section: "All check results" },
      { name: "Launch Policy v2", section: "Full document" },
      {
        name: "Previous launch review (2025-08)",
        section: "Findings and conclusions",
      },
      { name: "Operating playbook", section: "Reviewer actions" },
      { name: "Risk Analysis Report", section: "risk review results" },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Agent prose helper                                                 */
/* ------------------------------------------------------------------ */

const PROSE_STYLE: React.CSSProperties = {
  fontFamily: "'Source Serif 4', serif",
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "0",
  fontVariationSettings: '"opsz" 12',
  color: "var(--foreground)",
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function TrustContent() {
  const [settingsEnabled, setSettingsEnabled] = useState<
    Record<(typeof SETTINGS_TEMPLATES)[number]["id"], boolean>
  >(() =>
    SETTINGS_TEMPLATES.reduce(
      (acc, template) => {
        acc[template.id] = template.enabled
        return acc
      },
      {} as Record<(typeof SETTINGS_TEMPLATES)[number]["id"], boolean>
    )
  )

  const toggleSetting = (id: (typeof SETTINGS_TEMPLATES)[number]["id"]) => {
    setSettingsEnabled((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  /* — Autonomy Level — */
  const [autoCtrl, setAutoCtrl] = useState<Record<string, boolean>>({
    level2: true,
    level3: false,
    level4: false,
  })
  const [autoAnimKey, setAutoAnimKey] = useState(0)

  /* — Mode Toggles — */
  const [modeCtrl, setModeCtrl] = useState<Record<string, boolean>>({
    requirements: true,
    research: false,
    review: false,
  })
  const [modeAnimKey, setModeAnimKey] = useState(0)

  /* — Context Scope — */
  const [scopeCtrl, setScopeCtrl] = useState<Record<string, boolean>>({
    portal: true,
    portalPolicy: false,
    global: false,
  })
  const [scopeAnimKey, setScopeAnimKey] = useState(0)

  /* — Consent Flow — */
  const [consentCtrl, setConsentCtrl] = useState<Record<string, boolean>>({
    prompt: true,
    accepted: false,
    declined: false,
  })
  const [consentAnimKey, setConsentAnimKey] = useState(0)
  const consentOutcomeRef = useRef<HTMLDivElement>(null)
  const consentFocusPending = useRef(false)

  /* Approve/Decline unmount the focused button — move focus to the outcome */
  useEffect(() => {
    if (
      consentFocusPending.current &&
      (consentCtrl.accepted || consentCtrl.declined)
    ) {
      consentFocusPending.current = false
      consentOutcomeRef.current?.focus()
    }
  }, [consentCtrl])

  /* — Confidence Display — */
  const [confCtrl, setConfCtrl] = useState<Record<string, boolean>>({
    high: true,
    medium: false,
    low: false,
  })
  const [confAnimKey, setConfAnimKey] = useState(0)
  const [verifyClicked, setVerifyClicked] = useState(false)

  const handleConfToggle = useCallback((key: string) => {
    setConfCtrl((prev) => {
      const next: Record<string, boolean> = {}
      for (const k of Object.keys(prev)) next[k] = false
      next[key] = true
      return next
    })
    setConfAnimKey((n) => n + 1)
    setVerifyClicked(false)
  }, [])

  /* — Kill Switch — */
  const [killCtrl, setKillCtrl] = useState<Record<string, boolean>>({
    idle: true,
    running: false,
    stopped: false,
  })
  const [killAnimKey, setKillAnimKey] = useState(0)

  /* — Cost Transparency — */
  const [costCtrl, setCostCtrl] = useState<Record<string, boolean>>({
    compact: true,
    detailed: false,
  })
  const [costAnimKey, setCostAnimKey] = useState(0)

  /* — Data Provenance — */
  const [provCtrl, setProvCtrl] = useState<Record<string, boolean>>({
    sources: true,
    chain: false,
  })
  const [provAnimKey, setProvAnimKey] = useState(0)

  /* — Audit Trail — */
  const [auditCtrl, setAuditCtrl] = useState<Record<string, boolean>>({
    summary: true,
    detailed: false,
  })
  const [auditAnimKey, setAuditAnimKey] = useState(0)

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

  /* Resolve active autonomy level */
  const activeLevel = autoCtrl.level2
    ? AUTONOMY_LEVELS[0]
    : autoCtrl.level3
      ? AUTONOMY_LEVELS[1]
      : AUTONOMY_LEVELS[2]

  /* Resolve active mode */
  const activeMode = modeCtrl.requirements
    ? MODE_CONFIGS.requirements
    : modeCtrl.research
      ? MODE_CONFIGS.research
      : MODE_CONFIGS.review

  /* Resolve active scope */
  const activeScope = scopeCtrl.portal
    ? SCOPE_CONFIGS.portal
    : scopeCtrl.portalPolicy
      ? SCOPE_CONFIGS.portalPolicy
      : SCOPE_CONFIGS.global

  const effectivePolicies: EffectivePolicy[] = [
    {
      label: "Autonomy",
      value: `Maximum Level ${activeLevel.level}: ${activeLevel.name}`,
      description: settingsEnabled["autonomy-settings"]
        ? "Applies to the current workspace until changed."
        : "Using product defaults because custom autonomy settings are off.",
      status: "review",
    },
    {
      label: "External actions",
      value: settingsEnabled["approval-policy-settings"]
        ? "Approval required before sending, publishing, or modifying shared records."
        : "Allowed by workflow defaults.",
      description:
        "Risky actions should show a locked consequence preview before execution.",
      status: settingsEnabled["approval-policy-settings"]
        ? "required"
        : "allowed",
    },
    {
      label: "Notifications",
      value: settingsEnabled["notification-settings"]
        ? "Notify on blockers, approvals, completions, and budget warnings."
        : "Only critical blockers notify users.",
      status: settingsEnabled["notification-settings"] ? "allowed" : "review",
    },
    {
      label: "Memory",
      value: settingsEnabled["memory-privacy-settings"]
        ? "Memory changes require review, scope, provenance, and expiry."
        : "Durable memory is blocked until review settings are enabled.",
      description: "Memory should not expand scope silently.",
      status: settingsEnabled["memory-privacy-settings"]
        ? "required"
        : "blocked",
    },
  ]

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Trust &amp; Control Plane
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Autonomy governance, operational configuration, transparency, and
          guardrail patterns that establish and maintain user trust in agentic
          experiences.
        </p>
      </header>

      <section id="settings-templates" className="page-section">
        <p className="section-label mb-3">Configuration</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Settings Templates
        </h2>
        <p className="mt-2 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Reusable control groups for product teams that need durable agent
          boundaries across sessions, not one-off prompt instructions.
        </p>

        <FieldGroup className="mt-8 rounded-lg border border-border/40 p-6">
          <FieldSet>
            <FieldLegend>Reusable Settings Groups</FieldLegend>
            {SETTINGS_TEMPLATES.map((template) => (
              <Field key={template.id} orientation="horizontal">
                <Switch
                  id={template.id}
                  checked={settingsEnabled[template.id]}
                  onCheckedChange={() => toggleSetting(template.id)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={template.id}>
                    {template.title}
                  </FieldLabel>
                  <FieldDescription>{template.description}</FieldDescription>
                </FieldContent>
              </Field>
            ))}
          </FieldSet>
        </FieldGroup>

        <EffectivePolicyPreview className="mt-4" policies={effectivePolicies} />

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm leading-relaxed text-muted-foreground italic">
          Settings templates should use confirmation or undo for risky changes
          such as disabling approval gates, lowering escalation thresholds, or
          expanding memory scope.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 1 — Autonomy Level                                   */}
      {/* ============================================================ */}
      <section id="autonomy-level" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Autonomy Level</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Select how much independence the agent has. Higher levels increase
          speed but reduce oversight. Uses the 6-level autonomy scale from
          foundations.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={autoAnimKey}
          >
            <div className="trust-slide-in">
              {/* Stepped indicator */}
              <div className="mb-6 flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div
                      className={`h-2 w-full rounded-md transition-colors duration-200 ${
                        n <= activeLevel.level ? "bg-foreground/20" : "bg-muted"
                      }`}
                    />
                    <span
                      className={`text-[10px] tabular-nums ${
                        n === activeLevel.level
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {n}
                    </span>
                  </div>
                ))}
              </div>

              {/* Level details */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Level {activeLevel.level}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-sm font-medium">
                      {activeLevel.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activeLevel.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Capabilities
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {activeLevel.capabilities.map((cap) => (
                        <div key={cap} className="flex items-start gap-2">
                          <HugeiconsIcon
                            icon={Tick01Icon}
                            size={12}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0 text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            {cap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Restrictions
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {activeLevel.restrictions.map((r) => (
                        <div key={r} className="flex items-start gap-2">
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            size={12}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0 text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            {r}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="pt-2 text-xs text-muted-foreground">
                  Surface: {activeLevel.uiPattern}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Property
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Value
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Scale
                </TableCell>
                <TableCell className="py-2.5 pr-4">6 levels (1–6)</TableCell>
                <TableCell className="py-2.5">
                  From Human-Augmented to Human-Out-of-the-Loop
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Default
                </TableCell>
                <TableCell className="py-2.5 pr-4">Level 2</TableCell>
                <TableCell className="py-2.5">
                  Start conservative, unlock higher levels over time
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Indicator
                </TableCell>
                <TableCell className="py-2.5 pr-4">Stepped bar</TableCell>
                <TableCell className="py-2.5">
                  Discrete steps, not a continuous slider
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Autonomy levels should be progressive — start at Level 2 for new
          workflows and unlock higher levels only after the agent has
          demonstrated reliability. Never default to full autonomy for review
          tasks that affect approval outcomes.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Mode Toggles                                     */}
      {/* ============================================================ */}
      <section id="mode-toggles" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Mode Toggles</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Switch the agent's operational mode to focus on different aspects of
          the review workflow. Each mode changes available tools and priorities.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "requirements", label: "Requirements" },
              { key: "research", label: "Research" },
              { key: "review", label: "Review" },
            ]}
            active={modeCtrl}
            onToggle={makeToggle(setModeCtrl, setModeAnimKey)}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            key={modeAnimKey}
          >
            <div className="trust-slide-in">
              <div className="flex flex-col gap-4">
                {/* Mode header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={
                        modeCtrl.requirements
                          ? Shield01Icon
                          : modeCtrl.research
                            ? Search01Icon
                            : Target01Icon
                      }
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {activeMode.label} mode
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>

                {/* Focus */}
                <div>
                  <p className="mb-1.5 text-xs text-muted-foreground">Focus</p>
                  <p className="text-sm text-muted-foreground">
                    {activeMode.focus}
                  </p>
                </div>

                {/* Available tools */}
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Available tools
                  </p>
                  <div className="divide-y divide-border/50">
                    {activeMode.tools.map((tool, i) => (
                      <div
                        key={tool}
                        className="trust-slide-in flex items-center gap-2 py-1.5"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <HugeiconsIcon
                          icon={Brain01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-xs">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Mode
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Focus
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Tools
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Requirements
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Source material and policy alignment
                </TableCell>
                <TableCell className="py-2.5">
                  4 requirements-specific tools
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Research
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Technical investigation
                </TableCell>
                <TableCell className="py-2.5">
                  4 research-specific tools
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Review
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Deliverable review and audit prep
                </TableCell>
                <TableCell className="py-2.5">
                  4 review-specific tools
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Mode switching should be instant — no confirmation dialog needed since
          it only changes tool availability and focus, not data access.
          Reviewers typically switch modes multiple times during a single review
          session.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Context Scope                                    */}
      {/* ============================================================ */}
      <section id="context-scope" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Context Scope</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Define which documents and project artifacts the agent can access.
          Narrower scopes reduce noise; wider scopes enable cross-referencing.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "portal", label: "Portal Only" },
              { key: "portalPolicy", label: "Portal + Policy" },
              { key: "global", label: "Global" },
            ]}
            active={scopeCtrl}
            onToggle={makeToggle(setScopeCtrl, setScopeAnimKey)}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            key={scopeAnimKey}
          >
            <div className="trust-slide-in">
              <div className="flex flex-col gap-4">
                {/* Scope indicator */}
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={Target01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activeScope.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {activeScope.scope}
                    </p>
                  </div>
                </div>

                {/* Document list */}
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Accessible documents
                  </p>
                  <div className="divide-y divide-border/40">
                    {activeScope.documents.map((doc, i) => (
                      <div
                        key={doc.name}
                        className="trust-slide-in flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <HugeiconsIcon
                          icon={File01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="shrink-0 text-muted-foreground"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-medium">
                            {doc.name}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            — {doc.section}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope size indicator */}
                <div className="flex flex-col gap-2 pt-2">
                  <Separator />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {activeScope.documents.length} document
                      {activeScope.documents.length !== 1 ? "s" : ""} in scope
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      {["portal", "portalPolicy", "global"].map((s) => (
                        <div
                          key={s}
                          className={`h-1.5 w-4 rounded-md transition-colors ${
                            s === "portal" ||
                            (s === "portalPolicy" &&
                              (scopeCtrl.portalPolicy || scopeCtrl.global)) ||
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
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Scope
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Documents
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Use case
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Portal Only
                </TableCell>
                <TableCell className="py-2.5 pr-4">2 documents</TableCell>
                <TableCell className="py-2.5">
                  Focused work on a single product
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Portal + Policy
                </TableCell>
                <TableCell className="py-2.5 pr-4">4 documents</TableCell>
                <TableCell className="py-2.5">
                  Evaluating policy alignment claims
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Global
                </TableCell>
                <TableCell className="py-2.5 pr-4">6 documents</TableCell>
                <TableCell className="py-2.5">
                  Cross-referencing across full project workspace
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Context scope directly affects response quality and cost. A narrower
          scope produces faster, cheaper answers but may miss cross-document
          dependencies. For OR preparation, always use Global scope to ensure
          nothing is overlooked.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={consentAnimKey}
          >
            <div className="trust-slide-in">
              {/* Consent prompt state */}
              {consentCtrl.prompt && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Shield01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Action requires your approval
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        The agent wants to send a project finding summary to the
                        developer contact for ACME Customer Portal v3.1.
                      </p>
                    </div>
                  </div>
                  <div className="ml-10 border-l border-border/60 bg-muted/30 py-3 pl-4">
                    <p className="mb-1 text-xs text-muted-foreground">
                      Action preview
                    </p>
                    <p className="text-sm">
                      Email 2 findings (Export workflow, Timestamp handling) to
                      project-owner@acme.internal with a 10-day response
                      deadline.
                    </p>
                  </div>
                  <div className="ml-10 flex items-center gap-3">
                    <Button
                      onClick={() => {
                        consentFocusPending.current = true
                        makeToggle(
                          setConsentCtrl,
                          setConsentAnimKey
                        )("accepted")
                      }}
                      size="xs"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        consentFocusPending.current = true
                        makeToggle(
                          setConsentCtrl,
                          setConsentAnimKey
                        )("declined")
                      }}
                      variant="outline"
                      size="xs"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="link"
                      size="xs"
                      className="text-muted-foreground"
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
              )}

              {/* Accepted state */}
              {consentCtrl.accepted && (
                <div
                  ref={consentOutcomeRef}
                  tabIndex={-1}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div role="status">
                      <p className="text-sm font-medium">Action approved</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Email sent to project-owner@acme.internal with 2
                        findings. Response deadline: March 25, 2026.
                      </p>
                    </div>
                  </div>
                  <div className="ml-10">
                    <Button
                      onClick={() =>
                        makeToggle(setConsentCtrl, setConsentAnimKey)("prompt")
                      }
                      variant="outline"
                      size="xs"
                    >
                      Reset demo
                    </Button>
                  </div>
                </div>
              )}

              {/* Declined state */}
              {consentCtrl.declined && (
                <div
                  ref={consentOutcomeRef}
                  tabIndex={-1}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div role="status">
                      <p className="text-sm font-medium">Action declined</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        The email was not sent. You can change this in settings
                        or approve the action later from the activity log.
                      </p>
                    </div>
                  </div>
                  <div className="ml-10">
                    <Button
                      onClick={() =>
                        makeToggle(setConsentCtrl, setConsentAnimKey)("prompt")
                      }
                      variant="outline"
                      size="xs"
                    >
                      Reset demo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Property
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Value
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Trigger
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Sensitive or irreversible actions
                </TableCell>
                <TableCell className="py-2.5">
                  Emails, deletions, external API calls
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  States
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Prompt → Accepted / Declined
                </TableCell>
                <TableCell className="py-2.5">
                  Three mutually exclusive states
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Action preview
                </TableCell>
                <TableCell className="py-2.5 pr-4">Required</TableCell>
                <TableCell className="py-2.5">
                  Shows exactly what will happen before user decides
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Reversibility
                </TableCell>
                <TableCell className="py-2.5 pr-4">Settings override</TableCell>
                <TableCell className="py-2.5">
                  Declined actions can be re-approved later
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Consent flows should be lightweight enough that users don't develop
          "approval fatigue." Reserve them for actions with real consequences —
          sending external communications, modifying project records, or
          deleting source material.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Confidence Display                               */}
      {/* ============================================================ */}
      <section id="confidence-display" className="page-section">
        <p className="section-label mb-3">Transparency</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Confidence Display
        </h2>
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
            onToggle={handleConfToggle}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            key={confAnimKey}
          >
            <div className="trust-slide-in">
              {/* High confidence */}
              {confCtrl.high && (
                <div className="flex flex-col gap-4">
                  <div className="mb-3 flex items-center justify-end gap-1.5">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-[oklch(0.62_0.14_155)]"
                    />
                    <span className="text-xs text-muted-foreground">
                      High confidence
                    </span>
                  </div>
                  <div style={PROSE_STYLE}>
                    Export workflow requires CSV and JSON export encryption for
                    all data-at-rest operations. The product implements this
                    through the approved export service referenced by the
                    implementation notes.
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <HugeiconsIcon
                      icon={File01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      Source: Project brief v3, §5.1.1
                    </span>
                  </div>
                </div>
              )}

              {/* Medium confidence */}
              {confCtrl.medium && (
                <div className="flex flex-col gap-4">
                  <div className="mb-3 flex items-center justify-end gap-1.5">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-[oklch(0.75_0.13_85)]"
                    />
                    <span className="text-xs text-muted-foreground">
                      Medium confidence
                    </span>
                  </div>
                  <div style={PROSE_STYLE}>
                    Based on the available documentation, Timestamp handling
                    appears to rely on NTP synchronization for timestamp
                    generation — however, the project brief does not explicitly
                    confirm this mechanism. The QA notes reference "reliable
                    timestamps" without specifying the source.
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Alert01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      Qualified — based on indirect source material from QA
                      Notes 2026-003
                    </span>
                  </div>
                </div>
              )}

              {/* Low confidence */}
              {confCtrl.low && (
                <div className="flex flex-col gap-4">
                  <div className="mb-3 flex items-center justify-end gap-1.5">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-[oklch(0.6_0.19_25)]"
                    />
                    <span className="text-xs text-muted-foreground">
                      Low confidence
                    </span>
                  </div>
                  <div style={PROSE_STYLE}>
                    I'm unable to determine whether the current risk review was
                    performed against the latest product version. The referenced
                    report predates the latest configuration update, and I could
                    not locate an updated risk analysis.
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <HugeiconsIcon
                      icon={Alert01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      Uncertain — key documents may be outdated or missing
                    </span>
                  </div>
                  <Button
                    onClick={() => setVerifyClicked(true)}
                    variant="outline"
                    size="xs"
                    className="mt-2"
                  >
                    {verifyClicked ? (
                      <span role="status">
                        Verification request sent to reviewer
                      </span>
                    ) : (
                      "Request reviewer verification"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Level
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Indicator
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Language pattern
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  High
                </TableCell>
                <TableCell className="py-2.5 pr-4">Green dot</TableCell>
                <TableCell className="py-2.5">
                  Direct assertions with citations
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Medium
                </TableCell>
                <TableCell className="py-2.5 pr-4">Amber dot</TableCell>
                <TableCell className="py-2.5">
                  Hedged language: "appears to," "based on"
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Low
                </TableCell>
                <TableCell className="py-2.5 pr-4">Red dot</TableCell>
                <TableCell className="py-2.5">
                  Explicit uncertainty + verify action
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Confidence indicators should never be hidden from the user. Even when
          the agent is highly confident, showing the source builds trust over
          time. Low-confidence responses must always offer a path to human
          verification.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Kill Switch                                      */}
      {/* ============================================================ */}
      <section id="kill-switch" className="page-section">
        <p className="section-label mb-3">Control</p>
        <h2 className="text-xl font-semibold tracking-tight">Kill Switch</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Always-available mechanism to immediately halt agent execution. The
          stop control adapts its prominence to the agent's current state.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={killAnimKey}
          >
            <div className="trust-slide-in">
              {/* Idle state */}
              {killCtrl.idle && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon
                          icon={Brain01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div>
                        <p className="text-sm">Agent idle</p>
                        <p className="text-xs text-muted-foreground">
                          Waiting for instructions
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-muted-foreground"
                    >
                      Stop
                    </Button>
                  </div>
                </div>
              )}

              {/* Running state */}
              {killCtrl.running && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon
                          icon={Activity01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="trust-pulse text-muted-foreground"
                        />
                      </div>
                      <div>
                        <p className="text-sm">
                          Analyzing requirement coverage matrix
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Processing 23 requirements…
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        makeToggle(setKillCtrl, setKillAnimKey)("stopped")
                      }
                      variant="destructive"
                      size="xs"
                    >
                      Stop agent
                    </Button>
                  </div>
                  <div className="ml-10">
                    <Progress value={62} />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      14 of 23 requirements processed
                    </p>
                  </div>
                </div>
              )}

              {/* Stopped state */}
              {killCtrl.stopped && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div>
                        <p className="text-sm">Agent stopped</p>
                        <p className="text-xs text-muted-foreground">
                          Halted at 14 of 23 requirements. Partial results
                          saved.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-10 flex items-center gap-3">
                    <Button
                      onClick={() =>
                        makeToggle(setKillCtrl, setKillAnimKey)("running")
                      }
                      size="xs"
                    >
                      Resume
                    </Button>
                    <Button
                      onClick={() =>
                        makeToggle(setKillCtrl, setKillAnimKey)("idle")
                      }
                      variant="outline"
                      size="xs"
                    >
                      Discard &amp; reset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  State
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Button style
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Behavior
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Idle
                </TableCell>
                <TableCell className="py-2.5 pr-4">Subtle border</TableCell>
                <TableCell className="py-2.5">
                  Present but low prominence
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Running
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Red-tinted background
                </TableCell>
                <TableCell className="py-2.5">
                  Prominent, immediately accessible
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Stopped
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Resume + Discard options
                </TableCell>
                <TableCell className="py-2.5">
                  Partial results preserved, user chooses next step
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          The stop button must always be reachable within one click. During
          long-running operations like batch requirement analysis, it should be
          the most prominent UI element. Stopped agents must preserve partial
          work — never discard without explicit user consent.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 7 — Cost Transparency                                */}
      {/* ============================================================ */}
      <section id="cost-transparency" className="page-section">
        <p className="section-label mb-3">Transparency</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Cost Transparency
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Showing users the computational cost of agent operations. Compact mode
          provides a glanceable summary; detailed mode breaks down token usage
          and pricing.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={costAnimKey}
          >
            <div className="trust-slide-in">
              {/* Compact */}
              {costCtrl.compact && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Coins01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      13,134 tokens
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    ${COST_BREAKDOWN.totalCost.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      {COST_BREAKDOWN.elapsed}
                    </span>
                  </div>
                </div>
              )}

              {/* Detailed */}
              {costCtrl.detailed && (
                <div className="flex flex-col gap-4">
                  <div className="mb-2 flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Coins01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                    <span className="text-sm">Operation cost breakdown</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Input tokens
                      </p>
                      <p className="text-sm font-medium tabular-nums">
                        {COST_BREAKDOWN.inputTokens.toLocaleString("en-US")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Output tokens
                      </p>
                      <p className="text-sm font-medium tabular-nums">
                        {COST_BREAKDOWN.outputTokens.toLocaleString("en-US")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Input cost
                      </p>
                      <p className="text-sm font-medium tabular-nums">
                        ${COST_BREAKDOWN.inputCost.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Output cost
                      </p>
                      <p className="text-sm font-medium tabular-nums">
                        ${COST_BREAKDOWN.outputCost.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Model</p>
                      <p className="font-mono text-sm text-muted-foreground">
                        {COST_BREAKDOWN.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Time elapsed
                      </p>
                      <p className="text-sm font-medium tabular-nums">
                        {COST_BREAKDOWN.elapsed}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-3">
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Total cost
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        ${COST_BREAKDOWN.totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Mode
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Shows
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Use case
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Compact
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Total tokens, cost, elapsed time
                </TableCell>
                <TableCell className="py-2.5">
                  Inline display after each response
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Detailed
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Input/output split, model, pricing
                </TableCell>
                <TableCell className="py-2.5">
                  Budget review and cost optimization
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Cost transparency builds trust with procurement teams and lab managers
          who need to justify AI spending. The compact format should be
          unobtrusive; detailed mode is for when users actively want to
          understand costs.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 8 — Data Provenance                                  */}
      {/* ============================================================ */}
      <section id="data-provenance" className="page-section">
        <p className="section-label mb-3">Transparency</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Data Provenance
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Tracing information back to its origin. Sources mode shows where data
          came from; chain mode shows the full reasoning path from source to
          conclusion.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={provAnimKey}
          >
            <div className="trust-slide-in">
              {/* Sources */}
              {provCtrl.sources && (
                <div className="flex flex-col gap-3">
                  {PROVENANCE_SOURCES.map((src, i) => (
                    <div
                      key={src.document}
                      className="trust-slide-in flex items-start gap-3 border-b border-border/40 py-3 last:border-b-0"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon
                          icon={File01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="flex min-w-0 items-baseline gap-2">
                          <span className="truncate text-sm font-medium">
                            {src.document}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {src.type}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {src.section}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress
                            value={src.confidence * 100}
                            className="flex-1"
                          />
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            {(src.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Chain */}
              {provCtrl.chain && (
                <div className="flex flex-col gap-0">
                  {PROVENANCE_CHAIN.map((node, i) => (
                    <div key={node.step}>
                      <div
                        className="trust-slide-in flex items-start gap-3"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                            {i + 1}
                          </div>
                          {i < PROVENANCE_CHAIN.length - 1 && (
                            <div className="my-1 h-6 w-px bg-border/60" />
                          )}
                        </div>
                        <div className="pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                              {node.step}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ·
                            </span>
                            <span className="text-xs font-medium">
                              {node.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {node.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    className="trust-fade-in mt-3 flex items-center gap-2"
                    style={{ animationDelay: "400ms" }}
                  >
                    <HugeiconsIcon
                      icon={LinkSquare01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
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
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Mode
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Shows
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  When to use
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Sources
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Document, section, confidence, type
                </TableCell>
                <TableCell className="py-2.5">
                  Quick verification of data origin
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Chain
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Source → fact → inference → conclusion
                </TableCell>
                <TableCell className="py-2.5">
                  Auditing the full reasoning path
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          In complex review workflows, every claim must be traceable to source
          material. Data provenance mirrors the reviewer's own methodology —
          showing the chain from source document through extracted requirement
          to analytical conclusion. This makes agent outputs auditable by review
          teams.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 9 — Audit Trail                                      */}
      {/* ============================================================ */}
      <section id="audit-trail" className="page-section">
        <p className="section-label mb-3">Accountability</p>
        <h2 className="text-xl font-semibold tracking-tight">Audit Trail</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Immutable log of all agent actions for requirements and review.
          Summary mode shows a compact timeline; detailed mode expands each
          entry with full context and source links.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={auditAnimKey}
          >
            <div className="trust-slide-in">
              {/* Summary */}
              {auditCtrl.summary && (
                <div className="flex flex-col gap-2">
                  {AUDIT_ENTRIES.map((entry, i) => (
                    <div
                      key={entry.time}
                      className="trust-slide-in flex items-center gap-3"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
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
                <div className="flex flex-col gap-4">
                  {AUDIT_ENTRIES.map((entry, i) => (
                    <div
                      key={entry.time}
                      className="trust-slide-in border-l border-border/60 py-2 pl-3"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                            {entry.time}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ·
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {entry.user}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {entry.outcome}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={File01Icon}
                          size={11}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {entry.source}
                        </span>
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
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Mode
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Shows
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Audience
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Summary
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  Timestamp + action description
                </TableCell>
                <TableCell className="py-2.5">
                  Quick scan during review
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Detailed
                </TableCell>
                <TableCell className="py-2.5 pr-4">
                  User, outcome, source links
                </TableCell>
                <TableCell className="py-2.5">
                  Formal audit and requirements review
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Audit trails are a regulatory requirement in compliance and
          release-governance contexts. Every agent action must be logged with
          enough detail for an review team sessioner to reconstruct exactly what
          happened. The summary view keeps daily work manageable while the
          detailed view satisfies formal review needs.
        </div>
      </section>
    </article>
  )
}
