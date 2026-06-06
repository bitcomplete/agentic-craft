import type * as React from "react"

type PatternAnatomyItem = {
  part: React.ReactNode
  role: React.ReactNode
}

function PatternAnatomy({ items }: { items: PatternAnatomyItem[] }) {
  return (
    <div className="mt-8 divide-y divide-border/60 border-y border-border/60">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-2 py-3 text-sm sm:grid-cols-[180px_minmax(0,1fr)]"
        >
          <p className="font-medium text-foreground">{item.part}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {item.role}
          </p>
        </div>
      ))}
    </div>
  )
}

export { PatternAnatomy, type PatternAnatomyItem }

