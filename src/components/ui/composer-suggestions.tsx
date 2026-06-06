"use client"

import * as React from "react"
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
  const {
    actions: { setValue },
    meta: { textareaRef },
  } = useComposer()
  const [flashChip, setFlashChip] = React.useState<string | null>(null)

  const handleClick = React.useCallback(
    (suggestion: string) => {
      setFlashChip(suggestion)
      setTimeout(() => {
        setValue(suggestion)
        setFlashChip(null)
        textareaRef.current?.focus()
        onSelect?.(suggestion)
      }, 250)
    },
    [setValue, textareaRef, onSelect]
  )

  if (items.length === 0) return null

  return (
    <div
      data-slot="composer-suggestions"
      className={cn(
        "animate-composer-slide mt-1.5 flex w-full gap-1 overflow-x-auto px-0.5 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-3 sm:flex-wrap sm:justify-center sm:gap-1.5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {items.map((s) => (
        <button
          key={s}
          type="button"
          data-compact-touch
          onClick={() => handleClick(s)}
          className={cn(
            "min-h-6 shrink-0 whitespace-nowrap rounded-md border border-border/60 px-2 py-1 text-left text-[11px] leading-4 text-muted-foreground transition-colors duration-200 hover:border-border hover:bg-muted/40 hover:text-foreground sm:min-h-7 sm:px-2.5 sm:text-center sm:text-xs sm:leading-snug",
            flashChip === s ? "animate-composer-chip" : ""
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
