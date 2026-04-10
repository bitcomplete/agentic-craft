"use client"

import Link from "next/link"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  RefreshIcon,
  SentIcon,
  Shield01Icon,
  Tick01Icon,
  TextIcon,
} from "@hugeicons/core-free-icons"

type ApprovalVariant = "handoff-email" | "checklist-update"
type ApprovalState = "pending" | "approved" | "denied" | "revised"
type PreviewKind = "fields" | "changes"
type ChangeKind = "add" | "edit" | "remove"

type ScenarioField = {
  label: string
  value: string
}

type ScenarioChange = {
  kind: ChangeKind
  text: string
}

type Scenario = {
  label: string
  actionSummary: string
  consequence: string
  previewKind: PreviewKind
  previewFields?: ScenarioField[]
  previewChanges?: ScenarioChange[]
  revisionDraft: string
  approvedSummary: string
  deniedSummary: string
  revisedSummary: string
  timelineRecord: string
  auditRecord: string
}

const SCENARIOS: Record<ApprovalVariant, Scenario> = {
  "handoff-email": {
    label: "Handoff Email",
    actionSummary:
      "Send the launch review handoff to the product and engineering leads.",
    consequence:
      "This creates an explicit team-facing recommendation and can start downstream work before the release review is finished.",
    previewKind: "fields",
    previewFields: [
      { label: "To", value: "product-team@acme.dev, release-leads@acme.dev" },
      { label: "Subject", value: "Checkout launch review handoff" },
      {
        label: "Includes",
        value: "Open risks, rollback note, analytics follow-up, and next owner",
      },
    ],
    revisionDraft:
      "Please tighten the subject line and clarify that analytics verification is still a follow-up item.",
    approvedSummary: "Approved - the handoff can be sent with the current framing.",
    deniedSummary:
      "Denied - the handoff stays in draft and no external message is sent.",
    revisedSummary:
      "Revision requested - the agent should tighten the wording before asking again.",
    timelineRecord: "Queue a visible execution record before the send happens.",
    auditRecord:
      "Store the reviewer decision, recipient list, subject, and revision note.",
  },
  "checklist-update": {
    label: "Checklist Update",
    actionSummary:
      "Apply the staged release edits to the shared launch checklist.",
    consequence:
      "This changes the team's working record and affects what later reviewers, operators, and release owners see as the current source of truth.",
    previewKind: "changes",
    previewChanges: [
      { kind: "add", text: "Add a rollback note for the staged checkout rollout." },
      {
        kind: "edit",
        text: "Clarify that analytics verification remains a follow-up check.",
      },
      {
        kind: "remove",
        text: "Remove the outdated note about manual screenshots from the checklist.",
      },
    ],
    revisionDraft:
      "Keep the rollback note, but move the analytics item into the follow-up section instead of the launch block.",
    approvedSummary:
      "Approved - the checklist can be updated and shared with the release group.",
    deniedSummary: "Denied - the shared checklist remains unchanged.",
    revisedSummary:
      "Revision requested - the agent should adjust the edit set and return with a narrower proposal.",
    timelineRecord:
      "Record that a checklist mutation was proposed and whether it executed.",
    auditRecord:
      "Capture the approved change set or the reviewer's requested revision note.",
  },
}

const ANATOMY = [
  [
    "Trigger",
    "The gate appears only when the agent is about to cross a real consequence boundary.",
  ],
  [
    "Consequence statement",
    "A short summary explains what will happen and why the action deserves review.",
  ],
  [
    "Action preview",
    "Recipients, changed records, or other concrete outputs are shown before the decision.",
  ],
  [
    "Decision controls",
    "Approve, deny, and revise are all first-class outcomes, not hidden secondary paths.",
  ],
  [
    "Revision request",
    "A revision note keeps the gate conversational instead of forcing a binary yes-or-no.",
  ],
  [
    "Execution receipt",
    "After the decision, the surface immediately shows what record should appear next.",
  ],
] as const

const STATES = [
  {
    name: "Pending",
    details:
      "The gate is waiting on a human decision. The action preview is visible and execution is paused.",
  },
  {
    name: "Approved",
    details:
      "The human authorizes execution. The next step is not just running the action, but also creating a visible execution record.",
  },
  {
    name: "Denied",
    details:
      "The action does not run. The denial should still be legible later so the system can explain why nothing happened.",
  },
  {
    name: "Revised",
    details:
      "The human requests changes before execution. The system preserves context, keeps authorship explicit, and reopens the gate after the agent updates the request.",
  },
] as const

const IMPLEMENTATION = [
  ["Canonical route wrapper", "app/approval-gate/page.tsx"],
  ["Canonical pattern page", "src/views/approval-gate-content.tsx"],
  ["Actions lens reference", "src/views/actions-content.tsx"],
  ["Composed-flow example", "src/views/demo-content.tsx"],
  ["Trust threshold framing", "src/views/trust-content.tsx"],
] as const

function useApprovalGateDemoState() {
  const [variant, setVariant] = useState<ApprovalVariant>("handoff-email")
  const [approvalState, setApprovalState] = useState<ApprovalState>("pending")
  const [revisionComposerOpen, setRevisionComposerOpen] = useState(false)
  const [revisionDraft, setRevisionDraft] = useState(
    SCENARIOS["handoff-email"].revisionDraft
  )

  const selectVariant = (nextVariant: ApprovalVariant) => {
    setVariant(nextVariant)
    setApprovalState("pending")
    setRevisionComposerOpen(false)
    setRevisionDraft(SCENARIOS[nextVariant].revisionDraft)
  }

  const approve = () => {
    setApprovalState("approved")
    setRevisionComposerOpen(false)
  }

  const deny = () => {
    setApprovalState("denied")
    setRevisionComposerOpen(false)
  }

  const openRevisionComposer = () => {
    setApprovalState("pending")
    setRevisionComposerOpen(true)
  }

  const cancelRevisionComposer = () => {
    setRevisionComposerOpen(false)
    setRevisionDraft(SCENARIOS[variant].revisionDraft)
  }

  const submitRevision = () => {
    if (!revisionDraft.trim()) return
    setApprovalState("revised")
    setRevisionComposerOpen(false)
  }

  const reset = () => {
    setApprovalState("pending")
    setRevisionComposerOpen(false)
    setRevisionDraft(SCENARIOS[variant].revisionDraft)
  }

  return {
    variant,
    approvalState,
    revisionComposerOpen,
    revisionDraft,
    selectVariant,
    approve,
    deny,
    openRevisionComposer,
    cancelRevisionComposer,
    submitRevision,
    setRevisionDraft,
    reset,
  }
}

function ApprovalGateDemo() {
  const {
    variant,
    approvalState,
    revisionComposerOpen,
    revisionDraft,
    selectVariant,
    approve,
    deny,
    openRevisionComposer,
    cancelRevisionComposer,
    submitRevision,
    setRevisionDraft,
    reset,
  } = useApprovalGateDemoState()

  const scenario = SCENARIOS[variant]
  const outcomeCopy =
    approvalState === "approved"
      ? scenario.approvedSummary
      : approvalState === "denied"
        ? scenario.deniedSummary
        : scenario.revisedSummary

  const outcomeIcon =
    approvalState === "approved"
      ? Tick01Icon
      : approvalState === "denied"
        ? Cancel01Icon
        : TextIcon

  const outcomeClasses =
    approvalState === "approved"
      ? "border-primary/40 bg-primary/5"
      : approvalState === "denied"
        ? "border-destructive/40 bg-destructive/5"
        : "border-border/40 bg-muted/30"

  return (
    <div className="mt-10">
      <style>{`
        @keyframes approval-gate-slide-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes approval-gate-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .approval-gate-slide-in {
          animation: approval-gate-slide-in 250ms ease-out forwards;
        }
        .approval-gate-fade-in {
          animation: approval-gate-fade-in 200ms ease-out forwards;
        }
      `}</style>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-5">
        <span className="section-label mr-1">Controls</span>
        {(Object.keys(SCENARIOS) as ApprovalVariant[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={variant === key}
            onClick={() => selectVariant(key)}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
              variant === key
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {SCENARIOS[key].label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border/40 p-6">
        <div key={variant} className="approval-gate-slide-in space-y-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/30">
              <HugeiconsIcon
                icon={Shield01Icon}
                size={14}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {scenario.actionSummary}
              </p>
              <p className="max-w-[640px] text-sm leading-relaxed text-muted-foreground">
                {scenario.consequence}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-border/40 bg-muted/30 px-4 py-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Action preview
            </p>

            {scenario.previewKind === "fields" ? (
              <div className="space-y-2 text-xs">
                {scenario.previewFields?.map((field) => (
                  <div key={field.label} className="flex gap-3">
                    <span className="w-20 shrink-0 text-muted-foreground">
                      {field.label}
                    </span>
                    <span className="text-foreground">{field.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {scenario.previewChanges?.map((change) => (
                  <div key={change.text} className="flex gap-3">
                    <span className="w-20 shrink-0 text-muted-foreground">
                      {change.kind.toUpperCase()}
                    </span>
                    <span className="text-foreground">{change.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {approvalState === "pending" ? (
            <div className="approval-gate-fade-in space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={approve}
                  className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97]"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={openRevisionComposer}
                  className="rounded-md border border-border px-4 py-1.5 text-sm text-foreground transition-all hover:bg-accent active:scale-[0.97]"
                >
                  Revise
                </button>
                <button
                  type="button"
                  onClick={deny}
                  className="rounded-md border border-border px-4 py-1.5 text-sm text-muted-foreground transition-all hover:bg-accent active:scale-[0.97]"
                >
                  Deny
                </button>
              </div>

              {revisionComposerOpen ? (
                <div className="approval-gate-fade-in rounded-md border border-border/40 bg-background px-4 py-3">
                  <label
                    htmlFor="approval-gate-revision-note"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Revision note
                  </label>
                  <textarea
                    id="approval-gate-revision-note"
                    value={revisionDraft}
                    onChange={(event) => setRevisionDraft(event.target.value)}
                    className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={submitRevision}
                      className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background transition-all hover:opacity-90 active:scale-[0.97]"
                    >
                      Send revision request
                    </button>
                    <button
                      type="button"
                      onClick={cancelRevisionComposer}
                      className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-all hover:bg-accent active:scale-[0.97]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="approval-gate-fade-in space-y-4">
              <div className={`rounded-md border px-4 py-3 ${outcomeClasses}`}>
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={outcomeIcon}
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">{outcomeCopy}</p>
                    {approvalState === "revised" ? (
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Reviewer note: {revisionDraft}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-border/40 bg-muted/20 px-4 py-3 text-xs">
                <div className="flex gap-3">
                  <HugeiconsIcon
                    icon={SentIcon}
                    size={12}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Live history</span>
                      <p className="mt-0.5 text-foreground">{scenario.timelineRecord}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Audit handoff</span>
                      <p className="mt-0.5 text-foreground">{scenario.auditRecord}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
              >
                <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.5} />
                Reset demo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ApprovalGateContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Pattern Reference</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Approval Gate
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          The approval gate is the point where an agent pauses before a
          consequential action, makes the pending consequence explicit, and hands
          authorship back to the human for a final decision. It is not a generic
          confirm dialog. It is a higher-order review pattern that connects
          execution, revision, and durable traceability.
        </p>
      </header>

      <section id="demo" className="page-section">
        <p className="section-label mb-3">Interactive</p>
        <h2 className="text-xl font-semibold tracking-tight">Demo</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          Switch between two consequential actions, then move the gate through
          approve, deny, and revise. The important behavior is not just the
          button row. It is the combination of consequence framing, preview,
          human decision, and what record the system should create next.
        </p>

        <ApprovalGateDemo />
      </section>

      <section id="anatomy" className="page-section">
        <p className="section-label mb-3">Structure</p>
        <h2 className="text-xl font-semibold tracking-tight">Anatomy</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          A useful approval gate keeps the decision legible. The user should be
          able to tell what will happen, who is still responsible, and what
          trace the decision will leave behind.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Element
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {ANATOMY.map(([name, role]) => (
              <tr key={name} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{name}</td>
                <td className="py-3">{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="states" className="page-section">
        <p className="section-label mb-3">Behavior</p>
        <h2 className="text-xl font-semibold tracking-tight">State model</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          Approval is only one branch of the pattern. A complete gate also has a
          denial path and a revision path so the human can reshape the request
          without forcing the agent to start over from nothing.
        </p>

        <div className="mt-10 space-y-3">
          {STATES.map((state) => (
            <div key={state.name} className="rounded-lg border border-border/40 p-4">
              <p className="text-sm font-medium text-foreground">{state.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {state.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="thresholds" className="page-section">
        <p className="section-label mb-3">Guidance</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Thresholds and composition rules
        </h2>
        <div
          className="mt-10 space-y-4 font-serif text-base"
          style={{
            lineHeight: "26px",
            letterSpacing: "-0.4px",
            fontVariationSettings: '"opsz" 12',
          }}
        >
          <p>
            Use an approval gate when the next agent action crosses a real
            consequence boundary: external communication, mutation of a shared
            record, irreversible side effects, or a policy override that the
            human should explicitly own.
          </p>
          <p>
            Do not gate passive retrieval, reversible drafting, or every small
            internal step. Overusing the pattern turns trust into friction and
            trains users to approve without reading.
          </p>
          <p>
            Group related consequences into one gate when they belong to the same
            decision. The gate should summarize the action at the level the human
            actually needs to authorize, not explode into a checklist of every
            low-level operation.
          </p>
          <p>
            Treat revise as a first-class branch. A revision request should
            preserve the current context, attach the reviewer note, and return to
            execution only after the agent has updated the proposal.
          </p>
        </div>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The pattern works when the user can see consequence, authorship, and
          the next record the decision will create. If any of those are missing,
          the gate becomes ceremony instead of review.
        </p>
      </section>

      <section id="audit-handoff" className="page-section">
        <p className="section-label mb-3">Traceability</p>
        <h2 className="text-xl font-semibold tracking-tight">Audit handoff</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          The approval gate should hand off to two explicit pattern surfaces: a
          visible execution stream for near-term review and a durable
          accountability record for later governance. In the current IA, those
          concerns now live in{" "}
          <Link
            href="/activity-timeline"
            className="text-foreground underline underline-offset-4"
          >
            Activity Timeline
          </Link>{" "}
          and{" "}
          <Link
            href="/audit-trail"
            className="text-foreground underline underline-offset-4"
          >
            Audit Trail
          </Link>
          .
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Decision
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Live history
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Durable record
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Approved</td>
              <td className="py-3 pr-6">
                Show that the action was approved and then executed.
              </td>
              <td className="py-3">
                Persist who approved it, what preview they saw, and when execution
                occurred.
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Denied</td>
              <td className="py-3 pr-6">
                Show that the action was proposed but did not run.
              </td>
              <td className="py-3">
                Preserve the denial so later reviewers can explain the missing
                action without guesswork.
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Revised</td>
              <td className="py-3 pr-6">
                Show that execution paused and a revision note was sent back to
                the agent.
              </td>
              <td className="py-3">
                Store the reviewer note alongside the original proposal so the
                later approval can be understood in context.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="implementation" className="page-section">
        <p className="section-label mb-3">Implementation</p>
        <h2 className="text-xl font-semibold tracking-tight">Implementation notes</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          This page promotes Approval Gate into the canonical Pattern Reference
          layer while keeping the existing Actions lens demo intact as contextual
          framing for action-taking flows.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Asset
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Path
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {IMPLEMENTATION.map(([label, path]) => (
              <tr key={label} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{label}</td>
                <td className="py-3">{path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="related" className="page-section">
        <p className="section-label mb-3">Related</p>
        <h2 className="text-xl font-semibold tracking-tight">Related pages</h2>
        <div className="mt-10 space-y-2 text-sm text-muted-foreground">
          <p>
            Read the{" "}
            <Link
              href="/actions"
              className="text-foreground underline underline-offset-4"
            >
              Actions
            </Link>{" "}
            lens for how approval gates sit alongside tool calls, plans, and
            execution-facing decision flows.
          </p>
          <p>
            Read{" "}
            <Link
              href="/trust"
              className="text-foreground underline underline-offset-4"
            >
              Trust &amp; Governance
            </Link>{" "}
            for the threshold logic behind when an approval gate should appear at
            all.
          </p>
          <p>
            Continue into{" "}
            <Link
              href="/activity-timeline"
              className="text-foreground underline underline-offset-4"
            >
              Activity Timeline
            </Link>{" "}
            to show how the decision appears in the live/history execution stream,
            then into{" "}
            <Link
              href="/audit-trail"
              className="text-foreground underline underline-offset-4"
            >
              Audit Trail
            </Link>{" "}
            for the durable accountability record.
          </p>
          <p>
            Compare with{" "}
            <Link
              href="/thread-timeline"
              className="text-foreground underline underline-offset-4"
            >
              Thread Timeline
            </Link>{" "}
            for a different higher-order pattern that makes long-running review
            work easier to navigate.
          </p>
        </div>
      </section>
    </article>
  )
}
