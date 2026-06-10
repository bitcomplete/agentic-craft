# Generic-AI Visual Audit — Round 2 (gap hunt)

Date: 2026-06-10
Target: branch `claude/visual-ux-audit-h99mam` @ 86ae44e (the state round 1 describes).
Method: 9 independent finder lenses (voice, demo data, iconography, generic
fingerprints, layout, accessibility, registry drift, skipped surfaces, live
browser sweep with light/dark/390px screenshots) plus a fact-check of round 1's
own claims; 59 candidates deduped to 49; every survivor adversarially verified
against source (45 confirmed, 4 refuted); closed with a completeness critique.

Verdict on round 1: its findings hold — every headline claim was re-measured
and confirmed except two (errata below). But it audited *one page at a time*
and *what renders by default*. The misses cluster where those two methods
can't see: facts that contradict **across** pages, the **distribution
pipeline** (registry payloads users actually install), **accessibility**, and
**interaction states** (focus, hydration, dead handlers).

## Errata in round 1

- **A3 repeated-sentence claim is wrong.** "Ask only for missing decisions
  that would otherwise be invented" appears verbatim **once**
  ([templates-content.tsx:214](../src/views/templates-content.tsx)), not 4×.
  The 4 hits are different sentences sharing the stem "ask only for missing
  decisions" (templates-content.tsx:62, registry review-workflow.tsx:53, plus
  a build artifact in public/r/). The cross-surface-repetition point survives
  in weakened form; the "4× verbatim" framing does not.
- **C6 undercounts.** Brain01Icon is used **18×** across the stated 8-file
  scope (19×/9 files repo-wide, 21×/11 with registry mirrors), not 15×. The
  dual-meaning finding itself is confirmed.
- Confirmed as stated: A1 callout census (exact on all 7 pages), em-dash
  density (measured 1.05–1.18/100w — slightly *above* the claimed 0.96),
  triad count (84–102 instances spanning the claimed ~90), ACME ×5, all
  three B5 number cites, E10 mechanism, and the no-marketing-vocabulary
  non-finding (zero hits for seamless/leverage/robust/delve).

## F. Scenario coherence across pages (the biggest blind spot)

Round 1 checked whether numbers *look* fabricated in place; it never
cross-referenced the single launch-review scenario between surfaces.

### F1 — HIGH · The same brief has 47, 23, and 14 requirements
Trust audit log: "Loaded **47** requirement definitions" from
Project-Brief-v3.pdf ([trust-content.tsx:52–55](../src/views/trust-content.tsx)).
Actions parses the same file: "**23** requirements; **14** review criteria"
([actions-content.tsx:72–74](../src/views/actions-content.tsx)). Feedback marks
"The project brief defines **14** requirements" as POSITIVE — "Accurate
requirement count … confirmed against Brief v3"
([feedback-content.tsx:51–54](../src/views/feedback-content.tsx)) — praising the
review-criteria number as the requirement count. The gap list is "2
(Fallback behavior, Cleanup behavior)" on /actions (:84, with "91.3% (21 of
23)") but four different items on /conversation
([conversation-content.tsx:444–455](../src/views/conversation-content.tsx)).
**Direction:** pick one fact sheet for the scenario (47 requirements, one gap
list, one coverage %) and reconcile every surface against it.

### F2 — HIGH · Common Criteria seed residue
The scenario was mechanically renamed from a smart-card security evaluation
and untranslated CC tokens render verbatim: `Families: "FCS, FDP, FPT, FAU,
FIA"` (CC SFR class IDs on a web portal's requirement-map.json,
[actions-content.tsx:169](../src/views/actions-content.tsx)); "additional test
for **CBC mode** validation" grafted onto a CSV/JSON export claim, with the
export workflow specified "for data encryption"
([trust-content.tsx:105–123](../src/views/trust-content.tsx)); scope option
`devicePP: "ACME SmartCard + Launch Policy v2"` labeled "Device Only"
(trust-content.tsx:260–269) — the product is a customer portal; no smart card
exists anywhere else.
**Direction:** purge the evaluation-lab vocabulary; re-derive these strings
from the portal story.

### F3 — HIGH · Mechanical-rename artifacts rendered verbatim
"Launch Policy v2 — **requirement requirements**"
([trust-content.tsx:273](../src/views/trust-content.tsx)); "the diagnostic
transparency required by activity review **(Activity Review)**"
([observability-content.tsx:1033](../src/views/observability-content.tsx));
"§5.1 — requirement Definitions" (trust:83); "Preferred release **tier
level**" (memory-content.tsx:57 + memory-review block:31); lowercase
replacements inside Title-cased sibling lists (actions:73–74, trust:229).
**Direction:** grep-audit every string containing "requirement"; read the
result aloud.

### F4 — MEDIUM · A fact asserted and negated on different pages
Feedback's canonical human correction says "enterprise release does **not**
require dedicated support coverage" ([feedback-content.tsx:63,
133–135](../src/views/feedback-content.tsx)); the sources page's top cited
excerpt asserts the opposite as ground truth
([sources-content.tsx:42–43](../src/views/sources-content.tsx), duplicated in
the source-backed-artifact block), and the actions approval email ships "with
dedicated support coverage" (actions:177).

### F5 — MEDIUM · Timing physics and copy-paste stamps
Home demo's parallel run header says `1s` while its longest child branch
takes `3.4s` ([demo-content.tsx:192 vs 35](../src/views/demo-content.tsx)) —
the exact `"10:44 AM · 1s"` string copy-pasted from actions-content.tsx:1056
(B5's finding, propagated). Every workbench agent message is hardcoded
"Worked for 27s" ([contextual-workbench.tsx:190](../src/components/ui/contextual-workbench.tsx),
two consecutive messages, ships in the registry copy too).

### F6 — MEDIUM · The workbench diff chip is Next.js scaffold filler
"2 files changed: `src/app/page.tsx +28 −2`, `src/styles.css +4 −1`"
([contextual-workbench.tsx:237–245](../src/components/ui/contextual-workbench.tsx))
inside a *non-coding* launch-readiness narrative whose own Diff surface edits
`Project_Brief_v3.md`.

### F7 — MEDIUM · The agent roster gets renamed on /observability
Site-wide crew is Source Collector / Requirements Mapper / Document Drafter
(34 mentions); the observability Session Timeline renames them "Review
Agent" / "Source Search" / "Timeline Logger"
([observability-content.tsx:218–251](../src/views/observability-content.tsx)),
and the run-monitor block invents "Coverage Mapper" doing Requirements
Mapper's exact role ([run-monitor.tsx:22–24](../registry/base-nova/blocks/run-monitor.tsx)).

### F8 — MEDIUM · example.com monoculture (13×) — the placeholder census stopped at ACME
Every email and source URL on the site is RFC-2606 example.com —
docs.example.com, git.example.com, project-team@example.com — including the
provenance demos whose whole point is believable sourcing, and the
distributable blocks ([sources-content.tsx:39,48,57](../src/views/sources-content.tsx),
demo-content.tsx:284, trust-content.tsx:1078, +7 more).

### F9 — LOW · Smaller coherence drips
- `Project-Brief-v3.pdf` vs `Project_Brief_v3.pdf` on the same /actions page
  (actions:72 vs :1773,1845); "ACME Customer Portal v3.1" vs "product
  Portal-v3" (trust:261 vs :1068).
- en-GB strings in an en-US product: "Analysing launch policy"
  (multi-agent:158), "requirement catalogue" (observability:100,193) vs
  "Analyzing…" (trust:1527) and "Behavior" headers everywhere.
- Cost demo prices output tokens at the input rate ($14.8/M vs $15.2/M
  implied) and implies ~780 tok/s generation
  ([trust-content.tsx:127–134](../src/views/trust-content.tsx)) — in the
  section teaching faithful cost disclosure.
- Web-URL sources cited with "Page 14"/"Page 21"
  ([sources-content.tsx:39,57](../src/views/sources-content.tsx) + block copy).

## G. Icon vocabulary contradictions (C6 was one case of a class)

### G1 — HIGH · The status vocabulary contradicts itself between components
StatusIndicator's header documents "one shape per state … clock (blocked),
alert (warning / error)" and maps blocked→Clock01Icon
([status-indicator.tsx:32–36, 78–85](../src/components/ui/status-indicator.tsx));
RunTrace maps **queued**→Clock01Icon and collapses blocked+warning+error into
one Alert01Icon ([run-trace.tsx:48–55](../src/components/ui/run-trace.tsx)) —
three icon-identical statuses. Bonus: site RunTrace spins (Loading03Icon) on
running; the registry copy users install pulses (Activity01Icon).

### G2 — HIGH · Activity01Icon carries four meanings — Brain01 ×2
(1) Feedback's nav identity ([navigation.ts:132](../src/content/navigation.ts))
on a page built entirely of thumbs icons; (2) agent-running
(trust:1519, registry run-trace:63); (3) live feed (observability:592);
(4) cost metering (trust:1728).

### G3 — MEDIUM · Individual misassignments
- AiBrowserIcon — the four-point AI-sparkle-on-a-browser cliché and the only
  sparkle glyph in the codebase — is the workbench's default Browser tab,
  while the same pane's URL bar uses plain BrowserIcon
  ([contextual-workbench.tsx:94 vs ~305](../src/components/ui/contextual-workbench.tsx));
  toolbar mixes text glyphs `‹ › ↻` with stroked icons.
- Tick01Icon (= "complete" in 41 other uses) is the workbench **Send** button
  (contextual-workbench.tsx:281–289); canonical send is ArrowUp02Icon
  (composer-toolbar.tsx:181).
- Expandable error-log rows use Clock01Icon as their only trailing icon — a
  status glyph where every sibling uses a chevron, next to an already-printed
  timestamp ([observability-content.tsx:931–966](../src/views/observability-content.tsx)).
- Alert01Icon as the healthy "Run monitor" template card's identity and the
  "Inspect" flow step; GitBranchIcon (= parallel/handoff elsewhere) stamps
  "Deliver" ([templates-content.tsx:84,208,229](../src/views/templates-content.tsx)).
- LOW: Shield01Icon as filler on a non-policy activity row
  (observability:77–82); two stroke-weight regimes at identical sizes —
  167× `1.5` vs 25× `1.7` confined to the newest components, rendering
  side-by-side on /sources.

## H. The distribution pipeline (entirely unexamined in round 1)

### H1 — HIGH · Shipped registry payloads predate every fix commit
`public/r/*.json` was last built at a186846, before all six audit-fix
commits. `npx shadcn add` serves the pre-audit components — Badge
double-encoding, pre-fix Observable Work — even where the registry source is
a symlink to the fixed file (verified byte-for-byte against
`git show a186846:`). `registry:build` exists in package.json; it was never
re-run.

### H2 — HIGH · …and rebuilding would break installs
1b05e28 made observable-work and agent-status-table import
`@/components/ui/status-indicator`, but **status-indicator was never added
to registry.json**, and those items' registryDependencies still list `badge`
(no longer used). Re-running `registry:build` produces unresolvable imports
for both components and the 5 blocks depending on them.

### H3 — HIGH · 7 physical registry copies drifted from the fixed site components
registry/base-nova/ui mixes symlinks with physical copies; action-preview,
artifact-document, effective-policy-preview, handoff-packet,
memory-ledger-item, run-trace, usage-meter all diverge — e.g. registry
action-preview is the old rounded boxes-in-boxes card with Badge pills and
lacks the `emphasis` prop; registry run-trace still renders Badge next to
timeline nodes ([registry/base-nova/ui/action-preview.tsx:42](../registry/base-nova/ui/action-preview.tsx) vs
[src/components/ui/action-preview.tsx:43](../src/components/ui/action-preview.tsx)).
**Direction for H1–H3:** make every registry/ui file a symlink, add
status-indicator to registry.json, fix registryDependencies, re-run
`registry:build`, and add a CI check that public/r/ matches a fresh build.

### H4 — MEDIUM · Spec/distribution mismatches
- "Pattern Pieces" lists wrong for 5 of 8 templates (lists components the
  blocks don't use, omits their structural surfaces —
  [templates.ts:38,66,150,234](../src/content/templates.ts)).
- The approval negative action is **Deny** in demos + the spec table,
  **Reject** in the shipped blocks, **Decline** in consent
  (actions:1993 vs approval-workflow.tsx:89 vs trust:1103).
- /registry's three copyable install commands hardcode
  `http://localhost:3000` ([registry-content.tsx:114–116](../src/views/registry-content.tsx)),
  contradicting README.md:132's own guidance.
- README's "Current registry items" lists 17 of 18 — contextual-workbench
  missing (README.md:83–109).

## I. Navigation & structure

### I1 — HIGH · Two sidebar anchors are silently dead
navigation.ts:43 links "Source-Backed Artifact" but /templates has no such
section (7 sections, not 8); navigation.ts:113 uses id
`memory-context-ring` while the section is `id="context-ring"`
([memory-content.tsx:938](../src/views/memory-content.tsx)). scrollToSection
no-ops on missing ids ([app-sidebar.tsx:84–104](../src/components/app-sidebar.tsx)),
so both clicks scroll nowhere with no error. Related LOW: cross-page anchor
scrolling races a bare 100ms setTimeout with no retry (app-sidebar.tsx:101).

### I2 — MEDIUM · No not-found.tsx anywhere, but notFound() is called
Bad template slugs render the framework-default "404 | This page could not
be found" inside the custom shell
([template-detail-content.tsx:21](../src/views/template-detail-content.tsx)) —
failing the site's own /registry quality gate ("error states are documented
or shown").

### I3 — MEDIUM · Naming and casing conventions split by page
One template is "Background Run Monitor" (sidebar, canonical title,
metadata) / "Run Monitor" (section h2) / "Run monitor" (index card on the
same page); registry.json titles drop hyphens ("Source Backed Artifact",
"Multi Agent Handoff"). /sources, /registry and the /templates index cards
use sentence-case headers while the seven pattern pages use Title Case —
both visible on /templates simultaneously (templates-content.tsx:47 vs 318).

### I4 — LOW · Page metadata formulaic where present, absent on 10 of 18 routes
/sources, /registry, and all 8 template detail pages export title-only
metadata and inherit the home description; the seven pattern pages share the
machine-regular template "Reference patterns for X, Y, and Z" — each one a
triad (A3's tell, in metadata).

## J. Accessibility (a dimension round 1 skipped entirely)

- **J1 — MEDIUM · No live regions.** Exactly one aria-live exists in the
  codebase. "Feedback recorded" (auto-dismissed in 2.5s), "Approved —
  sending email…", "Decision confirmed…" are all plain divs — the reference
  implementations of these patterns are silent to screen readers
  (feedback-content.tsx:207,671; demo-content.tsx:308; actions-content.tsx:1319,1689).
- **J2 — MEDIUM · Focus dropped on the core interaction.** Approve/Deny,
  decision options, and the correction form all unmount the focused control
  on activation with no focus target (demo-content.tsx:288,
  actions-content.tsx:1256, trust-content.tsx:1081, feedback-content.tsx:341).
- **J3 — MEDIUM · ToolCall "running" is a pulse and nothing else** — no text,
  no aria-busy; the pulse stops after 3 cycles (6s) and is disabled under
  prefers-reduced-motion, leaving running ≈ complete
  ([tool-call.tsx:117](../src/components/ui/tool-call.tsx), composer.css:101).
  Ships in the registry copy.
- **J4 — MEDIUM · Handoff active/pending dots differ only by pulse + gray
  value** (multi-agent-content.tsx:549) — hand-rolled instead of using
  StatusIndicator, violating its own "never relies on color alone" contract;
  reduced-motion strips the pulse.
- **J5 — LOW · ToolTree timestamp is hover-only** (no focus-within, hidden on
  touch — tool-tree.tsx:137) while sibling components implement the
  focus-within variant. **J6 — LOW · Nested `<main>` landmarks** —
  SidebarInset renders `<main>` and layout nests `main#main-content` inside
  it (sidebar.tsx:306, layout.tsx:93,101).

## K. Leftover fingerprints & runtime defects

- **MEDIUM · D7 is incomplete:** a second verbatim "Was this helpful?"
  thumbs row lives on /conversation, floating *outside* the Progress Steps
  demo container ([conversation-content.tsx:735–760](../src/views/conversation-content.tsx)).
  Removing only the home one leaves the fingerprint.
- **MEDIUM · Dead citation superscripts on the flagship demo:** home's
  `<sup>1</sup>`/`<sup>2</sup>` cite nothing and are the page's only inert
  element under a header promising "Every pattern below is interactive"
  (demo-content.tsx:170 vs the real implementation at sources-content.tsx:98).
- **MEDIUM · The streaming cursor renders on its own empty line** — the span
  sits after `</p>`, so a lone bar floats below the text for 2s on every
  home load, both themes (demo-content.tsx:178–182).
- **MEDIUM · Hydration mismatch for every returning themed user:** theme
  state initializes from localStorage in the useState initializer and
  app-sidebar renders theme-dependent variant/aria-pressed during SSR —
  React logs the unpatchable-attributes hydration error on every page load
  once a non-default theme is stored (theme-provider.tsx:112,
  app-sidebar.tsx:56).
- **LOW · Spec residue:** the Agent Cards table documents an "Awaiting
  instructions" placeholder the demo's idle state doesn't use — the table
  recommends the generic phrase while the demo above ships better copy
  (multi-agent-content.tsx:447 vs 62–76).

## Refuted in verification (for transparency)

- "unlock higher levels" ×2 in one section — nitpick, not marketing register.
- Memory panel empty state as a second D9 — defensible variation.
- Primitive truncation without tooltips — evidence didn't hold as stated.
- Muted-foreground contrast failures — already covered by round 1's scope.

## Still unexamined after both rounds

1. **Perf/bundle:** all 12 views are `"use client"` monoliths (trust is
   2,179 lines); every route ships ~1 MB uncompressed JS; prose ships twice
   (HTML + hydration strings). Measured via `next build` — never audited.
2. **Tab/share surface:** no favicon, no OG/Twitter metadata, no
   robots/sitemap; `public/vite.svg` + `src/assets/react.svg` are dead Vite
   scaffold residue.
3. **Locale variance:** `Intl.NumberFormat(undefined)` and
   `toLocaleString()` in statically prerendered pages bake the build
   machine's locale into HTML — a second hydration-mismatch class for
   non-en-US visitors (agent-status-table.tsx:61, observability:608+).
4. **Real input never exercised:** memory CRUD's Save discards what you
   typed and reverts to the hardcoded value (`editValue` is read nowhere —
   memory-content.tsx:198,614,621) — on the page teaching memory editing.
5. **Print/PDF:** zero print styles; fixed sidebar overprints content on the
   checklist-style pages people would print.
6. **Dev residue:** composer onSend is `console.log("send:", text)`
   (InteractiveComposer.tsx:283); "Paste from clipboard", "Add connector",
   "Web search" menu items have no onClick while their two siblings do.
