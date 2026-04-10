# AGENTS.md

Start here for any agent working in this repo.

## Read in this order

1. `docs/agent/README.md`
2. `INTERACTIVE_SPEC.md`
3. Relevant code under `app/`, `src/views/`, and `src/components/`
4. `docs/history/agent-work/` only if you need background from prior design/implementation work

## What this repo is

`Agentic Craft` is an agnostic reference for agentic UX patterns and interaction models. It is not a design system or a primitive component library. The app is built with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui-style primitives as the substrate for higher-order compositions.

## Truth hierarchy

Use this order when deciding what is authoritative:

1. Implemented code for current behavior
2. `INTERACTIVE_SPEC.md` for cross-page design and interaction standards
3. `docs/agent/README.md` for repo workflow, commands, and harness conventions
4. `docs/history/agent-work/` for historical context only

If a historical doc disagrees with the code or current agent docs, do not treat the historical doc as source of truth.

## Common commands

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm registry:build
```

## Local-only conventions

These paths are personal/local and not canonical project guidance:

- `.claude/`
- `.agents/`
- `.history/`
- `.superpowers/`
- `.agent-state/`
- `.hermes/plans/`

Keep active scratch notes and current task state in `.agent-state/`, not in tracked docs.

## Historical docs

Past agent-generated plans/specs live under `docs/history/agent-work/`.

They are useful for archaeology, not for current instruction routing.
