"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  MailReply01Icon,
  Task01Icon,
  ArrowExpand01Icon,
  ArrowShrink01Icon,
} from "@hugeicons/core-free-icons"
import type { ComposerScopeItem } from "./composer"
import type { ComposerTask } from "./composer"

/* ── Island wrapper (used by each island primitive) ── */

function Island({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-island-wrap"
      className={cn("animate-composer-island w-full", className)}
      style={{ zIndex: 0 }}
      {...props}
    >
      <div
        data-slot="composer-island"
        className="border border-b-0 border-border/80 bg-background/95 shadow-[0_-1px_10px_rgba(0,0,0,0.08)]"
      >
        {children}
      </div>
    </div>
  )
}

/* ── ComposerScope ── */

export function ComposerScope({
  items,
  onRemove,
  onDismiss,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  items: ComposerScopeItem[]
  onRemove?: (id: string) => void
  onDismiss?: () => void
}) {
  return (
    <Island className={className} {...props}>
      <div className="flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {items.map((item) => (
            <span
              key={item.id}
              className="animate-composer-slide group/scope inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] leading-4 text-foreground sm:px-2 sm:text-xs"
            >
              <HugeiconsIcon
                icon={item.icon}
                size={12}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground"
              />
              <span className="max-w-[160px] truncate">{item.label}</span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.label}`}
                  className="text-muted-foreground transition-colors hover:text-foreground sm:opacity-0 sm:group-focus-within/scope:opacity-100 sm:group-hover/scope:opacity-100"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={10}
                    strokeWidth={2}
                  />
                </button>
              )}
            </span>
          ))}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss scope"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </Island>
  )
}

/* ── ComposerReply ── */

export function ComposerReply({
  onDismiss,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  onDismiss?: () => void
}) {
  return (
    <Island className={className} {...props}>
      <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2">
        <HugeiconsIcon
          icon={MailReply01Icon}
          size={13}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground/60"
        />
        <span className="flex-1 truncate text-xs text-muted-foreground">
          {children}
        </span>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss reply context"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </Island>
  )
}

/* ── ComposerPlan ── */

export function ComposerPlan({
  tasks,
  defaultExpanded = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  tasks: ComposerTask[]
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const completedCount = tasks.filter((t) => t.done).length

  return (
    <Island className={className} {...props}>
      <div className="px-2.5 py-1.5 sm:px-3 sm:py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Task01Icon} size={13} strokeWidth={1.5} />
            <span className="font-medium text-foreground">Plan</span>
            <span className="tabular-nums">
              {completedCount}/{tasks.length}
            </span>
          </div>
          <button
            type="button"
            data-compact-touch
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse plan" : "Expand plan"}
            aria-expanded={expanded}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <HugeiconsIcon
              icon={expanded ? ArrowShrink01Icon : ArrowExpand01Icon}
              size={14}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {expanded && (
          <ol className="animate-composer-slide mt-1.5 grid gap-1 pl-5 text-xs text-muted-foreground sm:mt-2">
            {tasks.map((task, i) => (
              <li
                key={i}
                className={cn(
                  "list-decimal pl-0.5 leading-4 marker:text-muted-foreground/60",
                  task.dimmed && "text-muted-foreground/45"
                )}
              >
                <span>{task.label}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Island>
  )
}
