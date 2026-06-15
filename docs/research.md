# Agentic UX Design Patterns

> A position document and field map for designing agent interfaces.
> Compiled March 2026 · revised and synthesized June 2026.
> Canonical research backing for [agentic-craft](https://github.com/bitcomplete/agentic-craft).

## How to read this document

This is the canonical research artifact behind agentic-craft. It is two things at once and labels each clearly:

1. **A position document** (sections 1–9). What we believe agentic UI should be, what patterns the registry encodes, and what we explicitly reject. Opinionated. Driven by the product.
2. **A field map appendix** (sections 10–13). What the field looks like in mid-2026: who is shipping what, where conventions have settled, where they have not, and what we don't yet know. Descriptive. Honest about gaps.

### Evidence tiers

Every claim about a pattern is tagged with a confidence tier:

- **[Convention]** — Three or more major products ship it; the pattern is settled.
- **[Convention-forming]** — Two products ship it and adoption is accelerating; on track to become convention within a year.
- **[Emerging]** — One or two products ship it; recent (2025–2026); industry is still feeling out the shape.
- **[Speculative]** — Proposed in standards, papers, or single-vendor previews; not yet validated at scale.

Tiers are how this document signals what is safe to copy versus what is a bet.

### Citations

Primary sources first. Where a primary source is unavailable, secondary sources are cited explicitly and flagged. Where a claim has no citation it is the authors' own position and should be read as such.

---

## Table of contents

**Position (what we believe)**

1. [The UX → AX shift](#1-the-ux--ax-shift)
2. [Foundational pattern frameworks](#2-foundational-pattern-frameworks)
3. [Visible work, locked consequences](#3-visible-work-locked-consequences)
4. [Autonomy as a contract](#4-autonomy-as-a-contract)
5. [Trust through provenance](#5-trust-through-provenance)
6. [Memory as ledger, not magic](#6-memory-as-ledger-not-magic)
7. [Operational surfaces beyond chat](#7-operational-surfaces-beyond-chat)
8. [Agent-authored UI: the third layer](#8-agent-authored-ui-the-third-layer)
9. [Dynamic Workflows as a product surface](#9-dynamic-workflows-as-a-product-surface)

**Field map (what exists)**

10. [Product inventories: how the leaders ship in mid-2026](#10-product-inventories)
11. [Anti-patterns and what we explicitly reject](#11-anti-patterns)
12. [Open questions the field has not answered](#12-open-questions)
13. [How this maps to the agentic-craft registry](#13-registry-mapping)

**Principles**

14. [Ten principles, defended](#14-ten-principles-defended)

## 1. The UX → AX shift

The shift from traditional UX to Agentic Experience (AX) is structural, not cosmetic. Designers who treat agents as "smarter forms" ship the wrong thing.

| Dimension | Traditional UX | Agentic Experience |
|-----------|----------------|-------------------|
| Unit of design | A screen flow | An ongoing relationship |
| Path planning | Designer pre-plans every flow | Agent plans its own execution |
| Context | User re-supplies on each session | Context is learned across sessions |
| Success metric | Task completed quickly | Trust accumulated and value compounded |
| Failure mode | User picks the wrong path | Agent confidently does the wrong thing |
| Trust contract | Static (same behavior always) | Dynamic (must be re-earned as autonomy grows) |
| Designer's role | Drawing flows | Defining constraints |
| Feedback loop | Immediate, synchronous | Async, multi-turn, cross-session |

**The reframe that matters.** Generative UI shifts designers from designing for the average user to designing constraints — *what must be shown / should be shown / never shown* — and letting the system compose the rest. ([NN/g: Generative UI](https://www.nngroup.com/articles/generative-ui/))

**The shift in agent role.** Agents are no longer tools; they are actors. Service design must now account for personal agents that act for users and organizational agents that act for businesses. Agent-to-agent compatibility is becoming a competitive metric. ([NN/g: Service Design with AI Agents](https://www.nngroup.com/articles/service-design-evolve-ai-agents/))

NN/g's 2026 working definition of an AI agent — *"a system that pursues a goal by iteratively taking actions, evaluating progress, and deciding its own next steps"* — is the cleanest formulation in the field. ([NN/g: State of UX 2026](https://www.nngroup.com/articles/state-of-ux-2026/)) The loop-based framing distinguishes agents from chatbots and from autocomplete.

**Why this section is short.** The framing is settled. The disagreements in the field are about what to do *with* this framing — those are the next eight sections.

## 2. Foundational pattern frameworks

Six frameworks form the working canon. None is complete; each captures something the others miss. We treat them as inputs, not authorities — the position the rest of this document takes is informed by them but is not bound by them.

### 2.1 Shape of AI — the pattern library

Emily Campbell's [shapeof.ai](https://www.shapeof.ai) is the most thorough taxonomy of chat-and-generative patterns in production. Five families, ~45 named patterns:

- **Wayfinders** — onboarding, suggestions, example galleries, templates, prompt details
- **Prompt Actions** — how users submit and refine (regenerate, expand, transform, restructure, chained actions)
- **Tuners** — context inputs (attachments, connectors, filters, seeds, reference images)
- **Controls** — feedback, undo, settings, oversight surfaces
- **Results** — side-by-side, inline, history, downloads

**What it gets right.** Comprehensive, observed-in-the-wild, vendor-neutral.

**What it misses.** The frame assumes a chat-shaped product. It under-represents orchestration, scheduled work, multi-agent operations, and the operational layer beyond a single conversation.

### 2.2 Microsoft HAX — 18 evidence-based guidelines

Published at [CHI 2019](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf), validated through a user study of 49 design practitioners across 20 AI-infused products. Four phases:

- **Initially** (G1–G2): make clear what the system can do, how well
- **During interaction** (G3–G8): context sensitivity, efficient invocation/dismissal
- **When wrong** (G9–G11): efficient correction, scoping in doubt, explaining behavior
- **Over time** (G12–G18): remember interactions, learn cautiously, encourage granular feedback, convey consequences, provide global controls, notify on changes

**What it gets right.** Empirically validated. The "over time" phase is the most useful framing for agentic products specifically.

**What it misses.** Predates the modern agentic surface. Has no model of tool use, no notion of agent-authored UI, no autonomy spectrum. Treats AI mostly as suggestion/inference, not as actor.

### 2.3 Google PAIR — product lifecycle

[pair.withgoogle.com/guidebook](https://pair.withgoogle.com/guidebook) — six chapters mapped to product development lifecycle (user needs → data → expectations → explanation → feedback → errors). A companion codelab launched March 2026. ([PAIR Codelab](https://codelabs.developers.google.com/codelabs/pair-guidebook))

**Highest-value contribution.** Show confidence in human-understandable categories, not raw numbers. Use semantic categories (likely, possible, uncertain) or ranked ordering, never `0.73`.

**What it misses.** Lifecycle framing, not pattern framing — useful for product managers, less useful for designers actively choosing components.

### 2.4 Apple HIG for Machine Learning

[Apple's HIG for ML](https://developer.apple.com/design/human-interface-guidelines/machine-learning) defines five role dimensions (criticality, data scope, initiative, visibility, changeability) and patterns for input (explicit/implicit feedback, calibration) and output (corrections, mistakes, multiple options, confidence, attribution, limitations).

**Highest-value contribution.** The role-dimension framing. Before designing for an agent, name where it sits on each axis — that determines which patterns are appropriate.

### 2.5 LukeW — Agent management interfaces

Luke Wroblewski's two pieces are the strongest practitioner-focused framework for agentic product design.

**["Agent Management Interface Patterns"](https://www.lukew.com/ff/entry.asp?2106) (June 2025).** Identifies five management needs — start, schedule, scrutinize, steer, stop — and tests kanban, dashboards, inboxes, task lists, and calendars as primary organizational metaphors. Finds **inbox and kanban most legible** for multi-agent management.

**["Showing the Work of Agents in UI"](https://www.lukew.com/ff/entry.asp?2142) (February 2026).** Documents the core split between users who want to see agent reasoning (*monitoring users*) and users who just want results (*outcome users*). Key empirical finding from Bench: defaulting to fully visible work caused abandonment; **progressive disclosure resolves the split** — tool calls collapsed by default, expandable on demand, with a timeline of decision points.

These two pieces are the load-bearing empirical work for §3 and §7 below.

### 2.6 Smashing Magazine — the agentic AI lifecycle

Victor Yocco's ["Designing for Agentic AI"](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/) (February 2026) introduces a six-pattern lifecycle: **Intent Preview · Autonomy Dial · Explainable Rationale · Confidence Signal · Outcome Summary · Feedback Mechanism**. The article also names **"agentic sludge"** — the failure mode of over-confirmation, excessive process visibility, and friction-by-default — as a first-class anti-pattern.

We adopt the lifecycle framing and the anti-pattern terminology in §3 and §11.

### 2.7 What they all miss

None of these frameworks adequately covers:

- **Multi-agent operations.** Orchestrating fleets, surfacing per-agent state, attributing failures.
- **Agent-authored UI.** Agents that pick or compose components at runtime — a separate architectural layer.
- **Background-by-default agents.** Ambient agents that run when the user isn't looking and need their own surface model.
- **Plan-as-code.** Workflows as inspectable scripts, not implicit LLM decisions.

Those gaps are the territory of sections 3, 8, and 9.


## 3. Visible work, locked consequences

> **Position.** Trust in agentic systems is built by making two things first-class: the *work the agent does* (visible, structured, inspectable but not theatrical) and *the consequences of its actions* (locked previews users approve before anything is committed).

### 3.1 Visible work

The agent shows what it is doing as a structured trace: tool calls with state, sources consulted, steps in a plan, time elapsed. Not raw chain-of-thought; not theater; not a spinner.

**The principle.** Users who can see what the agent did trust it more than users who get a confident result with no trace. ([Microsoft HAX G11](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf)) But too much visibility produces "agentic sludge" — defaulting to full reasoning traces and per-step approvals drives abandonment. ([LukeW: Showing the Work of Agents](https://www.lukew.com/ff/entry.asp?2142))

**The resolution: progressive disclosure.** Tool calls collapsed by default; expandable on demand; full trace available but not in the user's face. AWS Cloudscape codified the most principled rule we've seen: **collapsed by default in chat interfaces; expanded by default in code/document editors**. ([Cloudscape: Thinking pattern](https://cloudscape.design/gen-ai/patterns/thinking/), April 2026) Different audiences need different defaults; the user type drives the choice, not the designer's preference.

**What visible work is.**

- A row per tool call with status (running / done / failed / blocked), input summary, output summary
- A timeline of steps with explicit transitions
- Sources consulted (with provenance — see §5)
- Time elapsed and cost incurred (see §7.3)
- A skip-thinking option when the system can deliver a meaningful answer without completing reasoning ([Cloudscape: Thinking](https://cloudscape.design/gen-ai/patterns/thinking/))

**What visible work is not.**

- It is not raw chain-of-thought. Anthropic's choice to expose summarized thinking is correct; exposing raw reasoning encourages over-trust in confident-sounding prose. ([Anthropic: Extended Thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking))
- It is not a spinner. A spinner on a tool call is the canonical AI-demo chrome failure — it implies progress without showing any.
- It is not theater. If a step ran in 40ms, do not animate it for 600ms.
- It is not appropriate everywhere. Sub-second inline completions (Cursor's tab-complete) should hide their work; surfacing it *is* the latency. Show work when the user is deciding; hide it when the user is typing.

**Honest disclosure.** Empty disclosure rows that pretend to expand are a violation: nothing should look interactive that isn't. ([agentic-craft DESIGN.md](https://github.com/bitcomplete/agentic-craft/blob/main/DESIGN.md))

### 3.2 Locked consequence previews

Before any action with meaningful side effects, the agent renders a *locked preview*: a fully-structured representation of the artifact that will be created, in the format of the target system, with explicit approve/reject controls.

**Why "locked."** Once the preview is shown, the parameters are committed: hitting approve produces *exactly* the artifact shown. No re-prompting, no slight differences. The preview *is* the contract.

**What it shows.**

- The exact artifact (a calendar event card, a Linear ticket, an email draft) — not a text summary
- Structured fields matching the target system
- The reason this action was chosen ("Because the bug meets your P0 criteria")
- Three-way controls: **Approve / Modify / Reject** (not just yes/no)
- Time-to-live for blocked decisions ("Waiting 14 min — expires in 6 min")

**[Convention]** The pattern is settled across Cursor, Claude Code, GitHub Copilot Workspace, Claude Cowork, and Gemini Spark. Each shipped a variant of the inline-preview-then-approve loop in 2025–2026; the shape is now consistent across products even when the implementations differ.

**Risk-tier the gates.** Locked previews are not a uniform demand on every action. The convention emerging across products is risk-tiered gates: auto-execute low-risk reads, preview-and-approve medium-risk changes, full structured-confirmation for high-risk destructive or external actions, block-or-notify-only for irreversible operations. Refusing to risk-tier produces **agentic sludge** — the over-confirmation anti-pattern Smashing Magazine named in February 2026. The exact thresholds belong in the per-action-type autonomy matrix (see §4.2).

**Our position on what locked previews are *not*.**

- They are not the same as a confirm dialog ("Are you sure?"). A confirm asks the user to remember what they were doing; a preview *shows* what's about to happen.
- They are not optional for *consequential* actions. Whether an action is consequential is determined by the autonomy matrix, not by the designer's intuition.

**Composition.** Visible work and locked previews compose: the agent shows work *until* it reaches an action gate, then renders the preview, then waits. The trace continues after approval.

**Claude Cowork as the canonical product framing.** Anthropic ships exactly this position in their product copy: *"Claude Cowork is designed with human oversight in mind. It completes tasks, but consequential decisions remain with the user."* ([Claude Cowork](https://www.anthropic.com/product/claude-cowork)) The autonomy-with-gates contract is the product's framing, not a designer's add-on.


## 4. Autonomy as a contract

> **Position.** Autonomy is not a slider on a settings page. It is a contract between user and agent, expressed across at least three dimensions, and re-negotiated whenever the agent's behavior changes.

### 4.1 The 5-level autonomy spectrum (our canonical model)

Multiple frameworks converged on a 5–6 level structure between 2024 and 2026, directly analogized to SAE J3016 automotive automation levels. The most-cited variant in shipping products in 2026 is the 5-level model (Knight First Amendment Institute / Anthropic Feb 2026 framing); the [CSA Agentic Trust Framework](https://zylos.ai/research/2026-03-28-ai-agent-autonomy-levels-taxonomy-trust-calibration/) (January 2026, 6 levels) and [DeepMind's Levels of AGI](https://arxiv.org/abs/2311.02462) (5×5 capability × autonomy) are the principal competitors.

We adopt the 5-level model as canonical for agentic-craft.

| Level | Name | What the agent does | What the user does | UI surface |
|-------|------|---------------------|---------------------|------------|
| **L1** | Operator | Single-step responses to narrow commands. No memory, no plan. | Initiates every action | Inline composer; suggestion chips |
| **L2** | Collaborator | Plans a sequence of steps; user initiates each | Triggers the plan; supervises each step | Plan card; observable work; per-step approve |
| **L3** | Consultant (HITL) | Plans and executes; pauses before flagged actions | Approves at action gates | Locked consequence preview; decision surface |
| **L4** | Approver (HOTL) | Acts autonomously within a sandbox; surfaces results for review | Reviews outcomes; intervenes when needed | Run monitor; kill switch; live trace |
| **L5** | Observer | Self-directed; manages its own goals | Reviews after the fact | Activity log; anomaly alerts |

**Why 5 and not 6.** L2/L3/L4 carry the product-relevant gates (per-step approval, action-gate approval, sandboxed autonomy). The 6-level CSA framework adds a useful L0 ("no agent") that isn't a UI state. Variant taxonomies are catalogued in Appendix A.

**Default position.** Ship at L2 by default. Earn the right to L3 with the user. We hold this position despite shipping counter-evidence (Devin 2.2 defaults to L4; Gemini Spark defaults to ambient/background operation; Claude Code subagents run at L4 inside Dynamic Workflows). The counter-evidence is what makes this an open question, not a settled answer — see §12.9.

**Why "earn."** Autonomy is delegated trust. A new user has no basis to extend it. Products that auto-default to L4 ("background mode is on") risk failing the trust contract before the user understands what was delegated. The strongest existing safety case for high default autonomy is Gemini Spark's, which combines ambient operation with an explicit "checks with you before taking major actions" gate. ([Google: I/O 2026 announcements](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/))

### 4.2 Autonomy is more than one number

A single "autonomy level" setting is a usability lie. Real autonomy is a matrix:

- **Per-action-type** — Read CRM (autonomous OK) ≠ Send email to customer (always ask).
- **Per-confidence** — Below threshold → escalate; above → act.
- **Per-cost** — A $0.01 action and a $50 action need different approval flows even if both are "send_email."
- **Per-rate** — "Auto-archive tickets" is fine at 10/day, alarming at 1,000/day.

**Pattern.** Surface the *effective policy* — the actual behavior the matrix produces — as a separate preview. agentic-craft calls this the **effective-policy-preview**: a compact summary that takes the autonomy, approval, notification, and memory settings and shows the user what they actually produced ("Will ask: emails to external addresses, any action > $10. Will not ask: internal reads, archival.")

This is the single piece of agent UI most often missing in shipping products.

### 4.3 Renegotiation

Autonomy contracts are not set-and-forget. The agent should re-confirm autonomy when:

- The agent updates (new model, new tools, new behaviors) — per Microsoft HAX G14, G18
- The user reviews their own history and sees an outcome they didn't expect
- An action's blast radius changes (rate, cost, recipient set)

**[Emerging]** Most products do not yet handle renegotiation well. ChatGPT and Claude notify on major changes; almost no product re-asks autonomy questions after a surprising outcome.

### 4.4 Anthropic's "disposition dial"

Beyond per-product autonomy settings, Anthropic positions its own model behavior on a "disposition dial" ranging from *fully corrigible* (does whatever instructed) to *fully autonomous* (acts on its own values). Current Claude models sit closer to the corrigible end — a deliberate safety choice with direct UX implications: agents defer to the principal hierarchy (Anthropic → operator → user) rather than override it. The autonomy contract a product designs sits on top of this model-level disposition.


## 5. Trust through provenance

> **Position.** Trust in agentic systems is not earned through confident prose. It is earned through *provenance* — visible links between every claim and its source. An agent that says less but cites everything beats an agent that says more without sources.

### 5.1 Provenance as the universal pattern

Provenance generalizes citations, source previews, and footprints into one concept: every claim, output, and action should be traceable to its inputs.

**The three layers.**

| Layer | What's traced | Pattern |
|-------|---------------|---------|
| **Claims** | Prose statements → source documents | Inline citations with source-preview hover |
| **Outputs** | Generated artifacts (reports, code, drafts) → which sections came from which sources | Source-backed artifact with cited sections |
| **Actions** | External actions → which inputs justified them | "Why this action" inside the locked preview |

### 5.2 Confidence done right

- **Never** show raw probabilities (`0.73`) outside technical/expert tools.
- **Prefer** semantic categories: "high chance," "likely," "possible," "uncertain."
- **Or** convey confidence through ranking: the top result is the most confident, full stop.
- **Withhold** low-confidence results for proactive/ambient features. ([Apple HIG: Confidence](https://developer.apple.com/design/human-interface-guidelines/machine-learning))

### 5.3 What honest disclosure looks like

- Every AI-generated artifact carries a visible label.
- Every memory entry shows where it came from.
- Every external action shows whose data it touched.
- Incognito modes exist and are visible when active.
- Nothing pretends to be deterministic that isn't.

**[Convention]** Citation patterns are settled (Perplexity and Claude shipped the canonical implementations). Provenance for *actions* and *memory* is **[Emerging]** — most products do not yet show "this action was justified by these inputs."


## 6. Memory as ledger, not magic

> **Position.** If an agent remembers anything about the user, the user must be able to see, edit, and delete each memory individually. "The model just learns" is not a UI; it's a violation.

### 6.1 The ledger model

Memory is not a personality. It is a ledger of entries. Each entry has:

| Field | Purpose |
|-------|---------|
| **Content** | What is remembered |
| **Source** | Where it came from (which conversation, which document) |
| **Scope** | Personal / project / org |
| **Created** | When |
| **Last used** | When the agent last applied this memory |
| **Expiry** | When it expires (some memories should sunset) |
| **Status** | Active / muted / archived |

The user surface is a row per memory with edit, mute, expire, and delete affordances. agentic-craft ships this as **memory-ledger-item**.

### 6.2 Memory taxonomy (working set)

- **Preferences** — explicit ("I prefer concise responses") and implicit (learned from usage)
- **Facts** — about the user, their team, their projects
- **Semantic** — meaning-based retrieval anchors
- **Procedural** — workflows the agent has learned to repeat

### 6.3 The shipping landscape

The four major consumer products now ship visible memory management surfaces with different shapes:

| Product | Surface | User edit | Delete | Scope | Off switch |
|---------|---------|-----------|--------|-------|-----------|
| **ChatGPT** | "Dreaming" memory summary page; synthesizes a memory profile asynchronously from past conversations | Text-box edit; highlight-to-correct | Per-item or full | Whole account | Yes; Temporary Chat does not read or create memories ([OpenAI release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)) |
| **Claude** | Memory tool surfaced in tool list; Memory Import from ChatGPT (March 2026) | Via MCP/tool API | Via MCP/tool API | Session + persistent | Per-conversation incognito |
| **Gemini** | Personal-context settings: "Memory" toggle + "Instructions for Gemini" standing instructions | Yes (standing instructions) | Yes | Account | Yes (toggle) |
| **Perplexity** | Two-part system: structured preferences + search history; cross-model persistence | Partial (preference overrides) | Yes; 30-day recovery | Account, cross-model | Documented gap |

The convention is now **visible-and-editable memory**; the open shape question is *how* to expose it (settings panel vs. inline tool vs. summary page).

### 6.4 Memory is reviewable, not just visible

**Pattern.** Periodic memory reviews — a queue surfaces newly captured memories for explicit confirmation before they take effect. Like an inbox of provisional memories. agentic-craft ships this as **memory-review**.

**[Emerging]** ChatGPT and Claude show their memory lists; almost no product runs a periodic review queue. We think they should.

### 6.5 Memory controls

- **Forget this** — delete one memory
- **Forget this thread** — delete everything from a session
- **Never remember category X** — block whole categories
- **Incognito** — turn recording off for the current session, visibly
- **Export / import** — portability is part of trust (Anthropic's Memory Import from ChatGPT is the first cross-vendor implementation)

**The gap that matters.** No major product has shipped **per-topic memory controls** — "remember my coding preferences, but not my health details." Current controls are binary (all-on/all-off) or aggregate (delete all memories). Users who want selective memory have no supported path. This is the sharpest live memory gap in the field as of June 2026.

## 7. Operational surfaces beyond chat

> **Position.** Chat is one interface model among many. The operational surfaces — dashboards, inboxes, task lists, calendars, monitors — carry the weight of agentic products at scale. Designing a chat-only agent is designing a toy.

### 7.1 The five operational layouts

After [LukeW's analysis](https://www.lukew.com/ff/entry.asp?2106) and observation across shipping products, five layouts cover most operational needs. Each has trade-offs; the right choice depends on what the user is trying to do.

| Layout | Best when | Strengths | Weaknesses |
|--------|-----------|-----------|------------|
| **Kanban** | Work moves through defined stages | At-a-glance state for many agents; drag-to-reorder familiar | Implies workflow; weak on dependencies |
| **Dashboard** | High-level status across many agents/sources | Dense; flexible; no implied sequence | Easily overwhelming; weak on dependencies |
| **Inbox** | Approvals and questions one at a time | Familiar mental model; satisfying "zero" state | Scales poorly with volume; weak on parallel state |
| **Task list (hierarchical)** | Complex plans with sub-tasks and dependencies | Shows dependencies clearly; checkbox completion | Less visual; nesting hides parallel state |
| **Calendar** | Scheduled and time-bounded agents | Native time framing; integrates with real meetings | Variable-duration tasks hard to render; weak on event-triggered |

**[Convention]** All five ship across the market. Inbox is the most common default for HITL-heavy products; dashboards dominate ops-heavy products; kanban is common in agent-building tools.

### 7.2 The "manager surface" pattern

Google Antigravity (November 2025) introduced an explicit name for a pattern that's becoming standard: the **Manager Surface** — a dedicated interface, separate from the editor or chat, where you "spawn, orchestrate, and observe multiple agents working asynchronously across different workspaces." ([Google Antigravity](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/))

The Manager Surface is not a new layout; it's a *posture* — agents have their own dedicated space, not a sidebar inside an editor. Cursor's Background Agent panel and Claude Code's `/workflows` inspector follow the same posture. **[Convention-forming]** as of mid-2026.

### 7.3 Observability is product surface, not infra

For any agent the user trusts to act, the user must be able to see:

- A reverse-chronological **activity log** of every run
- For each run: trigger, duration, outcome, cost, human involvement
- A **mission detail** showing each step (trigger → reasoning → tool calls → HITL → output) with duration and cost per step (the Datadog-trace pattern)
- Filters by date, outcome, action type
- Export and search

agentic-craft ships these as **run-trace** (the dense per-run view) and **run-monitor** (the operational rollup).

### 7.4 Background tasks are first-class

Agents now spend most of their time off-screen. The UI surface for background work is the difference between a useful agent and an anxiety machine.

- **Scheduled tasks** — cron-style or event-based triggers with human-readable preview ("Every Monday at 9am" / "When a new issue is filed").
- **Background task panel** — persistent surface showing active background work, with quick inspect.
- **Notifications** — when background tasks complete, fail, or need attention. Calibrated; not every event needs a ping.
- **Cost meters** — visible budget for background runs (see §9).

**[Convention]** Cursor's Background Agent, OpenAI's Codex app, Perplexity Computer, Claude Code's Dynamic Workflows panel, and Google Antigravity's Manager Surface all ship background-task surfaces. The shape is settling.

**The ambient pole.** Gemini Spark (Google I/O 2026, [primary announcement](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/)) is the field's first consumer-scale ambient agent: a "24/7 personal AI agent" that "works in the background on your phone or laptop even while they're turned off." It runs on Gemini 3.5 and is built on the Antigravity platform. Spark is the most aggressive default-autonomy bet shipping in mid-2026; it operates autonomously "under your direction" with an explicit "checks with you before taking major actions" contract. Whether the consumer-grade ambient posture wins or backfires is one of the field's biggest live experiments — see §12.9.

## 8. Agent-authored UI: the third layer

> **Position.** One of the fastest-moving architectural shifts in agentic UI since 2024 is the move from *agents that inhabit interfaces* to *agents that author interfaces at runtime*. This is a separate layer of the stack, with its own patterns, and it is not yet well-handled by existing frameworks.

### 8.1 What "agent-authored UI" means

Traditional pattern: the designer ships a UI; the agent operates inside it.

New pattern: the agent picks (or generates) UI components dynamically — a chart when a chart is the right answer, a form when a form is, a custom widget for a niche decision — and streams that UI to the user as a tool output. The designer ships the *primitives* and the *constraints*; the agent assembles them.

### 8.2 Why it matters

- **The right UI per question.** "Show me last quarter's revenue" deserves a chart, not paragraphs. The agent should pick.
- **Bidirectional state.** Agent-authored UI is interactive — the user clicks a date range, the agent re-queries, the UI updates. State flows both ways.
- **Reduced cognitive overhead.** Generated UI is purpose-built for one decision, not a general-purpose form the user has to translate.

### 8.3 The protocol stack (mid-2026)

The independent research surfaced a clean layering: **agent-authored UI is not one protocol — it's a stack of four protocols at distinct layers**, plus product-level implementations.

| Layer | Protocol | What it standardizes | Status |
|-------|----------|----------------------|--------|
| Agent ↔ Tools & Data | **MCP** (Model Context Protocol) | Secure tool/data access | [Convention] |
| Agent ↔ Agent | **A2A** | Multi-agent coordination | [Convention-forming] |
| Agent ↔ User (events) | **AG-UI** | Real-time, event-based connection between agent backend and frontend | [Emerging] |
| Agent ↔ User (generative UI) | **A2UI** | Generative-UI layout passing as data (not executable code) | [Emerging] |

The AG-UI documentation makes the relationship explicit: AG-UI handles streaming, thinking-step visualization, and event channels; A2UI handles layout descriptions agents emit for clients to render; MCP handles tool access. They are complementary, not competitive. ([AG-UI docs](https://docs.ag-ui.com), [A2UI announcement](https://developers.googleblog.com/en/introducing-a2ui-an-open-project-for-agent-driven-interfaces/))

**Product-level implementations.**

| Implementation | Vendor | Model | Status |
|---|---|---|---|
| **MCP Apps** | Anthropic + OpenAI + MCP community | MCP server returns UI as a tool result; client renders it inside chat in a sandboxed iframe with bidirectional context | **[Convention-forming]** — announced January 26, 2026; launch clients include ChatGPT, Claude, Goose, and VS Code ([MCP Apps announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)) |
| **A2UI** | Google (open source) | Renderers for Lit, Angular, Flutter; layouts passed as messages, not executable code | **[Emerging]** — public December 15, 2025 ([Google Developer Blog](https://developers.googleblog.com/en/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)) |
| **AG-UI** | Open community | Event-based protocol; supports both static generative UI and declarative generative UI | **[Emerging]** ([docs.ag-ui.com](https://docs.ag-ui.com)) |
| **AI SDK 6 generative UI** | Vercel | Tool parts in `useChat`; server streams React components from LLM tool calls; type-safe end to end. `streamUI`/RSC `render()` was deprecated in AI SDK 5 (July 31, 2025) and removed in AI SDK 6 (December 22, 2025) | **[Convention-forming]** for TypeScript AI applications ([AI SDK 6](https://vercel.com/blog/ai-sdk-6)) |
| **Gemini Visual Layout / Dynamic View** | Google (Gemini) | Model-decided rich layouts inside Gemini responses | **[Emerging]**; availability has fluctuated ([Gemini Visual Layout](https://support.google.com/gemini/answer/16741341)) |

### 8.4 Design patterns for agent-authored UI

**Constraint surfaces.** The designer's job is no longer to lay out every screen; it is to define what the agent is *allowed* to render, in what slots, with what budget. This is closer to a CSS-grid template + component allow-list than a Figma file.

**Slot architecture.** Pages reserve named slots ("primary visualization," "secondary detail," "action gate"). The agent fills each slot with one of a registered set of components. The user's spatial mental model survives because the slots are stable.

**Bidirectional state via the tool.** The component is the surface; the underlying tool is the API. User interaction on the component updates the tool's state; the model re-reads the tool state on its next turn.

**Streaming progressive rendering.** Components stream field-by-field as the model produces them. Loading states per-component, not per-page.

**Fallback to text.** Every agent-authored UI must degrade to text gracefully when the client cannot render it (assistive tech, low-bandwidth, headless contexts).

### 8.5 Anti-patterns specific to agent-authored UI

- **Unbounded generation.** Letting the agent produce arbitrary HTML/JS at runtime. The component allow-list is the safety boundary.
- **Layout drift between turns.** The same question on Tuesday rendering completely differently from Monday — destroys the user's spatial memory.
- **Decorative components masquerading as informational.** A 3-D pie chart instead of a sparkline because the agent thought it looked cooler.
- **No textual alternative.** Cuts off accessibility and search.

### 8.6 What agentic-craft contributes

agentic-craft is not yet a renderer for agent-authored UI — but it is the *primitives library* such a renderer would draw from. Items like `action-preview`, `clarifying-questions`, `decision-surface`, `source-preview`, `agent-status-table`, and `usage-meter` are the kind of well-typed components an agent-authored UI runtime should reach for. The position to take: ship the primitives now; the renderer integration is a 2027 problem.

## 9. Dynamic Workflows as a product surface

> **Position.** Anthropic's Dynamic Workflows (May 2026) is the most concrete shipping example of *workflow-as-product* — a user surface for declarative multi-agent orchestration that is neither chat nor dashboard. It deserves first-class treatment in this document because the UI patterns it introduces are likely to become conventions across the industry.

### 9.1 What Dynamic Workflows is

A research preview in Claude Code that lets users (or agents) declare a workflow as a script, then run it across a fleet of subagents. The workflow is *plan-as-code* — explicit phases, agent definitions, and dependencies — and the UI is purpose-built for monitoring, pausing, resuming, and re-running it. ([Anthropic: Introducing Dynamic Workflows in Claude Code](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code), [Claude Code Workflows docs](https://code.claude.com/docs/en/workflows))

### 9.2 The UX surface (full inventory)

This is the most detailed product UI we've seen for multi-agent operations, and we catalog the full surface because it sets a reference point.

**The `/workflows` command.** Opens the workflow inspector. Lists all runs with status, agent count, token usage, and elapsed time.

**The progress view.** A phase rail showing each phase's status. Per-phase rollup: number of agents, tokens consumed, elapsed time. Click into a phase to see per-agent state.

**Keyboard navigation.**

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate runs / phases / agents |
| `Enter` / `→` | Drill into the selected item |
| `Esc` | Back up one level |
| `p` | Pause / resume the run |
| `x` | Stop the run |
| `r` | Restart the run |
| `s` | Save current run as a reusable slash command |

**Effort levels.** Claude's `effort` parameter has **five levels**: `low`, `medium`, `high` (default), `xhigh`, and `max`. These are an API-level reasoning-depth control supported across Opus 4.6+, Sonnet 4.6, and the newer Mythos/Fable family. The `budget_tokens` parameter is deprecated on Opus 4.6 and Sonnet 4.6 in favor of `effort`. ([Claude effort docs](https://platform.claude.com/docs/en/build-with-claude/effort))

**The `ultracode` trigger.** Separately from effort levels, Claude Code exposes an `ultracode` keyword trigger in the input field (highlighted violet). Typing `ultracode` or invoking `/effort ultracode` activates the combination of `xhigh` reasoning plus automatic multi-agent orchestration. This is the product-facing entry point to Dynamic Workflows. ([DevelopersDigest: ultracode explained](https://www.developersdigest.tech/blog/ultracode-effort-level-explained))

| Trigger | Effect |
|---------|--------|
| Type `ultracode` in input | Activates `xhigh` + auto-orchestration; can be dismissed with `Option+W` (mac) / `Alt+W` (win/linux) |
| `/effort ultracode` | Command-line invocation of the same |
| Natural language ("use a workflow for this") | Claude offers to write a workflow script |
| `/deep-research` | Bundled workflow for research tasks |

**Approval card.** When a workflow is about to run an external script, an approval card appears: `Yes, run it / Yes, don't ask again for X / View raw script / No`. `Ctrl+G` opens the script in the editor. `Tab` lets the user adjust the prompt before approval.

**Background tasks.** A one-line summary of background work appears below the input box, expandable to the full background-task pane. The desktop client has a dedicated side pane for background tasks.

**Saved workflows.** Workflows can be saved to `.claude/workflows/` (project) or `~/.claude/workflows/` (home). Saved workflows become slash commands: `/my-workflow` invokes them.

**Resume semantics.** Workflow runs are checkpointed; if a run is interrupted, the system resumes from the last checkpoint and agents that completed retain their results. Whether checkpoint state survives across user sessions (closing and re-opening across days or devices) is not clearly documented and varies by deployment.

**Scale.** Up to 1,000 total agents per workflow run, with at most 16 running concurrently.

**Execution model.** The orchestration script cannot directly touch the filesystem or shell; only spawned subagents can. Subagents run in `acceptEdits` mode — file changes are auto-approved within the workflow.

**Availability.** Pro tier (opt-in via `/config`), Max & Team tier (default on), Enterprise (admin opt-in). Available on Anthropic API direct, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry. Requires Claude Code v2.1.154+.

### 9.3 What's new about this UI

Two patterns are genuinely novel:

1. **Phase rail as the primary surface.** Not a kanban, not a list, not a graph — a horizontal rail of phases with rollup metrics per phase. agentic-craft mirrors this in **workflow-phases**.

2. **Plan-as-code with a UI layer.** The user can both write the workflow as a script and operate it through the keyboard-driven UI. The UI doesn't hide the script; it *exposes* it (`Ctrl+G` opens the raw script). This is a refusal of the false choice between "no-code workflow builders" and "raw CLI."

### 9.4 Where Dynamic Workflows leaves things underspecified

- **Cross-session resume across days/devices.** Checkpoint-based resume works in-session; cross-session behavior is ambiguous.
- **Workflow versioning.** Saved workflows live in files but there's no UI for version history.
- **Cost meters per phase.** Tokens are shown; actual dollar cost is not.
- **Sharing.** Saved workflows are local; team-wide sharing is informal.
- **Multi-agent debugging.** When one of 16 subagents fails, no first-class root-cause attribution UI exists.

These are open questions for the field, not flaws of the preview.

### 9.5 What agentic-craft contributes

agentic-craft ships two components inspired directly by Dynamic Workflows:

- **workflow-phases** — the phase rail UI primitive, with the same status-vocabulary the rest of the system uses (check / spinner / dashed / clock / alert).
- **workflow-run-monitor** — the full multi-phase fleet monitor: phase rail, plan-as-code inset, per-phase fleet table with density collapse, run-budget meter, pause/resume/stop, failed-phase recovery.

These are the registry's only items that explicitly target multi-agent orchestration. They are intentionally aligned with the Dynamic Workflows shape because we expect that shape to become the convention.

### 9.6 The deterministic counterpoint: Microsoft Conductor

Microsoft open-sourced [Conductor](https://opensource.microsoft.com/blog/2026/05/14/conductor-deterministic-orchestration-for) (May 14, 2026), a deterministic multi-agent orchestration framework emphasizing *predictable execution paths* over LLM-driven orchestration. Less user-facing UI, more infrastructure — but it stakes out the opposite design pole from Dynamic Workflows: deterministic vs. probabilistic orchestration. **[Emerging]**. Whether the field eventually splits into two camps (deterministic for enterprise; probabilistic for dev tools) or one approach wins is an open question.

## 10. Product inventories

> **Field map.** What the leaders ship in mid-2026. Inventories are descriptive, not prescriptive — they document conventions, not endorse them.

### 10.1 Anthropic Claude

**Models.** Opus 4.6 → 4.7 (April 16, 2026) → 4.8 (May 28, 2026). Sonnet 4.6 (February 17, 2026) with 1M-token context and context compaction; current default for Free and Pro plans. Anthropic also announced a higher-tier "Mythos" frontier model in April 2026 (cybersecurity-focused preview) and "Fable 5" (June 9, 2026). The "Mythos" and "Fable" names appear in API documentation; consumer branding may differ. Effort parameter: five levels (`low / medium / high / xhigh / max`); `budget_tokens` deprecated in favor of `effort` on Opus 4.6 and Sonnet 4.6. ([Anthropic news: Claude Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6), [Claude effort docs](https://platform.claude.com/docs/en/build-with-claude/effort), [BBC on Mythos](https://www.bbc.com/news/articles/crk1py1jgzko))

**Artifacts.** Dedicated side-panel workspace for generated content (HTML apps, React components, code, documents, Mermaid, SVGs). Persistent, shareable via link, remixable; can call Claude's API directly for intelligent micro-apps. Anthropic has continued to invest in Artifacts as a side-panel pattern, in explicit contrast to OpenAI's Canvas retirement.

**Extended thinking.** Adaptive thinking automatically scales reasoning depth; summarized thinking shows users a condensed view while the model retains the full reasoning internally. ([Anthropic: Extended Thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking))

**Incognito mode.** Ghost-icon toggle; conversations don't save to history or training data; clear visual indicator when active.

**MCP Apps (January 26, 2026).** First official MCP extension enabling interactive UI (charts, forms, dashboards) inside Claude's chat. Agent stays in control; user gets purpose-built UI for specific decisions; context flows bidirectionally. Launch clients included ChatGPT, Claude, Goose, and VS Code. ([MCP Apps announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/))

**Memory Import (March 2026).** Anthropic added the ability to import structured memory from other platforms (including ChatGPT). Memory is surfaced as a named tool within Claude's tool surface; the memory layer is explicitly tool-based — agents can read/write programmatically via MCP, not just through conversational extraction. The first cross-vendor memory portability shipped by a major product.

**Claude Cowork (January 12, 2026).** Desktop agent product targeting non-technical knowledge work. Available on all paid plans through the Claude desktop app; runs on macOS and Windows. Folder-scoped: users designate a folder and Cowork can read/write within it. Built on the Claude Agent SDK (the same architecture as Claude Code). The product framing is explicit about autonomy with oversight gates: *"Claude Cowork is designed with human oversight in mind. It completes tasks, but consequential decisions remain with the user."* ([Claude Cowork](https://www.anthropic.com/product/claude-cowork)) Cowork is the clearest shipping product example of folder-scoped L3-by-default autonomy.

**Dynamic Workflows (May 28, 2026).** See section 9.

**Tooling surface.** Tool switching in composer; model switcher with hierarchy; context chip management for attachments. Computer use generally available; OSWorld benchmark leader.

### 10.2 OpenAI ChatGPT

**Models.** GPT-5.5 (Instant and Thinking) is the current flagship as of May 30, 2026. GPT-5.4 remains available. GPT-5.1 models retired March 11, 2026; GPT-5.2 models retired June 12, 2026; o3 deprecated in 2026. ([OpenAI Model Release Notes](https://help.openai.com/en/articles/9624314-model-release-notes), [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes))

**Canvas — retired May 30, 2026.** Canvas was OpenAI's two-pane writing/coding workspace from October 2024 to May 2026. It was removed in the GPT-5.5 rollout and replaced by inline writing and code blocks inside the main conversation. ([OpenAI removes Canvas, May 2026](https://www.krasa.ai/news/openai-gpt-5-5-instant-writing-coding-blocks-canvas-removed-may-2026); secondary source — primary OpenAI changelog not yet indexed.)

**Position on the Canvas retirement.** This is the single most surprising product decision in the space in 2026. Canvas was the canonical example of a dedicated artifact surface; removing it suggests OpenAI now believes inline artifact rendering wins over a separate pane. Anthropic's Artifacts continues to ship the opposite bet. Both cannot be right; the industry will pick one over the next 18 months.

**"Dreaming" memory system.** ChatGPT's memory was upgraded in 2025–2026 to automatically synthesize a memory profile from past conversations during the model's "downtime" — not just from explicit "remember this" instructions. The system categorizes memories into a structured profile (professional context, communication style, technical level, personal preferences, goals/workflows). ([MindStudio analysis, June 2026](https://www.mindstudio.ai/blog/chatgpt-memory-dreaming-update-how-to-use)) Memory controls as of June 12, 2026 include per-item deletion, text-box edit, highlight-to-correct, and "Delete and turn off memory." **Temporary Chat** is the incognito surface — does not read existing memories, does not create new ones.

**Codex app (background coding agent).** Background agent that works on coding tasks independently; surfaces via the Codex app with per-task development log; rate-limit reset banking; Developer mode for browser inspection (June 11, 2026; off by default).

**Code Interpreter.** Python execution in sandboxed environment; file upload/download; data analysis; visualizations.

**Web browsing.** Inline citations with source chips; "think longer" option.

**Tool switcher.** Composer-level capability picker.

**Response refinement menu.** Contextual menu on AI responses (Try again / Add details / More concise / Search the web / Think longer). GPT-5.4 Thinking introduced mid-response plan adjustment.

### 10.3 Perplexity

**Models.** Sonar 2, GPT-5.4, Claude Sonnet 4.6, Gemini 3.1 Pro, Kimi K2.6, Nemotron 3 Super. Cross-model memory persistence: memories carry across whichever model the user selects in a session. ([Perplexity Pro page](https://www.perplexity.ai/pro))

**Search modes.** Research mode (formerly Pro Search) — multi-step research with broader source set. Standard search for one-shot lookups.

**APIs.** Sonar API family at docs.perplexity.ai. Specific named products like "Search API" and "Search-as-Code (SaC)" surface in community writing but were not verified as distinct products in primary documentation during this research; the Sonar family appears to be the umbrella.

**Citations.** Numbered superscripts inline; on hover, preview of cited content; on click, full source view. The canonical inline-citation implementation in the industry.

**Memory.** Two-part system: structured preferences plus search history. ~95% recall rate after the February 2026 update (achieved by storing fewer, higher-confidence memories). 30-day recovery window after deletion. Cross-model. ([Supermemory analysis](https://supermemory.ai/blog/how-perplexity-memory-works/), secondary; [Perplexity memory launch blog](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory), primary)

**Pricing.** Pro $17/month annual; Max $167/month annual with 10,000 + 35,000 bonus Computer credits, deeper data (PitchBook, Wiley), and the Perplexity Model Council.

**Model Council (Max tier).** Compare responses across multiple AI models simultaneously on the same query. A novel meta-UX pattern for power users evaluating model quality — not documented at this granularity elsewhere as of June 2026.

**Incognito mode.** Search without saving query history.

**Source browser / sidebar.** Search history, Collections, Discover feed.

**Shopping tab.** Product discovery feed with prices, ratings, one-click purchase.

**Focus modes.** Web, Academic, Social, Video, Writing, Math.

### 10.4 Google Gemini

**Models.** Gemini 3.5 (May 2026) and Gemini 3 Pro are the consumer-facing lineup as of mid-2026. The Antigravity platform launched November 2025 (see §10.6) hosts both Gemini and third-party models.

**Gemini Spark (May 19, 2026).** A 24/7 personal AI agent running on Gemini 3.5 and built on the Antigravity platform. Spark "operates autonomously, under your direction" and is designed to "check with you before taking major actions on your behalf." It runs in the background on phone or laptop *even while those devices are off*. Rolling out to trusted testers (May 2026), Beta to Google AI Ultra subscribers (US) shortly after. ([Google I/O 2026: all announcements](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/), [I/O 2026 keynote](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/))

Spark is the field's first consumer-scale **ambient agent** — an L4-default autonomy posture in the hands of millions of users, with the safety case resting on the "checks with you" gate. Its success or failure is one of the most consequential live experiments in the space.

**Visual Layout / Dynamic View.** Model-decided rich, interactive layouts inside Gemini responses (cards, comparison tables, interactive charts). Availability has varied by region and account through 2026. ([Google Research: Generative UI](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-gemini/))

**Memory.** Two surfaces: a "Memory" toggle (learns from past chats) and "Instructions for Gemini" (standing instructions that apply across all chats). Separate from Gemini Apps Activity (the conversation log). Gear icon → Personal context.

### 10.5 Vercel AI SDK and v0

**AI SDK 6 (December 22, 2025).** Current major version. Introduces the `Agent` abstraction (reusable agents with model, instructions, tools — usable across UI, background jobs, API endpoints). Full MCP support (client + server). DevTools for debugging. Reranking, image editing, LangChain adapter rewrite. ([AI SDK 6](https://vercel.com/blog/ai-sdk-6))

**AI SDK 5 (July 31, 2025).** The transitional version: separated `UIMessage` and `ModelMessage` types, deprecated `streamUI` / RSC `render()` (the AI SDK 3.x generative UI approach), introduced Agentic Loop Control. ([AI SDK 5](https://vercel.com/blog/ai-sdk-5))

**Generative UI in mid-2026.** `useChat` with tool parts is the primary surface. `streamUI` / RSC is fully removed. Migration command: `npx @ai-sdk/codemod v6`.

**Structured outputs.** `generateObject` / `streamObject` with Zod schema validation. Progressive rendering as fields stream.

**Tool calling.** Tools defined with typed Zod schemas and execute functions. `maxSteps` controls multi-step loops.

**v0.** Text/image prompts to React + Tailwind + shadcn/ui. Iterative refinement; Next.js integration; built on AI SDK 6. v0 generates static component code for developers — distinct from runtime generative UI (agent picks components per turn).

**Provider-agnostic model routing.** Unified interface across providers.

### 10.6 Google Antigravity

[Google Antigravity](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/) (November 2025) is the agentic development platform Spark and other agents run on. It introduced two named UI patterns we cite elsewhere:

- **Editor View** — a hands-on AI-powered IDE with tab completions and inline commands.
- **Manager Surface** — the dedicated interface where developers spawn, orchestrate, and observe multiple agents working asynchronously across workspaces.

Antigravity's distinctive design choice is **Artifacts as tangible deliverables**: agents emit task lists, implementation plans, screenshots, and browser recordings as the unit of work product. Users can leave feedback directly on Artifacts ("similar to commenting on a doc") and the agent incorporates the feedback without stopping execution. This is a fundamentally different review surface from diff-and-approve.

The platform is cross-platform (macOS, Windows, Linux) and supports multiple models — Gemini 3 Pro, Claude Sonnet 4.5, and OpenAI's GPT-OSS — making it the most explicitly model-agnostic agentic IDE shipped to date.

### 10.7 Cursor, Claude Code, Devin, Cline, Windsurf — IDE-shaped agents

A distinct product category emerged in 2025–2026: agents that live inside an IDE or terminal, with a UI surface that fuses chat, code, tools, and operational monitoring.

**Cursor** ([deployhq.com guide](https://www.deployhq.com/guides/cursor)). VS Code fork, JetBrains plugin, iOS/Android, headless CLI. Tab autocomplete (Sonic model); Composer for multi-file edits with diff view; Background Agent (cloud-hosted, reads GitHub issues, sandboxed); BugBot for PR review; `.cursor/rules/` for project instructions; MCP support. Pricing tiers Free / Pro $20 / Pro+ $60 / Ultra $200.

**Claude Code** ([code.claude.com](https://code.claude.com)). Terminal + VS Code + Desktop. Inline diff per file; `acceptEdits` mode; sub-agents; Skills (reusable instruction sets); Agent Teams (lead supervising peers); Dynamic Workflows (May 2026); `/deep-research` bundled workflow.

**Devin (Cognition AI)** ([cognition.ai/blog](https://cognition.ai/blog/introducing-devin-2-2)). Devin 2.2 is the current version. Fully autonomous coding agent — defaults to L4 autonomy. Completes full development tasks; surfaces milestones for human review. Web-based interface with task progress panel.

**Cline.** Free, open-source VS Code agent. Full trace visibility by default (developer-focused). HITL approval for file writes and shell commands. Model-agnostic.

**Windsurf (Codeium).** Standalone IDE with Cascade agent loop — persistent context across multi-file operations. Available as both full IDE and VS Code extension.

**GitHub Copilot Workspace** ([github.com newsroom](https://github.com/newsroom/press-releases/agent-mode)). Agent Mode (February 2026): agent takes autonomous actions across the codebase. Next Edit Suggestions. CLI enhanced agents (January 2026).

Key patterns across the category:

- **Composer with file context chips** — Cursor's pattern; now near-universal.
- **Inline diff approvals** — agent proposes a change as a diff; user accepts/rejects per hunk.
- **Background mode** — async tasks running off-screen with notification on completion.
- **Plan-as-code visibility** — the user can see and edit the plan the agent is executing.
- **Manager surface** — agents have dedicated operational space, not just a sidebar.

agentic-craft is positioned to support this category specifically. The `contextual-workbench` primitive (§13) is the layout backbone.

## 11. Anti-patterns

> **Field map.** What to refuse, and why. This section is opinionated by design — a pattern catalog without an anti-pattern catalog is half a document.

### 11.1 AI-demo chrome

The visual signature of 2024–2025 AI startups: glowing gradients, sparkle icons, chat-bubble theater, spinners on tool calls, oversized rounded everything, animated gradients on every loading state.

**Why it's wrong.** It signals "we're an AI demo" instead of "we're a product." Users come to associate the visual language with toys.

**What to do instead.** Quiet, precise, instrument-panel design. Monochrome icons. Hairlines instead of shadows. State communicated through one shape per status. ([agentic-craft DESIGN.md](https://github.com/bitcomplete/agentic-craft/blob/main/DESIGN.md))

### 11.2 Fake streaming

Streaming a response token-by-token when the underlying call was synchronous. Pre-computing the full response then animating it character-by-character "for effect." Or animating a "thinking…" state when the model already returned.

**Why it's wrong.** It's theater. It conditions users to wait when they shouldn't have to, and when they discover the cosmetic nature, it destroys trust asymmetrically. ([Setproduct: AI chat interface design](https://www.setproduct.com/blog/ai-chat-interface-ui-design))

### 11.3 Spinners on tool calls

A spinner gives no information. A tool call has *state* (running / done / failed / blocked) and *content* (which tool, what input, what output). Show that.

**[agentic-craft enforcement]** No success/failure icons on tool calls; one status glyph per state; no spinners. Audited via `scripts/audit-ui.mjs`.

### 11.4 Honest-affordance violations

Anything that looks interactive but isn't:

- Cursor-pointer on a non-clickable row
- Expand chevron on an empty disclosure
- Hover treatments on non-links
- "Edit" buttons that open a read-only view

**Why it's wrong.** Destroys the user's predictive model of the interface. Every false affordance trains the user to distrust real ones.

### 11.5 Raw probability numbers

Showing `0.73 confidence` to a non-expert user. They cannot use this number — it is impressive precision that conveys nothing.

**What to do instead.** Semantic categories ("likely"), or ranked ordering, or withhold below a threshold.

### 11.6 Auto-default to high autonomy without an explicit safety gate

Shipping at L4 or L5 by default without the structural gates that make it safe. "Background mode is on" before the user knows what background mode does, with no "checks with you before major actions" contract.

**The nuance.** Gemini Spark ships at ambient/L4-default and is shipping at consumer scale — but with an explicit "checks with you before taking major actions" contract baked into the product framing. Devin 2.2 ships at L4 by design for a narrower power-user audience. The anti-pattern is *not* "any L4-default product is wrong"; it's "L4-default without a structural gate is wrong."

**What to do instead.** If you default high, the gate is non-negotiable. If you can't ship the gate, default to L2.

### 11.7 Invisible memory

The agent "just learns about you" with no surface to see, edit, or delete. Or a memory list buried four settings panels deep.

**What to do instead.** Memory is a ledger, visible in the primary surface, reviewable in a queue. (Section 6.)

### 11.8 Generic errors

"Something went wrong." "An error occurred." "Please try again later."

**What to do instead.** Every failure shows: what failed, why, what the user can do next, and whether the agent can recover automatically.

### 11.9 Fabricated demo data

Round numbers (100, 1000, 50%). Identical timestamps. Placeholder names like "ACME" or "John Doe." Implausible cost values like "$0.00."

**Why it's wrong in a teaching artifact.** It signals the demo doesn't reflect reality, which makes the pattern look like a toy.

**What to do instead.** Plausible telemetry: staggered durations, odd numbers (92,500 not 100,000), believable product names. ([agentic-craft DESIGN.md](https://github.com/bitcomplete/agentic-craft/blob/main/DESIGN.md))

### 11.10 Unbounded agent-authored UI

Letting an agent render arbitrary HTML/JS at runtime with no component allow-list.

**Why it's wrong.** A security boundary and a design-system boundary at once. Both matter. (See §8.5 for the form this takes in agent-authored UI.)

### 11.11 Decorative pattern proliferation

A new component for every variation: 14 button styles, 9 card types, 6 ways to show a status. The system bloats; consistency dies.

**What to do instead.** One shape per state. One affordance per behavior. New components must justify themselves against existing ones.

### 11.12 Agentic sludge

Yocco's term ([Smashing Magazine, February 2026](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)): excessive process visibility, over-confirmation, friction-by-default on every action regardless of risk. The inverse of §11.6: instead of acting too freely, the agent confirms too aggressively. LukeW's Bench study showed this causes outcome-users to abandon the product.

**What to do instead.** Risk-tier the gates (§3.2). Auto-approve low-risk; preview-and-approve medium-risk; explicit confirmation for high-risk; block irreversible by default.

### 11.13 No stop button

Any agent that can take consequential actions must be interruptible at any point. Trust requires the ability to stop. Claude Code has `/stop` and keyboard shortcuts; Cursor has a stop button in Composer. Products without a stop mechanism are not ready for production agentic use.

### 11.14 No undo / reversibility design

Designing agentic actions as one-way without considering recovery paths. Agents make mistakes; if those mistakes are irreversible, users abandon the agent entirely. HAX G10 (prevent catastrophic failure) and Yocco's Outcome Summary / Feedback Mechanism are the explicit guidance here.

### 11.15 Treating agent UX as chatbot UX

Single-turn Q&A patterns applied to multi-turn, multi-step, multi-agent systems. Linear conversation as the only surface. No background activity, no partial results, no operational layer. Most teams in 2026 ship agents as if they were chatbots and the products break under real use. ([dev.to: Agent UX is not chatbot UX](https://dev.to/victor_desg/agent-ux-is-not-chatbot-ux-and-most-teams-in-2026-ship-them-as-if-they-were))

## 12. Open questions

> **Field map.** Where the field has not converged. We document these honestly because a research doc that pretends to have all the answers is the worst kind of research doc.

### 12.1 Inline vs. side-panel artifacts

Claude doubled down on Artifacts (a side panel); OpenAI removed Canvas (the side panel) in favor of inline rendering. One bet is wrong, or context determines which wins. We don't know which.

### 12.2 How much chain-of-thought to show

Full reasoning traces (Cline default) vs. summarized thinking (Claude Extended Thinking) vs. hidden (standard GPT-5.x) vs. skip-option (Cloudscape Thinking pattern). Cloudscape's "collapsed in chat, expanded in editors" is the most principled rule the field has, but consensus across products is still absent.

### 12.3 Cross-session resume across days/devices

Dynamic Workflows checkpoints in-session; cross-day-cross-device resume is ambiguous. Most production agentic systems need it. What's the right UX surface for "you started a long-running workflow yesterday on your laptop; here's where it is today on your phone"?

### 12.4 Multi-agent debugging

When 16 subagents are running and one of them is wrong, what's the UI for figuring out which one and why? Existing trace tools (Datadog-style) are designed for service architectures, not agent fleets. No product has shipped first-class root-cause attribution for agent fleets.

### 12.5 Cost transparency in shared workspaces

Personal use: clear. Team use: who paid for the agent's work? What's the UI for "the workspace just consumed $400 in agent runs this week"? Third-party tools (AgentMeter, TokenPilot) address this, but no major product has shipped a first-party shared-workspace cost surface.

### 12.6 Agent identity at scale

When agents start collaborating with other agents (A2A protocols, MCP), how does the user surface convey *which agent did what*? Naming, avatars, and provenance are not yet enough.

### 12.7 Trust transfer across products

If I trust Claude with my calendar, does that trust transfer to a third-party agent that calls Claude as a sub-tool? What's the UI for explaining the trust graph?

### 12.8 Workflow versioning

Saved workflows in files (Dynamic Workflows pattern) is a starting point. What's the UI for "this workflow's behavior changed last Tuesday — here's the diff"?

### 12.9 The right default autonomy level for ambient agents

Gemini Spark defaults to ambient/L4 autonomy at consumer scale. Devin 2.2 defaults to L4 for development tasks. Cursor's Background Agent runs at L3–L4 by default. Our §4 position is L2-by-default, earn-L3 — but the products are shipping L4-default with explicit gates and they have not failed.

The argument is genuinely unsettled. Either (a) our position is too conservative and the field is right that L4-with-explicit-gates is the new floor, or (b) the gates aren't enough and we'll see the first major agent-driven incident from a high-default product within 18 months. Watching Spark is the cleanest live experiment.

### 12.10 Memory granularity

No major product has shipped per-topic memory controls ("remember coding preferences, not health information"). Current controls are binary (all on / all off) or aggregate (delete all memories). Users who want selective memory have no supported path. The sharpest live memory gap.

### 12.11 Ambient agent notifications

Background and ambient agents (Spark, Cursor Background, Codex) all need notification surfaces. Android Halo (a persistent pill-shaped overlay tracking agent state) is the most considered design shipped. Desktop and web have no canonical equivalent. Cross-platform standards don't exist.

### 12.12 When to refuse

What's the UX for "the agent could do this, but the operation is suspicious enough that it shouldn't"? Existing patterns are crude (block dialogs); the future is more nuanced.

## 13. Registry mapping

> **The bridge.** Every agentic-craft registry item is justified by one or more sections of this document. This table is the contract between research and product.

### 13.1 Primitives (registry:ui)

| Item | Sections | What it implements |
|------|----------|---------------------|
| **composer** | §3.1, §7.4 | The chat input with islands, attachments, suggestions, and context-usage visualization — the entry point for visible work. |
| **tool-call** | §3.1 | The universal tool-call row with running/completed/failed states. Visible work, base unit. |
| **tool-tree** | §3.1, §7.3 | Parallel tool call visualization with L-connectors. Visible work for multi-step or parallel execution. |
| **observable-work** | §3.1, §11.4 | Step disclosure for showing agent work, sources, state, completion — without exposing hidden reasoning. The summarized-thinking position made concrete (collapsed by default, expandable on demand, per Cloudscape). |
| **status-indicator** | §3.1, §7.3, §11.3 | The product-wide status vocabulary: one shape per state. Refuses the spinner. Most-reused primitive. |
| **reference-item** | §5.1, §6.1 | The composable row for sources, memories, findings — the provenance row. |
| **source-preview** | §5.1, §5.3 | Citation preview with title, excerpt, location. Provenance for claims. |
| **artifact-document** | §5.1, §10.5 | Source-backed output document with cited sections and missing-source states. Provenance for outputs. |
| **decision-surface** | §3.2, §4.1 | The composable approval/clarification/rollback surface. The locked-preview pattern made composable. |
| **action-preview** | §3.2 | The locked consequence preview itself. Center of §3.2. The Claude Cowork oversight contract made concrete. |
| **clarifying-questions** | §3.2, §4.2 | Structured question group — text, single-choice, multi-choice. Replaces freeform "what did you mean?" |
| **file-lifecycle** | §3.1, §10.1, §11.8 | Drag/upload/validate/retry states. Visible work for the file path. Cowork-shaped: file as primary unit. |
| **agent-status-table** | §7.2, §7.3 | Rich operational table — status, active task, progress, confidence, cost, last activity. The operational dashboard primitive. Manager-surface-shaped. |
| **usage-meter** | §4.2, §7.4, §12.5 | Token/cost/limit/coverage meter. Cost as design dimension. |
| **contextual-workbench** | §10.7, §8.4 | The responsive surface that keeps chat visible while opening browser/source/diff/artifact beside it. The IDE-shaped-agent layout primitive. |
| **effective-policy-preview** | §4.2 | Compact summary of what the autonomy + approval + notification + memory settings actually produce. The single piece of agent UI most often missing in shipping products. |
| **memory-ledger-item** | §6.1, §6.5 | Provenance-rich memory row with scope, expiry, last-used. Memory as ledger, made concrete. |
| **run-trace** | §7.3, §12.4 | Dense per-run trace with source touches, status, warnings, timing, expandable recovery. Datadog-style for agent runs. |
| **handoff-packet** | §10.7, §12.6 | Ownership-transfer surface for multi-agent flows. Agent-to-agent handoff with explicit payload and recovery path. |
| **workflow-phases** | §9.3, §9.5 | The phase rail — sequential phases with rollup metrics. Direct from Dynamic Workflows. |

### 13.2 Blocks (registry:block)

| Block | Sections | Composes |
|-------|----------|----------|
| **review-workflow** | §3.1, §3.2, §5 | observable-work + clarifying-questions + action-preview + decision-surface + reference-item |
| **approval-workflow** | §3.2, §4.1 | observable-work + action-preview + decision-surface |
| **clarifying-workflow** | §3.2, §4.2 | observable-work + clarifying-questions |
| **source-backed-artifact** | §5.1, §5.3 | artifact-document + source-preview + usage-meter |
| **memory-review** | §6.4, §6.5 | memory-ledger-item + source-preview + decision-surface |
| **run-monitor** | §7.3, §7.4 | run-trace + agent-status-table + usage-meter |
| **multi-agent-handoff** | §10.7, §12.6 | handoff-packet + agent-status-table + run-trace |
| **agent-settings** | §4.2, §4.3 | effective-policy-preview |
| **workflow-run-monitor** | §9.3, §9.5 | workflow-phases + agent-status-table + usage-meter |

### 13.3 Coverage check

| Section | Registry coverage | Gap |
|---------|------------------|-----|
| §3 Visible work + locked previews | Strong — 6 primitives | None |
| §4 Autonomy as contract | Medium — effective-policy-preview, agent-settings | No per-action-type matrix UI yet |
| §5 Provenance | Strong — source-preview, artifact-document, source-backed-artifact | None |
| §6 Memory as ledger | Strong — memory-ledger-item, memory-review | No incognito-mode primitive; no per-topic memory control surface (the §12.10 gap) |
| §7 Operational surfaces | Medium — agent-status-table, run-trace, run-monitor | No inbox primitive; no calendar primitive; no dedicated Manager Surface scaffold |
| §8 Agent-authored UI | Weak — primitives exist but no renderer integration | The renderer is a 2027 problem (deliberate) |
| §9 Dynamic Workflows | Strong — workflow-phases, workflow-run-monitor | No plan-as-code editor UI |
| §11 Anti-patterns | Partial — `scripts/audit-ui.mjs` enforces §11.1, §11.3, §11.4, §11.9; remaining items are design-review concerns | None |

### 13.4 Roadmap implications

The coverage check above is the closest thing this document has to a roadmap. The five explicit gaps:

1. **Per-action-type autonomy matrix UI** — a real surface for the multi-axis autonomy contract from §4.2.
2. **Inbox primitive** — the most common operational layout (§7.1) is not yet in the registry.
3. **Incognito-mode primitive** — memory's negative space (§6.5) deserves its own component.
4. **Plan-as-code editor surface** — Dynamic Workflows exposes the raw script; agentic-craft does not yet have an editor primitive for it (§9.3).
5. **Per-topic memory control surface** — the field's sharpest live gap (§12.10) is also ours.

Whether to ship these is a product decision; the research justifies all five.

## 14. Ten principles, defended

> **Principles.** What every section of this document agrees on. These are the design rules `agentic-craft` evaluates itself against.

1. **Progressive disclosure beats both extremes.** Hiding all agent work breaks trust; showing it all causes abandonment. Tool calls collapsed by default; expandable on demand; full trace accessible. (Cloudscape Thinking; LukeW Feb 2026; §3.)

2. **Control is a trust signal.** Pause, override, kill switch, feedback — these aren't just safety features. They're how trust is built. An agent that can be stopped is more trustworthy than one that can't be. (HAX G9, G17; §4, §11.13.)

3. **Risk-tier the gates.** Not all actions need approval. Auto-approve low-risk; preview-and-approve medium-risk; explicit confirmation for high-risk; block-or-notify for irreversible. Uniform confirmation produces agentic sludge. (Yocco; §3.2, §11.12.)

4. **Locked previews before any consequential action.** Not a confirm dialog. A structured preview of exactly what will happen, in the format of the target system. The preview *is* the contract. The Cowork framing — "consequential decisions remain with the user" — is the product-level expression of this. (§3.2.)

5. **Provenance is universal.** Every claim, every output, every action — traceable to its inputs. An agent that says less but cites everything beats one that says more without sources. (§5.)

6. **Memory is a ledger.** Visible, reviewable, editable, deletable per entry. Invisible persistence destroys trust faster than anything. Per-topic granularity is the next frontier. (§6.)

7. **The blank-canvas problem is always present.** Suggestions, templates, examples, prompt starters — every empty state in an agentic interface needs wayfinder patterns. (Shape of AI; §2.1, §7.)

8. **Errors are diagnostic opportunities.** Never a generic error. Every failure shows: what failed, why, what to do next, whether recovery is automatic. (HAX G10; §11.8.)

9. **Cost should never be invisible.** Tokens, time, money — visible at the surface of every long-running action. Cost transparency is part of trust. (Shape of AI "Cost Estimates"; §4.2, §7.4, §12.5.)

10. **Design the relationship, not the screen.** The fundamental unit of agentic experience is the ongoing relationship between user and agent. Design for trust accumulation over time, not task completion in the moment. (NN/g service design; §1.)

---

## Appendix A: Variant taxonomies (cross-reference)

For completeness, the autonomy taxonomies we considered but did not adopt as canonical:

- **The 6-mode spectrum** ([Emergent Mind: six-mode spectrum](https://www.emergentmind.com/topics/six-mode-spectrum-of-human-agent-collaboration)) — Human-Augmented, Human-in-Command, Human-Delegated, Human-in-the-Loop, Human-on-the-Loop, Human-Out-of-the-Loop. Useful for academic discussion; over-specified for product use.
- **CSA Agentic Trust Framework (6 levels, L0–L5)** ([via Zylos](https://zylos.ai/research/2026-03-28-ai-agent-autonomy-levels-taxonomy-trust-calibration/), January 2026) — Organized around "who controls action execution." The extra L0 (no agent) is the principal difference from our 5-level model.
- **DeepMind's Levels of AGI (5×5)** ([arXiv:2311.02462](https://arxiv.org/abs/2311.02462), 2023) — Capability and autonomy as orthogonal axes. The most important architectural insight in the literature: a highly capable model can be low-autonomy; a low-capability model can be high-autonomy.
- **Apple's role-dimension framing** — Criticality, Data scope, Initiative, Visibility, Changeability. Not a competing autonomy model; an orthogonal categorization useful before choosing patterns.
- **Anthropic's "disposition dial"** — fully corrigible ↔ fully autonomous. Model-level disposition that the product autonomy contract sits on top of. (§4.4.)

---

## Appendix B: Sources

**Primary sources:**

- [Anthropic: Claude Cowork product page](https://www.anthropic.com/product/claude-cowork)
- [Anthropic: Introducing Dynamic Workflows in Claude Code](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
- [Claude Code: Workflows documentation](https://code.claude.com/docs/en/workflows)
- [Claude Code: model-config (effort levels)](https://platform.claude.com/docs/en/build-with-claude/effort)
- [Anthropic: Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Anthropic: Claude Sonnet 4.6 announcement](https://www.anthropic.com/news/claude-sonnet-4-6)
- [MCP Apps announcement (January 26, 2026)](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [Vercel AI SDK 6 announcement](https://vercel.com/blog/ai-sdk-6)
- [Vercel AI SDK 5 announcement](https://vercel.com/blog/ai-sdk-5)
- [Google I/O 2026 — all announcements (Gemini Spark)](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/)
- [Google I/O 2026 keynote — Pichai post](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/)
- [Google Antigravity announcement (November 2025)](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
- [Google Research: Generative UI for Gemini](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-gemini/)
- [Google Developer Blog: introducing A2UI](https://developers.googleblog.com/en/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)
- [AG-UI documentation](https://docs.ag-ui.com)
- [AWS Cloudscape: Thinking pattern](https://cloudscape.design/gen-ai/patterns/thinking/)
- [OpenAI: Model release notes](https://help.openai.com/en/articles/9624314-model-release-notes)
- [OpenAI: ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [Perplexity Pro page](https://www.perplexity.ai/pro)
- [Perplexity: introducing AI assistants with memory](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory)
- [Microsoft Research: Guidelines for Human-AI Interaction (CHI 2019)](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf)
- [Apple: HIG for Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning)
- [Google PAIR Guidebook](https://pair.withgoogle.com/guidebook)
- [Microsoft: Conductor — deterministic orchestration](https://opensource.microsoft.com/blog/2026/05/14/conductor-deterministic-orchestration-for)
- [LukeW: Agent Management Interface Patterns (June 2025)](https://www.lukew.com/ff/entry.asp?2106)
- [LukeW: Showing the Work of Agents in UI (February 2026)](https://www.lukew.com/ff/entry.asp?2142)
- [NN/g: Generative UI](https://www.nngroup.com/articles/generative-ui/)
- [NN/g: Service design with AI agents](https://www.nngroup.com/articles/service-design-evolve-ai-agents/)
- [NN/g: State of UX 2026](https://www.nngroup.com/articles/state-of-ux-2026/)
- [Smashing Magazine: Designing for Agentic AI (Victor Yocco)](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)
- [Setproduct: AI chat interface UI design](https://www.setproduct.com/blog/ai-chat-interface-ui-design)
- [BBC: What is Anthropic's Claude Mythos](https://www.bbc.com/news/articles/crk1py1jgzko)

**Secondary sources (cross-checked or used where primary not available):**

- [Shape of AI pattern library](https://www.shapeof.ai)
- [AgenticUI design system](https://agenticui.net)
- [Emergent Mind: Six-mode spectrum of human-agent collaboration](https://www.emergentmind.com/topics/six-mode-spectrum-of-human-agent-collaboration)
- [Zylos: AI agent autonomy levels taxonomy](https://zylos.ai/research/2026-03-28-ai-agent-autonomy-levels-taxonomy-trust-calibration/)
- [Supermemory: How Perplexity memory works](https://supermemory.ai/blog/how-perplexity-memory-works/)
- [MindStudio: ChatGPT memory "Dreaming" update](https://www.mindstudio.ai/blog/chatgpt-memory-dreaming-update-how-to-use)
- [XTrace: Gemini memory management](https://xtrace.ai/blog/how-to-manage-gemini-memory)
- [DeployHQ: Cursor guide](https://www.deployhq.com/guides/cursor)
- [DevelopersDigest: ultracode effort level explained](https://www.developersdigest.tech/blog/ultracode-effort-level-explained)
- [Krasa AI: OpenAI removes Canvas (May 2026)](https://www.krasa.ai/news/openai-gpt-5-5-instant-writing-coding-blocks-canvas-removed-may-2026)
- [InfoQ: Anthropic announces Claude Cowork](https://www.infoq.com/news/2026/01/claude-cowork/)
- [Konishi: Claude model release timeline](https://hidekazu-konishi.com/entry/anthropic_claude_model_release_timeline.html)
- [dev.to: Agent UX is not chatbot UX](https://dev.to/victor_desg/agent-ux-is-not-chatbot-ux-and-most-teams-in-2026-ship-them-as-if-they-were)