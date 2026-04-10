"use client"

import * as React from "react"
import { motion, LayoutGroup, animate } from "motion/react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon } from "@hugeicons/core-free-icons"

/* ── Context ── */

interface ThreadTimelineContextValue {
  open: boolean
  selectedId: string | null
  onLineClick: ((turnId: string) => void) | undefined
}

const ThreadTimelineCtx =
  React.createContext<ThreadTimelineContextValue | null>(null)

function useThreadTimeline(): ThreadTimelineContextValue {
  const ctx = React.useContext(ThreadTimelineCtx)
  if (!ctx)
    throw new Error(
      "useThreadTimeline must be used within a <ThreadTimeline />",
    )
  return ctx
}

/* ── ThreadTimeline ── */

function ThreadTimeline({
  threshold = 6,
  visible: visibleProp,
  onVisibleChange,
  onLineClick,
  scrollContainerRef,
  className,
  children,
}: {
  threshold?: number
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  onLineClick?: (turnId: string) => void
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  className?: string
  children: React.ReactNode
}) {
  const allChildren = React.Children.toArray(children)
  const lines = allChildren.filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === ThreadTimelineLine,
  )
  const rest = allChildren.filter(
    (child) =>
      !(React.isValidElement(child) && child.type === ThreadTimelineLine),
  )
  const count = lines.length

  /* Trigger visibility */
  const [_visible, _setVisible] = React.useState(false)
  const isVisible = visibleProp ?? _visible

  const onVisibleChangeRef = React.useRef(onVisibleChange)
  onVisibleChangeRef.current = onVisibleChange

  React.useEffect(() => {
    if (visibleProp !== undefined) return
    if (count >= threshold && !_visible) {
      _setVisible(true)
      onVisibleChangeRef.current?.(true)
    }
  }, [count, threshold, visibleProp, _visible])

  /* Panel state */
  const [open, setOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const handleLineClick = React.useCallback(
    (turnId: string) => {
      setSelectedId(turnId)
      setOpen(false)

      // Animated scroll to the target message
      if (scrollContainerRef?.current) {
        const el = scrollContainerRef.current.querySelector(`[data-turn-id="${turnId}"]`) as HTMLElement | null
        if (el) {
          const container = scrollContainerRef.current
          const targetScrollTop = el.offsetTop - (container.clientHeight / 2) + (el.clientHeight / 2)
          const maxScroll = container.scrollHeight - container.clientHeight
          const clamped = Math.max(0, Math.min(targetScrollTop, maxScroll))

          animate(container.scrollTop, clamped, {
            type: "spring",
            bounce: 0,
            duration: 0.6,
            onUpdate: (value) => {
              container.scrollTop = value
            },
          })
        }
      }

      onLineClick?.(turnId)

      // Clear selection after animation completes
      setTimeout(() => setSelectedId(null), 600)
    },
    [onLineClick, scrollContainerRef],
  )

  const ctx = React.useMemo(
    () => ({ open, selectedId, onLineClick: handleLineClick }),
    [open, selectedId, handleLineClick],
  )

  if (!isVisible) return null

  return (
    <ThreadTimelineCtx.Provider value={ctx}>
      <LayoutGroup>
        <div data-slot="thread-timeline" className={cn("contents", className)}>
          {/* Trigger button */}
          <motion.button
            type="button"
            data-slot="thread-timeline-trigger"
            aria-label={open ? "Close thread navigation" : "Open thread navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "absolute top-4 right-4 z-50 flex size-10 items-center justify-center rounded-full border shadow-sm transition-colors",
              open
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted/50",
            )}
          >
            <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.5} />
          </motion.button>

          {/* Minimap overlay -- cards positioned bottom-right, same as user's prototype */}
          <div className="absolute bottom-0 right-8 flex flex-col items-end gap-2.5 z-40 pointer-events-none pb-32">
            {open &&
              lines.map((child) => (
                <React.Fragment key={child.key}>
                  {child}
                </React.Fragment>
              ))}
          </div>

          {rest}
        </div>
      </LayoutGroup>
    </ThreadTimelineCtx.Provider>
  )
}

/* ── ThreadTimelineLine ── */

function ThreadTimelineLine({
  turnId,
  className,
  children,
}: {
  turnId: string
  timestamp?: string
  active?: boolean
  className?: string
  children: React.ReactNode
}) {
  const { open, selectedId, onLineClick } = useThreadTimeline()

  if (!open) return null

  return (
    <motion.button
      layoutId={`thread-timeline-${turnId}`}
      data-slot="thread-timeline-card"
      onClick={() => onLineClick?.(turnId)}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "pointer-events-auto text-[15px] py-2.5 px-5 rounded-full shadow whitespace-nowrap transition-colors",
        selectedId === turnId
          ? "bg-foreground text-background"
          : "bg-muted text-foreground hover:bg-foreground hover:text-background",
        className,
      )}
      transition={{ type: "spring", bounce: 0, duration: 0.6 }}
    >
      {children}
    </motion.button>
  )
}

/* ── ThreadTimelineMessage -- wraps user messages in the chat with shared layoutId ── */

function ThreadTimelineMessage({
  turnId,
  className,
  children,
}: {
  turnId: string
  className?: string
  children: React.ReactNode
}) {
  const { open, selectedId } = useThreadTimeline()

  return (
    <div className="relative flex justify-end w-full" data-turn-id={turnId}>
      {/* Invisible placeholder to maintain layout when message morphs to minimap */}
      <div className="py-2.5 px-5 opacity-0 pointer-events-none whitespace-nowrap text-sm">
        {children}
      </div>

      {/* Actual animated message -- hidden when minimap is open (it morphs to the overlay) */}
      {!open && (
        <motion.div
          layoutId={`thread-timeline-${turnId}`}
          className={cn(
            "absolute top-0 right-0 text-sm py-2.5 px-5 rounded-full z-10 whitespace-nowrap transition-colors duration-500",
            selectedId === turnId
              ? "bg-foreground text-background"
              : "bg-primary text-primary-foreground",
            className,
          )}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

export {
  ThreadTimeline,
  ThreadTimelineLine,
  ThreadTimelineMessage,
  useThreadTimeline,
}
