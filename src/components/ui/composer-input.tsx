"use client"

import * as React from "react"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useComposer } from "./composer"

export function ComposerInput({
  placeholder = "Type a message...",
  maxHeight = 160,
  className,
  ...props
}: Omit<React.ComponentProps<"textarea">, "value" | "onChange"> & {
  maxHeight?: number
}) {
  const { value, onValueChange, send, textareaRef } = useComposer()

  React.useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px"
  }, [value, maxHeight, textareaRef])

  return (
    <div
      data-slot="composer-input"
      className={cn("px-4 pt-3 pb-1", className)}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
        placeholder={placeholder}
        rows={1}
        className="min-h-[32px] resize-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:border-transparent focus-visible:ring-0"
        style={{ maxHeight }}
        {...props}
      />
    </div>
  )
}
