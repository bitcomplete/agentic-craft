import { render, within, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { Composer, ComposerCard } from "../../src/components/ui/composer"
import { ComposerInput } from "../../src/components/ui/composer-input"

function TestComposer({ onSend }: { onSend: (value: string) => void }) {
  return (
    <Composer onSend={onSend}>
      <ComposerCard>
        <ComposerInput />
      </ComposerCard>
    </Composer>
  )
}

describe("Composer", () => {
  it("calls onSend exactly once when Enter is pressed twice rapidly (isSending guard)", async () => {
    const onSend = vi.fn()
    const { container } = render(<TestComposer onSend={onSend} />)

    const textarea = within(container).getByRole("textbox", {
      name: /message/i,
    })

    // type text first so canSend is true
    await userEvent.type(textarea, "hello")

    // press Enter twice in rapid succession
    await userEvent.keyboard("{Enter}{Enter}")

    // isSending guard: second Enter should be a no-op because send() returns early
    expect(onSend).toHaveBeenCalledTimes(1)
    expect(onSend).toHaveBeenCalledWith("hello")
  })

  it("does not send when Enter is pressed with isComposing (IME composition)", async () => {
    const onSend = vi.fn()
    const { container } = render(<TestComposer onSend={onSend} />)

    const textarea = within(container).getByRole("textbox", {
      name: /message/i,
    })

    await userEvent.type(textarea, "hello")

    // Fire keydown with isComposing=true (simulates IME composition)
    fireEvent.keyDown(textarea, {
      key: "Enter",
      isComposing: true,
    })

    expect(onSend).not.toHaveBeenCalled()
  })
})
