# ThreadTimeline v2: Icon-Triggered Navigation Panel

> Status: Historical archived design reference.
> This is a later historical ThreadTimeline iteration, not current canonical repo guidance unless the implementation explicitly matches it.

Replaces the always-visible proximity-scaled gutter with a click-to-open overlay panel. A clock icon triggers the panel. User message cards stack vertically over the dimmed conversation. Click a card to scroll to that turn and close the panel.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Trigger | Clock icon, top-right of conversation area | Always visible once threshold is met, discoverable without being intrusive |
| Panel style | Overlay on right side, conversation dims behind | Matches Vercel chat pattern -- messages stay in spatial context |
| Card content | User message text + optional timestamp | Users navigate by their own questions |
| Click behavior | Scroll to turn + close panel | Single clean action, no need to keep panel open |
| Close without navigating | Click dimmed area or click clock icon again | Two obvious escape hatches |

## Component API

Same compound component pattern as v1. The rendering changes but the consumer-facing API is nearly identical.

### Usage

```tsx
{/* The ThreadTimeline must be inside a positioned container (position: relative) */}
<div className="relative">
  <div className="overflow-y-auto" id="conversation">
    {/* conversation messages */}
  </div>
  <ThreadTimeline
    threshold={6}
    onLineClick={handleScrollTo}
  >
    <ThreadTimelineLine turnId="t1">
      Can you review the Security Target?
    </ThreadTimelineLine>
    <ThreadTimelineLine turnId="t2" timestamp="2m ago">
      List the specific SFRs missing
    </ThreadTimelineLine>
    <ThreadTimelineLine turnId="t3" timestamp="just now" active>
      What about FDP_IFC.1?
    </ThreadTimelineLine>
  </ThreadTimeline>
</div>
```

### ThreadTimelineContext (v2)

Replaces the v1 context. Proximity-specific fields (`cursorY`, `closestTurnId`, `setClosestTurnId`) are removed.

```ts
interface ThreadTimelineContextValue {
  onLineClick: ((turnId: string) => void) | undefined
  open: boolean
  onClose: () => void
}
```

Access via `useThreadTimeline()` hook (same throw pattern as v1).

### ThreadTimeline Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `threshold` | `number` | `6` | Minimum turn count before clock icon appears |
| `visible` | `boolean` | - | Controlled visibility of the clock icon (not the panel). Panel open/close is always internal state. |
| `onVisibleChange` | `(visible: boolean) => void` | - | Called when clock icon visibility changes (threshold crossed) |
| `onLineClick` | `(turnId: string) => void` | - | Called when a card is clicked. Consumer handles scroll. |
| `className` | `string` | - | Additional classes on the root wrapper (contains both trigger and overlay) |
| `children` | `ReactNode` | required | `ThreadTimelineLine` elements |

### ThreadTimelineLine Props

Unchanged from v1:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `turnId` | `string` | required | Unique turn identifier |
| `children` | `ReactNode` | required | User message text shown on the card |
| `timestamp` | `string` | - | Relative time shown on the card |
| `active` | `boolean` | `false` | Marks the current/latest turn (subtle ring indicator) |

## Visual Specifications

### Clock Icon Button

- Position: top-right corner of the conversation area, `position: sticky; top: 0` so it stays visible during scroll
- Size: `32x32px` icon button
- Icon: `Clock01Icon` from `@hugeicons/core-free-icons` when closed; `Cancel01Icon` (X) when open (matches `dialog.tsx` close pattern)
- Style: `bg-transparent`, `text-muted-foreground`, `hover:text-foreground`
- Transition: fade in when threshold is met
- `data-slot="thread-timeline-trigger"`

### Overlay Backdrop

- Position: `position: absolute; inset: 0` on the nearest positioned ancestor (the consumer's `position: relative` container). This scopes the overlay to the conversation area without covering the sidebar or composer.
- Background: `bg-background/80` with `backdrop-blur-sm`
- Click to close the panel
- `data-slot="thread-timeline-overlay"`

### Message Cards

- Layout: stacked vertically on the right side of the overlay, right-aligned
- Container: `position: absolute; inset: 0; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; padding: 24px; gap: 12px; overflow-y: auto`
- Width: `max-w-[75%]` per card (matches user message bubbles)
- Style: same as user message bubbles -- `bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm`
- Text truncation: `line-clamp-2` on message text. Full text is accessible via aria-label.
- Timestamp: `text-xs text-primary-foreground/60` block below message text
- Active card: `ring-2 ring-primary-foreground/30` to mark the current turn
- Hover: `hover:opacity-90`
- Cursor: `cursor-pointer`
- `data-slot="thread-timeline-card"`

### Entrance Animation

Cards stagger in from right:
- Each card: `translateX(16px) opacity-0` to `translateX(0) opacity-1`
- Duration: `150ms` per card
- Stagger: `50ms` between cards via `animation-delay: calc(var(--index) * 50ms)`
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Backdrop: `opacity-0` to `opacity-1`, `150ms`

### Exit Animation

- All cards fade out together: `opacity-0`, `100ms`
- Backdrop fades out: `100ms`

### Reduced Motion

`@media (prefers-reduced-motion: reduce)`: all animation durations set to `0ms`. Cards and backdrop appear/disappear instantly. No stagger.

### Long Conversations (30+ turns)

The card container has `overflow-y: auto`. If cards exceed the overlay height, the container scrolls. The active card (if set) is scrolled into view on open via `scrollIntoView({ block: "center" })`.

## Interaction States

### 1. Hidden

Fewer than `threshold` children. Nothing renders.

### 2. Clock Icon Visible

Threshold met. Clock icon appears in top-right of conversation area (fade in). Panel is closed.

### 3. Panel Open

Clock icon clicked. Overlay covers the conversation area. Cards stagger in on the right side showing user messages. Icon changes to X. Focus moves to the first card (or active card if set).

### 4. Card Clicked

- `onLineClick(turnId)` fires
- Panel closes (exit animation)
- Focus returns to clock icon
- Consumer scrolls conversation to the target turn

### 5. Panel Closed (without navigation)

- Click on backdrop or X icon
- Panel closes (exit animation)
- Focus returns to clock icon

## Keyboard Navigation

- **Tab** to clock icon button
- **Enter/Space** on clock icon: opens panel, focus moves to first card (or active card)
- **ArrowDown/ArrowUp**: move between cards (stop at boundaries, no wrap)
- **Enter/Space** on card: fires `onLineClick`, closes panel
- **Escape**: closes panel, returns focus to clock icon

## Focus Management

When the panel opens, focus moves to the first card (or the active card if one is marked). Arrow keys move between cards. When the panel closes, focus returns to the clock icon button.

No focus trap is needed. The overlay uses `role="listbox"` (not `role="dialog"`) since it is a selection list, not a modal dialog. Cards use `role="option"`. The clock icon uses `aria-haspopup="listbox"` and `aria-expanded`. This avoids the `aria-modal` conflict -- the sidebar and composer remain interactive while the panel is open.

## What Changes from v1

| Aspect | v1 | v2 |
|--------|----|----|
| Visibility | Always-visible gutter | Click-to-open overlay |
| Rendering | Abstract lines with proximity scaling | User message cards |
| Interaction | Hover = tooltip, click = scroll | Click icon = open panel, click card = scroll |
| Dependencies | `motion/react` (springs, transforms) | CSS animations only (stagger via animation-delay) |
| Layout impact | Takes 32px width beside conversation | No width impact, overlays on top |
| Context shape | `cursorY`, `closestTurnId`, `setClosestTurnId` | `open`, `onClose` |

## What Stays the Same

- Compound component pattern with React Context
- `data-slot` attributes
- Controlled/uncontrolled trigger visibility via `visible`/`onVisibleChange`
- `threshold` logic
- `turnId`, `timestamp`, `active`, `children` props on `ThreadTimelineLine`
- Keyboard navigation pattern (arrow keys, Enter, Escape)
- Touch behavior (tap card = navigate, no hover needed)

## File Changes

- Modify: `src/components/ui/thread-timeline.tsx` -- rewrite rendering, remove proximity/motion imports, add overlay/cards with CSS animations. Remove `motion/react` imports (the component no longer uses springs or motion values).
- Modify: `src/views/demo-content.tsx` -- update demo layout. The `ThreadTimeline` is no longer a flex sibling. Wrap the conversation area in a `position: relative` container and place `ThreadTimeline` inside it.
- Modify: `src/components/ui/composer.css` -- remove `--thread-timeline-tooltip-shadow` variables (tooltip is gone)
- Keep: `src/hooks/use-proximity.ts` -- stays as a reusable utility, not deleted
- Keep: `registry/base-nova/ui/thread-timeline.tsx` -- symlink still valid, but registry dependency on `motion/react` should be dropped if registry metadata specifies deps
