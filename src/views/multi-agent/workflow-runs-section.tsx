"use client"

import { WorkflowRunMonitorBlock } from "../../../registry/base-nova/blocks/workflow-run-monitor"

/* ──────────────────────────────────────────────────────────────────────── */
/*  Spec table data                                                        */
/* ──────────────────────────────────────────────────────────────────────── */

const SPEC_ROWS = [
  {
    contract: "Phase status vocabulary",
    rule: 'done = tick (complete), active = pulse dot, queued = dashed circle (pending), failed = alert (error); aria-current="step" marks at most one phase; each row adds a per-agent dot minimap (done / running / queued / failed) with a done/total count',
  },
  {
    contract: "Phase anatomy",
    rule: "Phases are display groups, not barriers — the script declares them up front, which is why the list shows queued phases before any agent runs; barriers come from parallel(), so a pipelined run can hold two active phases at once",
  },
  {
    contract: "Script as provenance",
    rule: "The run is humanized into phases and agents — the orchestration script never renders ambiently; it stays one disclosure away (Plan), where a gutter of phase glyphs and a highlight band track the live phase",
  },
  {
    contract: "Density threshold",
    rule: "≤ 5 agent rows visible per phase; 6+ agents collapse into a +N summary row that carries its own roll-up — status counts and tokens — so hidden work still counts",
  },
  {
    contract: "Agent detail disclosure",
    rule: "A fleet row expands inline only when the agent has detail to show — chevron + aria-expanded on the agent cell, nothing on rows without detail; inside: model · tokens · tool calls · elapsed and the result as the agent returned it — schema-validated data in mono, plain text in the serif voice. Runtime semantics (journal, replay, re-runs) speak as the system, in a muted sans annotation — never as the agent. Detail adds what the row can’t show; it never repeats the row",
  },
  {
    contract: "Roll-up math",
    rule: "Phase tokens = Σ agent tokens for that phase (visible rows + the collapsed summary); run total = Σ phase tokens across all phases",
  },
  {
    contract: "Pause and resume",
    rule: 'The journal caches completed agent calls only — resume replays them instantly (labelled "cached") and re-runs in-flight agents from the start; partial progress inside an agent is never cached',
  },
  {
    contract: "Stop reachability",
    rule: "Stop control is visible and reachable in ≤ 1 click while the run is in Running state",
  },
  {
    contract: "Failed phase recovery",
    rule: "Agents self-retry up to 3× before a phase fails; the run never returns empty — completed agents stay cached, the failed phase shows what finished, and Retry re-runs only the agents that didn’t. Skip moves on without rewriting the record: the phase stays failed and the report carries the gap",
  },
  {
    contract: "Ambient motion",
    rule: "Active phase pulse is the page’s only ambient loop; pausing the run freezes it; prefers-reduced-motion disables it; all other state transitions run 150–200 ms",
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
        Monitor a script-orchestrated run: phases the script declares up front,
        each fanning out to parallel agents. Answers "is this run healthy, where
        is it, and what is it costing?" — then lets you drill from phase to
        agent to recovery without losing the whole-run picture.
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
