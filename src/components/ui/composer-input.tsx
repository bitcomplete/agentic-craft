"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useComposer } from "./composer"
import { Textarea } from "./textarea"

export function ComposerInput({
  placeholder = "Type a message…",
  maxHeight = 160,
  className,
  "aria-label": ariaLabel,
  name = "message",
  autoComplete = "off",
  spellCheck = false,
  ...props
}: Omit<React.ComponentProps<"textarea">, "value" | "onChange"> & {
  maxHeight?: number
}) {
  const {
    state,
    actions: { setValue, setFocused, send },
    meta: { textareaRef },
  } = useComposer()

  React.useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px"
  }, [state.value, maxHeight, textareaRef])

  return (
    <div
      data-slot="composer-input"
      className={cn("px-3 pt-2 pb-1 sm:px-4 sm:pt-3", className)}
    >
      <Textarea
        data-compact-touch
        ref={textareaRef}
        value={state.value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            if (e.nativeEvent.isComposing) return
            e.preventDefault()
            send()
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel ?? "Message"}
        name={name}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        disabled={state.disabled}
        rows={1}
        className="max-h-[160px] min-h-8 resize-none rounded-none border-0 bg-transparent px-0 py-0 text-base leading-6 shadow-none placeholder:text-[13px] placeholder:leading-5 placeholder:text-muted-foreground/50 focus-visible:ring-0 md:text-sm md:leading-5 dark:bg-transparent"
        style={{ maxHeight }}
        {...props}
      />
    </div>
  )
}
