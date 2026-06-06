import type * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PatternStateRow = {
  state: React.ReactNode
  userSees: React.ReactNode
  systemDoes: React.ReactNode
}

function PatternStateMatrix({ rows }: { rows: PatternStateRow[] }) {
  return (
    <div data-slot="pattern-state-matrix">
      <div className="flex flex-col rounded-lg border border-border/60 md:hidden">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border-b border-border/50 px-3 py-3 last:border-b-0"
          >
            <div>
              <Badge variant="outline">{row.state}</Badge>
            </div>
            <div className="grid gap-1 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                User sees
              </p>
              <div className="leading-5 break-words text-foreground">
                {row.userSees}
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                System does
              </p>
              <div className="leading-5 break-words text-muted-foreground">
                {row.systemDoes}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>State</TableHead>
              <TableHead>User Sees</TableHead>
              <TableHead>System Does</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant="outline">{row.state}</Badge>
                </TableCell>
                <TableCell className="min-w-56 whitespace-normal text-muted-foreground">
                  {row.userSees}
                </TableCell>
                <TableCell className="min-w-56 whitespace-normal text-muted-foreground">
                  {row.systemDoes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { PatternStateMatrix, type PatternStateRow }
