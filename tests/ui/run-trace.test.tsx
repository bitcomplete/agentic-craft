import { render, within } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { RunTrace, type RunTraceEvent } from "../../src/components/ui/run-trace"

const eventWithDetail: RunTraceEvent = {
  id: "with-detail",
  title: "Event with detail",
  description: "This event has expandable detail.",
  status: "complete",
  detail: "Detailed information about this event.",
}

const eventWithoutDetail: RunTraceEvent = {
  id: "no-detail",
  title: "Event without detail",
  description: "This event has no detail panel.",
  status: "complete",
}

describe("RunTrace", () => {
  it("event WITH detail renders a <details> element", () => {
    const { container } = render(
      <RunTrace
        title="Test trace"
        events={[eventWithDetail, eventWithoutDetail]}
      />
    )

    // Exactly 1 details element — only the event with detail uses it
    const detailsElements = container.querySelectorAll("details")
    expect(detailsElements).toHaveLength(1)

    // The details element contains the event's detail content
    expect(detailsElements[0]!.textContent).toContain(
      "Detailed information about this event."
    )
  })

  it("event WITHOUT detail renders no <details> or <summary> in its row", () => {
    const { container } = render(
      <RunTrace
        title="Test trace"
        events={[eventWithDetail, eventWithoutDetail]}
      />
    )

    // Find the plain div row for the event without detail
    const rows = container.querySelectorAll(
      "[data-slot='run-trace-event']:not(details)"
    )
    // Only 1 non-details row (the event without detail)
    expect(rows).toHaveLength(1)

    // That row has no summary element inside it
    const summaryInsidePlainRow = rows[0]!.querySelector("summary")
    expect(summaryInsidePlainRow).toBeNull()
  })

  it("the detail-less row has no summary ancestor", () => {
    const { container } = render(
      <RunTrace title="Test trace" events={[eventWithoutDetail]} />
    )

    // Get the event title text node parent chain — it should not include a summary
    const titleEl = within(container).getByText("Event without detail")
    const el: Element | null = titleEl.closest("summary")
    expect(el).toBeNull()
  })
})
