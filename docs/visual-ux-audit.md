# Visual / UX Audit

Date: 2026-06-09
Method: dev server (`next dev`) driven with headless Chromium. 15 routes
captured at 1440×900 (viewport + full page) and 390×844 (full page), light and
dark themes, plus interaction passes: theme switching, sidebar collapse, mobile
drawer navigation, keyboard tabbing, console-error collection, horizontal
overflow scan, and tap-target measurement.

## Summary

The site is in strong shape: zero console errors across all 15 routes, zero
horizontal overflow on any page at 390px, a consistent page-header system
(kicker / serif H1 / lede), working skip-to-content link, visible
`focus-visible` rings on every control tested, `aria-pressed` on toggles,
reduced-motion respected for scrolling, and a complete dark theme. The issues
below are mostly localized defects and polish, not systemic problems.

## Findings

### P1 — fix first

**1. Light-theme flash on initial load when dark theme is active**

With `agentic-craft-theme=dark` stored, a hard load paints the main content
area in the light theme; the DOM is correct (`html.dark`, computed backgrounds
dark) but the first painted frame is light. Under headless Chromium the light
frame persists until the next repaint (scroll/input); in a normal browser this
manifests as a flash of light theme.

Cause: the theme initializer runs via `next/script strategy="beforeInteractive"`
rendered inside `<body>` (`app/layout.tsx:75`), so the class lands after the
server HTML (which has no theme class) is first painted.

Fix: emit the initializer as a plain inline `<script>` inside `<head>` so it
executes before first paint. Verify against a production build as well.

**2. Memory ledger titles clip with an ellipsis on every wrapped line**

On `/memory` ("Memory Panel" demo, desktop 1440px), card titles render as
`ent… rele…` and `Launch Policy v2` wraps one word per line, each line
ellipsized.

Cause: `ReferenceItem.Title` applies `truncate` (overflow-hidden +
text-ellipsis + nowrap) at `src/components/ui/reference-item.tsx:75`;
`memory-ledger-item.tsx:54` overrides only `whitespace-normal`, leaving
`text-overflow: ellipsis` to clip every line box. The column is also squeezed
by the side-by-side source-preview panel.

Fix: give `ReferenceItem.Title` a multi-line variant (e.g. `line-clamp-2`
instead of `truncate`) and use it here; check the panel split leaves the list
a workable min width.

**3. Sub-AA text contrast from opacity-faded muted text**

~49 usages of `text-muted-foreground/30`–`/60` across `src/` and `app/`.
`--muted-foreground` in light mode is ≈4.6:1 against the background; at 50–60%
opacity effective contrast drops to roughly 2–2.5:1, below WCAG AA (4.5:1, or
3:1 for large text). Many of these are also 10–11px labels (35 usages of
`text-[10px]`/`text-[11px]`), e.g. timestamps, meta rows, the footer link
(`app/layout.tsx:109`), and empty-state hints (`src/views/memory-content.tsx:415`).

Fix: reserve opacity fades for decorative elements; for readable text use
`text-muted-foreground` at full opacity or introduce a dedicated
`--muted-foreground-subtle` token tuned to ≥4.5:1.

### P2 — should fix

**4. The trust section has three different names**

- Sidebar nav: "Trust & Control Plane" (`src/content/navigation.ts:89`)
- Page H1: "Trust & Safety" (`src/views/trust-content.tsx:483`)
- README: "Trust & Governance"

For a reference guide whose product is its taxonomy, pick one name and use it
everywhere (nav, H1, README, metadata).

**5. Touch targets below minimum size**

Measured on mobile (390px, `/conversation`): inline citation markers 34×18px,
composer island toggles (Scope / Reply-to / Plan / Suggestions / Attachments)
~24px tall, suggestion chips 28px tall, thumbs feedback icons similar. WCAG
2.5.8 requires ≥24×24px; comfortable touch is 44px. The guide itself
recommends high-trust agent UX — its own approval/citation affordances should
meet target-size guidance. Extend the hit area with padding/pseudo-elements
rather than growing the visual size, where the visual density is intentional.

**6. Theme switcher label truncates at the default sidebar width**

"System" renders as "Syste…" in the sidebar footer at the default 220px width
(`src/components/app-sidebar.tsx:63`). Options: drop to icon-only buttons with
tooltips + `aria-label` (labels already exist), shorten the label, or give the
group slightly more room.

### P3 — polish

**7. Hardcoded paper palette ignores dark mode** — the contextual workbench
canvas uses fixed hexes (`bg-[#f5f3ea]`, `text-[#222222]`,
`src/components/ui/contextual-workbench.tsx:312`). If the paper look is
intentional in dark mode, fine — but it currently reads as an unthemed island;
consider darkening it slightly under `.dark`.

**8. Source-preview popover dead space** — on `/memory` the black source
popover reserves a tall panel with a large empty area below its content; size
to content or anchor the height to the trigger column.

**9. Copy typo** — "…across 5 classes. implementation notes summarize…"
(lowercase sentence start, `src/views/feedback-content.tsx:51`).

**10. Clipped suggestion chips lack a scroll affordance** — on mobile the
composer suggestion row clips mid-chip ("Lis…") with no fade/gradient hint
that it scrolls horizontally.

## What's working well (keep)

- Zero console errors on all 15 audited routes; no nav failures.
- No horizontal overflow at 390px on any route — rare and commendable.
- Consistent page anatomy: uppercase kicker → serif display H1 → muted lede →
  sectioned demos with `CONTROLS` toggles. The repetition builds real
  scannability across 11 sections.
- Accessibility plumbing: skip link, `aria-pressed`, `aria-label` on icon
  buttons, semantic H1→H2 order, visible focus rings, no unnamed buttons or
  missing alt text found, `prefers-reduced-motion` respected.
- Mobile drawer nav works cleanly; sticky compact header on small screens.
- Dark mode (after load) is complete and consistent, including demo content.
- The serif-prose / sans-UI split gives agent output a distinct, readable
  voice and is also exposed as an explicit reader preference — nice touch.

Note: the "N" circle overlapping the sidebar footer in dev screenshots is the
Next.js dev-tools indicator, not part of the product UI.
