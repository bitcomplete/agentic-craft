"use client"

import * as React from "react"
import {
  Cancel01Icon,
  Shield01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PatternDemo } from "@/components/reference/pattern-demo"
import { PatternPage } from "@/components/reference/pattern-page"
import { PatternSection } from "@/components/reference/pattern-section"
import { PatternSpecTable } from "@/components/reference/pattern-spec-table"
import { ActionPreview } from "@/components/ui/action-preview"
import { Button } from "@/components/ui/button"
import { DecisionSurface } from "@/components/ui/decision-surface"
import { EffectivePolicyPreview } from "@/components/ui/effective-policy-preview"
import { cn } from "@/lib/utils"

import {
  AUTONOMY_LEVELS,
  COMPONENTS_USED,
  COMPOSITION_RECIPE,
  PRINCIPLES_DEFENDED,
  type AutonomyLevel,
} from "./autonomy-contract-data"

const SPECTRUM_COPY =
  "Suggest -> Recommend -> Execute with confirm -> Execute -> Initiate"

function AutonomyContractContent() {
  const [activeIndex, setActiveIndex] = React.useState(2)
  const activeLevel = AUTONOMY_LEVELS[activeIndex]

  const componentRows = React.useMemo(
    () =>
      COMPONENTS_USED.map((item) => ({
        element: (
          <a
            href="/registry#primitives"
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            {item.element}
          </a>
        ),
        spec: item.spec,
      })),
    []
  )

  return (
    <PatternPage
      eyebrow="Pattern Card"
      title="Autonomy Contract"
      description="Autonomy is not a preference buried in settings. It is a visible agreement about what the agent may do, what it must show, and where the user can still stop it."
    >
      <section
        id="autonomy-contract"
        className="mb-10 grid scroll-mt-20 gap-4 border-y border-border/60 py-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
      >
        <div>
          <p className="section-label mb-2">Thesis</p>
          <p className="font-serif text-2xl font-light tracking-tight text-balance">
            Autonomy is a contract, not a slider.
          </p>
        </div>
        <div className="min-w-0">
          <p className="section-label mb-2">Principles defended</p>
          <div className="flex flex-wrap gap-2">
            {PRINCIPLES_DEFENDED.map((principle) => (
              <span
                key={principle.title}
                className="rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {principle.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PatternDemo
        title="Autonomy spectrum scrubber"
        description="Drag, click, or use the keyboard. The product surface below changes as the contract moves from advice to background initiation."
      >
        <AutonomySpectrum activeIndex={activeIndex} onChange={setActiveIndex} />
        <AutonomyWorkedExample level={activeLevel} />
      </PatternDemo>

      <PatternSection
        id="why-it-matters"
        eyebrow="Why it matters"
        title="The level name is not the contract"
        description="A product can call something Human-in-the-loop and still make the user guess what will happen next. The interface has to carry the agreement."
      >
        <div className="mt-6 grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-2">
          <p>
            The same task should look different when the agent is suggesting,
            recommending, waiting for approval, executing inside policy, or
            initiating from a trigger. Confirmation controls, locked previews,
            pause affordances, policy rows, and audit links are the contract the
            user can inspect.
          </p>
          <p>
            Higher autonomy should not make the surface quieter. It should make
            the boundaries more visible: what started the run, what scope is
            still blocked, what can be stopped, and what proof remains after the
            agent acts.
          </p>
        </div>
      </PatternSection>

      <PatternSection
        id="principles-defended"
        eyebrow="Principles"
        title="What the pattern defends"
      >
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {PRINCIPLES_DEFENDED.map((principle) => (
            <div
              key={principle.title}
              className="border-l border-border/70 bg-muted/20 py-3 pl-4"
            >
              <h3 className="text-sm font-medium text-foreground">
                {principle.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </PatternSection>

      <PatternSection
        id="components-used"
        eyebrow="Components used"
        title="Registry pieces in this composition"
      >
        <div className="mt-8">
          <PatternSpecTable rows={componentRows} />
        </div>
      </PatternSection>

      <PatternSection
        id="composition-recipe"
        eyebrow="Composition recipe"
        title="Compose the contract from the selected level"
        description="Keep level data explicit, then let each primitive render the consequence, policy, and visible command for the current contract."
      >
        <pre className="mt-8 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-6 text-muted-foreground">
          <code>{COMPOSITION_RECIPE}</code>
        </pre>
      </PatternSection>
    </PatternPage>
  )
}

function AutonomySpectrum({
  activeIndex,
  onChange,
}: {
  activeIndex: number
  onChange: (index: number) => void
}) {
  const activeLevel = AUTONOMY_LEVELS[activeIndex]

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-label mb-2">Spectrum</p>
          <p
            id="autonomy-spectrum-description"
            className="text-sm leading-6 text-foreground"
          >
            {SPECTRUM_COPY}
          </p>
        </div>
        <div className="rounded-md bg-background px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border/70">
          Level {activeIndex + 1} of {AUTONOMY_LEVELS.length}:{" "}
          {activeLevel.label}
        </div>
      </div>

      <label htmlFor="autonomy-contract-range" className="sr-only">
        Autonomy contract level
      </label>
      <input
        id="autonomy-contract-range"
        type="range"
        min={0}
        max={AUTONOMY_LEVELS.length - 1}
        step={1}
        value={activeIndex}
        aria-describedby="autonomy-spectrum-description"
        aria-valuetext={activeLevel.label}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="mt-4 h-10 w-full cursor-pointer accent-foreground"
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-5">
        {AUTONOMY_LEVELS.map((level, index) => {
          const selected = index === activeIndex

          return (
            <button
              key={level.id}
              type="button"
              aria-label={`Set autonomy level to ${level.label}`}
              aria-pressed={selected}
              onClick={() => onChange(index)}
              className={cn(
                "min-h-11 rounded-md border px-2 py-2 text-left text-xs font-medium focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected
                  ? "border-foreground/20 bg-background text-foreground ring-1 ring-border"
                  : "border-border/60 bg-transparent text-muted-foreground"
              )}
            >
              <span className="block tabular-nums">0{index + 1}</span>
              <span className="mt-1 block">{level.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AutonomyWorkedExample({ level }: { level: AutonomyLevel }) {
  const primaryVariant =
    level.id === "suggest" || level.id === "execute"
      ? "outline"
      : level.id === "initiate"
        ? "destructive"
        : "default"

  return (
    <div
      key={level.id}
      className="trust-slide-in mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]"
      aria-live="polite"
    >
      <div className="min-w-0 rounded-lg border border-border/60 bg-background p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="section-label mb-2">Worked example</p>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Meridian release follow-up
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {level.contract}
            </p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {level.statusLabel}
          </span>
        </div>

        <ActionPreview
          className="mt-5"
          title={level.actionTitle}
          description={level.actionDescription}
          status={level.previewStatus}
          items={[
            {
              label: "Affected object",
              value: "Release checklist follow-up",
            },
            {
              label: "Source set",
              value: "Launch checklist, risk log, owner thread",
            },
            {
              label: "User role",
              value: level.userRole,
            },
            {
              label: "Cost / time",
              value: "$0.18 estimated / under 2 min",
            },
            {
              label: "Consequence",
              value: level.consequence,
              emphasis: true,
            },
            {
              label: "Rollback",
              value: level.rollback,
              emphasis: true,
            },
          ]}
        >
          <div className="grid gap-2 sm:grid-cols-3">
            {level.visibleAffordances.map((affordance) => (
              <div
                key={affordance}
                className="rounded-md bg-background px-2.5 py-2 text-xs leading-5 text-muted-foreground ring-1 ring-border/60"
              >
                {affordance}
              </div>
            ))}
          </div>
        </ActionPreview>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {level.id === "execute-confirm" ? (
            <ConfirmActionButton level={level} />
          ) : (
            <Button type="button" variant={primaryVariant} size="sm">
              {level.primaryAction}
            </Button>
          )}
          {level.secondaryActions.map((action) => (
            <Button key={action} type="button" variant="outline" size="sm">
              {action}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <EffectivePolicyPreview
          title="Current autonomy contract"
          policies={level.policies}
        />
        <CapabilityLists level={level} />
      </div>
    </div>
  )
}

function ConfirmActionButton({ level }: { level: AutonomyLevel }) {
  return (
    <DecisionSurface.Root>
      <DecisionSurface.Trigger render={<Button type="button" size="sm" />}>
        {level.primaryAction}
      </DecisionSurface.Trigger>
      <DecisionSurface.Content>
        <DecisionSurface.Header>
          <DecisionSurface.Title>Approve this action?</DecisionSurface.Title>
          <DecisionSurface.Description>
            The agent will send the locked message exactly as previewed. Review
            the impact before approving.
          </DecisionSurface.Description>
        </DecisionSurface.Header>
        <DecisionSurface.Body>
          <DecisionSurface.ImpactList>
            <DecisionSurface.ImpactItem label="Affected object">
              Release checklist follow-up
            </DecisionSurface.ImpactItem>
            <DecisionSurface.ImpactItem label="Recipient">
              release-owner@meridian.internal
            </DecisionSurface.ImpactItem>
            <DecisionSurface.ImpactItem label="Source">
              Launch checklist, risk log, owner thread
            </DecisionSurface.ImpactItem>
            <DecisionSurface.ImpactItem label="Cost / time">
              $0.18 estimated / under 2 min
            </DecisionSurface.ImpactItem>
            <DecisionSurface.ImpactItem label="Consequence">
              {level.consequence}
            </DecisionSurface.ImpactItem>
            <DecisionSurface.ImpactItem label="Rollback">
              {level.rollback}
            </DecisionSurface.ImpactItem>
          </DecisionSurface.ImpactList>
        </DecisionSurface.Body>
        <DecisionSurface.Footer>
          <DecisionSurface.Cancel />
          <DecisionSurface.Confirm>
            {level.primaryAction}
          </DecisionSurface.Confirm>
        </DecisionSurface.Footer>
      </DecisionSurface.Content>
    </DecisionSurface.Root>
  )
}

function CapabilityLists({ level }: { level: AutonomyLevel }) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={Shield01Icon}
          size={14}
          strokeWidth={1.5}
          className="text-muted-foreground"
          aria-hidden="true"
        />
        <h3 className="text-sm font-medium text-foreground">
          Boundaries at this level
        </h3>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <BoundaryList title="May do" icon="allow" items={level.agentMay} />
        <BoundaryList title="Must show" icon="show" items={level.agentMust} />
        <BoundaryList
          title="Still blocked"
          icon="block"
          items={level.notAllowed}
        />
      </div>
    </div>
  )
}

function BoundaryList({
  title,
  icon,
  items,
}: {
  title: string
  icon: "allow" | "show" | "block"
  items: string[]
}) {
  const iconNode =
    icon === "block"
      ? Cancel01Icon
      : icon === "show"
        ? Shield01Icon
        : Tick01Icon

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-foreground">{title}</p>
      <ul role="list" className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <HugeiconsIcon
              icon={iconNode}
              size={12}
              strokeWidth={1.5}
              className="mt-1 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs leading-5 text-muted-foreground">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { AutonomyContractContent }
