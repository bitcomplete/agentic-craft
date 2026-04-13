"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon, Add01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useComposer } from "./composer"

/* ── ComposerFooter ── */

export function ComposerFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-footer"
      className={cn(
        "flex items-center justify-between gap-2 [padding-inline:var(--composer-shell-inset)] pt-1 [padding-bottom:var(--composer-shell-inset)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ComposerFooterStart({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-footer-start"
      className={cn("flex min-w-0 flex-1 items-center gap-1.5", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ComposerFooterEnd({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-footer-end"
      className={cn(
        "flex shrink-0 items-center justify-end gap-1.5",
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
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              "rounded-[var(--composer-control-radius)]",
              className
            )}
          />
        }
      >
        <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        sideOffset={8}
        align="start"
        className="min-w-55"
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
}: React.ComponentProps<typeof TooltipTrigger> & {
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
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "rounded-[var(--composer-control-radius)]",
              className
            )}
          />
        }
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
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
            className="text-muted-foreground"
          />
        </svg>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        <span>
          {displayLabel} ({pctLabel})
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

/* ── ComposerSend ── */

export function ComposerSend({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { value, isSending, send } = useComposer()
  const [arrowAnim, setArrowAnim] = React.useState(false)
  const hasContent = value.trim().length > 0

  const handleClick = React.useCallback(() => {
    setArrowAnim(true)
    send()
    setTimeout(() => setArrowAnim(false), 500)
  }, [send])

  return (
    <Button
      data-slot="composer-send"
      type="button"
      size="icon-sm"
      onClick={handleClick}
      disabled={!hasContent}
      className={cn(
        "rounded-full bg-foreground/72 text-background shadow-none hover:bg-foreground/82 disabled:bg-foreground/16 disabled:text-foreground/42 disabled:opacity-100 dark:disabled:bg-white/14 dark:disabled:text-white/56",
        isSending ? "animate-composer-send" : "",
        className
      )}
      {...props}
    >
      <span className={arrowAnim ? "animate-composer-arrow" : ""}>
        <HugeiconsIcon icon={ArrowUp02Icon} size={15} strokeWidth={2} />
      </span>
    </Button>
  )
}
