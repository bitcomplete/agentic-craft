"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  Tick01Icon,
  Cancel01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { ActionPreview } from "@/components/ui/action-preview"
import { Button } from "@/components/ui/button"
import { DecisionSurface } from "@/components/ui/decision-surface"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const APPROVAL_EMAIL = {
  recipient: "project-team@meridian.internal",
  subject: "Launch Review — customer portal v3.1 (enterprise release)",
  body: "Please find attached the Launch Review Summary for the customer portal v3.1 project brief. This submission covers all review checklist items for enterprise release with standard support coverage. The review was conducted using the current internal launch checklist.",
}

const APPROVAL_CHANGES = [
  {
    type: "add" as const,
    text: "Added Export workflow coverage mapping for CSV and JSON exports",
  },
  {
    type: "add" as const,
    text: "Added test case TC-087 for stale export cleanup",
  },
  {
    type: "remove" as const,
    text: "Removed deprecated Access workflow iteration reference",
  },
  { type: "add" as const, text: "Added current risk review summary" },
  {
    type: "remove" as const,
    text: "Removed placeholder product boundary description",
  },
]

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function ApprovalGateSection() {
  const [approvalCtrl, setApprovalCtrl] = useState({
    email: true,
    changes: false,
  })
  const [approvalAnim, setApprovalAnim] = useState(0)
  const [approvalStatus, setApprovalStatus] = useState<
    "pending" | "approved" | "denied"
  >("pending")

  const outcomeRef = useRef<HTMLDivElement>(null)

  // Focus the outcome element whenever it mounts (approved or denied)
  useEffect(() => {
    if (approvalStatus !== "pending") {
      outcomeRef.current?.focus()
    }
  }, [approvalStatus])

  const toggleApprovalControl = useCallback((key: string) => {
    setApprovalCtrl(() => {
      if (key === "email") return { email: true, changes: false }
      return { email: false, changes: true }
    })
    setApprovalStatus("pending")
    setApprovalAnim((p) => p + 1)
  }, [])

  return (
    <section id="approval-gate" className="page-section">
      <p className="section-label mb-3">Confirmation</p>
      <h2 className="text-xl font-semibold tracking-tight">Approval Gate</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Human-in-the-loop confirmation before the agent performs a consequential
        action. The user reviews the action details and explicitly approves or
        denies.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "email", label: "Send Email" },
            { key: "changes", label: "Document Changes" },
          ]}
          active={approvalCtrl}
          onToggle={toggleApprovalControl}
        />

        <div
          key={approvalAnim}
          className="rounded-lg border border-border/40 p-4 sm:p-6"
        >
          {approvalCtrl.email ? (
            /* Email approval variant */
            <div className="actions-slide-in flex flex-col gap-4">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <p className="text-sm">
                  I'd like to send the launch summary submission email. Please
                  review and approve.
                </p>
              </div>

              {approvalStatus === "pending" && (
                <div className="actions-fade-in flex flex-col gap-4">
                  <ActionPreview
                    title="Send launch summary email"
                    description={APPROVAL_EMAIL.body}
                    status="locked"
                    items={[
                      {
                        label: "Recipient",
                        value: APPROVAL_EMAIL.recipient,
                      },
                      {
                        label: "Subject",
                        value: APPROVAL_EMAIL.subject,
                      },
                      {
                        label: "Affected object",
                        value: "Project launch summary email",
                      },
                      {
                        label: "Consequence",
                        emphasis: true,
                        value:
                          "External communication is sent and cannot be recalled.",
                      },
                      {
                        label: "Cost / time",
                        value: "$0.09 estimated / under 1 min",
                      },
                      {
                        label: "Rollback",
                        emphasis: true,
                        value: "Follow-up correction only",
                      },
                    ]}
                  />

                  <div className="flex items-center gap-2">
                    <DecisionSurface.Root>
                      <DecisionSurface.Trigger
                        render={<Button type="button" size="sm" />}
                      >
                        Approve
                      </DecisionSurface.Trigger>
                      <DecisionSurface.Content>
                        <DecisionSurface.Header>
                          <DecisionSurface.Title>
                            Send this email?
                          </DecisionSurface.Title>
                          <DecisionSurface.Description>
                            The agent will send this message to the listed
                            recipient. Review the impact before approving.
                          </DecisionSurface.Description>
                        </DecisionSurface.Header>
                        <DecisionSurface.Body>
                          <DecisionSurface.ImpactList>
                            <DecisionSurface.ImpactItem label="Recipient">
                              {APPROVAL_EMAIL.recipient}
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Subject">
                              {APPROVAL_EMAIL.subject}
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Affected object">
                              Project launch summary email
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Cost / time">
                              $0.09 estimated / under 1 min
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Permission">
                              External communication approval
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Source">
                              Project brief, roadmap, launch checklist
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Reversibility">
                              Not reversible after send
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Rollback">
                              Follow-up correction only
                            </DecisionSurface.ImpactItem>
                          </DecisionSurface.ImpactList>
                        </DecisionSurface.Body>
                        <DecisionSurface.Footer>
                          <DecisionSurface.Cancel />
                          <DecisionSurface.Confirm
                            onClick={() => setApprovalStatus("approved")}
                          >
                            Approve
                          </DecisionSurface.Confirm>
                        </DecisionSurface.Footer>
                      </DecisionSurface.Content>
                    </DecisionSurface.Root>
                    <Button
                      type="button"
                      onClick={() => setApprovalStatus("denied")}
                      variant="outline"
                      size="sm"
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              )}

              {approvalStatus === "approved" && (
                <div className="actions-fade-in flex flex-col gap-3">
                  <div
                    ref={outcomeRef}
                    tabIndex={-1}
                    role="status"
                    className="border-l border-primary bg-primary/5 py-2 pl-3"
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-sm">
                        Approved — sending email to {APPROVAL_EMAIL.recipient}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setApprovalStatus("pending")}
                    variant="outline"
                    size="xs"
                  >
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      strokeWidth={1.5}
                      data-icon="inline-start"
                    />
                    Reset
                  </Button>
                </div>
              )}

              {approvalStatus === "denied" && (
                <div className="actions-fade-in flex flex-col gap-3">
                  <div
                    ref={outcomeRef}
                    tabIndex={-1}
                    role="status"
                    className="border-l border-destructive/50 bg-destructive/5 py-2 pl-3"
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-sm">
                        Denied — email will not be sent
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setApprovalStatus("pending")}
                    variant="outline"
                    size="xs"
                  >
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      strokeWidth={1.5}
                      data-icon="inline-start"
                    />
                    Reset
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Document changes variant */
            <div className="actions-slide-in flex flex-col gap-4">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <p className="text-sm">
                  I'd like to apply these changes to the project brief. Please
                  review.
                </p>
              </div>

              {approvalStatus === "pending" && (
                <div className="actions-fade-in flex flex-col gap-4">
                  <ActionPreview
                    title="Apply project brief changes"
                    description="The exact additions and removals below are locked before approval. If source material changes, this approval expires."
                    status="locked"
                    items={[
                      {
                        label: "Adds",
                        value: `${APPROVAL_CHANGES.filter((change) => change.type === "add").length} changes`,
                      },
                      {
                        label: "Removes",
                        value: `${APPROVAL_CHANGES.filter((change) => change.type === "remove").length} references`,
                      },
                      {
                        label: "Affected object",
                        value: "Project-Brief-v3.pdf",
                      },
                      {
                        label: "Consequence",
                        emphasis: true,
                        value:
                          "Document content changes and downstream review summaries must be regenerated.",
                      },
                      {
                        label: "Reversibility",
                        value: "Reversible through document history",
                      },
                      {
                        label: "Rollback",
                        emphasis: true,
                        value: "Restore previous document version",
                      },
                    ]}
                  >
                    <div className="flex flex-col gap-1.5">
                      {APPROVAL_CHANGES.map((change, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="shrink-0 text-muted-foreground select-none">
                            {change.type === "add" ? "+" : "-"}
                          </span>
                          <span className="text-muted-foreground">
                            {change.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ActionPreview>

                  <div className="flex items-center gap-2">
                    <DecisionSurface.Root>
                      <DecisionSurface.Trigger
                        render={<Button type="button" size="sm" />}
                      >
                        Approve
                      </DecisionSurface.Trigger>
                      <DecisionSurface.Content>
                        <DecisionSurface.Header>
                          <DecisionSurface.Title>
                            Apply these document changes?
                          </DecisionSurface.Title>
                          <DecisionSurface.Description>
                            The agent will update the document with the reviewed
                            additions and removals.
                          </DecisionSurface.Description>
                        </DecisionSurface.Header>
                        <DecisionSurface.Body>
                          <DecisionSurface.ImpactList>
                            <DecisionSurface.ImpactItem label="Adds">
                              {
                                APPROVAL_CHANGES.filter(
                                  (change) => change.type === "add"
                                ).length
                              }{" "}
                              changes
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Removes">
                              {
                                APPROVAL_CHANGES.filter(
                                  (change) => change.type === "remove"
                                ).length
                              }{" "}
                              references
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Affected object">
                              Project-Brief-v3.pdf
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Cost / time">
                              $0.04 estimated / under 1 min
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Permission">
                              Document edit approval
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Source">
                              Launch Policy v2 and roadmap notes
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Reversibility">
                              Reversible through document history
                            </DecisionSurface.ImpactItem>
                            <DecisionSurface.ImpactItem label="Rollback">
                              Restore previous document version
                            </DecisionSurface.ImpactItem>
                          </DecisionSurface.ImpactList>
                        </DecisionSurface.Body>
                        <DecisionSurface.Footer>
                          <DecisionSurface.Cancel />
                          <DecisionSurface.Confirm
                            onClick={() => setApprovalStatus("approved")}
                          >
                            Apply changes
                          </DecisionSurface.Confirm>
                        </DecisionSurface.Footer>
                      </DecisionSurface.Content>
                    </DecisionSurface.Root>
                    <Button
                      type="button"
                      onClick={() => setApprovalStatus("denied")}
                      variant="outline"
                      size="sm"
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              )}

              {approvalStatus === "approved" && (
                <div className="actions-fade-in flex flex-col gap-3">
                  <div
                    ref={outcomeRef}
                    tabIndex={-1}
                    role="status"
                    className="border-l border-primary bg-primary/5 py-2 pl-3"
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-sm">
                        Approved — applying{" "}
                        {
                          APPROVAL_CHANGES.filter((c) => c.type === "add")
                            .length
                        }{" "}
                        additions,{" "}
                        {
                          APPROVAL_CHANGES.filter((c) => c.type === "remove")
                            .length
                        }{" "}
                        removals
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setApprovalStatus("pending")}
                    variant="outline"
                    size="xs"
                  >
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      strokeWidth={1.5}
                      data-icon="inline-start"
                    />
                    Reset
                  </Button>
                </div>
              )}

              {approvalStatus === "denied" && (
                <div className="actions-fade-in flex flex-col gap-3">
                  <div
                    ref={outcomeRef}
                    tabIndex={-1}
                    role="status"
                    className="border-l border-destructive/50 bg-destructive/5 py-2 pl-3"
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-sm">
                        Denied — changes will not be applied
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setApprovalStatus("pending")}
                    variant="outline"
                    size="xs"
                  >
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      strokeWidth={1.5}
                      data-icon="inline-start"
                    />
                    Reset
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Approve uses primary fill; deny uses ghost/outline. Outcomes use primary
        or destructive border with a reset button.
      </p>
    </section>
  )
}
