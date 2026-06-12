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
  /** A plain-text return — the agent's own words, rendered in the serif voice */
  output?: string
}

type AgentStatusRow = {
  id: string
  name: string
  role?: string
  status: AgentStatus
  task?: string
  progress?: number
  confidence?: number
  cost?: string
  updated?: string
  /** When present, the row gains a disclosure that expands an inline detail panel */
  detail?: AgentDetail
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

function AgentStatusTable({
  agents,
  caption,
  className,
}: {
  agents: AgentStatusRow[]
  caption?: React.ReactNode
  className?: string
}) {
  const detailIdBase = React.useId()
  const [expandedIds, setExpandedIds] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )
  const hasAnyDetail = agents.some((agent) => agent.detail)

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
    <Table className={cn("[&_td]:px-1.5 [&_th]:px-1.5", className)}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-right">Confidence</TableHead>
          <TableHead className="text-right">Cost</TableHead>
          <TableHead className="text-right">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => {
          const isExpanded = agent.detail ? expandedIds.has(agent.id) : false
          const detailId = `${detailIdBase}-${agent.id}`
          const detailMeta = agent.detail
            ? [
                agent.detail.model ?? null,
                agent.detail.tokens ? `${agent.detail.tokens} tokens` : null,
                agent.detail.tools !== undefined
                  ? `${agent.detail.tools} tool${agent.detail.tools === 1 ? "" : "s"}`
                  : null,
                agent.detail.elapsed ?? null,
              ].filter(Boolean)
            : []
          return (
            <React.Fragment key={agent.id}>
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
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className={cn(
                          "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                          !isExpanded && "-rotate-90"
                        )}
                      />
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
                      <p className="truncate font-medium" title={agent.name}>
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
                  <span className="flex items-center gap-1.5">
                    <StatusIndicator
                      status={indicatorStatus[agent.status]}
                      label={statusCopy[agent.status]}
                    />
                    <span className="text-muted-foreground">
                      {statusCopy[agent.status]}
                    </span>
                  </span>
                </TableCell>
                {/* One line per task keeps the row rhythm even — the full
                    text lives in the detail panel and the title attribute */}
                <TableCell
                  className="max-w-44 min-w-36 truncate text-muted-foreground"
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
                  {formatPercent(agent.confidence)}
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
                  <TableCell colSpan={7} id={detailId} className="pt-0 pb-3">
                    <div className="flex min-w-44 flex-col gap-1.5 pl-5">
                      {detailMeta.length > 0 && (
                        <p className="agent-detail-reveal text-xs text-muted-foreground tabular-nums motion-reduce:animate-none">
                          {detailMeta.join(" · ")}
                        </p>
                      )}
                      {agent.detail.returned && (
                        <p className="agent-detail-reveal font-mono text-xs text-foreground [animation-delay:60ms] [animation-fill-mode:both] motion-reduce:animate-none">
                          {agent.detail.returned}
                        </p>
                      )}
                      {agent.detail.output && (
                        <p className="agent-detail-reveal agent-prose max-w-[65ch] text-sm [animation-delay:60ms] [animation-fill-mode:both] motion-reduce:animate-none">
                          {agent.detail.output}
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          )
        })}
      </TableBody>
    </Table>
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
      <StatusIndicator
        status={indicatorStatus[status]}
        label={statusCopy[status]}
      />
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
