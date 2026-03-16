"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "motion/react"
import { cn } from "@/lib/utils"
import {
  transformScale,
  DISTANCE_LIMIT,
  PROXIMITY_SPRING,
  usePrefersReducedMotion,
} from "@/hooks/use-proximity"

/* ── Helpers ── */

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

function getLineHeight(text: string): number {
  return clamp(Math.round(text.length * 0.4), 16, 48)
}

function getChildrenText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(getChildrenText).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(children) && children.props.children) {
    return getChildrenText(children.props.children)
  }
  return ""
}

/* ── Turn index context (must be defined before ThreadTimelineLine) ── */

const TurnIndexCtx = React.createContext<number | null>(null)

/* ── Context ── */

interface ThreadTimelineContextValue {
  onLineClick: ((turnId: string) => void) | undefined
  cursorY: ReturnType<typeof useMotionValue<number>>
  closestTurnId: string | null
  setClosestTurnId: (id: string | null) => void
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

/* ── ThreadTimeline (root, internal) ── */

function ThreadTimelineInner({
  threshold = 6,
  visible: visibleProp,
  onVisibleChange,
  onLineClick,
  className,
  children,
  ...props
}: React.ComponentProps<"nav"> & {
  threshold?: number
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  onLineClick?: (turnId: string) => void
}) {
  const items = React.Children.toArray(children)
  const count = items.length

  /* Visibility: controlled or uncontrolled */
  const [_visible, _setVisible] = React.useState(false)
  const isVisible = visibleProp ?? _visible
  const [hasEntered, setHasEntered] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const onVisibleChangeRef = React.useRef(onVisibleChange)
  onVisibleChangeRef.current = onVisibleChange

  React.useEffect(() => {
    if (visibleProp !== undefined) return // controlled mode
    const shouldShow = count >= threshold
    if (shouldShow && !_visible) {
      _setVisible(true)
      onVisibleChangeRef.current?.(true)
    }
  }, [count, threshold, visibleProp, _visible])

  React.useEffect(() => {
    if (isVisible && !hasEntered) {
      if (prefersReducedMotion.current) {
        setHasEntered(true)
      } else {
        requestAnimationFrame(() => setHasEntered(true))
      }
    }
  }, [isVisible, hasEntered, prefersReducedMotion])

  /* Proximity cursor tracking */
  const cursorY = useMotionValue(0)
  const [closestTurnId, setClosestTurnId] = React.useState<string | null>(null)

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      cursorY.set(e.clientY)
    },
    [cursorY],
  )

  const handlePointerLeave = React.useCallback(() => {
    cursorY.set(0)
    setClosestTurnId(null)
  }, [cursorY])

  const handleClick = React.useCallback(() => {
    if (closestTurnId && onLineClick) {
      onLineClick(closestTurnId)
    }
  }, [closestTurnId, onLineClick])

  const ctx = React.useMemo(
    () => ({ onLineClick, cursorY, closestTurnId, setClosestTurnId }),
    [onLineClick, cursorY, closestTurnId],
  )

  if (!isVisible) return null

  return (
    <ThreadTimelineCtx.Provider value={ctx}>
      <nav
        data-slot="thread-timeline"
        role="navigation"
        aria-label="Thread timeline"
        className={cn(
          "flex w-8 flex-col items-center border-l border-border py-4 ease-out",
          prefersReducedMotion.current
            ? ""
            : "transition-transform duration-200",
          hasEntered ? "translate-x-0" : "translate-x-8",
          className,
        )}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{ gap: 4 }}
        {...props}
      >
        {children}
      </nav>
    </ThreadTimelineCtx.Provider>
  )
}

/* ── ThreadTimeline (public, wraps children with turn index) ── */

function ThreadTimeline({
  children,
  ...props
}: React.ComponentProps<typeof ThreadTimelineInner>) {
  return (
    <ThreadTimelineInner {...props}>
      {React.Children.map(children, (child, i) => (
        <TurnIndexCtx.Provider value={i + 1}>{child}</TurnIndexCtx.Provider>
      ))}
    </ThreadTimelineInner>
  )
}

/* ── ThreadTimelineLine ── */

function ThreadTimelineLine({
  turnId,
  timestamp,
  active = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  turnId: string
  timestamp?: string
  active?: boolean
}) {
  const { cursorY, closestTurnId, setClosestTurnId, onLineClick } =
    useThreadTimeline()
  const ref = React.useRef<HTMLDivElement>(null)
  const tooltipId = React.useId()
  const prefersReducedMotion = usePrefersReducedMotion()

  /*
   * Single proximity value drives both scaleX and opacity via useTransform.
   * One getBoundingClientRect call per line per pointermove (not three).
   * Adapted from the Devouring Details interpolation pattern.
   */
  const proximityRaw = useMotionValue(0)
  const proximity = useSpring(proximityRaw, PROXIMITY_SPRING)
  const scaleX = useTransform(proximity, [0, 1], [1, 2])
  const opacity = useTransform(proximity, [0, 1], [0.25, 0.7])

  useMotionValueEvent(cursorY, "change", (latest) => {
    if (!ref.current) return
    if (latest === 0) {
      if (prefersReducedMotion.current) proximityRaw.jump(0)
      else proximityRaw.set(0)
      return
    }
    const rect = ref.current.getBoundingClientRect()
    const centerY = rect.top + rect.height / 2
    const distance = latest - centerY
    const scaled = transformScale(distance, 0, 0, 1)
    if (prefersReducedMotion.current) proximityRaw.jump(scaled)
    else proximityRaw.set(scaled)

    // Closest-line detection from the same getBoundingClientRect
    if (Math.abs(distance) < DISTANCE_LIMIT / 2) {
      setClosestTurnId(turnId)
    }
  })

  const text = getChildrenText(children)
  const lineHeight = getLineHeight(text)
  const isClosest = closestTurnId === turnId
  const turnIndex = React.useContext(TurnIndexCtx)

  return (
    <div
      ref={ref}
      data-slot="thread-timeline-line"
      className={cn("relative flex flex-col items-center", className)}
      {...props}
    >
      {/* The line itself */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={text}
        aria-describedby={isClosest ? tooltipId : undefined}
        className="cursor-pointer rounded-sm bg-muted-foreground"
        style={{
          width: 1.5,
          height: lineHeight,
          scaleX,
          opacity,
          transformOrigin: "center",
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && onLineClick) {
            e.preventDefault()
            onLineClick(turnId)
          }
          if (e.key === "Escape") {
            ;(e.currentTarget as HTMLElement).blur()
          }
          if (e.key === "ArrowDown") {
            e.preventDefault()
            const next = e.currentTarget.parentElement?.nextElementSibling
            const btn = next?.querySelector<HTMLElement>("[role=button]")
            btn?.focus()
          }
          if (e.key === "ArrowUp") {
            e.preventDefault()
            const prev = e.currentTarget.parentElement?.previousElementSibling
            const btn = prev?.querySelector<HTMLElement>("[role=button]")
            btn?.focus()
          }
        }}
        onFocus={() => setClosestTurnId(turnId)}
        onBlur={() => setClosestTurnId(null)}
      />

      {/* Active turn dot */}
      {active && (
        <div className="mt-1 size-1 rounded-full bg-muted-foreground/50" />
      )}

      {/* Expanded touch target (44x44 minimum) */}
      <div
        className="pointer-events-auto absolute"
        style={{
          width: 44,
          height: 44,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        aria-hidden="true"
      />

      {/* Tooltip */}
      {isClosest && (
        <div
          id={tooltipId}
          role="tooltip"
          data-slot="thread-timeline-tooltip"
          className="pointer-events-none absolute right-full mr-2 z-50 max-w-[260px] rounded-lg border border-border bg-popover py-2.5 px-3 animate-in fade-in duration-[120ms]"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            boxShadow: "var(--thread-timeline-tooltip-shadow)",
          }}
        >
          <div className="text-[10px] text-muted-foreground/60 mb-1">
            {turnIndex !== null && <>Turn {turnIndex}</>}
            {turnIndex !== null && timestamp && <> &middot; </>}
            {timestamp}
          </div>
          <div className="text-[13px] text-foreground leading-snug line-clamp-3">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export {
  ThreadTimeline,
  ThreadTimelineLine,
  useThreadTimeline,
}
