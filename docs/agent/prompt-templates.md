# Hermes prompt templates for Agentic Craft

These are copy/paste starters for using Hermes in ways that go beyond the single-task coding loop.

Replace bracketed sections before using.

## 1. Feature Framing Sprint

```text
Run a Feature Framing Sprint for [feature idea].

Workspace: [repo path]

Start by reading AGENTS.md, docs/agent/README.md, and the relevant code paths. Read INTERACTIVE_SPEC.md if UI is involved. Use historical docs only if needed.

Deliver:
1. current state in the repo
2. user/job-to-be-done framing
3. constraints and invariants
4. 2-3 viable architecture or product directions
5. tradeoffs for each
6. recommended direction
7. open questions and next experiments

Tag claims as:
- repo-backed
- web-backed
- assumption

Keep it concise and decision-oriented.
```

## 2. Pattern Harvest

```text
Run a Pattern Harvest for [interaction / pattern / flow].

Workspace: [repo path]

Collect 5-8 relevant references from [products/sites]. Use browser + vision to inspect actual UI behavior, and use shadcn-studio-mcp + uidotsh to map ideas to implementation-ready primitives.

For each reference, capture:
- source / URL
- what the interaction is doing
- why it works or fails
- reusable primitive or pattern
- what not to copy blindly

Then synthesize:
1. safe system-ready pattern
2. more exploratory/stretch pattern
3. required components, states, tokens, and edge cases for this repo
4. recommendation for what to prototype first
```

## 3. Option Lab

```text
Run an Option Lab for [feature/problem].

Workspace: [repo path]

Spawn 3 parallel subagents with these lenses:
A. conservative / reuse-first
B. differentiated / bold UX
C. fastest path to validated prototype

Each subagent should inspect repo constraints and relevant references, then return:
- concept summary
- key components or flows
- architecture impact
- implementation effort
- major risks
- what makes it attractive or unattractive

Then synthesize into:
1. side-by-side decision matrix
2. strongest recommendation
3. fallback option
4. smallest experiment to reduce uncertainty this week
```

## 4. Design-to-Code Loop

```text
Run a Design-to-Code Loop for [feature/component].

Workspace: [repo path]

Ground yourself in AGENTS.md, docs/agent/README.md, INTERACTIVE_SPEC.md, and the relevant implementation files before editing.

Use shadcn-studio-mcp and uidotsh when useful for component/system choices.

Work in checkpoints:
1. inspect current implementation
2. propose the smallest viable change set
3. implement
4. run relevant checks
5. open in browser
6. use vision to do a design QA pass
7. summarize the diff, issues, and follow-ups

Show quiet status updates rather than raw logs.
Ask before destructive or externally visible changes.
Stop when [done condition].
```

## 5. Review Gate

```text
Run a Review Gate on [branch/diff/feature/prototype].

Workspace: [repo path]

Review through these lenses:
- product logic
- interaction and visual consistency
- architecture and maintainability
- accessibility, performance, responsiveness
- provenance/trust: what is verified vs assumed

Use repo files, relevant checks, browser inspection, and vision.

Return:
1. pass/fail scorecard
2. blockers
3. non-blocking polish items
4. states or screenshots worth fixing
5. smallest fix sequence to get to ship-ready

Be specific and evidence-based.
```

## 6. Background Radar

```text
Set up a Background Radar for [topic/domain].

Workspace: [repo path]

On [schedule], scan:
- [repo paths]
- [competitor/reference products]
- [libraries/components/ecosystem sources]

Track:
- new signals or changes
- why they matter
- repo areas likely affected
- opportunities for reuse or cleanup

Store only stable preferences/rules in memory.
Do not treat scratch findings as durable memory.

Send a digest with:
1. new signals
2. why they matter
3. recommended next actions

Escalate immediately only if [conditions].
```

## Suggested first three to adopt

If you want a gradual ramp instead of changing your whole way of working at once, start with:
- Feature Framing Sprint
- Design-to-Code Loop
- Review Gate

That gives you a better Hermes workflow immediately without needing to jump into cron, heavy delegation, or research harvesting all at once.
