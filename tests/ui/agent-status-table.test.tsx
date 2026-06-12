import { render, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import {
  AgentStatusTable,
  type AgentStatusRow,
} from "../../src/components/ui/agent-status-table"

const AGENTS: AgentStatusRow[] = [
  {
    id: "verifier",
    name: "Coverage Verifier",
    role: "Cross-checks requirement coverage",
    status: "complete",
    task: "Verified 14 of 29 requirements",
    progress: 100,
    cost: "$0.06",
    updated: "43s ago",
    detail: {
      model: "sonnet",
      tokens: "1,872",
      tools: 13,
      elapsed: "0:52",
      output: "Verified 14 of 29 requirements against source artifacts.",
    },
  },
  {
    id: "assessor",
    name: "Risk Assessor",
    role: "Rates unverified items",
    status: "idle",
    task: "Waiting for delta audit results",
    progress: 0,
    cost: "$0.00",
    updated: "1m ago",
  },
]

describe("AgentStatusTable detail disclosure", () => {
  it("renders a collapsed disclosure toggle only for rows with detail", () => {
    const { container } = render(<AgentStatusTable agents={AGENTS} />)
    const toggles = container.querySelectorAll(
      "[data-slot='agent-detail-toggle']"
    )
    expect(toggles).toHaveLength(1)
    expect(toggles[0].getAttribute("aria-expanded")).toBe("false")
    expect(toggles[0].textContent).toContain("Coverage Verifier")
  })

  it("expands and collapses the detail row on toggle", async () => {
    const { container } = render(<AgentStatusTable agents={AGENTS} />)
    const table = within(
      container.querySelector("[data-slot='table-container']") as HTMLElement
    )
    const toggle = container.querySelector(
      "[data-slot='agent-detail-toggle']"
    ) as HTMLButtonElement

    await userEvent.click(toggle)
    expect(toggle.getAttribute("aria-expanded")).toBe("true")
    expect(
      table.getByText(
        /verified 14 of 29 requirements against source artifacts/i
      )
    ).toBeInTheDocument()
    expect(table.getByText(/1,872 tokens · 13 tools/)).toBeInTheDocument()

    await userEvent.click(toggle)
    expect(toggle.getAttribute("aria-expanded")).toBe("false")
    expect(
      table.queryByText(
        /verified 14 of 29 requirements against source artifacts/i
      )
    ).toBeNull()
  })

  it("detail row is labelled by aria-controls", async () => {
    const { container } = render(<AgentStatusTable agents={AGENTS} />)
    const toggle = container.querySelector(
      "[data-slot='agent-detail-toggle']"
    ) as HTMLButtonElement
    await userEvent.click(toggle)
    const controlsId = toggle.getAttribute("aria-controls")!
    expect(document.getElementById(controlsId)).not.toBeNull()
  })

  it("renders a schema-validated return value as mono data", async () => {
    const agents: AgentStatusRow[] = [
      {
        id: "scanner",
        name: "Dependency Scanner",
        status: "complete",
        detail: {
          tokens: "1,742",
          returned: "{ deps: 143, advisories: 9 }",
        },
      },
    ]
    const { container } = render(<AgentStatusTable agents={agents} />)
    const table = within(
      container.querySelector("[data-slot='table-container']") as HTMLElement
    )
    await userEvent.click(
      container.querySelector(
        "[data-slot='agent-detail-toggle']"
      ) as HTMLButtonElement
    )
    const returned = table.getByText("{ deps: 143, advisories: 9 }")
    expect(returned.className).toContain("font-mono")
  })

  it("rows without detail render plain content with no button", () => {
    const { container } = render(<AgentStatusTable agents={AGENTS} />)
    const rows = container.querySelectorAll("tbody tr")
    // 2 agents, none expanded — exactly 2 rows
    expect(rows).toHaveLength(2)
    const idleRow = rows[1]
    expect(idleRow.querySelector("button")).toBeNull()
    expect(idleRow.textContent).toContain("Risk Assessor")
  })

  it("has no Confidence column — cost and progress carry the instrumentation", () => {
    const { container } = render(<AgentStatusTable agents={AGENTS} />)
    const headers = Array.from(container.querySelectorAll("th")).map(
      (th) => th.textContent
    )
    expect(headers).toEqual([
      "Agent",
      "Status",
      "Task",
      "Progress",
      "Cost",
      "Updated",
    ])
  })
})

describe("AgentStatusTable narrow-viewport card list", () => {
  it("renders the same fleet as a card list with full task text", () => {
    const { container } = render(<AgentStatusTable agents={AGENTS} />)
    const cards = container.querySelector("[data-slot='agent-status-cards']")!
    expect(cards.querySelectorAll("li")).toHaveLength(2)
    expect(
      within(cards as HTMLElement).getByText(/waiting for delta audit results/i)
    ).toBeInTheDocument()
  })

  it("card disclosure expands its own detail panel", async () => {
    const { container } = render(<AgentStatusTable agents={AGENTS} />)
    const cards = container.querySelector(
      "[data-slot='agent-status-cards']"
    ) as HTMLElement
    const toggle = cards.querySelector(
      "[data-slot='agent-card-toggle']"
    ) as HTMLButtonElement
    await userEvent.click(toggle)
    expect(toggle.getAttribute("aria-expanded")).toBe("true")
    const controlsId = toggle.getAttribute("aria-controls")!
    expect(document.getElementById(controlsId)).not.toBeNull()
    expect(
      within(cards).getByText(
        /verified 14 of 29 requirements against source artifacts/i
      )
    ).toBeInTheDocument()
  })

  it("the table's scroll container is a labelled focusable region", () => {
    const { container } = render(
      <AgentStatusTable agents={AGENTS} aria-label="Verify agents" />
    )
    const region = container.querySelector(
      "[data-slot='agent-status-table-region']"
    )!
    expect(region.getAttribute("role")).toBe("region")
    expect(region.getAttribute("tabindex")).toBe("0")
    expect(region.getAttribute("aria-label")).toBe("Verify agents")
  })
})
