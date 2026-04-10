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
  const { onValueChange, textareaRef } = useComposer()
  const [flashChip, setFlashChip] = React.useState<string | null>(null)

  const handleClick = React.useCallback(
    (suggestion: string) => {
      setFlashChip(suggestion)
      setTimeout(() => {
        onValueChange(suggestion)
        setFlashChip(null)
        textareaRef.current?.focus()
        onSelect?.(suggestion)
      }, 250)
    },
    [onValueChange, textareaRef, onSelect],
  )

  if (items.length === 0) return null

  return (
    <div
      data-slot="composer-suggestions"
      className={cn(
        "animate-composer-slide mt-3 flex flex-wrap justify-center gap-2",
        className,
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
