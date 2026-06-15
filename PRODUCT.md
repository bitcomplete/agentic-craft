# Product

## Register

product

## Users

Designers and design engineers building agentic products — people deciding how
an agent should ask for approval, show its work, hand off to another agent, or
expose a kill switch. They arrive mid-decision ("how should clarifying
questions behave?"), read the pattern, poke the interactive demo, and either
copy the idea or `shadcn add` the component. A second, growing audience is AI
coding agents themselves: CLAUDE.md, the registry payloads, and the spec
tables are written to be consumed by tools as much as by people.

## Product Purpose

Agentic Craft is a reference guide for designing agentic product interfaces
beyond chat, paired with a shadcn-compatible registry so the guidance is
installable, not just readable. It exists because agent UX is being invented
right now, mostly badly — visible work, locked consequence previews, autonomy
governance, and provenance deserve patterns, not improvisation. Success looks
like: a team ships a better approval flow because the pattern page settled the
argument, and the component they installed already behaved correctly.

## Brand Personality

Quiet, precise, trustworthy. The voice of a senior design engineer's internal
documentation — opinionated in content, restrained in presentation. Monochrome
line icons, serif agent prose, real state in every demo. Credibility comes
from craft and correctness, never from decoration. If a page gets attention,
it should be because the pattern is right, not because the page is loud.

## Anti-references

- **AI-demo chrome** (the confirmed primary anti-reference): glowing
  gradients, sparkle icons, chat-bubble theater, spinners on tool calls,
  oversized rounded everything — the default look of 2025 AI startups. The
  site teaches agent UX; looking like an AI demo would forfeit the argument.
- Repo-codified bans that operationalize this (enforced by
  `scripts/audit-ui.mjs` and documented in `AGENTS.md`): no pill shapes, no
  success/failure icons on tool calls, monochrome icons only, no injected
  style tags, no clickable divs, no raw status colors outside tokens.
- The fabricated-demo tell: round numbers, identical timestamps, "ACME"
  placeholders. Demo data must read like real telemetry (this is audited).

## Design Principles

1. **Practice what you preach.** Every demo is a teaching artifact; the site
   must exemplify the interaction quality it documents. A dead button or a
   dishonest affordance on a pattern page is a content error, not a bug.
2. **Show, don't tell.** One interactive specimen with real state beats five
   screenshots. Prose explains rationale; the demo carries the behavior.
3. **Earn every element.** Spec tables only where they encode non-visible
   contract; callouts only where they state a rule the demo can't show.
   Decoration that doesn't inform gets deleted.
4. **Trust through visible work.** The site's own ethos applied to itself:
   show state, show provenance, make consequences legible before commitment.
5. **The registry is the contract.** Anything shipped via `shadcn add` is
   product surface for other people's products — correctness, a11y, and
   sync discipline (src ↔ registry ↔ public/r) outrank site concerns.

## Accessibility & Inclusion

WCAG 2.1 AA, enforced not aspirational: ≥4.5:1 body-text contrast (informational
and interactive muted text uses plain `text-muted-foreground`; opacity reduction
is reserved for decorative, `aria-hidden`, or disabled elements only), visible focus rings on every
interactive element (house ring: `focus-visible:ring-3 ring-ring/50`),
`prefers-reduced-motion` alternatives for all animation, keyboard paths and
focus management on state changes (outcomes receive focus), live regions for
async results, 44px touch targets on coarse pointers. Pattern demos double as
a11y references — they are expected to demonstrate the correct semantics for
the pattern they teach.
