"use client"

import { Badge } from "@/components/ui/badge"
import { EffectivePolicyPreview } from "@/components/ui/effective-policy-preview"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

function AgentSettingsBlock() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <FieldSet className="rounded-lg border border-border/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <FieldContent>
            <FieldTitle>Agent settings</FieldTitle>
            <FieldDescription>
              Durable controls for autonomy, approvals, notifications, and
              memory boundaries.
            </FieldDescription>
          </FieldContent>
          <Badge variant="outline">Policy</Badge>
        </div>
        <FieldGroup className="mt-4 gap-4">
          <Field orientation="horizontal">
            <Switch id="autonomy-settings" defaultChecked />
            <FieldLabel htmlFor="autonomy-settings">
              <FieldTitle>Autonomy settings</FieldTitle>
              <FieldDescription>
                Let the agent prepare drafts and analyses without external side
                effects.
              </FieldDescription>
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch id="approval-policy" defaultChecked />
            <FieldLabel htmlFor="approval-policy">
              <FieldTitle>Approval policy settings</FieldTitle>
              <FieldDescription>
                Require review for publishing, spending, external sends, and
                destructive edits.
              </FieldDescription>
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch id="memory-privacy" defaultChecked />
            <FieldLabel htmlFor="memory-privacy">
              <FieldTitle>Memory and privacy settings</FieldTitle>
              <FieldDescription>
                Store only scoped memories with source, expiry, and review
                affordances.
              </FieldDescription>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>

      <EffectivePolicyPreview
        title="Effective policy"
        policies={[
          {
            label: "Allowed",
            value: "Draft, summarize, compare sources, and prepare previews.",
            status: "allowed",
          },
          {
            label: "Requires approval",
            value: "External communication, publishing, spending, and record edits.",
            status: "required",
          },
          {
            label: "Blocked",
            value: "Saving memory without source, scope, and expiry.",
            status: "blocked",
          },
        ]}
      />
    </div>
  )
}

export { AgentSettingsBlock }
