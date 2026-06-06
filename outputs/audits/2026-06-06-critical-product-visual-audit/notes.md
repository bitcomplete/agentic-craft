# Agentic Craft Critical Product Visual Audit

Date: 2026-06-06
Local target: http://127.0.0.1:3000
Perspective: Product Design audit plus Creative Production visual-system critique.
Scope: Design/dev only. No marketing assessment.

## Evidence Captured

- `01-conversation-desktop.png` - `/conversation#messages`, 1223x998
- `02-conversation-composer-desktop.png` - `/conversation#composer`, 1223x998
- `03-conversation-mobile.png` - `/conversation#messages`, 390x844
- `04-conversation-composer-mobile.png` - `/conversation#composer`, 390x844
- `05-actions-desktop.png` - `/actions`, 1223x998
- `06-trust-desktop.png` - `/trust`, 1223x998
- `07-memory-desktop.png` - `/memory`, 1223x998
- `08-multi-agent-desktop.png` - `/multi-agent`, 1223x998
- `09-observability-desktop.png` - `/observability`, 1223x998
- `10-templates-desktop.png` - `/templates`, 1223x998
- `11-actions-mobile.png` - `/actions`, 390x844
- `12-multi-agent-mobile.png` - `/multi-agent`, 390x844
- `13-observability-mobile.png` - `/observability`, 390x844
- `capture-metrics.json` - DOM width, headings, button counts, small targets, overflow candidates.

Browser console check: no selected-tab warnings or errors were returned during the audit.

## Blunt Read

The project is substantially cleaner than the earlier pass, but it still reads too much like an AI-generated documentation catalog: same visual rhythm, same dark cards, same muted hierarchy, same spec-table endings, and too little route-specific product tension. The direction is right, but the product quality is not yet distinctive enough.

The strongest idea is not the Conversation page. The strongest idea is the combination of Templates, Observable Work, Approval/Decision Surfaces, Memory governance, and Run Monitoring. The current UI still gives conversation specimens too much oxygen and makes templates feel like a secondary directory.

## Severity 1 Findings

### 1. Templates are the product's highest-value surface, but the route looks like a card directory.

Evidence: `10-templates-desktop.png`

The Templates page should be the place where this stops feeling like a UI kit. Today the cards list names, short descriptions, and related primitives. That is useful, but visually generic. It does not communicate an end-to-end workflow, required states, failure points, or what an implementer gets from using the template.

Design/dev fix:
- Give every template card a compact flow preview, not just text.
- Show 3 to 5 state chips per template: input, agent work, human gate, result, failure/recovery.
- Add a visual mini-map for each workflow using real components: `ObservableWork`, `DecisionSurface`, `ReferenceItem`, `FileLifecycle`.
- Make Templates the default landing route or first major sidebar group after Demo.

### 2. The visual system is too homogeneous across fundamentally different agentic surfaces.

Evidence: `05-actions-desktop.png`, `06-trust-desktop.png`, `07-memory-desktop.png`, `08-multi-agent-desktop.png`, `09-observability-desktop.png`

Actions, Trust, Memory, Multi-Agent, and Observability all use the same restrained dark-card language. That creates consistency, but it also removes product meaning. A risky approval, a memory record, a live trace, and an agent identity card should not all feel like the same component with different copy.

Design/dev fix:
- Define route-specific visual accents that still use the same tokens: risk surfaces, provenance surfaces, live-operation surfaces, identity surfaces, workflow surfaces.
- Add real state contrast through layout, icon weight, border treatment, and status grouping rather than decorative color.
- Use fewer generic bordered cards and more purpose-built specimens with visible anatomy.

### 3. Mobile pages still feel like compressed desktop documentation.

Evidence: `03-conversation-mobile.png`, `04-conversation-composer-mobile.png`, `11-actions-mobile.png`, `12-multi-agent-mobile.png`, `13-observability-mobile.png`

The mobile header and composer are improved, but the overall mobile experience still stacks desktop documentation patterns. Controls, examples, and spec tables remain in the same order and often defer the useful part below the fold. Internal table overflow appears on mobile across Conversation, Actions, Multi-Agent, and Observability. Page-level scroll width stays correct, but the mobile first-read still becomes "inspect a wide table" too often.

Design/dev fix:
- Replace mobile spec tables with stacked definition rows or accordions.
- Put the demo before long explanatory prose on mobile when the pattern is interactive.
- Use mobile-specific section rhythm: shorter intros, tighter control bars, fewer nested frames.
- For composer suggestions, switch from equal-width buttons to a horizontally scrollable chip rail or a two-line max stack with no truncation.

### 4. Accessibility target size is still below a serious reference-guide bar.

Evidence: `capture-metrics.json`

The metrics repeatedly show 22px to 28px controls: sidebar toggle at 28px, feedback buttons at 22px, citation navigation at 24px, composer controls at 28px, memory edit/delete at 28px. The labels exist, which is good, but target size is still too small, especially on touch.

Design/dev fix:
- Standardize compact icon buttons to a minimum 32px desktop and 40px touch target.
- Keep visual glyphs small if needed, but increase hit area through padding or wrapper buttons.
- Separate read-only citation markers from true interactive controls so metric targets map to actual actions.

## Severity 2 Findings

### 5. Conversation still dominates the mental model.

Evidence: `01-conversation-desktop.png`, `03-conversation-mobile.png`

The page is polished, but it reinforces the thing the project is trying to move beyond: messages, prose, citations, composer. Those patterns matter, but they should be framed as one cluster inside agentic products, not the core identity of the guide.

Design/dev fix:
- Rename or restructure the route as "Dialogue Surfaces" or keep "Conversation" but move it below Workflow/Decision/Monitoring in navigation.
- Add cross-links from Conversation specimens to non-chat outcomes: approval, memory write, source trace, task handoff.
- Show fewer prose specimens and more "message creates product state" examples.

### 6. Actions do not feel consequential enough.

Evidence: `05-actions-desktop.png`, `11-actions-mobile.png`

The Tool Calls specimen is tidy but too neutral. Agent actions should communicate consequence: what object is touched, what changed, what permission is needed, whether it can be undone, and what evidence supports it. The current rows read as logs.

Design/dev fix:
- In Tool Calls, include affected object, scope, permission, reversibility, and result.
- In Approval Gate, make the action preview the hero specimen, not a later variant.
- Use `DecisionSurface` for action confirmation and rollback examples.

### 7. Trust settings look generic instead of policy-driven.

Evidence: `06-trust-desktop.png`

The Settings Templates section is clean, but switches alone do not explain consequence. Trust and governance patterns should show the policy result of a control, not only the control itself.

Design/dev fix:
- Add policy preview beside settings: "This agent can...", "Requires approval when...", "Never allowed..."
- Add "effective policy" summaries after grouped settings.
- Keep risky controls paired with confirmation, undo, or recovery state.

### 8. Memory needs provenance and lifecycle visible in the first specimen.

Evidence: `07-memory-desktop.png`

The memory panel has edit/delete actions, but the primary read is still a list. For memory, the crucial UX is not just the saved text. It is source, scope, last used, expiry, confidence, and how to correct it.

Design/dev fix:
- Promote provenance chips into each memory row.
- Add visible lifecycle state: proposed, saved, stale, edited, deleted.
- Add inline "why used" and "do not use in this context" affordances.

### 9. Multi-agent identity is not differentiated enough.

Evidence: `08-multi-agent-desktop.png`, `12-multi-agent-mobile.png`

The cards are legible but too same-y. Multi-agent systems need fast recognition of ownership, role, status, current handoff, and output responsibility. Current agent cards rely too much on small labels and repeated card shape.

Design/dev fix:
- Give each agent card a stronger identity header with role, owner, current responsibility, and last output.
- Use status badges and progress as primary scanning elements, not secondary metadata.
- Show handoff payloads as first-class objects, not just prose.

### 10. Observability needs a stronger incident/trace story.

Evidence: `09-observability-desktop.png`, `13-observability-mobile.png`

The timeline looks like a nice activity feed, but observability is about finding and resolving problems. The current view does not foreground filters, thresholds, warnings, drill-down, or trace linkage strongly enough.

Design/dev fix:
- Add an active anomaly or threshold example in the first viewport.
- Add trace IDs, linked source objects, and filter chips.
- Show "what changed" and "why this matters" per timeline item.

## Severity 3 Findings

### 11. Spec tables are overused as a page-ending pattern.

Evidence: all captured routes

The repeated pattern of specimen followed by table gives credibility, but it also makes the pages feel mechanically generated. It is too predictable and often weak on mobile.

Design/dev fix:
- Replace some tables with anatomy callouts, state matrices, failure-mode rows, and implementation checklists.
- Keep tables for exact specs only. Do not use them as the default explanation shape.

### 12. Page rhythm has too much identical vertical spacing.

Evidence: `01-conversation-desktop.png`, `05-actions-desktop.png`, `08-multi-agent-desktop.png`

The whitespace is tasteful, but repeated large gaps flatten the hierarchy. It makes each route feel like the same template with swapped content.

Design/dev fix:
- Tighten intro-to-demo spacing on mobile.
- Vary rhythm by route type: workflow pages should feel sequential, settings pages grouped, monitoring pages denser, reference pages more annotated.

### 13. The visual language needs more authored product artifacts.

Evidence: all captured routes

The app has many components, but few artifact-like visuals: no real workflow maps, no source previews, no mini traces, no state thumbnails, no before/after comparisons. Creative-production critique: the interface is controlled but visually under-authored.

Design/dev fix:
- Add compact workflow thumbnails to Templates.
- Add source cards and citation previews with document context.
- Add run-state diagrams and handoff payload previews.
- Use generated or designed bitmap/mock artifact previews only where they reveal the product state, not as decoration.

## Mobile-Specific Notes

- Conversation mobile: the first visible specimen is readable, but the serif agent message consumes too much vertical space and looks like a content card rather than a product UI state.
- Composer mobile: placeholder sizing is now acceptable, but suggestion chips truncate and still feel too padded for the available width.
- Actions mobile: tool-call rows fit, but the spec table below immediately breaks the mobile polish.
- Multi-agent mobile: agent cards stack cleanly, but identity differences are weak and the operational table is not mobile-native.
- Observability mobile: the feed reads better than the tables, but the live state needs clearer severity, filtering, and drill-down.

## Highest-Impact Implementation Backlog

1. Make Templates the flagship: add mini-flow previews, states, failure/recovery, and pattern-piece composition.
2. Replace mobile spec tables with stacked rows/accordions across Conversation, Actions, Multi-Agent, and Observability.
3. Create route-specific specimen grammars: decision/risk, memory/provenance, trace/incident, identity/handoff, workflow/template.
4. Raise touch target hit areas for icon-only controls while preserving compact visuals.
5. Rework Actions around consequence and reversibility, not just tool-call status.
6. Rework Trust around effective policy summaries and recovery states.
7. Rework Memory around provenance, scope, expiry, and correction lifecycle.
8. Add a stronger citation/source preview pattern inspired by the supplied reference image: anchored citation marker, preview popover, source title, page/location, previous/next, and source action.
9. Reduce repeated vertical rhythm and generic bordered-card repetition.
10. Promote cross-route product stories: message -> source trace -> action -> approval -> memory update -> observable run.

## Verification Limits

This was a visual and DOM-metric audit from fresh Browser captures. It was not a full keyboard screen-reader test, performance trace, or code-level component audit. Browser console returned no selected-tab warnings or errors during the audit.
