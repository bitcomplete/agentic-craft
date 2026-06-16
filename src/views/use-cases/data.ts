import {
  Attachment01Icon,
  BrowserIcon,
  ComputerIcon,
  File01Icon,
  GitCompareIcon,
  Globe02Icon,
  Plug01Icon,
  Shield01Icon,
  ViewSidebarRightIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type { ArtifactDocumentProps } from "@/components/ui/artifact-document"
import type { ComposerScopeItem, ComposerTask } from "@/components/ui/composer"
import type {
  ContextualWorkbenchMessage,
  ContextualWorkbenchSurface,
} from "@/components/ui/contextual-workbench"
import type { MemoryLedgerItemProps } from "@/components/ui/memory-ledger-item"
import type { ObservableWorkStatus } from "@/components/ui/observable-work"
import type { RunTraceEvent } from "@/components/ui/run-trace"
import type { SourcePreviewCitationProps } from "@/components/ui/source-preview"
import type { UsageMeterItem } from "@/components/ui/usage-meter"

export type UseCaseSlug = "thread" | "context-blocks" | "contextual-side-panel"

export type PatternLink = {
  label: string
  href: string
  description: string
}

export type ComponentLink = {
  label: string
  href: string
}

type MessageSegment = {
  text?: string
  sourceIndex?: number
}

export type ThreadMessage = {
  id: string
  role: "user" | "agent" | "system"
  label: string
  timestamp: string
  body?: string
  segments?: MessageSegment[]
}

export type ObservableStepFixture = {
  id: string
  title: string
  description: string
  status: ObservableWorkStatus
  source: string
  meta: string
  details: string[]
  defaultOpen?: boolean
}

export type ReferenceFixture = {
  id: string
  title: string
  description: string
  meta: string
  icon: IconSvgElement
}

type ArtifactFixture = Pick<
  ArtifactDocumentProps,
  | "title"
  | "description"
  | "status"
  | "version"
  | "sourceCount"
  | "meta"
  | "sections"
>

type MemoryFixture = Pick<
  MemoryLedgerItemProps,
  "title" | "value" | "source" | "lastUsed" | "scope" | "expiry" | "selected"
>

type ContextBlockFixtures = {
  artifacts: ReferenceFixture[]
  sources: SourcePreviewCitationProps["sources"]
  connectors: ReferenceFixture[]
  memories: MemoryFixture[]
  usage: UsageMeterItem[]
  runTrace: RunTraceEvent[]
}

type WorkbenchFixtures = {
  messages: ContextualWorkbenchMessage[]
  surfaces: ContextualWorkbenchSurface[]
  artifact: ArtifactFixture
  browserChecks: ReferenceFixture[]
  source: SourcePreviewCitationProps["sources"][number]
  diffLines: string[]
}

export type UseCaseVariant = {
  slug: UseCaseSlug
  step: string
  title: string
  shortTitle: string
  summary: string
  whatThisIs: string
  thesis: string
  capability: string
  layout: "thread" | "context-blocks" | "contextual-side-panel"
  primaryPattern: string
  patterns: PatternLink[]
  componentsUsed: ComponentLink[]
  tradeoffs: string[]
  composition: string
  fixtureNote: string
  messages: ThreadMessage[]
  sources: SourcePreviewCitationProps["sources"]
  observableWork: ObservableStepFixture[]
  composer: {
    placeholder: string
    defaultValue: string
    scope: ComposerScopeItem[]
    plan: ComposerTask[]
    suggestions: string[]
    contextUsed: number
    contextTotal: number
  }
  contextBlocks?: ContextBlockFixtures
  workbench?: WorkbenchFixtures
}

const sources = [
  {
    id: 1,
    title: "Release readiness brief",
    source: "docs/product/release-readiness.md",
    location: "Decision log, June 12",
    excerpt:
      "The preview launch is acceptable only if support coverage, billing guardrails, and the migration rollback owner are all visible before signup opens.",
    icon: File01Icon,
  },
  {
    id: 2,
    title: "Customer research digest",
    source: "Coda / Research / Team Admins",
    location: "Segment: workspace owners",
    excerpt:
      "Admins want the assistant to show the evidence trail and the cost envelope before it turns a draft into a customer-visible artifact.",
    icon: Shield01Icon,
  },
  {
    id: 3,
    title: "Launch analytics guardrail",
    source: "Warehouse notebook: launch_health.sql",
    location: "Query 4",
    excerpt:
      "Trial conversion drops sharply when first-run setup exceeds four steps or when the invite path hides billing ownership.",
    icon: Globe02Icon,
  },
] satisfies SourcePreviewCitationProps["sources"]

const baseMessages: ThreadMessage[] = [
  {
    id: "u1",
    role: "user",
    label: "Ariel",
    timestamp: "10:42",
    body: "Review the preview-launch plan against customer research, support readiness, and the billing guardrails. Tell me what should change before we publish.",
  },
  {
    id: "s1",
    role: "system",
    label: "Observable work",
    timestamp: "10:42",
    body: "Reading 6 sources, checking the launch gates, and tracing each recommendation back to a source.",
  },
  {
    id: "a1",
    role: "agent",
    label: "Agent",
    timestamp: "10:43",
    segments: [
      {
        text: "The plan is close, but the publish gate should block on support coverage and rollback ownership",
      },
      { sourceIndex: 0 },
      {
        text: ". The strongest customer signal is not more automation; it is keeping evidence and cost visible before the assistant acts",
      },
      { sourceIndex: 1 },
      { text: "." },
    ],
  },
]

const observableWork: ObservableStepFixture[] = [
  {
    id: "scope",
    title: "Scoped the launch question",
    description:
      "Bound the review to release plan, customer research, support readiness, billing guardrails.",
    status: "complete",
    source: "Thread prompt",
    meta: "0.4s",
    details: [
      "Excluded pricing copy and enterprise onboarding because neither is part of the preview launch gate.",
      "Kept support and billing because both change whether publishing is safe.",
    ],
  },
  {
    id: "sources",
    title: "Read source set",
    description:
      "Compared the readiness brief, customer digest, and analytics guardrail.",
    status: "complete",
    source: "3 primary sources",
    meta: "2.8s",
    details: [
      "Matched each recommendation to the source that would let a reviewer inspect it later.",
      "Marked one analytics query as directional because it covers last quarter's onboarding path.",
    ],
    defaultOpen: true,
  },
  {
    id: "draft",
    title: "Drafted recommendation",
    description:
      "Prepared a concise answer with unresolved risks and next actions.",
    status: "active",
    source: "Working note",
    meta: "1.1s",
    details: [
      "Kept the answer in the thread until the user chooses to promote it into an artifact.",
    ],
  },
]

const composer = {
  placeholder: "Ask for the next launch review pass...",
  defaultValue: "",
  scope: [
    { id: "brief", label: "Release readiness brief", icon: File01Icon },
    { id: "research", label: "Customer research digest", icon: Shield01Icon },
    { id: "analytics", label: "Launch analytics guardrail", icon: Globe02Icon },
  ],
  plan: [
    { label: "Check source coverage", done: true },
    { label: "Name blocked launch gates", done: true },
    { label: "Promote answer if requested", done: false },
  ],
  suggestions: [
    "Turn this into a launch checklist",
    "Show only unresolved risks",
    "Compare against last week's plan",
  ],
  contextUsed: 19,
  contextTotal: 48,
} satisfies UseCaseVariant["composer"]

const contextBlocks: ContextBlockFixtures = {
  artifacts: [
    {
      id: "artifact-brief",
      title: "Launch gate brief",
      description:
        "Draft artifact staged from the answer, with support and billing sections still editable.",
      meta: "v0.3 / 3 linked sources / Reviewing",
      icon: File01Icon,
    },
    {
      id: "artifact-checklist",
      title: "Publish checklist",
      description:
        "Task-oriented checklist generated from the open risks in the thread.",
      meta: "7 items / 2 blockers / Not exported",
      icon: Attachment01Icon,
    },
  ],
  sources,
  connectors: [
    {
      id: "connector-coda",
      title: "Coda research workspace",
      description:
        "Customer admin notes and launch interview summaries attached to the thread.",
      meta: "Connected / Read-only / 84 notes",
      icon: Plug01Icon,
    },
    {
      id: "connector-warehouse",
      title: "Warehouse notebook",
      description:
        "Analytics guardrail query used to validate first-run setup risk.",
      meta: "Connected / Query 4 / Cached 18m ago",
      icon: ComputerIcon,
    },
  ],
  memories: [
    {
      title: "Workspace admin launch preference",
      value: "Always show billing owner before invite flows are published.",
      source: "Customer research digest",
      lastUsed: "Today",
      scope: "Workspace",
      expiry: "90d",
      selected: true,
    },
    {
      title: "Support gate convention",
      value: "A launch is not ready until support coverage has a named owner.",
      source: "Release readiness brief",
      lastUsed: "12m ago",
      scope: "Project",
      expiry: "30d",
    },
  ],
  usage: [
    {
      id: "tokens",
      label: "Context",
      value: 41,
      valueLabel: "19.6k",
      limitLabel: "48k window",
    },
    {
      id: "sources",
      label: "Source coverage",
      value: 78,
      valueLabel: "7/9",
      limitLabel: "2 optional",
    },
    {
      id: "cost",
      label: "Run cost",
      value: 22,
      valueLabel: "$0.18",
      limitLabel: "$0.80 ceiling",
    },
  ],
  runTrace: [
    {
      id: "trace-1",
      title: "Fetched release sources",
      description: "Read readiness, research, support, billing, analytics.",
      status: "complete",
      timestamp: "10:42",
      duration: "2.8s",
    },
    {
      id: "trace-2",
      title: "Checked publish gate",
      description: "Support owner and rollback owner are still unresolved.",
      status: "blocked",
      timestamp: "10:43",
      duration: "1.2s",
      detail:
        "The blocked state is attached to the context rail so the thread does not pretend the plan is ready.",
    },
    {
      id: "trace-3",
      title: "Prepared artifact draft",
      description:
        "Waiting for user to promote the answer into the side panel.",
      status: "queued",
      timestamp: "10:44",
    },
  ],
}

const artifact: ArtifactFixture = {
  title: "Preview launch decision memo",
  description:
    "A source-backed memo promoted from the thread. The assistant can edit sections, but the source set and rollback note stay visible.",
  status: "reviewing",
  version: "v0.4",
  sourceCount: 3,
  meta: [
    { label: "Owner", value: "Launch working group" },
    { label: "Last edit", value: "10:46" },
  ],
  sections: [
    {
      id: "recommendation",
      title: "Recommendation",
      body: "Hold publishing until support coverage and rollback ownership are assigned. The user can approve a narrower preview once those two gates are visible.",
      source: "Release readiness brief",
      status: "cited",
    },
    {
      id: "customer-signal",
      title: "Customer signal",
      body: "Admins are comfortable with assistant-generated launch artifacts when the source trail, cost envelope, and approval state remain inspectable.",
      source: "Customer research digest",
      status: "cited",
    },
    {
      id: "open-question",
      title: "Open question",
      body: "The analytics guardrail points to setup friction, but the query is directional. Confirm against the current invite path before changing copy.",
      source: "Launch analytics guardrail",
      status: "needs-source",
    },
  ],
}

const workbench: WorkbenchFixtures = {
  messages: [
    {
      id: "wm1",
      role: "user",
      label: "Ariel",
      body: "Promote the answer into a decision memo and keep the browser evidence next to it.",
      timestamp: "10:45",
    },
    {
      id: "wm2",
      role: "agent",
      label: "Agent",
      body: "I created the memo draft. The source set is locked while I check the current invite path in the browser surface.",
      timestamp: "10:46",
      duration: "3.4s",
      surfaceId: "memo",
    },
    {
      id: "wm3",
      role: "agent",
      label: "Agent",
      body: "The browser confirms setup still takes five visible steps. I left the copy recommendation in review instead of applying it.",
      timestamp: "10:47",
      surfaceId: "browser",
    },
  ],
  surfaces: [
    {
      id: "memo",
      label: "Memo",
      title: "Decision memo",
      description: "Editable artifact with source-backed sections.",
      status: "review",
      kind: "artifact",
      icon: File01Icon,
      meta: [
        { label: "Version", value: "v0.4" },
        { label: "Sources", value: "3 locked" },
      ],
    },
    {
      id: "browser",
      label: "Browser",
      title: "Invite path check",
      description: "Embedded browser state tied to the thread instruction.",
      status: "active",
      kind: "browser",
      icon: BrowserIcon,
      meta: [
        { label: "URL", value: "preview.local/invite" },
        { label: "Step count", value: "5 visible" },
      ],
    },
    {
      id: "diff",
      label: "Diff",
      title: "Copy change",
      description: "Reviewable text change before the assistant applies it.",
      status: "blocked",
      kind: "diff",
      icon: GitCompareIcon,
      meta: [
        { label: "State", value: "Needs approval" },
        { label: "Rollback", value: "Copy-only" },
      ],
    },
    {
      id: "source",
      label: "Source",
      title: "Evidence",
      description: "Original source backing the active memo claim.",
      status: "complete",
      kind: "source",
      icon: Shield01Icon,
      meta: [
        { label: "Citation", value: "#2" },
        { label: "Scope", value: "Research digest" },
      ],
    },
  ],
  artifact,
  browserChecks: [
    {
      id: "browser-step-1",
      title: "Invite owner visible",
      description: "The first invite screen names the billing owner.",
      meta: "Pass / current preview",
      icon: BrowserIcon,
    },
    {
      id: "browser-step-2",
      title: "Setup length still high",
      description:
        "Five visible steps remain before the user can invite a team.",
      meta: "Needs review / setup flow",
      icon: ViewSidebarRightIcon,
    },
  ],
  source: sources[1],
  diffLines: [
    "- Publish the preview once the launch plan is reviewed.",
    "+ Publish the preview after support coverage and rollback ownership are assigned.",
    "+ Keep billing-owner visibility in the invite path before enabling team invites.",
  ],
}

export const useCaseVariants: UseCaseVariant[] = [
  {
    slug: "thread",
    step: "01",
    title: "Thread (refreshed)",
    shortTitle: "Thread",
    summary:
      "The conversational backbone: visible work, anchored citations, cleaner follow-ups, and a composer that carries scope.",
    whatThisIs:
      "A modern thread surface for a launch-review assistant. It keeps the answer readable while showing enough work, source, and scope for the user to trust the next step.",
    thesis:
      "The answer is only credible when the work remains inspectable beside it.",
    capability: "Conversation backbone",
    layout: "thread",
    primaryPattern: "Observable Work",
    patterns: [
      {
        label: "Observable Work",
        href: "/conversation#progress-steps",
        description: "Show source reads, blocked checks, and running work.",
      },
      {
        label: "Composer Architecture",
        href: "/conversation#composer",
        description: "Carry scope, plan, suggestions, and context pressure.",
      },
      {
        label: "Citations / Provenance",
        href: "/conversation#citations",
        description: "Anchor source previews directly to answer claims.",
      },
    ],
    componentsUsed: [
      { label: "ObservableWork", href: "/registry#primitives" },
      { label: "SourcePreviewCitation", href: "/registry#primitives" },
      { label: "Composer", href: "/registry#primitives" },
    ],
    tradeoffs: [
      "The thread stays narrow so prose and citations remain readable.",
      "Only the active source set is visible; heavier artifacts wait for the next variant.",
      "Follow-up chips are suggestions, not hidden automation.",
    ],
    composition: `ThreadSurface
  .observableWork(readinessSteps)
  .messages(answerWithCitations)
  .composer(scopedPlan)`,
    fixtureNote:
      "Launch-review data lives in this use-case fixture so the thread can teach a specific product workflow instead of replaying a generic registry demo.",
    messages: baseMessages,
    sources,
    observableWork,
    composer,
  },
  {
    slug: "context-blocks",
    step: "02",
    title: "Thread + Context Blocks",
    shortTitle: "Context Blocks",
    summary:
      "The same thread gains persistent right-rail containers for artifacts, sources, connectors, memory, usage, and run state.",
    whatThisIs:
      "A thread with named context blocks attached to the conversation. The rail makes durable objects visible without turning every answer into a document workspace.",
    thesis:
      "Context should be a set of named objects, not a mystery behind the model.",
    capability: "Structured context rail",
    layout: "context-blocks",
    primaryPattern: "Context as data",
    patterns: [
      {
        label: "Provenance",
        href: "/sources#citations",
        description: "Keep source objects available after the answer.",
      },
      {
        label: "Memory Ledger",
        href: "/memory#memory-crud",
        description: "Show what durable context was read or proposed.",
      },
      {
        label: "Cost / Usage Surfaces",
        href: "/sources#usage-meter",
        description: "Expose context, source coverage, and spend.",
      },
      {
        label: "Context as Data",
        href: "/sources#source-list",
        description:
          "Represent artifacts, connectors, and sources as inspectable items.",
      },
    ],
    componentsUsed: [
      { label: "ReferenceItem", href: "/registry#primitives" },
      { label: "MemoryLedgerItem", href: "/registry#primitives" },
      { label: "UsageMeter", href: "/registry#primitives" },
      { label: "RunTrace", href: "/registry#primitives" },
      { label: "Composer", href: "/registry#primitives" },
    ],
    tradeoffs: [
      "The rail is persistent, so only high-signal containers belong there.",
      "Artifacts are summarized until the user promotes one into a workspace.",
      "Usage is visible but compact; it should not dominate the thread.",
    ],
    composition: `ThreadWithContextBlocks
  .thread(baseThread)
  .rail(artifacts, sources, connectors, memories)
  .usageMeter(runBudget)
  .runTrace(launchGateEvents)`,
    fixtureNote:
      "The rail fixtures are narrative context objects owned by the use case: launch artifacts, real connector labels, memory records, and staggered run telemetry.",
    messages: baseMessages,
    sources,
    observableWork,
    composer,
    contextBlocks,
  },
  {
    slug: "contextual-side-panel",
    step: "03",
    title: "Thread + Contextual Side Panel",
    shortTitle: "Side Panel",
    summary:
      "The conversation drives a parallel artifact, browser, source, or diff surface the user can inspect and steer.",
    whatThisIs:
      "A split workspace for moments when the thread is no longer enough. The assistant can create and update a memo, but source locks, browser evidence, and approval state remain visible.",
    thesis:
      "When the agent acts on an object, the object needs to be on screen.",
    capability: "Parallel workbench",
    layout: "contextual-side-panel",
    primaryPattern: "Contextual Workbench",
    patterns: [
      {
        label: "Locked Preview",
        href: "/actions#approval-gate",
        description: "Freeze the payload and consequence before side effects.",
      },
      {
        label: "Generative UI",
        href: "/sources#artifact-document",
        description:
          "Promote thread output into an editable, source-backed artifact.",
      },
      {
        label: "Operational Surfaces",
        href: "/observability#activity-timeline",
        description:
          "Keep browser, source, and diff state available while work runs.",
      },
      {
        label: "Honest Affordance",
        href: "/patterns/autonomy-contract",
        description:
          "Blocked copy changes stay blocked until the user approves.",
      },
    ],
    componentsUsed: [
      { label: "ContextualWorkbench", href: "/registry#primitives" },
      { label: "ArtifactDocument", href: "/registry#primitives" },
      { label: "ReferenceItem", href: "/registry#primitives" },
      { label: "SourcePreview", href: "/registry#primitives" },
    ],
    tradeoffs: [
      "The panel takes space from the thread, so it appears only when there is an object to inspect.",
      "The artifact is editable, but source set and blocked diff state stay explicit.",
      "Browser evidence is summarized; full automation logs stay in observability.",
    ],
    composition: `ContextualWorkbench
  .chat(threadMessages)
  .surfaces(memo, browser, diff, source)
  .renderSurface(activeObject)`,
    fixtureNote:
      "The side-panel fixtures model one promoted memo with browser evidence and a blocked diff, so affordances match the work state instead of implying the agent already acted.",
    messages: baseMessages,
    sources,
    observableWork,
    composer,
    workbench,
  },
]

export function getUseCaseVariant(slug: string) {
  return useCaseVariants.find((variant) => variant.slug === slug)
}
