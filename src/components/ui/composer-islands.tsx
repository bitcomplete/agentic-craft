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

type IslandProps = Omit<React.ComponentProps<typeof Card>, "className"> & {
  className?: string
  wrapperClassName?: string
}

function Island({
  className,
  wrapperClassName,
  children,
  ...props
}: IslandProps) {
  return (
    <div
      data-slot="composer-island-wrapper"
      className={cn("animate-composer-island", wrapperClassName)}
      style={{ zIndex: 0 }}
    >
      <Card
        data-slot="composer-island"
        className={cn(
          "gap-0 rounded-[calc(var(--composer-shell-radius)-var(--composer-shell-inset))] py-0",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </div>
  )
}

function IslandContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-island-content"
      className={cn(
        "[padding-inline:var(--composer-shell-inset)] py-2",
        className
      )}
      {...props}
    >
      {children}
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
      <IslandContent>
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {items.map((item) => (
              <Badge key={item.id} variant="outline">
                <HugeiconsIcon icon={item.icon} size={12} strokeWidth={1.5} />
                <span className="truncate">{item.label}</span>
                {onRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onRemove(item.id)}
                    className="size-4"
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={10}
                      strokeWidth={2}
                    />
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
      </IslandContent>
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
      <IslandContent>
        <div className="flex items-center gap-3">
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
      </IslandContent>
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
      <IslandContent>
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
                  task.dimmed ? "text-muted-foreground" : "text-foreground"
                )}
              >
                <span
                  className={cn(
                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    task.done ? "bg-primary text-primary-foreground" : ""
                  )}
                />
                <span>
                  {i + 1}. {task.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </IslandContent>
    </Island>
  )
}
