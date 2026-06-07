"use client"

import * as React from "react"

import {
  ClarifyingQuestions,
  type ClarifyingQuestion,
  type ClarifyingQuestionValue,
} from "@/components/ui/clarifying-questions"
import { Badge } from "@/components/ui/badge"
import { ObservableWork } from "@/components/ui/observable-work"

const questions: ClarifyingQuestion[] = [
  {
    id: "release-scope",
    label: "Which release scope should the agent validate?",
    description:
      "This prevents the agent from inventing whether the review covers pilot or enterprise launch.",
    kind: "single",
    skippable: true,
    options: [
      {
        value: "enterprise",
        label: "Enterprise release",
        description: "Use the highest-risk launch scope and support policy.",
      },
      {
        value: "pilot",
        label: "Pilot release",
        description: "Limit review to the pilot customer cohort.",
      },
      {
        value: "unsure",
        label: "Keep blocked",
        description: "Do not continue until the owner confirms scope.",
      },
    ],
  },
]

function ClarifyingWorkflowBlock() {
  const [value, setValue] =
    React.useState<ClarifyingQuestionValue>("enterprise")

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 border-l border-border/70 bg-muted/20 px-3 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              Clarifying workflow
            </p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Ask only for the missing decision that blocks useful work.
            </p>
          </div>
          <Badge variant="outline">Input required</Badge>
        </div>

        <ClarifyingQuestions.Root
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <ClarifyingQuestions.Step
            question={questions[0]}
            index={0}
            total={1}
            value={value}
            onValueChange={(_, nextValue) => setValue(nextValue)}
          />
        </ClarifyingQuestions.Root>
      </div>

      <ObservableWork.Root>
        <ObservableWork.Step
          status="complete"
          title="Found missing release scope"
          description="The draft references enterprise release and pilot release in different places."
          source="Project brief v3"
          meta="detected"
        />
        <ObservableWork.Step
          status="active"
          title="Paused dependent synthesis"
          description="The agent waits before producing findings that would rely on an invented assumption."
          source="Launch review run"
          meta="blocked"
          defaultOpen
        >
          <ObservableWork.Detail>
            Clarifying questions should resume the same run with a validated
            response payload and an explicit skipped/default state.
          </ObservableWork.Detail>
        </ObservableWork.Step>
      </ObservableWork.Root>
    </div>
  )
}

export { ClarifyingWorkflowBlock }
