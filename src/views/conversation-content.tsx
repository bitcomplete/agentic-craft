'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  File01Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "@hugeicons/core-free-icons"
import InteractiveComposer from "../components/InteractiveComposer"

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
      animation: conv-shimmer 2.5s ease-in-out infinite;
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
  options: string[]
  active: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isActive = active[opt]
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs transition-colors ${
              isActive
                ? "bg-foreground/[0.04] text-foreground"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            )}
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function makeToggle(
  setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  animSetter: React.Dispatch<React.SetStateAction<number>>,
) {
  return (key: string) => {
    setter((prev) => {
      const next: Record<string, boolean> = {}
      for (const k of Object.keys(prev)) next[k] = k === key
      return next
    })
    animSetter((n) => n + 1)
  }
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const agentProseStyle: React.CSSProperties = {
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
  WebkitFontSmoothing: "antialiased",
}

const THINKING_TEXT = `Let me analyze the release notes and rollout state systematically. The spike in failed checkouts may be a metrics issue rather than a product issue — the dashboard is mixing preview and production traffic. I need to check whether the event filter is scoped correctly... it looks like preview traffic is still included. So this may not be a blocker after all. But wait — the launch checklist explicitly says production metrics must be isolated before rollout decisions. Let me verify that setup...`

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConversationContent() {
  useEffect(() => { ensureStyles() }, [])

  /* Thinking block state */
  const [thinkCtrl, setThinkCtrl] = useState<Record<string, boolean>>({
    collapsed: true,
    expanded: false,
    completed: false,
  })
  const [thinkAnim, setThinkAnim] = useState(0)
  const toggleThink = makeToggle(setThinkCtrl, setThinkAnim)
  const thinkMode = thinkCtrl.collapsed
    ? "collapsed"
    : thinkCtrl.expanded
      ? "expanded"
      : "completed"

  /* Streaming cursor auto-hide */
  const [showCursor, setShowCursor] = useState(true)
  useEffect(() => {
    setShowCursor(true)
    const t = setTimeout(() => setShowCursor(false), 3000)
    return () => clearTimeout(t)
  }, [thinkAnim])

  /* Feedback state */
  const [feedback, setFeedback] = useState<"none" | "up" | "down">("none")

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Conversation
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Message patterns, prose styling, citations, thinking blocks, and
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
          agent, and system. Agent messages use serif typography to signal
          AI-authored prose.
        </p>

        <div className="mt-10 border border-border/40 rounded-lg p-6">
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
                Can you review the launch brief and tell me if this release is
                ready to ship?
              </div>
            </div>

            {/* Agent message */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div className="font-serif text-base" style={agentProseStyle}>
                  <p>
                    I've reviewed the launch brief, PR, and linked rollout
                    artifacts. The release looks healthy overall, but I found
                    three areas that need attention.
                  </p>
                  <p className="mt-4">
                    The rollout notes still reference the previous experiment
                    owner, the mobile summary layout in the PR does not match the
                    latest Figma handoff, and the analytics checklist still has
                    one unverified launch event. Those should be resolved before
                    wider rollout.
                  </p>
                </div>
              </div>
            </div>

            {/* Follow-up user message */}
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Can you list the specific launch checks that are still open?
              </div>
            </div>

            {/* Agent response with list */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div className="font-serif text-base" style={agentProseStyle}>
                  <p>
                    The following launch checks are still open:
                  </p>
                  <ul className="mt-3 ml-5 list-disc space-y-1">
                    <li>Rollback owner is not assigned in the launch brief</li>
                    <li>Mobile summary layout still uses the older pattern</li>
                    <li>checkout_completed analytics event is not verified</li>
                    <li>Release handoff note still contains stale screenshots</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Streaming message (mid-stream with cursor) */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div className="font-serif text-base" style={agentProseStyle}>
                  <p>
                    The current rollout path covers internal users and a 10%
                    production slice. Based on the launch plan, the next step is
                    to verify analytics, confirm rollback ownership, and then
                    decide whether to expand the audience to
                    {showCursor && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle" />
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* System message */}
            <div className="flex justify-center">
              <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                4 release-review follow-ups added to the tracker
              </div>
            </div>
          </div>
        </div>

        {/* Message spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Type
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Style
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">User</td>
              <td className="py-3 pr-6">bg-primary, text-primary-foreground</td>
              <td className="py-3">
                max-width 75%, rounded-lg, right-aligned, font-sans 14px
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Agent</td>
              <td className="py-3 pr-6">border border-border bg-muted</td>
              <td className="py-3">
                max-width 75%, rounded-lg, left-aligned, font-serif 16px (agent
                prose styling)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">System</td>
              <td className="py-3 pr-6">bg-muted, text-muted-foreground</td>
              <td className="py-3">centered, text-xs, rounded-md</td>
            </tr>
          </tbody>
        </table>

        {/* Prose typography spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Property
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Font family</td>
              <td className="py-3 font-medium text-foreground">
                Source Serif 4
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Font size</td>
              <td className="py-3 font-medium text-foreground">16px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Line height</td>
              <td className="py-3 font-medium text-foreground">26px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Letter spacing</td>
              <td className="py-3 font-medium text-foreground">-0.4px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Optical size</td>
              <td className="py-3 font-medium text-foreground">opsz 12</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Antialiasing</td>
              <td className="py-3 font-medium text-foreground">
                -webkit-font-smoothing: antialiased
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Paragraph spacing</td>
              <td className="py-3 font-medium text-foreground">
                margin-top 16px (p + p)
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Light-mode color</td>
              <td className="py-3 font-medium text-foreground">
                oklch(0.2642 0.013 93.9)
              </td>
            </tr>
          </tbody>
        </table>

        {/* Dual-font explanation */}
        <div className="mt-10">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                Serif (Source Serif 4)
              </span>{" "}
              — agent-authored prose, analysis, explanations, long-form answers.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Sans (Albert Sans)
              </span>{" "}
              — UI labels, tool call titles, system messages, metadata, user
              input.
            </li>
            <li>
              The font switch signals authorship: serif = agent‑generated
              content, sans = interface chrome.
            </li>
          </ul>
        </div>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>
            User messages are right-aligned to create visual separation of "who
            said what". Agent messages use serif typography to signal AI-authored
            prose. System messages are unobtrusive — they provide context without
            demanding attention. Max-width 75% prevents messages from spanning
            the full content width, improving readability. The streaming cursor
            uses animate-pulse — subtle, not distracting. It auto-hides after a
            few seconds.
          </p>
        </div>
      </section>

      {/* ─── Thinking Blocks ─── */}
      <section id="thinking" className="page-section">
        <p className="section-label mb-3">Reasoning</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Thinking Blocks
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Thinking blocks surface agent reasoning. Collapsed by default, they
          expand to show chain-of-thought content and collapse to a duration
          summary when complete.
        </p>

        <div className="mt-10">
          <Controls
            options={["collapsed", "expanded", "completed"]}
            active={thinkCtrl}
            onToggle={toggleThink}
          />
        </div>

        <div
          key={thinkAnim}
          className="border border-border/40 rounded-lg p-6"
        >
          {/* Collapsed state */}
          {thinkMode === "collapsed" && (
            <div className="px-1 py-2 conv-slide-in">
              <span className="conv-shimmer-text text-sm">Thinking</span>
            </div>
          )}

          {/* Expanded state */}
          {thinkMode === "expanded" && (
            <div className="px-1 py-2 conv-slide-in">
              <span className="conv-shimmer-text text-sm mb-2 inline-block">Thinking</span>
              <p className="text-xs text-muted-foreground italic leading-relaxed conv-fade-in">
                {THINKING_TEXT}
              </p>
            </div>
          )}

          {/* Completed state */}
          {thinkMode === "completed" && (
            <div className="conv-slide-in">
              <div className="px-1 py-2">
                <span className="text-xs text-muted-foreground/60">Thought for 4.2s</span>
              </div>
              <div className="mt-4 rounded-lg border border-border bg-muted px-4 py-3 conv-fade-in">
                <div className="font-serif text-base" style={agentProseStyle}>
                  <p>
                    Two launch checks are still open: rollback ownership and
                    analytics verification. The rollout owner gap is genuine,
                    while the analytics issue appears to be a setup drift between
                    the launch brief and the dashboard configuration.
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
            onClick={() => setFeedback(feedback === "up" ? "none" : "up")}
            className={`rounded-md p-1 transition-colors ${
              feedback === "up"
                ? "bg-foreground/[0.06] text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HugeiconsIcon icon={ThumbsUpIcon} size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setFeedback(feedback === "down" ? "none" : "down")}
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
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Do
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Don't
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">
                Show genuine uncertainty and course corrections
              </td>
              <td className="py-3">Polish thinking content into formal prose</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">
                Use exploratory, working-through-it language
              </td>
              <td className="py-3">
                Over-anthropomorphize ("I feel uncertain...")
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">
                Reference specific evidence being examined
              </td>
              <td className="py-3">
                Include thinking that contradicts the final answer
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">
                Allow the user to collapse at any time
              </td>
              <td className="py-3">
                Force thinking to remain expanded after completion
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>
            Thinking blocks use a text-only shimmer sweep on the word "Thinking"
            to signal active reasoning without being distracting. No borders,
            icons, or dots — just the shimmering text. After completion, the block
            collapses to a duration summary — the user can always expand to review
            reasoning. Expanded thinking content is italic to distinguish it from
            the agent's final response.
          </p>
        </div>
      </section>

      {/* ─── Citations ─── */}
      <section id="citations" className="page-section">
        <p className="section-label mb-3">Sourcing</p>
        <h2 className="text-xl font-semibold tracking-tight">Citations</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Citations ground agent responses in verifiable sources. Two patterns:
          inline superscripts and chip labels.
        </p>

        {/* Inline citations */}
        <div className="mt-14">
          <p className="section-label mb-3">Inline citations</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="font-serif text-base" style={agentProseStyle}>
              <p>
                The release is currently staged for a gradual rollout, which
                requires the launch owner to confirm rollback readiness
                <sup className="ml-0.5 cursor-pointer text-xs font-sans font-medium text-primary hover:underline">
                  [1]
                </sup>
                . The launch checklist also requires analytics verification and a
                documented support handoff before traffic expands
                <sup className="ml-0.5 cursor-pointer text-xs font-sans font-medium text-primary hover:underline">
                  [2]
                </sup>
                . Notably, the release notes and the PR must reference the same
                affected surfaces — the current omission of the mobile summary
                issue from the handoff note may not survive launch review
                <sup className="ml-0.5 cursor-pointer text-xs font-sans font-medium text-primary hover:underline">
                  [3]
                </sup>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Citation chips */}
        <div className="mt-14">
          <p className="section-label mb-3">Citation chips</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Shield01Icon, label: "Launch brief — rollout section" },
                {
                  icon: File01Icon,
                  label: "QA report — smoke results",
                },
                { icon: File01Icon, label: "Figma handoff — mobile summary" },
              ].map((chip) => (
                <button
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={chip.icon}
                    size={12}
                    strokeWidth={1.5}
                  />
                  {chip.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Chips are an alternative to superscripts when the citation target
              has a human-readable label. Useful for referencing specific
              document sections.
            </p>
          </div>
        </div>

        {/* Reference panel */}
        <div className="mt-14">
          <p className="section-label mb-3">Reference panel</p>

          <div className="mt-10 space-y-2">
            {[
              {
                num: 1,
                title:
                  "Checkout launch brief — rollout and rollback rules",
                source: "docs.acme.dev/releases/checkout-launch-brief",
                excerpt:
                  "Before traffic expands, the launch owner must confirm rollback readiness and support escalation coverage...",
              },
              {
                num: 2,
                title:
                  "QA handoff — checkout smoke and regression report",
                source: "docs.acme.dev/qa/checkout-smoke-report",
                excerpt:
                  "The mobile summary layout differs from the approved frame below 768px, but payment success and failure paths are stable...",
              },
              {
                num: 3,
                title:
                  "Design handoff — mobile summary pattern",
                source: "figma.com/file/checkout-redesign/mobile-summary",
                excerpt:
                  "The sticky total card is the approved mobile pattern for the release candidate and should replace the stacked summary variant...",
              },
            ].map((ref) => (
              <div
                key={ref.num}
                className="flex items-start gap-3 rounded-md border border-border/40 p-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground">
                  {ref.num}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{ref.title}</p>
                  <p className="text-xs text-muted-foreground">{ref.source}</p>
                  <p className="mt-1 text-xs text-muted-foreground italic">
                    {ref.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>
            Inline superscripts are best for flowing prose where interruption
            should be minimal. Citation chips work better for structured
            references or when the source label is meaningful. Reference panels
            should appear at the end of a message or in a collapsible drawer.
            Always include a source path or URL — citations without provenance
            undermine trust.
          </p>
        </div>
      </section>

      {/* ─── Composer ─── */}
      <section id="composer" className="page-section">
        <p className="section-label mb-3">Input</p>
        <h2 className="text-xl font-semibold tracking-tight">Composer</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          The message input area. Use the controls to explore every variant —
          type, send, toggle features. Everything is interactive.
        </p>
        <p className="mt-3 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          This lens shows the composer in context. For the canonical pattern
          reference, see <Link href="/composer" className="text-foreground underline underline-offset-4">Composer</Link>.
        </p>

        <div className="mt-14 rounded-xl border border-border/40 bg-background p-6">
          <InteractiveComposer />
        </div>

        {/* Composer spec table */}
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
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Container
              </td>
              <td className="py-3">
                max-w-[720px], rounded-lg, border border-border
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Textarea
              </td>
              <td className="py-3">
                Auto-expanding, min 36px, max 160px, 14px Albert Sans
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Send button
              </td>
              <td className="py-3">
                32×32px, bg-primary when active, bg-muted when empty, spring
                press animation
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Focus state
              </td>
              <td className="py-3">
                Border transitions to foreground/20, subtle outer shadow
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Scope banner
              </td>
              <td className="py-3">
                max-w-[690px], bg-muted/50, slides in/out, dismissible × button
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Reply banner
              </td>
              <td className="py-3">
                ↩ icon + truncated quote, no label or border-quote, 12px
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Knowledge tabs
              </td>
              <td className="py-3">
                Clickable tab row, active = bg-primary, placeholder changes per
                tab
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Suggestions
              </td>
              <td className="py-3">
                Click to fill textarea, flash animation on click, flex-wrap
                below
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">
                Attachments
              </td>
              <td className="py-3">
                File preview chips with name/size, dismiss per-file, enables
                send
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>
            Scope and reply-to are mutually exclusive — enabling one dismisses
            the other. Knowledge tabs default to "All Sources" and change the
            placeholder contextually. The send button uses a spring-based press
            animation (cubic-bezier 0.34, 1.56, 0.64, 1) with an arrow flyout
            on send. Every banner and chip set slides in with a 250ms ease-out.
            Suggestion chips fill the textarea on click with a brief color flash
            to confirm the action.
          </p>
        </div>
      </section>
    </article>
  )
}
