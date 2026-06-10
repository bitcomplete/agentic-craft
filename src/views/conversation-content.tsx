"use client"

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  File01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  ObservableWork,
  type ObservableWorkStatus,
} from "@/components/ui/observable-work"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { SourcePreview } from "@/components/ui/source-preview"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CompactComposerPlayground } from "../components/InteractiveComposer"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

type ProsePreference = "serif" | "sans" | "compact"

type ProsePreferenceDetail = {
  label: string
  className: string
  lineHeight: string
  fontVariationSettings?: string
  spec: string
  description: string
}

const PROSE_PREFERENCE_OPTIONS: { key: ProsePreference; label: string }[] = [
  { key: "serif", label: "Serif Prose" },
  { key: "sans", label: "Sans Prose" },
  { key: "compact", label: "Compact" },
]

const PROSE_PREFERENCE_KEYS = new Set<ProsePreference>([
  "serif",
  "sans",
  "compact",
])

function isProsePreference(key: string): key is ProsePreference {
  return PROSE_PREFERENCE_KEYS.has(key as ProsePreference)
}

const PROSE_PREFERENCE_DETAILS: Record<ProsePreference, ProsePreferenceDetail> =
  {
    serif: {
      label: "Serif Prose",
      className: "font-serif text-base",
      lineHeight: "26px",
      fontVariationSettings: '"opsz" 12',
      spec: "Source Serif 4, 16px/26px",
      description:
        "A comfortable default for long analysis, explanations, and review-style answers.",
    },
    sans: {
      label: "Sans Prose",
      className: "font-sans text-base",
      lineHeight: "24px",
      spec: "Albert Sans, 16px/24px",
      description:
        "Better when the agent output needs to feel native to dense product chrome.",
    },
    compact: {
      label: "Compact",
      className: "font-sans text-sm",
      lineHeight: "22px",
      spec: "Albert Sans, 14px/22px",
      description:
        "Useful for operational tools where users scan many short agent updates.",
    },
  }

const agentProseBaseStyle: React.CSSProperties = {
  letterSpacing: "0px",
  WebkitFontSmoothing: "antialiased",
}

const PROGRESS_STEPS: {
  label: string
  detail: string
  status: ObservableWorkStatus
  source?: string
}[] = [
  {
    label: "Searched project sources",
    detail: "Roadmap, support notes, and launch checklist",
    status: "complete",
    source: "3 sources",
  },
  {
    label: "Compared timeline risk",
    detail: "Support handoff starts after the public release date",
    status: "complete",
    source: "2 files",
  },
  {
    label: "Checking unresolved assumptions",
    detail: "Enterprise onboarding scope is still missing an owner",
    status: "active",
  },
  {
    label: "Draft findings summary",
    detail: "Hidden until source checks finish",
    status: "pending",
  },
]

const COMPOSER_CHECKS = [
  {
    check: "The user can see the active scope",
    reason:
      "Reply targets and generated state use connected islands above the drafting surface, while files stay inside the composer as message payload.",
  },
  {
    check: "The next commitment is explicit",
    reason:
      "The send state, pending tasks, and generated suggestions are visible before the user commits the action.",
  },
  {
    check: "Suggestions remain provisional",
    reason:
      "Fast-start prompts fill the composer only after selection, leaving a clear boundary between proposal and message.",
  },
  {
    check: "Every added object is reversible",
    reason:
      "Context objects, attachments, and reply targets expose a local dismiss path without changing the primary action.",
  },
] as const

const COMPOSER_ANATOMY = [
  {
    part: "Context islands",
    role: "A connected 95%-width stack for plan, reply, and scope above the input surface.",
  },
  {
    part: "Primary input",
    role: "A quiet writing area that grows with the user instead of forcing a modal.",
  },
  {
    part: "Action chrome",
    role: "Menu, context budget, and send state stay low-contrast until needed.",
  },
  {
    part: "Suggestion row",
    role: "Fast-start prompts live outside the input so they never impersonate user text.",
  },
] as const

const COMPOSER_VARIANTS = [
  {
    name: "Display",
    text: "Show selected context without requiring edits.",
  },
  {
    name: "Interactive",
    text: "Let the user dismiss, attach, choose suggestions, and revise.",
  },
  {
    name: "Tool-rendered",
    text: "Render tool output as a structured island before it enters the message.",
  },
  {
    name: "State-rendered",
    text: "Keep scope and plan synced as connected islands, with attachments kept inside the draft payload.",
  },
] as const

const COMPOSER_GUIDANCE = [
  {
    principle: "Separate authored text from proposed context",
    avoid: "Do not let generated suggestions look like user-authored text.",
  },
  {
    principle: "Expose what will be sent before commitment",
    avoid:
      "Do not place generated plans inside the user-authored input surface.",
  },
  {
    principle: "Keep generated affordances reversible",
    avoid: "Do not make dismiss, edit, or send paths compete visually.",
  },
] as const

const CITATION_REFERENCES = [
  {
    id: 1,
    title: "Launch Checklist: Support Readiness",
    source: "docs.internal/launch/support-readiness",
    page: "Page 14",
    icon: File01Icon,
    excerpt:
      "The standard support plan requires the product team to establish issue triage procedures, named owners, and response timelines before enterprise release.",
  },
  {
    id: 2,
    title: "Issue Triage Policy",
    source: "docs.internal/customer-portal/triage-policy.pdf",
    page: "Page 8",
    icon: Shield01Icon,
    excerpt:
      "Critical customer-impacting issues require a 72-hour acknowledgment and a 30-day resolution target. High-priority issues require weekly status updates.",
  },
  {
    id: 3,
    title: "Launch Guidance: Source Scope",
    source: "docs.internal/launch-guidance/source-scope",
    page: "Page 21",
    icon: Globe02Icon,
    excerpt:
      "All source documents that support a launch decision must be linked from the final review summary, including any modules excluded from the initial boundary.",
  },
] as const

type CitationReference = (typeof CITATION_REFERENCES)[number]

function CitationToken({
  citation,
  active,
  onSelect,
  onPreview,
  onClearPreview,
}: {
  citation: CitationReference
  active: boolean
  onSelect: () => void
  onPreview: () => void
  onClearPreview: () => void
}) {
  return (
    <button
      type="button"
      data-compact-touch
      aria-pressed={active}
      aria-label={`${citation.title}, ${citation.page}`}
      onClick={onSelect}
      onMouseEnter={onPreview}
      onMouseLeave={onClearPreview}
      onFocus={onPreview}
      onBlur={onClearPreview}
      className={`mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border px-1.5 py-0.5 font-sans text-xs leading-none transition-[background-color,border-color,color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
        active
          ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <HugeiconsIcon
        icon={citation.icon}
        size={12}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="tabular-nums">{citation.id}</span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConversationContent() {
  /* Observable work state */
  const [workCtrl, setWorkCtrl] = useState<Record<string, boolean>>({
    collapsed: true,
    expanded: false,
    completed: false,
  })
  const [workAnim, setWorkAnim] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const toggleWork = (key: string) => {
    setShowCursor(true)
    setWorkCtrl((prev) => {
      const next: Record<string, boolean> = {}
      for (const k of Object.keys(prev)) next[k] = k === key
      return next
    })
    setWorkAnim((n) => n + 1)
  }
  const workMode = workCtrl.collapsed
    ? "collapsed"
    : workCtrl.expanded
      ? "expanded"
      : "completed"

  /* Streaming cursor auto-hide */
  useEffect(() => {
    const t = setTimeout(() => setShowCursor(false), 3000)
    return () => clearTimeout(t)
  }, [workAnim])

  /* Prose preference state */
  const [prosePreference, setProsePreference] =
    useState<ProsePreference>("serif")
  const prosePreferenceActive = {
    serif: prosePreference === "serif",
    sans: prosePreference === "sans",
    compact: prosePreference === "compact",
  }
  const prosePreferenceDetail = PROSE_PREFERENCE_DETAILS[prosePreference]
  const agentProseStyle: React.CSSProperties = {
    ...agentProseBaseStyle,
    lineHeight: prosePreferenceDetail.lineHeight,
    ...(prosePreferenceDetail.fontVariationSettings
      ? { fontVariationSettings: prosePreferenceDetail.fontVariationSettings }
      : {}),
  }
  const toggleProsePreference = (key: string) => {
    if (isProsePreference(key)) {
      setProsePreference(key)
    }
  }

  /* Citation preview state */
  const [activeCitationId, setActiveCitationId] =
    useState<CitationReference["id"]>(2)
  const [previewCitationId, setPreviewCitationId] = useState<
    CitationReference["id"] | null
  >(null)
  const activeCitation =
    CITATION_REFERENCES.find((citation) => citation.id === activeCitationId) ??
    CITATION_REFERENCES[0]
  const previewCitation = previewCitationId
    ? CITATION_REFERENCES.find((citation) => citation.id === previewCitationId)
    : null
  const selectCitation = (id: CitationReference["id"]) => {
    setActiveCitationId(id)
  }

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Patterns</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Conversation
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Message patterns, prose styling, citations, observable work, and
          composer patterns for agent dialogue.
        </p>
      </header>

      {/* ─── Messages & Prose ─── */}
      <section id="messages" className="page-section">
        <p className="section-label mb-3">Core</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Messages &amp; Prose
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Three message types form the backbone of agent conversation: user,
          agent, and system. Agent messages need a clear ownership surface;
          prose typography can be a reader or workspace preference.
        </p>

        <div className="mt-10 border-y border-border/40 py-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-border/50 pb-4">
            <div className="max-w-[420px]">
              <p className="section-label">Reader preference</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {prosePreferenceDetail.description}
              </p>
            </div>
            <Controls
              options={PROSE_PREFERENCE_OPTIONS}
              active={prosePreferenceActive}
              onToggle={toggleProsePreference}
              showLabel={false}
              className="pb-0"
            />
          </div>
          <div className="flex flex-col gap-4">
            {/* System message */}
            <div className="flex justify-center">
              <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                Agent connected to document repository
              </div>
            </div>

            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Can you review the project brief against the roadmap and launch
                checklist?
              </div>
            </div>

            {/* Agent message */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div
                  className={prosePreferenceDetail.className}
                  style={agentProseStyle}
                >
                  <p>
                    I've reviewed the project brief against the roadmap and
                    launch checklist. The document covers the main launch goals,
                    but I found three areas that need attention.
                  </p>
                  <p className="mt-4">
                    The rollout assumptions in Section 2 reference Launch Policy
                    v2, but the appendix doesn't map all requirements back to a
                    source. The export workflow also references an outdated
                    behavior — this will need updating before the review team
                    session.
                  </p>
                </div>
              </div>
            </div>

            {/* Follow-up user message */}
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Can you list the specific requirements that are missing from the
                mapping?
              </div>
            </div>

            {/* Agent response with list */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div
                  className={prosePreferenceDetail.className}
                  style={agentProseStyle}
                >
                  <p>
                    Two of the brief's 23 requirements are not mapped back to a
                    source in the appendix:
                  </p>
                  <ul className="mt-3 ml-5 flex list-disc flex-col gap-1">
                    <li>
                      Fallback behavior — Degraded handling when a source is
                      unavailable
                    </li>
                    <li>
                      Cleanup behavior — Stale export cleanup after a run
                      completes
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Streaming message (mid-stream with cursor) */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div
                  className={prosePreferenceDetail.className}
                  style={agentProseStyle}
                >
                  <p>
                    The workflow routing rule specifies how escalations move
                    from the agent to the support queue. Based on the workflow
                    policy in Section 7.2, the routing policy covers handoffs
                    between
                    {showCursor && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 bg-foreground/70 align-middle" />
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* System message */}
            <div className="flex justify-center">
              <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                4 findings added to project tracker
              </div>
            </div>
          </div>
        </div>

        {/* Message spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Style
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                User
              </TableCell>
              <TableCell className="py-3 pr-6">
                bg-primary, text-primary-foreground
              </TableCell>
              <TableCell className="py-3">
                max-width 75%, rounded-lg, right-aligned, app body font, 14px
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Agent
              </TableCell>
              <TableCell className="py-3 pr-6">
                border border-border bg-muted
              </TableCell>
              <TableCell className="py-3">
                max-width 75%, rounded-lg, left-aligned, user-configurable prose
                style
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                System
              </TableCell>
              <TableCell className="py-3 pr-6">
                bg-muted, text-muted-foreground
              </TableCell>
              <TableCell className="py-3">
                centered, text-xs, rounded-md
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Prose typography spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Font preference</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                User or workspace setting; current {prosePreferenceDetail.label}
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Active specimen</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                {prosePreferenceDetail.spec}
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Allowed range</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                14-16px text, 22-26px line height
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Letter spacing</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                0px
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Optical size</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                Only when supported by the selected font
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Antialiasing</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                -webkit-font-smoothing: antialiased
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Paragraph spacing</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                16px for long-form answers
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">Prose color</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                var(--foreground)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Prose preference explanation */}
        <div className="hidden">
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                Required ownership signals
              </span>{" "}
              — alignment, sender role, message surface, citations, and tool
              state should identify who produced the content.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Configurable prose style
              </span>{" "}
              — let users or workspace admins choose serif, sans, or compact
              rendering when reading volume varies by product.
            </li>
            <li>
              Do not rely on font family as the only authorship signal:
              accessibility settings, localization, and brand systems can change
              typography.
            </li>
          </ul>
        </div>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          <p>
            User messages are right-aligned to create visual separation of "who
            said what". Agent messages use a distinct surface and optional prose
            preference instead of depending on a fixed font. System messages are
            unobtrusive — they provide context without demanding attention.
            Max-width 75% prevents messages from spanning the full content
            width, improving readability. The streaming cursor stays static and
            auto-hides after a few seconds.
          </p>
        </div>
      </section>

      {/* ─── Progress Steps ─── */}
      <section id="progress-steps" className="page-section">
        <p className="section-label mb-3">Observable work</p>
        <h2 className="text-xl font-semibold tracking-tight">Progress Steps</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Progress steps show what the agent is doing, which sources are being
          touched, and what has completed. They disclose observable work instead
          of exposing hidden reasoning.
        </p>

        <div className="mt-10">
          <Controls
            options={["collapsed", "expanded", "completed"]}
            active={workCtrl}
            onToggle={toggleWork}
          />
        </div>

        <div key={workAnim} className="mt-4 border-y border-border/40 py-4">
          {workMode === "collapsed" && (
            <div className="conv-slide-in grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-1 py-2">
              <div className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  Checking launch sources
                </span>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  Launch checklist, issue triage policy, source scope · 2 done ·
                  1 waiting
                </p>
              </div>
              <StatusIndicator status="active" className="mt-0.5" />
            </div>
          )}

          {workMode === "expanded" && (
            <div className="conv-slide-in">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
                  Checking launch sources
                  <StatusIndicator status="active" />
                </span>
                <span className="text-xs text-muted-foreground">
                  Sources visible
                </span>
              </div>
              <ObservableWork.Root>
                {PROGRESS_STEPS.map((step, index) => (
                  <ObservableWork.Step
                    key={step.label}
                    status={step.status}
                    title={step.label}
                    description={step.detail}
                    source={step.source}
                    meta={`Step ${index + 1} of ${PROGRESS_STEPS.length}`}
                    defaultOpen={step.status === "active"}
                  >
                    <ObservableWork.Detail>
                      The user can inspect the source touched by this operation
                      without seeing private reasoning or speculative internal
                      narration.
                    </ObservableWork.Detail>
                  </ObservableWork.Step>
                ))}
              </ObservableWork.Root>
            </div>
          )}

          {workMode === "completed" && (
            <div className="conv-slide-in">
              <div className="px-1 py-2">
                <span className="text-xs text-muted-foreground/60">
                  Completed 4 source checks in 4.2s
                </span>
              </div>
              <div className="conv-fade-in mt-4 rounded-lg bg-muted px-4 py-3">
                <div
                  className={prosePreferenceDetail.className}
                  style={agentProseStyle}
                >
                  <p>
                    The launch review has three surfaced findings: the support
                    handoff starts after release, enterprise onboarding still
                    lacks an owner, and the summary needs source links for every
                    requirement. The agent can now draft the findings summary.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Do / Don't table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Do
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Don't
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">
                Show observable operations, sources, and status
              </TableCell>
              <TableCell className="py-3">
                Reveal private reasoning traces or speculative narration
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">
                Collapse completed work into a useful summary
              </TableCell>
              <TableCell className="py-3">
                Leave stale spinners running after work has completed
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">
                Keep pending steps visible but lower emphasis
              </TableCell>
              <TableCell className="py-3">
                Make future work look complete or guaranteed
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6">
                Allow the user to collapse at any time
              </TableCell>
              <TableCell className="py-3">
                Force detailed traces to remain expanded after completion
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          <p>
            Progress steps can shimmer while active, but the content must remain
            auditable: source names, step labels, timestamps, and status. The
            expanded view should answer "what is happening?" without exposing
            private reasoning or speculative internal narration.
          </p>
        </div>
      </section>

      {/* ─── Citations ─── */}
      <section id="citations" className="page-section">
        <p className="section-label mb-3">Sourcing</p>
        <h2 className="text-xl font-semibold tracking-tight">Citations</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Citations ground agent responses in verifiable sources. The best
          version keeps the prose readable while making the selected source
          immediately inspectable.
        </p>

        <div className="mt-7 border-y border-border/50 py-3">
          <div className="relative mx-auto max-w-[720px]">
            {previewCitation && (
              <div className="pointer-events-none absolute top-2 right-2 z-20 w-[min(360px,calc(100%-16px))] animate-in duration-150 fade-in-0 zoom-in-95 motion-reduce:animate-none sm:w-[360px]">
                <SourcePreview
                  title={previewCitation.title}
                  excerpt={previewCitation.excerpt}
                  location={previewCitation.page}
                  source={previewCitation.source}
                  icon={previewCitation.icon}
                />
              </div>
            )}

            <div className="bg-muted/20 px-3 py-4 sm:px-4 sm:py-5">
              <div
                className={prosePreferenceDetail.className}
                style={agentProseStyle}
              >
                <p>
                  The launch readiness plan has been set to enterprise release,
                  which requires independent risk analysis by the review team
                  <CitationToken
                    citation={CITATION_REFERENCES[0]}
                    active={activeCitation.id === CITATION_REFERENCES[0].id}
                    onSelect={() => selectCitation(CITATION_REFERENCES[0].id)}
                    onPreview={() =>
                      setPreviewCitationId(CITATION_REFERENCES[0].id)
                    }
                    onClearPreview={() => setPreviewCitationId(null)}
                  />
                  and a standard support plan with documented issue triage
                  timelines
                  <CitationToken
                    citation={CITATION_REFERENCES[1]}
                    active={activeCitation.id === CITATION_REFERENCES[1].id}
                    onSelect={() => selectCitation(CITATION_REFERENCES[1].id)}
                    onPreview={() =>
                      setPreviewCitationId(CITATION_REFERENCES[1].id)
                    }
                    onClearPreview={() => setPreviewCitationId(null)}
                  />
                  . The internal launch guidance also requires every
                  decision-supporting source to be linked from the final review
                  summary, including modules that were excluded from the initial
                  boundary
                  <CitationToken
                    citation={CITATION_REFERENCES[2]}
                    active={activeCitation.id === CITATION_REFERENCES[2].id}
                    onSelect={() => selectCitation(CITATION_REFERENCES[2].id)}
                    onPreview={() =>
                      setPreviewCitationId(CITATION_REFERENCES[2].id)
                    }
                    onClearPreview={() => setPreviewCitationId(null)}
                  />
                  .
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {CITATION_REFERENCES.map((citation) => (
                  <button
                    key={citation.id}
                    type="button"
                    data-compact-touch
                    aria-label={`Inspect source ${citation.id}: ${citation.title}`}
                    aria-pressed={activeCitation.id === citation.id}
                    onClick={() => selectCitation(citation.id)}
                    onMouseEnter={() => setPreviewCitationId(citation.id)}
                    onMouseLeave={() => setPreviewCitationId(null)}
                    onFocus={() => setPreviewCitationId(citation.id)}
                    onBlur={() => setPreviewCitationId(null)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-[background-color,border-color,color] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                      activeCitation.id === citation.id
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={citation.icon}
                      size={12}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {citation.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

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
                "Inline token",
                "Small numbered source control inside prose; selected state is visible but not disruptive.",
              ],
              [
                "Preview card",
                "Source title, quote excerpt, page chip, and source affordance shown only on hover or keyboard focus.",
              ],
              [
                "Placement",
                "Overlaid near the cited prose without reserving permanent vertical space.",
              ],
              [
                "Source strip",
                "Readable fallback list for scanning, keyboard selection, and long source names.",
              ],
            ].map(([element, spec], index, rows) => (
              <TableRow
                key={element}
                className={
                  index < rows.length - 1 ? "border-b border-border/50" : ""
                }
              >
                <TableCell className="py-3 pr-6 font-medium">
                  {element}
                </TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {spec}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          <p>
            The citation preview should answer "why should I trust this
            sentence?" without forcing the user away from the current answer.
            Keep the quote short, show the exact source location, and make the
            full document one click away.
          </p>
        </div>
      </section>

      {/* ─── Composer ─── */}
      <section id="composer" className="page-section">
        <div className="max-w-[660px]">
          <p className="section-label mb-3">Input pattern</p>
          <h2 className="text-xl font-semibold tracking-tight">Composer</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A composer is not just a chat box. It is where the user reviews
            context, edits intent, and commits the next agent action.
          </p>
        </div>

        <div className="mt-5 bg-background/70 sm:mt-10">
          <div className="mb-2 border-b border-border/50 pb-1.5 sm:mb-4 sm:pb-3">
            <div>
              <p className="section-label">Live specimen</p>
              <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">
                A clean drafting surface with context and generated plan state
                kept outside authored text.
              </p>
            </div>
          </div>
          <CompactComposerPlayground />
        </div>

        <div className="hidden">
          <div className="grid gap-2 border-b border-border/50 py-3 text-xs md:grid-cols-[180px_minmax(0,1fr)]">
            <p className="section-label">Inspect for</p>
            <p className="text-muted-foreground">
              The checks that make a composer trustworthy before anything is
              sent.
            </p>
          </div>
          <div className="divide-y divide-border/50">
            {COMPOSER_CHECKS.map((item) => (
              <div
                key={item.check}
                className="grid gap-2 py-3 text-sm md:grid-cols-[260px_minmax(0,1fr)]"
              >
                <p className="font-medium text-foreground">{item.check}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden">
          <div>
            <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
              <p className="section-label">Anatomy</p>
              <span className="text-xs text-muted-foreground">4 regions</span>
            </div>
            <div className="divide-y divide-border/50">
              {COMPOSER_ANATOMY.map((item) => (
                <div
                  key={item.part}
                  className="grid gap-2 py-3 text-sm sm:grid-cols-[170px_minmax(0,1fr)]"
                >
                  <p className="font-medium text-foreground">{item.part}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <p className="section-label border-b border-border pb-3">Depth</p>
            <div className="divide-y divide-border/50">
              {COMPOSER_VARIANTS.map((variant) => (
                <div key={variant.name} className="py-3">
                  <p className="text-sm font-medium text-foreground">
                    {variant.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {variant.text}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="hidden">
          <div className="grid border-b border-border pb-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="section-label">Rule</p>
            <p className="section-label hidden md:block">Failure to avoid</p>
          </div>
          <div className="divide-y divide-border/50">
            {COMPOSER_GUIDANCE.map((item) => (
              <div
                key={item.principle}
                className="grid gap-2 py-3 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                <p className="text-foreground">{item.principle}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.avoid}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Composer spec table */}
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
          <TableBody className="text-sm text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Container
              </TableCell>
              <TableCell className="py-3">
                max-w-[720px], rounded-xl on mobile, rounded-2xl on desktop,
                border border-border
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Textarea
              </TableCell>
              <TableCell className="py-3">
                Auto-expanding, min 36px, max 160px, 14px Albert Sans
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Send button
              </TableCell>
              <TableCell className="py-3">
                32×32px hit area, 24px inner icon button, foreground when
                active, muted when empty, spring press animation
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Focus state
              </TableCell>
              <TableCell className="py-3">
                Border transitions to foreground/20, subtle outer shadow
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Scope island
              </TableCell>
              <TableCell className="py-3">
                Compact dismissible chips in the connected island stack.
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Reply island
              </TableCell>
              <TableCell className="py-3">
                Reply icon plus truncated quote with a local dismiss action.
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Plan island
              </TableCell>
              <TableCell className="py-3">
                Rendered in the connected 95%-width stack above the composer,
                not inside the authored text area.
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                State controls
              </TableCell>
              <TableCell className="py-3">
                Multi-select toggle group, active = subtle foreground tint,
                drives visible reference states without resizing the input
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Suggestions
              </TableCell>
              <TableCell className="py-3">
                Click to fill textarea, flash animation on click, flex-wrap
                below
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Attachments
              </TableCell>
              <TableCell className="py-3">
                File preview chips with name/size, dismiss per-file, enables
                send; rendered inside the composer card because files belong to
                the message being drafted.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          <p>
            Scope and reply-to are mutually exclusive — enabling one dismisses
            the other. Plan/progress, scope, and reply stay in a connected
            island stack above the composer; attachments stay inside the
            composer because they are part of the message payload. The send
            button uses a spring-based press animation (cubic-bezier 0.34, 1.56,
            0.64, 1) with an arrow flyout on send. Suggestion chips fill the
            textarea on click with a brief color flash to confirm the action.
          </p>
        </div>
      </section>
    </article>
  )
}
