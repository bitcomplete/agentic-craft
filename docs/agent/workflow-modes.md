# Hermes workflow modes for Agentic Craft

Use these modes to work beyond the one-task-at-a-time "Claude Code style" when it makes sense.

The goal is not to replace focused coding. The goal is to give you more operating modes when architecture, pattern discovery, comparison, or review benefit from them.

## 1. Feature Framing Sprint

Use when:
- a feature idea is still fuzzy
- you need a repo-grounded architecture brief before implementation
- you want structure, constraints, and tradeoffs rather than immediate coding

Combine:
- file/code inspection
- web research
- browser inspection
- memory
- delegation if useful

Expected output:
- current state
- problem framing
- constraints and invariants
- 2-3 viable directions
- recommendation
- open questions

Autonomy level:
- medium
- high for analysis, low for implementation

## 2. Pattern Harvest

Use when:
- you want to study how a specific agentic interaction pattern appears in the wild
- you want to convert references into implementation-ready observations
- you are working at the boundary of visual design and UI architecture

Combine:
- browser
- vision
- web research
- shadcn-studio-mcp
- uidotsh

Expected output:
- structured pattern inventory
- what works / what fails
- reusable interaction primitives
- implementation notes for this repo

Autonomy level:
- medium-high

## 3. Option Lab

Use when:
- there is real design or architecture uncertainty
- you want multiple directions explored in parallel
- you do not want to serialize the thinking into one linear thread

Combine:
- delegation
- repo inspection
- browser/web research
- synthesis

Expected output:
- multiple concrete options
- decision matrix
- recommendation
- smallest experiment to reduce uncertainty

Autonomy level:
- high for exploration, low for choosing irreversible paths

## 4. Design-to-Code Loop

Use when:
- the direction is chosen and you want iterative implementation with continuous verification
- you want the browser and visual QA in the loop, not just code edits

Combine:
- file editing
- terminal checks
- browser
- vision
- shadcn-studio-mcp and uidotsh where useful

Expected output:
- incremental implementation
- verification checkpoints
- visual QA notes
- follow-up issues

Autonomy level:
- medium
- ask before destructive or externally visible changes

## 5. Review Gate

Use when:
- before merge
- before demoing work
- before considering a pattern page or flow "done"

Combine:
- repo review
- browser
- vision
- relevant checks
- trust/provenance mindset

Expected output:
- pass/fail scorecard
- blockers
- polish issues
- smallest fix sequence

Autonomy level:
- low for edits, high for inspection

## 6. Background Radar

Use when:
- you want Hermes working between sessions
- you want lightweight ongoing sensing instead of starting from zero every time
- you have specific references, libraries, or ecosystem changes worth tracking

Combine:
- cronjob
- web research
- browser
- repo scanning
- memory used carefully

Expected output:
- digest of new signals
- why they matter
- suggested next actions

Autonomy level:
- high for collection, low for acting

## Recommended weekly cadence

A good default sequence is:
1. Feature Framing Sprint
2. Pattern Harvest
3. Option Lab only if uncertainty remains high
4. Design-to-Code Loop
5. Review Gate
6. Background Radar only after you know what is worth monitoring

## Grounding rules

Always ground in this order:
1. code
2. `INTERACTIVE_SPEC.md`
3. `docs/agent/README.md`
4. historical docs only if needed

## Memory rules

Store durable preferences and working principles, not session scratch.

Good memory candidates:
- preferred interaction density
- architecture preferences
- default critique lenses
- recurring implementation rules

Bad memory candidates:
- temporary TODOs
- session notes
- speculative ideas that are not yet stable

## Trace style

Prefer concise human-readable progress updates over noisy logs.

Good:
- "inspected current composer structure"
- "compared 3 reference patterns"
- "found 2 constraints in existing tool-call composition"

Bad:
- dumping raw command transcripts unless they are directly needed
