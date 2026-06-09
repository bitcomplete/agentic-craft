import type * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PatternSpecRow = {
  element: React.ReactNode
  spec: React.ReactNode
}

function PatternSpecTable({ rows }: { rows: PatternSpecRow[] }) {
  return (
    <div data-slot="pattern-spec-table">
      <div className="flex flex-col rounded-lg border border-border/60 md:hidden">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 border-b border-border/50 px-3 py-3 last:border-b-0"
          >
            <div className="text-sm font-medium text-foreground">
              {row.element}
            </div>
            <div className="line-clamp-2 text-xs leading-5 break-words text-muted-foreground">
              {row.spec}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Element</TableHead>
              <TableHead>Spec</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="min-w-40 font-medium">
                  {row.element}
                </TableCell>
                <TableCell className="min-w-0 whitespace-normal text-muted-foreground">
                  <span className="line-clamp-1">{row.spec}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { PatternSpecTable, type PatternSpecRow }
