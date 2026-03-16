# ThreadTimeline v2: Icon-Triggered Navigation Panel

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

Same compound component pattern as v1. The API is nearly identical -- only the rendering changes.

### Usage

```tsx
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
```

### ThreadTimeline Props

Same as v1:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `threshold` | `number` | `6` | Minimum turn count before clock icon appears |
| `visible` | `boolean` | - | Controlled visibility of the clock icon |
| `onVisibleChange` | `(visible: boolean) => void` | - | Called when visibility changes |
| `onLineClick` | `(turnId: string) => void` | - | Called when a card is clicked. Consumer handles scroll. |
| `className` | `string` | - | Additional classes on the trigger button |
| `children` | `ReactNode` | required | `ThreadTimelineLine` elements |

### ThreadTimelineLine Props

Same as v1:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `turnId` | `string` | required | Unique turn identifier |
| `children` | `ReactNode` | required | User message text shown on the card |
| `timestamp` | `string` | - | Relative time shown on the card |
| `active` | `boolean` | `false` | Marks the current/latest turn (subtle indicator) |

## Visual Specifications

### Clock Icon Button

- Position: top-right corner of the conversation area, `position: sticky` so it stays visible on scroll
- Size: `32x32px` icon button
- Icon: clock icon from `@hugeicons/core-free-icons`
- Style: `bg-transparent`, `text-muted-foreground`, `hover:text-foreground`
- Transition: fade in when threshold is met (same entrance logic as v1)
- When panel is open, icon changes to a close/X icon or stays as clock with active state
- `data-slot="thread-timeline-trigger"`

### Overlay Backdrop

- Covers the conversation area only (not the sidebar or composer)
- Background: `bg-background/80` with `backdrop-blur-sm` (subtle dim + blur)
- Click to close the panel
- `data-slot="thread-timeline-overlay"`

### Message Cards

- Layout: stacked vertically on the right side of the conversation area, right-aligned
- Width: `max-w-[75%]` (matches user message bubbles in the conversation)
- Style: same as user message bubbles -- `bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm`
- Timestamp: `text-xs text-primary-foreground/60` below or inline with message text
- Active card: subtle ring or slightly different opacity to mark the current turn
- Hover: `hover:opacity-90` or subtle scale
- Cursor: `cursor-pointer`
- Gap between cards: `12px`
- Vertical alignment: centered in the overlay
- `data-slot="thread-timeline-card"`

### Entrance Animation

Cards stagger in from right to left:
- Each card: `translateX(16px) opacity-0` to `translateX(0) opacity-1`
- Duration: `150ms` per card
- Stagger: `50ms` between cards
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (same as existing `demo-slide-in`)

### Exit Animation

- All cards fade out together (no stagger on exit): `opacity-1` to `opacity-0`, `100ms`
- Backdrop fades out: `100ms`

## Interaction States

### 1. Hidden

Fewer than `threshold` children. Nothing renders.

### 2. Clock Icon Visible

Threshold met. Clock icon appears in top-right of conversation area (fade in, same as v1 entrance). Panel is closed.

### 3. Panel Open

Clock icon clicked. Conversation dims behind overlay. Cards stagger in on the right side showing user messages. Keyboard focus moves to the first card.

### 4. Card Clicked

- `onLineClick(turnId)` fires
- Panel closes (exit animation)
- Consumer scrolls conversation to the target turn
- Optional: consumer highlights the turn briefly (handled by consumer, not this component)

### 5. Panel Closed (without navigation)

- Click on backdrop or clock icon
- Panel closes (exit animation)
- Focus returns to clock icon

## Keyboard Navigation

- **Tab** to clock icon button
- **Enter/Space** on clock icon: opens panel, focus moves to first card
- **ArrowDown/ArrowUp**: move between cards (stop at boundaries)
- **Enter/Space** on card: fires `onLineClick`, closes panel
- **Escape**: closes panel, returns focus to clock icon

## What Changes from v1

| Aspect | v1 | v2 |
|--------|----|----|
| Visibility | Always-visible gutter | Click-to-open overlay |
| Rendering | Abstract lines with proximity scaling | User message cards |
| Interaction | Hover = tooltip, click = scroll | Click icon = open panel, click card = scroll |
| Dependencies | `motion/react` (springs, transforms) | CSS animations only (stagger via animation-delay) |
| Layout impact | Takes 32px width beside conversation | No width impact, overlays on top |

## What Stays the Same

- Compound component pattern with React Context
- `ThreadTimelineContext` with `onLineClick`, open/close state
- `data-slot` attributes
- Controlled/uncontrolled visibility via `visible`/`onVisibleChange`
- `threshold` logic
- `turnId`, `timestamp`, `active`, `children` props on `ThreadTimelineLine`
- Keyboard navigation pattern (arrow keys, Enter, Escape)
- Touch behavior (tap card = navigate, no hover needed)

## File Changes

- Modify: `src/components/ui/thread-timeline.tsx` -- rewrite rendering, remove proximity/springs, add overlay/cards
- No new files needed
- `src/hooks/use-proximity.ts` stays as a reusable utility (not deleted)
- CSS variables `--thread-timeline-tooltip-shadow` can be removed from `composer.css` (tooltip is gone)

## Accessibility

- Clock icon button: `aria-label="Open thread navigation"`, `aria-expanded` reflects panel state
- Overlay: `role="dialog"`, `aria-label="Thread navigation"`, `aria-modal="true"`
- Cards: `role="button"`, `aria-label` from children text
- Focus trap inside the overlay when open
- Escape closes and returns focus to trigger
