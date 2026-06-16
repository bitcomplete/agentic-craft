# CLAUDE.md — Agentic Craft

This is the Claude-Code-specific memory file. The canonical, cross-tool baseline
is `AGENTS.md` — start there.

@AGENTS.md

## Claude-Code-only additions

These are addenda that only apply when this repo is being worked on through
Claude Code (use of `@imports`, hooks, path-scoped behaviour, sub-agents). Other
agents (Codex, Cursor, Copilot, Aider, etc.) should rely on `AGENTS.md` alone.

### Tool-use defaults

- For finding files, prefer **Glob** over `find`. For searching contents, prefer
  **Grep** over `cat | grep`. Both are faster, structured, and respect the
  repo's gitignore.
- For the registry-sync workflow (after editing `src/components/ui/*`), batch
  the two commands in a single **Bash** call rather than two separate ones:
  ```
  node scripts/sync-registry.mjs && npm run registry:build
  ```
- For animation work, prefer **Read** on `src/index.css` over **Grep** when you
  need to see the keyframes together — they cluster intentionally and naming
  drift starts when one is read in isolation.
- For `docs/research.md`, prefer **Grep** with a section anchor (e.g.
  `^## 9. Dynamic Workflows`) over reading the whole 85 KB file.

### Project-local skills

The repo ships two project-local skills under `.agents/skills/`. Apply them
proactively, not only when asked:

- `.agents/skills/make-interfaces-feel-better/SKILL.md` — apply for any
  interaction polish, animation, or feel work. Covers animations, surfaces,
  typography, performance.
- `.agents/skills/emil-design-engineering/SKILL.md` — apply for any new
  pattern page or component-design work. Covers component design, design rules,
  forms, touch and accessibility, UI polish, performance, marketing surfaces.

Both follow the standard `SKILL.md` entry pattern with topic sub-files.

### Sub-agent guidance

The harness behind agentic-craft is small — one developer, one repo. Default to
a single Claude Code session for most work. Use a sub-agent only when the task
fits one of these shapes:

- **Wide research** across many files where the parent session should not
  absorb the full trace (e.g. surveying every `src/views/` pattern page for a
  cross-cutting issue).
- **Independent validation** of a complex change against the canonical
  `docs/research.md` (e.g. "does this new demo still teach the autonomy-contract
  pattern correctly?").
- **Parallel exploration** of two alternative implementations of the same
  primitive, where you want clean comparison.

Pass sub-agents only the files they need. Sub-agents return summaries; they do
not edit the canonical research.

### TodoWrite

Use **TodoWrite** for any task that has more than two distinct steps. Mark
in-progress when starting and completed when done — do not batch updates. The
registry-sync workflow (edit → sync → build → commit) is exactly the kind of
task that benefits.

### When you finish

Before declaring a task done, run:

```
npm run verify
```

If it fails, the task is not done. Surface the failure with the exact error,
do not silently retry or work around it.
