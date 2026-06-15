import type { EffectivePolicy } from "@/components/ui/effective-policy-preview"

type AutonomyLevelId =
  | "suggest"
  | "recommend"
  | "execute-confirm"
  | "execute"
  | "initiate"

type AutonomyLevel = {
  id: AutonomyLevelId
  label: string
  contract: string
  userRole: string
  statusLabel: string
  actionTitle: string
  actionDescription: string
  previewStatus: "preview" | "locked" | "approved"
  primaryAction: string
  secondaryActions: string[]
  agentMay: string[]
  agentMust: string[]
  notAllowed: string[]
  visibleAffordances: string[]
  consequence: string
  rollback: string
  policies: EffectivePolicy[]
}

const AUTONOMY_LEVELS: AutonomyLevel[] = [
  {
    id: "suggest",
    label: "Suggest",
    contract:
      "The agent can draft a next step and explain why, but execution belongs to the user.",
    userRole: "User owns every action",
    statusLabel: "Suggestion only",
    actionTitle: "Draft launch follow-up",
    actionDescription:
      "The agent proposes a response to the release owner after reading the launch checklist and current risk log.",
    previewStatus: "preview",
    primaryAction: "Copy draft",
    secondaryActions: ["Ask for another angle"],
    agentMay: [
      "Draft a follow-up message",
      "Name the source evidence",
      "Estimate the cost and time",
    ],
    agentMust: [
      "Label the work as a suggestion",
      "Keep send and edit controls unavailable",
      "Show the user what would be affected",
    ],
    notAllowed: [
      "Send messages",
      "Edit project records",
      "Schedule follow-ups",
    ],
    visibleAffordances: [
      "Primary command copies the draft",
      "No confirmation surface appears",
      "Policy rows mark execution as blocked",
    ],
    consequence:
      "No external side effect. The user can paste, edit, or ignore the draft.",
    rollback: "Delete the copied text or ask for a new suggestion.",
    policies: [
      {
        label: "Execution",
        value: "Blocked for all action classes",
        description: "The agent can prepare language, not perform the work.",
        status: "blocked",
      },
      {
        label: "Confirmation",
        value: "Not requested",
        description: "There is nothing to approve because no action is armed.",
        status: "review",
      },
      {
        label: "Initiation",
        value: "User starts every run",
        description: "The agent never begins follow-up work in the background.",
        status: "blocked",
      },
    ],
  },
  {
    id: "recommend",
    label: "Recommend",
    contract:
      "The agent can choose a preferred next step and rank alternatives, but the user still initiates execution.",
    userRole: "User chooses the plan",
    statusLabel: "Recommendation",
    actionTitle: "Recommend the next release action",
    actionDescription:
      "The agent recommends sending a short blocker summary to the release owner because two checklist items are stale.",
    previewStatus: "preview",
    primaryAction: "Accept recommendation",
    secondaryActions: ["Compare alternatives", "Dismiss"],
    agentMay: [
      "Rank the best next step",
      "Bundle evidence into a ready plan",
      "Stage a message for user review",
    ],
    agentMust: [
      "Expose the rationale",
      "Show the alternatives it rejected",
      "Wait for the user to start execution",
    ],
    notAllowed: [
      "Send the staged message",
      "Change launch status",
      "Open a background follow-up",
    ],
    visibleAffordances: [
      "Recommendation label replaces suggestion label",
      "Alternatives become available",
      "Execution remains blocked in policy",
    ],
    consequence:
      "Accepting the recommendation moves the prepared plan into the user's queue.",
    rollback: "Dismiss the recommendation or select another ranked path.",
    policies: [
      {
        label: "Execution",
        value: "Blocked until user starts it",
        description: "Recommendation is allowed; action is not.",
        status: "blocked",
      },
      {
        label: "Rationale",
        value: "Required",
        description: "The preferred path must show why it won.",
        status: "required",
      },
      {
        label: "Initiation",
        value: "User starts every run",
        description: "The agent may prepare work, but not launch it.",
        status: "blocked",
      },
    ],
  },
  {
    id: "execute-confirm",
    label: "Execute with confirm",
    contract:
      "The agent can prepare the exact action payload, then must pause on a locked consequence preview.",
    userRole: "User approves the payload",
    statusLabel: "Confirmation required",
    actionTitle: "Send blocker summary",
    actionDescription:
      "The message is ready to send to the release owner. The recipient, subject, source set, and rollback path are locked before approval.",
    previewStatus: "locked",
    primaryAction: "Approve and send",
    secondaryActions: ["Deny", "Edit draft"],
    agentMay: [
      "Prepare the exact payload",
      "Lock recipient and consequence fields",
      "Execute after explicit approval",
    ],
    agentMust: [
      "Pause before the side effect",
      "Show affected object and rollback",
      "Expire approval if sources change",
    ],
    notAllowed: [
      "Change the payload after approval",
      "Send to extra recipients",
      "Retry after denial",
    ],
    visibleAffordances: [
      "Locked payload badge appears",
      "Approve and deny controls appear",
      "Policy marks confirmation as required",
    ],
    consequence:
      "External message is sent to the release owner and becomes part of the project record.",
    rollback:
      "Follow-up correction only; the original message cannot be recalled.",
    policies: [
      {
        label: "Execution",
        value: "Allowed after approval",
        description: "The agent is armed, but blocked at the gate.",
        status: "required",
      },
      {
        label: "Confirmation",
        value: "Required for this action",
        description: "Approval expires if the payload or source set changes.",
        status: "required",
      },
      {
        label: "Initiation",
        value: "User starts the run",
        description: "The agent cannot begin this workflow from a trigger.",
        status: "review",
      },
    ],
  },
  {
    id: "execute",
    label: "Execute",
    contract:
      "The agent can perform pre-approved action classes and must leave a live stop point and audit trail.",
    userRole: "User monitors and can pause",
    statusLabel: "Pre-approved execution",
    actionTitle: "Send internal launch follow-up",
    actionDescription:
      "The agent can send the internal follow-up because the recipient group, cost ceiling, source set, and rollback window match policy.",
    previewStatus: "approved",
    primaryAction: "Pause run",
    secondaryActions: ["Review log", "Change limits"],
    agentMay: [
      "Send internal follow-ups",
      "Update the launch task status",
      "Retry once inside the cost ceiling",
    ],
    agentMust: [
      "Keep pause visible",
      "Write every side effect to the log",
      "Escalate when scope changes",
    ],
    notAllowed: [
      "Contact external recipients",
      "Spend beyond the ceiling",
      "Modify policy while running",
    ],
    visibleAffordances: [
      "Approve button is replaced by pause",
      "Policy shows allowed action classes",
      "Audit trail becomes the primary proof",
    ],
    consequence:
      "Internal follow-up is sent and the launch task moves to Waiting on owner.",
    rollback:
      "Pause within 15 minutes and send a correction from the audit log.",
    policies: [
      {
        label: "Execution",
        value: "Allowed inside pre-approved scope",
        description: "Internal recipients, one retry, and $0.25 cost ceiling.",
        status: "allowed",
      },
      {
        label: "Confirmation",
        value: "Skipped for covered actions",
        description:
          "Escalation returns if recipient, cost, or source changes.",
        status: "review",
      },
      {
        label: "Initiation",
        value: "User starts the run",
        description: "The agent executes only after the user launches it.",
        status: "review",
      },
    ],
  },
  {
    id: "initiate",
    label: "Initiate",
    contract:
      "The agent can start from a declared trigger, then must announce itself and keep the kill switch one click away.",
    userRole: "User governs the policy",
    statusLabel: "Policy-initiated",
    actionTitle: "Start launch follow-up from trigger",
    actionDescription:
      "A stale release checklist triggered the policy. The agent opened a follow-up run, notified the owner, and is waiting for new evidence.",
    previewStatus: "approved",
    primaryAction: "Stop and require review",
    secondaryActions: ["Edit trigger", "Open audit trail"],
    agentMay: [
      "Start when a declared trigger fires",
      "Notify the responsible owner",
      "Collect new evidence until the budget is reached",
    ],
    agentMust: [
      "Announce the trigger that started the run",
      "Expose the stop control",
      "Escalate before leaving declared scope",
    ],
    notAllowed: [
      "Invent new triggers",
      "Expand recipients",
      "Change its own policy",
    ],
    visibleAffordances: [
      "Trigger source appears in the header",
      "Stop control replaces approve control",
      "Policy shows initiation as allowed",
    ],
    consequence:
      "The follow-up run starts without a fresh click because the trigger, budget, and scope were already approved.",
    rollback: "Stop the run, disable the trigger, and keep the audit packet.",
    policies: [
      {
        label: "Execution",
        value: "Allowed inside trigger scope",
        description: "Only the stale-checklist follow-up policy is active.",
        status: "allowed",
      },
      {
        label: "Confirmation",
        value: "Escalates on scope change",
        description:
          "New recipients, higher cost, or destructive edits require review.",
        status: "review",
      },
      {
        label: "Initiation",
        value: "Allowed from declared trigger",
        description: "Trigger: release checklist stale for 48 hours.",
        status: "allowed",
      },
    ],
  },
]

const PRINCIPLES_DEFENDED = [
  {
    title: "Honest affordance",
    description:
      "The command surface changes when the agent moves from advising to acting.",
  },
  {
    title: "Consequence before consent",
    description:
      "Confirmation is attached to affected object, source set, rollback, and cost.",
  },
  {
    title: "Observable autonomy",
    description:
      "Higher autonomy adds live policy, audit, and stop controls instead of hiding work.",
  },
  {
    title: "Scope cannot drift",
    description:
      "Every level states what the agent may do, must show, and still cannot do.",
  },
]

const COMPONENTS_USED = [
  {
    element: "Action Preview",
    spec: "Shows affected object, source set, consequence, cost, and rollback before or after execution.",
  },
  {
    element: "Effective Policy Preview",
    spec: "Turns autonomy from a level name into the current execution, confirmation, and initiation rules.",
  },
  {
    element: "Decision Surface",
    spec: "Carries the explicit approval step when the contract is Execute with confirm.",
  },
  {
    element: "Button",
    spec: "Exposes the active command: copy, accept, approve, pause, or stop.",
  },
]

const COMPOSITION_RECIPE = `const [level, setLevel] = useState(2)
const contract = AUTONOMY_LEVELS[level]

return (
  <PatternDemo title="Autonomy spectrum">
    <AutonomySpectrum
      value={level}
      levels={AUTONOMY_LEVELS}
      onValueChange={setLevel}
    />
    <ActionPreview
      title={contract.actionTitle}
      description={contract.actionDescription}
      status={contract.previewStatus}
      items={[
        { label: "Allowed", value: contract.contract },
        { label: "User role", value: contract.userRole },
        { label: "Consequence", value: contract.consequence, emphasis: true },
        { label: "Rollback", value: contract.rollback, emphasis: true },
      ]}
    />
    <EffectivePolicyPreview policies={contract.policies} />
  </PatternDemo>
)`

export {
  AUTONOMY_LEVELS,
  COMPONENTS_USED,
  COMPOSITION_RECIPE,
  PRINCIPLES_DEFENDED,
  type AutonomyLevel,
}
