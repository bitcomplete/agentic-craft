---
name: Agentic Craft
description: Reference guide for agentic product UI with a downstream-safe shadcn registry
scopes:
  cross_cutting: Product and behavior principles shared by the site and registry
  registry: Redistributable shadcn components that inherit the consumer's theme
  site: Agentic Craft's own editorial visual identity
site_identity:
  name: The Galley Proof
  typography: Signifier for authored agent prose, PP Neue Montreal for product apparatus
  color: Achromatic ink-on-white or dark equivalent; chroma reserved for state semantics
registry_contract:
  default_custom_color_tokens: 0
  default_custom_font_tokens: 0
  distribution: npx shadcn add
---

# Design: Agentic Craft

Agentic Craft has two surfaces that must not be treated as one design system.

- **The site** is the reference guide: pages, IA, demos, callouts, kickers,
  editorial rhythm, and the Galley Proof visual language.
- **The registry** is the redistributable shadcn package: components installed
  into another team's repository, where their theme, radius, fonts, motion
  preferences, and icon conventions are the source of truth.

The site may have a strong visual point of view. The registry must be a
well-mannered guest. Shared rules are behavioral: what the interface reveals,
which affordances are honest, how work is made observable, and what contracts
users can trust.

## A. Cross-Cutting Product Principles

These principles apply to Agentic Craft as a reference guide and to the
registry components as product patterns. They are not visual prescriptions for
downstream shadcn consumers.

### A1. The AX Shift

This is a design system for the apparatus around an agent, not just the
surface of a feature. The core design problem is **agent experience**: how a
human understands, directs, constrains, verifies, and interrupts work performed
by software with partial autonomy.

Agent UI is therefore judged by whether the user can answer five questions:

- What is the agent doing now?
- What evidence or memory is it using?
- What will happen if I let it continue?
- What can I change before the action becomes real?
- What did this cost, and how confident should I be?

### A2. Honest Affordances

Nothing may look interactive that is not interactive. No dead rows with
`cursor-pointer`, no hover treatment on non-links, no disclosure chrome on
empty payloads, and no demo controls that leave the specimen unchanged.

Controls must state their real scope. A "retry" control retries a named step,
not an invisible chain of side effects. A "send" control submits the visible
composer payload, not hidden attachments the user cannot inspect.

### A3. Observable Work

Agent work is a first-class interface object. Tool calls, queued work, running
steps, blocked steps, completion, error, elapsed time, and parallel children
must be visible in a stable structure.

The signature behavior is quiet but explicit:

- Queued, running, blocked, complete, and error states use distinct shape or
  copy; color alone never carries status.
- Tool rows expose details only when details exist.
- Parallel work uses explicit child structure, not a flattened log.
- Timestamps, token counts, costs, and durations use tabular numerals.
- Ambient progress is finite and reduced-motion safe.

### A4. Locked Previews

An agent may draft, stage, or preview work without making it real. The preview
must show what is locked, what can still change, and what action will commit it.

Locked previews are not disabled-looking screenshots. They are inspectable
payloads with clear ownership: pending action, affected object, reversible or
irreversible consequence, rollback path when available, and a visible commit or
reject control.

### A5. Autonomy Is a Contract

Autonomy is not a vague setting. It is a contract between user and system.
Every autonomous mode should say what the agent may do, what it must ask before
doing, what evidence it must show, and how the user can interrupt it.

Use explicit levels when the surface benefits from a spectrum:

- Suggest: the agent proposes, the user acts.
- Recommend: the agent ranks options and explains tradeoffs.
- Execute with confirm: the agent prepares the action and asks.
- Execute: the agent acts inside known bounds.
- Initiate: the agent starts work proactively under a standing policy.

Higher autonomy requires stronger observability, stronger provenance, and more
obvious interruption.

### A6. Provenance Is Part of the Answer

Sources, artifacts, connector state, and cited memory should be attached to the
work they support. A claim without a reachable source is a weaker claim.

Provenance should be inspectable without becoming decorative chrome. Prefer
compact source rows, artifact summaries, and source-backed excerpts over large
badges or ornamental "trusted" marks.

### A7. Memory Is a Ledger

Memory surfaces must distinguish working context, session memory, and durable
memory. Users need to see what was remembered, why it matters, where it came
from, and how to remove or correct it.

Do not render memory as magic. A memory item is a record with provenance,
freshness, scope, and consequence.

### A8. Cost Is Telemetry

Cost and usage are not billing afterthoughts; they are operational telemetry.
Show them where they help users steer work: before expensive actions, during
long-running work, and after completion.

Cost surfaces default to quiet presentation: tabular numerals, right-aligned
when in tables, muted by default, and precise enough to be credible. Use alarm
treatment only when a threshold or budget state has actually been crossed.

### A9. Confidence Is Qualitative First

Confidence is most useful as a decision aid, not a decorative percentage.
Prefer qualitative states tied to next actions: low confidence asks for review,
medium confidence asks for confirmation or evidence expansion, high confidence
can proceed inside the autonomy contract.

Numeric confidence appears only when the underlying system provides a real
score and the UI explains what the score means.

### A10. Multi-Agent Identity

Multiple agents are identified by name, role, and a monochrome mark or monogram,
not by color alone. Color is too overloaded with state semantics and too brittle
across themes.

An agent identity should stay stable across status changes. Status belongs to
the row, glyph, copy, or progress surface; identity belongs to the actor.

## B. Registry Contract

The registry ships through shadcn into someone else's application. Components
in `registry/base-nova/` must inherit the consumer's shadcn configuration:
their tokens, fonts, radii, dark mode, icon library, and motion preferences.

This section is the review checklist for every registry change.

### B1. Downstream-Safe Defaults

Registry components may use these shadcn semantic tokens and their foreground
variants:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--chart-*` and `--sidebar-*` only when the component is truly a chart or
  sidebar surface

Use Tailwind utilities that resolve through those tokens: `bg-background`,
`text-foreground`, `border-border`, `text-muted-foreground`, `bg-muted`,
`ring-ring`, and equivalent semantic classes.

Default custom token budget:

- **Zero custom color tokens.**
- **Zero custom font tokens.**
- **No custom radius tokens.**

If a state can be expressed by shape, copy, weight, order, motion, or a base
shadcn token, do that instead of adding a token.

### B2. Forbidden Registry Leaks

Registry components must not import from site code or depend on site utilities.

Allowed imports:

- `@/components/ui/*`
- `@/lib/utils`
- local files inside the same registry item or registry family

Forbidden imports:

- `src/views/*`
- `src/content/*`
- site components outside `src/components/ui/*`
- site-only helpers that encode page IA or editorial styling

Forbidden site-only classes in `registry/`:

- `.agent-prose`
- `.section-label`
- `.principle-num`
- `.page-section`
- `.agent-detail-reveal`
- `.wf-phase-pulse`
- `.actions-slide-in`
- `.route-expand`
- `.feedback-flash`
- `.memory-press`
- `.memory-ring-fill`
- `.conv-slide-in`
- `.demo-slide-in`
- `.trust-press`
- `.ma-pulse`
- `.mon-pulse`

If a registry item needs a class, the class must ship with that registry item
through `css` or be replaced by semantic Tailwind utilities.

### B3. `cssVars` and `css`

Custom CSS is allowed only when the component cannot be expressed with base
shadcn tokens and utilities.

Use `cssVars` for genuine variables:

```json
{
  "cssVars": {
    "light": {
      "--agentic-example": "var(--muted-foreground)"
    },
    "dark": {
      "--agentic-example": "var(--muted-foreground)"
    }
  }
}
```

Reference custom variables with a fallback to a base token:

```tsx
<span
  style={{ background: "var(--agentic-example, var(--muted-foreground))" }}
/>
```

Use `css` for registry-shipped keyframes, layers, and component-scoped
utilities:

```json
{
  "css": {
    "@keyframes agentic-status-pulse": {
      "0%, 100%": { "opacity": "1" },
      "50%": { "opacity": "0.4" }
    }
  }
}
```

Every named animation must include a reduced-motion path in the installed CSS
or in the component classes.

### B4. Wrap shadcn Primitives

If shadcn already provides the primitive, wrap or compose it instead of
reimplementing it. Add the primitive to `registryDependencies` so installation
brings the dependency along.

Expected wrappers include:

- `Button`
- `Dialog`
- `Collapsible`
- `Progress`
- `Table`
- `Tabs`
- `ToggleGroup`
- `Tooltip`
- `DropdownMenu`
- `Sheet`
- `Field`
- `InputGroup`
- `Textarea`
- `Switch`
- `Badge`
- `Alert`

Custom primitives are appropriate only when shadcn does not own the behavior
or when the component is an Agentic Craft pattern primitive, such as
`StatusIndicator`, `ReferenceItem`, or `ObservableWork`.

### B5. The `observable-work` Details Exception

`observable-work` may use native `<details>` by design. This is the signature
JS-free disclosure primitive: it remains accessible, works without client
state, and exposes the open state to CSS.

The exception is narrow:

- Use `<details>` only for observable-work style step details.
- Render a plain non-interactive row when no detail content exists.
- Keep focus, hover, and pointer treatment off empty rows.
- Move any animation needed for the open state into that registry item's
  `css` block.

Other disclosure components should wrap shadcn `Collapsible`.

### B6. Generative UI Discipline

Registry components are intended to be safe building blocks for agent-authored
or schema-authored UI. That requires structured contracts.

Required:

- Prefer typed data props over arbitrary `children` slots.
- Keep rendering deterministic for the same props.
- Avoid hidden state that changes the meaning of the component across renders.
- Make default empty, loading, error, and complete states explicit.
- Provide accessible labels for generated controls.
- Degrade to useful text if rich content is unavailable.

Avoid broad "bring any JSX" APIs unless the component is explicitly a layout
shell. Generative systems can fill a schema; they cannot reliably author an
opaque component tree.

### B7. Composer Architecture

The composer is the primary input surface and should remain a composed system
of islands:

- **Input:** the text area or prompt field, with auto-grow and stable submit
  behavior.
- **Attachments:** files, sources, connectors, and staged context.
- **Toolbar:** mode, model, autonomy, and tool controls.
- **Suggestions:** follow-ups, completions, or repair prompts.

Each island must be independently dismissable when dismissing is supported.
When an island appears, focus stays in the input unless the user explicitly
opens the island. Dynamic additions should be announced through `aria-live`
without stealing focus.

Keyboard behavior is part of the component contract: submit, newline, escape,
tab order, and disabled states must be documented in props or examples.

### B8. Multi-Agent Identity Prop Contract

Multi-agent registry components should use a structured identity object:

```ts
type AgentIdentity = {
  id: string
  name: string
  role?: string
  mark?: React.ComponentType<{ className?: string; "aria-hidden"?: true }>
  initials?: string
}
```

Rules:

- `name` is the accessible identity.
- `role` explains responsibility, not current status.
- `mark` or `initials` is monochrome by default and inherits current text color.
- Status is a separate prop or field, never encoded only in the identity mark.
- Components may accept icon slots; they must not require the site's icon
  family or stroke width.

### B9. Cost, Confidence, and Empty States

Cost props should be structured when the component formats values, or explicit
formatted strings when an upstream system owns formatting. Display cost with
tabular numerals, quiet contrast, and alignment that supports comparison.

Confidence props should prefer qualitative states:

```ts
type ConfidenceLevel = "low" | "medium" | "high"
```

Numeric confidence is optional and source-backed:

```ts
type Confidence = {
  level: ConfidenceLevel
  score?: number
  explanation?: string
}
```

Empty states inside registry components use:

- optional kicker
- short heading
- one-line muted description
- optional single primary action

Do not use large illustrations, large decorative icons, or marketing-style
empty-state copy inside registry components.

### B10. Theme, Type, Radius, Icons, and Motion

Registry components must not assume the Agentic Craft site theme.

Required:

- Use semantic radius classes (`rounded-sm`, `rounded-md`, `rounded-lg`) rather
  than `rounded-[10px]` or other fixed radii.
- Use the consumer's font stack. `font-serif` and `font-mono` are allowed only
  when the component explicitly opts into that voice through a documented prop
  or a narrow semantic role such as code, timestamps, or tabular telemetry.
- Use the consumer's icon library conventions when icons are provided as slots.
  Do not hardcode the site's icon stroke width as a registry rule.
- Use Tailwind transition and duration utilities rather than inline transition
  literals.
- Use visible focus rings based on `--ring`.
- Respect `prefers-reduced-motion` for every animation.

Forbidden:

- raw `oklch()` or hex color literals in component code
- site-only `dark:` color overrides that bypass tokens
- `transition-all`
- clickable `<div>`s
- decorative gradient text, glow, glassmorphism, or AI-demo chrome

### B11. Registry Fixture Data

Registry demos and block fixtures should read like plausible telemetry:
staggered durations, odd counts, believable names, source paths or page
references that match the medium, and no placeholder company names such as
ACME.

Example data is part of the contract because it teaches consumers what the
component is for.

## C. Site Visual Identity

This section applies to `app/`, `src/views/`, `src/content/`,
`src/components/app-sidebar.tsx`, and site-only portions of `src/index.css`.
It does not apply to redistributable registry components unless those
components are being rendered on the Agentic Craft site.

### C1. Creative North Star: The Galley Proof

A publication at final proofing: monochrome ink on white, every claim checked,
every numeral tabular, the author's voice set in serif against the apparatus
of sans-serif instrumentation. The interface is the proofing table: quiet,
flat, ruled with hairlines and dashed section breaks. The agent's words are
the manuscript on it. Two voices, one page: the product speaks PP Neue
Montreal; the agent speaks Signifier. Nothing glows, nothing bounces, nothing
pretends.

The site explicitly rejects AI-demo chrome: glowing gradients, sparkle icons,
chat-bubble theater, spinners on tool calls, oversized rounded everything, and
fabricated demo tells such as round numbers, identical timestamps, and
placeholder company names.

### C2. Two Voices

PP Neue Montreal carries the apparatus: navigation, controls, labels, tables,
metadata, forms, sidebars, and page chrome.

Signifier appears in two roles:

- page-title display
- authored agent prose via `.agent-prose`

The serif is a voice, not a garnish. Do not set product chrome in serif. Do not
set authored agent prose in sans. Do not introduce a third family.

Site hierarchy:

- Display: page titles only, light serif, balanced wrapping.
- Headline: sans section headings.
- Title: compact sans titles inside demos.
- Body: sans interface prose.
- Agent prose: serif, readable measure, used only for the agent's own words.
- Label: uppercase sans kicker through `.section-label`.

### C3. Ink Rule

The site is achromatic. Chroma is semantics: if an element is colored, it is
making a claim about state such as ok, caution, destructive, or budget
threshold.

Decorative color is prohibited on the site. Icons are monochrome. State colors
are tokenized at the site layer and should not be scattered as raw color
literals.

This is a site editorial rule. Registry consumers are allowed to have their
own color voice; registry components must render correctly inside it.

### C4. Hairline Rule

Site depth is drawn, not cast. Hierarchy comes from 1px hairline borders,
one-step tonal seams, dashed section rules, spacing, and typography.

Shadows are reserved for real overlays: dropdown menus, dialogs, popovers, and
temporary floating surfaces. Demo frames, cards, tables, and at-rest content
surfaces are shadowless.

Use a 1px rule or a tonal step before reaching for heavier borders. A thicker
left rule may be used only as a deliberate editorial callout recipe, not as a
default structural accent.

### C5. Calibrated Motion

Site motion is precise and quiet:

- state transitions: 150ms
- reveals and entrances: 180-300ms
- easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- press feedback: never scale below 0.95
- ambient loops: rare, finite, and reduced-motion safe

The highest-frequency action, such as send, gets no flourish. Motion clarifies
state; it does not entertain.

### C6. Buttons, Inputs, and Controls

Site controls read as calibrated instruments: small, precise, honest about
state, and never decorative.

- Buttons are compact, gently rounded, and use the site action color.
- Ghost buttons are appropriate for icon-only header or tool controls and
  require `aria-label`.
- Destructive actions use restrained destructive treatment, not a solid red
  marketing button.
- Inputs use hairline strokes, transparent backgrounds, iOS-safe text sizing,
  and visible focus rings.
- Pattern controls use compact chips or segmented controls whose active state
  visibly changes the specimen.

The registry may wrap the same shadcn primitives, but these visual recipes are
site recipes.

### C7. Callouts and Kickers

The `.section-label` kicker is the site's single eyebrow device. It should map
to real navigation or page structure, not act as generic ornament.

Allowed kicker uses:

- top-of-section labels that match sidebar or page structure
- compact table or specimen labels where the label clarifies the apparatus

Forbidden kicker uses:

- stacked eyebrows above every heading
- fake numbered markers
- decorative badges that duplicate nearby copy

Italic callouts are allowed when they state a rule the specimen cannot show.
They should be rare, short, and editorial. A page should not lean on callouts
to explain what the visual example failed to teach.

### C8. Page Rhythm

The site teaches through one strong specimen at a time. Sections should have
generous rhythm, comfortable prose measure, and a clear relationship between
principle, example, and code.

Default page pattern:

- short thesis
- interactive specimen or worked example
- concise explanation
- anti-patterns or tradeoffs when useful
- components or registry links when relevant

Spec tables appear only when they encode non-visible contract: timings,
keyboard behavior, state rules, installation details, or accessibility rules.

### C9. IA Direction

The site is a reference guide with code distribution, not a component catalog.

Target IA:

- **Thesis:** the homepage states what the guide is and points into the system.
- **Principles:** the cross-cutting ideas from the research, short and
  citable.
- **Patterns:** visual cards for concepts such as Observable Work, Locked
  Preview, Autonomy Contract, Provenance, Memory Ledger, Composer, Confidence,
  Cost, and Multi-Agent Identity.
- **Use Cases:** composed product surfaces that show patterns working together.
- **Registry:** searchable code distribution, linked from pattern cards and use
  cases.

Pattern cards should be visual-first. The worked example carries the argument;
prose supports it.

### C10. Site Demo Data

Demo data is part of the design. It must read like real telemetry: staggered
durations, plausible names, odd counts, believable paths, source locations that
match the artifact type, and copy that sounds like product work rather than a
placeholder script.

Avoid generic AI copy, repeated CTA roles, exposed internal craft rules on
public pages, redundant provenance strips, and anything that makes the page
feel like a fixture dump.

## Changelog

### 2026-06-15

- Split `DESIGN.md` into cross-cutting product principles, a downstream-safe
  registry contract, and site-only visual identity.
- Moved the Galley Proof, Two Voices, Ink, Hairline, and Calibrated Motion
  rules to the site scope so they cannot be mistaken for registry constraints.
- Added the registry checklist for shadcn-safe tokens, `cssVars`/`css`,
  primitive wrapping, generative UI, composer architecture, multi-agent
  identity, cost, confidence, empty states, and the `observable-work`
  `<details>` exception.
