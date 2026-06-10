"use client"

import * as React from "react"

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
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type ClarifyingQuestionKind = "text" | "single" | "multiple"
type ClarifyingQuestionsLayout = "inline" | "stacked"
type ClarifyingQuestionsChipPosition = "left" | "right"

type ClarifyingQuestionOption = {
  value: string
  label: string
  description?: string
}

type ClarifyingQuestion = {
  id: string
  label: string
  description?: string
  kind: ClarifyingQuestionKind
  placeholder?: string
  options?: ClarifyingQuestionOption[]
  required?: boolean
  allowOther?: boolean
  otherPlaceholder?: string
  skippable?: boolean
  layout?: ClarifyingQuestionsLayout
  chipPosition?: ClarifyingQuestionsChipPosition
  nextLabel?: string
}

type ClarifyingQuestionValue = string | string[]

function ClarifyingQuestionsRoot({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      data-slot="clarifying-questions"
      className={cn(
        "flex flex-col gap-2.5 rounded-lg border border-border bg-background p-2 sm:gap-4 sm:p-4",
        className
      )}
      {...props}
    />
  )
}

function ClarifyingQuestionsHeader({
  current = 0,
  total = 1,
  onSkip,
  skipLabel = "Skip",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  current?: number
  total?: number
  onSkip?: () => void
  skipLabel?: string
}) {
  return (
    <div
      data-slot="clarifying-questions-header"
      className={cn("flex items-center justify-between gap-3", className)}
      {...props}
    >
      <p className="text-xs text-muted-foreground">
        Question {current + 1} of {total}
      </p>
      {onSkip && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onSkip}
          className="h-7 px-2 text-muted-foreground"
        >
          {skipLabel}
        </Button>
      )}
    </div>
  )
}

function ClarifyingQuestionsList({
  className,
  ...props
}: React.ComponentProps<typeof FieldGroup>) {
  return <FieldGroup className={cn("gap-4", className)} {...props} />
}

function ClarifyingQuestionField({
  question,
  value,
  onValueChange,
}: {
  question: ClarifyingQuestion
  value?: ClarifyingQuestionValue
  onValueChange?: (id: string, value: ClarifyingQuestionValue) => void
}) {
  const descriptionId = question.description
    ? `${question.id}-description`
    : undefined

  if (question.kind === "single" || question.kind === "multiple") {
    const current = Array.isArray(value)
      ? value
      : typeof value === "string" && value
        ? [value]
        : []
    const multiple = question.kind === "multiple"

    return (
      <FieldSet>
        <Field>
          <FieldContent>
            <FieldTitle>{question.label}</FieldTitle>
            {question.description && (
              <FieldDescription id={descriptionId}>
                {question.description}
              </FieldDescription>
            )}
          </FieldContent>
          <ToggleGroup
            multiple={multiple}
            value={current}
            onValueChange={(next) => {
              if (multiple) { onValueChange?.(question.id, next); return }
              const value = next.at(-1)
              if (value === undefined) return
              onValueChange?.(question.id, value)
            }}
            aria-describedby={descriptionId}
            size="sm"
            spacing={1}
            className="flex-wrap"
          >
            {(question.options ?? []).map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={option.label}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
      </FieldSet>
    )
  }

  return (
    <Field data-required={question.required ? true : undefined}>
      <FieldLabel htmlFor={question.id}>{question.label}</FieldLabel>
      {question.description && (
        <FieldDescription id={descriptionId}>
          {question.description}
        </FieldDescription>
      )}
      <InputGroup>
        <InputGroupInput
          id={question.id}
          name={question.id}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onValueChange?.(question.id, event.target.value)}
          placeholder={question.placeholder}
          aria-describedby={descriptionId}
          required={question.required}
        />
      </InputGroup>
    </Field>
  )
}

function ClarifyingQuestionOptionRow({
  option,
  index,
  selected,
  onSelect,
  multiple = true,
  layout = "inline",
  chipPosition = "right",
}: {
  option: ClarifyingQuestionOption
  index: number
  selected?: boolean
  onSelect?: () => void
  multiple?: boolean
  layout?: ClarifyingQuestionsLayout
  chipPosition?: ClarifyingQuestionsChipPosition
}) {
  const chip = (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md border text-[11px] tabular-nums transition-colors",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground"
      )}
      aria-hidden="true"
    >
      {index + 1}
    </span>
  )

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={multiple ? `${selected ? "Deselect" : "Select"} ${option.label}` : option.label}
      onClick={onSelect}
      className={cn(
        "group flex min-h-11 w-full gap-2 rounded-md border px-2.5 py-1.5 text-left transition-[background-color,border-color,box-shadow] hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:gap-3 sm:px-3 sm:py-2.5",
        layout === "inline" ? "items-center" : "items-start",
        selected
          ? "border-foreground/25 bg-foreground/[0.04]"
          : "border-border/60"
      )}
    >
      {chipPosition === "left" && chip}
      <span
        className={cn(
          "min-w-0 flex-1",
          layout === "inline"
            ? "flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
            : "flex flex-col gap-0.5"
        )}
      >
        <span
          className={cn(
            "text-sm font-medium text-foreground",
            layout === "inline" ? "shrink-0" : "block truncate"
          )}
        >
          {option.label}
        </span>
        {option.description && (
          <span
            className={cn(
              "text-xs leading-snug text-muted-foreground",
              layout === "inline"
                ? "min-w-0 flex-1"
                : "mt-0.5 block sm:mt-0 sm:leading-relaxed"
            )}
          >
            {option.description}
          </span>
        )}
      </span>
      {chipPosition === "right" && chip}
    </button>
  )
}

function ClarifyingQuestionStep({
  question,
  index = 0,
  total = 1,
  value,
  otherValue = "",
  onValueChange,
  onOtherValueChange,
  onSkip,
  onContinue,
  skipLabel = "Skip",
  className,
}: {
  question: ClarifyingQuestion
  index?: number
  total?: number
  value?: ClarifyingQuestionValue
  otherValue?: string
  onValueChange?: (id: string, value: ClarifyingQuestionValue) => void
  onOtherValueChange?: (id: string, value: string) => void
  onSkip?: (id: string, index: number) => void
  onContinue?: (id: string, index: number) => void
  skipLabel?: string
  className?: string
}) {
  const selectedValues = Array.isArray(value)
    ? value
    : typeof value === "string" && value
      ? [value]
      : []
  const multiple = question.kind === "multiple"
  const layout = question.layout ?? "inline"
  const chipPosition = question.chipPosition ?? "right"
  const canContinue = selectedValues.length > 0 || Boolean(otherValue.trim())

  const toggleOption = (optionValue: string) => {
    if (multiple) {
      const next = selectedValues.includes(optionValue)
        ? selectedValues.filter((item) => item !== optionValue)
        : [...selectedValues, optionValue]
      onValueChange?.(question.id, next)
      return
    }
    onValueChange?.(question.id, optionValue)
    if (!question.allowOther) {
      window.requestAnimationFrame(() => onContinue?.(question.id, index))
    }
  }

  return (
    <div
      data-slot="clarifying-question-step"
      className={cn("flex flex-col gap-2.5 sm:gap-3", className)}
    >
      <ClarifyingQuestionsHeader
        current={index}
        total={total}
        skipLabel={skipLabel}
        onSkip={
          question.skippable === false
            ? undefined
            : () => onSkip?.(question.id, index)
        }
      />
      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="text-sm leading-snug font-semibold tracking-tight sm:text-base">
          {question.label}
        </h3>
        {question.description && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {question.description}
          </p>
        )}
      </div>
      {question.kind === "text" ? (
        <InputGroup>
          <InputGroupTextarea
            name={question.id}
            value={typeof value === "string" ? value : ""}
            onChange={(event) =>
              onValueChange?.(question.id, event.target.value)
            }
            placeholder={question.placeholder ?? "Describe in your own words…"}
            className="min-h-20"
          />
        </InputGroup>
      ) : (
        <div
          role="group"
          aria-label={question.label}
          className="flex flex-col gap-1.5 sm:gap-2"
        >
          {(question.options ?? []).map((option, optionIndex) => (
            <ClarifyingQuestionOptionRow
              key={option.value}
              option={option}
              index={optionIndex}
              selected={selectedValues.includes(option.value)}
              onSelect={() => toggleOption(option.value)}
              multiple={multiple}
              layout={layout}
              chipPosition={chipPosition}
            />
          ))}
        </div>
      )}
      {question.allowOther && (
        <label className="block rounded-md border border-border/60 px-2.5 py-2 transition-colors focus-within:border-foreground/25 sm:px-3 sm:py-2.5">
          <span className="text-xs text-muted-foreground">Other</span>
          <textarea
            value={otherValue}
            onChange={(event) =>
              onOtherValueChange?.(question.id, event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && canContinue) {
                event.preventDefault()
                onContinue?.(question.id, index)
              }
            }}
            rows={1}
            placeholder={
              question.otherPlaceholder ?? "Describe in your own words…"
            }
            className="mt-1 block w-full resize-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground md:text-sm"
          />
        </label>
      )}
      {(multiple || question.allowOther || question.kind === "text") && (
        <ClarifyingQuestionsActions>
          <ClarifyingQuestionsSubmit
            type="button"
            disabled={!canContinue}
            onClick={() => onContinue?.(question.id, index)}
          >
            {question.nextLabel ??
              (index === total - 1 ? "Finish" : "Continue")}
          </ClarifyingQuestionsSubmit>
        </ClarifyingQuestionsActions>
      )}
    </div>
  )
}

function ClarifyingQuestionTextarea({
  id,
  label,
  description,
  value,
  onValueChange,
  placeholder,
}: {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}) {
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      <InputGroup>
        <InputGroupTextarea
          id={id}
          name={id}
          value={value ?? ""}
          onChange={(event) => onValueChange?.(event.target.value)}
          placeholder={placeholder}
          aria-describedby={descriptionId}
        />
      </InputGroup>
    </Field>
  )
}

function ClarifyingQuestionsActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="clarifying-questions-actions"
      className={cn("flex justify-end gap-2", className)}
      {...props}
    />
  )
}

function ClarifyingQuestionsSubmit({
  children = "Continue",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button type="submit" {...props}>
      {children}
    </Button>
  )
}

const ClarifyingQuestions = {
  Root: ClarifyingQuestionsRoot,
  Header: ClarifyingQuestionsHeader,
  List: ClarifyingQuestionsList,
  Field: ClarifyingQuestionField,
  Step: ClarifyingQuestionStep,
  Textarea: ClarifyingQuestionTextarea,
  Actions: ClarifyingQuestionsActions,
  Submit: ClarifyingQuestionsSubmit,
}

export {
  ClarifyingQuestions,
  ClarifyingQuestionsRoot,
  ClarifyingQuestionsHeader,
  ClarifyingQuestionsList,
  ClarifyingQuestionField,
  ClarifyingQuestionStep,
  ClarifyingQuestionTextarea,
  ClarifyingQuestionsActions,
  ClarifyingQuestionsSubmit,
  type ClarifyingQuestion,
  type ClarifyingQuestionKind,
  type ClarifyingQuestionOption,
  type ClarifyingQuestionValue,
}
