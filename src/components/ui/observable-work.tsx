"use client"

import * as React from "react"
import {
  Alert01Icon,
  ArrowDown01Icon,
  Clock01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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

/* Icon-only status with distinct shapes per state (not color alone), plus
   visually hidden text so the status survives screen readers. */
function ObservableWorkStatusIndicator({
  status,
}: {
  status: ObservableWorkStatus
}) {
  return (
    <span
      data-slot="observable-work-status"
      data-status={status}
      title={statusLabels[status]}
      className="flex size-5 shrink-0 items-center justify-center"
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
        <span className="observable-work-pulse size-2 rounded-full bg-foreground/70" />
      ) : status === "pending" ? (
        <span className="size-2 rounded-full border border-muted-foreground/60" />
      ) : status === "blocked" ? (
        <HugeiconsIcon
          icon={Clock01Icon}
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
      <span className="sr-only">{statusLabels[status]}</span>
    </span>
  )
}

function ObservableWorkStepHeader({
  title,
  description,
  status,
  source,
  meta,
  chevron,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  status: ObservableWorkStatus
  source?: React.ReactNode
  meta?: React.ReactNode
  chevron?: boolean
}) {
  return (
    <>
      <span className="min-w-0">
        <span className="block truncate font-medium text-foreground">
          {title}
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
      <span className="mt-0.5 flex shrink-0 items-center gap-2 self-start">
        <ObservableWorkStatusIndicator status={status} />
        {chevron && (
          <span
            aria-hidden="true"
            className="text-muted-foreground transition-transform group-open/observable-step:rotate-180 motion-reduce:transition-none [&_svg]:size-3.5"
          >
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={1.5} />
          </span>
        )}
      </span>
    </>
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
  const header = (
    <ObservableWorkStepHeader
      title={title}
      description={description}
      status={status}
      source={source}
      meta={meta}
      chevron={Boolean(children)}
    />
  )

  // A step with nothing to reveal must not look expandable: no <details>,
  // no pointer cursor, no hover state, no chevron.
  if (!children) {
    return (
      <div
        data-slot="observable-work-step"
        data-status={status}
        role="listitem"
        className={cn(
          "grid grid-cols-[1fr_auto] gap-3 border-b border-border/70 px-4 py-3 last:border-b-0",
          className
        )}
        {...(props as React.ComponentProps<"div">)}
      >
        {header}
      </div>
    )
  }

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
        {header}
      </summary>
      <div
        data-slot="observable-work-step-content"
        className="px-4 pb-4 text-sm leading-6 text-muted-foreground"
      >
        {children}
      </div>
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
