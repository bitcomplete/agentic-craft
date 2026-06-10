"use client"

import { AgentCardsSection } from "./multi-agent/agent-cards-section"
import { HandoffFlowSection } from "./multi-agent/handoff-flow-section"
import { ParallelAgentsSection } from "./multi-agent/parallel-agents-section"
import { AgentRoutingSection } from "./multi-agent/agent-routing-section"
import { AgentCommunicationSection } from "./multi-agent/agent-communication-section"

export function MultiAgentContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Orchestration</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Multi-Agent Patterns
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Coordination primitives for orchestrating multiple agents across
          product requirements review workflows — handoffs, parallel execution,
          routing, and inter-agent communication.
        </p>
      </header>

      <AgentCardsSection />
      <HandoffFlowSection />
      <ParallelAgentsSection />
      <AgentRoutingSection />
      <AgentCommunicationSection />
    </article>
  )
}
