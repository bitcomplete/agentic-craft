import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import {
  WorkflowPhases,
  type WorkflowPhase,
} from "../../src/components/ui/workflow-phases"

const PHASES: WorkflowPhase[] = [
  {
    id: "scan",
    title: "Scan sources",
    status: "done",
    agentCount: 8,
    tokens: "12,450",
    elapsed: "3:24",
  },
  {
    id: "verify",
    title: "Verify findings",
    status: "active",
    agentCount: 5,
    tokens: "4,213",
    elapsed: "1:08",
  },
  {
    id: "draft",
    title: "Draft report",
    status: "queued",
    agentCount: 1,
  },
]

describe("WorkflowPhases", () => {
  it("renders all phase buttons", () => {
    const { container } = render(<WorkflowPhases phases={PHASES} />)
    const root = within(container)
    expect(root.getByText("Scan sources")).toBeInTheDocument()
    expect(root.getByText("Verify findings")).toBeInTheDocument()
    expect(root.getByText("Draft report")).toBeInTheDocument()
  })

  it("active phase has aria-current=step", () => {
    const { container } = render(
      <WorkflowPhases phases={PHASES} activePhaseId="verify" />
    )
    const verifyBtn = container.querySelector(
      "[data-slot='workflow-phase-button'][aria-current='step']"
    )
    expect(verifyBtn).not.toBeNull()
    expect(verifyBtn?.textContent).toContain("Verify findings")
  })

  it("aria-current is absent on non-active phase buttons", () => {
    const { container } = render(
      <WorkflowPhases phases={PHASES} activePhaseId="verify" />
    )
    const allBtns = container.querySelectorAll(
      "[data-slot='workflow-phase-button']"
    )
    const withAriaCurrent = Array.from(allBtns).filter(
      (btn) => btn.getAttribute("aria-current") === "step"
    )
    expect(withAriaCurrent).toHaveLength(1)
  })

  it("selected phase has aria-pressed=true", () => {
    const { container } = render(
      <WorkflowPhases phases={PHASES} activePhaseId="scan" />
    )
    const scanBtn = container.querySelector(
      "[data-slot='workflow-phase-button'][aria-pressed='true']"
    )
    expect(scanBtn).not.toBeNull()
    expect(scanBtn?.textContent).toContain("Scan sources")
  })

  it("calls onPhaseSelect when a phase button is clicked", async () => {
    const onPhaseSelect = vi.fn()
    const { container } = render(
      <WorkflowPhases
        phases={PHASES}
        activePhaseId={null}
        onPhaseSelect={onPhaseSelect}
      />
    )
    const scanBtn = container.querySelector(
      "[data-slot='workflow-phase-button']"
    ) as HTMLButtonElement
    await userEvent.click(scanBtn)
    expect(onPhaseSelect).toHaveBeenCalledWith("scan")
  })

  it("clicking the already-selected phase deselects it (null callback)", async () => {
    const onPhaseSelect = vi.fn()
    const { container } = render(
      <WorkflowPhases
        phases={PHASES}
        activePhaseId="scan"
        onPhaseSelect={onPhaseSelect}
      />
    )
    const scanBtn = container.querySelector(
      "[data-slot='workflow-phase-button'][aria-pressed='true']"
    ) as HTMLButtonElement
    await userEvent.click(scanBtn)
    expect(onPhaseSelect).toHaveBeenCalledWith(null)
  })

  it("renders roll-up metadata for phases that have it", () => {
    const { container } = render(<WorkflowPhases phases={PHASES} />)
    // Scan sources has 8 agents, 12,450 tokens, 3:24
    expect(container.textContent).toContain("8 agents")
    expect(container.textContent).toContain("12,450 tokens")
    expect(container.textContent).toContain("3:24")
  })

  it("keeps aria-current unique when a pipelined run holds two active phases", () => {
    const twoActive: WorkflowPhase[] = [
      { id: "review", title: "Review", status: "active", agentCount: 3 },
      { id: "verify", title: "Verify", status: "active", agentCount: 2 },
      { id: "report", title: "Report", status: "queued", agentCount: 1 },
    ]
    const { container } = render(<WorkflowPhases phases={twoActive} />)
    const withAriaCurrent = container.querySelectorAll(
      "[data-slot='workflow-phase-button'][aria-current='step']"
    )
    expect(withAriaCurrent).toHaveLength(1)
    expect(withAriaCurrent[0].textContent).toContain("Review")
  })

  it("renders with group role and aria-label", () => {
    render(
      <WorkflowPhases
        phases={PHASES}
        aria-label="Launch readiness audit phases"
      />
    )
    expect(
      screen.getByRole("group", { name: "Launch readiness audit phases" })
    ).toBeInTheDocument()
  })
})
