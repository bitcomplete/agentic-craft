export type TemplateSlug =
  | "review-workflow"
  | "approval-workflow"
  | "clarifying-workflow"
  | "source-backed-artifact"
  | "memory-review"
  | "run-monitor"
  | "multi-agent-handoff"
  | "agent-settings"

export type TemplateDetail = {
  slug: TemplateSlug
  title: string
  eyebrow: string
  summary: string
  whenToUse: string
  humanControl: string
  failureMode: string
  recovery: string
  pieces: string[]
  states: Array<{
    state: string
    userSees: string
    systemDoes: string
  }>
}

export const templateDetails: TemplateDetail[] = [
  {
    slug: "review-workflow",
    title: "Review Workflow",
    eyebrow: "Template",
    summary:
      "Collect evidence, inspect gaps, ask focused follow-ups, and produce a reviewable result.",
    whenToUse:
      "Use when an agent reviews source material and the user must trust, cite, or approve the result.",
    humanControl:
      "Users choose source scope, answer unresolved questions, and approve the final summary before distribution.",
    failureMode:
      "Sources conflict, required scope is missing, or the agent cannot verify a claim.",
    recovery:
      "Keep the draft blocked, show unresolved sources, and ask targeted clarifying questions.",
    pieces: [
      "Observable Work",
      "Reference Item",
      "Clarifying Questions",
      "Action Preview",
      "Decision Surface",
    ],
    states: [
      {
        state: "Collecting",
        userSees: "Sources being touched and current collection progress.",
        systemDoes: "Reads only selected or permitted project artifacts.",
      },
      {
        state: "Blocked",
        userSees: "Missing assumptions and the exact answer needed.",
        systemDoes: "Pauses synthesis until the required decision is supplied.",
      },
      {
        state: "Ready",
        userSees: "Cited findings, confidence, and approval action.",
        systemDoes: "Prepares the result without sending it automatically.",
      },
    ],
  },
  {
    slug: "approval-workflow",
    title: "Approval Workflow",
    eyebrow: "Template",
    summary:
      "Pause before irreversible, external, costly, or permissioned actions.",
    whenToUse:
      "Use when an agent sends, publishes, spends, modifies records, or changes external state.",
    humanControl:
      "Users see impact, affected objects, cost, provenance, and rollback before approving.",
    failureMode:
      "The action scope changes after preview, rollback is unavailable, or permission is insufficient.",
    recovery:
      "Invalidate the approval, refresh the preview, and require a new confirmation.",
    pieces: ["Observable Work", "Action Preview", "Decision Surface", "Badge"],
    states: [
      {
        state: "Preview",
        userSees: "Action summary, affected objects, and reversibility.",
        systemDoes: "Locks the preview payload used for approval.",
      },
      {
        state: "Approved",
        userSees: "Committed action with audit trail.",
        systemDoes: "Executes the exact approved payload.",
      },
      {
        state: "Revoked",
        userSees: "Approval expired or changed.",
        systemDoes: "Requires a fresh review before execution.",
      },
    ],
  },
  {
    slug: "clarifying-workflow",
    title: "Clarifying Workflow",
    eyebrow: "Template",
    summary:
      "Ask only for missing information using structured fields and visible defaults.",
    whenToUse:
      "Use when proceeding would force the agent to invent a requirement or policy decision.",
    humanControl:
      "Users can answer, skip, or keep defaults visible while the agent remains blocked.",
    failureMode:
      "Too many open questions, vague answer requirements, or chatty follow-up loops.",
    recovery:
      "Batch questions by decision type and preserve defaults for unanswered items.",
    pieces: [
      "Clarifying Questions",
      "Observable Work",
      "Field",
      "Input Group",
      "Toggle Group",
    ],
    states: [
      {
        state: "Needed",
        userSees: "The smallest answer set required to continue.",
        systemDoes: "Keeps dependent work blocked.",
      },
      {
        state: "Answered",
        userSees: "Selected answers and any defaults used.",
        systemDoes: "Resumes work with explicit constraints.",
      },
      {
        state: "Skipped",
        userSees: "What assumption will be used instead.",
        systemDoes: "Continues only if the fallback is safe.",
      },
    ],
  },
  {
    slug: "source-backed-artifact",
    title: "Source-Backed Artifact",
    eyebrow: "Template",
    summary:
      "Turn an agent answer into a cited output document with source preview, missing-source state, and usage budget.",
    whenToUse:
      "Use when the agent produces a durable answer, report, summary, document, or file that users need to inspect after the conversation.",
    humanControl:
      "Users can inspect sources, see uncited sections, review usage, and decide whether the artifact is ready to share.",
    failureMode:
      "The output mixes cited and uncited claims, hides missing sources, or separates cost from the generated artifact.",
    recovery:
      "Keep the artifact in review, mark sections that need source material, and ask for scope clarification before publishing.",
    pieces: ["Artifact Document", "Source Preview", "Usage Meter"],
    states: [
      {
        state: "Draft",
        userSees:
          "Document sections, linked sources, uncited gaps, and current budget.",
        systemDoes: "Keeps the output local and editable.",
      },
      {
        state: "Needs source",
        userSees: "The exact section that cannot be verified.",
        systemDoes:
          "Blocks sharing until a source or human override is supplied.",
      },
      {
        state: "Ready",
        userSees:
          "Cited sections, source list, version, owner, and final usage.",
        systemDoes: "Prepares the artifact for approval or export.",
      },
    ],
  },
  {
    slug: "memory-review",
    title: "Memory Review",
    eyebrow: "Template",
    summary: "Review proposed durable context before it is saved or reused.",
    whenToUse:
      "Use when an agent wants to remember preferences, facts, project constraints, or user corrections.",
    humanControl:
      "Users can edit, scope, expire, save, or reject each proposed memory.",
    failureMode:
      "A memory lacks source provenance, scope, expiry, or user consent.",
    recovery:
      "Keep the memory proposed, not saved, until provenance and scope are clear.",
    pieces: [
      "Memory Ledger Item",
      "Source Preview",
      "Reference Item",
      "Decision Surface",
    ],
    states: [
      {
        state: "Proposed",
        userSees: "Memory text, source, scope, and expiry.",
        systemDoes: "Stores the item in a review queue.",
      },
      {
        state: "Saved",
        userSees: "Where it applies and when it was last used.",
        systemDoes: "Makes it available to future matching tasks.",
      },
      {
        state: "Removed",
        userSees: "Removal confirmation and affected scope.",
        systemDoes: "Stops using the durable context.",
      },
    ],
  },
  {
    slug: "run-monitor",
    title: "Background Run Monitor",
    eyebrow: "Template",
    summary:
      "Track background work after the user leaves the composer or page.",
    whenToUse:
      "Use for long-running jobs, scheduled work, review tasks, and multi-source scans.",
    humanControl:
      "Users can inspect progress, cost, confidence, blockers, and cancellation points.",
    failureMode:
      "The run stalls silently, exceeds budget, or hides which source caused the block.",
    recovery:
      "Expose blocked state, partial output, retry action, and cancellation affordance.",
    pieces: ["Run Trace", "Usage Meter", "Agent Status Table", "Badge"],
    states: [
      {
        state: "Running",
        userSees: "Progress, cost, confidence, and current task.",
        systemDoes: "Updates status without shifting layout.",
      },
      {
        state: "Blocked",
        userSees: "The missing input and affected agent.",
        systemDoes: "Stops spending on blocked downstream tasks.",
      },
      {
        state: "Complete",
        userSees: "Final output, audit trail, and cost.",
        systemDoes: "Archives intermediate work behind a useful summary.",
      },
    ],
  },
  {
    slug: "multi-agent-handoff",
    title: "Multi-Agent Handoff",
    eyebrow: "Template",
    summary:
      "Show ownership transfer between agents with payload, status, and next action.",
    whenToUse:
      "Use when work moves from one specialist agent to another or parallel agents converge.",
    humanControl:
      "Users can see sender, receiver, carried context, omitted context, and current owner.",
    failureMode:
      "The receiving agent lacks context, duplicates work, or users cannot tell who owns the task.",
    recovery:
      "Keep the handoff packet inspectable and require acceptance before downstream work starts.",
    pieces: ["Handoff Packet", "Run Trace", "Agent Status Table"],
    states: [
      {
        state: "Prepared",
        userSees: "Sender, receiver, payload, and omitted context.",
        systemDoes: "Bundles context into a handoff packet.",
      },
      {
        state: "Accepted",
        userSees: "New owner and current task.",
        systemDoes: "Transfers execution state.",
      },
      {
        state: "Rejected",
        userSees: "Reason and missing context.",
        systemDoes: "Returns work to the sender or asks for input.",
      },
    ],
  },
  {
    slug: "agent-settings",
    title: "Agent Settings",
    eyebrow: "Template",
    summary:
      "Durable controls for autonomy, approvals, notifications, and memory boundaries.",
    whenToUse:
      "Use when behavior should persist across sessions instead of relying on one-off prompts.",
    humanControl:
      "Users or admins set the boundaries once and review risky changes.",
    failureMode:
      "Settings are hidden, labels are not clickable, or dangerous toggles apply instantly.",
    recovery:
      "Use confirmation, undo, and audit trail for risky setting changes.",
    pieces: ["Field", "Switch", "Effective Policy Preview"],
    states: [
      {
        state: "Default",
        userSees: "Recommended policy and why it exists.",
        systemDoes: "Applies safe defaults.",
      },
      {
        state: "Changed",
        userSees: "New policy, scope, and affected actions.",
        systemDoes: "Records the setting change.",
      },
      {
        state: "Risky",
        userSees: "Confirmation with impact and rollback.",
        systemDoes: "Waits for explicit confirmation.",
      },
    ],
  },
]

export function getTemplateDetail(slug: string) {
  return templateDetails.find((template) => template.slug === slug)
}
