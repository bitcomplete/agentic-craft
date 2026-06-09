"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon, Add01Icon } from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useComposer } from "./composer"

/* ── ComposerToolbar ── */

export function ComposerToolbar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-toolbar"
      className={cn(
        "flex items-center gap-1 px-2.5 pt-0 pb-2 sm:px-3 sm:pb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ComposerMenu ── */

export function ComposerMenu({
  className,
  children,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-compact-touch
        data-slot="composer-menu-trigger"
        aria-label="Open composer menu"
        className={cn(
          "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 outline-none hover:bg-muted/70 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        sideOffset={8}
        align="start"
        className="min-w-[200px]"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ── ComposerContextRing ── */

export function ComposerContextRing({
  used,
  total,
  label,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  used: number
  total: number
  label?: string
}) {
  const pct = total > 0 ? used / total : 0
  const r = 6
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  const displayLabel = label ?? `${used}k / ${total}k tokens`
  const pctLabel = `${Math.round(pct * 100)}%`

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            data-compact-touch
            data-slot="composer-context-ring"
            aria-label={`${displayLabel}, ${pctLabel} used`}
            className={cn(
              "mr-1 flex size-8 items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              className
            )}
            {...props}
          />
        }
      >
        <svg width="16" height="16" viewBox="0 0 16 16" className="opacity-70">
          <circle
            cx="8"
            cy="8"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <circle
            cx="8"
            cy="8"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 8 8)"
          />
        </svg>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {displayLabel} ({pctLabel})
      </TooltipContent>
    </Tooltip>
  )
}

/* ── ComposerSend ── */

export function ComposerSend({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { state } = useComposer()
  const [arrowAnim, setArrowAnim] = React.useState(false)

  const handleClick = React.useCallback(() => {
    setArrowAnim(true)
    setTimeout(() => setArrowAnim(false), 500)
  }, [])

  return (
    <button
      data-compact-touch
      data-slot="composer-send"
      type="submit"
      onClick={handleClick}
      disabled={!state.canSend}
      aria-label={state.canSend ? "Send message" : "Send message unavailable"}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg transition-[opacity,transform] duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        state.canSend ? "hover:opacity-90" : "cursor-not-allowed",
        state.isSending ? "animate-composer-send" : "",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full transition-[color,background-color]",
          state.canSend
            ? "bg-foreground text-background"
            : "bg-muted/60 text-muted-foreground/40",
          arrowAnim ? "animate-composer-arrow" : ""
        )}
      >
        <HugeiconsIcon icon={ArrowUp02Icon} size={13} strokeWidth={2} />
      </span>
    </button>
  )
}
