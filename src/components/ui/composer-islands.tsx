"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowExpand01Icon,
  ArrowShrink01Icon,
  Cancel01Icon,
  MailReply01Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ComposerScopeItem, ComposerTask } from "./composer"

function Island({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <div
      data-slot="composer-island-wrapper"
      className={cn("animate-composer-island", className)}
      style={{ zIndex: 0 }}
    >
      <Card
        data-slot="composer-island"
        size="sm"
        className="gap-0 py-0"
        {...props}
      >
        {children}
      </Card>
    </div>
  )
}

export function ComposerScope({
  items,
  onRemove,
  onDismiss,
  className,
  ...props
}: React.ComponentProps<typeof Island> & {
  items: ComposerScopeItem[]
  onRemove?: (id: string) => void
  onDismiss?: () => void
}) {
  return (
    <Island className={className} {...props}>
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {items.map((item) => (
            <Badge key={item.id} variant="outline">
              <HugeiconsIcon icon={item.icon} size={12} strokeWidth={1.5} />
              <span className="max-w-[160px] truncate">{item.label}</span>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onRemove(item.id)}
                  className="size-4"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={10} strokeWidth={2} />
                </Button>
              )}
            </Badge>
          ))}
        </div>
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onDismiss}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
          </Button>
        )}
      </div>
    </Island>
  )
}

export function ComposerReply({
  onDismiss,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Island> & {
  onDismiss?: () => void
}) {
  return (
    <Island className={className} {...props}>
      <div className="flex items-center gap-3 px-4 py-3">
        <Badge variant="outline">
          <HugeiconsIcon icon={MailReply01Icon} size={12} strokeWidth={1.5} />
          Reply
        </Badge>
        <span className="flex-1 truncate text-sm text-muted-foreground">
          {children}
        </span>
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onDismiss}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
          </Button>
        )}
      </div>
    </Island>
  )
}

export function ComposerPlan({
  tasks,
  defaultExpanded = false,
  className,
  ...props
}: React.ComponentProps<typeof Island> & {
  tasks: ComposerTask[]
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const completedCount = tasks.filter((t) => t.done).length

  return (
    <Island className={className} {...props}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Plan</Badge>
            <div className="flex min-w-0 items-center gap-2">
              <HugeiconsIcon icon={Task01Icon} size={14} strokeWidth={1.5} />
              <span className="truncate">
                {completedCount} out of {tasks.length} tasks completed
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setExpanded(!expanded)}
          >
            <HugeiconsIcon
              icon={expanded ? ArrowShrink01Icon : ArrowExpand01Icon}
              size={14}
              strokeWidth={1.5}
            />
          </Button>
        </div>

        {expanded && (
          <div className="animate-composer-slide mt-3 space-y-3">
            {tasks.map((task, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 text-sm",
                  task.dimmed ? "text-muted-foreground" : "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    task.done ? "bg-primary text-primary-foreground" : "",
                  )}
                />
                <span>
                  {i + 1}. {task.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Island>
  )
}
