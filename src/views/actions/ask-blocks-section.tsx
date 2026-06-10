"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  ClarifyingQuestions,
  type ClarifyingQuestion,
} from "@/components/ui/clarifying-questions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CLARIFYING_OPTIONS = [
  {
    id: "support",
    title: "Support readiness",
    description: "Owners, coverage, response windows.",
  },
  {
    id: "timeline",
    title: "Timeline risk",
    description: "Release date versus review milestones.",
  },
  {
    id: "onboarding",
    title: "Enterprise onboarding",
    description: "Scope, owner, and success criteria.",
  },
  {
    id: "open-assumptions",
    title: "Open assumptions",
    description: "Unresolved decisions before drafting.",
  },
] as const

const CLARIFYING_QUESTION = {
  id: "launch-areas",
  label: "Which launch areas should I inspect before drafting findings?",
  kind: "multiple",
  options: CLARIFYING_OPTIONS.map((option) => ({
    value: option.id,
    label: option.title,
    description: option.description,
  })),
  allowOther: true,
  otherPlaceholder: "Describe a constraint, missing source, or review angle…",
  layout: "inline",
  chipPosition: "right",
  nextLabel: "Continue",
} satisfies ClarifyingQuestion

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function AskBlocksSection() {
  const [askState, setAskState] = useState({ open: true, answered: false })
  const [selectedClarifications, setSelectedClarifications] = useState<
    string[]
  >(["support"])
  const [askOther, setAskOther] = useState("")
  const [askSubmitted, setAskSubmitted] = useState(false)

  const toggleAskControl = useCallback((key: string) => {
    if (key === "open") {
      setAskState({ open: true, answered: false })
      setSelectedClarifications(["support"])
      setAskOther("")
      setAskSubmitted(false)
    } else {
      setAskState({ open: false, answered: true })
      setSelectedClarifications(["support", "timeline"])
      setAskOther("Enterprise release with standard support coverage")
      setAskSubmitted(true)
    }
  }, [])

  const handleAskSubmit = useCallback(() => {
    if (selectedClarifications.length === 0 && !askOther.trim()) return
    setAskSubmitted(true)
    setAskState({ open: false, answered: true })
  }, [askOther, selectedClarifications.length])

  const handleAskSkip = useCallback(() => {
    setSelectedClarifications([])
    setAskOther("")
    setAskSubmitted(true)
    setAskState({ open: false, answered: true })
  }, [])

  const answeredClarifications = [
    ...CLARIFYING_OPTIONS.filter((option) =>
      selectedClarifications.includes(option.id)
    ).map((option) => option.title),
    ...(askOther.trim() ? [`Other: ${askOther.trim()}`] : []),
  ]

  return (
    <section id="ask-blocks" className="page-section">
      <p className="section-label mb-3">Clarification</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Clarifying Questions
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        When the agent is blocked by missing intent, ask a focused question with
        answerable options, optional free text, and a clear skip path. This
        keeps clarification out of a vague back-and-forth chat loop.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "open", label: "Open" },
            { key: "answered", label: "Answered" },
          ]}
          active={askState}
          onToggle={toggleAskControl}
        />

        {!askSubmitted ? (
          <ClarifyingQuestions.Root
            className="actions-fade-in mt-5"
            onSubmit={(event) => {
              event.preventDefault()
              handleAskSubmit()
            }}
          >
            <ClarifyingQuestions.Step
              question={CLARIFYING_QUESTION}
              index={0}
              total={1}
              value={selectedClarifications}
              otherValue={askOther}
              onValueChange={(_, value) =>
                setSelectedClarifications(
                  Array.isArray(value) ? value : value ? [value] : []
                )
              }
              onOtherValueChange={(_, value) => setAskOther(value)}
              onSkip={handleAskSkip}
              onContinue={handleAskSubmit}
            />
          </ClarifyingQuestions.Root>
        ) : (
          <div className="actions-fade-in mt-5 flex flex-col gap-3 border-l border-border/60 bg-foreground/[0.02] px-3 py-3">
            <div>
              {answeredClarifications.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {answeredClarifications.map((answer) => (
                    <span
                      key={answer}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 text-xs text-foreground"
                    >
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      {answer}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Clarification skipped
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon
                icon={Tick01Icon}
                size={12}
                strokeWidth={1.5}
                className="shrink-0"
              />
              <span>Answer recorded — continuing with scoped analysis</span>
            </div>
          </div>
        )}
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Property
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Spec
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Question shape",
              "One focused question with 2-5 answerable options",
            ],
            [
              "Selection",
              "Single or multi-select rows with explicit selected state",
            ],
            [
              "Other input",
              "Inline textarea for constraints that do not fit the options",
            ],
            [
              "Skip path",
              "Visible skip control when the agent can continue with defaults",
            ],
            [
              "Submit",
              "Continue disabled until an option or free-text answer exists",
            ],
            [
              "Answered state",
              "Selected answers collapse into readable chips before work resumes",
            ],
          ].map(([prop, spec], i, arr) => (
            <TableRow
              key={prop}
              className={i < arr.length - 1 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-3 pr-6 font-medium">{prop}</TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {spec}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Clarifying questions should reduce ambiguity, not create a survey.
        Prefer choices when the agent can name the likely answers. Use the
        free-text row only for constraints, missing context, or edge cases.
      </p>
    </section>
  )
}
