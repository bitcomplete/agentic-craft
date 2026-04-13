"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useComposer } from "./composer"

export function ComposerSuggestions({
  items,
  onSelect,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  items: string[]
  onSelect?: (suggestion: string) => void
}) {
  const { onValueChange, inputRef } = useComposer()
  const [flashChip, setFlashChip] = React.useState<string | null>(null)

  const handleClick = React.useCallback(
    (suggestion: string) => {
      setFlashChip(suggestion)
      setTimeout(() => {
        onValueChange(suggestion)
        setFlashChip(null)
        inputRef.current?.focus()
        onSelect?.(suggestion)
      }, 250)
    },
    [inputRef, onSelect, onValueChange]
  )

  if (items.length === 0) return null

  return (
    <div
      data-slot="composer-suggestions"
      className={cn(
        "animate-composer-slide mt-[var(--composer-shell-inset)] flex flex-wrap justify-center gap-2",
        className
      )}
      {...props}
    >
      {items.map((s) => (
        <Button
          key={s}
          type="button"
          variant="outline"
          size="xs"
          onClick={() => handleClick(s)}
          className={cn(flashChip === s ? "animate-composer-chip" : "")}
        >
          {s}
        </Button>
      ))}
    </div>
  )
}
