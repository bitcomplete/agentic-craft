"use client"

import {
  Alert01Icon,
  Clock01Icon,
  Loading03Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type StatusIndicatorStatus =
  | "pending"
  | "idle"
  | "active"
  | "complete"
  | "blocked"
  | "warning"
  | "error"

const statusIndicatorLabels: Record<StatusIndicatorStatus, string> = {
  pending: "Pending",
  idle: "Idle",
  active: "Active",
  complete: "Complete",
  blocked: "Blocked",
  warning: "Warning",
  error: "Error",
}

/* The product-wide status vocabulary: one shape per state so status never
   relies on color alone — check in a soft square (complete), spinner
   (active), dashed circle (pending/idle), clock (blocked), alert (warning /
   error). Icon-only on screen; the label survives via sr-only text and a
   title tooltip. */
function StatusIndicator({
  status,
  label,
  className,
}: {
  status: StatusIndicatorStatus
  /** Override the visually hidden/tooltip text, e.g. "Proposed". */
  label?: string
  className?: string
}) {
  const text = label ?? statusIndicatorLabels[status]
  return (
    <span
      data-slot="status-indicator"
      data-status={status}
      title={text}
      className={cn(
        "flex size-5 shrink-0 items-center justify-center",
        className
      )}
    >
      {status === "complete" ? (
        <span className="flex size-5 items-center justify-center rounded-md bg-foreground/10">
          <HugeiconsIcon
            icon={Tick01Icon}
            size={12}
            strokeWidth={2}
            className="text-foreground/70"
            aria-hidden="true"
          />
        </span>
      ) : status === "active" ? (
        <HugeiconsIcon
          icon={Loading03Icon}
          size={14}
          strokeWidth={1.5}
          className="animate-spin text-foreground/70 motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : status === "pending" || status === "idle" ? (
        <span className="size-3 rounded-full border border-dashed border-muted-foreground/70" />
      ) : status === "blocked" ? (
        <HugeiconsIcon
          icon={Clock01Icon}
          size={14}
          strokeWidth={1.5}
          className="text-muted-foreground"
          aria-hidden="true"
        />
      ) : status === "warning" ? (
        <HugeiconsIcon
          icon={Alert01Icon}
          size={14}
          strokeWidth={1.5}
          className="text-muted-foreground"
          aria-hidden="true"
        />
      ) : (
        <HugeiconsIcon
          icon={Alert01Icon}
          size={14}
          strokeWidth={1.5}
          className="text-destructive"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{text}</span>
    </span>
  )
}

export { StatusIndicator, statusIndicatorLabels, type StatusIndicatorStatus }
