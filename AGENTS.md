# AGENTS.md — Agentic Craft

You are working on **Agentic Craft**, a reference site for designing agent
interfaces beyond chat. The site documents interaction patterns for orchestration,
tool use, approvals, memory, multi-agent coordination, and observability. The
shadcn-compatible registry is the distribution channel — consumers run
`npx shadcn@latest add bitcomplete/agentic-craft/<item>` to install primitives.

**The job whenever you edit this repo:** every demo is a teaching artifact, so
interaction quality (real state, real animation, accessible controls) is a
first-class feature, not an afterthought. The site teaches agent UX — looking
like an AI demo would forfeit the argument.

The canonical research backing the patterns lives in `docs/research.md`. When
you build or modify a pattern page, that file is the source of truth for *what*
the pattern teaches.

## Stack

| Concern          | Choice |
|------------------|--------|
| Framework        | Next.js 16 App Router (`next: ^16.1.6`) |
| UI library       | React 19 (`react: ^19.2.0`) |
| Styling          | Tailwind CSS 4 (`tailwindcss: ^4.1.17`) |
| Component system | `@base-ui/react ^1.3.0` (NOT Radix) |
| Icons            | `@hugeicons/react` + `@hugeicons/core-free-icons`; always monochrome, `strokeWidth={1.5}` |
| Fonts            | PP Neue Montreal (sans), Signifier (serif) — local cuts in `app/fonts/` |
| Animations       | Pure CSS keyframes in `src/index.css` or registry item `css` blocks; no motion library |
| Language         | TypeScript strict; path alias `@/*` → `./src/*` |
| Package manager  | npm only (`node >=20.9.0`) |
| Registry CLI     | `shadcn` v4 |

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Next.js dev server at `http://localhost:3000` |
| `npm run lint` | ESLint over the project |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run format` | Prettier write over `**/*.{ts,tsx}` |
| `npm run format:check` | Prettier check |
| `npm run audit:ui` | `node scripts/audit-ui.mjs` (report only) |
| `npm test` | Vitest smoke tests in `tests/` |
| `npm run build` | Next.js production build |
| `npm run registry:build` | `shadcn build` — regenerates `public/r/` from `registry.json` |
| `npm run verify` | Full CI chain (lint → typecheck → format:check → audit-ui --fail → sync-registry --check → check-registry-deps → build → registry:build) |

Before opening a PR, run `npm run verify`. If it fails, treat the failure as a
stop condition and fix the cause — do not bypass.

## The four invariants

These four rules are load-bearing for the project. Violating any of them ships
broken output. Treat each as a stop condition.

### 1. Registry sync — the four-file commit rule

UI primitives live in `src/components/ui/`. The registry copies them into
`registry/base-nova/ui/` via `node scripts/sync-registry.mjs`. Blocks live only
in `registry/base-nova/blocks/`. `registry.json` is the manifest. `public/r/` is
the committed build output.

**Whenever you edit `src/components/ui/*`, you must:**

1. Run `node scripts/sync-registry.mjs` — syncs into `registry/base-nova/ui/`.
2. Run `npm run registry:build` — regenerates `public/r/`.
3. Commit **all four** together: `src/components/ui/`, `registry/base-nova/ui/`,
   `registry.json`, `public/r/`.

CI runs `node scripts/sync-registry.mjs --check` and
`git diff --exit-code -- public/r registry.json`. Either drift fails the build.

Every new registry item needs a smoke test in `tests/ui/` (primitives) or
`tests/blocks/` (blocks).

**Never edit `registry/base-nova/ui/` directly.** Those are sync outputs.
**Never edit `public/r/` manually.** That is the build output.

### 2. Motion policy — CSS keyframes only, no `<style>` injection

All animation is pure CSS. Define keyframes either in `src/index.css` (for
shared use) or inside a registry item's `css` block (for item-local use).

- Never use `document.createElement("style")`.
- Never inject `<style>` tags from React.
- Never add a motion library (Framer Motion, GSAP, motion.dev, etc.) — the
  project is pure CSS by policy. The audit gate `no-page-style-injection`
  enforces the first two.

When you edit shared keyframes in `src/index.css`, search consumers before
shipping: animations are referenced by class name, not import. Use:

```bash
grep -rE '\.(agent-prose|actions-slide-in|route-expand|memory-ring-fill|wf-phase-pulse)' src/
```

(swap in the class you changed).

### 3. Icon policy — monochrome, `strokeWidth={1.5}`

Icons are `@hugeicons/react` + `@hugeicons/core-free-icons`, always monochrome,
always `strokeWidth={1.5}`. No coloured icons. No success/failure icons on tool
calls (this is part of the AI-demo-chrome anti-reference — see DESIGN.md).
Icon-only buttons must carry a label (the `icon-button-label` heuristic in
`scripts/audit-ui.mjs` flags violations).

### 4. Audit gates — five rules, each a stop condition

`scripts/audit-ui.mjs` enforces these. Introducing a violation is a stop
condition; fix or revert before commit.

- `no-space-utilities` — no `space-y-*` / `space-x-*`. Use flex/grid `gap-*`.
- `no-transition-all` — no `transition-all`. Use specific transitions.
- `no-clickable-div` — no `onClick` on `<div>` / `<span>` without a button or
  role.
- `no-page-style-injection` — no programmatic `<style>` tag creation.
- `prefer-semantic-status` — no raw status colours outside design tokens.

Plus an `icon-button-label` heuristic for unlabelled icon-only buttons.

## Layout

```
app/                          Thin Next.js route wrappers (page.tsx, layout.tsx, fonts/)
src/views/                    Page body components ("use client" — the real content)
src/components/ui/            Primitive components (source of truth; synced to registry)
src/components/reference/     Pattern-page scaffolding (controls panel, etc.)
src/content/                  Static data: navigation.ts, patterns.ts, templates.ts, registry-pieces.ts
src/hooks/                    Shared React hooks
src/lib/                      Utilities
src/index.css                 Global CSS, design tokens, @keyframes for shared motion, .agent-prose, print rules
tests/ui/                     Vitest smoke tests for ui primitives
tests/blocks/                 Vitest smoke tests for registry blocks
registry/base-nova/ui/        Sync output — do NOT edit directly
registry/base-nova/blocks/    Blocks live here only
registry.json                 Registry manifest
public/r/                     Committed registry build output — do NOT edit
scripts/                      audit-ui.mjs, sync-registry.mjs, check-registry-deps.mjs
.agents/skills/               Project-local agent skills (see "Where to look first")
.impeccable/design.json       Design-system token reference
docs/research.md              Canonical agentic-UX research (the source of truth for what patterns teach)
DESIGN.md                     Design rationale: voice, typography, color, anti-references
PRODUCT.md                    Product framing: audience, scope, anti-references
README.md                     Human-facing overview and registry install instructions
```

## Where to look first

The right starting point depends on the task. Use this routing table before
opening files broadly.

| If the task is about… | Read first |
|---|---|
| What a pattern should teach / why a demo exists | `docs/research.md` (find the matching §) |
| Animation timing, choreography, interaction feel | `src/index.css` then `.agents/skills/make-interfaces-feel-better/` |
| Component design rules, polish, micro-details | `.agents/skills/emil-design-engineering/` |
| Design voice, color, typography, anti-references | `DESIGN.md` |
| Product audience, scope, what *not* to build | `PRODUCT.md` |
| Registry installation, available items | `README.md` |
| Design tokens (colors, type, spacing) | `.impeccable/design.json` and `src/index.css` (`:root` block) |

Project-local skills under `.agents/skills/` are first-class. Apply
`make-interfaces-feel-better` for interaction polish; apply
`emil-design-engineering` for new pattern pages and component-design work.
Each skill has its own `SKILL.md` entry point.

## After-you-change-X workflows

| When you change… | Then |
|---|---|
| `src/components/ui/*` | Run `sync-registry.mjs`, then `npm run registry:build`. Commit all four files together. |
| `src/index.css` keyframes or shared classes | Grep consumers across `src/` — animations are referenced by class. |
| A pattern page (`src/views/<pattern>/`) | Re-read the matching § in `docs/research.md` to confirm the demo still teaches the right thing. |
| `docs/research.md` | Re-check `PRODUCT.md` and `README.md` for now-incorrect summaries. |
| `registry.json` | Re-run `npm run registry:build` and `node scripts/check-registry-deps.mjs`. |
| `package.json` (deps or scripts) | Re-run `npm run verify` end-to-end before opening a PR. |
| Design tokens in `src/index.css` `:root` | Cross-check against `.impeccable/design.json` and update if drifted. |

## Conventions and QA bar

- **Match the file.** Follow the style of the file you are editing — imports,
  class conventions, naming. Concrete examples: import Base UI primitives from
  `@/components/ui/*` (not `@base-ui/react` directly); name shared keyframes in
  the `<surface>-<action>` shape used by the existing ones (`actions-slide-in`,
  `route-expand`).
- **Visual QA on every route you touch.** Check desktop *and* mobile
  breakpoints. The mobile bar is especially strict for: composer, clarifying
  questions, citations, memory ledger rows, template maps.
- **No fabricated-demo tells.** Real-looking telemetry only. No round numbers,
  no identical timestamps, no "ACME" placeholders. Demo data must read like real
  output. This is audited.
- **No AI-demo chrome.** No glowing gradients, no sparkle icons, no chat-bubble
  theater, no spinners on tool calls, no oversized rounded everything. This is
  the project's primary anti-reference (see `PRODUCT.md`).
- **Prefer well-known CLIs.** When you need to do shell work, use `git`,
  `npm`, `rg`/ripgrep, `grep`, `find`. Avoid custom CLIs.
- **Touch the minimum surface.** If a change can be local to one file, keep it
  there. Cross-cutting refactors need explicit reasoning in the PR.

## Stop conditions

Stop and surface a question rather than proceeding if you find yourself about
to do any of these:

- Edit `registry/base-nova/ui/` directly.
- Edit `public/r/` manually.
- Inject a `<style>` tag from JS / React.
- Add a motion library or any new top-level dependency without justification.
- Introduce an audit-gate violation (`no-space-utilities`,
  `no-transition-all`, `no-clickable-div`, `no-page-style-injection`,
  `prefer-semantic-status`, unlabelled icon button).
- Add a coloured icon, or a success/failure icon on a tool call.
- Add round-number / placeholder demo data (`ACME`, identical timestamps,
  `123,456`, etc.).
- Modify `docs/research.md` without a clear reason — it is the canonical
  research artifact.
- Bypass `npm run verify` failures with `--no-verify`, `git commit -n`, or by
  disabling a gate.

## How to verify your change shipped

Run, in order:

```bash
npm run verify        # full CI chain
npm run dev           # spot-check desktop + mobile breakpoints on routes you touched
```

For registry changes specifically, also verify the install path works locally:

```bash
npx shadcn@latest add http://localhost:3000/r/<item-name>.json
```

into a scratch project.

## Output style for PR / commit messages

Plain text. Use sentence case. Lead with the verb and the subject. State *why*
before *how*. Examples that fit the existing history:

- `docs(research): synthesize canonical agentic-ux patterns`
- `Coherence round: retry that pays off, honest Pause, priced recovery`
- `Give the runtime its own voice: detail notes speak as the system`

No emoji. No "feat:" without scope. No "chore: misc fixes" — be specific.
