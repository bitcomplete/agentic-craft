# IA + Composer Feature Framing Sprint

> Status: Historical archived design reference.
> This document captures a repo-grounded feature framing sprint and should not override implemented code or current canonical guidance.

## Sprint conclusion

Adopt a bridge IA: add a first-class Pattern Reference layer beginning with Composer, recast the current topic pages as Research Lenses, and preserve the current homepage demo as a featured composed flow inside Overview.

## 1. Current state

- `docs/product/positioning.md` already defines the target IA as Overview / Pattern Reference / Research Lenses / Composed Flows, but the app does not yet implement that structure.
- `app/` is still flat and mostly topic-first: `/conversation`, `/actions`, `/trust`, `/memory`, `/multi-agent`, `/feedback`, `/observability`, plus standalone `/thread-timeline`.
- `src/components/app-sidebar.tsx` hardcodes a flat section list with per-page anchor scrolling, so each route behaves like a monolithic showcase rather than a bucket in a broader IA.
- `/` is labeled `Overview` in navigation, but `app/page.tsx` still renders `DemoContent`, which behaves like a composed scenario/demo page rather than an orientation page.
- Composer already has the strongest reusable assets in the repo: `src/components/InteractiveComposer.tsx`, a dedicated section in `src/views/conversation-content.tsx`, and a registry item in `registry.json`.
- Current topic pages mix research framing and pattern reference material. For example, Composer is discoverable only as a section inside Conversation rather than as a first-class pattern destination.
- `docs/product/positioning.md` explicitly says the current homepage/demo energy belongs under composed flows and that Composer should become the reference model for future pattern pages.

## 2. User/job framing

Primary users
- Product designers and engineers looking for a specific agentic UX pattern
- Researchers and PMs translating HAX ideas into concrete interface choices
- Builders seeking compositional guidance, not primitive components

Core jobs
- Understand what Agentic Craft is in under a minute
- Find a specific pattern directly, without guessing which topic page contains it
- Understand why a pattern exists and when it should be used
- See multiple patterns working together in a realistic flow
- Distinguish pattern reference from research framing and from composed examples

## 3. Constraints and invariants

- Must reinforce the positioning: Agentic Craft is a pattern reference for agentic UX, not a design system or primitive component library.
- Must preserve the interactive quality bar and page conventions in `INTERACTIVE_SPEC.md`.
- Must keep the current homepage demo energy; it is valuable as a composed flow.
- Should fit the repo’s existing implementation model: lightweight `app/` wrappers backed by `src/views/` pages and reusable `src/components/` primitives.
- Needs an incremental migration path. The current topic pages are content-heavy, so the IA cannot depend on a full rewrite before value appears.
- Composer should be the template for future pattern pages because it already exists as both a strong interactive demo and a registry item.
- Research lens pages should explain pattern rationale and grouping, not remain the only place canonical patterns are discoverable.

## 4. Viable directions

### A. Minimal nav relabel

Keep the current routes. Reword the sidebar to imply the new IA and add a direct Composer link.

Why it works
- Lowest cost
- Fastest to ship

Why it falls short
- Mostly cosmetic
- Does not make Pattern Reference real
- Does not fix the current “you have to know where Composer lives” problem

### B. Bridge IA with first canonical pattern page

Add explicit IA buckets in navigation. Introduce `/patterns/composer` as the first canonical pattern page. Keep the current topic routes, but recast them as Research Lenses with links to canonical pattern pages. Treat `/` as Overview with a featured flow.

Why it works
- Matches the positioning doc closely
- Creates a real Pattern Reference layer immediately
- Preserves current content while reducing discovery friction
- Lets Composer become the reference template before broader migration

Why it costs more
- Temporary duplication between lens pages and pattern pages
- Sidebar data model needs to support grouped buckets and mixed link behaviors

### C. Full route migration now

Move directly to `/patterns/*`, `/lenses/*`, `/flows/*` and substantially rewrite current pages so lenses become interpretive and patterns become primary.

Why it works
- Cleanest end-state IA
- Strongest product clarity

Why it is risky now
- Highest content and implementation cost
- Likely premature with only one clear canonical pattern page ready today

## 5. Tradeoffs

- Findability vs duplication: canonical pattern pages make discovery much better, but there will be a transition period where some content exists in both a lens and a pattern page.
- Clarity vs simplicity: current topic pages are easy to maintain, but they blur the difference between a pattern, a lens, and a flow.
- Future-proofing vs over-structuring: full migration is attractive, but the product does not yet have enough canonical pattern pages to justify a heavy restructure.
- Sidebar precision vs current behavior: today subitems mostly scroll within a page; the new IA will require a mix of route links, grouped sections, and in-page anchors.

## 6. Recommended direction

Choose direction B: Bridge IA with first canonical pattern page.

Recommended move sequence

1. Overview
   - Keep `/` as Overview.
   - Rewrite the hero and framing so it explains the product first.
   - Keep the existing release-review demo as the featured composed flow inside Overview.

2. Pattern Reference
   - Add `/patterns` and `/patterns/composer`.
   - Make Composer the canonical pattern page template.
   - Structure it around the positioning doc’s pattern-page needs:
     - what it solves
     - anatomy
     - interactive demo
     - states
     - interactions and motion
     - composition rules
     - anti-patterns
     - implementation notes

3. Research Lenses
   - Keep existing lens URLs initially for continuity.
   - Reframe their headers and intros so they explain why the patterns matter and which patterns belong in that lens.
   - In Conversation, reduce Composer from “its only home” to “a relevant pattern in this lens,” with a clear path to the canonical Composer page.

4. Composed Flows
   - Preserve the current homepage demo as the first composed flow.
   - Optionally split it into `/flows/release-review` after Overview and Composer land.
   - Use flows to demonstrate pattern composition, not to define individual patterns.

Decision rule
- If a page answers “what is this pattern and how do I use it?” it belongs in Pattern Reference.
- If a page answers “why does this class of pattern exist and when does it matter?” it belongs in Research Lenses.
- If a page answers “how do multiple patterns work together in a realistic scenario?” it belongs in Composed Flows.

## 7. Open questions and next experiments

Open questions
- Route naming: move to `/lenses/conversation` eventually, or keep current top-level lens URLs for longer?
- Should Thread Timeline join Pattern Reference immediately, or wait until Composer establishes the page template?
- How much Composer material should remain on Conversation once the canonical page exists?
- Does the `Method` layer need a route now, or should it wait until the main IA is clearer?

Next experiments
1. Navigation prototype
   - Update the sidebar model to show four buckets: Overview, Pattern Reference, Research Lenses, Composed Flows.
   - Validate that “find Composer” becomes a one-click task.

2. Canonical Composer page prototype
   - Build `/patterns/composer` by reusing `InteractiveComposer`, the current composer spec content, and registry framing.
   - Check whether it reads as a pattern reference instead of a component demo.

3. Conversation lens rewrite
   - Rewrite the Conversation intro so it frames the lens and links outward to Composer, Citations, and Thinking Blocks.
   - Remove only content that becomes redundant once the canonical pattern page exists.

Success signals
- A new visitor can explain the product after reading Overview.
- A user can find Composer directly without knowing it lives under Conversation.
- Lens pages point to patterns rather than acting as the only container for them.
- The product reads more like a reference for higher-order agentic UX patterns and less like a library of demos.
