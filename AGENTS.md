# AGENTS.md - Agentic Craft

Agentic Craft is a reference guide and shadcn registry for agent product UI.
The site teaches patterns; the registry ships installable primitives. Treat
interaction quality, accessibility, and registry portability as product
requirements.

Keep this file short. Read only the task-specific docs you need.

## Always

- Use shadcn primitives before custom markup. If shadcn owns the primitive,
  compose it instead of rebuilding it.
- Edit UI source in `src/components/ui/`. Never edit `registry/base-nova/ui/`
  or `public/r/` directly.
- Registry components inherit the consumer's theme. Do not hardcode site fonts,
  site-only classes, icon family, icon stroke width, or custom color tokens.
- Animation is CSS-only in `src/index.css` or registry item `css`; every
  animation needs a reduced-motion path.
- Preserve the dirty worktree. Do not revert unrelated user changes.
- Run the smallest relevant verification while working; run `pnpm run verify`
  before a PR or handoff that claims the full repo is clean.

## Ask First

- Add or remove a top-level dependency.
- Delete or consolidate top-level docs.
- Change registry item names, URLs, or public install commands.
- Make broad visual-system changes outside the touched route or component.

## Never

- Recreate a shadcn primitive with custom styled markup.
- Edit `registry/base-nova/ui/` or `public/r/` directly.
- Add site-only visual rules to registry components.
- Change `registry.json` without rebuilding `public/r/`.
- Bypass failing verification.

## Read When Relevant

| Task                                               | Read                            |
| -------------------------------------------------- | ------------------------------- |
| Stack, scripts, dependencies, package manager      | `package.json`                  |
| Registry component or `src/components/ui/*` change | `agent_docs/registry.md`        |
| Pattern page, visual polish, or interaction design | `agent_docs/design.md`          |
| Choosing checks or reporting verification          | `agent_docs/verification.md`    |
| Product/design rationale                           | `DESIGN.md`                     |
| Pattern research                                   | `docs/research.md`              |
| Registry install surface                           | `README.md` and `registry.json` |

Project-local skills live in `.agents/skills/`. Use only the skills relevant to
the task; do not load them all by default. Skill-local `AGENTS.md` files apply
only while working inside that skill.
