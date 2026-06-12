"use client"

import { WorkflowRunMonitorBlock } from "../../../registry/base-nova/blocks/workflow-run-monitor"

/* ──────────────────────────────────────────────────────────────────────── */
/*  Spec table data                                                        */
/* ──────────────────────────────────────────────────────────────────────── */

const SPEC_ROWS = [
  {
    contract: "Phase status vocabulary",
    rule: "done = tick (complete), active = pulse dot + aria-current=step, queued = dashed circle (pending), failed = alert (error)",
  },
  {
    contract: "Density threshold",
    rule: "≤ 5 agent rows visible per phase; 6+ agents collapse the remainder into a single +N summary row showing queued and running counts",
  },
  {
    contract: "Agent detail disclosure",
    rule: "A fleet row expands inline only when the agent has detail to show — chevron + aria-expanded on the agent cell, nothing on rows without detail; the excerpt is the agent's own words, set in the serif voice",
  },
  {
    contract: "Roll-up math",
    rule: "Phase tokens = Σ agent tokens for that phase; run total = Σ phase tokens across all phases",
  },
  {
    contract: "Pause semantics",
    rule: "Pause retains cached results on all in-progress agents; resume re-runs only agents that had not completed; cached agents labeled accordingly",
  },
  {
    contract: "Stop reachability",
    rule: "Stop control is visible and reachable in ≤ 1 click while the run is in Running state",
  },
  {
    contract: "Failed phase recovery",
    rule: "Never return empty — progress made is kept; failed phase shows partial counts; Retry re-runs only incomplete agents using cached results from completed ones",
  },
  {
    contract: "Ambient motion",
    rule: "Active phase pulse is the page's only ambient loop; pausing the run freezes it; prefers-reduced-motion disables it; all other state transitions run 150–200 ms",
  },
]

/* ──────────────────────────────────────────────────────────────────────── */
/*  Section                                                                */
/* ──────────────────────────────────────────────────────────────────────── */

export function WorkflowRunsSection() {
  return (
    <section id="workflow-runs" className="page-section">
      <p className="section-label mb-3">Orchestration</p>
      <h2 className="text-xl font-semibold tracking-tight">Workflow Runs</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Monitor a script-orchestrated run: sequential phases each fanning out to
        parallel agents. Answers "is this run healthy, where is it, and what is
        it costing?" — then lets you drill from phase to agent to recovery
        without losing the whole-run picture.
      </p>

      <div className="mt-10">
        <WorkflowRunMonitorBlock />
      </div>

      {/* Spec table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="mb-3 text-left text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Contract
          </caption>
          <thead>
            <tr className="border-b border-border/40">
              <th className="pr-6 pb-2 text-left text-xs font-medium text-muted-foreground">
                Rule
              </th>
              <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Specification
              </th>
            </tr>
          </thead>
          <tbody>
            {SPEC_ROWS.map((row) => (
              <tr
                key={row.contract}
                className="border-b border-border/40 last:border-0"
              >
                <td className="py-2 pr-6 align-top text-xs font-medium whitespace-nowrap">
                  {row.contract}
                </td>
                <td className="py-2 align-top text-xs text-muted-foreground">
                  {row.rule}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
