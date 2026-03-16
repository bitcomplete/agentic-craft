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

Compound component pattern matching ToolTree/ToolCall architecture.

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
```

### ThreadTimeline Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `threshold` | `number` | `6` | Minimum turn count before timeline becomes visible |
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
- Height: proportional to turn content length (min 16px, max 48px)
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
- Shadow: `0 8px 32px rgba(0,0,0,0.3)`
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
      thread-timeline.tsx      # Symlink to src/components/ui/thread-timeline.tsx
```

### Registry entry

Add `thread-timeline` to the shadcn registry with dependency on `motion/react`.

## Dependencies

- `motion/react` -- `useMotionValue`, `useSpring`, `useTransform`, `useMotionValueEvent`, `motion` (already in project)
- No new external dependencies

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
- **Very long conversations (50+ turns)**: Lines compress vertically. Consider adding blur-fade edges at top/bottom. May need a max-height with internal scroll.
- **Turn with no user message**: Show a fallback label like "System" or "Tool execution". The consumer controls children content.
- **Rapid cursor movement**: Springs handle this naturally -- high stiffness means fast response without jank.
- **Touch devices**: Proximity effect doesn't apply (no hover). Timeline lines remain visible as static indicators. Tap fires `onLineClick` directly.

## Accessibility

- Gutter has `role="navigation"` and `aria-label="Thread timeline"`
- Each line is a `button` with `aria-label` derived from children (the user message text)
- Tooltip uses `role="tooltip"` with `aria-describedby` linking to the hovered line
- Focus navigation: Tab into the gutter focuses the first line, arrow keys navigate between lines
- Focus on a line shows the tooltip (same as hover behavior)
- `prefers-reduced-motion`: Disable proximity scaling, use instant opacity changes instead
