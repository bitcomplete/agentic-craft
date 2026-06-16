"use client"

import * as React from "react"

import { Thread, type ThreadStreamChunk } from "@/components/ui/thread"

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function* demoStream(): AsyncGenerator<ThreadStreamChunk> {
  const chunks = [
    "The retry path is clean. ",
    "The failing branch was the cache warmup, not the billing mutation. ",
    "I would ship the schema change and keep the API agent's retry guard in place.",
  ]

  for (const chunk of chunks) {
    await wait(420)
    yield chunk
  }
}

export function ThreadContent() {
  const [runId, setRunId] = React.useState(0)
  const [complete, setComplete] = React.useState(false)
  const [stream, setStream] = React.useState(() => demoStream())

  return (
    <article className="mx-auto w-full max-w-[1040px] px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 max-w-[720px]">
        <p className="section-label mb-3">Pattern 01</p>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          Thread
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          A composable thread for agent products: message slots, async iterable
          streaming, collapsible tool calls, a pulsing status hairline, and
          scroll anchoring that respects the reader.
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <Thread
          key={runId}
          stream={stream}
          streamLabel="Agent"
          onStreamComplete={() => setComplete(true)}
          className="h-[560px]"
        >
          <Thread.Status
            state={complete ? "complete" : "streaming"}
            label={complete ? "Ready for review" : "Reviewing branch"}
            detail={
              complete
                ? "3 tool calls complete · answer settled"
                : "2 tool calls complete · answer streaming"
            }
          />
          <Thread.Message role="user" name="You" timestamp="14:06">
            Inspect the billing migration and tell me if the retry path is safe
            to ship.
          </Thread.Message>
          <Thread.ToolCall
            state="done"
            title="Search workspace"
            summary="12 files scanned · 3 matches"
            duration="1.1s"
            defaultOpen
          >
            Found retry handling in <code>billing/retry-policy.ts</code>,
            <code>api/mutations/create-invoice.ts</code>, and the migration
            smoke test.
          </Thread.ToolCall>
          <Thread.ToolCall
            state="done"
            title="Read tests"
            summary="Cache warmup covered, duplicate mutation guarded"
            duration="2.8s"
          >
            The duplicate submission test asserts idempotency keys before the
            mutation writes.
          </Thread.ToolCall>
          <Thread.ToolCall
            state={complete ? "done" : "running"}
            title="Synthesize answer"
            summary={complete ? "Final recommendation ready" : "Writing"}
            duration={complete ? "4.2s" : undefined}
          />
        </Thread>

        <aside className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Install</p>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium transition-[background-color,box-shadow,transform] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted"
              onClick={() => {
                setComplete(false)
                setRunId((id) => id + 1)
                setStream(demoStream())
              }}
            >
              Replay
            </button>
          </div>
          <code className="mt-3 block overflow-hidden rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ellipsis whitespace-nowrap">
            npx shadcn add https://agenticcraft.dev/r/thread.json
          </code>
          <dl className="mt-4 grid gap-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Slots</dt>
              <dd className="mt-1 text-foreground">
                Thread.Message, Thread.ToolCall, Thread.Status
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Streaming</dt>
              <dd className="mt-1 text-foreground">
                AsyncIterable&lt;string | {"{ content, replace }"}&gt;
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </article>
  )
}
