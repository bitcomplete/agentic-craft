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
  const flashTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current)
    }
  }, [])

  const handleClick = React.useCallback(
    (suggestion: string) => {
      if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current)
      setFlashChip(suggestion)
      flashTimerRef.current = setTimeout(() => {
        flashTimerRef.current = null
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
        "animate-composer-slide mt-2 flex w-full gap-1 overflow-x-auto px-0.5 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-2 sm:flex-wrap sm:justify-center sm:gap-1.5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {items.map((s) => (
        <button
          key={s}
          type="button"
          data-compact-touch
          aria-label={`Use suggestion: ${s}`}
          onClick={() => handleClick(s)}
          className={cn(
            "min-h-7 shrink-0 rounded-lg border border-border/60 bg-background/70 px-2.5 py-1 text-left text-xs leading-4 whitespace-nowrap text-muted-foreground transition-colors duration-200 hover:border-border hover:bg-muted/40 hover:text-foreground sm:text-center sm:leading-snug",
            flashChip === s ? "animate-composer-chip" : ""
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
