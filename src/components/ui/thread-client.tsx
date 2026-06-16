"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type ThreadStreamSource =
  | AsyncIterable<ThreadStreamChunk>
  | (() => AsyncIterable<ThreadStreamChunk>)

type ThreadStreamRenderState = {
  role: ThreadMessageRole
  label?: string
  streaming: boolean
}

type ThreadRootProps = React.ComponentProps<"section"> & {
  stream?: ThreadStreamSource | null
  streamRole?: ThreadMessageRole
  streamLabel?: string
  scrollToBottomIcon?: React.ReactNode
  renderStream?: (
    content: string,
    state: ThreadStreamRenderState
  ) => React.ReactNode
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
  icon?: React.ReactNode
  disclosureIcon?:
    | React.ReactNode
    | ((state: { open: boolean }) => React.ReactNode)
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

function resolveStreamSource(stream: ThreadStreamSource) {
  return typeof stream === "function" ? stream() : stream
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
  streamLabel,
  scrollToBottomIcon,
  renderStream,
  onStreamComplete,
  onStreamError,
  className,
  children,
  ...props
}: ThreadRootProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const stickToBottomRef = React.useRef(true)
  const programmaticScrollRef = React.useRef(false)
  const programmaticScrollFrameRef = React.useRef<number | null>(null)
  const programmaticScrollTimerRef = React.useRef<number | null>(null)
  const [anchored, setAnchored] = React.useState(true)
  const [streamText, setStreamText] = React.useState("")
  const [streaming, setStreaming] = React.useState(false)
  const onStreamCompleteRef = React.useRef(onStreamComplete)
  const onStreamErrorRef = React.useRef(onStreamError)

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior) => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    programmaticScrollRef.current = true

    if (programmaticScrollFrameRef.current) {
      window.cancelAnimationFrame(programmaticScrollFrameRef.current)
      programmaticScrollFrameRef.current = null
    }

    if (programmaticScrollTimerRef.current) {
      window.clearTimeout(programmaticScrollTimerRef.current)
      programmaticScrollTimerRef.current = null
    }

    function performScroll() {
      const currentViewport = viewportRef.current

      if (!currentViewport) {
        programmaticScrollRef.current = false
        return
      }

      if (typeof currentViewport.scrollTo === "function") {
        currentViewport.scrollTo({
          top: currentViewport.scrollHeight,
          behavior,
        })
      } else {
        currentViewport.scrollTop = currentViewport.scrollHeight
      }

      programmaticScrollTimerRef.current = window.setTimeout(
        () => {
          programmaticScrollRef.current = false
          programmaticScrollTimerRef.current = null
        },
        behavior === "smooth" ? 360 : 120
      )
    }

    if (behavior === "auto") {
      programmaticScrollFrameRef.current = window.requestAnimationFrame(() => {
        programmaticScrollFrameRef.current = null
        performScroll()
      })
    } else {
      performScroll()
    }
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
        const nextAnchored = entry?.isIntersecting ?? true

        setAnchored(nextAnchored)

        if (nextAnchored) {
          stickToBottomRef.current = true
        }
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
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const currentViewport = viewport

    function handleScroll() {
      const distanceFromBottom =
        currentViewport.scrollHeight -
        currentViewport.scrollTop -
        currentViewport.clientHeight
      const nextAnchored = distanceFromBottom <= 8

      setAnchored(nextAnchored)

      if (!programmaticScrollRef.current) {
        stickToBottomRef.current = nextAnchored
      }
    }

    currentViewport.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      currentViewport.removeEventListener("scroll", handleScroll)
    }
  }, [])

  React.useEffect(() => {
    if (!stickToBottomRef.current) {
      return
    }

    scrollToBottom("auto")
  }, [scrollToBottom, streaming, streamText])

  React.useEffect(() => {
    return () => {
      if (programmaticScrollFrameRef.current) {
        window.cancelAnimationFrame(programmaticScrollFrameRef.current)
      }

      if (programmaticScrollTimerRef.current) {
        window.clearTimeout(programmaticScrollTimerRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!stream) {
      setStreaming(false)
      setStreamText("")
      return
    }

    let cancelled = false
    let nextText = ""
    const currentStream = resolveStreamSource(stream)

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
        "relative isolate flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div
        ref={viewportRef}
        data-slot="thread-viewport"
        tabIndex={0}
        aria-label="Thread messages"
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-4"
      >
        <div
          data-slot="thread-content"
          className="flex min-h-full flex-col gap-4"
        >
          {children}
          {streamText ? (
            renderStream ? (
              renderStream(streamText, {
                role: streamRole,
                label: streamLabel,
                streaming,
              })
            ) : (
              <ThreadMessage
                role={streamRole}
                name={streamLabel}
                streaming={streaming}
              >
                {streamText}
              </ThreadMessage>
            )
          ) : null}
          <div
            ref={sentinelRef}
            data-slot="thread-bottom-sentinel"
            aria-hidden="true"
            className="h-px"
          />
        </div>
      </div>
      {!anchored ? (
        <Button
          type="button"
          data-slot="thread-scroll-bottom"
          data-compact-touch
          size="icon-lg"
          variant="outline"
          aria-label="Scroll to bottom"
          onClick={() => {
            stickToBottomRef.current = true
            scrollToBottom(isReducedMotion() ? "auto" : "smooth")
          }}
        >
          {scrollToBottomIcon ?? (
            <span data-slot="thread-scroll-bottom-label" aria-hidden="true">
              End
            </span>
          )}
        </Button>
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
  const hasMeta = Boolean(name || timestamp || streaming)

  return (
    <article
      data-slot="thread-message"
      data-role={role}
      aria-live={streaming ? "polite" : undefined}
      aria-atomic={streaming ? "false" : undefined}
      className={cn(
        "flex min-w-0 gap-3",
        role === "user" && "justify-end",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "max-w-[min(100%,40rem)] min-w-0",
          role === "user" && "text-right"
        )}
      >
        {hasMeta ? (
          <div
            data-slot="thread-message-meta"
            className={cn(
              "mb-1.5 flex items-center gap-2 text-xs text-muted-foreground",
              role === "user" && "justify-end"
            )}
          >
            {name ? (
              <span className="font-medium text-foreground">{name}</span>
            ) : null}
            {streaming ? (
              <Badge
                data-slot="thread-message-streaming"
                variant="secondary"
                aria-label="Streaming"
              >
                streaming
              </Badge>
            ) : null}
            {timestamp ? (
              <span className="text-muted-foreground tabular-nums">
                {timestamp}
              </span>
            ) : null}
          </div>
        ) : null}
        <div
          data-slot="thread-message-content"
          className={cn(
            "text-sm leading-6 [overflow-wrap:anywhere] break-words text-foreground",
            role === "user" &&
              "rounded-md bg-muted px-3 py-2 text-left text-foreground",
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
  return (
    <div
      data-slot="thread-status"
      data-state={state}
      role="status"
      aria-label={statusLabels[state]}
      className={cn(
        "sticky top-0 z-10 -mx-3 border-b border-border bg-background/95 px-3 py-2 backdrop-blur sm:-mx-4 sm:px-4",
        className
      )}
      {...props}
    >
      <div className="flex min-h-8 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {label}
          </p>
          {detail ? (
            <p className="truncate text-xs text-muted-foreground">{detail}</p>
          ) : null}
        </div>
        <Badge
          data-slot="thread-status-badge"
          data-state={state}
          variant={state === "error" ? "destructive" : "outline"}
        >
          {statusLabels[state]}
        </Badge>
      </div>
    </div>
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

function ThreadToolCallHeader({
  title,
  state,
  duration,
  summary,
  icon,
  disclosureIcon,
  open,
  hasDetails,
}: {
  title: React.ReactNode
  state: ThreadToolCallState
  duration?: React.ReactNode
  summary?: React.ReactNode
  icon?: React.ReactNode
  disclosureIcon?: ThreadToolCallProps["disclosureIcon"]
  open: boolean
  hasDetails: boolean
}) {
  return (
    <>
      {icon ? <span data-slot="thread-tool-call-icon">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {summary ? (
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {summary}
          </span>
        ) : null}
      </span>
      <Badge
        data-slot="thread-tool-call-meta"
        variant={state === "error" ? "destructive" : "outline"}
      >
        {duration ?? toolCallStateLabel[state]}
      </Badge>
      {hasDetails && disclosureIcon ? (
        <span
          data-slot="thread-tool-call-disclosure"
          data-open={open ? "" : undefined}
        >
          {typeof disclosureIcon === "function"
            ? disclosureIcon({ open })
            : disclosureIcon}
        </span>
      ) : null}
    </>
  )
}

function ThreadToolCall({
  title,
  state = "pending",
  duration,
  summary,
  icon,
  disclosureIcon,
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

  if (!hasDetails) {
    return (
      <div
        data-slot="thread-tool-call"
        data-state={state}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-muted/20",
          className
        )}
        {...props}
      >
        <div className="flex min-h-11 w-full min-w-0 items-center gap-2.5 px-3 py-2 text-left">
          <ThreadToolCallHeader
            title={title}
            state={state}
            duration={duration}
            summary={summary}
            icon={icon}
            disclosureIcon={disclosureIcon}
            open={open}
            hasDetails={hasDetails}
          />
        </div>
      </div>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        data-slot="thread-tool-call"
        data-state={state}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-muted/20",
          className
        )}
        {...props}
      >
        <CollapsibleTrigger
          aria-label={toolCallToggleLabel(title)}
          render={
            <Button
              data-slot="thread-tool-call-trigger"
              type="button"
              variant="ghost"
              size="lg"
            />
          }
        >
          <ThreadToolCallHeader
            title={title}
            state={state}
            duration={duration}
            summary={summary}
            icon={icon}
            disclosureIcon={disclosureIcon}
            open={open}
            hasDetails={hasDetails}
          />
        </CollapsibleTrigger>
        {hasDetails ? (
          <CollapsibleContent className="border-t border-border bg-background/45 px-3 py-3 text-sm leading-6 text-muted-foreground">
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
  ThreadStreamRenderState,
  ThreadStreamSource,
  ThreadToolCallProps,
  ThreadToolCallState,
}
