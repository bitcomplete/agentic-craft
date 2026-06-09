# Design Engineering Audit (emil-design-engineering skill)

Date: 2026-06-09
Method: the codebase and runtime were audited against every rule in
`.agents/skills/emil-design-engineering/` (animations, ui-polish,
forms-controls, touch-accessibility, component-design, performance,
design-rules). Code checks via targeted greps per rule; runtime checks via
headless Chromium (CLS per route, focus probing, tap-target measurement,
theme-switch behavior).

## Scorecard

| Category                           | Verdict           |
| ---------------------------------- | ----------------- |
| Animations                         | Pass with nits    |
| UI Polish                          | Strong pass       |
| Forms & Controls                   | Strong pass       |
| Touch & Accessibility              | Two real findings |
| Component Design                   | Strong pass       |
| Performance                        | Strong pass       |
| Design Rules (copy/IA/interaction) | Pass with nits    |

The codebase is unusually aligned with this skill already — most of Emil's
rules are implemented verbatim (often with the exact technique the skill
recommends). The findings below are the gaps.

## Findings

### F1 — `data-compact-touch` opts out of the 44px touch floor (touch-accessibility)

`button.tsx` enforces `[@media(pointer:coarse)]:min-h-11 min-w-11` (44px) —
exactly the skill's rule — but `data-compact-touch` disables it, and it is
set on the most frequently used controls: every pattern-demo control chip
(24–28px on touch), composer island toggles (~24px), the composer menu
trigger (32px), and the theme switcher. The skill's own remedy applies:
keep the visual size, extend the hit area with a pseudo-element
(`after:absolute after:-inset-*`), as was already done for citation markers.

### F2 — Composer menu trigger has no visible keyboard focus (design-rules: Interaction 2)

`src/components/ui/composer-toolbar.tsx:56`: the dropdown trigger sets
`outline-none` with only hover styles — keyboard focus is invisible.
Needs `focus-visible:ring-3 focus-visible:ring-ring/50` (the app's standard
ring) or equivalent. Its resting color is also `text-muted-foreground/60`
(sub-AA).

### F3 — Section anchors scroll under the sticky mobile header (ui-polish: Scroll Margins)

`PatternSection` has `scroll-mt-20`, but the pattern pages build their
sections with raw `<section className="page-section">` and no scroll margin.
On mobile the header is sticky (48px), so sidebar subnav jumps hide the
section heading underneath it. Add `scroll-mt` to `.page-section` (or the
`[id]` rule the skill suggests).

### Nits

- **Entrance easing**: the demo entrance classes (`*-fade-in`, `*-slide-in`)
  use `ease` rather than `ease-out` (animations.md easing blueprint:
  entrances should decelerate in). Durations are all within guidelines.
- **Literal `...` instead of `…`** in two copy strings
  (`templates-content.tsx:157` placeholder, `demo-content.tsx:32`).
- **`spellcheck` not disabled** on the composer textarea (forms-controls
  recommends disabling for chat-style inputs; `autoComplete` is off).
- **45 `dark:` utility overrides** vs the skill's "flip variables, don't
  hand-patch dark mode" rule — nearly all inherited from stock shadcn
  components, so acceptable, but new code should prefer token flips.
- **`env(safe-area-inset-*)` unused** — no fixed bottom bars today, so this
  is dormant; relevant if the composer ever becomes sticky on mobile.
- **Disabled state via `opacity-50`** (design-rules Color 14 prefers a
  dedicated muted token) — stock shadcn convention, low value to change.
- **Sidebar nav is Title Case** ("Trust & Control Plane"); design-rules
  Copywriting 5 prefers sentence case. Labels are short; judgement call.
- **Memory empty state** explains why it's empty but offers no action
  (design-rules IA 5). Demo context makes this minor.

## What already matches the skill (verified, not assumed)

- **No `transition: all`** anywhere; the global base sets specific
  properties (`color, background-color, border-color, opacity`).
- **Theme switching disables transitions** via
  `html[data-disable-transitions]` + double-rAF restore — the skill's exact
  recipe (`theme-provider.tsx:71`).
- **Reduced motion**: global `prefers-reduced-motion` block covers all 36
  demo animation classes, plus `motion-reduce:` variants in primitives,
  `scroll-behavior: auto`, and JS `matchMedia` checks before smooth scroll.
- **CLS = 0.0000** on 10 of 11 routes (home: 0.004, caused by the streaming
  demo content itself). Skeletons, fixed-height media slots, and
  `tabular-nums` on tables and counters do their job.
- **Inputs are 16px on mobile** (`text-base md:text-sm`) — the iOS
  anti-zoom pattern, verbatim.
- **Composer submits on Enter** (Shift+Enter for newline), `autoComplete`
  off, decorations absolutely positioned over the field.
- **44px touch floor in the Button primitive** via
  `[@media(pointer:coarse)]` (see F1 for the opt-outs), plus
  `touch-action: manipulation` and transparent tap highlight globally.
- **Focus rings**: consistent grey `ring-ring/50` on every control tested;
  skip-link present; icon buttons have action-oriented `aria-label`s
  ("Use dark theme", "Inspect source 2: Issue Triage Policy").
- **Only transform/opacity animated** — no keyframe touches
  height/width/margin/padding; no `blur()` filters; no infinite loops
  (shimmer runs 2 iterations, pulses 3); the one `setInterval` demo pauses
  on `visibilitychange`.
- **Typography**: `-webkit-font-smoothing: antialiased`,
  `text-wrap: balance` on all headings, `text-wrap: pretty` on paragraphs,
  `font-variant-numeric: tabular-nums` on tables, `font-synthesis: none`,
  next/font subsetting + preload, no font-weight changes on hover.
- **No custom page scrollbars**; no arbitrary z-index (fixed shadcn scale,
  `isolation` used in menus).
- **Component design**: compound components throughout
  (`ReferenceItem.*`, `PatternControls.*`, `ToolCall*`), `data-slot`
  convention, className escape hatches, controlled/uncontrolled support in
  `PatternControls.Root`, render-prop polymorphism on Button.
- **Exit easing**: sheet exit uses `ease-in`, entrance `ease-out` —
  matching design-rules Timing 5.
