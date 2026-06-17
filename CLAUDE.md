# CLAUDE.md - Agentic Craft

This is the Claude-Code-specific memory file. The canonical cross-tool baseline
is `AGENTS.md`. Start there.

@AGENTS.md

## Claude-Code-Only Additions

These addenda only apply when this repo is being worked on through Claude Code:
imports, hooks, path-scoped behavior, and sub-agents. Other agents should rely
on `AGENTS.md`.

### Tool-Use Defaults

- For finding files, prefer Glob over `find`. For searching contents, prefer
  Grep over `cat | grep`.
- After editing `src/components/ui/*`, batch the registry workflow in one Bash
  call:

  ```bash
  node scripts/sync-registry.mjs && pnpm run registry:build
  ```

- For animation work, read `src/index.css` before changing keyframes; the shared
  motion rules cluster intentionally.
- For `docs/research.md`, search with a section anchor before reading the full
  file.

### Project-Local Skills

The repo ships project-local skills under `.agents/skills/`. Apply them
proactively when their scope matches the task:

- `.agents/skills/emil-design-engineering/SKILL.md` for component design, UI
  polish, accessibility, forms, touch behavior, and pattern pages.
- `.agents/skills/make-interfaces-feel-better/SKILL.md` for interaction feel,
  animation, surfaces, typography, and performance.
- `.agents/skills/userinterface-wiki/SKILL.md` for detailed UI rules and review
  checks.

### Sub-Agent Guidance

Default to a single Claude Code session for most work. Use a sub-agent only for:

- Wide research across many files where the parent session should not absorb the
  full trace.
- Independent validation of a complex change against `docs/research.md`.
- Parallel exploration of two alternative implementations where comparison is
  useful.

Pass sub-agents only the files they need. Sub-agents return summaries; they do
not edit canonical research.

### TodoWrite

Use TodoWrite for any task with more than two distinct steps. Mark in-progress
when starting and completed when done. Do not batch all updates at the end.

### When You Finish

Before declaring a task done, run:

```bash
pnpm run verify
```

If it fails, the task is not done. Surface the exact failure; do not silently
retry or work around it.
