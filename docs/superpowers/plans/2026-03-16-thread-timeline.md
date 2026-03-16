# ThreadTimeline Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vertical timeline gutter component with proximity-based line scaling for thread navigation.

**Architecture:** Compound component (ThreadTimeline + ThreadTimelineLine) sharing state via React Context. Proximity math adapted from Devouring Details line-minimap into a reusable `useProximity` hook. Springs from `motion/react` drive scaleX and opacity on each line based on cursor distance.

**Tech Stack:** React 19, TypeScript, motion/react (new dep), Tailwind v4, shadcn/ui base-nova registry

**Spec:** `docs/superpowers/specs/2026-03-16-thread-timeline-design.md`

**Reference code:** Devouring Details line-minimap source at `/tmp/line-minimap/source.tsx` and `/tmp/devouring-details/` (downloaded component library).

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/hooks/use-proximity.ts` | `transformScale` pure math + `useProximity` hook (Y-axis adapted from line-minimap). Reusable across any proximity-based interaction. |
| `src/components/ui/thread-timeline.tsx` | `ThreadTimeline` (root with context provider, visibility logic, gutter container, tooltip, pointer tracking) + `ThreadTimelineLine` (individual line with proximity-driven springs). |
| `src/components/ui/composer.css` | CSS variables: `--thread-timeline-tooltip-shadow` for light/dark mode. |
| `src/views/thread-timeline-content.tsx` | Demo view page for the component showcase. |
| `app/thread-timeline/page.tsx` | Next.js route for the demo view. |
| `registry/base-nova/ui/thread-timeline.tsx` | Symlink to `src/components/ui/thread-timeline.tsx`. |

---

## Chunk 1: Foundation

### Task 1: Install motion/react

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the dependency**

Run: `pnpm add motion`

The `motion/react` import path comes from the `motion` package (not `framer-motion`). This provides `useMotionValue`, `useSpring`, `useTransform`, `useMotionValueEvent`, and `motion` components.

- [ ] **Step 2: Verify the install**

Run: `pnpm ls motion`

Expected: `motion` listed with a version (11.x or later).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add motion/react dependency for proximity animations"
```

---

### Task 2: Create useProximity hook

**Files:**
- Create: `src/hooks/use-proximity.ts`

This is the reusable proximity system adapted from the Devouring Details line-minimap. It operates on the Y-axis (vertical timeline) instead of X-axis (horizontal minimap). No scroll channel -- mouse only.

- [ ] **Step 1: Create the hook file**

Write to `src/hooks/use-proximity.ts`:

```ts
"use client"

import { useMotionValueEvent, type MotionValue } from "motion/react"
import * as React from "react"

/** Radius of the proximity effect in pixels. Lines beyond this distance stay at rest. */
export const DISTANCE_LIMIT = 80

/**
 * Calculate a scaled value based on distance from a reference point.
 * Quadratic falloff -- elements closer to the reference scale more.
 *
 * Adapted from Devouring Details line-minimap `transformScale`.
 */
export function transformScale(
  distance: number,
  initialValue: number,
  baseValue: number,
  intensity: number,
): number {
  if (Math.abs(distance) > DISTANCE_LIMIT) return initialValue
  const normalizedDistance =
    initialValue - Math.abs(distance) / DISTANCE_LIMIT
  const scaleFactor = normalizedDistance * normalizedDistance
  return baseValue + intensity * scaleFactor
}

export interface UseProximityOptions {
  ref: React.RefObject<HTMLElement | null>
  baseValue: number
  cursorY: MotionValue<number>
  intensity?: number
  transformer?: typeof transformScale
}

/**
 * Drive a spring-animated MotionValue based on cursor proximity to an element.
 * Adapted from Devouring Details line-minimap `useProximity` (Y-axis, mouse only).
 *
 * @param value - The MotionValue to animate (e.g., scaleX)
 * @param options - Configuration for the proximity effect
 */
export function useProximity(
  value: MotionValue<number>,
  {
    ref,
    baseValue,
    cursorY,
    intensity = 1.5,
    transformer = transformScale,
  }: UseProximityOptions,
) {
  const initialValueRef = React.useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (initialValueRef.current === null) {
      initialValueRef.current = value.get()
    }
  }, [value])

  useMotionValueEvent(cursorY, "change", (latest) => {
    if (!ref.current || initialValueRef.current === null) return
    // cursor Y of 0 means pointer left the gutter
    if (latest === 0) {
      if (prefersReducedMotion.current) {
        value.jump(initialValueRef.current)
      } else {
        value.set(initialValueRef.current)
      }
      return
    }
    const rect = ref.current.getBoundingClientRect()
    const centerY = rect.top + rect.height / 2
    const distance = latest - centerY
    const target = transformer(
      distance,
      initialValueRef.current,
      baseValue,
      intensity,
    )
    if (prefersReducedMotion.current) {
      value.jump(target)
    } else {
      value.set(target)
    }
  })
}

/** Reactively track prefers-reduced-motion, updating on OS setting change. */
export function usePrefersReducedMotion() {
  const ref = React.useRef(false)
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    ref.current = mql.matches
    const onChange = () => { ref.current = mql.matches }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return ref
}

/** Spring config for proximity-driven values. Fast response, no overshoot. */
export const PROXIMITY_SPRING = { stiffness: 600, damping: 45 }
```

- [ ] **Step 2: Verify file compiles**

Run: `pnpm exec tsc --noEmit src/hooks/use-proximity.ts 2>&1 || echo "Check errors above"`

This might fail because of path aliases -- that's fine if the Next.js build succeeds. The important thing is no TypeScript syntax errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-proximity.ts
git commit -m "feat: add useProximity hook adapted from Devouring Details line-minimap"
```

---

### Task 3: Add CSS variables

**Files:**
- Modify: `src/components/ui/composer.css`

- [ ] **Step 1: Add thread-timeline tooltip shadow variables**

Append to the end of `src/components/ui/composer.css`, after the `.dark { --tool-tree-connector: ... }` block:

```css
/* ── ThreadTimeline ── */

:root {
  --thread-timeline-tooltip-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.dark {
  --thread-timeline-tooltip-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/composer.css
git commit -m "feat: add thread-timeline CSS variables for tooltip shadow"
```

---

## Chunk 2: Core Component

### Task 4: Create ThreadTimeline component

**Files:**
- Create: `src/components/ui/thread-timeline.tsx`

This is the main component file. It contains ThreadTimeline (root), ThreadTimelineLine (child), and the context. Follow the exact patterns from `tool-tree.tsx` and `tool-call.tsx`: context with `createContext`, `use*` hook that throws, compound composition, `data-slot` attributes.

- [ ] **Step 1: Write the component file**

Write to `src/components/ui/thread-timeline.tsx`:

```tsx
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
  if (React.isValidElement(children) && children.props.children) {
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
            ? "" // no transition for reduced motion
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
```

- [ ] **Step 2: Verify the component compiles**

Run: `pnpm build 2>&1 | tail -20`

Look for no TypeScript errors related to `thread-timeline.tsx`. Build warnings about unused variables are acceptable at this stage.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/thread-timeline.tsx
git commit -m "feat: add ThreadTimeline compound component with proximity scaling"
```

---

## Chunk 3: Demo & Registry

### Task 5: Create demo view

**Files:**
- Create: `src/views/thread-timeline-content.tsx`
- Create: `app/thread-timeline/page.tsx`
- Modify: `src/components/app-sidebar.tsx` (add nav link)

- [ ] **Step 1: Create the demo view component**

Write to `src/views/thread-timeline-content.tsx`:

```tsx
"use client"

import * as React from "react"
import {
  ThreadTimeline,
  ThreadTimelineLine,
} from "@/components/ui/thread-timeline"

const TURNS = [
  { id: "1", message: "Can you review the Security Target document for CC evaluation compliance?", time: "12m ago" },
  { id: "2", message: "List the specific SFRs that are missing from the mapping", time: "10m ago" },
  { id: "3", message: "What about FDP_IFC.1?", time: "8m ago" },
  { id: "4", message: "Can you check if ALC_FLR.2 covers the flaw remediation timeline requirement?", time: "5m ago" },
  { id: "5", message: "Summarize all findings", time: "3m ago" },
  { id: "6", message: "Export the findings as a compliance checklist", time: "1m ago" },
  { id: "7", message: "Are there any open questions for the evaluation facility?", time: "just now" },
]

export function ThreadTimelineContent() {
  const [activeTurn, setActiveTurn] = React.useState<string | null>(null)

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Navigation</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Thread Timeline
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A vertical timeline gutter for navigating conversation threads.
          Lines represent turns, scale on proximity, and show tooltip
          previews on hover.
        </p>
      </header>

      <section id="demo" className="page-section">
        <p className="section-label mb-3">Interactive</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Demo
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Hover over the timeline on the right to see proximity scaling
          and tooltip previews. Click a line to select that turn.
        </p>

        <div className="mt-10 rounded-lg border border-border/40 overflow-hidden">
          <div className="flex min-h-[500px]">
            {/* Conversation area */}
            <div className="flex-1 p-6 space-y-4">
              {TURNS.map((turn) => (
                <div key={turn.id}>
                  {/* User message */}
                  <div className="flex justify-end mb-3">
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-opacity duration-200",
                        activeTurn && activeTurn !== turn.id && "opacity-30",
                      )}
                    >
                      {turn.message}
                    </div>
                  </div>
                  {/* Agent response placeholder */}
                  <div className="flex justify-start">
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3 transition-opacity duration-200",
                        activeTurn && activeTurn !== turn.id && "opacity-30",
                      )}
                    >
                      <div className="h-2 w-48 rounded bg-muted-foreground/10" />
                      <div className="mt-2 h-2 w-32 rounded bg-muted-foreground/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline gutter */}
            <ThreadTimeline
              threshold={3}
              onLineClick={(turnId) => {
                setActiveTurn((prev) => prev === turnId ? null : turnId)
              }}
            >
              {TURNS.map((turn, i) => (
                <ThreadTimelineLine
                  key={turn.id}
                  turnId={turn.id}
                  timestamp={turn.time}
                  active={i === TURNS.length - 1}
                >
                  {turn.message}
                </ThreadTimelineLine>
              ))}
            </ThreadTimeline>
          </div>
        </div>

        {activeTurn && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selected turn: <span className="text-foreground font-medium">{activeTurn}</span>
            {" -- "}
            <button
              className="underline hover:text-foreground"
              onClick={() => setActiveTurn(null)}
            >
              Clear
            </button>
          </p>
        )}
      </section>

      {/* Spec table */}
      <section className="page-section">
        <p className="section-label mb-3">Specifications</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Visual Specs
        </h2>
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Gutter width</td>
              <td className="py-3 font-medium text-foreground">32px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Line width (rest)</td>
              <td className="py-3 font-medium text-foreground">1.5px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Line width (max scale)</td>
              <td className="py-3 font-medium text-foreground">3px (scaleX: 2)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Proximity distance limit</td>
              <td className="py-3 font-medium text-foreground">80px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Spring config</td>
              <td className="py-3 font-medium text-foreground">stiffness: 600, damping: 45</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Tooltip max-width</td>
              <td className="py-3 font-medium text-foreground">260px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Threshold</td>
              <td className="py-3 font-medium text-foreground">6 turns (default)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Entrance</td>
              <td className="py-3 font-medium text-foreground">translateX slide-in, 200ms ease-out</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  )
}

function cn(...inputs: (string | undefined | false)[]) {
  return inputs.filter(Boolean).join(" ")
}
```

- [ ] **Step 2: Create the Next.js route**

Write to `app/thread-timeline/page.tsx`:

```tsx
import { ThreadTimelineContent } from "@/views/thread-timeline-content"

export default function ThreadTimelinePage() {
  return <ThreadTimelineContent />
}
```

- [ ] **Step 3: Add sidebar nav link**

In `src/components/app-sidebar.tsx`, add `Timeline01Icon` (or `LeftToRightListBulletIcon` if Timeline01 is unavailable) to the imports from `@hugeicons/core-free-icons`. Then add a new entry to the `sections` array, after the last existing entry:

```ts
{
  title: "Thread Timeline",
  path: "/thread-timeline",
  icon: Timeline01Icon,
  subs: [],
},
```

This follows the exact pattern of the existing "Demo" entry (no sub-sections).

- [ ] **Step 4: Verify the page renders**

Run: `pnpm dev`

Open `http://localhost:3000/thread-timeline` in the browser. The page should render with:
- Header and description text
- A demo box with placeholder messages on the left
- The timeline gutter on the right (visible because threshold is 3 and we have 7 turns)
- Hovering over the gutter should show proximity scaling
- Hovering should show tooltip previews
- Clicking a line should highlight the corresponding turn

- [ ] **Step 5: Commit**

```bash
git add src/views/thread-timeline-content.tsx app/thread-timeline/page.tsx src/components/app-sidebar.tsx
git commit -m "feat: add ThreadTimeline demo view and page route"
```

---

### Task 6: Registry setup

**Files:**
- Create: `registry/base-nova/ui/thread-timeline.tsx` (symlink)

- [ ] **Step 1: Create the symlink**

Run: `ln -s ../../../src/components/ui/thread-timeline.tsx registry/base-nova/ui/thread-timeline.tsx`

- [ ] **Step 2: Verify symlink**

Run: `ls -la registry/base-nova/ui/thread-timeline.tsx`

Expected: symlink pointing to `../../../src/components/ui/thread-timeline.tsx`

- [ ] **Step 3: Build registry**

Run: `pnpm registry:build 2>&1 | tail -10`

Verify `thread-timeline` appears in the built registry output.

- [ ] **Step 4: Commit**

```bash
git add registry/base-nova/ui/thread-timeline.tsx
git commit -m "feat: add thread-timeline to shadcn registry"
```

---

## Chunk 4: Visual Verification & Polish

### Task 7: Visual verification in browser

**Files:** None (verification only)

This task is critical. The component must be verified visually before considering it done.

- [ ] **Step 1: Start dev server if not running**

Run: `pnpm dev`

- [ ] **Step 2: Open the demo page**

Open `http://localhost:3000/thread-timeline` in the browser.

- [ ] **Step 3: Verify interaction states**

Check each state from the spec:

1. **Entrance animation**: Refresh the page. The gutter should slide in from the right.
2. **Resting state**: Lines should be visible at low opacity (25%), thin (1.5px).
3. **Proximity hover**: Move cursor into the gutter. Lines near the cursor should scale up and brighten. The effect should be smooth and spring-driven.
4. **Tooltip**: The tooltip should appear next to the closest line, showing turn number + timestamp + user message.
5. **Click**: Clicking a line should select that turn (visible via the opacity dimming of other turns in the demo).
6. **Pointer leave**: Moving cursor out of the gutter should smoothly reset all lines to rest state.

- [ ] **Step 4: Verify dark mode**

Press "d" to toggle dark mode. Check:
- Tooltip shadow is appropriate for dark background
- Line opacity values read well against dark background
- Border-left on the gutter is visible

- [ ] **Step 5: Verify keyboard navigation**

1. Tab into the gutter -- first line should focus
2. ArrowDown/ArrowUp -- focus moves between lines, tooltip follows
3. Enter -- fires click action
4. Escape -- focus leaves gutter

- [ ] **Step 6: Fix any visual issues found**

If any issues are found during verification, fix them and re-verify. Common issues:
- Tooltip z-index conflicts -- bump z-index
- Tooltip clipping at container edge -- check overflow on parent
- Proximity effect too subtle/aggressive -- adjust `DISTANCE_LIMIT` or `intensity`
- Spring too bouncy/sluggish -- adjust `PROXIMITY_SPRING`

- [ ] **Step 7: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: visual polish for ThreadTimeline after browser verification"
```
