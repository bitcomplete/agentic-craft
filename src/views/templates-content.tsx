"use client"

import { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert01Icon,
  Brain01Icon,
  CheckListIcon,
  GitBranchIcon,
  HelpCircleIcon,
  Settings01Icon,
  Shield01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"

import {
  AgentStatusTable,
  type AgentStatusRow,
} from "@/components/ui/agent-status-table"
import { TemplateFlowPreview } from "@/components/reference/template-flow-preview"
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

const templateIndex = [
  {
    id: "review-workflow",
    title: "Review workflow",
    description:
      "Collect sources, inspect gaps, ask targeted follow-ups, and produce a reviewable result.",
    icon: CheckListIcon,
    primitives: "Observable Work, Reference Item",
  },
  {
    id: "approval-workflow",
    title: "Approval workflow",
    description:
      "Pause before an irreversible action and show the decision, impact, cost, and rollback path.",
    icon: Shield01Icon,
    primitives: "Decision Surface",
  },
  {
    id: "clarifying-workflow",
    title: "Clarifying workflow",
    description:
      "Ask only for missing information, keep defaults visible, and let users answer in structured form.",
    icon: HelpCircleIcon,
    primitives: "Clarifying Questions",
  },
  {
    id: "source-backed-artifact",
    title: "Source-backed artifact",
    description:
      "Turn an agent answer into a cited document with source previews, missing-source states, and usage budget.",
    icon: File01Icon,
    primitives: "Artifact Document, Source Preview",
  },
  {
    id: "memory-review",
    title: "Memory review",
    description:
      "Show what the agent wants to remember, why it matters, source provenance, and removal controls.",
    icon: Brain01Icon,
    primitives: "Reference Item",
  },
  {
    id: "run-monitor",
    title: "Run monitor",
    description:
      "Track background work, agent state, progress, cost, confidence, and blocked tasks.",
    icon: Alert01Icon,
    primitives: "Run Trace, Usage Meter",
  },
  {
    id: "multi-agent-handoff",
    title: "Multi-agent handoff",
    description:
      "Make ownership transfer visible with sender, receiver, payload, current state, and next action.",
    icon: GitBranchIcon,
    primitives: "Handoff Packet, Run Trace",
  },
  {
    id: "agent-settings",
    title: "Agent settings",
    description:
      "Give teams durable controls for autonomy, notifications, approvals, and memory boundaries.",
    icon: Settings01Icon,
    primitives: "Field, Switch, Decision Surface",
  },
] as const

const clarifyingQuestions: ClarifyingQuestion[] = [
  {
    id: "scope",
    label: "Which source set should I prioritize?",
    description: "The answer changes what the agent reads first.",
    kind: "single",
    chipPosition: "left",
    options: [
      {
        value: "recent",
        label: "Recent sources",
        description: "Start with new files and unresolved notes.",
      },
      {
        value: "approved",
        label: "Approved sources",
        description: "Use only reviewed material for the first pass.",
      },
      {
        value: "all",
        label: "All sources",
        description: "Search the whole workspace before answering.",
      },
    ],
  },
  {
    id: "constraints",
    label: "Which constraints matter most?",
    description: "Choose every constraint that should block the final action.",
    kind: "multiple",
    allowOther: true,
    otherPlaceholder: "Add a constraint or missing source…",
    layout: "stacked",
    options: [
      {
        value: "privacy",
        label: "Privacy",
        description: "Avoid using customer-identifying details.",
      },
      {
        value: "cost",
        label: "Cost",
        description: "Stop before the run exceeds the review budget.",
      },
      {
        value: "deadline",
        label: "Deadline",
        description: "Prioritize what can be resolved before planning.",
      },
    ],
  },
  {
    id: "note",
    label: "Anything the agent should avoid?",
    kind: "text",
    placeholder: "Example: Do not contact customers before approval...",
  },
]

const runAgents: AgentStatusRow[] = [
  {
    id: "collector",
    name: "Source Collector",
    role: "Gathers evidence",
    status: "working",
    task: "Reading recent source material and extracting referenced decisions.",
    progress: 64,
    confidence: 88,
    cost: "$0.18",
    updated: "12s ago",
  },
  {
    id: "mapper",
    name: "Requirements Mapper",
    role: "Checks coverage",
    status: "blocked",
    task: "Waiting on product owner answer for unresolved launch scope.",
    progress: 52,
    confidence: 71,
    cost: "$0.11",
    updated: "41s ago",
  },
  {
    id: "drafter",
    name: "Document Drafter",
    role: "Prepares output",
    status: "idle",
    task: "No drafting until source checks are complete.",
    progress: 0,
    cost: "$0.00",
    updated: "2m ago",
  },
]

const templateFlowSteps = [
  {
    label: "Collect",
    description: "Gather selected files, policies, prior decisions, and user intent.",
    icon: CheckListIcon,
    status: "input" as const,
  },
  {
    label: "Inspect",
    description: "Show observable work, touched sources, gaps, and confidence.",
    icon: Alert01Icon,
    status: "agent" as const,
  },
  {
    label: "Clarify",
    description: "Ask only for missing decisions that would otherwise be invented.",
    icon: HelpCircleIcon,
    status: "human" as const,
  },
  {
    label: "Approve",
    description: "Lock the consequence preview before external or costly actions.",
    icon: Shield01Icon,
    status: "human" as const,
  },
  {
    label: "Deliver",
    description: "Return cited output, durable memory updates, and recovery paths.",
    icon: GitBranchIcon,
    status: "output" as const,
  },
]

export function TemplatesContent() {
  const [clarifyingIndex, setClarifyingIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, ClarifyingQuestionValue>>(
    {
      scope: "approved",
      constraints: ["privacy"],
      note: "",
    }
  )
  const [otherAnswers, setOtherAnswers] = useState<Record<string, string>>({
    constraints: "",
  })
  const activeClarifyingQuestion = clarifyingQuestions[clarifyingIndex]

  return (
    <article>
      <header className="mb-12 sm:mb-20">
        <p className="section-label mb-3">WORKFLOW TEMPLATES</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Templates
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          End-to-end agentic product workflows built from registry-ready
          primitives. Templates document the sequence, states, human control
          points, and recovery behavior that a production interface needs.
        </p>
      </header>

      <section className="page-section">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="section-label mb-3">Workflow map</p>
            <h2 className="text-xl font-semibold tracking-tight">
              Review to delivery
            </h2>
            <p className="mt-2 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
              Templates should describe the whole job, not a single widget.
              This map is the reusable backbone across review, approval,
              clarification, memory, and monitoring flows.
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            5 stages
          </Badge>
        </div>
        <TemplateFlowPreview steps={templateFlowSteps} />
      </section>

      <section className="page-section">
        <p className="section-label mb-3">Template index</p>
        <div className="grid gap-3 md:grid-cols-2">
          {templateIndex.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="block"
            >
              <ReferenceItem.Root>
                <ReferenceItem.Media>
                  <HugeiconsIcon icon={template.icon} strokeWidth={1.5} />
                </ReferenceItem.Media>
                <ReferenceItem.Content>
                  <ReferenceItem.Header>
                    <ReferenceItem.Title>{template.title}</ReferenceItem.Title>
                    <Badge variant="outline">Template</Badge>
                  </ReferenceItem.Header>
                  <ReferenceItem.Description>
                    {template.description}
                  </ReferenceItem.Description>
                  <ReferenceItem.Meta>{template.primitives}</ReferenceItem.Meta>
                </ReferenceItem.Content>
              </ReferenceItem.Root>
            </Link>
          ))}
        </div>
      </section>

      <section id="review-workflow" className="page-section">
        <p className="section-label mb-3">REVIEW</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Review Workflow
        </h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Use this when the agent reviews source material and produces a result
          that a person must trust, cite, or approve.
        </p>
        <div className="mt-8">
          <ObservableWork.Root>
            <ObservableWork.Step
              status="complete"
              title="Collect source material"
              description="Read user-selected files, previous decisions, and current requirements."
              source="4 sources"
              meta="completed"
            />
            <ObservableWork.Step
              status="active"
              title="Compare claims against evidence"
              description="Check whether conclusions are backed by source excerpts."
              source="2 files"
              meta="running"
              defaultOpen
            >
              <ObservableWork.Detail>
                Show touched sources, claim coverage, and unresolved gaps. Do
                not expose speculative hidden reasoning.
              </ObservableWork.Detail>
            </ObservableWork.Step>
            <ObservableWork.Step
              status="pending"
              title="Prepare reviewable result"
              description="Generate a summary only after the evidence pass finishes."
              source="pending"
            />
          </ObservableWork.Root>
        </div>
      </section>

      <section id="approval-workflow" className="page-section">
        <p className="section-label mb-3">APPROVAL</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Approval Workflow
        </h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Use this when the agent is about to change external state, spend
          budget, notify people, or publish an output.
        </p>
        <div className="mt-8">
          <DecisionSurface.Root>
            <DecisionSurface.Trigger render={<Button variant="outline" />}>
              Review proposed action
            </DecisionSurface.Trigger>
            <DecisionSurface.Content>
              <DecisionSurface.Header>
                <DecisionSurface.Title>
                  Send the review summary?
                </DecisionSurface.Title>
                <DecisionSurface.Description>
                  The agent will send a generated summary to the selected
                  project channel and attach the current evidence list.
                </DecisionSurface.Description>
              </DecisionSurface.Header>
              <DecisionSurface.Body>
                <DecisionSurface.ImpactList>
                  <DecisionSurface.ImpactItem label="Audience">
                    Project reviewers
                  </DecisionSurface.ImpactItem>
                  <DecisionSurface.ImpactItem label="Cost">
                    $0.09 estimated
                  </DecisionSurface.ImpactItem>
                  <DecisionSurface.ImpactItem label="Rollback">
                    Follow-up correction can be posted
                  </DecisionSurface.ImpactItem>
                </DecisionSurface.ImpactList>
              </DecisionSurface.Body>
              <DecisionSurface.Footer>
                <DecisionSurface.Cancel />
                <DecisionSurface.Confirm>Approve</DecisionSurface.Confirm>
              </DecisionSurface.Footer>
            </DecisionSurface.Content>
          </DecisionSurface.Root>
        </div>
      </section>

      <section id="clarifying-workflow" className="page-section">
        <p className="section-label mb-3">CLARIFY</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Clarifying Workflow
        </h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Ask for missing product decisions in a structured way, with defaults
          visible and no conversational guesswork.
        </p>
        <div className="mt-8">
          <ClarifyingQuestions.Root
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <ClarifyingQuestions.Step
              question={activeClarifyingQuestion}
              index={clarifyingIndex}
              total={clarifyingQuestions.length}
              value={answers[activeClarifyingQuestion.id]}
              otherValue={otherAnswers[activeClarifyingQuestion.id]}
              onValueChange={(id, value) =>
                setAnswers((current) => ({ ...current, [id]: value }))
              }
              onOtherValueChange={(id, value) =>
                setOtherAnswers((current) => ({ ...current, [id]: value }))
              }
              onSkip={() =>
                setClarifyingIndex((current) =>
                  Math.min(current + 1, clarifyingQuestions.length - 1)
                )
              }
              onContinue={() =>
                setClarifyingIndex((current) =>
                  Math.min(current + 1, clarifyingQuestions.length - 1)
                )
              }
            />
          </ClarifyingQuestions.Root>
        </div>
      </section>

      <section id="memory-review" className="page-section">
        <p className="section-label mb-3">MEMORY</p>
        <h2 className="text-xl font-semibold tracking-tight">Memory Review</h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Show proposed memory before it becomes durable product context.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <ReferenceItem.Root>
            <ReferenceItem.Media>
              <HugeiconsIcon icon={Brain01Icon} strokeWidth={1.5} />
            </ReferenceItem.Media>
            <ReferenceItem.Content>
              <ReferenceItem.Header>
                <ReferenceItem.Title>
                  Preferred review format
                </ReferenceItem.Title>
                <Badge variant="secondary">Proposed</Badge>
              </ReferenceItem.Header>
              <ReferenceItem.Description>
                Use concise source-backed summaries for future review tasks.
              </ReferenceItem.Description>
              <ReferenceItem.Meta>
                Source: current session / Scope: this workspace / Expiry: 90
                days
              </ReferenceItem.Meta>
            </ReferenceItem.Content>
            <ReferenceItem.Actions>
              <Button size="sm" variant="outline">
                Save
              </Button>
              <Button size="sm" variant="ghost">
                Dismiss
              </Button>
            </ReferenceItem.Actions>
          </ReferenceItem.Root>
        </div>
      </section>

      <section id="run-monitor" className="page-section">
        <p className="section-label mb-3">MONITOR</p>
        <h2 className="text-xl font-semibold tracking-tight">Run Monitor</h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Use this template when agent work continues after the user leaves the
          composer.
        </p>
        <div className="mt-8">
          <AgentStatusTable agents={runAgents} />
        </div>
      </section>

      <section id="multi-agent-handoff" className="page-section">
        <p className="section-label mb-3">HANDOFF</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Multi-Agent Handoff
        </h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Make ownership transfer explicit so users can see who has the task and
          what context moved with it.
        </p>
        <div className="mt-8">
          <ObservableWork.Root>
            <ObservableWork.Step
              status="complete"
              title="Source Collector prepared packet"
              description="Sources, open questions, and confidence notes were grouped."
              source="Packet v2"
            />
            <ObservableWork.Step
              status="active"
              title="Requirements Mapper accepted handoff"
              description="The receiving agent is checking whether the packet is enough to proceed."
              source="handoff"
              defaultOpen
            >
              <ObservableWork.Detail>
                Handoff payloads should show sender, receiver, carried context,
                omissions, and the next expected action.
              </ObservableWork.Detail>
            </ObservableWork.Step>
          </ObservableWork.Root>
        </div>
      </section>

      <section id="agent-settings" className="page-section">
        <p className="section-label mb-3">SETTINGS</p>
        <h2 className="text-xl font-semibold tracking-tight">Agent Settings</h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Agentic products need durable controls, not only per-action prompts.
        </p>
        <FieldGroup className="mt-8 border-y border-border/70 py-4">
          <FieldSet>
            <Field orientation="horizontal">
              <Switch id="approval-required" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="approval-required">
                  Require approval for external actions
                </FieldLabel>
                <FieldDescription>
                  The agent must ask before sending, publishing, or modifying
                  shared records.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Switch id="memory-review-required" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="memory-review-required">
                  Review proposed memories
                </FieldLabel>
                <FieldDescription>
                  Durable memory changes appear in a review queue before being
                  saved.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field>
              <FieldContent>
                <FieldTitle>Registry mapping</FieldTitle>
                <FieldDescription>
                  Settings templates compose shadcn Field, Switch, Decision
                  Surface, and Reference Item instead of shipping as one rigid
                  settings screen.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldSet>
        </FieldGroup>
      </section>

      <section className="page-section">
        <p className="border-l-2 border-muted-foreground/15 pl-4 text-sm leading-relaxed text-muted-foreground italic">
          Templates are intentionally site-level guidance. The registry exports
          the smaller primitives underneath them so teams can adapt the workflow
          to their own product surface.
        </p>
      </section>
    </article>
  )
}
