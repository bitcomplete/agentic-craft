# Agentic Craft 8-Issue Improvement Research

Date: 2026-06-06
Project: Agentic Craft
Scope: design and development only
Output type: research-backed implementation brief

## Executive Read

The March 2026 gist is still directionally strong. Its durable ideas are: agentic UX is not just chat, control is a trust signal, templates reduce blank-canvas anxiety, rich action previews matter more than generic confirmations, memory needs user control, observability needs complete activity history, and autonomy should be earned progressively.

The stale parts are mostly implementation-level. The current landscape has moved toward concrete frontend protocols and registries: AG-UI now frames interrupts, shared state, sub-agents, tool rendering, and no-raw-chain-of-thought "thinking steps" as protocol-level building blocks; CopilotKit has current docs around shared state, threads, tool rendering, and HITL; AI Elements and Fluid Functionalism provide concrete shadcn-compatible component patterns; OpenAI Agents SDK now has explicit pause/resume approval flows; shadcn registry support now covers public GitHub registries and arbitrary docs/config/templates, not only UI components.

The design direction should shift from "pattern catalog" to "reference system for agentic product states." Each page should show a real workflow situation, the user anxiety it resolves, the state machine, the component anatomy, failure/recovery behavior, and installable registry artifacts. Conversation should remain present, but it should stop anchoring the project identity.

## Source Freshness Check

### User Gist

Local snapshot:

- `source-gist-agentic-ux-research.md`
- Original: [Agentic UX design patterns research](https://gist.github.com/arielconti10/e36c6faab34df3834060e02b1370b9da)

Still useful:

- Shape of AI taxonomy: templates, references, citations, action plans, cost estimates, memory, verification.
- HAX: make capability/limits clear, support correction, convey consequences, provide global controls.
- PAIR: calibrate trust, show data sources, explain confidence in user-meaningful terms.
- Autonomy models: human in command, delegated, in the loop, on the loop, out of the loop.
- AgenticUI idea: templates for orchestrate, create, monitor.
- Rich action preview: exact artifact preview, affected fields, approve/reject/modify.
- Observability: mission/activity log, cost, duration, HITL involvement.
- Memory: display, edit, delete, incognito, remembered context indicators.

Needs updating:

- "Stream of thought" should be reframed as observable work from traces/tool events. Do not expose private chain of thought.
- The original Vercel AI SDK references should be updated to AI Elements: Prompt Input, Inline Citation, Sources, Plan, Queue, Task, Tool.
- Human-in-the-loop should be modeled as interrupt/resume state, not only a final approval card.
- Memory has evolved from discrete saved notes toward summaries, sources, automatic updates, relevance, and history.
- shadcn registry distribution is now a first-class product channel, including components, docs, config, workflow files, rules, and templates.

## Current External References Used

- [Fluid Functionalism docs](https://www.fluidfunctionalism.com/docs): motion that communicates, hover as preview, shadcn-compatible registry install.
- [Fluid InputMessage](https://www.fluidfunctionalism.com/docs/input-message): controlled value, file lifecycle, drag/drop, send gating, click-to-focus.
- [Fluid AskUserQuestions](https://www.fluidfunctionalism.com/docs/ask-user-questions): stepped questions, options, multi-select, other input, skip, stacked layout.
- [Fluid ThinkingSteps](https://www.fluidfunctionalism.com/docs/thinking-steps): collapsible steps, streaming states, sources, images. Borrow structure, not raw reasoning framing.
- [AG-UI overview](https://docs.ag-ui.com/introduction): shared state, interrupts, tool rendering, sub-agents, stateful long-running agent-app interactions.
- [CopilotKit docs](https://docs.copilotkit.ai/): production chat, generative UI, shared state, human-in-the-loop on AG-UI-compatible backends.
- [CopilotKit HITL](https://docs.copilotkit.ai/built-in-agent/human-in-the-loop): agents pause mid-run to collect approval/input and resume with context.
- [CopilotKit Tool Rendering](https://docs.copilotkit.ai/agent-spec/generative-ui/tool-rendering): tool calls become custom UI components with arguments, live status, and result.
- [CopilotKit Shared State](https://docs.copilotkit.ai/shared-state): UI and agent share bidirectional state so user actions can steer the agent outside chat.
- [AI Elements Prompt Input](https://elements.ai-sdk.dev/components/prompt-input): attachments, textarea, submit status, model/tool controls, responsive mobile-friendly controls.
- [assistant-ui Composer](https://www.assistant-ui.com/docs/primitives/composer): composable primitives, native form/textarea/button, `asChild`, edit mode, keyboard behavior.
- [assistant-ui Thread](https://www.assistant-ui.com/docs/ui/thread): message rendering, suggestions, scroll anchoring, conditional state rendering.
- [OpenAI Agents SDK HITL](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/): approval interruptions, `RunState`, serialize/resume, long-running approvals.
- [OpenAI ChatGPT Search Help](https://help.openai.com/en/articles/9237897-chatgpt-search): citation hover previews, sources panel, reservation confirmation language.
- [OpenAI Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq): memory summary, memory sources, corrections, deletion, relevant-source controls.
- [Google PAIR Explainability + Trust](https://pair.withgoogle.com/guidebook-v2/chapters/explainability-trust/): calibrate trust, show data sources, scope/reach/removal, tie explanations to user action.
- [Microsoft HAX Guidelines](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/): evidence-backed human-AI interaction guidelines.
- [W3C WCAG 2.2 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 24x24 CSS px minimum or sufficient spacing, with larger targets recommended for important controls.
- [shadcn registry getting started](https://ui.shadcn.com/docs/registry/getting-started): valid JSON registry, static or dynamic serving, list/search/view/add test commands.
- [shadcn GitHub registries](https://ui.shadcn.com/docs/registry/github): public GitHub repos can be registries; distribute components, docs, config, rules, workflows.
- [shadcn registry-item schema](https://ui.shadcn.com/docs/registry/registry-item-json): dependencies, registryDependencies, files, targets, docs.
- [alexgilev/agentic-ui](https://github.com/alexgilev/agentic-ui): state matrices, quality gates, token fidelity, showcase/state documentation approach.

## Helpful Plugins, Skills, And Tools

### Use During Design Exploration

- Product Design plugin
  - `research`: source-grounded UX research.
  - `audit`: screenshot-based UX/design/accessibility audits.
  - `ideate`: visual alternatives after brief confirmation.
  - `prototype` / `image-to-code`: build selected visual targets.
  - Figma tools when node-specific design files are available.

- Creative Production plugin
  - `moodboard-explorer`: create visual territories for route-specific product surfaces.
  - `render_style_intake_widget`: collect taste, density, palette, and avoid-list before generating directions.
  - `generative-polish`: produce exact, deterministic UI preview assets with generated polish layers only where safe.
  - Use this for visual direction and artifact thumbnails, not marketing copy.

### Use During Implementation

- `build-web-apps:shadcn` / `shadcn`: check official component docs, add/repair primitives, verify registry output.
- `vercel-composition-patterns`: refactor polymorphic/compound primitives without boolean prop sprawl.
- `web-design-guidelines`: run accessibility, focus, URL state, motion, and content resilience audits.
- `emil-design-engineering`: refine touch, motion, input behavior, and visual polish.
- `build-web-apps:frontend-testing-debugging`: Browser QA, responsive screenshots, console checks, reduced-motion checks.
- Browser plugin + `node_repl`: route screenshots, viewport checks, DOM metrics, console logs.
- Figma plugin:
  - `get_design_context` and `get_screenshot` for direct node references.
  - `generate_figma_design` to capture current web pages into Figma when needed.
  - `search_design_system` to reuse Figma library components before inventing.
- `imagegen`: for bitmap source previews, mini workflow thumbnails, source-card artifacts, or non-decorative visual references.

### Use During Registry Distribution

- `npm run registry:build`
- `npx shadcn@latest list http://localhost:3000/r/registry.json`
- `npx shadcn@latest view http://localhost:3000/r/<item>.json`
- `npx shadcn@latest add http://localhost:3000/r/<item>.json`
- `npx shadcn@latest registry add @agentic-craft=http://localhost:3000/r/{name}.json`

## Cross-Cutting Product Bar

Every improved page or template should answer these questions in the UI:

1. What job is the agent doing?
2. What product object is affected?
3. What source or state is being used?
4. What can go wrong?
5. Where does the human intervene?
6. What happens if the human says no?
7. What gets saved, changed, sent, spent, or remembered?
8. How does a developer install or adapt this pattern?

## Issue 1: Templates Should Be The Flagship, But They Look Like A Card Directory

### Research Read

The gist correctly identifies templates as a core wayfinder pattern and AgenticUI's strongest framing as Orchestrate, Create, and Monitor templates. Current shadcn registry docs make this more important: templates can be distributed as `registry:block` or `registry:item` with components, docs, config, rules, and dependencies. AG-UI makes templates even more useful because its building blocks are stateful: interrupts, shared state, tool outputs, sub-agents, cancellation, resume, and event streams.

The current Templates route has the right inventory, but the visual grammar is only a list of cards. It should feel like the reference guide's "start here" product surface, where a builder can see the workflow shape before reading details.

### What To Borrow

- From AgenticUI: templates as the primary value, not a side section.
- From AG-UI: workflow templates should map to runtime concepts: shared state, interrupts, tool rendering, sub-agent composition, cancellation.
- From shadcn registry: templates are installable packages, not just documentation examples.
- From Product Design: a template card should show the task, state sequence, failure point, and control point at a glance.

### Action Set

1. Promote Templates in navigation.
   - Move `Templates` above `Conversation`, or make `/templates` the default landing route after `Demo`.
   - Rename the route eyebrow from `WORKFLOW TEMPLATES` to `REFERENCE WORKFLOWS` or `AGENTIC PRODUCT FLOWS`.
   - Add a short "choose by product job" selector: Review, Approve, Clarify, Remember, Monitor, Handoff, Configure.

2. Replace card-only template index with mini flow previews.
   - Build `TemplateFlowPreview`:
     - Input
     - Agent work
     - Human gate
     - Output
     - Recovery
   - Each node should use real primitives, not decorative SVG: `ObservableWork`, `DecisionSurface`, `ReferenceItem`, `AgentStatusTable`.
   - Use 3-5 state chips per template: `collecting`, `blocked`, `ready`, `approved`, `revoked`, etc.

3. Add a "why this exists" anxiety label to each template.
   - Review Workflow: prevents unverifiable conclusions.
   - Approval Workflow: prevents unreviewed side effects.
   - Clarifying Workflow: prevents invented requirements.
   - Memory Review: prevents silent personalization drift.
   - Run Monitor: prevents background work disappearing.
   - Multi-Agent Handoff: prevents lost ownership.
   - Agent Settings: prevents one-off prompts becoming policy.

4. Upgrade template detail pages into workflow specs.
   - Current `src/content/templates.ts` already has `states`; extend it with:
     - `flow: Array<{ id, label, primitive, risk, recovery }>`
     - `installItems: string[]`
     - `requiredStates: string[]`
     - `mobileBehavior`
     - `registryType`
   - Add "state matrix" and "failure/recovery" as first-class blocks before generic prose.

5. Make every template installable through the shadcn registry.
   - Add items like:
     - `review-workflow-template`
     - `approval-workflow-template`
     - `memory-review-template`
     - `run-monitor-template`
   - Use `registry:block` or `registry:item`.
   - Include docs files with `target: "~/docs/agentic-craft/<template>.md"` if needed.
   - Include `registryDependencies` for primitives: `observable-work`, `decision-surface`, `reference-item`, etc.

6. Add a copyable implementation checklist.
   - Required data.
   - Required UI states.
   - Human decision point.
   - Failure path.
   - Events to log.
   - Accessibility behavior.
   - Registry dependencies.

### Files To Touch

- `src/views/templates-content.tsx`
- `src/views/template-detail-content.tsx`
- `src/content/templates.ts`
- `src/content/navigation.ts`
- `registry.json`
- `public/r/*.json`
- `registry/base-nova/templates/*` or equivalent new folder
- `src/components/reference/template-flow-preview.tsx`

### Verification

- Desktop and mobile screenshots for `/templates` and each template detail.
- `npm run registry:build`
- `npx shadcn@latest list http://localhost:3000/r/registry.json`
- `npx shadcn@latest view http://localhost:3000/r/review-workflow-template.json`
- Install one template into a throwaway Next project and build it.

## Issue 2: Visual System Is Too Homogeneous Across Different Agentic Surfaces

### Research Read

The Creative Production lens says the UI is controlled but under-authored. The route surfaces represent very different product risks: action side effects, memory persistence, agent identity, run monitoring, and trust policy. They should share tokens but not share the same visual shape.

Fluid Functionalism is useful here because its motion and surface hierarchy communicate state, not decoration. PAIR is also relevant: trust depends on explanations, sources, and user action context. A risky action, a provenance record, and a live trace need different surfaces because they create different user anxieties.

### What To Borrow

- From Fluid Functionalism: motion and hover should preview state and object membership.
- From AG-UI: UI should reflect runtime concepts: tool output, shared state, interrupts, sub-agents.
- From Creative Production: create visual territories based on product function, not arbitrary palette.
- From PAIR: trust surfaces should expose data sources and consequences.

### Action Set

1. Define semantic surface grammars.
   - `risk`: approvals, destructive actions, external sends.
   - `provenance`: sources, citations, memory origins.
   - `live`: streaming runs, active tool calls, background jobs.
   - `identity`: agents, roles, ownership, handoffs.
   - `workflow`: templates, state machines, progress.
   - `policy`: settings, autonomy, privacy, trust boundaries.

2. Add a small semantic token layer.
   - Avoid a rainbow palette. Use subtle token shifts:
     - `--surface-risk`
     - `--surface-provenance`
     - `--surface-live`
     - `--surface-identity`
     - `--surface-policy`
   - Each token should affect border, icon container, badge, and selected background, not page background.

3. Create route-specific specimen frames.
   - Actions: preview card with side-effect ledger.
   - Trust: settings plus effective policy panel.
   - Memory: memory ledger with source chips and lifecycle.
   - Multi-Agent: identity board with ownership lanes.
   - Observability: trace lane with incident/threshold marker.
   - Templates: flow canvas.

4. Replace generic bordered-card repetition.
   - Keep cards for repeated records.
   - Use unframed layouts for page sections.
   - Use purpose-specific shells for demos:
     - `TraceFrame`
     - `PolicyFrame`
     - `WorkflowFrame`
     - `LedgerFrame`
     - `DecisionFrame`

5. Create a visual artifact per major route.
   - Actions: external service preview.
   - Trust: effective policy diff.
   - Memory: source lineage row.
   - Multi-Agent: handoff packet.
   - Observability: run trace.
   - Templates: mini workflow map.

6. Add a Creative Production style intake before broad visual redesign.
   - Use `render_style_intake_widget` or Product Design ideation if we want visual alternatives.
   - Options should focus on density and product feel:
     - operational
     - ledger/provenance
     - command center
     - research notebook
     - workflow map
   - Avoid decorative moodboards unless we are producing actual visual reference assets.

### Files To Touch

- `src/index.css`
- `src/components/reference/*`
- `src/views/actions-content.tsx`
- `src/views/trust-content.tsx`
- `src/views/memory-content.tsx`
- `src/views/multi-agent-content.tsx`
- `src/views/observability-content.tsx`
- `src/views/templates-content.tsx`

### Verification

- Screenshot contact sheet of all major routes.
- Scan CSS to ensure no route becomes a one-hue theme.
- Confirm all semantic surfaces still pass contrast.
- Browser visual QA at desktop and mobile.

## Issue 3: Mobile Pages Still Feel Like Compressed Desktop Documentation

### Research Read

Fluid InputMessage is the strongest concrete mobile reference for the composer: controlled value, file lifecycle, drag/drop state, click-to-focus, slots, and compact send gating. Fluid AskUserQuestions is also relevant: mobile question flows need 2-5 options, stacked layout for long descriptions, skip/default behavior, and single focus per step.

AI Elements Prompt Input adds current implementation ideas: attachment display, action menu, submit status, model/tool controls, responsive controls, and lifted state. assistant-ui reinforces that composer primitives should map to native form, textarea, and button behavior, with design-system styling layered through `asChild`.

The current mobile issue is not simply "too big." The deeper problem is page order and component translation: desktop docs sections are stacked on mobile instead of adapting into mobile-native reading and interaction shapes.

### What To Borrow

- From Fluid InputMessage: compact footer, small send button, controlled state, file lifecycle, click-to-focus.
- From Fluid AskUserQuestions: stepped focused questions, stacked options, explicit skip, visible progress.
- From AI Elements: prompt input tools, attachment lifecycle, submit status, responsive mobile-friendly controls.
- From assistant-ui: native form behavior and composable primitives.

### Action Set

1. Add mobile-specific section order.
   - On mobile, show:
     - pattern title
     - 1-line use case
     - interactive demo
     - state chips
     - anatomy/spec collapsed
   - Move long prose and tables below the demo.

2. Replace mobile spec tables.
   - Update `PatternSpecTable` to render:
     - table on `md+`
     - stacked definition rows below `md`
   - Each mobile row:
     - term/title
     - 1-2 line value
     - optional code/token line
   - This directly addresses the captured internal mobile table overflow.

3. Tighten mobile rhythm.
   - Page horizontal padding: 16px default, not larger.
   - Section vertical gap: 48-56px instead of desktop 80px.
   - Demo frame padding: 12px.
   - Control bar padding: 8px vertical.
   - Cards/items: 10-12px internal padding.
   - Avoid nested bordered containers on mobile.

4. Build `MobilePatternHeader`.
   - Provides compact eyebrow/title/summary.
   - Avoids desktop `text-4xl` hero feel on every route.
   - Use `text-2xl` or `text-[28px]` for mobile route title if needed.

5. Fix composer suggestions.
   - Use horizontal chip rail on mobile:
     - no equal-width grid
     - no ellipsis unless chip has tooltip/expanded state
     - `overflow-x-auto`
     - max two rows only if chips remain readable
   - Send button:
     - visual icon 16px
     - visual button 32px
     - touch wrapper 40px

6. Add mobile-only pattern controls.
   - Use segmented row only if options fit.
   - If not, convert to `Select`, sheet, or scrollable chip group.
   - Avoid four tabs squeezed in one line.

7. Add a mobile audit script path.
   - Extend `scripts/audit-ui.mjs` or add `scripts/audit-mobile.mjs`.
   - Check:
     - tables wider than viewport
     - text clipped with ellipsis in critical controls
     - targets below 32px
     - nested cards deeper than 2
     - mobile h1 larger than expected threshold

### Files To Touch

- `src/components/reference/pattern-spec-table.tsx`
- `src/components/reference/pattern-page.tsx`
- `src/components/pattern-controls.tsx`
- `src/components/ui/composer*.tsx`
- `src/components/ui/composer.css`
- `src/views/*-content.tsx`
- `scripts/audit-ui.mjs`

### Verification

- Browser screenshots at 390x844 and 430x932 for:
  - `/conversation#composer`
  - `/actions`
  - `/multi-agent`
  - `/observability`
  - `/templates`
- DOM check: `document.scrollingElement.scrollWidth === window.innerWidth`.
- Visual check: no truncated critical labels in composer suggestions.
- Touch check: all interactive controls have at least 32px actual hit area and 40px for primary mobile controls.

## Issue 4: Accessibility Target Size Is Still Below A Serious Reference-Guide Bar

### Research Read

WCAG 2.2 target-size minimum is 24x24 CSS pixels or sufficient spacing. That is a compliance floor, not a good product bar. The W3C guidance explicitly notes larger targets help many users, especially touch users and people with dexterity constraints. For this project, many controls are icon-only and adjacent to other controls, so relying on spacing exceptions is a weak choice.

The reference guide should model best practice, not only pass the minimum.

### What To Borrow

- From WCAG: minimum 24x24 target or spacing, plus larger target best practice.
- From shadcn Button: centralize size variants instead of local ad hoc icon buttons.
- From assistant-ui and AI Elements: send/cancel icon buttons can have compact visual glyphs with accessible labels.

### Action Set

1. Create a local `IconButton` wrapper or update Button icon sizes.
   - Desktop compact: `size-8` minimum.
   - Mobile/touch: `size-10` hit target.
   - Visual icon remains 14-16px.
   - All icon-only buttons require `aria-label`.

2. Audit and fix all known offenders.
   - Sidebar toggle: 28px -> 32px desktop / 40px touch.
   - Feedback thumbs: 22px -> 32px hit area.
   - Citation previous/next/open source: 23-24px -> 32px.
   - Composer menu/token/send controls: 28px visual can stay, hit target expands to 40px mobile.
   - Memory edit/delete: 28px -> 32px/40px.

3. Distinguish citation markers from buttons.
   - If marker opens a popover, make it a real button with hit target.
   - If marker is only an inline reference, do not count it as an icon button; provide a separate source panel action.

4. Extend `audit-ui.mjs`.
   - Detect buttons and links below 24px hard fail.
   - Warn below 32px.
   - Warn below 40px when viewport is touch/mobile.
   - Report accessible name and route.

5. Add reference-guide docs for compact vs touch density.
   - Not user-facing doctrine in product demos.
   - Put it in implementation notes or reference anatomy.

### Files To Touch

- `src/components/ui/button.tsx`
- `src/components/ui/sidebar.tsx`
- `src/views/conversation-content.tsx`
- `src/views/memory-content.tsx`
- `src/components/ui/composer*.tsx`
- `scripts/audit-ui.mjs`

### Verification

- Run `npm run audit:ui`.
- Browser DOM metric pass at desktop and mobile.
- Keyboard-only pass for all icon controls.
- Check accessible names for all icon-only buttons.

## Issue 5: Conversation Still Dominates The Mental Model

### Research Read

The gist's first section frames agentic experience as ongoing, relationship-centered, stateful, and cross-session. AG-UI's current docs make that concrete: the important frontier is not just messages, but shared state, tool rendering, interrupts, sub-agents, cancellation, and state streaming. CopilotKit similarly frames the stack as chat, generative UI, shared state, and human-in-the-loop workflows.

Conversation should be one surface family, not the product thesis.

### What To Borrow

- From AG-UI: build around event/state primitives, not chat transcript primitives.
- From CopilotKit: chat is one product surface among shared state, generative UI, and HITL.
- From the gist: AX is a shift from screen-centric to ongoing goals and agent-controlled execution paths.

### Action Set

1. Reframe navigation.
   - Option A: move `Conversation` below `Templates`, `Agent Actions`, and `Trust`.
   - Option B: rename to `Dialogue Surfaces`.
   - Keep sections: Messages, Citations, Composer, but frame them as input/evidence surfaces.

2. Add a surface map to Demo or Templates.
   - Input.
   - Clarification.
   - Observable work.
   - Decision.
   - Memory.
   - Monitoring.
   - Handoff.
   - Output.

3. Add cross-route story links.
   - Composer message creates a review workflow.
   - Citation opens source preview.
   - Source trace becomes memory proposal.
   - Memory proposal requires trust policy.
   - Trust policy affects approval gate.
   - Approval appears in observability timeline.

4. Reduce conversation prose weight.
   - The serif prose specimen currently feels like editorial content, not a product state.
   - Keep it configurable, but make ownership and source state the primary demo.

5. Add "message creates product state" specimen.
   - User asks review question.
   - Agent starts observable work.
   - Agent asks clarifying question.
   - Agent cites source.
   - Agent proposes action.
   - User approves/denies.

6. Registry implication.
   - Do not distribute only `composer` and tool-call primitives.
   - Pair chat primitives with workflow blocks so users do not assume Agentic Craft is another chat kit.

### Files To Touch

- `src/content/navigation.ts`
- `src/views/demo-content.tsx`
- `src/views/conversation-content.tsx`
- `src/views/templates-content.tsx`
- `registry.json`

### Verification

- First viewport on `/` and `/templates` must communicate beyond-chat surfaces.
- Sidebar order should not make chat the implicit center.
- Browser screenshot review: a new visitor should see workflow/decision/monitoring before or alongside conversation.

## Issue 6: Actions Do Not Feel Consequential Enough

### Research Read

The gist's rich action preview section is still strong: show the exact artifact that will be created, not a generic confirm/deny prompt. Current OpenAI Agents SDK and CopilotKit docs make the runtime model clearer: approvals interrupt execution, preserve state, and resume after the user decides. That means the UI should represent "paused run with locked pending action", not just "modal with buttons."

CopilotKit tool rendering also points to better action UIs: render tool calls with arguments, live status, and result. AG-UI adds event-stream and frontend/backend tool rendering vocabulary.

### What To Borrow

- From OpenAI Agents SDK: `interruptions`, `RunState`, approve/reject, serialize/resume.
- From CopilotKit HITL: pause mid-run, keep context, user keeps steering wheel.
- From CopilotKit Tool Rendering: custom status cards with arguments/result, not raw JSON.
- From the gist: preview the exact external artifact.

### Action Set

1. Redesign `Tool Calls` around consequence.
   - Current rows show activity.
   - New rows should show:
     - tool name
     - affected object
     - permission level
     - arguments summary
     - status
     - result
     - duration/cost
     - reversible flag

2. Make `Approval Gate` the route's hero specimen.
   - Show a pending action before execution.
   - Include:
     - exact payload
     - source/provenance
     - affected records
     - cost/time
     - reversibility
     - expiry
     - policy reason
     - approve/reject/modify

3. Add locked preview state.
   - Approval should lock to a payload hash/version.
   - If payload changes, approval invalidates.
   - UI state: `Preview changed; review again`.

4. Add modify path, not only approve/deny.
   - Approve.
   - Edit and approve.
   - Reject.
   - Ask why.
   - Open source.

5. Add rollback/recovery state.
   - If reversible: show undo window.
   - If irreversible: increase friction and require explicit confirmation copy or second step.

6. Add action categories.
   - `read-only`
   - `draft`
   - `external-send`
   - `record-mutation`
   - `spend`
   - `delete`
   - Each category maps to policy defaults.

7. Implement as registry-ready primitive extension.
   - Extend `DecisionSurface`.
   - Add `ActionPreview` or `PendingAction` component.
   - Include example data schemas.

### Files To Touch

- `src/views/actions-content.tsx`
- `src/components/ui/decision-surface.tsx`
- `src/components/ui/tool-call.tsx`
- `registry/base-nova/ui/decision-surface.tsx`
- `registry/base-nova/ui/tool-call.tsx`
- `registry.json`

### Verification

- Actions route first viewport should show consequence before implementation specs.
- Approval specimen must be understandable without reading the paragraph above.
- Browser test states:
  - pending
  - approved
  - rejected
  - modified
  - expired/changed
  - executing
  - complete
  - rollback available

## Issue 7: Trust Settings Look Generic Instead Of Policy-Driven

### Research Read

PAIR is the clearest reference here: users calibrate trust through sources, scope, reach, removal, and explanations tied to their actions. HAX adds global controls, consequences, correction, and notifications when AI behavior changes. The gist's autonomy controls also remain useful, especially inline consequence previews and per-action overrides.

The current Trust page has settings, but it does not make the effective policy visible enough. A switch is not the experience. The experience is what that switch allows, blocks, logs, or escalates.

### What To Borrow

- From PAIR: show data source, scope, reach, removal.
- From HAX: convey consequences and provide global controls.
- From the gist: autonomy level, confidence threshold, per-action overrides.
- From OpenAI Memory/Search docs: memory and personalization sources should be reviewable and controllable.

### Action Set

1. Add `EffectivePolicyPreview`.
   - For any settings group, show:
     - `This agent can...`
     - `Requires approval when...`
     - `Never allowed...`
     - `Logged to...`
     - `Applies to...`

2. Convert settings into policy groups.
   - Autonomy:
     - autonomy level
     - confidence threshold
     - action categories
     - human review rule
   - Data:
     - source scope
     - personal/team/global reach
     - retention
     - removal path
   - Notifications:
     - blocked run
     - high spend
     - new memory
     - policy change
   - Recovery:
     - kill switch
     - rollback
     - audit export

3. Add policy diff for risky setting changes.
   - Before: `Send customer email requires approval.`
   - After: `Send customer email can run automatically under approved conditions.`
   - Require confirmation for risk-increasing changes.

4. Add settings state variants.
   - `recommended`
   - `custom`
   - `risky`
   - `inherited`
   - `overridden`
   - `locked by admin`

5. Make confidence human-readable.
   - Do not use raw `83%` as the only signal.
   - Pair with wording:
     - `High confidence, still needs approval because external send.`
     - `Low confidence, blocked until source is confirmed.`

6. Add provenance to trust controls.
   - Show which source set a policy applies to.
   - Show who changed it and when.
   - Show last triggered example.

7. Add registry template.
   - `agent-settings-template`
   - Depends on `field`, `switch`, `decision-surface`, `reference-item`, `badge`.
   - Includes settings schemas and policy preview examples.

### Files To Touch

- `src/views/trust-content.tsx`
- `src/components/ui/decision-surface.tsx`
- `src/components/reference/pattern-state-matrix.tsx`
- `src/content/templates.ts`
- `registry.json`
- new `src/components/ui/effective-policy-preview.tsx` or reference-only component

### Verification

- The Trust page first specimen should answer: "What changes if I flip this?"
- Risk-increasing toggle has confirmation or undo.
- Labels are clickable.
- Screen reader names describe the setting consequence, not just "switch".
- Desktop and mobile screenshots show policy preview without horizontal overflow.

## Issue 8: Memory Needs Provenance And Lifecycle Visible Earlier

### Research Read

The gist already says memory should be controllable: display, edit, delete, incognito, dashboard, remembered context indicators. OpenAI's current Memory FAQ adds useful updated patterns: memory summaries, sources, corrections, deletion, and relevant-source controls. PAIR adds scope, reach, and removal as core trust mechanisms.

The current Memory page has edit/delete actions, but the first-read experience still looks like a list. Memory needs to feel like a ledger: what is remembered, where it came from, where it applies, when it expires, when it was last used, and how to correct it.

### What To Borrow

- From OpenAI Memory FAQ: source and summary of saved memories, correction and deletion controls.
- From PAIR: source, scope, reach, removal.
- From HAX: global controls, correction, consequences of learning.
- From the gist: remembered context badge and incognito mode.

### Action Set

1. Redesign memory rows as provenance ledger entries.
   - Each row should show:
     - memory text
     - source
     - scope
     - owner
     - last used
     - expiry
     - confidence or review state
     - actions

2. Add lifecycle states.
   - `proposed`
   - `saved`
   - `used`
   - `edited`
   - `stale`
   - `expired`
   - `deleted`
   - `blocked`

3. Add "why used" disclosure.
   - When memory influences output, show:
     - `Using 2 memories`
     - expandable list
     - source and reason
     - `Do not use this here`

4. Add proposed-memory review surface.
   - Agent proposes a durable memory.
   - User can:
     - edit text
     - set scope
     - set expiry
     - save
     - reject
     - never remember this type

5. Add memory source card.
   - Similar to the supplied citation reference image:
     - source title
     - snippet
     - page/location
     - open source
     - previous/next if multiple sources
   - This pattern should work for citations and memory provenance.

6. Add privacy controls that are not hidden at the bottom.
   - Incognito/no-memory for this run.
   - Memory scope selector.
   - Auto-save requires review toggle.
   - Category blocklist.

7. Add registry impact.
   - Extend `reference-item` or add `memory-ledger-item`.
   - Add `memory-review-template`.
   - Include lifecycle docs and example state data.

### Files To Touch

- `src/views/memory-content.tsx`
- `src/components/ui/reference-item.tsx`
- `src/views/conversation-content.tsx` for remembered context indicators
- `src/content/templates.ts`
- `registry.json`
- potential new `src/components/ui/source-preview.tsx`

### Verification

- First viewport of `/memory` must show source, scope, expiry, and action affordances.
- Proposed memory can be saved/rejected/edited in the demo.
- Keyboard can reach edit/delete/scope controls.
- Mobile layout remains readable without table overflow.
- Memory-related registry item installs cleanly.

## Recommended Implementation Order

1. Fix mobile spec tables and touch target audit first.
   - This improves every route and reduces immediate quality drag.

2. Promote Templates and build `TemplateFlowPreview`.
   - This changes the product read from "UI kit" to "reference workflows."

3. Create semantic surface grammars.
   - Add tokens and route-specific frames before redesigning every specimen.

4. Rework Actions and Trust together.
   - Both need policy, consequence, approval, and rollback.

5. Rework Memory and Citations together.
   - Both need source preview, provenance, scope, and open-source behavior.

6. Reframe Conversation after the above exists.
   - Conversation can then point into the stronger non-chat surfaces.

## Acceptance Criteria For The Next Big Implementation Pass

- `/templates` no longer reads as a directory of cards.
- The first route impression communicates workflow, decisions, state, and governance beyond chat.
- Mobile pages do not expose desktop tables as the primary reading shape.
- Icon targets are 32px minimum on desktop and 40px for touch/mobile primary controls.
- Actions show affected objects, reversibility, cost/time, policy reason, and locked payload state.
- Trust settings show effective policy and consequence previews.
- Memory rows expose source, scope, expiry, last used, and lifecycle.
- Registry includes at least one installable template/block, not only UI primitives.
- Browser QA covers desktop and mobile for `/templates`, `/actions`, `/trust`, `/memory`, `/conversation`.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run registry:build`, and `npm run audit:ui` pass.

## What I Would Not Do

- Do not add decorative gradients, glow, or visual noise to solve homogeneity.
- Do not make Motion Principles visible as end-user product guidance again.
- Do not expose hidden chain of thought. Use observable work, sources, tool events, and status.
- Do not ship templates as static docs only. They should be registry-ready blocks or at least coupled to installable primitives.
- Do not solve mobile by only shrinking fonts. Change page order, table representation, controls, and target areas.
- Do not make Conversation the landing-page hero unless the page explicitly demonstrates non-chat outcomes.
