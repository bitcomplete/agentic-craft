# Visual Slop Audit — components below the polish bar

Date: 2026-06-09
Method: fresh section-state captures of all 10 pages (155 screenshots,
1440px light), reviewed against a taste rubric by three independent passes
plus manual verification of every headline claim; copy swept for
generated-text artifacts.

**The bar:** the Observable Work redesign (status as a shape-distinct icon in
the top-right corner — check / spinner / dashed circle — instead of a text
badge glued to the title). Everything below is measured against it.

## Systemic patterns (the slop, classified)

### S1 — The status-badge-glued-to-title pattern survives in ~12 places

The exact pattern just eliminated in Observable Work is still alive in:

| Where                                                   | Badge                                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Progress Steps collapsed header (`/conversation`)       | "Active" next to title + floating "2 done / 1 active / 1 waiting" pill far right                                                                       |
| Subagent Orchestration header (`/actions`)              | "Complete" text badge (while the running state uses a pulse dot + count — two languages for one concept)                                               |
| Run Trace rows (`/observability`, run-monitor template) | "Complete" / "Warning" / "Running" pills after titles                                                                                                  |
| Activity feed rows (`/observability`)                   | "Tool call" / "Message" chips after every timestamp, redundant with the per-row icons                                                                  |
| Agent Status Table status column (3 pages)              | "Working" / "Complete" / "Idle" / "Blocked" text pills, mixed fill weights                                                                             |
| Handoff Packet (`/multi-agent`, `/templates`)           | "Draft" pill glued to title                                                                                                                            |
| Memory Review section (`/templates`)                    | "Proposed" pill inline                                                                                                                                 |
| Feedback History rows (`/feedback`)                     | "positive" / "negative" / "correction" pills after timestamps                                                                                          |
| Confidence Display (`/trust`)                           | "High confidence" text pill floating above prose — the spec table beneath documents a colored-dot indicator that is never rendered                     |
| Artifact Document rows (`/sources`)                     | freestanding "Cited" / "Needs source" pills below row labels                                                                                           |
| Composer attachments (`/conversation`)                  | "Ready" / "68%" / "Duplicate source Retry" as plain inline text at filename weight                                                                     |
| Effective Policy rows (`/trust`)                        | far-right floated "Review" / "Required" / "Allowed" / "Blocked" badges — and "Blocked" is the only red-filled badge in an otherwise outline-only table |

Direction: one status vocabulary, applied everywhere — the Observable Work
icon set (check / spinner / dashed circle / clock / alert), corner-anchored.
Tables use the icon in the status cell; rows use the top-right corner.

### S2 — Three status languages on one screen

`/observability` Activity Timeline is the epicenter: the live feed uses muted
chips, the RUN STATE table uses outline/solid pills (solid "Complete", outline
"Working"), and the run trace below uses a third, smaller badge style — the
same semantic concept drawn three ways within one viewport. The agent-cards
section on `/multi-agent` repeats this (prose-only status in cards, pill
status in the table directly below).

### S3 — Redundant state encoding

- Review Workflow steps (our own redesign): icon says spinner, meta line
  still says "running" / "completed" / "pending" — the text should go.
- Run trace rows: badge "Running" + meta "now / running".
- Kill Switch idle: title says idle, but the Stop button renders at the same
  weight as the running state's — contradicting the component's own spec
  table ("subtle border / low prominence" for idle).
- Mode Toggles: an in-card "Switch mode" button group duplicates the
  section's CONTROLS tabs — two authoritative-looking controls for one state.

### S4 — Floating, bolted-on elements

- "4 events" count pill detached in the run-trace header.
- "2 done / 1 active / 1 waiting" pill at the far right of the Progress
  Steps collapsed row.
- "UI: Approval modal" pill orphaned below the Autonomy Level columns — a
  badge whose content is itself a label:value pair.
- "Locked payload" chip floating in the Approval Gate header.
- Source list "Page 14 ⤢" — page number and expand icon share a position,
  detached from the title they annotate.
- Data Provenance "Primary" / "Guidance" / "Reference" pills pinned to the
  right wall, full row-width away from the document names.

### S5 — Walls of sameness

- Memory Panel: six cards in identical triple-metadata lockstep (scope badge
  - timestamp + expiry) with identical action rows; nothing differentiates a
    workspace memory from a project one but the badge text.
- Decision Flow: three options with different severities rendered as
  visually identical rows — the highest-stakes pattern in the system reads
  like a settings menu.
- Registry tables: an identical "ui" pill on all 18 primitive rows (and
  "block" on all block rows) — the section header already declares the type;
  the column is pure noise. The "Use" column also ellipsizes every
  description, losing the actual content.
- Agent cards idle state: three different agents all say "Awaiting
  instructions" verbatim.
- Mode Toggles "Available tools": four identical bordered cells —
  borders-in-borders with no hierarchy payoff.

### S6 — Label:value form dumps

- Approval Gate detail: six raw label/value pairs in uneven columns —
  reads as a database record, not a review surface. The consequential pair
  (Consequence + Rollback) deserves promoted treatment.
- Handoff Packet: Payload / Source basis / Receiver action / Recovery as
  four full-width micro-label rows.
- Plan Cards: steps carry both a bullet dot AND a number ("● 1. Load
  project brief") while the spec table beneath says the indicator is "not a
  checkbox or number"; completed steps use strikethrough, which reads as
  _cancelled_, not _done_.

### S7 — Copy slop (literal generated-text artifacts)

- "send **an project** finding summary" (`trust-content.tsx:1102`)
- "within **an review** session" (`observability-content.tsx:736`)
- "flags **an requirement** gap" (`multi-agent-content.tsx:1158`)
- "**an review team sessioner**" — not a word (`trust-content.tsx:2183`)
- "the **activity log audit log** surface" — duplicated phrase
  (`observability-content.tsx:552`)
- Unexpanded "**CC**" abbreviation in four explainers ("requirement in CC",
  "critical for CC", "CC workflows", "CC reviews") — reads as a scrubbed
  template variable (`trust-content.tsx:2181`, `memory-content.tsx:929`,
  `multi-agent-content.tsx:959`, `feedback-content.tsx:1110`)

### S8 — Truncation losing real content

- Registry "Use" column ellipsizes every description at 1440px.
- Agent Status Table clips its Cost column ("Co…", "$0.…") inside the
  860px content column on every page it appears.

## Priority order (worst first)

1. **Observability Activity Timeline** — three status languages, chip walls,
   clipped cost column, floating count pill, plus two copy artifacts. One
   page, most of the slop taxonomy.
2. **Progress Steps collapsed header** — the most-viewed demo still wearing
   the deprecated badge + a floating count pill.
3. **Agent Status Table** (3 pages) — pill statuses with inconsistent
   weights; convert to the icon vocabulary; fix the Cost clip.
4. **Memory Panel cards** — metadata lockstep; collapse timestamp/expiry to
   one muted line, keep scope as the only badge.
5. **Confidence Display** — render the documented dot taxonomy; drop the
   text pill.
6. **Effective Policy rows** — leading status glyphs instead of right-floated
   mixed-weight badges; reserve red for destructive states.
7. **Subagent header + Run Trace + Handoff + Feedback History + Memory
   Review badges** — mechanical applications of the S1 vocabulary.
8. **Decision Flow rows** — severity accent + subordinate consequence
   treatment.
9. **Approval Gate + Handoff Packet field dumps** — compose the grids;
   promote the consequential fields; anchor the floating chips.
10. **Registry tables** — drop the type-pill column, let descriptions wrap.
11. **Copy sweep** — the eight S7 artifacts (one-line fixes).
12. **Small set**: "UI:" pill (Autonomy), kill-switch idle weight, mode-toggle
    duplicate controls, plan-card numbering/strikethrough, attachment status
    treatment, source-list page anchoring, idle-card copy, our own
    review-workflow meta redundancy.

## Components that already clear the bar

Tool Calls, Citations/Source Preview, Clarifying Questions, Audit Trail,
Rating Scale, Consent Flow, Inline Correction, Behavioral Consequence,
Context Ring, Session Timeline, Error Log (functional, though its empty
state is the generic centered-icon template), Usage Meter (minor grouping
nit), and the post-redesign Observable Work (minus the S3 meta text).
