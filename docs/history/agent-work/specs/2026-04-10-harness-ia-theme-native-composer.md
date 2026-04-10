# 2026-04-10 — Harness, IA, and theme-native composer context

Status: historical context only
Date: 2026-04-10 11:58:45 WEST

## Why this work happened

This pass was meant to do three things at once:

1. modernize the repo's agent harness so it is less Claude-specific and easier to use across Hermes, Codex, Claude Code, and similar agents
2. reframe Agentic Craft as an agnostic pattern reference rather than a design system or primitive library
3. move the implementation toward theme-native shadcn/ui composition, especially in the Composer pattern, so the repo does not prescribe a single canonical visual style

## Main decisions

### 1. Harness and truth hierarchy

The repo now treats:
- implemented code as the source of truth for current behavior
- `INTERACTIVE_SPEC.md` as the source of truth for cross-page interaction guidance
- `AGENTS.md` and `docs/agent/README.md` as the harness entrypoints
- `docs/history/agent-work/` as archaeology only

Historical plan/spec docs were moved out of the older `docs/superpowers/` area into `docs/history/agent-work/`.

The harness was also made more agent-agnostic with tracked adapter files and neutral docs:
- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `HERMES.md`
- `docs/agent/*`

### 2. Product framing

The project framing was tightened around this idea:
- Agentic Craft is a reference for higher-order agentic UX patterns
- shadcn/ui primitives are the substrate
- the project should not define a universal visual default for all products

This positioning is captured in:
- `README.md`
- `docs/product/positioning.md`
- `INTERACTIVE_SPEC.md`

### 3. Information architecture

The sidebar and route structure were reshaped around:
- Overview
- Pattern Reference
- Research Lenses
- Composed Flows

Pattern Reference now includes canonical pattern routes such as:
- Composer
- Thread Timeline
- Approval Gate
- Activity Timeline
- Audit Trail

### 4. Composer direction

The composer work moved away from bespoke visual styling and toward:
- `Card` for surfaces
- `Button` for actions
- `Badge` for compact labels/tokens
- `Textarea` for the input primitive
- `Tooltip` and `DropdownMenu` for disclosure patterns

The guiding rule from this pass:
- Agentic Craft should own composition, interaction logic, and structural behavior
- the active shadcn theme should own colors, radii, shadows, and typography whenever possible

A structural exception remains for stacked islands:
- islands are intentionally inset relative to the main composer (`95%` width)
- stacked islands collapse top radii where needed so they read as one composed unit

### 5. shadcn preset adoption

A shadcn preset was applied and its fallout was normalized afterward.
The repo now reflects that preset-driven base more consistently, especially in the shared UI primitives and composer-related implementation.

## Important implementation outcomes

### Sidebar

The floating desktop sidebar toggle that overlapped the title was replaced with:
- an in-header collapse trigger when expanded
- a separate floating reopen trigger only when the sidebar is collapsed

The stale `v3` badge was removed.

### Thread Timeline

The standalone Thread Timeline pattern page was rewired to match the shared pattern behavior more closely:
- it now passes `scrollContainerRef`
- it renders `ThreadTimelineMessage` targets
- card clicks can actually jump to and morph against target turns

### Interaction spec alignment

`INTERACTIVE_SPEC.md` was updated so it no longer contradicts the actual stack:
- Next.js 16 instead of Vite-era wording
- motion libraries are allowed when structurally necessary for patterns like shared-layout thread navigation, while CSS remains the default for routine demo motion

## Verification performed before commit

The final pre-commit pass included:
- `pnpm typecheck`
- `pnpm build`
- static grep-based security scan on added lines (no hits for common secret / injection patterns)
- independent reviewer subagent pass
- targeted independent re-check of the two blocking issues found during review

Final verification state at commit time:
- typecheck: passing
- build: passing
- independent reviewer blockers: resolved

## Notes for future work

Likely next follow-ups:
- continue converting remaining pattern pages so they are clearly canonical reference pages rather than mixed topic demos
- keep reducing bespoke component styling where theme-native primitive composition is sufficient
- consider expanding Pattern Reference navigation further as more standalone pattern pages stabilize

## Reminder

This file is historical context.
If it disagrees with current code, `AGENTS.md`, `docs/agent/README.md`, or `INTERACTIVE_SPEC.md`, trust the current sources of truth instead.
