"use client"

import * as React from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type PatternControlOption = string | { key: string; label: string }
type PatternControlMode = "single" | "multiple"

type PatternControlsContextValue = {
  mode: PatternControlMode
  value: string[]
  setValue: (value: string[]) => void
}

const PatternControlsContext =
  React.createContext<PatternControlsContextValue | null>(null)

function usePatternControls() {
  const context = React.use(PatternControlsContext)
  if (!context) {
    throw new Error(
      "PatternControls compound components must be used inside PatternControls.Root"
    )
  }
  return context
}

function normalizeOption(option: PatternControlOption) {
  return typeof option === "string" ? { key: option, label: option } : option
}

function normalizeValue(value: string | string[] | undefined) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function PatternControlsRoot({
  mode = "multiple",
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: React.ComponentProps<"div"> & {
  mode?: PatternControlMode
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string[]) => void
}) {
  const [internalValue, setInternalValue] = React.useState<string[]>(
    normalizeValue(defaultValue)
  )
  const controlled = value !== undefined
  const currentValue = controlled ? normalizeValue(value) : internalValue

  const setValue = React.useCallback(
    (nextValue: string[]) => {
      if (!controlled) setInternalValue(nextValue)
      onValueChange?.(nextValue)
    },
    [controlled, onValueChange]
  )

  const context = React.useMemo<PatternControlsContextValue>(
    () => ({ mode, value: currentValue, setValue }),
    [mode, currentValue, setValue]
  )

  return (
    <PatternControlsContext value={context}>
      <div
        data-slot="pattern-controls"
        className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}
      >
        {children}
      </div>
    </PatternControlsContext>
  )
}

function PatternControlsLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pattern-controls-label"
      className={cn("section-label mr-1", className)}
      {...props}
    />
  )
}

function PatternControlsList({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ToggleGroup>, "value" | "onValueChange">) {
  const { mode, value, setValue } = usePatternControls()

  return (
    <ToggleGroup
      data-slot="pattern-controls-list"
      multiple
      value={value}
      onValueChange={(nextValue) => {
        const normalized = Array.isArray(nextValue)
          ? nextValue
          : normalizeValue(nextValue)
        setValue(mode === "single" ? normalized.slice(-1) : normalized)
      }}
      spacing={1}
      size="sm"
      className={cn("max-w-full flex-wrap", className)}
      {...props}
    />
  )
}

function PatternControlsItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupItem>) {
  return (
    <ToggleGroupItem
      data-slot="pattern-controls-item"
      className={cn(
        "min-h-8 rounded-md border-transparent text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground aria-pressed:bg-foreground/[0.04] aria-pressed:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupItem>
  )
}

function PatternControlsLegacy({
  options,
  active,
  onToggle,
  className,
  label = "Controls",
  showLabel = true,
  density = "default",
}: {
  options: PatternControlOption[]
  active: object
  onToggle: (key: string) => void
  className?: string
  label?: string
  showLabel?: boolean
  density?: "default" | "compact"
}) {
  const normalized = options.map(normalizeOption)
  const activeMap = active as Record<string, boolean | undefined>
  const value = normalized
    .filter((option) => activeMap[option.key])
    .map((option) => option.key)
  const compact = density === "compact"

  return (
    <PatternControlsRoot
      mode="multiple"
      value={value}
      onValueChange={(nextValue) => {
        const next = new Set(nextValue)
        const changed = normalized.filter(
          (option) => Boolean(activeMap[option.key]) !== next.has(option.key)
        )

        for (const option of changed) {
          onToggle(option.key)
        }
      }}
      className={cn("pb-3 sm:pb-5", compact && "gap-x-2 gap-y-1", className)}
    >
      {showLabel && <PatternControlsLabel>{label}</PatternControlsLabel>}
      <PatternControlsList className={compact ? "gap-1" : undefined}>
        {normalized.map((option) => (
          <PatternControlsItem
            key={option.key}
            value={option.key}
            aria-label={`Toggle ${option.label}`}
            data-compact-touch={compact ? true : undefined}
            className={
              compact
                ? "relative h-6 min-h-6 min-w-0 px-2 text-[11px] leading-none sm:h-7 sm:px-2.5 sm:text-xs [@media(pointer:coarse)]:min-h-6 [@media(pointer:coarse)]:min-w-0"
                : undefined
            }
          >
            {option.label}
          </PatternControlsItem>
        ))}
      </PatternControlsList>
    </PatternControlsRoot>
  )
}

const PatternControls = Object.assign(PatternControlsLegacy, {
  Root: PatternControlsRoot,
  Label: PatternControlsLabel,
  List: PatternControlsList,
  Item: PatternControlsItem,
})

export {
  PatternControls,
  PatternControlsRoot,
  PatternControlsLabel,
  PatternControlsList,
  PatternControlsItem,
  type PatternControlMode,
  type PatternControlOption,
}
