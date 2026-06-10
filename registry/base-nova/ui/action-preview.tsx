"use client"

import * as React from "react"
import { LockKeyIcon, Shield01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type ActionPreviewItem = {
  label: string
  value: React.ReactNode
  /** Promote consequential fields (consequence, rollback) out of the grid. */
  emphasis?: boolean
}

type ActionPreviewProps = React.ComponentProps<"div"> & {
  title: string
  description: React.ReactNode
  items: ActionPreviewItem[]
  status?: "preview" | "locked" | "approved" | "denied"
}

const statusLabels = {
  preview: "Preview",
  locked: "Locked payload",
  approved: "Approved",
  denied: "Denied",
} satisfies Record<NonNullable<ActionPreviewProps["status"]>, string>

function ActionPreview({
  title,
  description,
  items,
  status = "locked",
  className,
  children,
  ...props
}: ActionPreviewProps) {
  return (
    <div
      data-slot="action-preview"
      className={cn(
        "border-l border-border/60 bg-muted/20 px-3 py-3 sm:px-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={status === "locked" ? LockKeyIcon : Shield01Icon}
              size={14}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="truncate text-sm font-medium text-foreground">
              {title}
            </h3>
          </div>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-xs",
            status === "denied" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {items
          .filter((item) => !item.emphasis)
          .map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">
                {item.label}
              </p>
              <div className="mt-1 text-sm leading-5 break-words text-foreground">
                {item.value}
              </div>
            </div>
          ))}
      </div>

      {items.some((item) => item.emphasis) && (
        <div className="mt-4 flex flex-col gap-2 border-l-2 border-foreground/30 py-1 pl-3">
          {items
            .filter((item) => item.emphasis)
            .map((item) => (
              <p key={item.label} className="text-sm leading-5">
                <span className="font-medium text-foreground">
                  {item.label}
                </span>{" "}
                <span className="text-muted-foreground">{item.value}</span>
              </p>
            ))}
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export { ActionPreview, type ActionPreviewItem, type ActionPreviewProps }
