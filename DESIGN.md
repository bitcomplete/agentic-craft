---
name: Agentic Craft
description: Monochrome instrument panel with a serif voice — the reference system for agentic product UI
colors:
  ink: "oklch(0.145 0 0)"
  carbon: "oklch(0.205 0 0)"
  graphite: "oklch(0.556 0 0)"
  ash: "oklch(0.708 0 0)"
  hairline: "oklch(0.922 0 0)"
  fog: "oklch(0.97 0 0)"
  off-white: "oklch(0.985 0 0)"
  white: "oklch(1 0 0)"
  verified-green: "oklch(0.54 0.14 155)"
  caution-amber: "oklch(0.72 0.14 85)"
  signal-red: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "Source Serif 4, serif"
    fontSize: "2.25rem"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  agent-prose:
    fontFamily: "Source Serif 4, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
    letterSpacing: "-0.4px"
    fontVariation: '"opsz" 12'
  label:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  frame-sm: "1rem"
  frame: "1.5rem"
  demo-gap: "2.5rem"
  section: "3rem"
  section-lg: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  demo-frame:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "{spacing.frame-sm}"
---

# Design System: Agentic Craft

## 1. Overview

**Creative North Star: "The Galley Proof"**

A publication at final proofing: monochrome ink on white, every claim checked,
every numeral tabular, the author's voice set in serif against the apparatus
of sans-serif instrumentation. The interface is the proofing table — quiet,
flat, ruled with hairlines and dashed section breaks — and the agent's words
are the manuscript on it. Two voices, one page: the product speaks Albert
Sans; the agent speaks Source Serif 4. Nothing glows, nothing bounces,
nothing pretends.

This system explicitly rejects **AI-demo chrome** — glowing gradients,
sparkle icons, chat-bubble theater, spinners on tool calls, oversized rounded
everything (PRODUCT.md's confirmed anti-reference). It also rejects the
fabricated-demo tell: round numbers, identical timestamps, placeholder
company names. Demo data is part of the design and must read like real
telemetry. Density is editorial, not dashboard: one interactive specimen per
section, generous section rhythm (48–64px breaks with dashed rules), prose
capped at comfortable measures (section intros at 600px).

**Key Characteristics:**
- Achromatic surface; color exists only as state semantics
- Two-voice typography: sans for the interface, serif for the agent
- Flat depth — drawn with 1px lines and tone, never cast with shadows
- Calibrated motion: 150–250ms, exponential ease-outs, press floor at 0.95
- Honest affordances: every control works; nothing looks expandable that isn't

## 2. Colors

An achromatic instrument ramp from white to ink, with exactly three chromatic
voices reserved for state.

### Primary
- **Carbon** (`oklch(0.205 0 0)`): the action color. Primary buttons, active
  control chips, selected states, the filled end of progress. In dark mode it
  inverts to **Hairline** (`oklch(0.922 0 0)`) — the action color is always
  the pole of the ramp nearest the opposite theme.

### Neutral
- **Ink** (`oklch(0.145 0 0)`): body text and headings on light; the page
  background in dark mode.
- **Graphite** (`oklch(0.556 0 0)`): muted text — descriptions, spec-table
  prose, metadata. Always at full opacity for informational and interactive
  use; opacity reduction is reserved for decorative, aria-hidden, or disabled
  elements only (see Don'ts).
- **Ash** (`oklch(0.708 0 0)`): the focus-ring base and dark-mode muted text.
- **Hairline** (`oklch(0.922 0 0)`): every border, divider, and input stroke
  on light. Dark mode draws lines with `white/10` instead.
- **Fog** (`oklch(0.97 0 0)`): the only surface tint — hover washes,
  secondary buttons, muted panels. Dark equivalent `oklch(0.269 0 0)`.
- **Off-white** (`oklch(0.985 0 0)`) / **White** (`oklch(1 0 0)`): sidebar
  vs. content canvas; the one-step tonal seam that separates chrome from page.

### Tertiary (state voices — the only chroma in the system)
- **Verified Green** (`oklch(0.54 0.14 155)`, dark `oklch(0.72 0.15 155)`):
  confirmation dots, success flashes (used as 10–16% washes via
  `--success-highlight` / `--success-flash`).
- **Caution Amber** (`oklch(0.72 0.14 85)`, dark `oklch(0.82 0.14 85)`):
  medium-confidence and warning dots.
- **Signal Red** (`oklch(0.577 0.245 27.325)`, dark `oklch(0.704 0.191 22.216)`):
  destructive actions and error states, almost always as a 10–20% tinted
  background with full-strength text, not a filled red.

### Named Rules
**The Ink Rule.** The interface is achromatic. Chroma is semantics: if an
element is colored, it is making a claim about state (ok / caution /
destructive). Decorative color is prohibited — including on icons, which are
always monochrome line icons at strokeWidth 1.5.

**The Tokens-Only Rule.** No raw hex or oklch literal ever appears in a
component. Status colors come from `--status-ok`, `--status-warn`,
`--destructive`; everything else from the semantic ramp. Both themes are
defined at the token layer, never via per-component `dark:` overrides for new
work.

## 3. Typography

**Display Font:** Source Serif 4 (serif fallback)
**Body Font:** Albert Sans (sans-serif fallback)

**Character:** A working pairing, not a decorative one — the serif is a
voice, not a garnish. Albert Sans carries every part of the apparatus
(navigation, controls, labels, tables, data); Source Serif 4 appears in
exactly two roles: page-title display and the agent's own prose.

### Hierarchy
- **Display** (300, 2.25rem, 1.15): page titles only (`h1`). Light weight,
  slight negative tracking, `text-wrap: balance`.
- **Headline** (600, 1.25rem, tight tracking): section headings (`h2`).
- **Title** (500, 0.875rem): component and row titles inside demos.
- **Body** (400, 0.875rem, 1.43): all interface prose. Section intros are
  measure-capped at 600px (`mt-2 max-w-[600px]` after the heading).
- **Agent prose** (400, 16px/26px, -0.4px, `"opsz" 12`): the `.agent-prose`
  class — the single source of truth for serif agent text. Defined in
  `@layer components` so size utilities (`text-sm`) can override it where a
  compact variant is intentional.
- **Label** (500, 11px, +0.08em, uppercase): the `.section-label` category
  kicker. Tables set `font-variant-numeric: tabular-nums` always.

### Named Rules
**The Two Voices Rule.** Sans is the product speaking; serif is the agent
speaking. Never set UI chrome in serif, never set agent responses in sans,
and never introduce a third family.

**The One Kicker Rule.** The uppercase section-label is the system's single
eyebrow device, tied to the section-rhythm system. It earns its place by
being a navigation anchor (every label matches a sidebar subsection); do not
add second-tier eyebrows, numbered markers, or badge-kickers above headings.

## 4. Elevation

Flat; depth is drawn, not cast. Hierarchy comes from 1px hairline borders,
one-step tonal seams (white content / off-white sidebar; fog washes on
hover), spacing, and the dashed rule between page sections
(`1px dashed` at 72% border strength). Shadows are reserved for true
overlays — dropdown menus, dialogs, popovers — where physical detachment is
real, and even there they stay at the small ambient end of the shadcn scale
(`shadow-md` ceiling). Demo frames, cards, tables, and every at-rest surface
are shadowless.

### Named Rules
**The Hairline Rule.** If a boundary needs marking, draw a 1px line or step
the background one tone; never cast a shadow to separate two flat surfaces.
A `border-left` thicker than 1px as a colored accent is prohibited.

## 5. Components

Quiet instruments: controls read as calibrated equipment — small, precise,
honest about state, never decorative. Every interactive component ships all
of its states (default, hover, focus-visible, active, disabled), and the
focus treatment is universal.

### Buttons
- **Shape:** gently rounded (10px), 32px tall, `px-2.5`, text-sm/500.
- **Primary:** Carbon fill, off-white text.
- **Outline:** white fill, hairline border, fog wash on hover.
- **Ghost:** transparent, fog wash on hover; used for icon-only controls
  (with `aria-label`, mandatory).
- **Destructive:** Signal Red at 10% background with full-strength red text —
  never a solid red fill.
- **Hover / Focus / Active:** color transitions at 150ms; the house focus
  ring `focus-visible:ring-3 ring-ring/50` (3px, 50% Ash); `active:translate-y-px`
  press. On coarse pointers every control reaches a 44px hit target
  (`data-compact-touch` expands small instruments invisibly).

### Chips (pattern controls)
- **Style:** borderless toggle items, 28px min-height, text-xs Graphite.
- **State:** active = 4% ink wash + full-strength text via `aria-pressed`;
  exclusive groups animate their demo with a replay key on change.

### Cards / Containers (the demo frame)
- **Corner Style:** 10px.
- **Background:** white (transparent in dark), `border-border/40` hairline.
- **Shadow Strategy:** none — Hairline Rule.
- **Internal Padding:** 16px, stepping to 24px at `sm:` (`p-4 sm:p-6`).
- Demo frames sit exactly 40px (`mt-10`) below their section intro, sitewide.

### Inputs / Fields
- **Style:** hairline stroke, transparent background, 10px radius, 16px text
  on mobile (`text-base md:text-sm` — iOS zoom guard).
- **Focus:** border shifts to ring color + the house 3px ring at 50%.
- **Placeholder:** Plain `text-muted-foreground` — no opacity modifier (must
  meet the 4.5:1 placeholder contrast requirement).

### Navigation
- Off-white sidebar with hairline seam; collapsible sections; 11px uppercase
  labels for categories; active item = fog wash + ink text. Mobile: sheet
  that closes on every navigation tap. Keyboard shortcut `d` toggles theme.

### Signature: Observable Work / Tool Tree
The system's most distinctive components render agent activity as quiet rows:
monochrome status glyphs (dashed circle = queued, spinning = running),
tabular timestamps that reveal on hover (150ms fade), L-connectors for
parallel children, and `<details>` disclosure **only when content exists** —
a row with nothing to reveal renders as a plain div with no pointer, no
hover, no focus stop.

### Named Rules
**The Honest Affordance Rule.** Nothing may look interactive that isn't:
no cursor-pointer on dead rows, no hover treatment on non-links, no
expandable chrome on empty disclosures, and every demo control visibly
changes the demo it claims to control.

**The Calibrated Motion Rule.** State transitions run 150ms; reveals and
entrances 180–300ms on `cubic-bezier(0.22, 1, 0.36, 1)`; press feedback
never scales below 0.95; ambient loops (shimmer, pulse) are rare and finite.
Every animation has a `prefers-reduced-motion` alternative. The
highest-frequency action (send) gets no flourish at all.

## 6. Do's and Don'ts

### Do:
- **Do** keep icons monochrome, line-style, `strokeWidth={1.5}`, one meaning
  per glyph (robot = agent, brain = memory, waveform = activity feed).
- **Do** use plain `text-muted-foreground` (no opacity modifier) for all
  informational text and interactive glyphs; 4.5:1 body contrast is
  non-negotiable (WCAG 2.1 AA). Opacity-reduced muted-foreground is
  permitted only on decorative, `aria-hidden`, or disabled elements.
- **Do** write demo data as plausible telemetry: staggered durations, odd
  numbers (92,500 not 100,000), believable product names (Meridian, never
  ACME), section-style locations for path sources, "Page N" only for PDFs.
- **Do** use typographic quotes in all rendered copy (' " ").
- **Do** give every outcome a `role="status"` and move focus to it when the
  triggering control unmounts.
- **Do** end sections with a spec table **only** when it encodes non-visible
  contract (timings, keyboard behavior, state rules), and an italic callout
  **only** when it states a rule the demo cannot show — most sections need
  neither (≤2 callouts per page, hard cap).

### Don't:
- **Don't** ship AI-demo chrome: glowing gradients, sparkle icons,
  chat-bubble theater, spinners on tool calls, success/failure icons on tool
  calls, oversized rounded everything (PRODUCT.md anti-reference, verbatim).
- **Don't** use pill shapes — `rounded-md`/`rounded-lg` consistently, never
  full-radius capsules.
- **Don't** inject `<style>` tags, use `transition-all`, `space-x/y-*`
  utilities, clickable `<div>`s, or raw status colors — all five are
  hard-failed by `scripts/audit-ui.mjs` in CI.
- **Don't** use `border-left` > 1px as a colored accent, gradient text, or
  decorative glassmorphism, ever.
- **Don't** add per-component `dark:` color overrides for new work; both
  themes live at the token layer.
- **Don't** animate layout properties, bounce, or scale presses below 0.95;
  don't gate content visibility on a reveal animation.
- **Don't** let any text clip or overflow: table prose cells wrap
  (`whitespace-nowrap` is header-only), headings balance, long prose sets
  `text-wrap: pretty`.
