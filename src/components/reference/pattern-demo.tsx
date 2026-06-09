import type * as React from "react"

import { cn } from "@/lib/utils"

function PatternDemo({
  title = "Interactive Demo",
  description,
  className,
  children,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="pattern-demo"
      className={cn(
        "mt-8 rounded-lg border border-border bg-background",
        className
      )}
    >
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">
            {description}
          </p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export { PatternDemo }
