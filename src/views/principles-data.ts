export type PrincipleLink = {
  label: string
  href: string
  note: string
}

export type Principle = {
  id: string
  navTitle: string
  title: string
  statement: string
  elaboration: string
  citation: string
  links: PrincipleLink[]
}

export const principles: Principle[] = [
  {
    id: "progressive-disclosure",
    navTitle: "Progressive Disclosure",
    title: "Progressive disclosure",
    statement: "Progressive disclosure beats both extremes.",
    elaboration:
      "Users need enough visibility to trust the agent, but a full trace in the primary path turns useful work into sludge. Keep routine work collapsed, make expansion obvious, and reserve full traces for surfaces where inspection is the job.",
    citation: "(Cloudscape Thinking; LukeW Feb 2026; §3.)",
    links: [
      {
        label: "Progress steps",
        href: "/conversation#progress-steps",
        note: "Collapsed work summaries with optional detail.",
      },
      {
        label: "Parallel execution",
        href: "/actions#parallel",
        note: "Task trees that expose structure without flooding the thread.",
      },
      {
        label: "Autonomy contract",
        href: "/patterns/autonomy-contract#autonomy-contract",
        note: "A pattern card that changes visibility by autonomy level.",
      },
    ],
  },
  {
    id: "control-signal",
    navTitle: "Control Signal",
    title: "Control as trust",
    statement: "Control is a trust signal.",
    elaboration:
      "Pause, override, deny, and kill controls are not secondary safety chrome. They tell the user the system remains accountable to them even when the agent is doing the work.",
    citation: "(HAX G9, G17; §4, §11.13.)",
    links: [
      {
        label: "Kill switch",
        href: "/trust#kill-switch",
        note: "Visible stop control for work that can still be interrupted.",
      },
      {
        label: "Approval workflow",
        href: "/templates#approval-workflow",
        note: "A composed flow where the user keeps final authority.",
      },
      {
        label: "Autonomy contract",
        href: "/patterns/autonomy-contract#why-it-matters",
        note: "The user role changes as the contract changes.",
      },
    ],
  },
  {
    id: "risk-tier-gates",
    navTitle: "Risk-Tier Gates",
    title: "Risk-tiered gates",
    statement: "Risk-tier the gates.",
    elaboration:
      "Uniform confirmation makes agents feel slow and untrustworthy because every action receives the same ceremony. Low-risk work can proceed inside policy, medium-risk work needs a preview, and high-risk work needs explicit confirmation or a hard block.",
    citation: "(Yocco; §3.2, §11.12.)",
    links: [
      {
        label: "Approval gate",
        href: "/actions#approval-gate",
        note: "A gate for consequential actions, not every action.",
      },
      {
        label: "Decision blocks",
        href: "/actions#decisions",
        note: "Structured choices when the agent needs a human decision.",
      },
      {
        label: "Autonomy contract",
        href: "/patterns/autonomy-contract#principles-defended",
        note: "Policy rows that separate allowed, blocked, and review states.",
      },
    ],
  },
  {
    id: "locked-previews",
    navTitle: "Locked Previews",
    title: "Locked previews",
    statement: "Locked previews come before any consequential action.",
    elaboration:
      "The preview is the contract: recipient, payload, scope, source set, cost, consequence, and rollback must be inspectable before approval. A generic confirm dialog asks for trust; a locked preview earns it.",
    citation: "(§3.2.)",
    links: [
      {
        label: "Approval gate",
        href: "/actions#approval-gate",
        note: "Shows the exact action before it can be approved.",
      },
      {
        label: "Approval workflow",
        href: "/templates#approval-workflow",
        note: "Invalidates approval when the payload changes.",
      },
      {
        label: "Autonomy contract",
        href: "/patterns/autonomy-contract#autonomy-contract",
        note: "Demonstrates preview, locked, and approved states.",
      },
    ],
  },
  {
    id: "provenance",
    navTitle: "Provenance",
    title: "Universal provenance",
    statement: "Provenance is universal.",
    elaboration:
      "Every claim, output, and action should point back to the evidence that produced it. A smaller answer with traceable sources is more useful than a confident answer the user cannot inspect.",
    citation: "(§5.)",
    links: [
      {
        label: "Citations",
        href: "/conversation#citations",
        note: "Inline claims with source previews.",
      },
      {
        label: "Source companion",
        href: "/sources#source-list",
        note: "A persistent source surface beside the output.",
      },
      {
        label: "Source-backed artifact",
        href: "/templates#source-backed-artifact",
        note: "Durable output that keeps source gaps visible.",
      },
    ],
  },
  {
    id: "memory-ledger",
    navTitle: "Memory Ledger",
    title: "Memory as ledger",
    statement: "Memory is a ledger.",
    elaboration:
      "Durable context must be visible, reviewable, editable, and deletable entry by entry. Invisible persistence breaks trust because the user cannot tell what the agent will carry forward.",
    citation: "(§6.)",
    links: [
      {
        label: "Memory panel",
        href: "/memory#memory-panel",
        note: "Visible entries with source and scope.",
      },
      {
        label: "Memory entry CRUD",
        href: "/memory#memory-crud",
        note: "Edit and delete controls at the entry level.",
      },
      {
        label: "Memory review",
        href: "/templates#memory-review",
        note: "A composed flow for proposed durable context.",
      },
    ],
  },
  {
    id: "blank-canvas",
    navTitle: "Blank Canvas",
    title: "Blank-canvas support",
    statement: "The blank-canvas problem is always present.",
    elaboration:
      "Agentic products ask users to delegate ambiguous work, so empty states need more than a text box. Suggestions, templates, starters, defaults, and structured questions give the user a usable first move.",
    citation: "(Shape of AI; §2.1, §7.)",
    links: [
      {
        label: "Clarifying workflow",
        href: "/templates#clarifying-workflow",
        note: "Structured questions when the agent lacks a decision.",
      },
      {
        label: "Clarifying questions",
        href: "/actions#ask-blocks",
        note: "Small answer sets instead of open-ended chat loops.",
      },
      {
        label: "Review workflow",
        href: "/templates#review-workflow",
        note: "A ready starting shape for evidence review.",
      },
    ],
  },
  {
    id: "diagnostic-errors",
    navTitle: "Diagnostic Errors",
    title: "Diagnostic errors",
    statement: "Errors are diagnostic opportunities.",
    elaboration:
      "A useful failure names what failed, why it failed, what the system is doing next, and what the user can do. Generic error copy turns recoverable uncertainty into dead-end uncertainty.",
    citation: "(HAX G10; §11.8.)",
    links: [
      {
        label: "Error log",
        href: "/observability#error-log",
        note: "Failure rows with cause, owner, and recovery.",
      },
      {
        label: "Inline correction",
        href: "/feedback#inline-correction",
        note: "User repair at the point of failure.",
      },
      {
        label: "Feedback history",
        href: "/feedback#feedback-history",
        note: "How corrections become accountable product behavior.",
      },
    ],
  },
  {
    id: "visible-cost",
    navTitle: "Visible Cost",
    title: "Visible cost",
    statement: "Cost should never be invisible.",
    elaboration:
      "Long-running agent work spends time, tokens, money, and attention. Show budgets where the action happens so the user can decide whether the work is still worth it.",
    citation: '(Shape of AI "Cost Estimates"; §4.2, §7.4, §12.5.)',
    links: [
      {
        label: "Cost transparency",
        href: "/trust#cost-transparency",
        note: "Cost and time as part of the trust surface.",
      },
      {
        label: "Token usage",
        href: "/observability#token-usage",
        note: "Usage made visible during ongoing work.",
      },
      {
        label: "Source-backed artifact",
        href: "/templates#source-backed-artifact",
        note: "Budget shown beside the generated artifact.",
      },
    ],
  },
  {
    id: "relationship",
    navTitle: "Relationship",
    title: "Relationship over screen",
    statement: "Design the relationship, not the screen.",
    elaboration:
      "Agentic experience accumulates over time through control, memory, provenance, corrections, and audit trails. The interface should make that relationship inspectable instead of treating each task as a disconnected turn.",
    citation: "(NN/g service design; §1.)",
    links: [
      {
        label: "Audit trail",
        href: "/trust#audit-trail",
        note: "Durable proof of what happened and why.",
      },
      {
        label: "Memory review",
        href: "/templates#memory-review",
        note: "Relationship state that the user can approve or reject.",
      },
      {
        label: "Multi-agent handoff",
        href: "/templates#multi-agent-handoff",
        note: "Continuity when work moves between agents.",
      },
    ],
  },
]
