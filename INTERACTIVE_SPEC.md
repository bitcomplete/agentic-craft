# Interactive Page Specification

Every page in this reference must have interactive demos at the level of
InteractiveComposer.tsx. Here's what that means:

Visual styling should come primarily from the active shadcn/ui theme and the
shared primitive defaults. These patterns define composition, state, behavior,
and interaction logic — not a single canonical set of radii, shadows, colors,
or typography beyond what is structurally necessary for the pattern to read.

## The Standard (set by InteractiveComposer)

1. **Controls panel** — toggle buttons above the demo that activate/deactivate
   features. Active controls should use shared button/toggle primitives and rely
   on the current theme for their visual treatment rather than bespoke local
   styling.

2. **Real state** — everything uses React `useState`. Inputs type. Buttons
   animate. Toggles toggle. Nothing is static HTML with no behavior.

3. **Animations** — islands slide up (translateY 16→0, 250ms ease-out).
   Press effects (scale 0.97). Fade in/out for appearing/disappearing elements.
   Prefer pure CSS keyframes for routine demo motion. Use a motion library only
   when a pattern truly needs it for structural interactions such as shared-layout
   transitions.

4. **Single interactive demo per section** — NOT 5 static screenshots. One
   component, many states controlled by the controls panel.

5. **Everything clickable** — chips, buttons, dismiss ×, expand/collapse,
   tabs. Every interactive element works.

6. **Spec table follows the demo** — bare table, no wrapper card.

7. **Callout at the end** — border-l-2 italic muted text explaining design
   rationale.

## Tech constraints

- Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui-style primitives
- Icons: `@hugeicons/react` + `@hugeicons/core-free-icons`
  - Usage: `<HugeiconsIcon icon={SomeIcon} size={14} strokeWidth={1.5} />`
  - All icons monochrome, no colors
- Prefer CSS animations via injected `<style>` tags for most demos; allow motion libraries only when a pattern depends on layout-aware transitions or other structural animation primitives
- Import pattern: `import { HugeiconsIcon } from "@hugeicons/react"`
  then `import { IconName } from "@hugeicons/core-free-icons"`
- shadcn components from `@/components/ui/*` (DropdownMenu, Tooltip, etc.)
- Page structure: `<article>` with `<header>` + `<section className="page-section">`
- Section labels: `<p className="section-label mb-3">CATEGORY</p>`
- Headings: `<h2 className="text-xl font-semibold tracking-tight">Title</h2>`
- Demo containers: `<div className="border border-border/40 rounded-lg p-6">`
- Page title: `<h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">`
- Description: `<p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">`
- Font for agent prose: `font-serif text-base` with inline style for
  lineHeight: "26px", letterSpacing: "-0.4px", fontVariationSettings: '"opsz" 12'
- Tables: bare, no wrapper. `<th>` uses `text-xs font-medium text-muted-foreground`
- Callouts: `border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground`

## Domain context

Agentic Craft is domain-agnostic. Prefer examples from software product development and design collaboration because they are more broadly legible to developers and designers while still supporting complex human-AI workflows.
Use scenarios that involve traceability, review gates, approvals, iteration, handoffs, and judgment.
Good example topics include:
- pull requests, branches, commits, deployments, incidents, release notes
- design files, component reviews, handoff threads, prototypes, feedback cycles
- task planning, debugging, documentation, analytics, support escalation
Keep examples concrete and realistic, but avoid overly niche domain jargon unless a page explicitly calls for it.

## User instructions (CRITICAL)

- NO function signatures in demos (e.g., `analyze_release_logs("checkout-service")`)
  — use human-readable labels only
- All icons monochrome — no colors
- No spinners/loaders while tools load
- Tool labels: font-weight 400 (never bold)
- No success/failure icons on tool calls
- Prefer theme-provided radius, surface, color, and typography defaults
- Do not hard-code canonical rounded, pill, shadow, or font choices unless they are structurally required by the interaction pattern
- Keep the pattern implementation restyleable through shadcn theme tokens and primitive variants
