import type * as React from "react"

import { cn } from "@/lib/utils"

function PatternSection({
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  id?: string
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section id={id} className={cn("page-section scroll-mt-20", className)}>
      {eyebrow && <p className="section-label mb-3">{eyebrow}</p>}
      <h2 className="text-balance text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-[680px] text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </section>
  )
}

export { PatternSection }

