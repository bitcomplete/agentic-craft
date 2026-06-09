import type * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type PatternGuideline = {
  title: React.ReactNode
  description: React.ReactNode
}

function PatternGuidelines({
  title = "Guidelines",
  items,
}: {
  title?: React.ReactNode
  items: PatternGuideline[]
}) {
  return (
    <Alert className="mt-8">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="grid gap-1 text-sm sm:grid-cols-[180px_1fr]"
            >
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                {item.description}
              </span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

export { PatternGuidelines, type PatternGuideline }
