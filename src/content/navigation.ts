import {
  Activity01Icon,
  Brain01Icon,
  BubbleChatIcon,
  DashboardSpeed01Icon,
  File01Icon,
  GridIcon,
  Home01Icon,
  Shield01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export type NavigationSubsection = {
  title: string
  id: string
}

export type NavigationSection = {
  title: string
  path: string
  icon: IconSvgElement
  subs: NavigationSubsection[]
}

export const sections: NavigationSection[] = [
  {
    title: "Demo",
    path: "/",
    icon: Home01Icon,
    subs: [],
  },
  {
    title: "Conversation",
    path: "/conversation",
    icon: BubbleChatIcon,
    subs: [
      { title: "Messages & Prose", id: "messages" },
      { title: "Citations", id: "citations" },
      { title: "Progress Steps", id: "progress-steps" },
      { title: "Composer", id: "composer" },
    ],
  },
  {
    title: "Agent Actions",
    path: "/actions",
    icon: ZapIcon,
    subs: [
      { title: "Tool Calls", id: "tool-calls" },
      { title: "Subagent Cards", id: "subagents" },
      { title: "Parallel Execution", id: "parallel" },
      { title: "Plan Cards", id: "plans" },
      { title: "Decision Blocks", id: "decisions" },
      { title: "Clarifying Questions", id: "ask-blocks" },
      { title: "Approval Gate", id: "approval-gate" },
    ],
  },
  {
    title: "Trust & Governance",
    path: "/trust",
    icon: Shield01Icon,
    subs: [
      { title: "Settings Templates", id: "settings-templates" },
      { title: "Autonomy Level", id: "autonomy-level" },
      { title: "Mode Toggles", id: "mode-toggles" },
      { title: "Context Scope", id: "context-scope" },
      { title: "Consent Flow", id: "consent-flow" },
      { title: "Confidence Display", id: "confidence-display" },
      { title: "Kill Switch", id: "kill-switch" },
      { title: "Cost Transparency", id: "cost-transparency" },
      { title: "Data Provenance", id: "data-provenance" },
      { title: "Audit Trail", id: "audit-trail" },
    ],
  },
  {
    title: "Memory",
    path: "/memory",
    icon: Brain01Icon,
    subs: [
      { title: "Memory Panel", id: "memory-panel" },
      { title: "Memory Entry CRUD", id: "memory-crud" },
      { title: "Auto-Memory", id: "auto-memory" },
      { title: "Context Ring", id: "memory-context-ring" },
      { title: "Privacy Controls", id: "privacy-controls" },
    ],
  },
  {
    title: "Multi-Agent",
    path: "/multi-agent",
    icon: GridIcon,
    subs: [
      { title: "Agent Cards", id: "agent-cards" },
      { title: "Handoff Flow", id: "handoff-flow" },
      { title: "Parallel Agents", id: "parallel-agents" },
      { title: "Agent Routing", id: "agent-routing" },
      { title: "Agent Communication", id: "agent-communication" },
    ],
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: Activity01Icon,
    subs: [
      { title: "Thumbs Feedback", id: "thumbs-feedback" },
      { title: "Inline Correction", id: "inline-correction" },
      { title: "Rating Scale", id: "rating-scale" },
      { title: "Behavioral Consequence", id: "behavioral-consequence" },
      { title: "Feedback History", id: "feedback-history" },
    ],
  },
  {
    title: "Observability",
    path: "/observability",
    icon: DashboardSpeed01Icon,
    subs: [
      { title: "Activity Timeline", id: "activity-timeline" },
      { title: "Token Usage", id: "token-usage" },
      { title: "Session Timeline", id: "session-timeline" },
      { title: "Error Log", id: "error-log" },
    ],
  },
  {
    title: "Templates",
    path: "/templates",
    icon: File01Icon,
    subs: [
      { title: "Review Workflow", id: "review-workflow" },
      { title: "Approval Workflow", id: "approval-workflow" },
      { title: "Clarifying Workflow", id: "clarifying-workflow" },
      { title: "Memory Review", id: "memory-review" },
      { title: "Background Run Monitor", id: "run-monitor" },
      { title: "Multi-Agent Handoff", id: "multi-agent-handoff" },
      { title: "Agent Settings", id: "agent-settings" },
    ],
  },
]
