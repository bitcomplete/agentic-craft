# Registry Work

Use this file when changing `src/components/ui/*`, `registry.json`, registry
blocks, or generated registry output.

## Source Of Truth

- Edit UI primitives in `src/components/ui/*`.
- `registry/base-nova/ui/*` is sync output from `node scripts/sync-registry.mjs`.
- `public/r/*` is build output from `pnpm run registry:build`.
- Do not edit sync or build output directly.

When `src/components/ui/*` changes:

```bash
node scripts/sync-registry.mjs
pnpm run registry:build
```

Commit the source, synced registry copy, `registry.json`, and `public/r/*`
together.

## Shadcn-First Rule

Before writing custom styled markup, check whether shadcn already owns the
primitive.

- Actions: `Button`
- Status chips and state labels: `Badge`
- Dividers: `Separator`
- Empty states: `Empty`
- Loading: `Spinner` or `Skeleton`
- Disclosure: `Collapsible`
- Option sets: `Tabs` or `ToggleGroup`
- Forms: `Field`, `InputGroup`, `Input`, `Textarea`, `Switch`

If a registry item imports a shadcn primitive, add the matching
`registryDependencies` entry. If the primitive is not installed, add it through
the shadcn CLI rather than recreating it.

## Registry Portability

Registry components must inherit the consumer app.

- Use semantic shadcn tokens like `bg-background`, `text-foreground`,
  `text-muted-foreground`, `border-border`, and `ring-ring`.
- Do not depend on site-only classes.
- Do not hardcode Agentic Craft fonts, icon family, or icon stroke width.
- Prefer icon slots, text labels, CSS indicators, or shadcn-provided icon
  behavior.
- Icons inside shadcn `Button` controls use `data-icon` and no sizing classes.

## Verification

For registry changes, run:

```bash
node scripts/sync-registry.mjs --check
node scripts/check-registry-deps.mjs
pnpm run registry:build
```

Before shipping a registry item, test install in a scratch app:

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/<item-name>.json
```
