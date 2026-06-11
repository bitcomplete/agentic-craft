"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Loading01Icon,
  Robot01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function KillSwitchSection() {
  const [killCtrl, killAnimKey, killToggle] = useExclusiveToggle({
    idle: true,
    running: false,
    stopped: false,
  })

  return (
    <section id="kill-switch" className="page-section">
      <p className="section-label mb-3">Control</p>
      <h2 className="text-xl font-semibold tracking-tight">Kill Switch</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Always-available mechanism to immediately halt agent execution. The stop
        control adapts its prominence to the agent's current state.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "idle", label: "Idle" },
            { key: "running", label: "Running" },
            { key: "stopped", label: "Stopped" },
          ]}
          active={killCtrl}
          onToggle={killToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={killAnimKey}
        >
          <div className="trust-slide-in">
            {/* Idle state */}
            {killCtrl.idle && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Robot01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div>
                      <p className="text-sm">Agent idle</p>
                      <p className="text-xs text-muted-foreground">
                        Waiting for instructions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-muted-foreground"
                  >
                    Stop
                  </Button>
                </div>
              </div>
            )}

            {/* Running state */}
            {killCtrl.running && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Loading01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="trust-pulse text-muted-foreground"
                      />
                    </div>
                    <div>
                      <p className="text-sm">
                        Analyzing requirement coverage matrix
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Processing 23 requirements…
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => killToggle("stopped")}
                    variant="destructive"
                    size="xs"
                  >
                    Stop agent
                  </Button>
                </div>
                <div className="ml-10">
                  <Progress value={62} />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    14 of 23 requirements processed
                  </p>
                </div>
              </div>
            )}

            {/* Stopped state */}
            {killCtrl.stopped && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div>
                      <p className="text-sm">Agent stopped</p>
                      <p className="text-xs text-muted-foreground">
                        Halted at 14 of 23 requirements. Partial results saved.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-10 flex items-center gap-3">
                  <Button onClick={() => killToggle("running")} size="xs">
                    Resume
                  </Button>
                  <Button
                    onClick={() => killToggle("idle")}
                    variant="outline"
                    size="xs"
                  >
                    Discard &amp; reset
                  </Button>
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
                State
              </TableHead>
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Button style
              </TableHead>
              <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Idle
              </TableCell>
              <TableCell className="py-2.5 pr-4">Subtle border</TableCell>
              <TableCell className="py-2.5">
                Present but low prominence
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Running
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Red-tinted background
              </TableCell>
              <TableCell className="py-2.5">
                Prominent, immediately accessible
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Stopped
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Resume + Discard options
              </TableCell>
              <TableCell className="py-2.5">
                Partial results preserved, user chooses next step
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Callout */}
      <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        The stop button must always be reachable within one click. During
        long-running operations like batch requirement analysis, it should be
        the most prominent UI element. Stopped agents must preserve partial work
        — never discard without explicit user consent.
      </div>
    </section>
  )
}
