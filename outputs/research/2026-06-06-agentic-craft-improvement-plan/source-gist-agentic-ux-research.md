# Agentic UX Design Patterns — Comprehensive Reference Guide

> Research compiled March 2026. Sources: AgenticUI, Shape of AI, Google PAIR, Microsoft HAX, Apple HIG, Nielsen Norman Group, Vercel AI SDK, Anthropic Claude, OpenAI ChatGPT, Perplexity, LukeW, Benjamin Prigent, and domain literature.

---

## Introduction

This document is a synthesis of current research, product patterns, and interface conventions for designing agentic user experiences. Its goal is to help product designers, founders, and builders understand how AI agents change interface design, what patterns are emerging across leading products and frameworks, and which interaction models are most useful when designing systems that can reason, act, and collaborate with people over time.

The research is intended to be practical rather than academic. Instead of only cataloging ideas, it organizes them into reusable interface patterns, control models, and design principles that can inform product strategy, UX decisions, prototypes, and implementation. The focus is on patterns that improve clarity, trust, oversight, transparency, and usability as products move from traditional software interactions toward more autonomous, agent-driven experiences.

Use this guide as a reference for:
- understanding the shift from traditional UX to agentic experience
- identifying common patterns across major AI products and design systems
- evaluating which interaction patterns fit a given product or workflow
- designing more trustworthy, legible, and controllable agent interfaces

---

## Table of Contents

1. [The UX → AX Paradigm Shift](#1-the-ux--ax-paradigm-shift)
2. [Primary Framework Taxonomies](#2-primary-framework-taxonomies)
   - 2.1 Shape of AI — 6-Category Pattern Library
   - 2.2 Microsoft HAX Toolkit — 18 Guidelines
   - 2.3 Google PAIR Guidebook — 6 Chapters
   - 2.4 Apple HIG for Machine Learning
   - 2.5 AgenticUI — AXD Design System
3. [Agent Orchestration Patterns](#3-agent-orchestration-patterns)
4. [Interface Layout Patterns for Multi-Agent Views](#4-interface-layout-patterns-for-multi-agent-views)
5. [Conversational & Chat Interface Patterns](#5-conversational--chat-interface-patterns)
6. [Rich Action Preview & Approval Patterns](#6-rich-action-preview--approval-patterns)
7. [Autonomy Spectrum & Control Patterns](#7-autonomy-spectrum--control-patterns)
8. [Trust, Transparency & Explainability Patterns](#8-trust-transparency--explainability-patterns)
9. [Knowledge Base & RAG UI Patterns](#9-knowledge-base--rag-ui-patterns)
10. [Agent Monitoring & Observability Patterns](#10-agent-monitoring--observability-patterns)
11. [Memory & Context Persistence Patterns](#11-memory--context-persistence-patterns)
12. [Handoff & Escalation Patterns](#12-handoff--escalation-patterns)
13. [Error Recovery Patterns](#13-error-recovery-patterns)
14. [Evaluation & Feedback Patterns](#14-evaluation--feedback-patterns)
15. [Guardrails & Governance UI Patterns](#15-guardrails--governance-ui-patterns)
16. [Multi-Modal Output Patterns](#16-multi-modal-output-patterns)
17. [Cost & Usage Transparency Patterns](#17-cost--usage-transparency-patterns)
18. [Product-Specific Pattern Inventories](#18-product-specific-pattern-inventories)
    - 18.1 Anthropic Claude
    - 18.2 OpenAI ChatGPT
    - 18.3 Perplexity
    - 18.4 Vercel AI SDK / v0
19. [Design Principles Synthesis](#21-design-principles-synthesis)

---

## 1. The UX → AX Paradigm Shift

The shift from traditional UX to Agentic Experience (AX) is not cosmetic. It represents a fundamental restructuring of the designer-user-system triangle. The following table maps the key contrasts:

| Dimension | Traditional UX | Agentic Experience (AX) |
|-----------|----------------|-------------------------|
| **Orientation** | Screen-centric | Relationship-centric |
| **Task type** | Single-shot, discrete | Ongoing goals, iterative loops |
| **Path planning** | Designer pre-plans every flow | System plans its own execution path |
| **Context** | User supplies all context each time | Context is learned, not re-asked |
| **Success metric** | Fewer clicks, faster task completion | Earned trust & compounding value over time |
| **Trust contract** | Static (same behavior every session) | Dynamic (trust must be re-established as autonomy grows) |
| **Failure mode** | User confusion, wrong path | Agent doing the wrong thing confidently |
| **Design artifact** | Screen flows, component libraries | Constraint sets, guardrails, reasoning patterns |
| **Designer's role** | Drawing boxes and flows | Defining rules of the system |
| **Feedback loop** | Immediate, synchronous | Async, multi-turn, cross-session |

**Key insight from NNG (2024):** Generative UI will shift design from "designing for the average" to "designing for the individual." Designers will define *constraints* (must show / should show / never show) rather than individual UI elements. This is *outcome-oriented design*. ([NNG Generative UI](https://www.nngroup.com/articles/generative-ui/))

**Key insight from NNG (2025):** AI agents are no longer tools — they are actors. Service design must now account for two kinds of AI agents: *personal assistants acting for users*, and *organizational agents acting for businesses*. AI-to-AI compatibility will become a competitive metric. ([NNG Service Design with AI Agents](https://www.nngroup.com/articles/service-design-evolve-ai-agents/))

---

## 2. Primary Framework Taxonomies

### 2.1 Shape of AI — 6-Category Pattern Library

Emily Campbell's taxonomy at [shapeof.ai](https://www.shapeof.ai) covers 6 categories and ~45 distinct patterns. This is the most complete AI UX taxonomy for chat/generative interfaces.

#### Wayfinders (Onboarding & Discovery)
Patterns that help users understand what the AI can do and how to engage with it.

| Pattern | Description |
|---------|-------------|
| **Example Gallery** | Share sample generations, prompts, and parameters to educate and inspire. |
| **Follow Up** | Get more information from the user when the initial prompt isn't clear. |
| **Initial CTA** | Large, open-ended input inviting the user to start their first interaction. |
| **Nudges** | Alert users to actions they can take, especially new users. |
| **Prompt Details** | Show users what is actually happening behind the scenes. |
| **Randomize** | Kickstart the prompting experience with low-bar, fun results. |
| **Suggestions** | Solve the blank canvas dilemma with clues for how to prompt. |
| **Templates** | Structured templates that can be filled by the user or pre-filled by AI. |

#### Prompt Actions (How Users Interact with AI)
Patterns governing how users submit, refine, and chain prompts.

| Pattern | Description |
|---------|-------------|
| **Auto-fill** | Extend a prompt to multiple fields or inputs at once. |
| **Chained Action** | A sequence of AI actions where outputs feed the next input. |
| **Describe** | Decompose content into fundamental tokens and suggest prompts. |
| **Expand** | Lengthen the underlying content or add depth and detail. |
| **Inline Action** | Ask or interact with AI contextually based on content already on the page. |
| **Inpainting** | Target specific areas of an AI result to regenerate or remix. |
| **Madlibs** | Repeatedly run generative tasks without compromising format or accuracy. |
| **Open Input** | Open-ended prompt inputs for conversations and natural language prompting. |
| **Regenerate** | Have the AI reproduce its response without additional input. |
| **Restructure** | Use existing content as the starting point for prompting. |
| **Restyle** | Transfer styles without changing the underlying structure of a generation. |
| **Summary** | Have AI distill a topic down to its essence. |
| **Synthesis** | Distill or reorganize complicated information into simple structure. |
| **Transform** | Use AI to change the modality of content (text → chart, etc.). |

#### Tuners (Context & Configuration Inputs)
Patterns for giving the AI richer context to work with.

| Pattern | Description |
|---------|-------------|
| **Attachments** | Give the AI a specific reference to anchor its response. |
| **Connectors** | Allow AI to reference external data and context. |
| **Filters** | Constrain the inputs or outputs of the AI by source, type, modality. |
| **Model Management** | Let users specify what model to use for their prompts. |
| **Modes** | Adjust the underlying training, constraints, and persona to a specific context. |
| **Parameters** | Include constraints with a prompt for the AI to reference when generating. |
| **Preset Styles** | Provide default options to change the texture, aesthetic, or tone of generative media. |
| **Prompt Enhancer** | Automatically improve user prompts before submission. |
| **Saved Styles** | Allow users to define and save their own style presets for reuse. |
| **Voice and Tone** | Ensure outputs match the user's voice, tone, and preferences consistently. |

#### Governors (Oversight & Control)
Patterns that give users transparency and control over AI behavior.

| Pattern | Description |
|---------|-------------|
| **Action Plan** | Show the steps the AI will take before it executes. |
| **Branches** | Support iterative prompting while retaining visibility back to the original. |
| **Citations** | Inline annotations citing sources used in generation. |
| **Controls** | Manage the flow of information or pause a request mid-stream. |
| **Cost Estimates** | Transparent cost estimates for AI actions before execution. |
| **Draft Mode** | Exploration and iterative prompting while reducing compute costs. |
| **Memory** | Control what details the AI knows about you. |
| **References** | See and manage what additional sources the AI is referencing. |
| **Sample Response** | Confirm the user's intent for complicated prompts. |
| **Shared Vision** | Live visibility into the AI's action in a shared canvas or workspace. |
| **Stream of Thought** | Reveals the AI's logic, tool use, and decisions for oversight and auditability. |
| **Variations** | Trace through multiple variations of a result to choose the best one. |
| **Verification** | Allow users to confirm AI decisions and actions before proceeding. |

#### Trust Builders (Transparency & Safety)
Patterns that establish and maintain user trust in AI systems.

| Pattern | Description |
|---------|-------------|
| **Caveat** | Inform users about shortcomings or risks in the model or technology. |
| **Consent** | Only capture data from others with their knowledge and permission. |
| **Data Ownership** | Control how the model remembers and uses your data. |
| **Disclosure** | Clearly mark content and interactions guided or delivered by AI. |
| **Footprints** | Let users trace the AI's steps from prompt to result. |
| **Incognito Mode** | Interact with the AI outside of its memory. |
| **Watermark** | Identifiers on AI-generated content that humans or software can read. |

#### Identifiers (AI Brand & Visual Language)
Patterns for making the AI recognizable and on-brand.

| Pattern | Description |
|---------|-------------|
| **Avatar** | Visual identifier of the AI to help it be recognizable and on-brand. |
| **Color** | Visual cues to help users identify AI features or content. |
| **Iconography** | Images that represent AI-powered actions throughout the interface. |
| **Name** | How the AI is referred to through the product experience. |
| **Personality** | Characteristics that distinguish the AI's personality and vibe. |

---

### 2.2 Microsoft HAX Toolkit — 18 Guidelines

Published at CHI 2019. Evidence-based guidelines synthesizing 20+ years of human-AI interaction research. Validated through a user study with 49 design practitioners across 20 AI-infused products. ([Microsoft Research CHI 2019 paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf))

#### Initially (Setting Expectations)
| # | Guideline | Description |
|---|-----------|-------------|
| G1 | **Make clear what the system can do** | Help users understand what the AI system is capable of doing. |
| G2 | **Make clear how well the system can do what it can do** | Help users understand how often the AI may make mistakes. |

#### During Interaction (Context Sensitivity)
| # | Guideline | Description |
|---|-----------|-------------|
| G3 | **Time services based on context** | Time when to act or interrupt based on the user's current task and environment. |
| G4 | **Show contextually relevant information** | Display information relevant to the user's current task and environment. |
| G5 | **Match relevant social norms** | Deliver the experience in a way users would expect given their social and cultural context. |
| G6 | **Mitigate social biases** | Ensure the AI system's language and behaviors don't reinforce undesirable stereotypes. |
| G7 | **Support efficient invocation** | Make it easy to invoke or request AI system services when needed. |
| G8 | **Support efficient dismissal** | Make it easy to dismiss or ignore undesired AI system services. |

#### When Wrong (Error Handling)
| # | Guideline | Description |
|---|-----------|-------------|
| G9 | **Support efficient correction** | Make it easy to edit, refine, or recover when the AI is wrong. |
| G10 | **Scope services when in doubt** | Engage in disambiguation or gracefully degrade when uncertain about a user's goals. |
| G11 | **Make clear why the system did what it did** | Enable the user to access an explanation of why the AI behaved as it did. |

#### Over Time (Long-Horizon Behavior)
| # | Guideline | Description |
|---|-----------|-------------|
| G12 | **Remember recent interactions** | Maintain short-term memory and allow efficient references to that memory. |
| G13 | **Learn from user behavior** | Personalize the user's experience by learning from their actions over time. |
| G14 | **Update and adapt cautiously** | Limit disruptive changes when updating and adapting the AI system's behaviors. |
| G15 | **Encourage granular feedback** | Enable users to provide feedback indicating their preferences during regular interaction. |
| G16 | **Convey the consequences of user actions** | Immediately update or convey how user actions will impact future AI behaviors. |
| G17 | **Provide global controls** | Allow users to globally customize what the AI monitors and how it behaves. |
| G18 | **Notify users about changes** | Inform users when the AI system's behavior changes due to learning or updates. |

---

### 2.3 Google PAIR Guidebook — 6 Chapters

Published at [pair.withgoogle.com/guidebook](https://pair.withgoogle.com/guidebook). A product design framework organized around the full AI product development lifecycle.

| Chapter | Topic |
|---------|-------|
| 1 | Identify user needs, find AI opportunities, and design your reward function. |
| 2 | Decide what data are required to meet user needs, source data, and tune your AI. |
| 3 | Introduce users to the AI system and set expectations for system change over time. |
| 4 | Explain the AI system and determine if, when, and how to show model confidence. |
| 5 | Design feedback and control mechanisms to improve your AI and the user experience. |
| 6 | Identify and diagnose AI and context errors and communicate the way forward. |

**Key design principle from PAIR:** AI systems should be transparent about their capabilities, limitations, and confidence levels. Show confidence in a way users can understand — not as a raw number, but as semantic categories ("high chance," "likely") or through ranked ordering of results.

---

### 2.4 Apple HIG for Machine Learning

Apple's [Human Interface Guidelines for Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning) defines five role dimensions for ML features and a detailed pattern library.

#### Role Dimensions
| Dimension | Poles |
|-----------|-------|
| Criticality | Critical ↔ Complementary |
| Data scope | Private ↔ Public |
| Initiative | Proactive ↔ Reactive |
| Visibility | Visible ↔ Invisible |
| Changeability | Dynamic ↔ Static |

#### Input Patterns
- **Explicit Feedback** — User directly signals preferences (like/dislike, ratings). Use sparingly; make it voluntary; act immediately and persist changes.
- **Implicit Feedback** — Infer preferences from usage. Prioritize recent feedback; never sacrifice user privacy; beware confirmation bias.
- **Calibration** — Initial setup to tailor the feature. Use only if the feature can't function without it; show explicit goal/progress; allow cancel anytime.

#### Output Patterns
- **Corrections** — Give familiar, easy ways to correct. Prefer guided over freeform correction.
- **Mistakes** — Anticipate and help users handle; never rely on corrections for low-quality results.
- **Multiple Options** — Prefer diverse options; list most likely first; learn from selections.
- **Confidence** — Translate confidence to people-understandable concepts (not raw numbers). Rank/order results; use semantic categories; withhold low-confidence proactive results.
- **Attribution** — Use to encourage change, minimize mistakes, build mental model and trust.
- **Limitations** — Set expectations upfront; explain unsatisfactory results; notify when limitations are resolved.

---

### 2.5 AgenticUI — AXD Design System

Alex Gilev's [AgenticUI](https://agenticui.net) is described as "the world's first enterprise-grade design system for building scalable agentic experiences." ([AgenticUI preorder page](https://agenticui.net/preorder))

**Status:** v1 launched Q1 2026 (Figma DS). v1.1 (Q2 2026) adds AI integration and voice-driven variable editing. v2 (Q4 2026) adds React components.

**What's included:**
- 30+ versatile UI components for enterprise-grade agentic experiences
- Opinionated constraints (rules) for building better interfaces with agents
- Agentic Templates for three core workflows: **Orchestrate**, **Create**, **Monitor**
- Core design philosophy: *Clarity scales. Chaos doesn't.*

**Core differentiation from generic UI kits:**
- Patterns for agent reasoning
- Explainability patterns
- Operational control patterns
- Agent-specific interaction models

**Three template categories:**
1. **Orchestrate** — Managing existing agents, monitoring multi-agent state
2. **Create** — Configuring and launching new agents
3. **Monitor** — Live dashboards showing agent activity, logs, errors, performance

---

## 3. Agent Orchestration Patterns

These patterns govern how users configure, create, and manage agents.

### 3.1 Agent Configuration Wizard (Multi-Step Setup)

The primary pattern for creating a new agent. A multi-step wizard (stepper) that walks users through:

**Typical steps in order:**
1. **Agent Identity** — Name, description, persona/role definition
2. **Knowledge Sources** — Upload documents, connect data sources, set RAG scope
3. **Integrations** — Link to external services (CRM, calendar, ticketing, etc.)
4. **Autonomy Rules** — Set autonomy level, confidence thresholds, human-in-the-loop triggers
5. **Automation Rules** — Keyword matching, intent classification, scheduling
6. **Preview & Test** — Live preview of agent behavior before deployment

**Key UI components:**
- **Progress bar** showing % complete (e.g., "40% complete — step 3 of 6")
- **Step indicator** (numbered stepper or breadcrumb trail)
- **Back/Next navigation** with validation at each step
- **Live agent preview panel** — runs a test interaction alongside the configuration form
- **Save draft** ability at each step

**Design principles:**
- Never require all configuration upfront; allow defaults and progressive configuration
- Show the consequence of each setting inline ("At this threshold, the agent will ask for approval ~3 times/day")
- Provide pre-built templates to reduce blank-canvas anxiety

### 3.2 Autonomy Level Controls

A UI for adjusting how much freedom an agent has to act without human oversight. From the six-mode spectrum ([Emergent Mind](https://www.emergentmind.com/topics/six-mode-spectrum-of-human-agent-collaboration)):

| Level | Name | Description | UI Pattern |
|-------|------|-------------|------------|
| 1 | **Human-Augmented (HAM)** | Human does everything; AI suggests only | Ask AI pane, draft-only modules |
| 2 | **Human-in-Command (HIC)** | AI drafts; human must approve every output | Approval modal before every action |
| 3 | **Human-Delegated (HD)** | AI acts on routine; human reviews exceptions | Inbox of flagged items |
| 4 | **Human-in-the-Loop (HITL)** | AI acts autonomously; escalates when confidence < threshold | Confidence threshold slider |
| 5 | **Human-on-the-Loop (HOTL)** | AI acts fully; human can override at any point | Live monitoring dashboard + kill switch |
| 6 | **Human-Out-of-the-Loop (HOOTL)** | Full autonomy; no human in process | Activity log only; alerting on anomalies |

**UI implementation of autonomy controls:**
- **Segmented control or radio group** with human-readable labels: "Review each decision" / "Auto-route if confident" / "Fully autonomous"
- **Confidence threshold slider** — "Ask for approval when confidence is below [70%]"
- **Inline consequence preview** — "At this setting, you'll receive ~5 approval requests per day"
- **Per-action overrides** — Some action types (e.g., "send email to customer") can have higher approval thresholds than others ("archive ticket")

### 3.3 Rule Builder

For configuring when and how agents trigger or act, inspired by tools like IFTTT, Zapier, and n8n.

**Three patterns for trigger configuration** (from [Benjamin Prigent's research](https://www.bprigent.com/article/7-ux-patterns-for-human-oversight-in-ambient-ai-agents)):

1. **Natural Language** — Free-text trigger description ("Trigger when a customer mentions they want to cancel")
2. **Linear Flow (IFTTT-style)** — Sequential block UI where each node leads to the next
3. **2D Map (n8n-style)** — Visual node graph showing branches and dependencies

**Trigger anatomy — 3 components:**
- **Key** — The signal to listen to (text, number, boolean, event type)
- **Operator** — `<`, `>`, `=`, `!=`, `contains`, `matches intent`
- **Value** — The threshold at which the trigger fires

**Supporting features:**
- AND / OR logic between triggers
- Throttling ("max once per hour")
- Backtesting — simulate trigger against past data before going live
- Save as draft / version history / enable/disable toggle

### 3.4 Agent Preview Panel

A side-by-side live preview of agent behavior while configuring it. The right panel renders actual agent responses while the left panel shows configuration controls.

**Key behaviors:**
- Test interactions update in real-time as configuration changes
- Shows the agent's reasoning process inline
- Highlights which configuration setting influenced each response
- Allows sending test messages to evaluate agent behavior before deployment

---

## 4. Interface Layout Patterns for Multi-Agent Views

Luke Wroblewski's research on agent management interfaces ([LukeW](https://www.lukew.com/ff/entry.asp?2106)) identifies 5 high-level layout patterns, each with different tradeoffs:

### 4.1 Kanban Board

**Best for:** Visualizing work as it moves through defined stages. Natural for agents with discrete workflow states.

**Default stages:** Scheduled → Running → Reviewed → Complete

**Domain-specific stage examples:**
- Sales pipeline: Prospecting → Qualifying → Proposing → Closing
- Engineering: Backlog → In Progress → Review → Deployed

**Tradeoffs:**
- Pro: Immediately legible state for multiple concurrent agents
- Pro: Users expect drag-to-reorder from Trello/Jira
- Con: Users expect to be able to move cards manually (which may conflict with agent-controlled state)
- Con: Doesn't show inter-agent dependencies well

**Key UI components:**
- Cards with agent name, current step, last activity timestamp
- WIP limits per column
- Quick-action menu on each card (pause, inspect, stop)
- Column collapse for stages with many cards

### 4.2 Dashboard (Mission Control)

**Best for:** High-level status overview across many agents and data sources simultaneously.

**Tradeoffs:**
- Pro: Maximum information density; flexible arrangement
- Pro: No implied workflow sequence
- Con: Can become overwhelming without strict curation
- Con: Hard to show agent inter-dependencies

**Key UI components:**
- KPI tiles (active agents, tasks completed today, errors, cost)
- Activity feed widget
- Per-agent status indicators
- Alert/exception widgets

### 4.3 Inbox (Chronological Stream)

**Best for:** Processing agent outputs, approvals, and questions one at a time. Clear "done" state.

**Tradeoffs:**
- Pro: Familiar mental model (email, Slack)
- Pro: Strong "inbox zero" satisfaction
- Con: Scales poorly with high agent volume (gets overwhelming)
- Con: Doesn't show inter-agent dependencies or parallel state

**Key UI components:**
- Unread count badge
- Priority/urgency indicators
- Swipe-to-approve / swipe-to-reject (mobile)
- Archive vs. resolve distinction
- Filter by agent, action type, urgency

### 4.4 Task List (Hierarchical)

**Best for:** Complex plans with sub-tasks, dependencies, and parallel tracks.

**Tradeoffs:**
- Pro: Shows inter-dependencies between agent subtasks
- Pro: Checkbox completion is satisfying and clear
- Con: Hierarchical nesting can hide important parallel subtasks
- Con: Less visual than Kanban for status at a glance

**Key UI components:**
- Collapsible subtask groups
- Dependency indicators (blocked by, blocks)
- Progress percentage per task group
- Inline status (pending / in progress / done / failed)

### 4.5 Calendar

**Best for:** Scheduled agents, recurring tasks, time-bounded work contexts.

**Tradeoffs:**
- Pro: Natural for scheduling and time-based agents
- Pro: Contextually groups agent work with actual meetings
- Con: Duration-variable tasks (minutes to hours) are hard to represent
- Con: Event-triggered agents have no natural time anchor

**Key UI components:**
- Event tiles for scheduled runs with duration estimates
- Month/week/day views
- Quick "schedule agent" inline on any time slot
- Integration with calendar data to provide context

---

## 5. Conversational & Chat Interface Patterns

### 5.1 Composer Patterns

**Scope Banners / Context Banners** — Attached to the composer, these announce the active scope or context for the current conversation (e.g., "Replying to message from Sarah Chen" or "Scoped to: Vercel Platform docs"). Multiple scope banners can stack.

**Knowledge Source Scoping** — Tabs or chips on the composer that scope the agent's context (e.g., "Platform Docs / Basics / API Reference"). Clicking switches the RAG corpus the agent searches.

**Reply-to Banners** — When replying to a specific message in a thread, the composer shows a "Replying to: [message preview]" banner so the agent understands the reply context.

**Command Palette (cmdk)** — `⌘K` or `/` opens a fast-access palette for starting common agent actions, switching threads, or accessing frequently used tools.

### 5.2 Suggestion Chips / Prompt Starters

**Contextual suggestion chips** surface before or early in a conversation to solve the blank canvas problem. Examples:
- "List all my projects"
- "Show me my latest deployment"
- "What failed in the last test run?"

**Design principles:**
- Must be contextually relevant to the user's current state (not generic)
- Personalize based on recent activity
- Maximum 4-6 chips visible; rotate or paginate for more
- Chips should be specific tasks, not just categories

**Pattern variations:**
- **Quick actions** — One-click to execute (no confirmation needed)
- **Prompt starters** — Fill the composer input field for user to edit before sending
- **Template launchers** — Open a structured form for common multi-field tasks

### 5.3 Streaming & Progress Indicators

**Streaming cursor** — A blinking cursor or animated ellipsis showing the agent is generating.

**Tool call indicators** — Collapsible/expandable blocks showing what tool is being called, with timing (e.g., "Searching tests by keyword... 1.2s"). States: loading → complete → error.

**Scroll-to-bottom indicator** — When the user has scrolled up, a floating pill button appears: "New activity ↓" or a count of unread messages. Clicking snaps back to the latest output.

**Parallel execution indicator** — When the agent spawns multiple parallel subtasks, a branching visual shows simultaneous operations (e.g., "Running tasks in parallel: checking requirement coverage + fetching recent test results").

**Plan progress card** — Shows a multi-step plan with each step marked pending / in-progress / complete. Animates as steps complete.

### 5.4 Thread & Conversation Management

**Thread sidebar** — List of past conversations with title, preview, and type badge (analysis / report / deep-dive). Supports pinning, search, and date grouping (Today / Yesterday / Previous 7 Days).

**Thread types** — Visual distinction between thread types via badge or icon (analysis vs. report vs. deep-dive).

**New thread button** — Prominent "new conversation" action, often with a `+` icon or `⌘N`.

**Thread search** — Full-text search across all thread content (messages, tool outputs, documents).

---

## 6. Rich Action Preview & Approval Patterns

This is one of the most important and underserved patterns in agentic UI. The core concept: **before the agent executes an action in the external world, it renders a full-fidelity preview of what will happen.** The user approves or rejects based on the preview.

### 6.1 The Core Pattern

**Flow:**
1. Agent determines it needs to execute an external action (create calendar event, send email, file ticket, make purchase, run code, etc.)
2. Agent renders a **rich preview card** — a fully structured representation of the artifact it will create, matching the visual language of the target system
3. User sees the preview with **Approve / Reject** (or **Confirm / Cancel**) buttons
4. On approval, agent executes. On rejection, agent asks for clarification or alternative

**Why this is different from simple confirm/deny:**
- Shows the *exact artifact* that will be created, not a text description
- Structured data (fields, labels, values) matching the target system's format
- User can understand at a glance whether the action is correct

### 6.2 External Service Card Examples

**Google Calendar Event Card:**
```
┌────────────────────────────────────────────┐
│ 📅  Google Calendar                         │
├────────────────────────────────────────────┤
│ Title:    "Q4 Planning Meeting"             │
│ Date:     Thursday, March 20, 2026          │
│ Time:     2:00 PM – 3:30 PM PST             │
│ Guests:   sarah@company.com, alex@co.com   │
│ Location: Zoom (link auto-generated)        │
│ Notes:    Agenda: roadmap review, OKR sync  │
├────────────────────────────────────────────┤
│ [✗ Reject]                    [✓ Create]   │
└────────────────────────────────────────────┘
```

**Linear Ticket Card:**
```
┌────────────────────────────────────────────┐
│ ◆  Linear                                   │
├────────────────────────────────────────────┤
│ [ENG-847]  Fix auth token expiry bug        │
│ Team:      Engineering / Backend            │
│ Priority:  🔴 Urgent                        │
│ Assignee:  @alex                            │
│ Due date:  Mar 15, 2026                     │
│ Labels:    bug, auth, P0                    │
├────────────────────────────────────────────┤
│ [✗ Reject]                    [✓ Create]   │
└────────────────────────────────────────────┘
```

**Email Draft Card:**
```
┌────────────────────────────────────────────┐
│ ✉  Gmail                                    │
├────────────────────────────────────────────┤
│ To:       customer@client.com               │
│ Subject:  Re: Your support request #4821    │
│ Preview:  "Hi Sarah, I've looked into the  │
│            billing issue you raised. The   │
│            charge was..."                  │
│ [↗ View full draft]                        │
├────────────────────────────────────────────┤
│ [✗ Reject]                    [✓ Send]     │
└────────────────────────────────────────────┘
```

### 6.3 Ask Blocks (Open-Ended Input Gates)

When the agent needs clarification before proceeding, it renders a structured question form inline in the conversation — not a free-text question, but a form with labeled fields:

**Example:**
```
┌────────────────────────────────────────────┐
│ Before I proceed, I need a few details:     │
│                                            │
│ Report scope                               │
│ ○ Include all requirements   ● Failed items only │
│                                            │
│ Output format                              │
│ ○ PDF   ● Markdown   ○ Both                │
│                                            │
│ [ Submit ]                                 │
└────────────────────────────────────────────┘
```

**Key design principles for ask blocks:**
- Label each question clearly
- Provide structured choices where possible (radio, checkbox, select) not just freeform text
- Group related questions together
- Show why each piece of information is needed
- Allow skipping with sensible defaults

### 6.4 Decision Blocks

When the agent has multiple valid paths and needs the user to choose:

**Example:**
```
┌────────────────────────────────────────────┐
│ Should I reallocate this unused budget?     │
│                                            │
│ [Reallocate to Marketing]                  │
│ $12,000 → Q2 digital spend                 │
│                                            │
│ [Save for Q3 Buffer]                       │
│ Keep liquid for unexpected Q3 costs        │
│                                            │
│ [Let me decide later]                      │
└────────────────────────────────────────────┘
```

---

## 7. Autonomy Spectrum & Control Patterns

### 7.1 The 5-Level Autonomy Model

Borrowing from self-driving car taxonomy ([ShShell Gemini ADK](https://shshell.com/blog/gemini-adk-module-2-lesson-3-control-autonomy)):

| Level | Name | Behavior | UI Pattern |
|-------|------|----------|------------|
| 1 | **Directed Assistance** | Acts only on specific, narrow command. No memory, no planning. | "Format this text" — immediate single-step execution |
| 2 | **Task-Oriented** | Decides sequence of steps but not tools or goal. | Plan card with user-initiated steps |
| 3 | **Evaluative Agency (HITL)** | Plans and executes; stops before high-stakes actions for confirmation. | Approval modal for flagged action types |
| 4 | **Supervised Autonomy (HOTL)** | Operates autonomously within a sandbox; human can intervene. | Live monitoring dashboard + override controls |
| 5 | **Full Autonomy** | Manages own goals, self-corrects, operates independently. | Activity log and alerting only |

### 7.2 Human-in-the-Loop (HITL) Gate UI

The UI that stops the agent and requires human approval before proceeding.

**Components of a well-designed HITL gate:**
1. **Context summary** — What the agent was doing and why it's pausing
2. **Proposed action** — The rich preview card (see section 6.2)
3. **Reasoning** — "I'm creating this ticket because the bug meets the P0 severity criteria in your configuration"
4. **Approve / Reject / Modify** — Three-way choice (not just yes/no)
5. **Urgency indicator** — How long the agent has been blocked waiting

**Notification delivery for HITL gates:**
- In-app: Inbox badge, toast notification
- Async: Slack message, email with inline approve/reject buttons
- Include: criticality, action required (validation/information/decision), urgency timestamp

### 7.3 Human-on-the-Loop (HOTL) Dashboard UI

When the agent operates autonomously but the human monitors:

**Required UI components:**
- Real-time activity feed showing each action taken
- Kill switch / pause button always visible
- Override / take-over control for any in-progress step
- Alert thresholds ("Notify me if agent makes >10 external calls in 5 minutes")
- Cost/rate monitoring (see section 17)

---

## 8. Trust, Transparency & Explainability Patterns

### 8.1 Stream of Thought / Thinking Indicators

The agent's internal reasoning made visible. Pioneered by Anthropic's extended thinking.

**Pattern variants:**

**Collapsed thinking** (default):
```
◑ Thinking...  [▼ expand]
```

**Expanded thinking:**
```
◑ Thinking...
  Let me analyze the test failures systematically.
  The timestamp issue looks like a configuration mismatch,
  not a product defect. For the connection issue,
  I should check whether the network link is available...
  [▲ collapse]
```

**Claude's approach:** Extended thinking creates separate `thinking` content blocks before `text` response blocks. Summarized thinking condenses the full reasoning process; the model still benefits from the full reasoning but users see a condensed version. Users can expand to see details. ([Anthropic extended thinking docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking))

**Design principles:**
- Thinking content should feel exploratory and honest, not polished
- Show uncertainty in the thinking — agents that express uncertainty are more trustworthy
- Allow collapse to default state to reduce noise
- Don't over-anthropomorphize thinking content

### 8.2 Footprints / Activity Trace

A chronological log of everything the agent did to produce a response:

**Structure of a footprint entry:**
- Icon indicating action type (search, analyze, read, write, call API)
- Action label ("Analyzing execution logs")
- Duration or timestamp
- Expandable detail (what was found, what was sent)
- Outcome status (success / error / skipped)

### 8.3 Source Attribution & Citations

**Inline citations** — Numbered superscripts or chips inline in the agent's response, each linking to the source document or URL. On hover, show a preview of the cited content.

**Example implementation:** Citation chips styled with a document icon plus source name (e.g., `📄 Product Spec §6.1.1`). Clicking opens a side panel showing the full source in context.

**Citation card design:**
- Source title and section
- Relevant excerpt highlighted
- Link to full document
- Confidence indicator (optional)

### 8.4 Confidence Display

Per Apple's HIG guidelines:
- Never show raw probability numbers (0.73) to regular users
- Use semantic categories: "high chance," "likely," "possible," "uncertain"
- Use ranked ordering to imply relative confidence
- Withhold low-confidence results for proactive/ambient features
- For technical/statistical domains, numerical display is appropriate

### 8.5 AI Disclosure

Every AI-generated or AI-mediated output should have clear disclosure:
- "Generated by AI" badge on documents, emails, reports
- "AI-assisted" label on suggestions and drafts
- Incognito/private mode toggle for sessions without memory
- Clear disclosure in shared outputs sent to external parties

---

## 9. Knowledge Base & RAG UI Patterns

### 9.1 Context Ring / Token Meter

A visual indicator of how much context the agent is currently using. One implementation pattern is a circular ring icon that reveals "4,200 / 8,192 tokens used" on hover.

**Design considerations:**
- Show as ring/arc visualization for quick gestalt reading
- Display on hover to avoid cluttering the default state
- Color coding: green (< 50%) → yellow (50–80%) → red (> 80%)
- Show what's consuming the context on click (thread history vs. attached documents vs. system prompt)

### 9.2 Knowledge Source Viewer / Context Panel

A side panel showing what documents, files, or data sources the agent has access to for the current conversation.

**Content:**
- List of attached documents with filename, type, and size
- Scope selectors (e.g., "All company docs / Project-specific / This conversation")
- Per-source enable/disable toggle
- "Add source" button to attach additional context

### 9.3 RAG Source Scoping

Tabs or segments on the composer that restrict the agent's search space:
- "Platform Docs"
- "Internal KB"
- "This conversation"
- "Web"

Switching scopes is immediately reflected in the next response (not a settings panel).

### 9.4 Connector / Integration Cards

When configuring which data sources an agent can access:

**Catalog pattern (App Store style):**
- Grid of integration cards (Notion, Salesforce, GitHub, Slack, etc.)
- Categories / filters / search
- Each card shows: name, icon, description, current status (Connected / Available / Error)
- Connected integrations show last sync time and data scope

**Integration detail page:**
- What data the agent can read/write
- Setup guidance (OAuth flow or API key)
- List of connected instances
- Permissions / scope controls

---

## 10. Agent Monitoring & Observability Patterns

### 10.1 Overview Panel

The primary at-a-glance view of an agent's current state. ([Benjamin Prigent](https://www.bprigent.com/article/7-ux-patterns-for-human-oversight-in-ambient-ai-agents))

**Required elements:**
- **Status indicator** — Idle / Running / Paused / Error (with on/off toggle)
- **Recent missions** — Last N tasks with status and timestamp
- **Human oversight queue** — Items requiring attention (with "inbox zero" empty state)
- **Output metrics** — KPIs: tasks completed, success rate, errors, cost

**Design pattern:** Use a hardware-switch visual for the on/off control to signal that this has real-world consequences (not just a software toggle). Add "Are you sure?" confirmation for the off state.

### 10.2 Activity Log

The complete, auditable history of everything the agent did.

**Structure:**
- Reverse-chronological timeline of missions
- Per-mission: trigger, duration, outcome, cost, human involvement
- Filter by: date range, outcome (success/failure/HITL), action type
- Download/export capability
- Search across all missions

**Mission detail page:**
- Chronological task list showing each step (trigger → reasoning → tool calls → HITL → output)
- Step types differentiated visually (trigger vs. reasoning vs. external tool call vs. human input)
- Duration and cost per step
- Collapsed/expanded detail per step (inspired by Datadog traces)

### 10.3 Work Reports

Separate from the activity log, work reports show the *outputs* of agent work.

**Content-heavy outputs** (documents, summaries, reports):
- Format matching the delivery channel (Slack message, PDF, dashboard widget)
- Share/send to email or Slack

**Operations-heavy outputs** (automation, support, data processing):
- KPIs: jobs completed, error rate, handoff count, time saved, API spend
- Trend charts over time

### 10.4 Scheduled / Background Task UI

For recurring or time-triggered agent tasks:

**Scheduling interface:**
- Cron-like schedule builder with human-readable preview ("Every Monday at 9am")
- Event-based triggers ("When a new issue is filed in GitHub")
- Next run preview
- History of past runs with status

**Background task indicator:**
- A persistent status area (header or sidebar) showing active background agents
- Count of running tasks with quick-inspect capability
- Notification when background tasks require attention

---

## 11. Memory & Context Persistence Patterns

### 11.1 Memory Display UI

**What the agent remembers about the user/organization:**
- Explicit memory list (settings-style page or side panel)
- Categories: preferences, facts, past interactions
- Per-memory actions: edit, delete, promote/demote importance
- Incognito mode toggle to prevent recording new memories

**Memory types (from AWS Bedrock taxonomy):**
- **Summary** — Condensed interaction highlights
- **User preferences** — Explicit and implicit preferences
- **Semantic** — Factual information for meaning-based retrieval

### 11.2 Cross-Session Continuity Signals

How the agent signals it remembers previous context:
- "Based on our conversation last week about X..." — Inline reference in prose
- Memory indicator badge: a small pill showing "Using 3 memories"
- "Remembered context" collapsible section before agent responds

### 11.3 Memory Controls

Per Microsoft HAX G13 (learn from user behavior) and G17 (provide global controls):
- **Forget this** — Delete specific memories from a conversation
- **Never remember this type** — Block categories of memory
- **Memory dashboard** — Full list of all stored memories with edit/delete
- **Import/export** — For portability and transparency

---

## 12. Handoff & Escalation Patterns

### 12.1 Agent → Human Escalation

When the agent can't resolve a task and needs a human:

**Escalation card UI:**
```
┌────────────────────────────────────────────┐
│ ⚠  Needs human review                       │
│                                            │
│ I've reached the limit of my authority.    │
│ This decision requires policy expertise.  │
│                                            │
│ Summary of what I did:                     │
│ • Analyzed 47 similar cases               │
│ • Applied standard resolution path        │
│ • Exception: customer is VIP tier         │
│                                            │
│ [Assign to agent] [Take over myself]       │
└────────────────────────────────────────────┘
```

**Key design principles:**
- Never just fail silently — always explain why the escalation is happening
- Preserve complete context at the handoff point
- Show what the agent did before escalating
- Recommend who should handle (if known)

### 12.2 Agent → Agent Handoff

When one agent transfers to a specialized agent:

- Show the handoff as an explicit event in the activity trace
- Display which agent is taking over and why ("Routing to customer-research-agent because this requires CRM access I don't have")
- Preserve conversation context across the handoff
- Allow the user to stay informed without being in the loop

### 12.3 Human → Agent Re-delegation

When a human supervisor returns a task to an agent after reviewing:
- Clear "Resume agent" action button
- Optional modification before resuming ("Resume with this correction: [...]")
- Status update: "Agent resumed at [timestamp]"

---

## 13. Error Recovery Patterns

### 13.1 Tool Error States

When a tool call fails mid-execution:

**Error display in tool group:**
- Red error styling on the failed tool block
- Error message with specific failure reason (not generic "something went wrong")
- **Retry** button inline
- **Skip and continue** option (if the tool was non-essential)
- **Manual takeover** option for critical paths

**Example error state:**
```
⚠ Checking external service connection failed · 8.2s
  Connection timed out — the remote service did not
  respond within 8 seconds. The network connection may
  be unavailable or temporarily degraded.
  [🔄 Retry]
```

### 13.2 Graceful Degradation

When the agent can't complete a task fully:
- Complete what's possible and clearly mark what failed
- Offer partial results with confidence caveats
- Suggest what the user can do manually for the failed portion
- Never return an empty response — always show progress made

### 13.3 Error Recovery Flows (5 types)

Per Benjamin Prigent's taxonomy:
1. **Communication** — Notify of success/completion ("Agent reconciled invoices")
2. **Validation** — Yes/No with context shown (swipe-like)
3. **Decision** — Multiple options shown with implications as buttons/cards
4. **Context** — Informational page + form (e.g., "I need to correct a spelling")
5. **Error** — Explain failure, recovery options (retry / ignore), manual takeover

---

## 14. Evaluation & Feedback Patterns

### 14.1 Inline Response Rating

**Minimal pattern:** Thumbs up / thumbs down on each agent response.

**Extended pattern:** After thumbs down, offer:
- "What was wrong?" (radio: Wrong / Unhelpful / Incomplete / Harmful / Other)
- Optional freeform correction
- "Show me a better response" option

**Design principles from Microsoft HAX G15:**
- Make feedback granular (not just global thumbs up/down)
- Act on feedback immediately (show the consequence)
- Convey how feedback will affect future behavior (HAX G16)

### 14.2 Correction Flows

**Inline correction** — Highlight a specific part of the agent's output and ask for a correction:
- Select text → "Fix this" overlay → describe the issue
- Agent re-generates just the selected section

**Full regeneration with guidance:**
```
[🔄 Regenerate with changes]
What should be different? [free text or structured options]
```

### 14.3 Evaluation / Quality Metrics

For enterprise/production agents:
- Pass rate on evaluation test suites
- Human override rate (how often humans reject agent decisions)
- Escalation rate (how often agents escalate to humans)
- Cost per successful task
- Time to completion vs. human baseline

---

## 15. Guardrails & Governance UI Patterns

### 15.1 Behavioral Constraints Configuration

**What users can configure:**
- Topics/intents the agent is allowed to handle
- Topics/intents that are explicitly blocked
- Maximum action scope (e.g., "Can read but not write to CRM")
- Data access restrictions (e.g., "Only access customer records for your region")

**UI pattern:** Policy builder with rule cards:
```
[✓] Can search internal knowledge base
[✓] Can send emails to customers
[✗] Cannot access financial data  [+ Add exception]
[✗] Cannot delete records
```

### 15.2 Content Policy Configuration

- Banned topics list (freeform or from preset categories)
- Safe messaging guidelines (e.g., for healthcare agents)
- PII handling rules (redact / summarize / block)
- Tone restrictions (e.g., "Never apologize for company policy")

### 15.3 Action Restrictions

Per-action type controls:
- Read-only vs. read-write permissions per integration
- Approval requirements per action category
- Rate limits per action type (e.g., "Max 50 emails/day")
- Audit requirements ("Log all actions involving financial data")

---

## 16. Multi-Modal Output Patterns

### 16.1 Inline Rich Output Types

Outputs that agents render directly in the conversation, not as downloads:

| Type | Pattern | Notes |
|------|---------|-------|
| **Code blocks** | Syntax-highlighted, with copy and "run" button | Show language label; allow execution in sandbox |
| **Data tables** | Sortable, filterable, with download CSV | Show row count; handle truncation gracefully |
| **Charts/Graphs** | SVG or Canvas rendering inline | Show data source; allow zoom; export option |
| **Images** | Inline with alt text and zoom | Clearly labeled as AI-generated if applicable |
| **Documents** | Embedded viewer with citation support | PDF-style scrollable preview |
| **Mermaid diagrams** | Rendered as flowcharts/sequence diagrams | Toggle between rendered and source |
| **Interactive components** | React/HTML widgets (calculators, forms, games) | Sandboxed iframe; Claude Artifacts pattern |

### 16.2 Artifact System (Claude-style)

A dedicated side panel that opens for complex outputs (code, documents, data):
- Opens automatically for outputs > ~10 lines or when structured work is detected
- Side-by-side view: conversation on left, artifact on right
- Version history (back/forward arrows)
- Show changes (diff view with additions/deletions highlighted)
- Export to PDF, Markdown, Word, or language-specific format
- Highlight-to-edit: select text in artifact and ask for targeted changes

### 16.3 Canvas (ChatGPT-style)

An editable workspace inside the chat for writing and coding:
- Two-pane: conversation (left) + editable document (right)
- Inline feedback and suggestions with the whole document in mind
- Shortcuts for common edits: adjust length, change reading level, add polish
- Direct editing in the canvas; AI edits the rest
- Version history and restore

---

## 17. Cost & Usage Transparency Patterns

### 17.1 Token Counter / Context Meter

**Example pattern:** A context ring icon that shows token usage on hover.

**Extended implementation:**
- Current usage / limit (e.g., "4,200 / 8,192 tokens")
- Breakdown: [System prompt: 800] [Thread history: 2,400] [Documents: 1,000]
- Warning at 80% with suggestion to archive old context

### 17.2 Cost Estimates Before Execution

**Shape of AI "Cost Estimates" pattern:** Show compute cost before the user triggers expensive operations.

**Implementation:**
- Inline estimate: "This deep research will use approximately $0.08 in API credits"
- Per-model cost transparency in model switcher
- Cost per operation in agent logs (activity log should show token/cost per step)

### 17.3 Usage Dashboard

For enterprise/team contexts:
- Usage by agent, by user, by time period
- Cost breakdown by model, tool type, and operation
- Budget alerts and limits
- Comparison to baseline or budget

### 17.4 Rate Limit Indicators

When approaching API or service limits:
- Inline warning: "You've used 847 of 1,000 Pro searches this month"
- Upgrade prompt when approaching limit
- Queue indicator when rate-limited: "Your request is queued — estimated 30 seconds"

---

## 18. Product-Specific Pattern Inventories

### 18.1 Anthropic Claude

**Artifacts system** — A dedicated side-panel workspace for generated content (HTML apps, React components, code, documents, Mermaid diagrams, SVGs). Artifacts can be persistent, shareable via link, and remixed. Artifacts can call Claude's API directly, enabling intelligent micro-apps. ([Albato Claude Artifacts Guide](https://albato.com/blog/publications/how-to-use-claude-artifacts-guide))

**Extended thinking / thinking indicators** — A toggle that enables Claude to show its reasoning process. Users see a "Thinking..." indicator that can be expanded to read a summary of Claude's thought process. Implemented as a separate `thinking` content block before the response. For Claude Opus 4.6, uses "adaptive thinking" that automatically scales thinking depth. ([Anthropic extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking))

**Incognito mode** — Ghost icon in header; conversations don't save to history and aren't used for training. Clear visual indicator when active.

**Context chip management** — Files, images, and context sources attached as removable chips above the composer.

**Model switcher with hierarchy** — Three current models with clear use-case descriptions; "More models" submenu for legacy access.

**Tool switching in composer** — Select capabilities (Code Interpreter, Web Search, file analysis) directly from composer toolbar.

**MCP Apps** (January 2026) — First official MCP extension enabling interactive UI (charts, forms, dashboards) inside Claude's chat. Agent stays in control; user gets purpose-built UI for specific decisions; context flows bidirectionally.

### 18.2 OpenAI ChatGPT

**Canvas** — A two-pane workspace for writing and coding that opens as a side panel. Features: inline editing, highlight-to-edit, shortcut actions (adjust length, reading level, debug code, add polish), version history, "show changes" diff view, export to PDF/MD/DOCX/code files. Opens automatically for outputs > ~10 lines. ([OpenAI Canvas introduction](https://openai.com/index/introducing-canvas/))

**Code Interpreter** — Python execution in a sandboxed environment, with file upload/download, data analysis, visualizations, and machine learning capabilities. Shows code that was run alongside the result.

**DALL-E inline** — Image generation within the conversation; tool selection and result display integrated directly in chat; show changes to prompt vs. previous generation.

**Web browsing** — Agent browses the web with inline citations; shows sources; "think longer" option.

**Tool switcher in composer** — Select active tools (Code Interpreter, DALL-E, Web Search) directly from the composer interface as an accessible capability picker.

**Response refinement menu** — Contextual menu on AI responses: "Try again / Add details / More concise / Search the web / Think longer."

**Personalization** — Dedicated interface for customizing conversation style, response format, and contextual preferences (separate from technical settings).

### 18.3 Perplexity

**Citations** — Every response includes numbered citations with inline annotations. On hover: preview of the cited content. On click: full source view. Numbered superscripts or expandable source list sidebar. ([Learn Prompting Perplexity Guide](https://learnprompting.org/blog/guide-perplexity))

**Pro Search** — Deep search mode that breaks the question into smaller steps and pulls insights from a broader source set. Toggle in the composer. Free users get 5/4 hours; Pro gets ~unlimited.

**Focus modes** — Scope the search to specific content types:
- Web (default — entire internet)
- Academic (peer-reviewed journals and publications)
- Social (social media and forums)
- Video (YouTube and video platforms)
- Writing (creative and technical writing optimized)
- Math (Wolfram Alpha powered)

**Incognito mode** — Search without saving query history; switch profile to "Incognito."

**Source browser / sidebar** — Access search history, Collections (saved queries), Discover feed (trending), and settings from the sidebar.

**Model switcher** — In-composer dropdown showing all available models (GPT-5.2, Claude Opus 4.5, Gemini 3 Pro/Flash, Grok 4.1, Sonar models) with performance tradeoffs.

**Shopping tab** — A discovery feed of recommended products with images, prices, ratings, and one-click purchase.

### 18.4 Vercel AI SDK / v0

**Streaming architecture** — Server Actions stream responses token-by-token using `streamText` / `useChat` hook. No separate API route needed. End-to-end type safety between server model calls and client UI.

**Structured outputs** — `generateObject` / `streamObject` with Zod schema validation. Model constrained to generate valid JSON matching the schema. Progressive rendering: each field populates as it streams. ([Vercel AI SDK 6 article](https://www.digitalapplied.com/blog/vercel-ai-sdk-6-streaming-chat-nextjs-guide))

**Tool calling** — Tools defined with typed Zod parameter schemas and execute functions. `maxSteps` parameter controls multi-step tool calling loops. Model decides which tool to call; SDK executes and feeds results back.

**Generative UI (AI SDK 3.0)** — Stream React components directly from LLMs. `render()` function with `tools` that have `render: async function*` returning React components (with loading states). ([Vercel AI SDK 3.0 blog](https://vercel.com/blog/ai-sdk-3-generative-ui))

**v0** — Text/image prompts to React + Tailwind + shadcn/ui components. Iterative refinement; direct Next.js project integration; supports many UI libraries (MUI, Chakra, Bootstrap).

**Provider-agnostic model routing** — Unified model interface across providers; route to different models based on query complexity or cost optimization.

---

## 19. Design Principles Synthesis

### From Research Across All Sources

**1. Transparency Over Confidence**
Show your work. Users who can see why an agent did something trust it far more than users who get a result with no trace. Always expose reasoning, citations, and tool use — even if collapsed by default. (Microsoft HAX G11, Shape of AI "Stream of Thought", Anthropic extended thinking)

**2. Control Is a Trust Signal**
Providing controls — pause, override, kill switch, feedback — isn't just about safety. It's how users come to trust agents. An agent that can be stopped is more trustworthy than one that cannot. (Microsoft HAX G9, G17; Prigent patterns)

**3. Progressive Autonomy, Earned Incrementally**
Design for Level 2 autonomy by default. Let users unlock higher levels of autonomy as the agent demonstrates reliability. Never start at Level 5. (Six-mode spectrum; Apple HIG calibration principles)

**4. Full Preview Before Action**
For any action with real-world consequences, render a full-fidelity preview of exactly what will happen. Not a text summary — a structured representation of the artifact. (Rich action preview pattern; section 6)

**5. The Blank Canvas Problem Is Always Present**
Suggestions, templates, examples, and prompt starters are not optional. Every empty state in an agentic interface needs wayfinder patterns to help users get started. (Shape of AI Wayfinders; NNG prompt suggestions research)

**6. Errors Are Diagnostic Opportunities**
Never show a generic error. Every tool failure, escalation, or unexpected behavior should be explained with: what failed, why, and what the user can do next. (Microsoft HAX G10; Apple HIG mistakes pattern; section 13)

**7. Memory Requires Explicit Control**
If an agent remembers things, users need a way to see, edit, and delete those memories. Invisible persistence destroys trust faster than anything. (Microsoft HAX G12, G13; Shape of AI "Memory" and "Data Ownership")

**8. Feedback Must Be Granular and Immediate**
Thumbs up/down is a floor, not a ceiling. Granular feedback (what type of problem) + immediate behavioral consequence ("This won't happen again") is the target. (Microsoft HAX G15, G16)

**9. Cost and Compute Should Never Be Invisible**
Users who can see what a deep research costs in tokens, time, and money will make better decisions and trust the system more. (Shape of AI "Cost Estimates"; section 17)

**10. Design the Relationship, Not the Screen**
The fundamental unit of agentic experience is not the session or the screen — it is the ongoing relationship between user and agent. Design for trust accumulation over time, not just task completion in the moment. (UX → AX shift; NNG service design principles)

---

*Sources: [agenticui.net](https://agenticui.net) | [shapeof.ai](https://www.shapeof.ai) | [pair.withgoogle.com/guidebook](https://pair.withgoogle.com/guidebook) | [Microsoft HAX Toolkit](https://www.microsoft.com/en-us/haxtoolkit/) | [Apple HIG Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning) | [NNG Generative UI](https://www.nngroup.com/articles/generative-ui/) | [NNG Service Design AI](https://www.nngroup.com/articles/service-design-evolve-ai-agents/) | [NNG Designing AI Products](https://www.nngroup.com/articles/designing-ai-study-guide/) | [Vercel AI SDK 3.0](https://vercel.com/blog/ai-sdk-3-generative-ui) | [Anthropic Extended Thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) | [Anthropic Artifacts](https://newsletter.pragmaticengineer.com/p/how-anthropic-built-artifacts) | [OpenAI Canvas](https://openai.com/index/introducing-canvas/) | [Learn Prompting Perplexity](https://learnprompting.org/blog/guide-perplexity) | [LukeW Agent Management](https://www.lukew.com/ff/entry.asp?2106) | [Benjamin Prigent 7 UX Patterns](https://www.bprigent.com/article/7-ux-patterns-for-human-oversight-in-ambient-ai-agents) | [Six-Mode Spectrum](https://www.emergentmind.com/topics/six-mode-spectrum-of-human-agent-collaboration) | [AI UX Playground](https://www.aiuxplayground.com/gallery) | [CHI 2019 HAX Paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf)*
