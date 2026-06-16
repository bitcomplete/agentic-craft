"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ComputerTerminal01Icon,
  Copy01Icon,
  DocumentValidationIcon,
  FileSearchIcon,
  Loading03Icon,
  Note01Icon,
  TestTube01Icon,
  CheckmarkSquare02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Thread, type ThreadStreamChunk } from "@/components/ui/thread"
import { ThreadMarkdown } from "@/components/ui/thread-markdown"

const codeClass =
  "rounded-sm border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.92em] text-foreground"

const installCommands = {
  pnpm: "pnpm dlx shadcn@latest add https://agenticcraft.dev/r/thread.json",
  npm: "npx shadcn@latest add https://agenticcraft.dev/r/thread.json",
  yarn: "yarn dlx shadcn@latest add https://agenticcraft.dev/r/thread.json",
  bun: "bunx shadcn@latest add https://agenticcraft.dev/r/thread.json",
}

type PackageManager = keyof typeof installCommands

const packageManagers = Object.keys(installCommands) as PackageManager[]
const autoReplayStorageKey = "agentic-craft-thread-demo-auto-replayed:v1"

function ThreadDemoIcon({
  icon,
  placement = "inline-start",
  className,
}: {
  icon: IconSvgElement
  placement?: "inline-start" | "inline-end"
  className?: string
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      data-icon={placement}
      aria-hidden="true"
      className={className}
    />
  )
}

function renderToolDisclosureIcon() {
  return <ThreadDemoIcon icon={ArrowRight01Icon} placement="inline-end" />
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function legacyCopyToClipboard(
  value: string,
  restoreFocusTo?: HTMLElement | null
) {
  const textArea = document.createElement("textarea")
  textArea.value = value
  textArea.setAttribute("readonly", "")
  textArea.style.position = "fixed"
  textArea.style.opacity = "0"
  textArea.style.pointerEvents = "none"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  textArea.setSelectionRange(0, value.length)

  let hasCopied = false
  try {
    hasCopied = document.execCommand("copy")
  } catch {
    hasCopied = false
  }

  document.body.removeChild(textArea)

  restoreFocusTo?.focus({ preventScroll: true })

  return hasCopied
}

async function copyToClipboard(
  value: string,
  restoreFocusTo?: HTMLElement | null
) {
  if (!value) {
    return false
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      return legacyCopyToClipboard(value, restoreFocusTo)
    }
  }

  return legacyCopyToClipboard(value, restoreFocusTo)
}

function hasAutoReplayedDemo() {
  try {
    return window.sessionStorage.getItem(autoReplayStorageKey) === "true"
  } catch {
    return false
  }
}

function markAutoReplayedDemo() {
  try {
    window.sessionStorage.setItem(autoReplayStorageKey, "true")
  } catch {
    return
  }
}

async function* demoStream(): AsyncGenerator<ThreadStreamChunk> {
  const chunks = [
    "The retry path is **safe to ship** with the current guard.\n\n",
    "- Invoice creation is protected by idempotency keys before the mutation writes.\n",
    "- The cache warmup failure exits before customer-visible state changes.\n",
    "- Smoke coverage exercises duplicate submission and the retry branch.\n\n",
    "I would ship the schema change and keep the retry guard in place.",
  ]

  for (const chunk of chunks) {
    await wait(420)
    yield chunk
  }
}

export function ThreadContent() {
  const [runId, setRunId] = React.useState(0)
  const [complete, setComplete] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(true)
  const [packageManager, setPackageManager] =
    React.useState<PackageManager>("pnpm")
  const [copied, setCopied] = React.useState(false)
  const [copyStatus, setCopyStatus] = React.useState("")
  const copyTimerRef = React.useRef<number | null>(null)
  const autoReplayTimerRef = React.useRef<number | null>(null)
  const installCommand = installCommands[packageManager]

  const restartDemo = React.useCallback(() => {
    setComplete(false)
    setSearchOpen(true)
    setRunId((id) => id + 1)
  }, [])

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current)
      }

      if (autoReplayTimerRef.current) {
        window.clearTimeout(autoReplayTimerRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!complete || prefersReducedMotion()) {
      return
    }

    if (hasAutoReplayedDemo()) {
      return
    }

    autoReplayTimerRef.current = window.setTimeout(() => {
      markAutoReplayedDemo()
      autoReplayTimerRef.current = null
      restartDemo()
    }, 900)

    return () => {
      if (autoReplayTimerRef.current) {
        window.clearTimeout(autoReplayTimerRef.current)
        autoReplayTimerRef.current = null
      }
    }
  }, [complete, restartDemo])

  async function copyInstallCommand(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const hasCopied = await copyToClipboard(installCommand, event.currentTarget)

    if (hasCopied) {
      setCopied(true)
      setCopyStatus("Install command copied.")

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current)
      }

      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 1400)
    } else {
      setCopied(false)
      setCopyStatus("Copy failed. Select the command manually.")
    }
  }

  return (
    <article className="mx-auto w-full max-w-[960px] px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[720px]">
          <p className="section-label mb-3">Pattern 01</p>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Thread
          </h1>
          <p className="mt-4 text-sm leading-6 text-pretty text-muted-foreground sm:text-base sm:leading-7">
            A composable thread for agent products: message slots, async
            iterable streaming, collapsible tool calls, a pulsing status
            hairline, and scroll anchoring that respects the reader.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-10 w-fit items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-[background-color,box-shadow,transform] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted"
          onClick={restartDemo}
        >
          Replay demo
        </button>
      </header>

      <section className="grid gap-4">
        <Thread
          key={runId}
          stream={demoStream}
          aria-label="Thread preview"
          renderStream={(content, state) => (
            <Thread.Message role={state.role} streaming={state.streaming}>
              <ThreadMarkdown streaming={state.streaming}>
                {content}
              </ThreadMarkdown>
            </Thread.Message>
          )}
          onStreamComplete={() => {
            setComplete(true)
          }}
          scrollToBottomIcon={<ThreadDemoIcon icon={ArrowDown01Icon} />}
          className="h-[500px] shadow-[0_22px_64px_-52px_rgb(12_12_12/0.72)]"
        >
          <Thread.Status
            state={complete ? "complete" : "streaming"}
            label={complete ? "Ready for review" : "Reviewing branch"}
            detail={
              complete
                ? "5 tool calls complete · answer settled"
                : "4 tool calls complete · answer streaming"
            }
          />
          <Thread.Message role="user">
            Is the billing retry path safe to ship?
          </Thread.Message>
          <Thread.Message>
            I’ll check the mutation boundary first, then compare it against
            tests and rollout notes.
          </Thread.Message>
          <Thread.ToolCall
            state="done"
            title="Search workspace"
            summary="12 files scanned · 3 matches"
            duration="1.1s"
            icon={<ThreadDemoIcon icon={FileSearchIcon} />}
            disclosureIcon={renderToolDisclosureIcon}
            open={searchOpen}
            onOpenChange={setSearchOpen}
          >
            <div className="grid gap-1.5">
              <p>
                Found retry handling in{" "}
                <code className={codeClass}>billing/retry-policy.ts</code>,{" "}
                <code className={codeClass}>
                  api/mutations/create-invoice.ts
                </code>
                , and smoke tests.
              </p>
            </div>
          </Thread.ToolCall>
          <Thread.ToolCall
            state="done"
            title="Trace mutation writes"
            summary={
              <>
                <span className="sm:hidden">Writes behind guard</span>
                <span className="hidden sm:inline">
                  Invoice writes stay behind the retry guard
                </span>
              </>
            }
            duration="2.0s"
            icon={<ThreadDemoIcon icon={DocumentValidationIcon} />}
            disclosureIcon={renderToolDisclosureIcon}
          >
            The mutation creates the retry key before invoice creation and exits
            early when the key already exists.
          </Thread.ToolCall>
          <Thread.ToolCall
            state="done"
            title="Read tests"
            summary={
              <>
                <span className="sm:hidden">Cache warmup covered</span>
                <span className="hidden sm:inline">
                  Cache warmup covered, duplicate mutation guarded
                </span>
              </>
            }
            duration="2.8s"
            icon={<ThreadDemoIcon icon={TestTube01Icon} />}
            disclosureIcon={renderToolDisclosureIcon}
          >
            The duplicate submission test asserts idempotency keys before the
            mutation writes.
          </Thread.ToolCall>
          <Thread.ToolCall
            state="done"
            title="Check rollout notes"
            summary="No schema blocker in release notes"
            duration="3.6s"
            icon={<ThreadDemoIcon icon={Note01Icon} />}
            disclosureIcon={renderToolDisclosureIcon}
          >
            The rollout notes only call out cache warmup retries; no downstream
            invoice consumer depends on the old branch.
          </Thread.ToolCall>
          <Thread.ToolCall
            state={complete ? "done" : "running"}
            title="Synthesize answer"
            summary={complete ? "Final recommendation ready" : "Writing"}
            duration={complete ? "4.2s" : undefined}
            icon={
              complete ? (
                <ThreadDemoIcon icon={CheckmarkSquare02Icon} />
              ) : (
                <ThreadDemoIcon
                  icon={Loading03Icon}
                  className="animate-spin motion-reduce:animate-none"
                />
              )
            }
          />
        </Thread>

        <div className="mt-3 grid gap-3">
          <div className="grid gap-1.5">
            <h2 className="text-base leading-none font-semibold tracking-tight text-foreground">
              Installation
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Adds the Thread shell. Pair it with thread-markdown for Streamdown
              rendering.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-background shadow-[0_0_0_1px_var(--border)]">
            <Tabs
              value={packageManager}
              onValueChange={(value) => {
                if (value in installCommands) {
                  setPackageManager(value as PackageManager)
                  setCopied(false)
                  setCopyStatus("")
                }
              }}
              className="gap-0"
            >
              <div className="flex min-h-12 items-center gap-2 border-b border-border/50 bg-muted/20 px-3 pr-12">
                <div className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
                  <HugeiconsIcon
                    icon={ComputerTerminal01Icon}
                    size={15}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <TabsList
                    aria-label="Package manager"
                    className="h-8 min-w-max rounded-none bg-transparent p-0"
                  >
                    {packageManagers.map((manager) => (
                      <TabsTrigger
                        key={manager}
                        value={manager}
                        className="h-7 flex-none rounded-md border border-transparent px-3 pt-0.5 shadow-none data-active:border-input data-active:bg-background data-active:shadow-[0_0_0_1px_var(--border)]"
                      >
                        {manager}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
              <div className="overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                {packageManagers.map((manager) => (
                  <TabsContent
                    key={manager}
                    value={manager}
                    className="mt-0 px-4 py-4"
                  >
                    <pre>
                      <code
                        className="relative block min-w-max font-mono text-sm leading-5 text-muted-foreground"
                        data-language="bash"
                      >
                        {installCommands[manager]}
                      </code>
                    </pre>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
            <Button
              type="button"
              data-slot="copy-button"
              data-compact-touch
              size="icon-sm"
              variant="ghost"
              aria-label={copied ? "Install command copied" : "Copy command"}
              className="absolute top-2 right-2 z-10 opacity-70 transition-[background-color,color,opacity,box-shadow,transform] active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100"
              onClick={copyInstallCommand}
            >
              <span className="sr-only">
                {copied ? "Install command copied" : "Copy command"}
              </span>
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                data-icon="inline-start"
                aria-hidden="true"
              />
            </Button>
            <p role="status" aria-live="polite" className="sr-only">
              {copyStatus}
            </p>
          </div>
        </div>
      </section>
    </article>
  )
}
