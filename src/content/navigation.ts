import {
  Brain01Icon,
  CheckListIcon,
  DashboardSpeed01Icon,
  File01Icon,
  GridIcon,
  Home01Icon,
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
    title: "Thesis",
    path: "/",
    icon: Home01Icon,
    subs: [],
  },
  {
    title: "Principles",
    path: "/principles",
    icon: Brain01Icon,
    subs: [
      { title: "Progressive Disclosure", id: "progressive-disclosure" },
      { title: "Control Signal", id: "control-signal" },
      { title: "Risk-Tier Gates", id: "risk-tier-gates" },
      { title: "Locked Previews", id: "locked-previews" },
      { title: "Provenance", id: "provenance" },
      { title: "Memory Ledger", id: "memory-ledger" },
      { title: "Blank Canvas", id: "blank-canvas" },
      { title: "Diagnostic Errors", id: "diagnostic-errors" },
      { title: "Visible Cost", id: "visible-cost" },
      { title: "Relationship", id: "relationship" },
    ],
  },
  {
    title: "Patterns",
    path: "/patterns/autonomy-contract",
    icon: GridIcon,
    subs: [
      { title: "Autonomy Contract", id: "autonomy-contract" },
      { title: "Why It Matters", id: "why-it-matters" },
      { title: "Principles", id: "principles-defended" },
      { title: "Components Used", id: "components-used" },
      { title: "Composition Recipe", id: "composition-recipe" },
    ],
  },
  {
    title: "Use Cases",
    path: "/use-cases",
    icon: CheckListIcon,
    subs: [
      { title: "Thread", id: "thread" },
      { title: "Context Blocks", id: "context-blocks" },
      { title: "Side Panel", id: "contextual-side-panel" },
      { title: "Fixture Convention", id: "fixture-convention" },
    ],
  },
  {
    title: "Operational Surfaces",
    path: "/operational-surfaces",
    icon: DashboardSpeed01Icon,
    subs: [
      { title: "Inbox", id: "inbox" },
      { title: "Kanban", id: "kanban" },
      { title: "Manager Surface", id: "manager-surface" },
      { title: "Run Monitor Rollup", id: "run-monitor-rollup" },
      { title: "Background Tasks", id: "background-tasks" },
    ],
  },
  {
    title: "Registry",
    path: "/registry",
    icon: File01Icon,
    subs: [
      { title: "Install", id: "install" },
      { title: "Primitives", id: "primitives" },
      { title: "Workflow Blocks", id: "blocks" },
      { title: "Quality Gates", id: "quality-gates" },
    ],
  },
]
