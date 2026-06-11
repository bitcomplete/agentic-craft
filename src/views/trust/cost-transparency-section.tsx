"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, Coins01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const COST_BREAKDOWN = {
  model: "claude-opus-4-6",
  inputTokens: 12_847,
  outputTokens: 287,
  inputCost: 0.19,
  outputCost: 0.02,
  totalCost: 0.21,
  elapsed: "4.2s",
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CostTransparencySection() {
  const [costCtrl, costAnimKey, costToggle] = useExclusiveToggle({
    compact: true,
    detailed: false,
  })

  return (
    <section id="cost-transparency" className="page-section">
      <p className="section-label mb-3">Transparency</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Cost Transparency
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Showing users the computational cost of agent operations. Compact mode
        provides a glanceable summary; detailed mode breaks down token usage and
        pricing.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "compact", label: "Compact" },
            { key: "detailed", label: "Detailed" },
          ]}
          active={costCtrl}
          onToggle={costToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={costAnimKey}
        >
          <div className="trust-slide-in">
            {/* Compact */}
            {costCtrl.compact && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Coins01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    13,134 tokens
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  ${COST_BREAKDOWN.totalCost.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    {COST_BREAKDOWN.elapsed}
                  </span>
                </div>
              </div>
            )}

            {/* Detailed */}
            {costCtrl.detailed && (
              <div className="flex flex-col gap-4">
                <div className="mb-2 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Coins01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span className="text-sm">Operation cost breakdown</span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Input tokens
                    </p>
                    <p className="text-sm font-medium tabular-nums">
                      {COST_BREAKDOWN.inputTokens.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Output tokens
                    </p>
                    <p className="text-sm font-medium tabular-nums">
                      {COST_BREAKDOWN.outputTokens.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Input cost</p>
                    <p className="text-sm font-medium tabular-nums">
                      ${COST_BREAKDOWN.inputCost.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Output cost</p>
                    <p className="text-sm font-medium tabular-nums">
                      ${COST_BREAKDOWN.outputCost.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Model</p>
                    <p className="font-mono text-sm text-muted-foreground">
                      {COST_BREAKDOWN.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Time elapsed
                    </p>
                    <p className="text-sm font-medium tabular-nums">
                      {COST_BREAKDOWN.elapsed}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-3">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Total cost
                    </span>
                    <span className="text-sm font-medium tabular-nums">
                      ${COST_BREAKDOWN.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spec table */}
      <div className="mt-8">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Mode
              </TableHead>
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Shows
              </TableHead>
              <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Use case
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Compact
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Total tokens, cost, elapsed time
              </TableCell>
              <TableCell className="py-2.5">
                Inline display after each response
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Detailed
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Input/output split, model, pricing
              </TableCell>
              <TableCell className="py-2.5">
                Budget review and cost optimization
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Callout */}
      <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Cost transparency builds trust with procurement teams and lab managers
        who need to justify AI spending. The compact format should be
        unobtrusive; detailed mode is for when users actively want to understand
        costs.
      </div>
    </section>
  )
}
