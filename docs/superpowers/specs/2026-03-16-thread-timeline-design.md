# ThreadTimeline Component Design

A vertical timeline gutter for thread navigation. Thin vertical lines represent conversation turns. Proximity-based scaling (adapted from Devouring Details line-minimap) makes lines respond to cursor distance. Hover shows a tooltip preview of the user's message; click scrolls to the turn.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Position | Right margin gutter, 32px wide | Doesn't interfere with message content; consistent visible affordance |
| Line mapping | One line = one turn | A turn groups user message + agent response + tool calls. Fewer lines, simpler navigation |
| Hover behavior | Hybrid: hover = tooltip, click = scroll-to | Low-cost peek (tooltip) + high-intent jump (scroll). Two levels of interaction depth |
| Line interaction | Proximity scaling, uniform color | Lines scale + brighten based on cursor distance. No color coding -- proximity effect IS the information layer |
| Tooltip content | User message only + turn number/timestamp | Users remember their own questions. Agent responses belong in the full conversation, not the tooltip |
| Visibility | Threshold-based with slide-in entrance | Timeline appears after N turns (default 6). Slides in from right edge once, stays visible after that |

## Component API

Compound component pattern matching ToolTree/ToolCall architecture. Uses React Context to share state between root and children (same pattern as `ToolTreeContext` / `ToolCallContext`).

### Usage

```tsx
<ThreadTimeline threshold={6} onLineClick={handleScrollTo}>
  <ThreadTimelineLine turnId="turn-1">
    Can you review the Security Target?
  </ThreadTimelineLine>

  <ThreadTimelineLine turnId="turn-2" timestamp="2m ago">
    List the specific SFRs missing
  </ThreadTimelineLine>

  <ThreadTimelineLine turnId="turn-3" timestamp="just now" active>
    What about FDP_IFC.1?
  </ThreadTimelineLine>
</ThreadTimeline>

{/* Controlled visibility */}
<ThreadTimeline visible={showTimeline} onVisibleChange={setShowTimeline}>
  ...
</ThreadTimeline>
```

### ThreadTimelineContext

Shared via React Context between `ThreadTimeline` and `ThreadTimelineLine`:

```ts
interface ThreadTimelineContext {
  onLineClick: ((turnId: string) => void) | undefined
  cursorY: MotionValue<number>        // Cursor Y position within gutter
  closestTurnId: string | null        // Currently hovered turn
  setClosestTurnId: (id: string | null) => void
}
```

Access via `useThreadTimeline()` hook (throws if used outside provider, matching `useToolTree` / `useToolCall` pattern).

### ThreadTimeline Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `threshold` | `number` | `6` | Minimum turn count before timeline becomes visible (uncontrolled mode) |
| `visible` | `boolean` | - | Controlled visibility. Overrides threshold when provided |
| `onVisibleChange` | `(visible: boolean) => void` | - | Called when visibility changes (threshold crossed) |
| `onLineClick` | `(turnId: string) => void` | - | Called when a line is clicked. Consumer handles scrolling |
| `className` | `string` | - | Additional classes on the gutter container |
| `children` | `ReactNode` | required | `ThreadTimelineLine` elements |

### ThreadTimelineLine Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `turnId` | `string` | required | Unique turn identifier. Passed to `onLineClick` |
| `children` | `ReactNode` | required | User message text shown in hover tooltip |
| `timestamp` | `string` | - | Relative time shown in tooltip header (e.g., "2m ago") |
| `active` | `boolean` | `false` | Marks the current/latest turn. Shows dot indicator below line |

## Visual Specifications

### Gutter Container

- Width: `32px`
- Border-left: `1px solid var(--border)`
- Padding: `16px 0`
- Position: right edge of conversation area
- Flex direction: column, align items center
- Gap between lines: `4px`
- `data-slot="thread-timeline"`

### Line Segments

- Width at rest: `1.5px`
- Width at max scale: `3px` (scaleX driven by proximity)
- Height: derived from children text length. Formula: `clamp(Math.round(textLength * 0.4), 16, 48)` where textLength is the character count of the children string. This gives short questions (~40 chars) a 16px line and long messages (~120+ chars) the max 48px
- Color at rest: `var(--muted-foreground)` at 25% opacity
- Color at max proximity: `var(--muted-foreground)` at 70% opacity
- Border-radius: `1px`
- `data-slot="thread-timeline-line"`

### Active Turn Indicator

- Small dot below the active line
- Size: `4px` diameter
- Color: `var(--muted-foreground)` at 50% opacity
- Margin-top: `4px`

### Hover Tooltip

- Position: left of gutter, `8px` gap
- Max-width: `260px`
- Background: `var(--popover)`
- Border: `1px solid var(--border)`
- Border-radius: `var(--radius-lg)`
- Shadow: light mode `0 8px 32px rgba(0,0,0,0.12)`, dark mode `0 8px 32px rgba(0,0,0,0.5)`. Use a CSS variable `--thread-timeline-tooltip-shadow` defined alongside the existing `--tool-tree-connector` in `src/components/ui/composer.css` (where component-level CSS variables live)
- Padding: `10px 12px`
- Entrance: opacity 0 to 1, 120ms
- Content: turn number + timestamp (muted, 10px) above user message (13px)
- `data-slot="thread-timeline-tooltip"`

## Interaction States

### 1. Hidden

Fewer than `threshold` children. Component renders nothing.

### 2. Entrance

Threshold crossed. Gutter slides in from right edge:
- `translateX(32px)` to `translateX(0)`
- Duration: 200ms, ease-out
- One-time animation. After entrance, gutter stays visible permanently for the session.

### 3. Resting

Lines visible at rest state (1.5px, low opacity). No tooltip. Cursor is outside the gutter.

### 4. Hovering (Proximity Active)

Cursor is within the gutter area. Proximity effect activates:
- Lines scale (width) and brighten (opacity) based on distance from cursor Y position
- The nearest line gets maximum scale and brightness
- Tooltip appears next to the nearest line, showing the turn's user message
- Click on the nearest line fires `onLineClick(turnId)`

### 5. Click → Scroll-to

After clicking a line:
- `onLineClick(turnId)` fires
- Consumer scrolls conversation to the target turn
- Consumer can optionally highlight the turn (dimming others)
- Timeline remains visible and interactive

## Proximity System

Adapted from the Devouring Details line-minimap source code.

### Three-layer architecture

1. **Pure math** -- `transformScale(distance, initialValue, baseValue, intensity)`
2. **Hook** -- `useProximity(value, options)` wires cursor position to a spring-driven MotionValue
3. **Component** -- `ThreadTimelineLine` consumes the spring for rendering

### transformScale

```ts
const DISTANCE_LIMIT = 80; // px, radius of effect (wider than line-minimap's 48px)

function transformScale(
  distance: number,
  initialValue: number,
  baseValue: number,
  intensity: number
): number {
  if (Math.abs(distance) > DISTANCE_LIMIT) return initialValue;
  const normalizedDistance = initialValue - Math.abs(distance) / DISTANCE_LIMIT;
  const scaleFactor = normalizedDistance * normalizedDistance;
  return baseValue + intensity * scaleFactor;
}
```

### useProximity (adapted for Y-axis)

The original line-minimap hook operates on the X-axis with both mouse and scroll input channels. Our adaptation:
- Operates on Y-axis (vertical timeline)
- Mouse channel only (no scroll channel)
- Tracks cursor via `onPointerMove` on the gutter container
- Each line registers its center Y position via ref
- Distance = `cursorY - lineCenterY`

Spring config: `{ stiffness: 600, damping: 45 }` (from line-minimap -- fast, no overshoot).

### Driving multiple properties

Using `useTransform` (from the interpolation component pattern):
- Primary: proximity distance drives a normalized 0-1 value
- Derived: `scaleX` mapped from `[1, 2]` (rest to max)
- Derived: `opacity` mapped from `[0.25, 0.7]` (rest to max)

### Closest-line detection

The gutter tracks which line is closest to the cursor at all times:
- Used to position the tooltip adjacent to the correct line
- Used to determine which `turnId` fires on click
- Computed from the same distance calculation that drives proximity

## Entrance Animation

Spring config for gutter slide-in (from morph-surface reference):
- `{ stiffness: 550, damping: 45, mass: 0.7 }`
- Or simpler CSS: `transform: translateX(32px)` to `translateX(0)`, 200ms ease-out

The spring approach is better if we want the entrance to feel physical. The CSS approach is simpler and sufficient since this is a one-time animation.

Recommendation: CSS transition for entrance. Reserve springs for the proximity interaction where they matter.

## File Structure

```
src/
  components/
    ui/
      thread-timeline.tsx      # ThreadTimeline + ThreadTimelineLine components
  hooks/
    use-proximity.ts           # useProximity hook + transformScale utility
registry/
  base-nova/
    ui/
      thread-timeline.tsx      # Symlink to be created during implementation
```

### Registry entry

Add `thread-timeline` to the shadcn registry with dependency on `motion/react`.

## Dependencies

- `motion/react` -- **NEW dependency, must be installed**. Provides `useMotionValue`, `useSpring`, `useTransform`, `useMotionValueEvent`, `motion` components. Required for the proximity system.
- No other new external dependencies. `@base-ui/react` and `@hugeicons/react` are already in the project.

## Reference Code

Source implementations from Devouring Details component library used as reference:

| Source | What we adapted |
|--------|----------------|
| `line-minimap/source.tsx` | `useProximity` hook, `transformScale`, `useMouseX`, spring configs, line rendering pattern |
| `interpolation/source.tsx` | `useTransform` pattern for deriving scaleX + opacity from single proximity value |
| `tooltip-graph/source.tsx` | Tooltip spring positioning `{ damping: 50, stiffness: 550 }`, snap-to-boundary on leave |
| `blur-fade/source.tsx` | Optional: edge fading via mask-image gradient if timeline gets long |
| `morph-surface/source.tsx` | Entrance animation spring reference `{ stiffness: 550, damping: 45, mass: 0.7 }` |

## Edge Cases

- **0 turns**: Component renders nothing.
- **Fewer than threshold turns**: Component renders nothing.
- **Exactly threshold turns**: Entrance animation triggers.
- **Very long conversations (50+ turns)**: Lines compress by reducing the gap between them (from 4px down to 2px) and clamping individual line height lower (min 8px). No internal scroll -- the timeline must remain a 1:1 spatial map of the conversation. If lines would overflow the gutter height, apply blur-fade edges at top/bottom using the blur-fade pattern from Devouring Details.
- **Turn with no user message**: Show a fallback label like "System" or "Tool execution". The consumer controls children content.
- **Rapid cursor movement**: Springs handle this naturally -- high stiffness means fast response without jank.
- **Touch devices**: Proximity effect doesn't apply (no hover). Timeline lines remain visible as static indicators. Each line button has an expanded hit area via `::after` pseudo-element (minimum 44x44px tap target per WCAG, visually unchanged). Tap fires `onLineClick` directly. Tooltip does not appear on touch -- tap goes straight to scroll-to.

## Accessibility

### ARIA structure

- Gutter has `role="navigation"` and `aria-label="Thread timeline"`
- Each line is a `button` with `aria-label` derived from children (the user message text)
- Tooltip has `role="tooltip"` and a unique `id` (generated via `React.useId()` per line)
- Each line button has `aria-describedby` pointing to its tooltip's `id` (trigger describes tooltip, not the reverse)

### Tooltip implementation

Custom tooltip (not `@base-ui/react` tooltip primitive) because the tooltip position is spring-driven and tied to the proximity system's closest-line detection. The `@base-ui` tooltip uses its own positioner which would conflict with the proximity-driven Y positioning. The custom implementation handles:
- `id` generation via `React.useId()` per `ThreadTimelineLine`
- `aria-describedby` on the button, `role="tooltip"` + `id` on the popup
- Show on hover/focus, hide on blur/pointer-leave

### Keyboard navigation

- **Tab** into the gutter focuses the first line button
- **ArrowDown / ArrowUp** move focus between lines (stop at boundaries, no wrap)
- **Enter / Space** fires `onLineClick(turnId)` for the focused line
- **Escape** moves focus out of the gutter (back to the conversation area)
- Focus on a line shows the tooltip (same visual as hover)
- Tab order: the gutter is a single tab stop; arrow keys navigate within

### Reduced motion

`prefers-reduced-motion: reduce` is checked inside `useProximity` via `window.matchMedia`. When active:
- Springs are replaced with immediate `.set()` calls (no animation)
- Proximity scaling still works (lines respond to cursor distance) but transitions are instant
- Entrance animation uses `duration: 0` instead of 200ms
- This is handled at the hook level, not the component level -- components render identically
