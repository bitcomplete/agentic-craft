import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { AgentSettingsBlock } from "../../registry/base-nova/blocks/agent-settings"
import { ApprovalWorkflowBlock } from "../../registry/base-nova/blocks/approval-workflow"
import { ClarifyingWorkflowBlock } from "../../registry/base-nova/blocks/clarifying-workflow"
import { MemoryReviewBlock } from "../../registry/base-nova/blocks/memory-review"
import { MultiAgentHandoffBlock } from "../../registry/base-nova/blocks/multi-agent-handoff"
import { ReviewWorkflowBlock } from "../../registry/base-nova/blocks/review-workflow"
import { RunMonitorBlock } from "../../registry/base-nova/blocks/run-monitor"
import { SourceBackedArtifact } from "../../registry/base-nova/blocks/source-backed-artifact"
import { WorkflowRunMonitorBlock } from "../../registry/base-nova/blocks/workflow-run-monitor"

describe("agent-settings block", () => {
  it("renders and shows agent settings content", () => {
    const { container } = render(<AgentSettingsBlock />)
    const root = within(container)
    expect(root.getByText(/agent settings/i)).toBeInTheDocument()
    expect(root.getByText(/autonomy settings/i)).toBeInTheDocument()
    expect(root.getByText(/memory and privacy settings/i)).toBeInTheDocument()
  })

  it("survives toggling a switch", async () => {
    const { container } = render(<AgentSettingsBlock />)
    const root = within(container)
    const switches = root.getAllByRole("switch")
    expect(switches.length).toBeGreaterThan(0)
    await userEvent.click(switches[0]!)
    // no crash = pass
  })
})

describe("approval-workflow block", () => {
  it("renders and shows approval workflow content", () => {
    const { container } = render(<ApprovalWorkflowBlock />)
    const root = within(container)
    expect(root.getByText(/approval workflow/i)).toBeInTheDocument()
    expect(root.getByText(/waiting for approval/i)).toBeInTheDocument()
  })

  it("opens the decision surface dialog on trigger click", async () => {
    const { container } = render(<ApprovalWorkflowBlock />)
    const root = within(container)
    const triggers = root.getAllByRole("button", { name: /review approval/i })
    await userEvent.click(triggers[0]!)
    // dialog appears in document body (portal)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument()
  })
})

describe("clarifying-workflow block", () => {
  it("renders and shows clarifying workflow content", () => {
    const { container } = render(<ClarifyingWorkflowBlock />)
    const root = within(container)
    expect(root.getByText(/clarifying workflow/i)).toBeInTheDocument()
    // question label for release scope appears in the step
    expect(root.getByText(/which release scope/i)).toBeInTheDocument()
  })

  it("survives selecting a clarifying option", async () => {
    const { container } = render(<ClarifyingWorkflowBlock />)
    const root = within(container)
    // the option rows use aria-label = option label for single kind
    const enterpriseOption = root.getAllByRole("button", {
      name: /enterprise release/i,
    })[0]!
    await userEvent.click(enterpriseOption)
    // no crash = pass
  })
})

describe("memory-review block", () => {
  it("renders and shows memory review content", () => {
    const { container } = render(<MemoryReviewBlock />)
    const root = within(container)
    expect(root.getByText(/memory review queue/i)).toBeInTheDocument()
    expect(root.getByText(/preferred release tier/i)).toBeInTheDocument()
  })

  it("survives selecting a memory ledger item", async () => {
    const { container } = render(<MemoryReviewBlock />)
    const root = within(container)
    const inspectButtons = root.getAllByRole("button", { name: /inspect/i })
    expect(inspectButtons.length).toBeGreaterThan(0)
    await userEvent.click(inspectButtons[0]!)
    // no crash = pass
  })
})

describe("multi-agent-handoff block", () => {
  it("renders and shows multi-agent handoff content", () => {
    const { container } = render(<MultiAgentHandoffBlock />)
    const root = within(container)
    expect(root.getByText(/multi-agent handoff/i)).toBeInTheDocument()
    // requirements mapper appears in both agent table and handoff packet
    expect(root.getAllByText(/requirements mapper/i).length).toBeGreaterThan(0)
  })

  it("renders the handoff packet with sender and receiver", () => {
    const { container } = render(<MultiAgentHandoffBlock />)
    const root = within(container)
    expect(root.getAllByText(/document drafter/i).length).toBeGreaterThan(0)
    expect(
      root.getByText(/export workflow coverage packet/i)
    ).toBeInTheDocument()
  })
})

describe("review-workflow block", () => {
  it("renders and shows review workflow content", () => {
    const { container } = render(<ReviewWorkflowBlock />)
    const root = within(container)
    expect(root.getByText(/launch review workflow/i)).toBeInTheDocument()
    expect(root.getByText(/which source scope/i)).toBeInTheDocument()
  })

  it("survives selecting a different source scope option", async () => {
    const { container } = render(<ReviewWorkflowBlock />)
    const root = within(container)
    // The ClarifyingQuestionStep renders option rows with aria-label = option label (single kind)
    const recentOptions = root.getAllByRole("button", {
      name: /recent changes/i,
    })
    await userEvent.click(recentOptions[0]!)
    // no crash = pass
  })
})

describe("run-monitor block", () => {
  it("renders and shows run monitor content", () => {
    const { container } = render(<RunMonitorBlock />)
    const root = within(container)
    expect(root.getByText(/background run monitor/i)).toBeInTheDocument()
    // "launch review run" appears as the RunTrace title
    expect(root.getAllByText(/launch review run/i).length).toBeGreaterThan(0)
  })

  it("renders agent status table with expected agents", () => {
    const { container } = render(<RunMonitorBlock />)
    const root = within(container)
    expect(root.getAllByText(/source collector/i).length).toBeGreaterThan(0)
    expect(root.getAllByText(/requirements mapper/i).length).toBeGreaterThan(0)
  })
})

describe("source-backed-artifact block", () => {
  it("renders and shows source-backed artifact content", () => {
    const { container } = render(<SourceBackedArtifact />)
    const root = within(container)
    expect(root.getByText(/launch review summary/i)).toBeInTheDocument()
    expect(
      root.getAllByText(/launch checklist: support readiness/i).length
    ).toBeGreaterThan(0)
  })

  it("switches active source on button click", async () => {
    const { container } = render(<SourceBackedArtifact />)
    const root = within(container)
    const secondSource = root.getAllByRole("button", {
      name: /inspect source 2/i,
    })[0]!
    await userEvent.click(secondSource)
    // the SourcePreview should now show source 2's title
    expect(root.getAllByText(/issue triage policy/i).length).toBeGreaterThan(0)
  })
})

describe("workflow-run-monitor block", () => {
  it("renders and shows workflow run monitor content", () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    expect(root.getAllByText(/workflow run monitor/i).length).toBeGreaterThan(0)
    // Phase names
    expect(root.getAllByText(/scan sources/i).length).toBeGreaterThan(0)
    expect(root.getAllByText(/verify findings/i).length).toBeGreaterThan(0)
    expect(root.getAllByText(/draft report/i).length).toBeGreaterThan(0)
  })

  it("renders agent rows for the default active phase (verify)", () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    // Running state shows verify agents by default
    expect(root.getAllByText(/coverage verifier/i).length).toBeGreaterThan(0)
    expect(root.getAllByText(/delta auditor/i).length).toBeGreaterThan(0)
  })

  it("switching to Paused state shows paused banner", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    // Use aria-pressed to find the "Paused" toggle button specifically
    const allBtns = root.getAllByRole("button", { name: /paused/i })
    const pausedToggle = allBtns.find(
      (b) => b.getAttribute("aria-pressed") !== null
    )!
    await userEvent.click(pausedToggle)
    expect(
      root.getAllByText(/9 completed agents cached in the journal/i).length
    ).toBeGreaterThan(0)
    expect(root.getByRole("button", { name: /resume/i })).toBeInTheDocument()
  })

  it("plan script is collapsed by default and expands on disclosure", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    // The script is provenance, not surface — hidden until disclosed
    expect(root.queryByText(/parallel\(scanners\)/)).toBeNull()
    const planBtn = root
      .getByText(/workflow script · 8 lines/)
      .closest("button") as HTMLButtonElement
    expect(planBtn.getAttribute("aria-expanded")).toBe("false")
    await userEvent.click(planBtn)
    expect(planBtn.getAttribute("aria-expanded")).toBe("true")
    expect(root.getByText(/parallel\(scanners\)/)).toBeInTheDocument()
  })

  it("scan phase collapses agents past the density threshold with a roll-up", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    // Select the Scan sources phase
    const scanBtn = container.querySelector(
      "[data-slot='workflow-phase-button']"
    ) as HTMLButtonElement
    await userEvent.click(scanBtn)
    // 8 agents, threshold 5 → "+3 more" summary carrying done count + tokens
    expect(
      root.getByText(/\+3 more: 3 done · 3,920 tokens/)
    ).toBeInTheDocument()
    // Hidden rows are not rendered
    expect(root.queryByText(/API Surface Mapper/)).toBeNull()
  })

  it("switching to Failed state shows recovery options", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    const failedBtn = root.getByRole("button", { name: /failed/i })
    await userEvent.click(failedBtn)
    expect(
      root.getByRole("button", { name: /retry phase/i })
    ).toBeInTheDocument()
    expect(
      root.getByRole("button", { name: /skip and continue/i })
    ).toBeInTheDocument()
  })

  it("clicking Retry phase changes visible state", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    // Go to failed
    await userEvent.click(root.getByRole("button", { name: /failed/i }))
    // Click retry
    await userEvent.click(root.getByRole("button", { name: /retry phase/i }))
    // Recovery banner should be gone; running state active
    expect(root.queryByRole("button", { name: /retry phase/i })).toBeNull()
  })

  it("role=status element is present in the DOM", () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const statusEl = container.querySelector("[role='status']")
    expect(statusEl).not.toBeNull()
  })

  it("phase button click changes aria-pressed to true", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    // Click on the Scan sources phase button
    const phaseBtns = container.querySelectorAll(
      "[data-slot='workflow-phase-button']"
    )
    expect(phaseBtns.length).toBeGreaterThan(0)
    const scanBtn = phaseBtns[0] as HTMLButtonElement
    await userEvent.click(scanBtn)
    // Scan should now be pressed
    expect(scanBtn.getAttribute("aria-pressed")).toBe("true")
  })

  it("the whole fleet is one visible control away, grouped by phase", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    // Verify is selected by default — "Show all agents" clears the filter
    await userEvent.click(
      root.getByRole("button", { name: /show all agents/i })
    )
    expect(root.getByText(/^all agents$/i)).toBeInTheDocument()
    // Scan agents join the verify fleet, grouped under phase headers
    expect(root.getAllByText(/dependency scanner/i).length).toBeGreaterThan(0)
    expect(
      container.querySelectorAll("[data-slot='agent-group-header']").length
    ).toBeGreaterThan(0)
    // All 14 agents counted: 5 visible + 9 collapsed into the roll-up
    expect(root.getByText(/\+9 more:/)).toBeInTheDocument()
  })

  it("skip and continue keeps the failed phase's record", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    await userEvent.click(root.getByRole("button", { name: /failed/i }))
    await userEvent.click(
      root.getByRole("button", { name: /skip and continue/i })
    )
    // The run completes, but nothing pretends verify finished
    expect(root.getByText(/completed with verify skipped/i)).toBeInTheDocument()
    expect(root.getByText(/10 \/ 14/)).toBeInTheDocument()
    expect(
      root.getAllByText(/report drafted from partial verification/i).length
    ).toBeGreaterThan(0)
  })

  it("recovery banner prices both paths before commitment", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    await userEvent.click(root.getByRole("button", { name: /failed/i }))
    expect(
      root.getByText(/retry replays 1 cached agent and re-runs 2 failed/i)
    ).toBeInTheDocument()
    expect(
      root.getByText(/skipping\s+flags the 15 unverified requirements/i)
    ).toBeInTheDocument()
  })

  it("pause and resume hand focus to each other", async () => {
    const { container } = render(<WorkflowRunMonitorBlock />)
    const root = within(container)
    await userEvent.click(root.getByRole("button", { name: /pause run/i }))
    const resume = root.getByRole("button", { name: /resume/i })
    await waitFor(() => expect(document.activeElement).toBe(resume))
    await userEvent.click(resume)
    const pause = root.getByRole("button", { name: /pause run/i })
    await waitFor(() => expect(document.activeElement).toBe(pause))
  })

  it("retry resolves — the re-run completes and the run finishes", () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<WorkflowRunMonitorBlock />)
      const root = within(container)
      fireEvent.click(root.getByRole("button", { name: /failed/i }))
      fireEvent.click(root.getByRole("button", { name: /retry phase/i }))
      // Mid-retry the run is live: Pause is reachable
      expect(
        root.getByRole("button", { name: /pause run/i })
      ).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(3100)
      })
      // The retry pays off — full completion, canonical totals
      expect(root.getByText(/14 \/ 14/)).toBeInTheDocument()
      expect(root.getAllByText(/all phases complete/i).length).toBeGreaterThan(
        0
      )
    } finally {
      vi.useRealTimers()
    }
  })
})
