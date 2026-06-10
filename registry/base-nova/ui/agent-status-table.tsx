"use client"

import * as React from "react"

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
  if (typeof value !== "number") return "n/a"
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
  return (
    <Table className={className}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell className="min-w-32">
              <div className="min-w-0">
                <p className="truncate font-medium">{agent.name}</p>
                {agent.role && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {agent.role}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1.5">
                <StatusIndicator
                  status={indicatorStatus[agent.status]}
                  label={statusCopy[agent.status]}
                />
                <span className="text-xs text-muted-foreground">
                  {statusCopy[agent.status]}
                </span>
              </span>
            </TableCell>
            <TableCell className="max-w-64 min-w-44 whitespace-normal text-muted-foreground">
              {agent.task ?? "No active task"}
            </TableCell>
            <TableCell className="min-w-32">
              {typeof agent.progress === "number" ? (
                <div className="flex items-center gap-2">
                  <Progress
                    value={agent.progress}
                    className="min-w-20"
                    aria-label={`${agent.name} progress`}
                  />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatPercent(agent.progress)}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">n/a</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {formatPercent(agent.confidence)}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {agent.cost ?? "n/a"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {agent.updated ?? "n/a"}
            </TableCell>
          </TableRow>
        ))}
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
      <span className="text-xs text-muted-foreground">
        {statusCopy[status]}
      </span>
    </span>
  )
}

export {
  AgentStatusTable,
  AgentStatusCell,
  type AgentStatus,
  type AgentStatusRow,
}
