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
    confidence: 91,
    cost: "$0.06",
    updated: "43s ago",
    detail: {
      model: "sonnet",
      tokens: "1,872",
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
    const root = within(container)
    const toggle = container.querySelector(
      "[data-slot='agent-detail-toggle']"
    ) as HTMLButtonElement

    await userEvent.click(toggle)
    expect(toggle.getAttribute("aria-expanded")).toBe("true")
    expect(
      root.getByText(/verified 14 of 29 requirements against source artifacts/i)
    ).toBeInTheDocument()
    expect(root.getByText(/1,872 tokens/)).toBeInTheDocument()

    await userEvent.click(toggle)
    expect(toggle.getAttribute("aria-expanded")).toBe("false")
    expect(
      root.queryByText(
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
    const root = within(container)
    await userEvent.click(
      container.querySelector(
        "[data-slot='agent-detail-toggle']"
      ) as HTMLButtonElement
    )
    const returned = root.getByText("{ deps: 143, advisories: 9 }")
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
})
