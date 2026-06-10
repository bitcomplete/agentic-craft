import type * as React from "react"

import { cn } from "@/lib/utils"

function PatternPage({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <article className={cn("pb-24", className)}>
      <header className="mb-16">
        {eyebrow && <p className="section-label mb-3">{eyebrow}</p>}
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-[680px] text-sm leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </header>
      {children}
    </article>
  )
}

export { PatternPage }
