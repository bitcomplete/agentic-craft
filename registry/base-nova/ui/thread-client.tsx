"use client"

import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type ThreadMessageRole = "assistant" | "user" | "system"

type ThreadToolCallState = "pending" | "running" | "done" | "error"

type ThreadStatusState =
  | "idle"
  | "thinking"
  | "working"
  | "streaming"
  | "complete"
  | "error"

type ThreadStreamChunk =
  | string
  | {
      content: string
      replace?: boolean
    }

type ThreadRootProps = React.ComponentProps<"section"> & {
  stream?: AsyncIterable<ThreadStreamChunk> | null
  streamRole?: ThreadMessageRole
  streamLabel?: string
  onStreamComplete?: (content: string) => void
  onStreamError?: (error: unknown) => void
}

type ThreadMessageProps = React.ComponentProps<"article"> & {
  role?: ThreadMessageRole
  name?: string
  timestamp?: React.ReactNode
  streaming?: boolean
}

type ThreadStatusProps = React.ComponentProps<"div"> & {
  state?: ThreadStatusState
  label: React.ReactNode
  detail?: React.ReactNode
}

type ThreadToolCallProps = Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode
  state?: ThreadToolCallState
  duration?: React.ReactNode
  summary?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function isReducedMotion() {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function streamChunkText(chunk: ThreadStreamChunk) {
  return typeof chunk === "string" ? chunk : chunk.content
}

function streamChunkReplaces(chunk: ThreadStreamChunk) {
  return typeof chunk === "string" ? false : chunk.replace === true
}

function useControllableOpen({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean
  defaultOpen: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const controlled = open !== undefined
  const currentOpen = controlled ? open : uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!controlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [controlled, onOpenChange]
  )

  return [currentOpen, setOpen] as const
}

function ThreadRoot({
  stream,
  streamRole = "assistant",
  streamLabel = "Agent",
  onStreamComplete,
  onStreamError,
  className,
  children,
  ...props
}: ThreadRootProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const [anchored, setAnchored] = React.useState(true)
  const [streamText, setStreamText] = React.useState("")
  const [streaming, setStreaming] = React.useState(false)
  const onStreamCompleteRef = React.useRef(onStreamComplete)
  const onStreamErrorRef = React.useRef(onStreamError)

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior) => {
    sentinelRef.current?.scrollIntoView?.({ block: "end", behavior })
  }, [])

  React.useEffect(() => {
    onStreamCompleteRef.current = onStreamComplete
  }, [onStreamComplete])

  React.useEffect(() => {
    onStreamErrorRef.current = onStreamError
  }, [onStreamError])

  React.useEffect(() => {
    const viewport = viewportRef.current
    const sentinel = sentinelRef.current

    if (!viewport || !sentinel || !("IntersectionObserver" in window)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setAnchored(entry?.isIntersecting ?? true)
      },
      {
        root: viewport,
        threshold: 1,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  React.useEffect(() => {
    if (!anchored) {
      return
    }

    scrollToBottom("auto")
  }, [anchored, children, scrollToBottom, streamText])

  React.useEffect(() => {
    if (!stream) {
      setStreaming(false)
      setStreamText("")
      return
    }

    let cancelled = false
    let nextText = ""
    const currentStream = stream

    setStreaming(true)
    setStreamText("")

    async function readStream() {
      try {
        for await (const chunk of currentStream) {
          if (cancelled) {
            return
          }

          nextText = streamChunkReplaces(chunk)
            ? streamChunkText(chunk)
            : nextText + streamChunkText(chunk)
          setStreamText(nextText)
        }

        if (!cancelled) {
          onStreamCompleteRef.current?.(nextText)
        }
      } catch (error) {
        if (!cancelled) {
          onStreamErrorRef.current?.(error)
        }
      } finally {
        if (!cancelled) {
          setStreaming(false)
        }
      }
    }

    void readStream()

    return () => {
      cancelled = true
    }
  }, [stream])

  return (
    <section
      data-slot="thread"
      className={cn(
        "relative isolate flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground",
        className
      )}
      {...props}
    >
      <div
        ref={viewportRef}
        data-slot="thread-viewport"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-3 sm:px-4"
      >
        {children}
        {streamText ? (
          <ThreadMessage
            role={streamRole}
            name={streamLabel}
            streaming={streaming}
          >
            {streamText}
          </ThreadMessage>
        ) : null}
        <div
          ref={sentinelRef}
          data-slot="thread-bottom-sentinel"
          aria-hidden="true"
          className="h-px"
        />
      </div>
      {!anchored ? (
        <button
          type="button"
          data-slot="thread-scroll-bottom"
          className="absolute right-3 bottom-3 z-10 inline-flex min-h-9 items-center rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground shadow-sm transition-[background-color,box-shadow,transform] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted"
          onClick={() => scrollToBottom(isReducedMotion() ? "auto" : "smooth")}
        >
          Scroll to bottom
        </button>
      ) : null}
    </section>
  )
}

function ThreadMessage({
  role = "assistant",
  name,
  timestamp,
  streaming,
  className,
  children,
  ...props
}: ThreadMessageProps) {
  const resolvedName =
    name ?? (role === "user" ? "You" : role === "system" ? "System" : "Agent")

  return (
    <article
      data-slot="thread-message"
      data-role={role}
      className={cn(
        "flex min-w-0 gap-3",
        role === "user" && "justify-end",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "mt-6 hidden size-7 shrink-0 rounded-md border border-border bg-muted sm:block",
          role === "user" && "order-2 bg-primary"
        )}
      />
      <div
        className={cn(
          "max-w-[min(100%,42rem)] min-w-0",
          role === "user" && "text-right"
        )}
      >
        <div
          data-slot="thread-message-meta"
          className={cn(
            "mb-1.5 flex items-center gap-2 text-xs text-muted-foreground",
            role === "user" && "justify-end"
          )}
        >
          <span className="font-medium text-foreground">{resolvedName}</span>
          {streaming ? (
            <span aria-label="Streaming" className="text-muted-foreground">
              streaming
            </span>
          ) : null}
          {timestamp ? (
            <span className="text-muted-foreground tabular-nums">
              {timestamp}
            </span>
          ) : null}
        </div>
        <div
          data-slot="thread-message-content"
          className={cn(
            "text-sm leading-6 text-foreground",
            role === "user" &&
              "rounded-lg bg-primary px-3 py-2 text-left text-primary-foreground",
            role === "system" &&
              "rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-muted-foreground"
          )}
        >
          {children}
        </div>
      </div>
    </article>
  )
}

const statusLabels: Record<ThreadStatusState, string> = {
  idle: "Idle",
  thinking: "Thinking",
  working: "Working",
  streaming: "Streaming",
  complete: "Complete",
  error: "Error",
}

function ThreadStatus({
  state = "idle",
  label,
  detail,
  className,
  ...props
}: ThreadStatusProps) {
  const active =
    state === "thinking" || state === "working" || state === "streaming"

  return (
    <div
      data-slot="thread-status"
      data-state={state}
      role="status"
      aria-label={statusLabels[state]}
      className={cn(
        "sticky top-0 z-10 -mx-3 bg-background/95 px-3 pt-3 pb-2 backdrop-blur sm:-mx-4 sm:px-4",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-foreground/70",
          active &&
            "animate-[thread-status-pulse_2.6s_cubic-bezier(0.45,0,0.55,1)_infinite] motion-reduce:animate-none"
        )}
      />
      <div className="flex min-h-8 items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-1.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {label}
          </p>
          {detail ? (
            <p className="truncate text-xs text-muted-foreground">{detail}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground",
            state === "error" && "text-destructive"
          )}
        >
          {statusLabels[state]}
        </span>
      </div>
    </div>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-150",
        open && "rotate-90"
      )}
    >
      <path d="m6 4 4 4-4 4" />
    </svg>
  )
}

function ToolCallIcon({ state }: { state: ThreadToolCallState }) {
  if (state === "done") {
    return (
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="1.5" y="1.5" width="13" height="13" rx="3" />
        <path d="M5 8.2l2.1 2.1L11 6.2" />
      </svg>
    )
  }

  if (state === "error") {
    return (
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 1.8 1.6 13h12.8L8 1.8Z" />
        <path d="M8 6.4v3.1" />
        <path d="M8 11.4h.01" />
      </svg>
    )
  }

  if (state === "running") {
    return (
      <span
        aria-hidden="true"
        className="size-3.5 animate-spin rounded-full border border-foreground/70 border-t-transparent motion-reduce:animate-none"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="size-3 animate-[thread-pending-pulse_1.8s_cubic-bezier(0.45,0,0.55,1)_infinite] rounded-full border border-dashed border-muted-foreground motion-reduce:animate-none"
    />
  )
}

const toolCallStateLabel: Record<ThreadToolCallState, string> = {
  pending: "Pending",
  running: "Running",
  done: "Done",
  error: "Error",
}

function toolCallToggleLabel(title: React.ReactNode) {
  return typeof title === "string"
    ? `Toggle ${title} details`
    : "Toggle tool call details"
}

function ThreadToolCall({
  title,
  state = "pending",
  duration,
  summary,
  defaultOpen,
  open: openProp,
  onOpenChange,
  className,
  children,
  ...props
}: ThreadToolCallProps) {
  const hasDetails = Boolean(children)
  const [open, setOpen] = useControllableOpen({
    open: openProp,
    defaultOpen: defaultOpen ?? state === "error",
    onOpenChange,
  })

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        data-slot="thread-tool-call"
        data-state={state}
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-muted/20",
          className
        )}
        {...props}
      >
        <CollapsibleTrigger
          type="button"
          disabled={!hasDetails}
          render={(triggerProps) => (
            <button
              {...triggerProps}
              aria-expanded={hasDetails ? open : undefined}
              aria-label={hasDetails ? toolCallToggleLabel(title) : "Tool call"}
              className={cn(
                "flex min-h-11 w-full min-w-0 items-center gap-2.5 px-3 py-2 text-left transition-[background-color,box-shadow,transform] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
                hasDetails &&
                  "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted/60"
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center text-muted-foreground",
                  state === "done" && "text-foreground/70",
                  state === "error" && "text-destructive"
                )}
              >
                <ToolCallIcon state={state} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {title}
                </span>
                {summary ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    {summary}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "shrink-0 text-xs text-muted-foreground",
                  duration && "tabular-nums"
                )}
              >
                {duration ?? toolCallStateLabel[state]}
              </span>
              {hasDetails ? <ChevronIcon open={open} /> : null}
            </button>
          )}
        />
        {hasDetails ? (
          <CollapsibleContent className="animate-[thread-content-enter_180ms_cubic-bezier(0.22,1,0.36,1)] border-t border-border px-3 py-3 text-sm leading-6 text-muted-foreground motion-reduce:animate-none">
            {children}
          </CollapsibleContent>
        ) : null}
      </div>
    </Collapsible>
  )
}

function ThreadEmpty({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="thread-empty"
      className={cn(
        "grid min-h-40 place-items-center rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const Thread = Object.assign(ThreadRoot, {
  Message: ThreadMessage,
  Status: ThreadStatus,
  ToolCall: ThreadToolCall,
  Empty: ThreadEmpty,
})

export {
  Thread,
  ThreadRoot,
  ThreadMessage,
  ThreadStatus,
  ThreadToolCall,
  ThreadEmpty,
}
export type {
  ThreadMessageProps,
  ThreadMessageRole,
  ThreadRootProps,
  ThreadStatusProps,
  ThreadStatusState,
  ThreadStreamChunk,
  ThreadToolCallProps,
  ThreadToolCallState,
}
