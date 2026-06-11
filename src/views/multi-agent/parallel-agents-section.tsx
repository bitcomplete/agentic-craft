"use client"

import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import { Robot01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Progress } from "@/components/ui/progress"
/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PARALLEL_AGENTS = [
  {
    name: "Risk Scanner",
    task: "Scanning incident database against launch scope",
    result: "847 incidents scanned — 0 critical blockers",
    progress: 72,
  },
  {
    name: "Source Collector",
    task: "Gathering release readiness source material",
    result: "18 of 18 artifacts collected — 100% coverage",
    progress: 45,
  },
  {
    name: "Policy Analyst",
    task: "Analyzing launch policy",
    result: "23 requirements parsed — 4 deltas from previous version",
    progress: 88,
  },
]

export function ParallelAgentsSection() {
  const [parallelCtrl, parallelAnim, toggleParallel] = useExclusiveToggle({
    running: true,
    complete: false,
  })
  const activeParallel = parallelCtrl.running ? "running" : "complete"

  return (
    <section id="parallel-agents" className="page-section">
      <p className="section-label mb-3">Concurrency</p>
      <h2 className="text-xl font-semibold tracking-tight">Parallel Agents</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Multiple agents executing independent tasks simultaneously. Each agent
        reports individual progress toward its own objective.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "running", label: "Running" },
            { key: "complete", label: "Complete" },
          ]}
          active={parallelCtrl}
          onToggle={toggleParallel}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={parallelAnim}
        >
          <div className="divide-y divide-border/40">
            {PARALLEL_AGENTS.map((agent, i) => (
              <div
                key={agent.name}
                className="ma-slide-in py-4 first:pt-0 last:pb-0"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={Robot01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {activeParallel === "running"
                            ? agent.task
                            : agent.result}
                        </p>
                      </div>
                      {activeParallel === "running" ? (
                        <span className="ma-pulse h-2 w-2 rounded-full bg-foreground/70" />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground/10">
                          <HugeiconsIcon
                            icon={Tick01Icon}
                            size={12}
                            strokeWidth={2}
                            className="text-foreground/70"
                          />
                        </div>
                      )}
                    </div>

                    <Progress
                      value={
                        activeParallel === "complete" ? 100 : agent.progress
                      }
                    />

                    {activeParallel === "running" && (
                      <p className="text-[10px] text-muted-foreground/70">
                        {agent.progress}% complete
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
