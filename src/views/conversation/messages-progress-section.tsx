"use client"

import { useState, useEffect } from "react"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  ObservableWork,
  type ObservableWorkStatus,
} from "@/components/ui/observable-work"
import { StatusIndicator } from "@/components/ui/status-indicator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

type ProsePreference = "serif" | "sans" | "compact"

type ProsePreferenceDetail = {
  label: string
  className: string
  lineHeight: string
  fontVariationSettings?: string
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
      className: "agent-prose font-serif text-base",
      lineHeight: "26px",
      description:
        "A comfortable default for long analysis, explanations, and review-style answers.",
    },
    sans: {
      label: "Sans Prose",
      className: "font-sans text-base",
      lineHeight: "24px",
      description:
        "Better when the agent output needs to feel native to dense product chrome.",
    },
    compact: {
      label: "Compact",
      className: "font-sans text-sm",
      lineHeight: "22px",
      description:
        "Useful for operational tools where users scan many short agent updates.",
    },
  }

const agentProseBaseStyle: React.CSSProperties = {
  letterSpacing: "-0.4px",
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

/* ------------------------------------------------------------------ */
/*  Section export (messages + progress-steps colocated —             */
/*  prosePreference / agentProseStyle shared between both)            */
/* ------------------------------------------------------------------ */

export function MessagesProgressSection() {
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

  return (
    <>
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
                    I’ve reviewed the project brief against the roadmap and
                    launch checklist. The document covers the main launch goals,
                    but I found three areas that need attention.
                  </p>
                  <p className="mt-4">
                    The rollout assumptions in Section 2 reference Launch Policy
                    v2, but the appendix doesn’t map all requirements back to a
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
                    Two of the brief’s 23 requirements are not mapped back to a
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
        <div className="mt-8">
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
                <span className="text-xs text-muted-foreground/70">
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

        {/* Do / Don’t table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Do
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Don’t
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
    </>
  )
}
