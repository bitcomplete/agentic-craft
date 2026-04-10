"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  Alert01Icon,
  File01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"

type IconProp = React.ComponentProps<typeof HugeiconsIcon>["icon"]
type AuditSurface = "index" | "record" | "review"
type AuditDecision = "approved" | "rejected" | "escalated"

type AuditRecord = {
  action: string
  actor: string
  createdAt: string
  decision: AuditDecision
  evidence: string[]
  id: string
  icon: IconProp
  linkedTimelineEvent: string
  policyReference: string
  rationale: string
  retention: string
  reviewer: string
}

const DEMO_STYLES = `
  @keyframes audit-trail-slide-in {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes audit-trail-press {
    0% { transform: scale(1); }
    50% { transform: scale(0.97); }
    100% { transform: scale(1); }
  }

  .audit-trail-slide-in {
    animation: audit-trail-slide-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .audit-trail-press:active {
    animation: audit-trail-press 150ms ease;
  }
`

const AUDIT_RECORDS: AuditRecord[] = [
  {
    id: "ATR-2026-04-10-014",
    createdAt: "Apr 10, 2026 · 11:37 AM",
    action: "Approved blocker classification for the mobile checkout mismatch",
    actor: "Release review agent",
    reviewer: "A. Chen",
    decision: "approved",
    linkedTimelineEvent: "Product lead approved blocker classification",
    policyReference: "Launch review policy · manual approval before rollout-plan changes",
    rationale: "The issue changes launch readiness and must carry an explicit human decision with evidence and policy context.",
    retention: "Retain with the launch package and linked evidence set.",
    evidence: [
      "checkout-launch-brief.md",
      "checkout-redesign.fig · mobile summary frame",
      "launch-thread reply #14",
    ],
    icon: Shield01Icon,
  },
  {
    id: "ATR-2026-04-10-011",
    createdAt: "Apr 10, 2026 · 11:14 AM",
    action: "Escalated missing analytics owner for manual review",
    actor: "Review coordinator",
    reviewer: "Release operations",
    decision: "escalated",
    linkedTimelineEvent: "Escalated missing analytics owner for manual review",
    policyReference: "Release evidence policy · unresolved launch blockers must be reviewed before rollout",
    rationale: "The open ownership gap prevents the release package from being considered complete.",
    retention: "Retain until the blocker is resolved and a superseding record is created.",
    evidence: [
      "analytics-plan.md",
      "checkout-launch-review.md",
      "release-ops queue item",
    ],
    icon: Alert01Icon,
  },
  {
    id: "ATR-2026-04-10-008",
    createdAt: "Apr 10, 2026 · 10:52 AM",
    action: "Rejected direct rollout-plan edit without prior approval",
    actor: "Release review agent",
    reviewer: "M. Patel",
    decision: "rejected",
    linkedTimelineEvent: "Requested approval before updating the staged rollout plan",
    policyReference: "Operational safety policy · consequential changes require approval before execution",
    rationale: "The proposed edit affected release behavior and could not be applied until a reviewer approved the change.",
    retention: "Retain alongside the superseding approved record if the action is retried later.",
    evidence: [
      "staged-rollout.md",
      "approval request surface",
      "launch coordination notes",
    ],
    icon: File01Icon,
  },
]

const ANATOMY = [
  ["Record index", "The browsable ledger of sealed records available for scan, export, and review."],
  ["Immutable identifier", "A stable receipt that distinguishes one review record from all later superseding records."],
  ["Decision summary", "The official action, reviewer, and disposition captured for accountability."],
  ["Evidence bundle", "The artifacts, threads, and source documents used to justify the disposition."],
  ["Policy reference", "The rule or workflow that explains why the record exists and how it should be interpreted."],
  ["Timeline link", "A pointer back to the activity event that led to this formal record."],
]

const RECORD_MODEL = [
  ["Record ID", "Stable handle for exports, compliance review, and references from surrounding systems."],
  ["Created at", "When the record was sealed, not just when the underlying event occurred."],
  ["Actor and reviewer", "Separates who initiated the action from who carried review responsibility."],
  ["Decision", "Approved, rejected, or escalated. The official disposition belongs here rather than in the timeline."],
  ["Rationale", "Human-readable explanation of why the disposition was appropriate."],
  ["Evidence set", "Files, threads, and documents needed to reconstruct the decision later."],
  ["Retention rule", "Clarifies how the record lives beyond the current working session."],
]

const REVIEW_WORKFLOWS = [
  {
    title: "Intake",
    detail: "Select the record bundle that matches the incident, approval, or exception under review.",
  },
  {
    title: "Evidence review",
    detail: "Compare the sealed record against its linked artifacts and any upstream activity events.",
  },
  {
    title: "Disposition",
    detail: "Accept the record as sufficient, contest it, or create a superseding record when new evidence changes the outcome.",
  },
  {
    title: "Retention and export",
    detail: "Package the record with the surrounding review materials for later audits, handoffs, or external evaluation.",
  },
]

const IMPLEMENTATION = [
  ["Canonical route", "app/audit-trail/page.tsx"],
  ["Canonical content", "src/views/audit-trail-content.tsx"],
  ["Lens source material", "src/views/trust-content.tsx"],
  ["Related lens", "src/views/observability-content.tsx"],
  ["Upstream execution surface", "src/views/activity-timeline-content.tsx"],
]

function AuditTrailDemo() {
  const [surface, setSurface] = React.useState<AuditSurface>("record")
  const [selectedRecordId, setSelectedRecordId] = React.useState<string>(AUDIT_RECORDS[0].id)

  const selectedRecord =
    AUDIT_RECORDS.find((record) => record.id === selectedRecordId) ?? AUDIT_RECORDS[0]

  return (
    <div className="mt-10 rounded-xl border border-border/40 bg-background p-6">
      <style>{DEMO_STYLES}</style>

      <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-4">
        <span className="section-label mr-2">Controls</span>
        {([
          ["index", "Index"],
          ["record", "Record"],
          ["review", "Review packet"],
        ] as const).map(([nextSurface, label]) => (
          <button
            key={nextSurface}
            type="button"
            onClick={() => setSurface(nextSurface)}
            className={[
              "audit-trail-press rounded-md border px-3 py-1.5 text-xs transition-colors",
              surface === nextSurface
                ? "border-border bg-foreground/[0.05] text-foreground"
                : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="rounded-lg border border-border/40 p-4">
          <p className="text-xs text-muted-foreground">Record set</p>
          <div className="mt-4 space-y-2">
            {AUDIT_RECORDS.map((record, index) => {
              const isSelected = record.id === selectedRecord.id

              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => setSelectedRecordId(record.id)}
                  className={[
                    "audit-trail-press audit-trail-slide-in w-full rounded-lg border px-3 py-3 text-left",
                    isSelected
                      ? "border-foreground/20 bg-foreground/[0.03]"
                      : "border-border/40 hover:bg-muted/40",
                  ].join(" ")}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon icon={record.icon} size={13} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">{record.id}</p>
                      <p className="mt-1 text-sm text-foreground">{record.action}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border/40 p-4">
          <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Activity01Icon} size={14} strokeWidth={1.5} />
              <span>Immutable accountability record</span>
            </div>
            <span className="rounded-md border border-border/60 px-2 py-1 text-xs text-muted-foreground">
              {selectedRecord.decision}
            </span>
          </div>

          {surface === "index" && (
            <div className="mt-4 space-y-3">
              {AUDIT_RECORDS.map((record) => (
                <div key={record.id} className="rounded-lg border border-border/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{record.action}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{record.id}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{record.createdAt}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Reviewer: {record.reviewer} · Linked activity event: {record.linkedTimelineEvent}
                  </p>
                </div>
              ))}
            </div>
          )}

          {surface === "record" && (
            <div className="audit-trail-slide-in mt-4 space-y-4">
              <div className="rounded-lg border border-border/40 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{selectedRecord.id}</span>
                  <span>·</span>
                  <span>{selectedRecord.createdAt}</span>
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">{selectedRecord.action}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {selectedRecord.rationale}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-border/40 p-3">
                  <p className="text-xs text-muted-foreground">Actor</p>
                  <p className="mt-1 text-sm text-foreground">{selectedRecord.actor}</p>
                </div>
                <div className="rounded-md border border-border/40 p-3">
                  <p className="text-xs text-muted-foreground">Reviewer</p>
                  <p className="mt-1 text-sm text-foreground">{selectedRecord.reviewer}</p>
                </div>
                <div className="rounded-md border border-border/40 p-3">
                  <p className="text-xs text-muted-foreground">Policy reference</p>
                  <p className="mt-1 text-sm text-foreground">{selectedRecord.policyReference}</p>
                </div>
                <div className="rounded-md border border-border/40 p-3">
                  <p className="text-xs text-muted-foreground">Retention</p>
                  <p className="mt-1 text-sm text-foreground">{selectedRecord.retention}</p>
                </div>
              </div>

              <div className="rounded-md border border-border/40 p-3">
                <p className="text-xs text-muted-foreground">Evidence bundle</p>
                <div className="mt-3 space-y-2">
                  {selectedRecord.evidence.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={File01Icon} size={12} strokeWidth={1.5} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {surface === "review" && (
            <div className="audit-trail-slide-in mt-4 space-y-4">
              <div className="rounded-lg border border-border/40 p-4">
                <p className="text-xs text-muted-foreground">Review packet</p>
                <p className="mt-2 text-sm font-medium text-foreground">{selectedRecord.action}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-border/40 p-3">
                    <p className="text-xs text-muted-foreground">Disposition</p>
                    <p className="mt-1 text-sm text-foreground">{selectedRecord.decision}</p>
                  </div>
                  <div className="rounded-md border border-border/40 p-3">
                    <p className="text-xs text-muted-foreground">Linked timeline event</p>
                    <p className="mt-1 text-sm text-foreground">{selectedRecord.linkedTimelineEvent}</p>
                  </div>
                  <div className="rounded-md border border-border/40 p-3">
                    <p className="text-xs text-muted-foreground">Evidence items</p>
                    <p className="mt-1 text-sm text-foreground">{selectedRecord.evidence.length}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {REVIEW_WORKFLOWS.map((step) => (
                  <div key={step.title} className="rounded-md border border-border/40 p-3">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-border/40 bg-muted/20 p-3 text-sm text-muted-foreground">
                Once sealed, this record is not edited in place. Corrections create a
                superseding record that points back to the original receipt.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AuditTrailContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Pattern Reference</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Audit Trail
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          The audit trail is the formal accountability surface for agentic systems.
          It turns important execution events into sealed records with evidence,
          policy context, reviewers, and retention rules so later reviewers can
          reconstruct decisions without relying on memory or transient UI state.
        </p>
      </header>

      <section id="demo" className="page-section">
        <p className="section-label mb-3">Interactive</p>
        <h2 className="text-xl font-semibold tracking-tight">Demo</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          Switch between a ledger view, a single sealed record, and a review packet
          to see how the same accountability data serves daily scanability and formal
          review workflows.
        </p>

        <AuditTrailDemo />
      </section>

      <section id="anatomy" className="page-section">
        <p className="section-label mb-3">Structure</p>
        <h2 className="text-xl font-semibold tracking-tight">Anatomy</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          The audit trail is broader than a timestamped list. It packages the
          decision, the review context, and the evidence needed to defend that
          decision later.
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
            {ANATOMY.map(([element, role]) => (
              <tr key={element} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{element}</td>
                <td className="py-3">{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="record-model" className="page-section">
        <p className="section-label mb-3">Data</p>
        <h2 className="text-xl font-semibold tracking-tight">Record model</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          Each record should capture the durable fields that matter for review and
          export. If a field only matters while work is live, it usually belongs in
          the activity timeline instead.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Field
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {RECORD_MODEL.map(([field, role]) => (
              <tr key={field} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{field}</td>
                <td className="py-3">{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="review-workflows" className="page-section">
        <p className="section-label mb-3">Behavior</p>
        <h2 className="text-xl font-semibold tracking-tight">Review workflows</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          This pattern exists so formal reviewers can move from quick scan to
          defensible disposition without reconstructing the whole working session by
          hand.
        </p>

        <div className="mt-10 space-y-3">
          {REVIEW_WORKFLOWS.map((workflow) => (
            <div key={workflow.title} className="rounded-lg border border-border/40 p-4">
              <p className="text-sm font-medium text-foreground">{workflow.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {workflow.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="relationship-to-activity-timeline" className="page-section">
        <p className="section-label mb-3">Relationship</p>
        <h2 className="text-xl font-semibold tracking-tight">Relationship to Activity Timeline</h2>
        <div
          className="mt-10 space-y-4 font-serif text-base"
          style={{
            lineHeight: "26px",
            letterSpacing: "-0.4px",
            fontVariationSettings: '"opsz" 12',
          }}
        >
          <p>
            <Link
              href="/activity-timeline"
              className="text-foreground underline underline-offset-4"
            >
              Activity Timeline
            </Link>{" "}
            is the execution stream: what is happening right now, what happened
            recently, and how to filter the flow of work.
          </p>
          <p>
            Audit Trail is the accountability surface: which of those events became
            official records, which reviewer owned the disposition, and what evidence
            must travel with that decision afterward.
          </p>
          <p>
            A useful rule of thumb is that the timeline should stay lightweight and
            filterable, while the audit trail should stay durable and defensible. If
            a reviewer needs policy references, retention rules, or superseding-record
            logic, they have left the timeline and entered the audit trail.
          </p>
        </div>
      </section>

      <section id="implementation" className="page-section">
        <p className="section-label mb-3">Implementation</p>
        <h2 className="text-xl font-semibold tracking-tight">Implementation notes</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          This page lifts the accountability material out of the trust lens into the
          pattern-reference layer, while keeping Trust responsible for when these
          records are warranted and how much governance is appropriate.
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
            {IMPLEMENTATION.map(([asset, path]) => (
              <tr key={asset} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{asset}</td>
                <td className="py-3">{path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="page-section">
        <p className="section-label mb-3">Related</p>
        <h2 className="text-xl font-semibold tracking-tight">Related pages</h2>
        <div className="mt-10 space-y-2 text-sm text-muted-foreground">
          <p>
            Read the{" "}
            <Link
              href="/trust"
              className="text-foreground underline underline-offset-4"
            >
              Trust
            </Link>{" "}
            lens for the governance framing behind why records like this exist.
          </p>
          <p>
            Compare with{" "}
            <Link
              href="/activity-timeline"
              className="text-foreground underline underline-offset-4"
            >
              Activity Timeline
            </Link>{" "}
            for the live execution stream that feeds this record layer.
          </p>
          <p>
            Read the{" "}
            <Link
              href="/observability"
              className="text-foreground underline underline-offset-4"
            >
              Observability
            </Link>{" "}
            lens for adjacent oversight surfaces such as session history and error
            logs.
          </p>
        </div>
      </section>
    </article>
  )
}
