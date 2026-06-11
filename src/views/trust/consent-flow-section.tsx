"use client"

import { useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Shield01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConsentFlowSection() {
  const [consentCtrl, consentAnimKey, consentToggle] = useExclusiveToggle({
    prompt: true,
    accepted: false,
    declined: false,
  })
  const consentOutcomeRef = useRef<HTMLDivElement>(null)
  const consentFocusPending = useRef(false)

  /* Approve/Decline unmount the focused button — move focus to the outcome */
  useEffect(() => {
    if (
      consentFocusPending.current &&
      (consentCtrl.accepted || consentCtrl.declined)
    ) {
      consentFocusPending.current = false
      consentOutcomeRef.current?.focus()
    }
  }, [consentCtrl])

  return (
    <section id="consent-flow" className="page-section">
      <p className="section-label mb-3">Permissions</p>
      <h2 className="text-xl font-semibold tracking-tight">Consent Flow</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Explicit user consent before the agent takes sensitive or irreversible
        actions. Users can accept, decline, or learn more before deciding.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "prompt", label: "Prompt" },
            { key: "accepted", label: "Accepted" },
            { key: "declined", label: "Declined" },
          ]}
          active={consentCtrl}
          onToggle={consentToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={consentAnimKey}
        >
          <div className="trust-slide-in">
            {/* Consent prompt state */}
            {consentCtrl.prompt && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={Shield01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Action requires your approval
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      The agent wants to send a project finding summary to the
                      developer contact for Meridian Customer Portal v3.1.
                    </p>
                  </div>
                </div>
                <div className="ml-10 border-l border-border/60 bg-muted/30 py-3 pl-4">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Action preview
                  </p>
                  <p className="text-sm">
                    Email 2 findings (Export workflow, Timestamp handling) to
                    project-owner@meridian.internal with a 10-day response
                    deadline.
                  </p>
                </div>
                <div className="ml-10 flex items-center gap-3">
                  <Button
                    onClick={() => {
                      consentFocusPending.current = true
                      consentToggle("accepted")
                    }}
                    size="xs"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      consentFocusPending.current = true
                      consentToggle("declined")
                    }}
                    variant="outline"
                    size="xs"
                  >
                    Decline
                  </Button>
                  <Button
                    variant="link"
                    size="xs"
                    className="text-muted-foreground"
                  >
                    Learn more
                  </Button>
                </div>
              </div>
            )}

            {/* Accepted state */}
            {consentCtrl.accepted && (
              <div
                ref={consentOutcomeRef}
                tabIndex={-1}
                className="flex flex-col gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div role="status">
                    <p className="text-sm font-medium">Action approved</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Email sent to project-owner@meridian.internal with 2
                      findings. Response deadline: March 25, 2026.
                    </p>
                  </div>
                </div>
                <div className="ml-10">
                  <Button
                    onClick={() => consentToggle("prompt")}
                    variant="outline"
                    size="xs"
                  >
                    Reset demo
                  </Button>
                </div>
              </div>
            )}

            {/* Declined state */}
            {consentCtrl.declined && (
              <div
                ref={consentOutcomeRef}
                tabIndex={-1}
                className="flex flex-col gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div role="status">
                    <p className="text-sm font-medium">Action declined</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      The email was not sent. You can change this in settings or
                      approve the action later from the activity log.
                    </p>
                  </div>
                </div>
                <div className="ml-10">
                  <Button
                    onClick={() => consentToggle("prompt")}
                    variant="outline"
                    size="xs"
                  >
                    Reset demo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spec table */}
      <div className="mt-8">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Value
              </TableHead>
              <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Notes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Trigger
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Sensitive or irreversible actions
              </TableCell>
              <TableCell className="py-2.5">
                Emails, deletions, external API calls
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                States
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Prompt → Accepted / Declined
              </TableCell>
              <TableCell className="py-2.5">
                Three mutually exclusive states
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Action preview
              </TableCell>
              <TableCell className="py-2.5 pr-4">Required</TableCell>
              <TableCell className="py-2.5">
                Shows exactly what will happen before user decides
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Reversibility
              </TableCell>
              <TableCell className="py-2.5 pr-4">Settings override</TableCell>
              <TableCell className="py-2.5">
                Declined actions can be re-approved later
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Callout */}
      <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Consent flows should be lightweight enough that users don’t develop
        "approval fatigue." Reserve them for actions with real consequences —
        sending external communications, modifying project records, or deleting
        source material.
      </div>
    </section>
  )
}
