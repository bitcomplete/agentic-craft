"use client"

import * as React from "react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { StatusIndicator } from "@/components/ui/status-indicator"
import { cn } from "@/lib/utils"

type ObservableWorkStatus =
  | "pending"
  | "active"
  | "complete"
  | "blocked"
  | "error"

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
        <StatusIndicator status={status} />
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
