# Agent workflow reference

This file is the canonical repo-level workflow reference for personal agent use.

## Purpose

Keep the repo easy to navigate for Hermes, Codex, Claude Code, and future agents without turning the project into a heavy team-process harness.

Agentic Craft should be treated as an agnostic reference for agentic UX patterns and interaction models. It is not a design system and not a primitive component library.

## Repo shape

- `app/` — Next.js route wrappers and layout
- `src/views/` — page-level interactive showcases
- `src/components/` — reusable UI components
- `INTERACTIVE_SPEC.md` — durable interaction/design standard
- `docs/history/agent-work/` — archived historical plans/specs from prior agent sessions
- `docs/product/positioning.md` — product framing, anti-goals, and target information architecture

## Truth hierarchy

1. Code is the source of truth for current behavior
2. `INTERACTIVE_SPEC.md` is the source of truth for interaction and design conventions
3. `AGENTS.md` and this file are the source of truth for harness workflow
4. `docs/history/agent-work/` is background only

## Startup checklist for any agent

1. Read `AGENTS.md`
2. Read this file
3. Read `INTERACTIVE_SPEC.md` if changing UI, demos, or component behavior
4. Inspect the relevant code paths before making changes
5. Use `docs/history/agent-work/` only when prior design context is needed

## Hermes workflow modes

To use Hermes beyond one-task-at-a-time coding, follow these repo-local playbooks:

- `docs/agent/workflow-modes.md` — named operating modes and when to use them
- `docs/agent/prompt-templates.md` — copy/paste prompt starters for each mode

Use these to shift between architecture framing, pattern harvesting, option comparison, design-to-code loops, and review gates.

## Working rules

- Do not treat archived plans/specs as active task lists
- Do not commit live task state like `CURRENT_TASK.md` or `TASK_CONTRACT.md`
- Put active scratch notes in `.agent-state/`
- Keep durable guidance in neutral tracked files, not local tool folders
- Keep tool-specific local config useful, but non-canonical

## Common commands

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm registry:build
```

## Local-only paths

These paths are local personal tooling or scratch state and should not be treated as shared project truth:

- `.claude/`
- `.agents/`
- `.history/`
- `.superpowers/`
- `.agent-state/`
- `.hermes/plans/`
- `local-artifacts/`

## Historical docs policy

Historical implementation plans, superseded designs, and prior agent-generated working docs belong under `docs/history/agent-work/`.

If you create a doc that is only useful as session history or design archaeology, put it there or move it there once the work is done.

## When adding new durable guidance

Prefer one of these locations:

- `AGENTS.md` for startup/routing guidance
- `docs/agent/README.md` for harness/workflow guidance
- `INTERACTIVE_SPEC.md` for cross-page interaction standards
- code comments near implementation for behavior-specific nuance

Avoid introducing new tool-branded canonical namespaces unless there is a strong reason.
