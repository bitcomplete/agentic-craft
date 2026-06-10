# CLAUDE.md — Agentic Craft

Agentic Craft is a reference site for agentic UI patterns: it documents interaction design for agent orchestration, tool use, approvals, memory, multi-agent coordination, and observability. The shadcn-compatible registry is the distribution channel — consumers run `npx shadcn@latest add arielconti10/agentic-craft/<item>` to install primitives into their own projects. Every demo is a teaching artifact, so interaction quality (real state, real animation, accessible controls) is a first-class feature, not an afterthought.

## Stack

| Concern          | Choice                                                               |
|------------------|----------------------------------------------------------------------|
| Framework        | Next.js 16 App Router (`next: ^16.1.6`)                             |
| UI library       | React 19 (`react: ^19.2.0`)                                         |
| Styling          | Tailwind CSS 4 (`tailwindcss: ^4.1.17`)                             |
| Component system | `@base-ui/react ^1.3.0` (NOT Radix)                                 |
| Icons            | `@hugeicons/react` + `@hugeicons/core-free-icons`; always monochrome, `strokeWidth={1.5}` |
| Fonts            | Albert Sans (sans), Source Serif 4 (serif)                          |
| Animations       | Pure CSS keyframes — in `src/index.css` or registry item `css` blocks; **never injected `<style>` tags** |
| Motion library   | None                                                                 |
| Language         | TypeScript strict; path alias `@/*` → `./src/*`                     |
| Package manager  | npm only (`node >=20.9.0`)                                          |

## Commands

| Command                       | What it does                                                          |
|-------------------------------|-----------------------------------------------------------------------|
| `npm run dev`                 | Next.js dev server at `http://localhost:3000`                         |
| `npm run lint`                | ESLint over the whole project                                         |
| `npm run typecheck`           | `tsc --noEmit` (strict)                                               |
| `npm run format:check`        | Prettier check over `**/*.{ts,tsx}`                                   |
| `npm run audit:ui`            | Run `scripts/audit-ui.mjs` (report only)                             |
| `npm test`                    | Vitest smoke tests in `tests/`                                        |
| `npm run build`               | Next.js production build                                              |
| `npm run registry:build`      | `shadcn build` — regenerates `public/r/` from `registry.json`        |
| `npm run verify`              | Full CI chain (lint → typecheck → format:check → audit-ui --fail → sync --check → check-registry-deps → build → registry:build) |

## REGISTRY INVARIANT (most important)

UI primitives live in `src/components/ui/`. The registry copies them into `registry/base-nova/ui/` via `node scripts/sync-registry.mjs`. Blocks live only in `registry/base-nova/blocks/`. `registry.json` is the manifest; `public/r/` is the committed build output.

**Whenever you edit `src/components/ui/*`:**
1. `node scripts/sync-registry.mjs` — syncs copies into `registry/base-nova/ui/`
2. `npm run registry:build` — regenerates `public/r/`
3. Commit `src/components/ui/`, `registry/base-nova/ui/`, `registry.json`, and `public/r/` **together**

CI runs `node scripts/sync-registry.mjs --check` and `git diff --exit-code -- public/r registry.json` — either drift fails the build.

New registry items need a smoke test in `tests/ui/` or `tests/blocks/`.

## Layout

```
app/               Thin Next.js route wrappers (page.tsx, layout.tsx)
src/views/         Page body components ("use client" — the real content)
src/components/ui/ Primitive components (source of truth; synced to registry)
src/components/reference/ Pattern-page scaffolding (controls panel, etc.)
src/content/       Static data files: navigation.ts, patterns.ts, templates.ts, registry-pieces.ts
src/hooks/         Shared React hooks
src/lib/           Utilities
src/index.css      Global CSS, CSS variables, @keyframes for shared animations
tests/ui/          Vitest smoke tests for ui primitives
tests/blocks/      Vitest smoke tests for registry blocks
registry/          Registry source tree (do not edit registry/base-nova/ui/ directly)
public/r/          Committed registry build output (do not edit manually)
plans/             Advisor plans (may be absent in a given worktree)
scripts/           Build and validation scripts
```

## Conventions & QA bar

- **Match the file**: follow the style of the file you are editing (imports, class conventions, naming).
- **Interaction spec**: read `INTERACTIVE_SPEC.md` for interaction rules, animation values, and HTML/class conventions.
- **Audit gates**: `scripts/audit-ui.mjs` enforces five checks — `no-space-utilities`, `no-transition-all`, `no-clickable-div`, `no-page-style-injection`, `prefer-semantic-status` — plus an icon-button-label heuristic. Do not introduce violations.
- **Base UI components**: import from `@/components/ui/*`, not directly from `@base-ui/react`.
- **Animations**: define keyframes in `src/index.css` (for shared use) or in a registry item's `css` block (for item-local use). Never use `document.createElement("style")`.
- **Visual QA**: check desktop AND mobile breakpoints on every route you touch. The mobile bar is especially strict for: composer, clarifying questions, citations, memory ledger rows, and template maps.
- **Registry sync**: never edit `registry/base-nova/ui/` files directly; always edit `src/components/ui/` and sync.
