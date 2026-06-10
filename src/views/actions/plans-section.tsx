"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckListIcon,
  Cancel01Icon,
  DragDropIcon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

const PLAN_STEPS = [
  "Load project brief",
  "Parse requirement definitions",
  "Map test cases to requirements",
  "Identify coverage gaps",
  "Generate report",
  "Review with reviewer",
]

/* ------------------------------------------------------------------ */
/*  PlanStep sub-component                                             */
/* ------------------------------------------------------------------ */

function PlanStep({
  label,
  state,
  editable,
  onRemove,
}: {
  label: string
  state: "done" | "active" | "pending"
  editable?: boolean
  onRemove?: () => void
}) {
  return (
    <div className="actions-step-enter group flex items-center gap-2.5 py-1">
      {editable && (
        <HugeiconsIcon
          icon={DragDropIcon}
          size={12}
          strokeWidth={1.5}
          className="shrink-0 cursor-grab text-muted-foreground/30"
        />
      )}
      <div
        className={`h-1.5 w-1.5 shrink-0 rounded-sm ${
          state === "done"
            ? "bg-muted-foreground"
            : state === "active"
              ? "actions-pulse-dot bg-foreground"
              : "bg-muted-foreground/30"
        }`}
      />
      <span
        className={`flex-1 text-sm ${
          state === "done"
            ? "text-muted-foreground line-through"
            : state === "active"
              ? "text-foreground"
              : "text-muted-foreground/60"
        }`}
      >
        {label}
      </span>
      {editable && onRemove && (
        <Button
          type="button"
          aria-label={`Remove step: ${label}`}
          onClick={onRemove}
          variant="ghost"
          size="icon-xs"
          className="shrink-0 text-muted-foreground/40 hover:text-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
        </Button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function PlansSection() {
  const [planState, setPlanState] = useState({
    executing: true,
    editable: false,
  })
  const [planSteps, setPlanSteps] = useState(PLAN_STEPS)
  const [activeStep, setActiveStep] = useState(3) // 0-indexed, step 4 is active

  const togglePlanControl = useCallback((key: string) => {
    setPlanState((prev) => {
      if (key === "executing")
        return { executing: !prev.executing, editable: false }
      if (key === "editable")
        return { executing: false, editable: !prev.editable }
      return prev
    })
    if (key === "editable") {
      setPlanSteps(PLAN_STEPS)
      setActiveStep(3)
    }
  }, [])

  const removePlanStep = useCallback((idx: number) => {
    setPlanSteps((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const movePlanStep = useCallback((idx: number, dir: -1 | 1) => {
    setPlanSteps((prev) => {
      const arr = [...prev]
      const target = idx + dir
      if (target < 0 || target >= arr.length) return arr
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }, [])

  return (
    <section id="plans" className="page-section">
      <p className="section-label mb-3">Planning</p>
      <h2 className="text-xl font-semibold tracking-tight">Plan Cards</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Step-progress cards that show the agent's execution plan. Completed
        steps are muted with line-through; the current step pulses subtly;
        pending steps are dimmed.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "executing", label: "Executing" },
            { key: "editable", label: "Editable" },
          ]}
          active={planState}
          onToggle={togglePlanControl}
        />

        <div className="rounded-lg border border-border/40 p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={CheckListIcon}
                size={14}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
              <span className="text-sm font-medium">
                Launch Coverage Report
              </span>
            </div>
            <Badge variant="secondary">
              {planState.executing
                ? `${Math.min(activeStep, planSteps.length)} of ${planSteps.length} complete`
                : planState.editable
                  ? `${planSteps.length} steps`
                  : `${planSteps.length} steps`}
            </Badge>
          </div>

          <div className="flex flex-col gap-0">
            {planSteps.map((step, i) => {
              let state: "done" | "active" | "pending" = "pending"
              if (planState.executing) {
                if (i < activeStep) state = "done"
                else if (i === activeStep) state = "active"
                else state = "pending"
              }

              return (
                <PlanStep
                  key={`${step}-${i}`}
                  label={step}
                  state={planState.editable ? "pending" : state}
                  editable={planState.editable}
                  onRemove={
                    planState.editable ? () => removePlanStep(i) : undefined
                  }
                />
              )
            })}
          </div>

          {planState.editable && (
            <div className="actions-fade-in mt-3 flex gap-2">
              <Button
                type="button"
                onClick={() => movePlanStep(0, 1)}
                variant="outline"
                size="xs"
              >
                Reorder steps
              </Button>
              <Button
                type="button"
                onClick={() => setPlanSteps((prev) => [...prev, "New step"])}
                variant="outline"
                size="xs"
              >
                + Add step
              </Button>
            </div>
          )}

          {planState.executing && (
            <div className="actions-fade-in mt-3 flex gap-2">
              <Button
                type="button"
                onClick={() =>
                  setActiveStep((prev) =>
                    prev < planSteps.length ? prev + 1 : prev
                  )
                }
                variant="outline"
                size="xs"
              >
                Advance step
              </Button>
              <Button
                type="button"
                onClick={() => setActiveStep(0)}
                variant="outline"
                size="xs"
              >
                Reset
              </Button>
            </div>
          )}
        </div>
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
              "Step indicator",
              "6px square dot, rounded-sm — not a checkbox or number",
            ],
            ["Done state", "Muted foreground + line-through"],
            ["Active state", "Foreground + pulse animation"],
            ["Pending state", "Muted foreground at 60% opacity"],
            [
              "Editable mode",
              "Drag handle + remove button on hover per step",
            ],
            [
              "Progress badge",
              '"N of M complete" or step count in editable mode',
            ],
          ].map(([prop, spec], i, arr) => (
            <TableRow
              key={prop}
              className={
                i < arr.length - 1 ? "border-b border-border/50" : ""
              }
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
        Plan cards give users a sense of progress and predictability. The
        editable mode allows corrections before the agent commits to an
        approach — a key trust-building pattern.
      </p>
    </section>
  )
}
