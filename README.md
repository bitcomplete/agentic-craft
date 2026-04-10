# Agentic Craft

HAX-informed reference for agentic UX patterns and interaction models.

This repo is a Next.js 16 + React 19 app focused on how complex human-AI interface patterns are represented, composed, and explained. It is not a design system or a primitive component library. shadcn/ui provides the substrate; Agentic Craft focuses on the higher-order patterns built on top of it: composer surfaces, tool calls, workflow steps, memory controls, trust patterns, multi-agent flows, observability, and related interaction models.

## Quick start

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm typecheck
pnpm build
pnpm registry:build
```

## Project guidance

For agents and automation:
- Start with `AGENTS.md`
- Then read `docs/agent/README.md`
- Follow `INTERACTIVE_SPEC.md` for cross-page interaction and design rules

## Truth hierarchy

- Implemented code is the source of truth for current behavior
- `INTERACTIVE_SPEC.md` is the source of truth for cross-page interaction conventions
- `AGENTS.md` and `docs/agent/README.md` define the personal harness workflow
- `docs/history/agent-work/` is historical context only, not active instruction

## Personal/local directories

The repo is optimized for personal day-to-day agent work. These paths are local-only and non-canonical:

- `.claude/`
- `.agents/`
- `.history/`
- `.superpowers/`
- `.agent-state/`
- `.hermes/plans/`

Use `.agent-state/` for active scratch notes instead of committing live task state into the repo.
