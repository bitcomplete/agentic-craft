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
    rule: "A fleet row expands inline only when the agent has detail to show — chevron + aria-expanded on the agent cell, nothing on rows without detail; inside: the full task line, model · tokens · tool calls · elapsed, and the result as the agent returned it — schema-validated data in mono, plain text in the serif voice. Runtime semantics (journal, replay, re-runs) speak as the system, in a muted sans annotation — never as the agent. Detail finishes what the row truncates and adds what it can’t show",
  },
  {
    contract: "Roll-up math",
    rule: "Phase tokens = Σ agent tokens for that phase (visible rows + the collapsed summary); run total = Σ phase tokens. A retried phase restarts its roll-up with the current attempt — spend from failed attempts stays on the run meter only",
  },
  {
    contract: "Pause and resume",
    rule: 'The journal caches completed agent calls only — resume replays them instantly (labelled "cached") and re-runs in-flight agents from the start; partial progress inside an agent is never cached',
  },
  {
    contract: "Pause reachability",
    rule: "Pause is visible and reachable in ≤ 1 click whenever agents are live; the verb is honest — nothing is destroyed, the journal keeps completed agents and resume replays them",
  },
  {
    contract: "Failed phase recovery",
    rule: "Agents self-retry up to 3× before a phase fails; the run never returns empty — completed agents stay cached, the failed phase shows what finished, and Retry re-runs only the agents that didn’t. Skip moves on without rewriting the record: the phase stays failed and the report carries the gap. Both paths price themselves in the banner before commitment",
  },
  {
    contract: "Ambient motion",
    rule: "Ambient motion is reserved for live state — the active phase pulse and the Working row spinners; pausing the run freezes the pulse; prefers-reduced-motion disables all of it; every other transition runs 150–200 ms",
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
                  {/* max-width on a td is ignored by auto table layout — the
                      cap lives on a block child. 55ch of the "0"-width unit
                      ≈ 75 proportional characters per line */}
                  <p className="max-w-[55ch]">{row.rule}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
