import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Thread, type ThreadStreamChunk } from "../../src/components/ui/thread"

async function* streamChunks(chunks: ThreadStreamChunk[]) {
  for (const chunk of chunks) {
    yield chunk
  }
}

describe("Thread", () => {
  it("streams async iterable chunks into an assistant message", async () => {
    const onStreamComplete = vi.fn()

    render(
      <Thread
        stream={streamChunks(["The retry path ", { content: "is safe." }])}
        onStreamComplete={onStreamComplete}
      />
    )

    expect(await screen.findByText("The retry path is safe.")).toBeVisible()

    await waitFor(() => {
      expect(onStreamComplete).toHaveBeenCalledWith("The retry path is safe.")
    })
  })

  it("supports replace chunks for model APIs that send snapshots", async () => {
    render(
      <Thread
        stream={streamChunks([
          "The retry path is unsafe.",
          { content: "The retry path is safe.", replace: true },
        ])}
      />
    )

    expect(await screen.findByText("The retry path is safe.")).toBeVisible()
    expect(
      screen.queryByText("The retry path is unsafe.")
    ).not.toBeInTheDocument()
  })

  it("expands and collapses tool call details", async () => {
    render(
      <Thread>
        <Thread.ToolCall title="Search workspace" state="done" duration="1.1s">
          Found 3 matches across 12 files.
        </Thread.ToolCall>
      </Thread>
    )

    const trigger = screen.getByRole("button", {
      name: "Toggle Search workspace details",
    })

    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText(/found 3 matches/i)).not.toBeInTheDocument()

    await userEvent.click(trigger)

    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText(/found 3 matches/i)).toBeVisible()
  })
})
