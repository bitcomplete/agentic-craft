"use client"

import { useState, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  File01Icon,
  Globe02Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { ObservableWork } from "@/components/ui/observable-work"
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
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "conversation-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes conv-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes conv-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes conv-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .conv-shimmer-text {
      background: linear-gradient(
        90deg,
        var(--color-muted-foreground) 0%,
        var(--color-muted-foreground) 35%,
        oklch(0.75 0.02 260) 50%,
        var(--color-muted-foreground) 65%,
        var(--color-muted-foreground) 100%
      );
      background-size: 200% 100%;
      animation: conv-shimmer 2.5s ease-in-out 2;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .conv-slide-in {
      animation: conv-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .conv-fade-in {
      animation: conv-fade-in 0.2s ease forwards;
    }
    @media (prefers-reduced-motion: reduce) {
      .conv-shimmer-text,
      .conv-slide-in,
      .conv-fade-in {
        animation: none;
      }
      .conv-shimmer-text {
        background: none;
        -webkit-text-fill-color: currentColor;
      }
    }
  `
  document.head.appendChild(style)
}

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
  { key: "serif", label: "Serif prose" },
  { key: "sans", label: "Sans prose" },
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
      label: "Serif prose",
      className: "font-serif text-base",
      lineHeight: "26px",
      fontVariationSettings: '"opsz" 12',
      spec: "Source Serif 4, 16px/26px",
      description:
        "A comfortable default for long analysis, explanations, and review-style answers.",
    },
    sans: {
      label: "Sans prose",
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

const PROGRESS_STEPS = [
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
    source: "live",
  },
  {
    label: "Draft findings summary",
    detail: "Hidden until source checks finish",
    status: "pending",
    source: "pending",
  },
] as const

const COMPOSER_UPGRADE_CHECKLIST = [
  {
    item: "Controlled value",
    spec: "Expose value and onValueChange so the app owns draft state.",
  },
  {
    item: "File lifecycle",
    spec: "Track accepted files, dedupe repeated drops, remove per file, and surface limits.",
  },
  {
    item: "Drag/drop state",
    spec: "Swap placeholder and border state while files are over the composer.",
  },
  {
    item: "Slot API",
    spec: "Keep left and right action zones composable without hard-coding every tool.",
  },
  {
    item: "Send gating",
    spec: "Enable send only when text or attachments exist; Enter sends, Shift+Enter inserts a line.",
  },
  {
    item: "Click-to-focus",
    spec: "Clicking empty composer space focuses the textarea without stealing button clicks.",
  },
] as const

const COMPOSER_CHECKS = [
  {
    check: "The user can see the active scope",
    reason:
      "Files, reply targets, and plan state sit outside the drafted text so they cannot be mistaken for authored input.",
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
      "Context islands, attachments, and reply targets expose a local dismiss path without changing the primary action.",
  },
] as const

const COMPOSER_ANATOMY = [
  {
    part: "Context islands",
    role: "Stacked, dismissible surfaces for reply, plan, scope, and attachments.",
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
    text: "Keep plan, scope, and attachments synced to agent state.",
  },
] as const

const COMPOSER_GUIDANCE = [
  {
    principle: "Separate authored text from proposed context",
    avoid: "Do not let generated suggestions look like user-authored text.",
  },
  {
    principle: "Expose what will be sent before commitment",
    avoid: "Do not hide plan, attachment, or scope state behind menus.",
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
    source: "docs.example.com/launch/support-readiness",
    page: "Page 14",
    icon: File01Icon,
    excerpt:
      "The dedicated support plan requires the product team to establish issue triage procedures, named owners, and response timelines before enterprise release.",
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
    source: "docs.example.com/launch-guidance/source-scope",
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
}: {
  citation: CitationReference
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border px-1.5 py-0.5 font-sans text-xs leading-none transition-[background-color,border-color,color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
        active
          ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <HugeiconsIcon
        icon={citation.icon}
        size={12}
        strokeWidth={1.7}
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
  useEffect(() => {
    ensureStyles()
  }, [])

  /* Thinking block state */
  const [thinkCtrl, setThinkCtrl] = useState<Record<string, boolean>>({
    collapsed: true,
    expanded: false,
    completed: false,
  })
  const [thinkAnim, setThinkAnim] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const toggleThink = (key: string) => {
    setShowCursor(true)
    setThinkCtrl((prev) => {
      const next: Record<string, boolean> = {}
      for (const k of Object.keys(prev)) next[k] = k === key
      return next
    })
    setThinkAnim((n) => n + 1)
  }
  const thinkMode = thinkCtrl.collapsed
    ? "collapsed"
    : thinkCtrl.expanded
      ? "expanded"
      : "completed"

  /* Streaming cursor auto-hide */
  useEffect(() => {
    const t = setTimeout(() => setShowCursor(false), 3000)
    return () => clearTimeout(t)
  }, [thinkAnim])

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
  const citationPreviewRef = useRef<HTMLDivElement>(null)
  const [activeCitationId, setActiveCitationId] =
    useState<CitationReference["id"]>(2)
  const activeCitation =
    CITATION_REFERENCES.find((citation) => citation.id === activeCitationId) ??
    CITATION_REFERENCES[0]
  const activeCitationIndex = CITATION_REFERENCES.findIndex(
    (citation) => citation.id === activeCitation.id
  )
  const revealCitationPreview = () => {
    if (typeof window === "undefined" || window.innerWidth >= 640) {
      return
    }

    window.requestAnimationFrame(() => {
      citationPreviewRef.current?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      })
    })
  }
  const selectCitation = (id: CitationReference["id"]) => {
    setActiveCitationId(id)
    revealCitationPreview()
  }
  const goToCitation = (direction: "previous" | "next") => {
    const offset = direction === "previous" ? -1 : 1
    const nextIndex =
      (activeCitationIndex + offset + CITATION_REFERENCES.length) %
      CITATION_REFERENCES.length
    selectCitation(CITATION_REFERENCES[nextIndex].id)
  }

  /* Feedback state */
  const [feedback, setFeedback] = useState<"none" | "up" | "down">("none")

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

        <div className="mt-10 rounded-lg border border-border/40 p-6">
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
          <div className="space-y-4">
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
                    The following requirements from Launch Policy v2 are not
                    mapped in the appendix:
                  </p>
                  <ul className="mt-3 ml-5 list-disc space-y-1">
                    <li>Retention setting — Account data retention</li>
                    <li>Cleanup rule — Stale export cleanup</li>
                    <li>Access workflow — Role-based access behavior</li>
                    <li>
                      Default role setup — Initial permissions for new teams
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
              <TableCell className="py-3 pr-6">Light-mode color</TableCell>
              <TableCell className="py-3 font-medium text-foreground">
                oklch(0.2642 0.013 93.9)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Prose preference explanation */}
        <div className="mt-10">
          <ul className="space-y-2 text-sm text-muted-foreground">
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
            active={thinkCtrl}
            onToggle={toggleThink}
          />
        </div>

        <div key={thinkAnim} className="rounded-lg border border-border/40 p-6">
          {thinkMode === "collapsed" && (
            <div className="conv-slide-in flex items-center justify-between gap-4 px-1 py-2">
              <div>
                <span className="conv-shimmer-text text-sm">
                  Checking launch sources
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  2 complete, 1 active, 1 waiting
                </p>
              </div>
              <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                4 steps
              </span>
            </div>
          )}

          {thinkMode === "expanded" && (
            <div className="conv-slide-in">
              <div className="mb-4 flex items-center justify-between gap-4 px-1">
                <span className="conv-shimmer-text text-sm">
                  Checking launch sources
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

          {thinkMode === "completed" && (
            <div className="conv-slide-in">
              <div className="px-1 py-2">
                <span className="text-xs text-muted-foreground/60">
                  Completed 4 source checks in 4.2s
                </span>
              </div>
              <div className="conv-fade-in mt-4 rounded-lg border border-border bg-muted px-4 py-3">
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

        {/* Thinking block feedback row */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Was this helpful?
          </span>
          <button
            type="button"
            onClick={() => setFeedback(feedback === "up" ? "none" : "up")}
            aria-label="Mark progress steps as helpful"
            aria-pressed={feedback === "up"}
            className={`rounded-md p-1 transition-colors ${
              feedback === "up"
                ? "bg-foreground/[0.06] text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HugeiconsIcon icon={ThumbsUpIcon} size={14} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setFeedback(feedback === "down" ? "none" : "down")}
            aria-label="Mark progress steps as not helpful"
            aria-pressed={feedback === "down"}
            className={`rounded-md p-1 transition-colors ${
              feedback === "down"
                ? "bg-foreground/[0.06] text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HugeiconsIcon icon={ThumbsDownIcon} size={14} strokeWidth={1.5} />
          </button>
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

        <div className="mt-10 rounded-lg border border-border/40 bg-background p-3 sm:p-6">
          <div className="relative mx-auto max-w-[760px]">
            <div
              ref={citationPreviewRef}
              className="sticky top-3 z-20 sm:absolute sm:top-auto sm:right-0 sm:left-auto sm:z-10 sm:w-[520px]"
            >
              <SourcePreview
                title={activeCitation.title}
                excerpt={activeCitation.excerpt}
                location={activeCitation.page}
                source={activeCitation.source}
                icon={activeCitation.icon}
                index={activeCitationIndex}
                total={CITATION_REFERENCES.length}
                onPrevious={() => goToCitation("previous")}
                onNext={() => goToCitation("next")}
              />
            </div>

            <div className="pt-5 sm:pt-[300px]">
              <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-5 sm:px-6 sm:py-7">
                <div
                  className={prosePreferenceDetail.className}
                  style={agentProseStyle}
                >
                  <p>
                    The launch readiness plan has been set to enterprise
                    release, which requires independent risk analysis by the
                    review team
                    <CitationToken
                      citation={CITATION_REFERENCES[0]}
                      active={activeCitation.id === CITATION_REFERENCES[0].id}
                      onSelect={() => selectCitation(CITATION_REFERENCES[0].id)}
                    />
                    and a dedicated support plan with documented issue triage
                    timelines
                    <CitationToken
                      citation={CITATION_REFERENCES[1]}
                      active={activeCitation.id === CITATION_REFERENCES[1].id}
                      onSelect={() => selectCitation(CITATION_REFERENCES[1].id)}
                    />
                    . The internal launch guidance also requires every
                    decision-supporting source to be linked from the final
                    review summary, including modules that were excluded from
                    the initial boundary
                    <CitationToken
                      citation={CITATION_REFERENCES[2]}
                      active={activeCitation.id === CITATION_REFERENCES[2].id}
                      onSelect={() => selectCitation(CITATION_REFERENCES[2].id)}
                    />
                    .
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {CITATION_REFERENCES.map((citation) => (
                    <button
                      key={citation.id}
                      type="button"
                      aria-pressed={activeCitation.id === citation.id}
                      onClick={() => selectCitation(citation.id)}
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
                "Source title, quote excerpt, page chip, previous/next controls, and view-source action.",
              ],
              [
                "Placement",
                "Anchored close to the cited sentence on desktop; stacked above prose on mobile.",
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

        <div className="mt-5 rounded-lg border border-border/60 bg-background/70 p-1.5 sm:mt-10 sm:p-4">
          <div className="mb-2 border-b border-border/50 pb-1.5 sm:mb-4 sm:pb-3">
            <div>
              <p className="section-label">Live specimen</p>
              <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">
                Plan, context, reply target, suggestions, and attachments in one
                compact surface.
              </p>
            </div>
          </div>
          <CompactComposerPlayground />
        </div>

        <div className="mt-10 border-y border-border/50">
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

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
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

        <div className="mt-10">
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

        <div className="mt-10 border-y border-border/50">
          <div className="grid gap-2 border-b border-border/50 py-3 text-xs md:grid-cols-[190px_minmax(0,1fr)]">
            <p className="section-label">Upgrade checklist</p>
            <p className="text-muted-foreground">
              Implementation contracts that keep the composer predictable when
              it grows beyond a basic textarea.
            </p>
          </div>
          <div className="divide-y divide-border/50">
            {COMPOSER_UPGRADE_CHECKLIST.map((check) => (
              <div
                key={check.item}
                className="grid gap-2 py-3 text-sm md:grid-cols-[210px_minmax(0,1fr)]"
              >
                <p className="font-medium text-foreground">{check.item}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {check.spec}
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
                max-w-[720px], rounded-lg, border border-border
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
                32×32px, bg-primary when active, bg-muted when empty, spring
                press animation
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
                max-w-[690px], bg-muted/50, slides in/out, dismissible × button
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                Reply island
              </TableCell>
              <TableCell className="py-3">
                ↩ icon + truncated quote, no label or border-quote, 12px
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-3 pr-6 font-medium text-foreground">
                State controls
              </TableCell>
              <TableCell className="py-3">
                Multi-select toggle group, active = subtle foreground tint,
                drives visible context islands
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
                send
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          <p>
            Scope and reply-to are mutually exclusive — enabling one dismisses
            the other. Plan, scope, reply, attachments, and suggestions stay
            visible as separate objects until the user chooses what to send. The
            send button uses a spring-based press animation (cubic-bezier 0.34,
            1.56, 0.64, 1) with an arrow flyout on send. Every island and chip
            set slides in with a 250ms ease-out. Suggestion chips fill the
            textarea on click with a brief color flash to confirm the action.
          </p>
        </div>
      </section>
    </article>
  )
}
