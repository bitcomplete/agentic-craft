"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  Alert01Icon,
  File01Icon,
  Search01Icon,
  Shield01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"

type IconProp = React.ComponentProps<typeof HugeiconsIcon>["icon"]
type ActivityMode = "live" | "history"
type ActivityFilter = "all" | "tools" | "approvals"
type ActivityKind = "tool call" | "approval" | "handoff" | "system"
type ActivityStatus = "running" | "complete" | "needs review"

type ActivityEvent = {
  actor: string
  artifact: string
  detail: string
  id: string
  icon: IconProp
  kind: ActivityKind
  status: ActivityStatus
  time: string
  title: string
  visibility: string
}

const DEMO_STYLES = `
  @keyframes activity-timeline-slide-in {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes activity-timeline-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }

  @keyframes activity-timeline-press {
    0% { transform: scale(1); }
    50% { transform: scale(0.97); }
    100% { transform: scale(1); }
  }

  .activity-timeline-slide-in {
    animation: activity-timeline-slide-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .activity-timeline-pulse {
    animation: activity-timeline-pulse 1.5s ease-in-out infinite;
  }

  .activity-timeline-press:active {
    animation: activity-timeline-press 150ms ease;
  }
`

const LIVE_EVENTS: ActivityEvent[] = [
  {
    id: "live-launch-review",
    time: "Just now",
    title: "Launch review resumed after design handoff update",
    kind: "system",
    status: "running",
    actor: "Workspace",
    artifact: "checkout-launch-review",
    detail: "The execution stream stays attached to the active review so people can inspect work while it is happening.",
    visibility: "Visible to everyone following the release thread.",
    icon: Activity01Icon,
  },
  {
    id: "live-mobile-check",
    time: "18s ago",
    title: "Compared mobile summary state against the approved design",
    kind: "tool call",
    status: "complete",
    actor: "Release review agent",
    artifact: "checkout-redesign.fig",
    detail: "Tool work appears inline with plain-language labels so a reviewer can follow the agent without parsing raw traces.",
    visibility: "Visible in the live stream and retained in history mode.",
    icon: Search01Icon,
  },
  {
    id: "live-approval-request",
    time: "42s ago",
    title: "Requested approval before updating the staged rollout plan",
    kind: "approval",
    status: "needs review",
    actor: "Release review agent",
    artifact: "staged-rollout.md",
    detail: "Consequential steps should show up in the stream immediately, even when the actual decision is captured elsewhere.",
    visibility: "Visible to approvers and anyone monitoring the release.",
    icon: Shield01Icon,
  },
  {
    id: "live-qa-handoff",
    time: "1m ago",
    title: "Attached QA summary to the active review thread",
    kind: "handoff",
    status: "complete",
    actor: "Review coordinator",
    artifact: "qa-smoke-checks.md",
    detail: "Handoffs belong in the same execution stream so the relationship between work, artifacts, and people stays legible.",
    visibility: "Visible in history and linked from the review thread.",
    icon: File01Icon,
  },
]

const HISTORY_EVENTS: ActivityEvent[] = [
  {
    id: "history-rollback",
    time: "11:42 AM",
    title: "Verified rollback owner for the checkout release",
    kind: "tool call",
    status: "complete",
    actor: "Release review agent",
    artifact: "checkout-launch-brief.md",
    detail: "Historical mode is for reconstruction and scanability rather than streaming.",
    visibility: "Retained for retrospective review.",
    icon: Tick01Icon,
  },
  {
    id: "history-approval",
    time: "11:37 AM",
    title: "Product lead approved blocker classification",
    kind: "approval",
    status: "complete",
    actor: "A. Chen",
    artifact: "launch-thread reply #14",
    detail: "Approval events remain part of the timeline, but they should link onward to the formal audit record when accountability matters.",
    visibility: "Retained in history and referenced from the audit trail.",
    icon: Shield01Icon,
  },
  {
    id: "history-doc-parse",
    time: "11:29 AM",
    title: "Parsed launch brief for open release blockers",
    kind: "tool call",
    status: "complete",
    actor: "Release review agent",
    artifact: "checkout-launch-brief.md",
    detail: "The stream should preserve plain-language descriptions instead of raw internal tool signatures.",
    visibility: "Retained in history mode.",
    icon: Search01Icon,
  },
  {
    id: "history-follow-up",
    time: "11:14 AM",
    title: "Escalated missing analytics owner for manual review",
    kind: "approval",
    status: "needs review",
    actor: "Review coordinator",
    artifact: "analytics-plan.md",
    detail: "Escalations and unresolved reviews should stay visible when someone filters for approvals only.",
    visibility: "Retained until review is closed.",
    icon: Alert01Icon,
  },
]

const ANATOMY = [
  ["Timeline header", "Names the current mode, active filters, and whether the stream is live or historical."],
  ["Filter controls", "Reduce the stream to the event categories that matter for the current oversight task."],
  ["Event rows", "Chronological items with plain-language labels, timestamps, and event type badges."],
  ["Selection state", "Lets a reviewer expand one event without losing their place in the stream."],
  ["Context panel", "Shows the actor, linked artifact, and why the event matters for oversight."],
]

const MODES = [
  {
    title: "Live feed",
    detail: "Use while work is in motion so new execution events appear in the same stream as the surrounding context.",
  },
  {
    title: "History view",
    detail: "Use after execution to reconstruct what happened over time without the noise of live updates.",
  },
  {
    title: "Filtered review",
    detail: "Use when a reviewer needs only one event class, such as approvals or tool work, for a focused scan.",
  },
]

const EVENT_MODEL = [
  ["Timestamp", "Places each event in chronological order so work can be reconstructed later."],
  ["Actor", "Makes it clear whether a step came from an agent, a person, or the surrounding system."],
  ["Event type", "Separates tool work, approvals, handoffs, and system state changes without forcing separate surfaces."],
  ["Artifact link", "Connects the event to the file, thread, or document that the action changed or referenced."],
  ["Status", "Clarifies whether the event is still running, completed, or waiting on review."],
  ["Human-readable label", "Explains what happened in the language of the task rather than internal implementation details."],
]

const IMPLEMENTATION = [
  ["Canonical route", "app/activity-timeline/page.tsx"],
  ["Canonical content", "src/views/activity-timeline-content.tsx"],
  ["Lens source material", "src/views/observability-content.tsx"],
  ["Structural reference", "src/views/composer-content.tsx"],
  ["Adjacent pattern", "src/views/audit-trail-content.tsx"],
]

function getVisibleEvents(mode: ActivityMode, filter: ActivityFilter) {
  const source = mode === "live" ? LIVE_EVENTS : HISTORY_EVENTS
  if (filter === "all") return source
  if (filter === "tools") return source.filter((event) => event.kind === "tool call")
  return source.filter((event) => event.kind === "approval")
}

function ActivityTimelineDemo() {
  const [mode, setMode] = React.useState<ActivityMode>("live")
  const [filter, setFilter] = React.useState<ActivityFilter>("all")
  const [selectedEventId, setSelectedEventId] = React.useState<string>(LIVE_EVENTS[0].id)

  const visibleEvents = getVisibleEvents(mode, filter)
  const selectedEvent =
    visibleEvents.find((event) => event.id === selectedEventId) ?? visibleEvents[0]

  const handleModeChange = (nextMode: ActivityMode) => {
    const nextEvents = getVisibleEvents(nextMode, filter)
    setMode(nextMode)
    setSelectedEventId(nextEvents[0]?.id ?? "")
  }

  const handleFilterChange = (nextFilter: ActivityFilter) => {
    const nextEvents = getVisibleEvents(mode, nextFilter)
    setFilter(nextFilter)
    setSelectedEventId(nextEvents[0]?.id ?? "")
  }

  return (
    <div className="mt-10 rounded-xl border border-border/40 bg-background p-6">
      <style>{DEMO_STYLES}</style>

      <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-4">
        <span className="section-label mr-2">Controls</span>
        {(["live", "history"] as const).map((nextMode) => (
          <button
            key={nextMode}
            type="button"
            onClick={() => handleModeChange(nextMode)}
            className={[
              "activity-timeline-press rounded-md border px-3 py-1.5 text-xs transition-colors",
              mode === nextMode
                ? "border-border bg-foreground/[0.05] text-foreground"
                : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {nextMode === "live" ? "Live" : "History"}
          </button>
        ))}
        <div className="mx-1 h-4 w-px bg-border/60" />
        {([
          ["all", "All events"],
          ["tools", "Tool calls"],
          ["approvals", "Approvals"],
        ] as const).map(([nextFilter, label]) => (
          <button
            key={nextFilter}
            type="button"
            onClick={() => handleFilterChange(nextFilter)}
            className={[
              "activity-timeline-press rounded-md border px-3 py-1.5 text-xs transition-colors",
              filter === nextFilter
                ? "border-border bg-foreground/[0.05] text-foreground"
                : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-lg border border-border/40 p-4">
          <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Activity01Icon} size={14} strokeWidth={1.5} />
              <span>
                {mode === "live" ? "Execution stream in progress" : "Execution history for this review"}
              </span>
            </div>
            {mode === "live" ? (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="activity-timeline-pulse h-1.5 w-1.5 rounded-full bg-foreground/60" />
                Streaming
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {visibleEvents.length} visible events
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {visibleEvents.map((event, index) => {
              const isSelected = selectedEvent?.id === event.id

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEventId(event.id)}
                  className={[
                    "activity-timeline-press activity-timeline-slide-in w-full rounded-lg border px-4 py-3 text-left",
                    isSelected
                      ? "border-foreground/20 bg-foreground/[0.03]"
                      : "border-border/40 hover:bg-muted/40",
                  ].join(" ")}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon icon={event.icon} size={13} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.time}</span>
                        <span className="rounded-md bg-muted px-1.5 py-0.5">{event.kind}</span>
                        <span className="rounded-md border border-border/60 px-1.5 py-0.5">
                          {event.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-foreground">{event.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.actor} · {event.artifact}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border/40 p-4">
          <p className="text-xs text-muted-foreground">Selected event</p>
          <p className="mt-2 text-sm font-medium text-foreground">{selectedEvent?.title}</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border border-border/40 p-3">
              <p className="text-xs text-muted-foreground">Actor</p>
              <p className="mt-1 text-sm text-foreground">{selectedEvent?.actor}</p>
            </div>
            <div className="rounded-md border border-border/40 p-3">
              <p className="text-xs text-muted-foreground">Linked artifact</p>
              <p className="mt-1 text-sm text-foreground">{selectedEvent?.artifact}</p>
            </div>
            <div className="rounded-md border border-border/40 p-3">
              <p className="text-xs text-muted-foreground">Why it belongs in the timeline</p>
              <p className="mt-1 leading-relaxed">{selectedEvent?.detail}</p>
            </div>
            <div className="rounded-md border border-border/40 p-3">
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="mt-1 leading-relaxed">{selectedEvent?.visibility}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActivityTimelineContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Pattern Reference</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Activity Timeline
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          The activity timeline is the live and historical execution stream for an
          agentic interface. It helps people monitor work in motion, filter for the
          event types that matter right now, and reconstruct a task later without
          dropping down to raw logs.
        </p>
      </header>

      <section id="demo" className="page-section">
        <p className="section-label mb-3">Interactive</p>
        <h2 className="text-xl font-semibold tracking-tight">Demo</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          Switch between live and historical modes, then filter the stream to see
          how the same execution surface supports in-the-moment oversight and later
          review.
        </p>

        <ActivityTimelineDemo />
      </section>

      <section id="anatomy" className="page-section">
        <p className="section-label mb-3">Structure</p>
        <h2 className="text-xl font-semibold tracking-tight">Anatomy</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          This pattern is not just a list of events. It combines selection,
          filtering, and lightweight detail so a reviewer can understand activity
          without leaving the active task surface.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Element
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {ANATOMY.map(([element, role]) => (
              <tr key={element} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{element}</td>
                <td className="py-3">{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="modes" className="page-section">
        <p className="section-label mb-3">Behavior</p>
        <h2 className="text-xl font-semibold tracking-tight">Modes</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          The timeline should adapt to the oversight task. A person monitoring work
          in progress needs a different view than someone retracing how a release
          review unfolded.
        </p>

        <div className="mt-10 space-y-3">
          {MODES.map((mode) => (
            <div key={mode.title} className="rounded-lg border border-border/40 p-4">
              <p className="text-sm font-medium text-foreground">{mode.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {mode.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="event-model" className="page-section">
        <p className="section-label mb-3">Data</p>
        <h2 className="text-xl font-semibold tracking-tight">Event model</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          Each event should carry just enough structure for oversight and filtering,
          while still reading like task-level prose instead of instrumentation.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Field
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Why it matters
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {EVENT_MODEL.map(([field, reason]) => (
              <tr key={field} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{field}</td>
                <td className="py-3">{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="composition" className="page-section">
        <p className="section-label mb-3">Guidance</p>
        <h2 className="text-xl font-semibold tracking-tight">Composition rules</h2>
        <div
          className="mt-10 space-y-4 font-serif text-base"
          style={{
            lineHeight: "26px",
            letterSpacing: "-0.4px",
            fontVariationSettings: '"opsz" 12',
          }}
        >
          <p>
            Keep the activity timeline close to the work surface it describes. It
            should feel like a living execution stream, not a detached admin log.
          </p>
          <p>
            Filtering is essential because execution streams become unreadable when
            everything has the same visual priority. The control surface should
            make it easy to isolate approvals, tool work, or other critical events.
          </p>
          <p>
            Use this pattern for what happened and when. When an event becomes part
            of a durable accountability record, hand off to{" "}
            <Link
              href="/audit-trail"
              className="text-foreground underline underline-offset-4"
            >
              Audit Trail
            </Link>{" "}
            rather than overloading the timeline with formal review metadata.
          </p>
        </div>
      </section>

      <section id="implementation" className="page-section">
        <p className="section-label mb-3">Implementation</p>
        <h2 className="text-xl font-semibold tracking-tight">Implementation notes</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          This page promotes the execution stream out of the observability lens and
          into the pattern-reference layer while keeping the lens page as the place
          that explains why the pattern matters.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Asset
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Path
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {IMPLEMENTATION.map(([asset, path]) => (
              <tr key={asset} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{asset}</td>
                <td className="py-3">{path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="page-section">
        <p className="section-label mb-3">Related</p>
        <h2 className="text-xl font-semibold tracking-tight">Related pages</h2>
        <div className="mt-10 space-y-2 text-sm text-muted-foreground">
          <p>
            Read the{" "}
            <Link
              href="/observability"
              className="text-foreground underline underline-offset-4"
            >
              Observability
            </Link>{" "}
            lens for the broader framing around oversight, error surfaces, and
            execution visibility.
          </p>
          <p>
            Compare with{" "}
            <Link
              href="/audit-trail"
              className="text-foreground underline underline-offset-4"
            >
              Audit Trail
            </Link>{" "}
            for the formal review record that sits downstream of important events.
          </p>
          <p>
            Compare with{" "}
            <Link
              href="/thread-timeline"
              className="text-foreground underline underline-offset-4"
            >
              Thread Timeline
            </Link>{" "}
            for conversational chronology rather than execution history.
          </p>
        </div>
      </section>
    </article>
  )
}
