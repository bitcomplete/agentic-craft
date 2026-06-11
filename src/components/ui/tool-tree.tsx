"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

/* ── Context ── */

interface ToolTreeContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ToolTreeContext = React.createContext<ToolTreeContextValue | null>(null)

function useToolTree(): ToolTreeContextValue {
  const ctx = React.use(ToolTreeContext)
  if (!ctx) throw new Error("useToolTree must be used within a <ToolTree />")
  return ctx
}

/* ── ToolTree (root) ── */

function ToolTree({
  defaultOpen = true,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const onOpenChange = React.useCallback(
    (v: boolean) => {
      if (onOpenChangeProp) onOpenChangeProp(v)
      else _setOpen(v)
    },
    [onOpenChangeProp]
  )

  const ctx = React.useMemo(
    () => ({ open, onOpenChange }),
    [open, onOpenChange]
  )

  return (
    <ToolTreeContext.Provider value={ctx}>
      <div
        data-slot="tool-tree"
        className={cn(
          "relative flex min-w-0 flex-col gap-3 text-muted-foreground",
          className
        )}
        {...props}
      >
        {/* Spine: first child so trigger paints on top (DOM order) */}
        {open && (
          <span
            className="absolute w-px"
            style={{
              left: 9,
              top: 10,
              bottom: 0,
              backgroundColor: "var(--tool-tree-connector)",
            }}
          />
        )}
        {children}
      </div>
    </ToolTreeContext.Provider>
  )
}

/* ── ToolTreeTrigger ── */

function ToolTreeTrigger({
  icon,
  timestamp,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  icon?: IconSvgElement
  timestamp?: string
}) {
  const { open, onOpenChange } = useToolTree()

  return (
    <div
      data-slot="tool-tree-trigger"
      className="group/tool-wrapper relative flex items-center gap-2"
    >
      <button
        type="button"
        data-compact-touch
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-label={open ? "Collapse tool group" : "Expand tool group"}
        className={cn(
          "flex min-h-8 w-fit max-w-full min-w-0 cursor-pointer items-center gap-2 py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="relative flex size-5 shrink-0 items-center justify-center rounded-full">
            <div className="absolute inset-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
            <HugeiconsIcon
              icon={icon}
              size={18}
              strokeWidth={1.5}
              className="relative text-muted-foreground group-hover/tool-wrapper:text-foreground"
            />
          </div>
        )}
        <span className="min-w-0 truncate text-sm select-none group-hover/tool-wrapper:text-foreground">
          {children}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 transition-transform duration-200 group-hover/tool-wrapper:text-foreground",
            !open && "-rotate-90"
          )}
        />
      </button>
      {timestamp && (
        <span className="ml-auto shrink-0 truncate text-xs opacity-100 select-none sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-focus-within/tool-wrapper:opacity-100 sm:group-hover/tool-wrapper:opacity-100">
          {timestamp}
        </span>
      )}
    </div>
  )
}

/* ── ToolTreeContent ──
   Wraps each child (ToolCall) with L-connector and spine mask for the last item. */

function ToolTreeContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = useToolTree()
  if (!open) return null

  const items = React.Children.toArray(children)

  return (
    <div
      data-slot="tool-tree-content"
      className={cn("pl-[28px]", className)}
      {...props}
    >
      <div className="grid grid-cols-1 gap-1.5">
        {items.map((child, i) => {
          const isLast = i === items.length - 1
          return (
            <div key={i} className="relative min-w-0">
              {/* Last-child: mask FIRST so connector paints on top */}
              {isLast && (
                <div
                  className="absolute w-px bg-background"
                  style={{ top: 0, bottom: -24, left: -19 }}
                />
              )}
              {/* L-connector with rounded bottom-left corner */}
              <div
                className="absolute rounded-bl-lg border-b border-l"
                style={{
                  top: -5,
                  left: -19,
                  width: 30,
                  height: 16,
                  borderColor: "var(--tool-tree-connector)",
                }}
              />
              {child}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ToolTree, ToolTreeTrigger, ToolTreeContent, useToolTree }
