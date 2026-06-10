"use client"

import { ToolCallsSection } from "./actions/tool-calls-section"
import { SubagentsSection } from "./actions/subagents-section"
import { PlansSection } from "./actions/plans-section"
import { ParallelSection } from "./actions/parallel-section"
import { DecisionsSection } from "./actions/decisions-section"
import { AskBlocksSection } from "./actions/ask-blocks-section"
import { ApprovalGateSection } from "./actions/approval-gate-section"

export function ActionsContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Agent Actions
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Tool calls, subagent orchestration, parallel execution, plan cards,
          clarifying questions, decision flows, and approval gates for
          agent-driven approval and product workflows.
        </p>
      </header>

      <ToolCallsSection />
      <SubagentsSection />
      <PlansSection />
      <ParallelSection />
      <DecisionsSection />
      <AskBlocksSection />
      <ApprovalGateSection />
    </article>
  )
}
