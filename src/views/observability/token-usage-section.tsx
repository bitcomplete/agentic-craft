"use client"

import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon, Coins01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TOKEN_CONFIGS = {
  low: {
    used: 11750,
    budget: 92500,
    label: "Well within budget",
    sessions: 3,
    costEstimate: "$0.82",
  },
  medium: {
    used: 63800,
    budget: 92500,
    label: "Approaching limit",
    sessions: 14,
    costEstimate: "$4.43",
  },
  high: {
    used: 88700,
    budget: 92500,
    label: "Near budget limit",
    sessions: 28,
    costEstimate: "$6.16",
  },
}

export function TokenUsageSection() {
  const [tokenCtrl, tokenAnim, toggleToken] = useExclusiveToggle({
    low: true,
    medium: false,
    high: false,
  })

  const tokenCtrlMap = tokenCtrl as Record<string, boolean>
  const activeToken =
    Object.keys(tokenCtrl).find((k) => tokenCtrlMap[k]) || "low"
  const tokenCfg = TOKEN_CONFIGS[activeToken as keyof typeof TOKEN_CONFIGS]
  const tokenPct = Math.min((tokenCfg.used / tokenCfg.budget) * 100, 100)
  const isHighUsage = tokenPct > 80

  return (
    <section id="token-usage" className="page-section">
      <p className="section-label mb-3">Economics</p>
      <h2 className="text-xl font-semibold tracking-tight">Token Usage</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        A visual meter showing token consumption against the session or daily
        budget, with cost estimates and usage warnings.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "low", label: "Low" },
            { key: "medium", label: "Medium" },
            { key: "high", label: "High" },
          ]}
          active={tokenCtrl}
          onToggle={toggleToken}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={tokenAnim}
        >
          <div className="mon-slide-in">
            {/* Usage header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Coins01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">Token budget</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {tokenCfg.costEstimate} estimated
              </span>
            </div>

            {/* Main meter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold tracking-tight">
                  {tokenCfg.used.toLocaleString("en-US")}
                </span>
                <span className="text-xs text-muted-foreground">
                  of {tokenCfg.budget.toLocaleString("en-US")} tokens
                </span>
              </div>
              <Progress value={tokenPct} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{tokenCfg.label}</span>
                <span>{Math.round(tokenPct)}% used</span>
              </div>
            </div>

            {/* Warning for high usage */}
            {isHighUsage && (
              <div className="mon-fade-in mt-4 flex items-start gap-2 border-l border-foreground/20 bg-foreground/[0.02] py-2 pl-3">
                <HugeiconsIcon
                  icon={Alert01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div className="text-xs text-muted-foreground">
                  <p>
                    Token usage is approaching the daily budget. Subsequent
                    requests may be throttled. Consider completing the current
                    review task before starting new analyses.
                  </p>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="mt-4 grid grid-cols-3 divide-x divide-border/40">
              <div className="pr-3">
                <p className="text-xs text-muted-foreground">Sessions</p>
                <p className="mt-0.5 text-sm font-medium">
                  {tokenCfg.sessions}
                </p>
              </div>
              <div className="px-3">
                <p className="text-xs text-muted-foreground">
                  Avg. per session
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {Math.round(tokenCfg.used / tokenCfg.sessions).toLocaleString(
                    "en-US"
                  )}
                </p>
              </div>
              <div className="pl-3">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="mt-0.5 text-sm font-medium">
                  {(tokenCfg.budget - tokenCfg.used).toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border text-left">
            <TableHead className="pr-6 pb-3 text-xs font-medium text-muted-foreground">
              Element
            </TableHead>
            <TableHead className="pb-3 text-xs font-medium text-muted-foreground">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Warning state
            </TableCell>
            <TableCell className="py-3">
              Appears above 80% with advisory text and subtle border highlight
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Cost estimate
            </TableCell>
            <TableCell className="py-3">
              Dollar amount shown alongside token count — primary metric for
              non-technical users
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  )
}
