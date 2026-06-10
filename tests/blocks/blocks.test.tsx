import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { AgentSettingsBlock } from "../../registry/base-nova/blocks/agent-settings"
import { ApprovalWorkflowBlock } from "../../registry/base-nova/blocks/approval-workflow"
import { ClarifyingWorkflowBlock } from "../../registry/base-nova/blocks/clarifying-workflow"
import { MemoryReviewBlock } from "../../registry/base-nova/blocks/memory-review"
import { MultiAgentHandoffBlock } from "../../registry/base-nova/blocks/multi-agent-handoff"
import { ReviewWorkflowBlock } from "../../registry/base-nova/blocks/review-workflow"
import { RunMonitorBlock } from "../../registry/base-nova/blocks/run-monitor"
import { SourceBackedArtifact } from "../../registry/base-nova/blocks/source-backed-artifact"

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
