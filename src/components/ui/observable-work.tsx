"use client"

import * as React from "react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ObservableWorkStatus =
  | "pending"
  | "active"
  | "complete"
  | "blocked"
  | "error"

const statusLabels: Record<ObservableWorkStatus, string> = {
  pending: "Pending",
  active: "Active",
  complete: "Complete",
  blocked: "Blocked",
  error: "Error",
}

const statusBadgeVariants: Record<
  ObservableWorkStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  pending: "outline",
  active: "secondary",
  complete: "default",
  blocked: "outline",
  error: "destructive",
}

function ObservableWorkRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="observable-work"
      role="list"
      className={cn("flex flex-col rounded-lg border border-border", className)}
      {...props}
    />
  )
}

function ObservableWorkStep({
  title,
  description,
  status,
  source,
  meta,
  defaultOpen,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"details">, "title" | "open"> & {
  title: React.ReactNode
  description?: React.ReactNode
  status: ObservableWorkStatus
  source?: React.ReactNode
  meta?: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details
      data-slot="observable-work-step"
      data-status={status}
      role="listitem"
      open={defaultOpen}
      className={cn(
        "group/observable-step border-b border-border/70 last:border-b-0",
        className
      )}
      {...props}
    >
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] gap-3 rounded-[inherit] px-4 py-3 transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="truncate font-medium text-foreground">
              {title}
            </span>
            <Badge variant={statusBadgeVariants[status]}>
              {statusLabels[status]}
            </Badge>
          </span>
          {description && (
            <span className="mt-1 block text-sm leading-5 text-muted-foreground">
              {description}
            </span>
          )}
          {(source || meta) && (
            <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              {source && <span>{source}</span>}
              {source && meta && <span aria-hidden="true">/</span>}
              {meta && <span>{meta}</span>}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="mt-1 text-muted-foreground transition-transform group-open/observable-step:rotate-180 [&_svg]:size-3.5"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={1.5} />
        </span>
      </summary>
      {children && (
        <div
          data-slot="observable-work-step-content"
          className="px-4 pb-4 text-sm leading-6 text-muted-foreground"
        >
          {children}
        </div>
      )}
    </details>
  )
}

function ObservableWorkDetail({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="observable-work-detail"
      className={cn("border-l border-border/60 py-1 pl-3", className)}
      {...props}
    />
  )
}

const ObservableWork = {
  Root: ObservableWorkRoot,
  Step: ObservableWorkStep,
  Detail: ObservableWorkDetail,
}

export {
  ObservableWork,
  ObservableWorkRoot,
  ObservableWorkStep,
  ObservableWorkDetail,
  type ObservableWorkStatus,
}
