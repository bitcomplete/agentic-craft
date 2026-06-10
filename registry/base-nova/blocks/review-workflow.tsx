"use client"

import * as React from "react"

import { ActionPreview } from "@/components/ui/action-preview"
import {
  ClarifyingQuestions,
  type ClarifyingQuestion,
  type ClarifyingQuestionValue,
} from "@/components/ui/clarifying-questions"
import { DecisionSurface } from "@/components/ui/decision-surface"
import { ObservableWork } from "@/components/ui/observable-work"
import { ReferenceItem } from "@/components/ui/reference-item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const sourceQuestion = {
  id: "source-scope",
  label: "Which source scope should I use before drafting findings?",
  description: "The answer changes what the review agent reads first.",
  kind: "single",
  options: [
    {
      value: "approved",
      label: "Approved sources",
      description: "Use only reviewed artifacts for the first pass.",
    },
    {
      value: "recent",
      label: "Recent changes",
      description: "Prioritize new files, unresolved notes, and launch deltas.",
    },
    {
      value: "all",
      label: "All sources",
      description: "Search the full workspace before producing a result.",
    },
  ],
} satisfies ClarifyingQuestion

function ReviewWorkflowBlock() {
  const [answer, setAnswer] =
    React.useState<ClarifyingQuestionValue>("approved")

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div className="rounded-lg border border-border/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Launch review workflow
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
              Collect evidence, surface gaps, ask only for missing decisions,
              and lock the final action preview before approval.
            </p>
          </div>
          <Badge variant="outline">Registry block</Badge>
        </div>
      </div>

      <ObservableWork.Root>
        <ObservableWork.Step
          status="complete"
          title="Collect source material"
          description="Read selected project brief, roadmap, launch checklist, and support notes."
          source="4 sources"
          meta="complete"
        />
        <ObservableWork.Step
          status="active"
          title="Compare claims against evidence"
          description="Check whether conclusions are backed by source excerpts and identify gaps."
          source="2 files"
          meta="running"
          defaultOpen
        >
          <ObservableWork.Detail>
            Show touched sources, claim coverage, and unresolved assumptions. Do
            not expose hidden reasoning traces.
          </ObservableWork.Detail>
        </ObservableWork.Step>
        <ObservableWork.Step
          status="pending"
          title="Prepare cited findings"
          description="Generate a reviewable summary after the evidence pass completes."
          source="pending"
        />
      </ObservableWork.Root>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ClarifyingQuestions.Root
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <ClarifyingQuestions.Step
            question={sourceQuestion}
            index={0}
            total={1}
            value={answer}
            onValueChange={(_, value) => setAnswer(value)}
          />
        </ClarifyingQuestions.Root>

        <ReferenceItem.Root>
          <ReferenceItem.Content>
            <ReferenceItem.Header>
              <ReferenceItem.Title>Review output</ReferenceItem.Title>
              <Badge variant="secondary">Blocked</Badge>
            </ReferenceItem.Header>
            <ReferenceItem.Description>
              Waiting for source scope before final synthesis.
            </ReferenceItem.Description>
            <ReferenceItem.Meta>
              Human input required / Estimated cost $0.14 / Rollback available
            </ReferenceItem.Meta>
          </ReferenceItem.Content>
        </ReferenceItem.Root>
      </div>

      <ActionPreview
        title="Send findings summary"
        description="The agent will send a cited findings summary to the review channel."
        status="locked"
        items={[
          { label: "Audience", value: "Project reviewers" },
          { label: "Affected object", value: "Launch review channel" },
          { label: "Cost / time", value: "$0.09 estimated / under 1 min" },
          { label: "Rollback", value: "Post a correction or revoke the draft" },
        ]}
      >
        <DecisionSurface.Root>
          <DecisionSurface.Trigger render={<Button type="button" size="sm" />}>
            Review approval
          </DecisionSurface.Trigger>
          <DecisionSurface.Content>
            <DecisionSurface.Header>
              <DecisionSurface.Title>
                Send the findings summary?
              </DecisionSurface.Title>
              <DecisionSurface.Description>
                The agent will send the locked summary payload with cited
                evidence to the selected review channel.
              </DecisionSurface.Description>
            </DecisionSurface.Header>
            <DecisionSurface.Body>
              <DecisionSurface.ImpactList>
                <DecisionSurface.ImpactItem label="Audience">
                  Project reviewers
                </DecisionSurface.ImpactItem>
                <DecisionSurface.ImpactItem label="Reversibility">
                  Correction can be posted after send
                </DecisionSurface.ImpactItem>
              </DecisionSurface.ImpactList>
            </DecisionSurface.Body>
            <DecisionSurface.Footer>
              <DecisionSurface.Cancel />
              <DecisionSurface.Confirm>Approve</DecisionSurface.Confirm>
            </DecisionSurface.Footer>
          </DecisionSurface.Content>
        </DecisionSurface.Root>
      </ActionPreview>
    </div>
  )
}

export { ReviewWorkflowBlock }
