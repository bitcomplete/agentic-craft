# Agentic Craft Research Refinement Round 1

Date: 2026-06-06
Purpose: sharpen the 8-issue improvement brief before implementation
Scope: design and development only

## What Changed In This Refinement

The previous research brief is a good implementation baseline, but it was still too broad in three places:

1. It listed sources without a strong "borrow this exact thing" matrix.
2. It did not fully convert the research into a registry-first product architecture.
3. It scored improvements only loosely, so implementation order could still become taste-driven.

This refinement adds:

- a source-to-pattern extraction matrix;
- a tighter pattern taxonomy;
- a registry packaging model;
- mobile-specific component requirements;
- route-by-route visual direction;
- a scored implementation matrix for the 8 issues;
- sharper "definition of done" gates.

## Refined Product Thesis

Agentic Craft should be a reference guide for agentic product states, not a chat kit and not a generic UI kit.

The product should help builders answer:

- What state is the agent in?
- What object is the agent touching?
- What source is it using?
- What can the user control?
- What happens if the user does nothing?
- What gets written, sent, saved, spent, or remembered?
- How does this pattern install through shadcn registry?

This means the flagship units should be workflows and stateful surfaces, not standalone visual components.

## Source-To-Pattern Extraction Matrix

### Fluid Functionalism

Useful references:

- [InputMessage](https://www.fluidfunctionalism.com/docs/input-message)
- [AskUserQuestions](https://www.fluidfunctionalism.com/docs/ask-user-questions)
- [ThinkingSteps](https://www.fluidfunctionalism.com/docs/thinking-steps)

What to borrow:

- `InputMessage`: controlled value, send gating, file lifecycle, drag/drop state, click-to-focus, render slots, compact mobile controls.
- `AskUserQuestions`: 2-5 options, current-index model, skipped state, other input, stacked layout for long descriptions.
- `ThinkingSteps`: collapsible step groups, active/complete/pending statuses, sources, images, custom headers, sequential reveal.

What not to borrow directly:

- Do not preserve "Thinking" language as hidden reasoning disclosure.
- Do not copy pill-heavy styling if it makes Agentic Craft feel like the same product.
- Do not let all route patterns inherit the same component surface treatment.

Agentic Craft translation:

- `InputMessage` becomes the mobile composer standard.
- `AskUserQuestions` becomes `ClarifyingQuestions`, but framed as "missing decision collector."
- `ThinkingSteps` becomes `ObservableWork`, with tool/source/status events instead of hidden thoughts.

### AG-UI

Useful references:

- [AG-UI overview](https://docs.ag-ui.com/introduction)
- [Interrupts](https://docs.ag-ui.com/concepts/interrupts)
- [State Management](https://docs.ag-ui.com/concepts/state)
- [Tools](https://docs.ag-ui.com/concepts/tools)

What to borrow:

- Agent apps are not simple request/response flows.
- Interrupts require same-thread resume, payload validation, expiry, idempotency, and all-open-interrupt coverage.
- State snapshots and deltas should be visible in UI as resumable state, not hidden runtime trivia.
- Tools are frontend-defined schemas that bridge AI reasoning and real-world action.

Agentic Craft translation:

- `Approval Gate` should be a paused run with an interrupt payload, not only a modal.
- `Clarifying Questions` should map to `input_required` interrupts.
- `Action Preview` should show tool args, user resume payload, and eventual tool result.
- `Run Monitor` should show state snapshots/deltas as readable product state changes.

### CopilotKit

Useful references:

- [CopilotKit docs](https://docs.copilotkit.ai/)
- [Human in the loop](https://docs.copilotkit.ai/built-in-agent/human-in-the-loop)
- [Tool rendering](https://docs.copilotkit.ai/agent-spec/generative-ui/tool-rendering)
- [Shared state](https://docs.copilotkit.ai/shared-state)

What to borrow:

- Tool rendering turns agent events into custom UI components.
- Shared state lets user actions steer the agent outside chat.
- HITL is a mid-run interaction pattern, not a final confirmation screen.

Agentic Craft translation:

- Actions page should show rendered tool cards with args/result/status.
- Trust page should show how settings alter shared policy state.
- Templates should include "shared state touched" as part of every workflow.

### AI Elements

Useful references:

- [Prompt Input](https://elements.ai-sdk.dev/components/prompt-input)
- [Sources](https://elements.ai-sdk.dev/components/sources)
- [Queue](https://elements.ai-sdk.dev/components/queue)
- [Task](https://elements.ai-sdk.dev/components/task)

What to borrow:

- Prompt input API surface: form-owned submit, attachments, file errors, max files, tool buttons, tooltip-capable buttons.
- Sources component: source/citation list as a first-class response companion.
- Queue/task components: structured progress and task lists for AI workflow status.

Agentic Craft translation:

- Composer should be stateful input infrastructure, not a decorative chat box.
- Citations should become source preview + source list + provenance object.
- Progress steps should graduate into task/queue-like objects with status, source, result, and recovery.

### OpenAI Agents SDK

Useful reference:

- [Human-in-the-loop](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/)

What to borrow:

- Approval can last longer than a server request.
- `RunState` can serialize and resume later.
- Approvals should preserve stable agent/tool identities.

Agentic Craft translation:

- Approval UI needs `pending`, `expired`, `resume-ready`, `approved`, `rejected`, `edited`, and `executed` states.
- Run monitor templates should show "resume later" as a design state.
- Multi-agent handoff should show stable agent identity and resumed owner.

### OpenAI Memory/Search

Useful references:

- [Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq)
- [ChatGPT Search Help](https://help.openai.com/en/articles/9237897-chatgpt-search)

What to borrow:

- Memory is controlled through saved memory, chat history/reference history, deletion, and relevant source controls.
- Search citations use hover previews and source panels to make provenance inspectable.

Agentic Craft translation:

- Memory needs source, scope, last used, deletion, and "forget in every place it appears" language.
- Citations should be source-preview surfaces, not only numbered superscripts.
- Memory and citations should share `SourcePreview`.

### Google PAIR And Microsoft HAX

Useful references:

- [PAIR Explainability + Trust](https://pair.withgoogle.com/guidebook-v2/chapters/explainability-trust/)
- [Microsoft HAX Guidelines](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)

What to borrow:

- Trust must be calibrated over time.
- Explain data scope, reach, and removal.
- Tie explanations to user action.
- Convey consequences of user actions.
- Provide global controls and efficient correction.

Agentic Craft translation:

- Trust settings need effective policy previews.
- Memory rows need source/scope/removal.
- Approval cards need consequence summaries.
- Feedback controls should show what future behavior changes, not just collect thumbs.

### shadcn Registry

Useful references:

- [Registry getting started](https://ui.shadcn.com/docs/registry/getting-started)
- [GitHub registries](https://ui.shadcn.com/docs/registry/github)
- [Registry directory](https://ui.shadcn.com/docs/registry/registry-index)
- [Blocks](https://ui.shadcn.com/docs/_blocks)

What to borrow:

- Registry items can include components, hooks, utils, docs, templates, workflows, rules, and conventions.
- Blocks can include pages, components, hooks, and libraries.
- Public GitHub repo can act as the registry source.
- Registry items should have clear names/descriptions so LLMs and users understand purpose.

Agentic Craft translation:

- Publish primitives as `registry:ui`.
- Publish workflows as `registry:block`.
- Publish implementation checklists/docs as `registry:file` or registry items with targets.
- Publish rules and audit scripts as installable project conventions.

## Refined Pattern Taxonomy

The current navigation should eventually map to this taxonomy:

| Taxonomy | Purpose | Current Route | Primary Primitives | Registry Shape |
| --- | --- | --- | --- | --- |
| Workflow | End-to-end product journey | Templates | TemplateFlowPreview, ObservableWork, DecisionSurface | `registry:block` |
| Input | User gives intent/context | Conversation/Composer | Composer, FileLifecycle, ClarifyingQuestions | `registry:ui` + examples |
| Clarification | Agent requests missing decisions | Agent Actions/Templates | ClarifyingQuestions, DecisionSurface | `registry:ui` + block |
| Decision | Human approves, edits, rejects, or cancels | Agent Actions/Trust | DecisionSurface, ActionPreview | `registry:ui` + block |
| Provenance | Sources, citations, memory origins | Conversation/Memory | SourcePreview, ReferenceItem | `registry:ui` |
| Memory | Durable context and personalization control | Memory/Trust | MemoryLedgerItem, ReferenceItem, Field | `registry:ui` + block |
| Monitoring | Background runs and traces | Observability/Templates | ObservableWork, AgentStatusTable, RunTrace | `registry:block` |
| Handoff | Ownership transfer between agents/humans | Multi-Agent/Templates | HandoffPacket, AgentStatusTable | `registry:ui` + block |
| Policy | Autonomy, consent, scope, recovery | Trust | EffectivePolicyPreview, FieldSet, Switch | `registry:block` |
| Feedback | Correction and preference learning | Feedback | FeedbackItem, ConsequencePreview | `registry:ui` |

## Registry-First Packaging Model

### Tier 1: Primitives

Use `registry:ui` for reusable primitives:

- `composer`
- `clarifying-questions`
- `decision-surface`
- `observable-work`
- `reference-item`
- `file-lifecycle`
- `agent-status-table`
- new `source-preview`
- new `action-preview`
- new `effective-policy-preview`
- new `memory-ledger-item`
- new `handoff-packet`

### Tier 2: Blocks

Use `registry:block` for installable workflows:

- `review-workflow`
- `approval-workflow`
- `clarifying-workflow`
- `memory-review`
- `run-monitor`
- `multi-agent-handoff`
- `agent-settings`

Each block should include:

- page/component example;
- data fixtures;
- state variants;
- dependencies;
- docs file;
- verification notes.

### Tier 3: Project Conventions

Use registry installable files for:

- `docs/agentic-craft/pattern-checklist.md`
- `docs/agentic-craft/accessibility.md`
- `scripts/audit-agentic-ui.mjs`
- `rules/agentic-craft-patterns.md`
- `lib/agentic-states.ts`
- `lib/agentic-fixtures.ts`

This matters because the project goal is a reference guide. A developer should be able to install not only a component, but the decision rules that make the component useful.

## Refined Mobile Requirements

Mobile is not a scale problem. It is a translation problem.

### Mobile Composer

Borrow from Fluid InputMessage and AI Elements Prompt Input:

- single native form;
- controlled value;
- auto-resizing textarea;
- compact footer;
- file lifecycle state;
- send button gated by value/files;
- click-to-focus shell;
- global and local drag/drop state;
- visual send button compact, hit target larger.

Agentic Craft mobile target:

- textarea placeholder at 13px or 14px;
- footer controls 32px visual, 40px hit area;
- attachment/suggestion islands 10-12px padding;
- suggestion chips as horizontal rail or two-line stack;
- no equal-width chip grid when labels are long.

### Mobile Clarifying Questions

Borrow from Fluid AskUserQuestions:

- one question at a time on narrow screens;
- 2-5 options;
- stacked layout when descriptions wrap;
- visible progress;
- skip/default;
- controlled answer map.

Agentic Craft mobile target:

- question card should be a focused decision surface, not a form dumped into the page;
- options should be full-width rows with short descriptions;
- multi-select should show `Continue` only when useful;
- other text input should be visible but not dominate.

### Mobile Citations And Sources

Borrow from AI Elements Sources, OpenAI Search, and the supplied reference image:

- inline citation marker;
- source popover or bottom sheet on mobile;
- source title;
- quoted/snippet preview;
- page or location;
- previous/next source controls;
- open source action;
- source list companion below answer.

Agentic Craft mobile target:

- inline citation tap opens a bottom sheet, not a cramped tooltip;
- sheet has 40px controls;
- preview content uses 13-14px readable text;
- source action is clear and separated from citation marker.

### Mobile Spec Tables

Spec tables should not be the default mobile explanation.

Agentic Craft mobile target:

- render spec rows as definition cards below `md`;
- keep desktop table for wide screens;
- collapse long implementation notes under `Details`;
- never let a table be the first thing a mobile user hits after a demo.

## Route Visual Direction

### Templates

Visual model: workflow map.

Use:

- mini flow previews;
- state chips;
- start/end/failure nodes;
- install badges.

Avoid:

- generic two-column card directory.

### Actions

Visual model: consequence ledger.

Use:

- affected object rows;
- pending action card;
- locked payload version;
- reversible/irreversible labels;
- approve/edit/reject controls.

Avoid:

- neutral log rows as the first specimen.

### Trust

Visual model: policy editor with effective preview.

Use:

- setting group on one side;
- "effective policy" summary next to it;
- before/after diff for risky changes;
- audit trail chips.

Avoid:

- isolated switches that do not explain consequence.

### Memory

Visual model: provenance ledger.

Use:

- memory entry rows with source/scope/expiry;
- proposed memory review state;
- "why used" disclosure;
- delete and "never remember this type".

Avoid:

- simple saved-notes list.

### Observability

Visual model: trace with incident context.

Use:

- event stream;
- active anomaly;
- cost/time/status;
- trace id;
- filters;
- drill-down affordance.

Avoid:

- passive activity feed without thresholds or consequences.

### Multi-Agent

Visual model: ownership and handoff.

Use:

- owner lanes;
- agent identity rows;
- handoff packets;
- accepted/rejected handoff states;
- current owner marker.

Avoid:

- identical cards differentiated only by label text.

### Conversation

Visual model: dialogue creates product state.

Use:

- message -> observable work -> citation -> decision -> memory/update story;
- source and ownership surfaces;
- compact composer.

Avoid:

- long prose specimens as the main identity of the guide.

## 8-Issue Scoring Matrix

Scale:

- Impact: 1 low, 5 high
- Effort: 1 low, 5 high
- Risk: 1 low, 5 high
- Registry leverage: 1 low, 5 high
- Confidence: 1 weak, 5 strong

| Issue | Impact | Effort | Risk | Registry Leverage | Confidence | Priority |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Templates flagship | 5 | 4 | 3 | 5 | 5 | P0 |
| Mobile compressed docs | 5 | 3 | 2 | 4 | 5 | P0 |
| Target size/accessibility | 4 | 2 | 1 | 3 | 5 | P0 |
| Actions consequence | 5 | 4 | 3 | 5 | 5 | P1 |
| Trust policy meaning | 5 | 4 | 3 | 5 | 5 | P1 |
| Memory provenance/lifecycle | 5 | 4 | 3 | 5 | 5 | P1 |
| Visual homogeneity | 4 | 4 | 4 | 3 | 4 | P1 |
| Conversation dominance | 4 | 3 | 2 | 4 | 5 | P2 |

Interpretation:

- P0 items fix the reference-guide frame and immediate product quality.
- P1 items create the actual agentic differentiation.
- P2 should happen after stronger non-chat surfaces exist, otherwise Conversation will lose content without a better center.

## Implementation Slices

### Slice 1: Foundation Quality

Goal:

- make mobile and accessibility credible before deeper redesign.

Tasks:

- mobile spec-table replacement;
- touch target standardization;
- composer chip rail;
- audit script updates;
- Browser mobile QA.

Exit gate:

- no mobile table overflows;
- no critical target below 32px;
- primary mobile controls at 40px hit target;
- `/conversation#composer`, `/actions`, `/observability`, `/templates` screenshots accepted.

### Slice 2: Templates As Flagship

Goal:

- make the app read as workflow reference, not component catalog.

Tasks:

- navigation reorder;
- `TemplateFlowPreview`;
- template cards with flow preview;
- template detail state matrix;
- first `registry:block` template.

Exit gate:

- `/templates` first viewport shows workflow previews;
- one block installs through shadcn CLI;
- template detail shows states, failure, recovery, registry dependencies.

### Slice 3: Decision And Policy

Goal:

- make actions and trust feel consequential.

Tasks:

- `ActionPreview`;
- `DecisionSurface` locked payload state;
- `EffectivePolicyPreview`;
- Trust risky-change diff;
- Approval workflow block.

Exit gate:

- approval shows affected object, payload, reversibility, expiry, policy reason;
- trust setting shows effective policy before/after;
- approve/edit/reject states are visible and keyboard reachable.

### Slice 4: Provenance And Memory

Goal:

- unify citations, sources, and memory provenance.

Tasks:

- `SourcePreview`;
- citation popover/bottom sheet pattern;
- `MemoryLedgerItem`;
- proposed memory review;
- memory review block.

Exit gate:

- citations have preview and source action;
- memory first viewport shows source/scope/expiry/last used;
- mobile source preview uses bottom sheet or full-width disclosure.

### Slice 5: Monitoring And Handoff

Goal:

- make background work and multi-agent ownership legible.

Tasks:

- `RunTrace`;
- incident/threshold state;
- `HandoffPacket`;
- multi-agent ownership lanes;
- run monitor and multi-agent handoff blocks.

Exit gate:

- observability first viewport shows active issue/threshold;
- handoff shows sender, receiver, payload, accepted/rejected state;
- agent cards are distinguishable by role/ownership/status.

## Research Additions To Apply Back To The Main Brief

1. Add AG-UI interrupt requirements to Actions and Clarifying Questions:
   - same-thread resume;
   - all interrupts resolved;
   - response schema validation;
   - expiry;
   - idempotency;
   - tool args -> resume payload -> result trail.

2. Add shadcn packaging levels:
   - primitive;
   - block;
   - docs/conventions;
   - audit script.

3. Add mobile bottom-sheet source preview requirement.

4. Add shared `SourcePreview` across citations and memory.

5. Add target implementation score table.

6. Add "workflow map" as the visual model for Templates.

7. Add "policy preview" as the visual model for Trust.

8. Add "consequence ledger" as the visual model for Actions.

## Remaining Research Gaps

These are worth doing before heavy visual implementation, but not required before Slice 1:

1. Visual capture board.
   - Capture screenshots from Fluid InputMessage, AskUserQuestions, ThinkingSteps, AI Elements Prompt Input/Sources/Queue/Task, CopilotKit tool rendering, and current Agentic Craft.
   - Annotate what to borrow and what to avoid.

2. Figma template extraction retry.
   - Reinspect Agentic Design System templates/components through Figma plus screenshots.
   - The connector may expose only fundamentals, so do not treat connector output as the whole file.

3. Throwaway registry install test.
   - Install existing primitives into a fresh app.
   - Record missing deps, path issues, CSS gaps, and docs gaps.

4. Mobile source preview prototypes.
   - Compare popover, bottom sheet, and inline expansion for citations.
   - Pick one before implementing citations/memory.

## Refined Go/No-Go For Implementation

Go now for:

- mobile table replacement;
- target size fixes;
- template flow previews;
- first registry block.

Wait for visual exploration before:

- broad token/palette changes;
- route-specific surface styling;
- generated preview thumbnails;
- heavy Figma sync.

Do not wait for more research before:

- improving composer mobile density;
- moving spec tables into mobile definition rows;
- adding hit-target audit rules;
- making Templates more workflow-shaped.

## High-Confidence Next Build Order

1. `PatternSpecTable` responsive rewrite.
2. Button/icon hit-area standard.
3. Composer mobile chip rail and send target polish.
4. `TemplateFlowPreview` plus Templates route redesign.
5. First `registry:block`: `review-workflow`.
6. `ActionPreview` and Approval Gate locked-payload state.
7. `EffectivePolicyPreview`.
8. `SourcePreview` shared by Citations and Memory.
9. `MemoryLedgerItem`.
10. `RunTrace` and `HandoffPacket`.

