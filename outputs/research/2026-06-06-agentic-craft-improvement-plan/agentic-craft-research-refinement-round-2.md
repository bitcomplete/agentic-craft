# Agentic Craft Research Refinement Round 2

Date: 2026-06-06
Purpose: improve all six research weak points before implementation
Scope: design and development only

## Completion Read

This round improves the six weak points called out after Round 1:

1. More visual evidence: added a saved reference screenshot set and concrete visual takeaways.
2. Better pattern taxonomy: upgraded taxonomy from route grouping to product-state architecture.
3. Registry-first research: added CLI evidence, current registry shape, missing dependency evidence, and packaging decisions.
4. More mobile-specific references: added mobile requirements for composer, clarifying questions, citations/source previews, and spec tables.
5. Figma reference extraction: retried Figma nodes; saved usable Templates and shadcn Pro Blocks screenshots; documented the Components-node limitation.
6. Implementation scoring: upgraded scoring from priority only to impact, evidence, dependency, registry leverage, confidence, and recommended slice.

This does not implement the product changes. It closes the research gap enough to start the first build slice without guessing.

## Evidence Added

### Visual Evidence Folder

Saved at:

- `outputs/research/2026-06-06-agentic-craft-improvement-plan/visual-evidence-round-2/`

Files captured:

- `fluid-input-message.png`
- `fluid-ask-user-questions.png`
- `fluid-thinking-steps.png`
- `ai-elements-prompt-input.png`
- `ai-elements-sources.png`
- `copilotkit-hitl.png`
- `copilotkit-tool-rendering.png`
- `agentic-craft-templates.png`
- `agentic-craft-observability-mobile.png`
- `manifest.json`

### Figma Evidence Folder

Saved at:

- `outputs/research/2026-06-06-agentic-craft-improvement-plan/figma-evidence-round-2/`

Files captured:

- `agentic-design-system-templates-node-230-839.png`
- `shadcn-pro-blocks-node-580-9181.png`

Figma limitations:

- `AGENTIC DESIGN SYSTEM` Components node `6:7` / `6-7` returned 1x1 empty screenshots.
- `get_design_context` still failed with "select a layer first" even with explicit node IDs.
- Useful result: templates and shadcn Pro Blocks are now captured; Components still needs either desktop selection or a deeper nested node URL.

## 1. Visual Evidence Is Better

Round 1 had source links and text extraction. Round 2 adds local screenshots and direct visual observations.

### Fluid InputMessage

Evidence:

- `visual-evidence-round-2/fluid-input-message.png`

Visible takeaways:

- The docs use a compact central demo surface with Preview/Code tabs.
- The component is sold as an installable shadcn registry item, not only a design idea.
- The right configuration card exposes theme, radius, icon, and primitive choices. This is useful as a pattern: "make it yours" should be configuration metadata, not page prose.

Borrow:

- registry-first install line;
- compact demo framing;
- configurable primitive choices;
- controlled composer API.

Avoid:

- do not copy the same empty vertical demo framing if our demo needs to show product state immediately.

### Fluid AskUserQuestions

Evidence:

- `visual-evidence-round-2/fluid-ask-user-questions.png`

Visible takeaways:

- A question flow can be one focused object in a large demo area.
- The live card sits near the bottom of the demo frame, which helps imply sequence, but our implementation should not hide the important part below the fold on mobile.

Borrow:

- one question at a time for narrow screens;
- progress counter;
- structured options;
- skip/default support.

Avoid:

- burying the live card too low in a tall demo frame on mobile.

### Fluid ThinkingSteps

Evidence:

- `visual-evidence-round-2/fluid-thinking-steps.png`

Visible takeaways:

- It has a useful shape: parent label, nested source steps, completion row.
- It is visually spare and stateful, with just enough hierarchy.

Borrow:

- nested source/event hierarchy;
- active/complete/pending progression;
- detail disclosure.

Avoid:

- "Thinking" / chain-of-thought language. Agentic Craft should call this `Observable Work` or `Run Trace`.

### AI Elements Prompt Input

Evidence:

- `visual-evidence-round-2/ai-elements-prompt-input.png`

Visible takeaways:

- Prompt input is framed as a form-like product component, not a chat bubble.
- The control row is compact: plus, search/tool, model, send.
- The docs explicitly position attachments, textarea, submit button, and model dropdown as one component family.

Borrow:

- form-owned prompt input;
- tool/model controls in footer;
- compact send button;
- button tooltips;
- attachment-first API.

Avoid:

- treating model/tool controls as demo decoration if our reference guide is about agentic product state.

### AI Elements Sources

Evidence:

- `visual-evidence-round-2/ai-elements-sources.png`

Visible takeaways:

- Sources are a first-class component, not just inline superscripts.
- The trigger says "Used 3 sources" before showing the source content.

Borrow:

- source trigger as response companion;
- source content as structured disclosure;
- source list separate from inline markers.

Avoid:

- only showing citation numbers without a companion source surface.

### CopilotKit Tool Rendering

Evidence:

- `visual-evidence-round-2/copilotkit-tool-rendering.png`

Visible takeaways:

- The page frames tool calls as custom UI components for arguments, live status, and eventual result.
- It explicitly rejects raw JSON as the user-facing shape.

Borrow:

- tool calls should render custom cards;
- actions must show arguments, status, and result;
- use rendered UI per tool where consequence differs.

Avoid:

- generic activity rows as the main Actions page specimen.

### Current Agentic Craft Templates

Evidence:

- `visual-evidence-round-2/agentic-craft-templates.png`

Visible takeaways:

- The page has the right content inventory but still reads as a directory.
- Cards use similar weight and rhythm; no card communicates state sequence or workflow shape.
- The sidebar shows Templates as a section, but not as the product flagship.

Borrow from ourselves:

- current template titles and descriptions are useful.
- current primitives list is useful metadata.

Change:

- add flow previews;
- add state chips;
- add registry type/install affordance;
- make card layout less generic.

### Current Agentic Craft Observability

Evidence:

- `visual-evidence-round-2/agentic-craft-observability-mobile.png`

Visible takeaways:

- Capture landed in desktop viewport despite mobile query param, which reinforces that query strings are not enough for responsive QA. Browser viewport must be set explicitly.
- Observability is visually clean but still passive: it shows activity, not incident response or threshold-driven monitoring.

Change:

- add explicit mobile viewport capture to QA scripts;
- add anomaly/threshold/trace story;
- make filters and drill-down more visible.

## 2. Pattern Taxonomy Is Better

Round 1 taxonomy grouped routes. Round 2 upgrades this into a product-state architecture.

### Product-State Taxonomy

| State Family | User Anxiety | Product Object | Primary UI Shape | Existing Route | New Primitive/Block |
| --- | --- | --- | --- | --- | --- |
| Intent Capture | Will the agent understand the task and sources? | user request, files, tools, scope | composer with file/tool lifecycle | Conversation | `Composer`, `FileLifecycle` |
| Clarification | Will the agent invent requirements? | missing decision | focused question card | Actions/Templates | `ClarifyingQuestions` block |
| Observable Work | Is work actually happening, and what sources are touched? | task, source, event | step trace / task queue | Conversation/Observability | `ObservableWork`, `RunTrace` |
| Consequential Action | What will change if I approve? | pending tool/action payload | locked preview + decision controls | Actions | `ActionPreview`, `DecisionSurface` |
| Provenance | Can I verify the answer? | source, citation, memory origin | source preview/list | Conversation/Memory | `SourcePreview` |
| Durable Memory | What will be remembered and where will it apply? | memory record | provenance ledger | Memory | `MemoryLedgerItem` |
| Policy | What is the agent allowed to do later? | autonomy/data/approval settings | settings + effective policy | Trust | `EffectivePolicyPreview` |
| Monitoring | What is happening in the background? | run, trace, cost, alert | trace feed + threshold | Observability | `RunTrace`, `AgentStatusTable` |
| Handoff | Who owns the work now? | handoff packet | ownership lane/card | Multi-Agent | `HandoffPacket` |
| Feedback | How will correction affect future behavior? | feedback event | correction + consequence preview | Feedback | `FeedbackConsequence` |
| Workflow Template | How do these pieces compose? | full agentic journey | flow map + states | Templates | `TemplateFlowPreview`, registry block |

### Taxonomy Decision

Use the state-family taxonomy to drive implementation, not the current route names. Routes can remain stable, but each route should show which state family it teaches. This avoids overfitting to "Conversation" as the central route.

## 3. Registry-First Research Is Better

### Current Registry Evidence

Command results:

- `curl http://localhost:3000/r/registry.json` returns 9 items.
- `npx shadcn@latest list http://localhost:3000/r/registry.json` succeeds.
- `npx shadcn@latest view http://localhost:3000/r/composer.json` succeeds.
- `npx shadcn@latest view http://localhost:3000/r/observable-work.json` succeeds.

Current registry items:

- `composer`
- `tool-call`
- `tool-tree`
- `reference-item`
- `observable-work`
- `decision-surface`
- `file-lifecycle`
- `agent-status-table`
- `clarifying-questions`

### Registry Gap Found

Static dependency check found:

```text
composer: undeclared UI imports -> composer-input, composer-toolbar, composer-islands, composer-attachments, composer-suggestions, textarea, tooltip
```

Interpretation:

- The composer registry item includes local composer subfiles, so subfile imports are okay.
- `textarea` and `tooltip` should be declared as registry dependencies or included as files.
- This is exactly the kind of distribution issue we need to catch before public registry release.

### Registry Packaging Decisions

Primitives should remain `registry:ui`:

- `composer`
- `observable-work`
- `decision-surface`
- `reference-item`
- `clarifying-questions`
- `agent-status-table`
- `file-lifecycle`
- `tool-call`
- `tool-tree`

New primitives should be `registry:ui`:

- `source-preview`
- `action-preview`
- `effective-policy-preview`
- `memory-ledger-item`
- `handoff-packet`
- `run-trace`
- `template-flow-preview`

Workflow templates should be `registry:block`:

- `review-workflow`
- `approval-workflow`
- `clarifying-workflow`
- `memory-review`
- `run-monitor`
- `multi-agent-handoff`
- `agent-settings`

Docs/conventions should ship as files:

- `docs/agentic-craft/pattern-taxonomy.md`
- `docs/agentic-craft/agentic-state-model.md`
- `docs/agentic-craft/accessibility-targets.md`
- `scripts/audit-agentic-ui.mjs`

### Registry Definition Of Done

Before public distribution:

- `npx shadcn@latest list` passes.
- `npx shadcn@latest view` passes for every item.
- each item declares all direct shadcn UI dependencies.
- every block installs into a throwaway app.
- generated app builds.
- registry descriptions explain product purpose, not only component shape.

## 4. Mobile-Specific References Are Better

### Mobile Composer

Research sources:

- Fluid InputMessage
- AI Elements Prompt Input
- assistant-ui Composer
- current Agentic Craft composer feedback

Decision:

- Composer mobile should be treated as an input appliance, not a mini desktop card.

Requirements:

- placeholder 13-14px;
- visible button 32px, touch target 40px;
- compact toolbar padding;
- controlled value;
- click-to-focus shell;
- send gated by value/files;
- attachment lifecycle visible;
- chip rail for suggestions, not equal-width grid;
- no truncation of critical suggestion labels unless a full title is available on focus/press.

### Mobile Clarifying Questions

Research sources:

- Fluid AskUserQuestions
- CopilotKit HITL
- AG-UI interrupts

Decision:

- On mobile, clarifying questions should be a focused stepper, not a multi-question form block.

Requirements:

- show one question at a time below 640px;
- show progress like `Question 1 of 3`;
- options are full-width rows with title and short description;
- support skip/default;
- support "other" input;
- answer state is controlled;
- submit/resume button is separate from option selection when the answer has consequences.

### Mobile Source Preview

Research sources:

- AI Elements Sources
- OpenAI Search citation hover/source panel behavior
- user-provided citation reference image

Decision:

- Desktop can use popover/anchored preview.
- Mobile should use bottom sheet or inline expansion, not hover.

Requirements:

- citation marker opens a bottom sheet on touch;
- bottom sheet includes source title, snippet, page/location, previous/next, open source;
- target controls 40px;
- source list is available below the answer;
- source preview component can be reused by Memory provenance.

### Mobile Spec Tables

Research sources:

- current Agentic Craft mobile overflow metrics;
- shadcn Table guidance;
- Product Design audit screenshots.

Decision:

- Tables are acceptable for desktop exact specs.
- Mobile should use definition rows or accordions.

Requirements:

- `PatternSpecTable` switches to stacked rows under `md`;
- row label first, detail second;
- long specs wrap;
- optional code/token rendered monospace;
- table is never the first content after a mobile demo.

## 5. Figma Reference Extraction Is Better

### What Worked

`AGENTIC DESIGN SYSTEM` Templates node:

- file key: `PGbPEMVJgtPgCz3Bwwv28A`
- node: `230:839`
- screenshot saved:
  - `figma-evidence-round-2/agentic-design-system-templates-node-230-839.png`

Visible takeaways:

- The captured templates are mostly auth/account/settings flows.
- The value for Agentic Craft is not the subject matter; it is flow completeness:
  - entry state;
  - validation state;
  - email confirmation;
  - password reset;
  - loading state;
  - account settings;
  - authentication settings;
  - notification settings.

Agentic Craft translation:

- Every template should include happy path, loading, validation/error, confirmation, settings/review, and recovery states.
- Trust and Agent Settings pages should use the settings-flow density from the lower frames: grouped fields, destructive area, status rows, toggles, and explicit save/update actions.

`shadcn Pro Blocks` node:

- file key: `xutuB1aNuWharMHngxJZLH`
- node: `580:9181`
- screenshot saved:
  - `figma-evidence-round-2/shadcn-pro-blocks-node-580-9181.png`

Visible takeaways:

- Strong reference for documentation structure around components, variables, theming, development, and theme preview.
- The side nav is dense and scannable.
- The theme preview shows both light and dark UI as a whole system, not isolated tokens.
- Component documentation includes examples, code callouts, and implementation details.

Agentic Craft translation:

- Use side-by-side route preview/contact sheets when evaluating visual systems.
- Add implementation docs for registry items, not just live demos.
- Build a "Theme/Surface Preview" for agentic surface grammars: risk, provenance, live, policy, identity, workflow.

### What Did Not Work

`AGENTIC DESIGN SYSTEM` Components node:

- node `6:7` and `6-7` both returned 1x1 empty screenshots.
- design context failed because Figma reported no selected layer.

Next action:

- ask for a direct nested component node or select the Components frame in Figma desktop before invoking connector.
- do not block implementation on this; shadcn Pro Blocks and the Templates screenshot already provide enough direction for Slice 1 and Slice 2.

## 6. Implementation Scoring Is Better

### Scoring Model V2

Fields:

- Impact: product quality and differentiation.
- Evidence: strength of visual/source evidence.
- Dependency: how many prerequisites are needed.
- Registry leverage: improves shadcn distribution.
- Risk: chance of broad churn or regression.
- Slice: recommended build phase.

| Improvement | Impact | Evidence | Dependency | Registry Leverage | Risk | Slice | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Responsive `PatternSpecTable` | 5 | 5 | 1 | 3 | 1 | Slice 1 | Do first |
| Icon/touch target standard | 4 | 5 | 1 | 3 | 1 | Slice 1 | Do first |
| Composer mobile chip rail/send target | 5 | 5 | 2 | 4 | 2 | Slice 1 | Do first |
| `TemplateFlowPreview` | 5 | 5 | 2 | 5 | 2 | Slice 2 | Do first |
| First registry block: `review-workflow` | 5 | 4 | 3 | 5 | 3 | Slice 2 | Do first |
| Registry dependency audit/fix | 4 | 5 | 1 | 5 | 1 | Slice 2 | Do first |
| `ActionPreview` | 5 | 5 | 3 | 5 | 3 | Slice 3 | Do next |
| `EffectivePolicyPreview` | 5 | 5 | 3 | 5 | 3 | Slice 3 | Do next |
| `SourcePreview` | 5 | 5 | 3 | 5 | 2 | Slice 4 | Do next |
| `MemoryLedgerItem` | 5 | 5 | 4 | 5 | 3 | Slice 4 | Do next |
| `RunTrace` | 4 | 4 | 4 | 5 | 3 | Slice 5 | Later |
| `HandoffPacket` | 4 | 4 | 4 | 5 | 3 | Slice 5 | Later |
| Broad visual token restyle | 4 | 3 | 5 | 2 | 5 | Later | Wait |

### Updated Implementation Order

1. Fix mobile/spec-table foundation.
2. Fix target-size foundation.
3. Fix composer mobile suggestions/send/toolbar.
4. Fix registry dependency declarations.
5. Build `TemplateFlowPreview`.
6. Convert Templates route from directory to workflow map.
7. Add first `registry:block` and install test.
8. Build `ActionPreview`.
9. Build `EffectivePolicyPreview`.
10. Build `SourcePreview`.
11. Build `MemoryLedgerItem`.
12. Build `RunTrace` and `HandoffPacket`.

## Final Six-Point Status

| Research Point | Round 1 Status | Round 2 Status | Evidence |
| --- | --- | --- | --- |
| Visual evidence | mostly source links | improved with saved screenshots and visual notes | `visual-evidence-round-2/` |
| Pattern taxonomy | useful route taxonomy | improved into product-state architecture | `Product-State Taxonomy` |
| Registry-first research | packaging model | improved with CLI and dependency evidence | shadcn list/view output, static dependency check |
| Mobile references | requirements listed | improved with component-specific decisions | `Mobile Composer`, `Mobile Clarifying Questions`, `Mobile Source Preview`, `Mobile Spec Tables` |
| Figma extraction | known connector limitation | improved with saved Templates/Pro Blocks screenshots and precise limitation | `figma-evidence-round-2/` |
| Implementation scoring | priority matrix | improved with evidence/dependency/risk/slice scoring | `Scoring Model V2` |

## Go/No-Go After Round 2

Go for implementation:

- `PatternSpecTable` mobile rewrite.
- Button/icon touch target standard.
- Composer mobile chip/send/toolbar fixes.
- Registry dependency audit/fix.
- `TemplateFlowPreview`.
- Templates route workflow-map redesign.
- First registry block.

Do not start yet:

- broad visual token restyle;
- generated bitmap previews;
- heavy Figma sync;
- route-wide theming changes.

Reason:

- The research is now strong enough for the foundation and Templates slices.
- The visual-system slice still benefits from a dedicated style exploration after the workflow architecture exists.

