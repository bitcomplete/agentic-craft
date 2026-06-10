"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

/* ── Types ── */

type ToolCallStatus = "running" | "completed" | "failed"

/* ── Context ── */

interface ToolCallContextValue {
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  icon: IconSvgElement
  status: ToolCallStatus
  timestamp?: string
}

const ToolCallContext = React.createContext<ToolCallContextValue | null>(null)

function useToolCall(): ToolCallContextValue {
  const ctx = React.use(ToolCallContext)
  if (!ctx) throw new Error("useToolCall must be used within a <ToolCall />")
  return ctx
}

/* ── ToolCall ── */

function ToolCall({
  icon,
  status = "completed",
  timestamp,
  defaultExpanded = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  icon: IconSvgElement
  status?: ToolCallStatus
  timestamp?: string
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(
    defaultExpanded || status === "failed"
  )

  const ctx = React.useMemo(
    () => ({
      expanded,
      onExpandedChange: setExpanded,
      icon,
      status,
      timestamp,
    }),
    [expanded, icon, status, timestamp]
  )

  return (
    <ToolCallContext value={ctx}>
      <div
        data-slot="tool-call"
        className={cn(
          "relative flex min-w-0 flex-col gap-3 text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToolCallContext>
  )
}

/* ── ToolCallTrigger ── */

function ToolCallTrigger({
  className,
  children,
  expandable = true,
  ...props
}: React.ComponentProps<"button"> & {
  expandable?: boolean
}) {
  const { expanded, onExpandedChange, icon, status, timestamp } = useToolCall()
  const canExpand = expandable && status !== "running"

  return (
    <div
      data-slot="tool-call-trigger-wrap"
      aria-busy={status === "running" || undefined}
      className="group/tool-wrapper relative flex items-center gap-2"
    >
      <button
        type="button"
        data-compact-touch
        onClick={canExpand ? () => onExpandedChange(!expanded) : undefined}
        aria-expanded={canExpand ? expanded : undefined}
        aria-label={canExpand ? "Toggle tool call details" : "Tool call"}
        className={cn(
          "flex min-h-8 w-fit max-w-full min-w-0 items-center gap-2 py-1",
          canExpand ? "cursor-pointer" : "cursor-default",
          className
        )}
        {...props}
      >
        <div className="relative flex size-5 shrink-0 items-center justify-center rounded-full">
          <div className="absolute inset-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          <HugeiconsIcon
            icon={icon}
            size={16}
            strokeWidth={1.5}
            className={cn(
              "relative",
              status === "running" && "animate-tool-call-pulse",
              status === "failed"
                ? "text-destructive"
                : "text-muted-foreground group-hover/tool-wrapper:text-foreground"
            )}
          />
        </div>
        {children}
        {canExpand && (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={14}
            strokeWidth={1.5}
            className={cn(
              "shrink-0 transition-transform duration-200",
              status === "failed"
                ? "text-destructive"
                : "group-hover/tool-wrapper:text-foreground",
              expanded && "rotate-90"
            )}
          />
        )}
      </button>
      {status === "running" && <span className="sr-only">Running</span>}
      {status === "failed" && <span className="sr-only">Failed</span>}
      {timestamp && (
        <span className="ml-auto shrink-0 truncate text-xs text-muted-foreground select-none">
          {timestamp}
        </span>
      )}
    </div>
  )
}

/* ── ToolCallLabel ── */

function ToolCallLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { status } = useToolCall()

  return (
    <span
      data-slot="tool-call-label"
      className={cn(
        "min-w-0 truncate text-sm select-none",
        status === "failed"
          ? "text-destructive"
          : "group-hover/tool-wrapper:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* ── ToolCallContent ── */

function ToolCallContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { expanded } = useToolCall()
  if (!expanded) return null

  return (
    <div
      data-slot="tool-call-content"
      className={cn("animate-composer-slide -mt-1 pb-1 pl-7", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ToolCallError ── */

function ToolCallError({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { expanded } = useToolCall()
  if (!expanded) return null

  return (
    <div
      data-slot="tool-call-error"
      className={cn("animate-composer-slide -mt-1 pb-1 pl-7", className)}
      {...props}
    >
      <p className="text-xs text-destructive/80">{children}</p>
    </div>
  )
}

function ToolCallRetry({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="tool-call-retry"
      data-compact-touch
      className={cn(
        "mt-2 rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

export {
  ToolCall,
  ToolCallTrigger,
  ToolCallLabel,
  ToolCallContent,
  ToolCallError,
  ToolCallRetry,
  useToolCall,
}
export type { ToolCallStatus }
