"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { Progress } from "@/components/ui/progress"
import {
  StatusIndicator,
  type StatusIndicatorStatus,
} from "@/components/ui/status-indicator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type AgentStatus =
  | "working"
  | "idle"
  | "blocked"
  | "handoff"
  | "complete"
  | "error"

type AgentDetail = {
  /** Model tier the agent ran on, e.g. "sonnet" */
  model?: string
  /** Formatted token count for this agent, e.g. "2,841" */
  tokens?: string
  /** Number of tool calls the agent has made, e.g. 17 */
  tools?: number
  /** Formatted elapsed duration, e.g. "1:42" */
  elapsed?: string
  /** Schema-validated return value — rendered as data, in mono */
  returned?: string
  /** A plain-text return — the agent's own words, rendered as readable prose */
  output?: string
  /** The apparatus explaining itself — runtime semantics in the system's
      voice (muted sans annotation), never the agent's words */
  note?: string
}

type AgentStatusRow = {
  id: string
  name: string
  role?: string
  status: AgentStatus
  task?: string
  progress?: number
  cost?: string
  updated?: string
  /** When present, the row gains a disclosure that expands an inline detail panel */
  detail?: AgentDetail
  /** Optional subgroup label — a header row renders wherever the group
      changes between consecutive rows (e.g. phase names in an all-agents view) */
  group?: string
}

const statusCopy: Record<AgentStatus, string> = {
  working: "Working",
  idle: "Idle",
  blocked: "Blocked",
  handoff: "Handoff",
  complete: "Complete",
  error: "Error",
}

const indicatorStatus: Record<AgentStatus, StatusIndicatorStatus> = {
  working: "active",
  idle: "idle",
  blocked: "blocked",
  handoff: "active",
  complete: "complete",
  error: "error",
}

function formatPercent(value?: number) {
  if (typeof value !== "number") return "—"
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value / 100)
}

function getDetailMeta(detail: AgentDetail): string[] {
  return [
    detail.model ?? null,
    detail.tokens ? `${detail.tokens} tokens` : null,
    detail.tools !== undefined
      ? `${detail.tools} tool${detail.tools === 1 ? "" : "s"}`
      : null,
    detail.elapsed ?? null,
  ].filter((part): part is string => part !== null)
}

/** The expanded panel's content — shared by the table and card views.
    The table passes the row's task so the truncated cell has somewhere to
    finish its sentence; the card view shows the full task in place. */
function AgentDetailBody({
  detail,
  task,
}: {
  detail: AgentDetail
  task?: string
}) {
  const meta = getDetailMeta(detail)
  return (
    <>
      {task && <p className="text-sm text-muted-foreground">{task}</p>}
      {meta.length > 0 && (
        <p className="text-xs text-muted-foreground tabular-nums">
          {meta.join(" · ")}
        </p>
      )}
      {detail.returned && (
        <p className="font-mono text-xs text-foreground">{detail.returned}</p>
      )}
      {detail.output && (
        <p className="max-w-[65ch] text-sm leading-6 text-foreground">
          {detail.output}
        </p>
      )}
      {detail.note && (
        <p
          data-slot="agent-detail-note"
          className="max-w-[65ch] text-xs text-muted-foreground italic"
        >
          {detail.note}
        </p>
      )}
    </>
  )
}

function DisclosureChevron({ open }: { open: boolean }) {
  return (
    <HugeiconsIcon
      icon={ArrowDown01Icon}
      strokeWidth={1.5}
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
        !open && "-rotate-90"
      )}
    />
  )
}

function AgentStatusTable({
  agents,
  caption,
  className,
  "aria-label": ariaLabel = "Agent status",
}: {
  agents: AgentStatusRow[]
  caption?: React.ReactNode
  className?: string
  "aria-label"?: string
}) {
  const detailIdBase = React.useId()
  const [expandedIds, setExpandedIds] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )
  const hasAnyDetail = agents.some((agent) => agent.detail)

  // The scroll region is a tab stop only while it actually scrolls —
  // a focusable region with nothing to scroll is an empty keystroke
  const regionRef = React.useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = React.useState(false)
  React.useEffect(() => {
    const el = regionRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const check = () => setScrollable(el.scrollWidth > el.clientWidth)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [agents])

  function toggleDetail(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <>
      {/* ≥ md: the table. This wrapper owns the horizontal scroll as a
          labelled, focusable region so a keyboard can reach columns past
          the fold; the stock table container inside it stops scrolling. */}
      <div
        ref={regionRef}
        tabIndex={scrollable ? 0 : -1}
        role="region"
        aria-label={ariaLabel}
        data-slot="agent-status-table-region"
        className="@container relative w-full overflow-x-auto rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 max-md:hidden [&_[data-slot=table-container]]:overflow-x-visible"
      >
        <Table className={cn("[&_td]:px-1.5 [&_th]:px-1.5", className)}>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent, i) => {
              const isExpanded = agent.detail
                ? expandedIds.has(agent.id)
                : false
              const detailId = `${detailIdBase}-${agent.id}`
              const startsGroup =
                agent.group !== undefined &&
                agent.group !== agents[i - 1]?.group
              return (
                <React.Fragment key={agent.id}>
                  {startsGroup && (
                    <TableRow className="border-b-0 hover:bg-transparent">
                      <TableCell
                        colSpan={6}
                        data-slot="agent-group-header"
                        className="pt-3 pb-1 text-[11px] font-medium tracking-widest text-muted-foreground uppercase"
                      >
                        {agent.group}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className={cn(isExpanded && "border-b-0")}>
                    <TableCell className="max-w-48 min-w-32">
                      {agent.detail ? (
                        <button
                          type="button"
                          data-compact-touch
                          data-slot="agent-detail-toggle"
                          aria-expanded={isExpanded}
                          aria-controls={detailId}
                          onClick={() => toggleDetail(agent.id)}
                          className="flex w-full min-w-0 items-center gap-1.5 rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <DisclosureChevron open={isExpanded} />
                          <span className="min-w-0">
                            <span
                              className="block truncate font-medium"
                              title={agent.name}
                            >
                              {agent.name}
                            </span>
                            {agent.role && (
                              <span
                                className="mt-0.5 block truncate text-xs text-muted-foreground"
                                title={agent.role}
                              >
                                {agent.role}
                              </span>
                            )}
                          </span>
                        </button>
                      ) : (
                        <div className={cn("min-w-0", hasAnyDetail && "pl-5")}>
                          <p
                            className="truncate font-medium"
                            title={agent.name}
                          >
                            {agent.name}
                          </p>
                          {agent.role && (
                            <p
                              className="mt-0.5 truncate text-xs text-muted-foreground"
                              title={agent.role}
                            >
                              {agent.role}
                            </p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <AgentStatusCell status={agent.status} />
                    </TableCell>
                    {/* One line per task keeps the row rhythm even — the
                      full text opens the detail panel (and survives in the
                      title attribute for rows without one) */}
                    <TableCell
                      className="max-w-64 min-w-36 truncate text-muted-foreground"
                      title={agent.task}
                    >
                      {agent.task ?? "No active task"}
                    </TableCell>
                    <TableCell className="min-w-24">
                      {typeof agent.progress === "number" ? (
                        <div className="flex items-center gap-2">
                          <Progress
                            value={agent.progress}
                            className="min-w-12"
                            aria-label={`${agent.name} progress`}
                          />
                          <span className="text-muted-foreground tabular-nums">
                            {formatPercent(agent.progress)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {agent.cost ?? "—"}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap text-muted-foreground">
                      {agent.updated ?? "—"}
                    </TableCell>
                  </TableRow>
                  {agent.detail && isExpanded && (
                    <TableRow
                      data-slot="agent-detail-row"
                      className="bg-muted/50 hover:bg-muted/50"
                    >
                      <TableCell
                        colSpan={6}
                        id={detailId}
                        className="pt-0 pb-3"
                      >
                        {/* Sticky + container-width cap keep the panel readable
                          while the table scrolls sideways */}
                        <div className="sticky left-2 flex max-w-[calc(100cqw-1rem)] min-w-44 flex-col gap-1.5 pl-5">
                          <AgentDetailBody
                            detail={agent.detail}
                            task={agent.task}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* < md: the same fleet as a hairline-divided list — nothing clips,
          nothing scrolls sideways, every column survives the collapse */}
      <ul data-slot="agent-status-cards" className="flex flex-col md:hidden">
        {agents.map((agent, i) => {
          const isExpanded = agent.detail ? expandedIds.has(agent.id) : false
          const detailId = `${detailIdBase}-card-${agent.id}`
          const startsGroup =
            agent.group !== undefined && agent.group !== agents[i - 1]?.group
          return (
            <React.Fragment key={agent.id}>
              {startsGroup && (
                <li
                  data-slot="agent-group-header"
                  className="px-3 pt-3 pb-1 text-[11px] font-medium tracking-widest text-muted-foreground uppercase"
                >
                  {agent.group}
                </li>
              )}
              <li className="flex flex-col gap-2 border-b border-border/40 px-3 py-3 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  {agent.detail ? (
                    <button
                      type="button"
                      data-compact-touch
                      data-slot="agent-card-toggle"
                      aria-expanded={isExpanded}
                      aria-controls={detailId}
                      onClick={() => toggleDetail(agent.id)}
                      className="flex min-w-0 items-center gap-1.5 rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <DisclosureChevron open={isExpanded} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {agent.name}
                        </span>
                        {agent.role && (
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {agent.role}
                          </span>
                        )}
                      </span>
                    </button>
                  ) : (
                    <div className={cn("min-w-0", hasAnyDetail && "pl-5")}>
                      <p className="truncate font-medium">{agent.name}</p>
                      {agent.role && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {agent.role}
                        </p>
                      )}
                    </div>
                  )}
                  <AgentStatusCell status={agent.status} className="shrink-0" />
                </div>
                {agent.task && (
                  <p
                    className={cn(
                      "text-sm text-muted-foreground",
                      hasAnyDetail && "pl-5"
                    )}
                  >
                    {agent.task}
                  </p>
                )}
                <div
                  className={cn(
                    "flex items-center justify-between gap-3",
                    hasAnyDetail && "pl-5"
                  )}
                >
                  {typeof agent.progress === "number" ? (
                    <div className="flex min-w-0 items-center gap-2">
                      <Progress
                        value={agent.progress}
                        className="w-24"
                        aria-label={`${agent.name} progress`}
                      />
                      <span className="text-muted-foreground tabular-nums">
                        {formatPercent(agent.progress)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {[agent.cost, agent.updated]
                      .filter((part): part is string => Boolean(part))
                      .join(" · ")}
                  </span>
                </div>
                {agent.detail && isExpanded && (
                  <div id={detailId} className="flex flex-col gap-1.5 pl-5">
                    <AgentDetailBody detail={agent.detail} />
                  </div>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ul>
      {caption && (
        <p className="mt-4 text-sm text-muted-foreground md:hidden">
          {caption}
        </p>
      )}
    </>
  )
}

function AgentStatusCell({
  status,
  className,
}: {
  status: AgentStatus
  className?: string
}) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      {/* The visible word is the accessible status — the glyph is decor
          here, so its sr-only label is hidden to avoid a double announce */}
      <span aria-hidden="true">
        <StatusIndicator
          status={indicatorStatus[status]}
          label={statusCopy[status]}
        />
      </span>
      <span className="text-muted-foreground">{statusCopy[status]}</span>
    </span>
  )
}

export {
  AgentStatusTable,
  AgentStatusCell,
  type AgentStatus,
  type AgentStatusRow,
  type AgentDetail,
}
