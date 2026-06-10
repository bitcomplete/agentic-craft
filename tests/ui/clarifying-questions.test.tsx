import * as React from "react"
import { render, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import {
  ClarifyingQuestions,
  ClarifyingQuestionField,
  ClarifyingQuestionStep,
  type ClarifyingQuestion,
  type ClarifyingQuestionValue,
} from "../../src/components/ui/clarifying-questions"

const singleQuestion: ClarifyingQuestion = {
  id: "scope",
  label: "Which scope?",
  kind: "single",
  options: [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ],
}

const multipleQuestion: ClarifyingQuestion = {
  id: "features",
  label: "Which features?",
  kind: "multiple",
  options: [
    { value: "x", label: "Feature X" },
    { value: "y", label: "Feature Y" },
  ],
}

function SingleStep({
  onValueChange,
}: {
  onValueChange?: (id: string, value: ClarifyingQuestionValue) => void
}) {
  const [value, setValue] = React.useState<ClarifyingQuestionValue>("a")

  return (
    <ClarifyingQuestions.Root>
      <ClarifyingQuestionStep
        question={singleQuestion}
        value={value}
        onValueChange={(id, val) => {
          setValue(val)
          onValueChange?.(id, val)
        }}
      />
    </ClarifyingQuestions.Root>
  )
}

function MultipleStep({
  onValueChange,
}: {
  onValueChange?: (id: string, value: ClarifyingQuestionValue) => void
}) {
  const [value, setValue] = React.useState<ClarifyingQuestionValue>(["x"])

  return (
    <ClarifyingQuestions.Root>
      <ClarifyingQuestionStep
        question={multipleQuestion}
        value={value}
        onValueChange={(id, val) => {
          setValue(val)
          onValueChange?.(id, val)
        }}
      />
    </ClarifyingQuestions.Root>
  )
}

describe("ClarifyingQuestions — single kind", () => {
  it("clicking the already-selected option does NOT change selection to empty string", async () => {
    const onValueChange = vi.fn()
    const { container } = render(<SingleStep onValueChange={onValueChange} />)
    const root = within(container)

    // Option A is currently selected (aria-pressed=true on button)
    // The ClarifyingQuestionStep uses option rows (buttons) for single kind
    const optionABtn = root.getByRole("button", { name: "Option A" })

    await userEvent.click(optionABtn)

    // For single kind: toggleOption calls onValueChange with the option value (not empty)
    // If called, the value must NOT be "" or undefined
    if (onValueChange.mock.calls.length > 0) {
      const lastValue = onValueChange.mock.calls.at(-1)![1]
      expect(lastValue).not.toBe("")
      expect(lastValue).toBe("a")
    }
    // If NOT called (component skips re-selecting same value), that's also correct
    // Either way, the value stays "a" — not cleared
  })

  it("option row aria-label is the bare option label (not Select/Deselect prefix) for single kind", () => {
    const { container } = render(<SingleStep />)
    const root = within(container)

    // For single kind, aria-label should be the option label directly
    const optionA = root.getByRole("button", { name: "Option A" })
    const optionB = root.getByRole("button", { name: "Option B" })

    expect(optionA).toBeInTheDocument()
    expect(optionB).toBeInTheDocument()

    // Must NOT have "Select" or "Deselect" prefix
    expect(optionA.getAttribute("aria-label")).toBe("Option A")
    expect(optionB.getAttribute("aria-label")).toBe("Option B")
  })
})

describe("ClarifyingQuestions — multiple kind", () => {
  it("clicking a selected option deselects it (removes from array)", async () => {
    const onValueChange = vi.fn()
    const { container } = render(<MultipleStep onValueChange={onValueChange} />)
    const root = within(container)

    // Feature X is currently selected
    const featureXBtn = root.getByRole("button", {
      name: /deselect feature x/i,
    })
    await userEvent.click(featureXBtn)

    // After click, onValueChange should be called with Feature X removed
    expect(onValueChange).toHaveBeenCalled()
    const lastValue = onValueChange.mock.calls.at(-1)![1] as string[]
    expect(Array.isArray(lastValue)).toBe(true)
    expect(lastValue).not.toContain("x")
  })

  it("option row aria-label uses 'Select X' / 'Deselect X' prefix for multiple kind", () => {
    const { container } = render(<MultipleStep />)
    const root = within(container)

    // Feature X is selected so should show Deselect
    const deselect = root.getByRole("button", { name: /deselect feature x/i })
    expect(deselect).toBeInTheDocument()

    // Feature Y is not selected so should show Select
    const select = root.getByRole("button", { name: /select feature y/i })
    expect(select).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// ClarifyingQuestionField — ToggleGroup variant (single-kind regression)
// ---------------------------------------------------------------------------
// The ToggleGroup path differs from the ClarifyingQuestionOptionRow path used
// by ClarifyingQuestionStep. When multiple=false and the already-selected chip
// is clicked, Base UI fires onValueChange([]) (empty array). The fix returns
// early when next.at(-1) is undefined so onValueChange is never called with "".

function SingleField({
  onValueChange,
}: {
  onValueChange?: (id: string, value: ClarifyingQuestionValue) => void
}) {
  const [value, setValue] = React.useState<ClarifyingQuestionValue>("a")

  return (
    <ClarifyingQuestions.Root>
      <ClarifyingQuestionField
        question={singleQuestion}
        value={value}
        onValueChange={(id, val) => {
          setValue(val)
          onValueChange?.(id, val)
        }}
      />
    </ClarifyingQuestions.Root>
  )
}

describe("ClarifyingQuestionField — ToggleGroup single-kind regression", () => {
  it("clicking the already-selected chip does not call onValueChange with empty string", async () => {
    const onValueChange = vi.fn()
    const { container } = render(<SingleField onValueChange={onValueChange} />)
    const root = within(container)

    // "Option A" chip is currently selected (value="a")
    const chipA = root.getByRole("button", { name: "Option A" })
    await userEvent.click(chipA)

    // The guard must prevent any call with "" or with an empty-array collapse
    const emittedValues = onValueChange.mock.calls.map((c) => c[1])
    expect(emittedValues).not.toContain("")
    // If the guard fired, onValueChange is not called at all — value stays "a"
    if (onValueChange.mock.calls.length > 0) {
      expect(emittedValues.at(-1)).toBe("a")
    }
  })

  it("clicking the other chip calls onValueChange with the new value", async () => {
    const onValueChange = vi.fn()
    const { container } = render(<SingleField onValueChange={onValueChange} />)
    const root = within(container)

    // "Option B" chip is not selected; clicking it should move selection to "b"
    const chipB = root.getByRole("button", { name: "Option B" })
    await userEvent.click(chipB)

    expect(onValueChange).toHaveBeenCalled()
    const lastValue = onValueChange.mock.calls.at(-1)![1]
    expect(lastValue).toBe("b")
  })
})
