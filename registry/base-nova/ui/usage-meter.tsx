"use client"

import * as React from "react"

import { Progress, ProgressLabel } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type UsageMeterItem = {
  id: string
  label: string
  value: number
  valueLabel: string
  limitLabel?: string
}

type UsageMeterProps = React.ComponentProps<"section"> & {
  title?: string
  description?: React.ReactNode
  items: UsageMeterItem[]
}

function UsageMeter({
  title = "Usage",
  description,
  items,
  className,
  ...props
}: UsageMeterProps) {
  return (
    <section
      data-slot="usage-meter"
      className={cn("border-y border-border/70 py-3", className)}
      {...props}
    >
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Progress key={item.id} value={item.value} className="min-w-0 gap-2">
            <div className="flex w-full items-center justify-between gap-3">
              <ProgressLabel className="truncate text-xs text-muted-foreground">
                {item.label}
              </ProgressLabel>
              <span className="text-xs text-foreground tabular-nums">
                {item.valueLabel}
              </span>
            </div>
            {item.limitLabel && (
              <p className="-mt-1 w-full text-[11px] text-muted-foreground">
                {item.limitLabel}
              </p>
            )}
          </Progress>
        ))}
      </div>
    </section>
  )
}

export { UsageMeter, type UsageMeterItem, type UsageMeterProps }
