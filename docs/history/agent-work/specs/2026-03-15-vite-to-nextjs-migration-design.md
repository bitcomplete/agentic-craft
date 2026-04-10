# Vite to Next.js Migration

> Status: Historical archived design reference.
> This document captures an earlier migration design and is not the canonical source of truth for the current repo.

## Context

This project is a Vite 7.2.4 + React 19 SPA (Agentic Design System) that needs SSR, SEO, and React Server Components. The migration moves to Next.js 16 (App Router) deployed on Vercel with static generation (SSG) for all pages.

## Approach: Hybrid RSC

Pages are heavily interactive (800-1700 lines with state, controls, animations). The RSC boundary sits at the **layout/shell level** -- navigation, metadata, and page wrappers are server components. Interactive page content stays as client components with `'use client'`.

## Project Structure

```
app/
  layout.tsx              -- RSC: html, body, fonts, theme, sidebar, content shell
  page.tsx                -- / (imports demo-content.tsx)
  conversation/page.tsx   -- /conversation
  actions/page.tsx        -- /actions
  trust/page.tsx          -- /trust
  memory/page.tsx         -- /memory
  multi-agent/page.tsx    -- /multi-agent
  feedback/page.tsx       -- /feedback
  observability/page.tsx  -- /observability
src/
  components/
    ui/                   -- shadcn (reinstalled with rsc: true)
    app-sidebar.tsx       -- wouter -> next/link + next/navigation
    theme-provider.tsx    -- stays 'use client'
    InteractiveComposer.tsx
  pages/                  -- existing pages renamed to *-content.tsx, marked 'use client'
  hooks/
  lib/
```

## Execution Order

Steps must be followed in this order due to dependencies:

1. Install `next`, `@tailwindcss/postcss`; remove `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `wouter`, `@fontsource-variable/figtree` (unused), `eslint-plugin-react-refresh`
2. Delete `vite.config.ts`, `index.html`
3. Create `next.config.ts`
4. Create `postcss.config.mjs`
5. Update `tsconfig.json` for Next.js (remove `vite/client` types)
6. Update ESLint config (remove Vite-specific plugin, add `eslint-config-next`)
7. Update `package.json` scripts
8. Create `app/layout.tsx` (fonts, providers, sidebar, content shell, footer)
9. Migrate `app-sidebar.tsx` (wouter -> next/link + next/navigation)
10. Rename page files to `*-content.tsx`, add `'use client'`
11. Create `app/*/page.tsx` thin RSC wrappers with metadata
12. Run `pnpm dlx shadcn@latest init --preset base-nova --force --reinstall`
13. Verify (dev server, build, all routes, theme, fonts, hydration)

## Configuration

### next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Vercel handles SSR/SSG natively, no output config needed
  // Path aliases handled via tsconfig.json paths (already configured)
}

export default nextConfig
```

### postcss.config.mjs

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Tailwind CSS
- Remove: `@tailwindcss/vite`
- Add: `@tailwindcss/postcss`
- `src/index.css` with `@theme` block stays unchanged (including `tw-animate-css` import)

### TypeScript
- Replace Vite-specific tsconfig with Next.js conventions
- Remove `"types": ["vite/client"]` from `tsconfig.app.json`
- Path alias `@/*` -> `./src/*` preserved

### ESLint

Current config uses `eslint-plugin-react-refresh` with `reactRefresh.configs.vite` -- Vite-specific, must be removed.

- Remove: `eslint-plugin-react-refresh`
- Add: `eslint-config-next`
- Update `eslint.config.js` to remove `reactRefresh.configs.vite`, add Next.js lint rules

### Dependencies

**Remove:** `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `wouter`, `@fontsource-variable/figtree` (unused -- zero imports found), `eslint-plugin-react-refresh`

**Add:** `next`, `@tailwindcss/postcss`, `eslint-config-next`

**Keep (unchanged):**
- `react` 19.2.0, `react-dom` 19.2.0
- `tailwindcss` 4.1.17
- `@base-ui/react` (primitive library for all shadcn base-nova components)
- `tw-animate-css` (imported in `src/index.css`)
- All shadcn/UI components, HugeIcons, class-variance-authority, clsx, tailwind-merge
- `shadcn` CLI (move to devDependencies)

### Files to delete
- `vite.config.ts`
- `index.html`

### Scripts (package.json)

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write \"**/*.{ts,tsx}\"",
  "typecheck": "tsc --noEmit"
}
```

## Layout (app/layout.tsx)

Root layout as RSC replaces both `main.tsx` and `App.tsx`. Must preserve the full content shell structure from `App.tsx`:

- Export root `Metadata` (title, description)
- Import fonts via `next/font/google` (see Fonts section)
- Wrap children with:
  - `TooltipProvider` ('use client' -- currently wraps entire app in `App.tsx`)
  - `ThemeProvider` ('use client')
  - `SidebarProvider` ('use client', with `--sidebar-width: 220px` custom property)
- Render `AppSidebar`
- Render `SidebarInset` with:
  - Floating `SidebarTrigger` (fixed position, hidden when sidebar expanded)
  - Mobile `SidebarTrigger` (visible on md:hidden)
  - `<main>` wrapper with `max-w-[860px]` content constraint
  - Footer with GitHub link

## Fonts

Move from Google Fonts `<link>` tags in `index.html` to `next/font/google`:

```typescript
import { Albert_Sans, Source_Serif_4 } from 'next/font/google'

const albertSans = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-sans',       // must match existing CSS @theme variable
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',      // must match existing CSS @theme variable
})
```

CSS variables `--font-sans` and `--font-serif` already defined in `src/index.css` `@theme` block. The `variable` prop must match these names exactly, otherwise fonts won't apply.

Apply to `<html>` via `className={`${albertSans.variable} ${sourceSerif4.variable}`}`.

## Sidebar Migration

File: `src/components/app-sidebar.tsx`

Current imports:
```typescript
import { Link, useLocation } from "wouter"
```

Migration:
- Replace `import { Link, useLocation } from "wouter"` with:
  - `import Link from "next/link"`
  - `import { usePathname, useRouter } from "next/navigation"`
- `useLocation()` returns `[location, navigate]` -- replace with:
  - `location` -> `usePathname()` for reading current path
  - `navigate(path)` -> `router.push(path)` from `useRouter()`
- Active link detection (`location === section.path`) works the same with `pathname`
- `scrollToSection` function: replace `navigate(sectionPath)` with `router.push(sectionPath)`, keep the `setTimeout(doScroll, 100)` pattern for now (note: this is fragile with async router -- can be improved post-migration by listening to pathname changes in useEffect)
- The `render={<Link href={...} />}` pattern on `SidebarMenuButton` stays the same, just uses `next/link` instead of wouter's `Link`
- Must add `'use client'` directive (uses `usePathname`, `useRouter`, `useCallback`)

## Page Migration Pattern

Each route gets a thin RSC wrapper:

```typescript
// app/[route]/page.tsx (Server Component)
import type { Metadata } from 'next'
import { [Route]Content } from '@/pages/[route]-content'

export const metadata: Metadata = {
  title: '[Route] | Agentic Design System',
  description: '...',
}

export default function [Route]Page() {
  return <[Route]Content />
}
```

Existing page files:
- Renamed from `[route].tsx` to `[route]-content.tsx`
- `'use client'` directive added at top
- Export changed from default to named export
- Internal code unchanged

### Pages to migrate (8 routed + 1 orphan)

| Current file | New file | Route |
|---|---|---|
| `src/pages/demo.tsx` | `src/pages/demo-content.tsx` | `/` |
| `src/pages/conversation.tsx` | `src/pages/conversation-content.tsx` | `/conversation` |
| `src/pages/actions.tsx` | `src/pages/actions-content.tsx` | `/actions` |
| `src/pages/trust.tsx` | `src/pages/trust-content.tsx` | `/trust` |
| `src/pages/memory.tsx` | `src/pages/memory-content.tsx` | `/memory` |
| `src/pages/multi-agent.tsx` | `src/pages/multi-agent-content.tsx` | `/multi-agent` |
| `src/pages/feedback.tsx` | `src/pages/feedback-content.tsx` | `/feedback` |
| `src/pages/observability.tsx` | `src/pages/observability-content.tsx` | `/observability` |

**`src/pages/output.tsx`**: Not routed in `App.tsx`, not imported by any other file. Delete during migration (dead code).

### SSR Hydration Risk: Dynamic Style Injection

Every page uses a pattern like:
```typescript
const STYLE_ID = "demo-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  // ... adds keyframe animations ...
  document.head.appendChild(style)
}
```

Called inside `useEffect`, so it only runs client-side. Server-rendered HTML will NOT have these styles. Elements with animations may flash on initial load. This is a known trade-off -- acceptable for now since the animations are decorative, not layout-affecting. Can be improved post-migration by moving keyframes to CSS files.

## shadcn Reinitialization

After `next` is installed in `package.json`:

```bash
pnpm dlx shadcn@latest init --preset base-nova --force --reinstall
```

This:
1. Detects Next.js as the framework
2. Updates `components.json` with `rsc: true`
3. Reinstalls all 15 components with proper `'use client'` directives

Components are stock (no local customizations), so `--reinstall` is safe.

## Verification

1. `pnpm dev` -- dev server starts without errors
2. All 8 routes render correctly at their clean URLs (`/conversation`, `/actions`, etc.)
3. Sidebar navigation works (links highlight active route, sub-section scroll works)
4. Dark/light theme toggle works (keyboard shortcut 'd')
5. All interactive controls on each page function (toggles, tabs, accordions)
6. `pnpm build` -- static generation succeeds for all routes
7. View source on any page -- HTML contains server-rendered content (confirms SSR/SEO)
8. No hydration mismatches in browser console
9. Fonts load without layout shift (no FOUT)
10. `pnpm lint` passes
