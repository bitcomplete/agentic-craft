export type PatternEntry = {
  id: string
  title: string
  category: string
  summary: string
  userAnxiety: string
  shadcnPrimitives: string[]
}

export const patternEntries: PatternEntry[] = [
  {
    id: "observable-work",
    title: "Observable Work",
    category: "Conversation",
    summary:
      "Show what the agent is doing, which sources are touched, and what changed.",
    userAnxiety:
      "The user cannot tell whether work is real, stalled, or speculative.",
    shadcnPrimitives: ["Badge", "Collapsible", "Table"],
  },
  {
    id: "decision-surface",
    title: "Decision Surface",
    category: "Actions",
    summary: "Pause before external, costly, or irreversible actions.",
    userAnxiety:
      "The user worries an agent will act without enough context or rollback.",
    shadcnPrimitives: ["Dialog", "Button", "Alert"],
  },
  {
    id: "clarifying-questions",
    title: "Clarifying Questions",
    category: "Actions",
    summary: "Ask only for missing information in structured fields.",
    userAnxiety: "The agent may invent missing requirements or over-ask.",
    shadcnPrimitives: ["Field", "Input Group", "Toggle Group"],
  },
  {
    id: "file-lifecycle",
    title: "File Lifecycle",
    category: "Composer",
    summary:
      "Represent attachment acceptance, upload, rejection, retry, and removal.",
    userAnxiety:
      "The user cannot tell whether source material was accepted or attached.",
    shadcnPrimitives: ["Badge", "Progress", "Button"],
  },
  {
    id: "contextual-workbench",
    title: "Contextual Workbench",
    category: "Sources & Artifacts",
    summary:
      "Shrink the chat beside an agent-operable artifact, browser, source, or diff surface.",
    userAnxiety:
      "The user cannot see what object the agent is acting on or how to inspect it.",
    shadcnPrimitives: ["Resizable", "Badge", "Button", "Toggle Group"],
  },
  {
    id: "reference-item",
    title: "Reference Item",
    category: "Memory",
    summary:
      "Render sources, memories, files, tasks, and findings with provenance.",
    userAnxiety:
      "The user needs to know what an item is, where it came from, and what can be done with it.",
    shadcnPrimitives: ["Badge", "Button", "Tooltip"],
  },
  {
    id: "agent-status-table",
    title: "Agent Status Table",
    category: "Multi-Agent",
    summary:
      "Track agents by status, current task, confidence, cost, and progress.",
    userAnxiety:
      "The user cannot scan who owns work or where a run is blocked.",
    shadcnPrimitives: ["Table", "Badge", "Progress"],
  },
]
