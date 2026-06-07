"use client"

import * as React from "react"
import {
  Activity01Icon,
  Alert01Icon,
  Clock01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type RunTraceStatus =
  | "queued"
  | "running"
  | "complete"
  | "blocked"
  | "warning"
  | "error"

type RunTraceEvent = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  status: RunTraceStatus
  source?: React.ReactNode
  timestamp?: React.ReactNode
  duration?: React.ReactNode
  detail?: React.ReactNode
}

type RunTraceProps = React.ComponentProps<"section"> & {
  title: React.ReactNode
  description?: React.ReactNode
  events: RunTraceEvent[]
}

const statusLabel = {
  queued: "Queued",
  running: "Running",
  complete: "Complete",
  blocked: "Blocked",
  warning: "Warning",
  error: "Error",
} satisfies Record<RunTraceStatus, string>

const statusVariant = {
  queued: "outline",
  running: "secondary",
  complete: "default",
  blocked: "outline",
  warning: "secondary",
  error: "destructive",
} satisfies Record<
  RunTraceStatus,
  React.ComponentProps<typeof Badge>["variant"]
>

const statusIcon = {
  queued: Clock01Icon,
  running: Activity01Icon,
  complete: Tick01Icon,
  blocked: Alert01Icon,
  warning: Alert01Icon,
  error: Alert01Icon,
} satisfies Record<RunTraceStatus, typeof Activity01Icon>

function RunTrace({
  title,
  description,
  events,
  className,
  ...props
}: RunTraceProps) {
  return (
    <section
      data-slot="run-trace"
      className={cn(
        "rounded-lg border border-border bg-background text-sm",
        className
      )}
      {...props}
    >
      <div className="border-b border-border/70 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <h3 className="min-w-0 text-sm font-medium text-foreground">
            {title}
          </h3>
          <Badge variant="outline">{events.length} events</Badge>
        </div>
        {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="divide-y divide-border/70">
        {events.map((event, index) => {
          const Icon = statusIcon[event.status]
          const isLast = index === events.length - 1

          return (
            <details
              key={event.id}
              data-slot="run-trace-event"
              data-status={event.status}
              className="group/run-trace-event"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[24px_1fr] gap-3 px-3 py-3 outline-none transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-4 [&::-webkit-details-marker]:hidden">
                <span className="relative mt-0.5 flex size-6 items-center justify-center rounded-md border border-border/70 bg-muted/30 text-muted-foreground">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute top-6 left-1/2 h-[calc(100%+12px)] w-px -translate-x-1/2 bg-border/70"
                    />
                  )}
                  <HugeiconsIcon
                    icon={Icon}
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0">
                  <span className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="min-w-0 truncate font-medium text-foreground">
                      {event.title}
                    </span>
                    <Badge variant={statusVariant[event.status]}>
                      {statusLabel[event.status]}
                    </Badge>
                  </span>
                  {event.description && (
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {event.description}
                    </span>
                  )}
                  {(event.source || event.timestamp || event.duration) && (
                    <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      {event.source && <span>{event.source}</span>}
                      {event.source && (event.timestamp || event.duration) && (
                        <span aria-hidden="true">/</span>
                      )}
                      {event.timestamp && <span>{event.timestamp}</span>}
                      {event.timestamp && event.duration && (
                        <span aria-hidden="true">/</span>
                      )}
                      {event.duration && (
                        <span className="opacity-100 sm:opacity-0 sm:transition-opacity sm:group-focus-within/run-trace-event:opacity-100 sm:group-hover/run-trace-event:opacity-100">
                          {event.duration}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </summary>
              {event.detail && (
                <div className="px-12 pb-3 text-xs leading-5 text-muted-foreground">
                  <div className="border-l border-border/70 pl-3">
                    {event.detail}
                  </div>
                </div>
              )}
            </details>
          )
        })}
      </div>
    </section>
  )
}

export { RunTrace, type RunTraceEvent, type RunTraceProps, type RunTraceStatus }
