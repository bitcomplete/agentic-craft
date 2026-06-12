# Agentic Craft

Agentic Craft is a reference guide for designing agentic product interfaces
beyond chat. It documents interaction patterns for agent orchestration,
configuration, tool use, planning, rich action previews, approvals, memory,
feedback, multi-agent coordination, monitoring, and observability.

The project is intentionally broader than a UI kit and broader than a chat
starter. Components are included so the guidance can be explored, copied, and
tested, but the primary artifact is a set of opinionated interface patterns for
high-trust agent experiences.

## What Is Inside

- A Next.js reference site with interactive examples for common agent workflows
  across chat, dashboards, inboxes, task lists, approvals, and monitoring views.
- A shadcn-compatible registry for reusable agentic interface primitives.
- Pattern pages that explain behavior, states, rationale, and interaction
  details instead of only showing static component samples.
- Research-driven taxonomy work that treats chat as one interface model among
  many: orchestration, create/configure, monitor, govern, recover, and improve.
- Workflow templates that show how patterns combine into end-to-end product
  flows such as review, approval, clarification, memory review, run monitoring,
  multi-agent handoff, and agent settings.

## Reference Areas

- `Conversation`: message surfaces, citations, observable work, clarifying
  questions, and composer behavior.
- `Sources & Artifacts`: citation systems, source previews, source-backed
  documents, and usage meters.
- `Agent Actions`: tool calls, subagents, parallel execution, plans, decision
  flows, clarifying interruptions, and approval gates.
- `Trust & Control Plane`: autonomy settings, consent, context scope, provenance,
  audit trails, cost transparency, and kill-switch behavior.
- `Memory`: memory panels, ledger items, provenance previews, memory CRUD,
  auto-memory, context rings, and privacy controls.
- `Multi-Agent`: agent identity, handoff, routing, parallel execution, and
  inter-agent communication.
- `Feedback`: thumbs, corrections, ratings, error reports, escalation, and
  feedback history.
- `Observability`: activity timelines, token usage, session timelines, and
  error states.
- `Templates`: complete workflow references built from the primitives.
- `Registry`: local shadcn registry installation, primitives, blocks, and
  quality gates.

## Development

See [CLAUDE.md](./CLAUDE.md) for stack details, all commands, the registry invariant, and the QA bar.

```bash
npm install
npm run dev
```

npm is the supported package manager (see `packageManager` in package.json).

By default, the app runs at:

```bash
http://localhost:3000
```

## Registry

Build the shadcn registry artifacts with:

```bash
npm run registry:build
```

The source registry lives in `registry.json` and is designed for GitHub
distribution:

```bash
npx shadcn@latest list bitcomplete/agentic-craft
npx shadcn@latest add bitcomplete/agentic-craft/review-workflow
```

The generated JSON registry is served locally from:

```bash
http://localhost:3000/r/registry.json
```

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
- `action-preview`
- `source-preview`
- `artifact-document`
- `usage-meter`
- `contextual-workbench`
- `effective-policy-preview`
- `memory-ledger-item`
- `run-trace`
- `handoff-packet`
- `status-indicator`
- `review-workflow` as an evidence-review `registry:block`
- `approval-workflow` as a human-in-the-loop `registry:block`
- `clarifying-workflow` as a missing-decision `registry:block`
- `source-backed-artifact` as a provenance-focused `registry:block`
- `memory-review` as a durable-context `registry:block`
- `run-monitor` as a background-work `registry:block`
- `multi-agent-handoff` as an ownership-transfer `registry:block`
- `agent-settings` as a policy-settings `registry:block`
- `workflow-phases` as a phase-rail `registry:ui`
- `workflow-run-monitor` as a multi-phase fleet-monitor `registry:block`

Validate the source registry locally with:

```bash
npx shadcn@latest registry validate ./registry.json
```

Inspect the generated local JSON registry with:

```bash
npx shadcn@latest list http://localhost:3000/r/registry.json
npx shadcn@latest view http://localhost:3000/r/review-workflow.json
npx shadcn@latest view http://localhost:3000/r/approval-workflow.json
npx shadcn@latest view http://localhost:3000/r/clarifying-workflow.json
npx shadcn@latest view http://localhost:3000/r/memory-review.json
npx shadcn@latest view http://localhost:3000/r/run-trace.json
npx shadcn@latest view http://localhost:3000/r/handoff-packet.json
npx shadcn@latest view http://localhost:3000/r/run-monitor.json
npx shadcn@latest view http://localhost:3000/r/multi-agent-handoff.json
npx shadcn@latest view http://localhost:3000/r/agent-settings.json
```

Use the GitHub source-registry address for real installs. The generated local
JSON is useful for previewing payloads while developing the site.

## Quality Checks

Run the full verification suite before publishing changes:

```bash
npm run verify
```

CI runs this command on every PR and push to main. For visual QA, check both
desktop and mobile breakpoints on the routes touched by the change. The current
mobile bar is especially strict for composer, clarifying questions, citations,
memory ledger rows, and template maps.

## Design Direction

Agentic Craft is not a chat UI kit. It is a product-interface reference for
agentic systems that need visible work, clear consequences, user control,
recoverability, provenance, and reusable implementation patterns.

The design system favors:

- compact mobile surfaces over oversized AI-demo chrome
- source previews and citations close to the claim they support
- locked consequence previews before approval
- observable work instead of hidden reasoning traces
- user-configurable prose and policy preferences
- registry-ready primitives that can be composed into product workflows
