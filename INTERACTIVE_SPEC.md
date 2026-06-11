# Interactive Reference Page Specification

> Read alongside CLAUDE.md.

Every page in this reference guide must have interactive examples at the level
of InteractiveComposer.tsx. Here's what that means:

## The Standard (set by InteractiveComposer)

1. **Controls panel** — toggle buttons above the demo that activate/deactivate
   features. Active controls show a small dot indicator. Controls use
   `rounded-md border border-border px-2.5 py-1 text-xs transition-colors`.
   Active: `bg-foreground text-background`. Inactive: `hover:bg-muted`.

2. **Real state** — everything uses React `useState`. Inputs type. Buttons
   animate. Toggles toggle. Nothing is static HTML with no behavior.

3. **Animations** — islands slide up (translateY 16→0, 250ms ease-out).
   Press effects (scale 0.97). Fade in/out for appearing/disappearing elements.
   No motion libraries — pure CSS keyframes defined in `src/index.css` (shared)
   or in a registry item's `css` block (item-local).

4. **Single interactive example per section** — NOT 5 static screenshots. One
   component, many states controlled by the controls panel.

5. **Everything clickable** — chips, buttons, dismiss ×, expand/collapse,
   tabs. Every interactive element works.

6. **Spec table follows the demo** — bare table, no wrapper card. Only include
   where ≥ half the rows encode non-visible contract (timings, keyboard
   behavior, state-transition rules, failure modes, required formats). Mostly-
   pixel tables should be omitted; any 1-2 genuine contract rows can be folded
   into the section intro instead. Most sections need no table.

7. **Callout at the end** — border-l-2 italic muted text explaining a
   non-inferable design rule. Only include when the rule is (a) actionable,
   (b) not already captured in the spec table or intro, and (c) not inferable
   from looking at the demo. Most sections need no callout.

## Tech constraints

- Next.js 16 App Router + React 19 + Tailwind CSS 4 + `@base-ui/react` (NOT Radix)
- Icons: `@hugeicons/react` + `@hugeicons/core-free-icons`
  - Usage: `<HugeiconsIcon icon={SomeIcon} size={14} strokeWidth={1.5} />`
  - All icons monochrome, no colors
- No motion/framer-motion — pure CSS keyframes only; define in `src/index.css`
  (for shared use) or in a registry item's `css` block (item-local). Never use
  `document.createElement("style")` — banned by `audit-ui` (`no-page-style-injection`).
- Import pattern: `import { HugeiconsIcon } from "@hugeicons/react"`
  then `import { IconName } from "@hugeicons/core-free-icons"`
- Base UI components from `@/components/ui/*` (DropdownMenu, Tooltip, etc.)
- Page structure: `<article>` with `<header>` + `<section className="page-section">`
- Section labels: `<p className="section-label mb-3">CATEGORY</p>`
- Headings: `<h2 className="text-xl font-semibold tracking-tight">Title</h2>`
- Demo containers: `<div className="border border-border/40 rounded-lg p-6">`
- Page title: `<h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">`
- Description: `<p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">`
- Font for agent prose: apply the `.agent-prose` CSS class (defined in
  `src/index.css`). It sets Source Serif 4, 16px/26px, letter-spacing -0.4px,
  `font-variation-settings: "opsz" 12`, and antialiasing. Color is NOT part of
  the class — set it per-context (e.g. `style={{ color: "var(--foreground)" }}`).
  Combine with `font-serif text-base` for Tailwind font-stack/size utilities.
- Tables: bare, no wrapper. `<th>` uses `text-xs font-medium text-muted-foreground`
- Callouts: `border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground`

## Content context

This is a reference guide for agentic interfaces used across many product
domains. It should go beyond chat-first interaction and cover the broader
surface area of agentic products:
- orchestration surfaces: agent configuration, rule builders, preview panels,
  routing, handoffs, and parallel work
- operational surfaces: dashboards, inboxes, task lists, timelines, monitoring,
  errors, cost, and human oversight queues
- action surfaces: tool calls, rich action previews, ask blocks, approvals,
  plans, and rollback/recovery
- context surfaces: knowledge source selection, connectors, memory controls,
  source panels, citations, and provenance

Example content should stay generic and portable:
- product research, project plans, customer feedback, release notes, support
  cases, internal knowledge, operational runbooks, and analytics
- plain-language labels instead of domain-specific acronyms
- workflows that are useful in many contexts: reviewing source material,
  comparing claims, asking for approval, updating a plan, saving memory, routing
  work, and inspecting activity

## User instructions (CRITICAL)

- NO function signatures in demos (e.g., `analyze_source("report.pdf")`)
  — use human-readable labels only
- All icons monochrome — no colors
- No spinners/loaders while tools load
- Tool labels: font-weight 400 (never bold)
- No success/failure icons on tool calls
- No pill shapes — use rounded-md consistently
- Sans font: Albert Sans. Serif font: Source Serif 4
- Agent prose color in light mode: oklch(0.2642 0.013 93.9)
