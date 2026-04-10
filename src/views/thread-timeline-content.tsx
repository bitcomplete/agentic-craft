"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  ThreadTimeline,
  ThreadTimelineLine,
  ThreadTimelineMessage,
} from "@/components/ui/thread-timeline"

const TURNS = [
  { id: "1", message: "Can you review the latest checkout release before we ship it?", time: "12m ago" },
  { id: "2", message: "Show me what changed in the latest deployment", time: "10m ago" },
  { id: "3", message: "Is it safe to roll this back if needed?", time: "8m ago" },
  { id: "4", message: "Can you send a short handoff summary to the team?", time: "5m ago" },
  { id: "5", message: "How should we harden this before launch?", time: "3m ago" },
  { id: "6", message: "Which regions are impacted by this rollout?", time: "1m ago" },
  { id: "7", message: "Was this review helpful overall?", time: "just now" },
]

export function ThreadTimelineContent() {
  const [activeTurn, setActiveTurn] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Pattern Reference</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Thread Timeline
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A thread-navigation pattern for long conversations. In the current
          implementation, a compact trigger opens an overlay of turn cards so the
          user can jump across the thread without losing the conversation context.
        </p>
      </header>

      <section id="demo" className="page-section">
        <p className="section-label mb-3">Interactive</p>
        <h2 className="text-xl font-semibold tracking-tight">Demo</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Open the timeline in the top-right corner, then click a card to jump to
          that turn. The conversation should remain visually connected to the
          navigation instead of feeling like a detached outline.
        </p>

        <div className="mt-10 overflow-hidden rounded-lg border border-border/40">
          <ThreadTimeline
            threshold={6}
            scrollContainerRef={scrollRef}
            onLineClick={(turnId) => {
              setActiveTurn(turnId)
            }}
          >
            <div ref={scrollRef} className="relative max-h-[500px] overflow-y-auto p-6 pr-14">
              <div className="space-y-4">
                {TURNS.map((turn) => (
                  <div key={turn.id}>
                    <ThreadTimelineMessage turnId={turn.id}>
                      {turn.message}
                    </ThreadTimelineMessage>
                    <div className="mt-3 flex justify-start">
                      <div
                        className={cn(
                          "max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3 transition-opacity duration-200",
                          activeTurn && activeTurn !== turn.id && "opacity-30",
                        )}
                      >
                        <div className="h-2 w-48 rounded bg-muted-foreground/10" />
                        <div className="mt-2 h-2 w-32 rounded bg-muted-foreground/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {TURNS.map((turn) => (
              <ThreadTimelineLine key={turn.id} turnId={turn.id}>
                {turn.message}
              </ThreadTimelineLine>
            ))}
          </ThreadTimeline>
        </div>

        {activeTurn && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selected turn: <span className="text-foreground font-medium">{activeTurn}</span>
            {" — "}
            <button
              className="underline hover:text-foreground"
              onClick={() => setActiveTurn(null)}
            >
              Clear
            </button>
          </p>
        )}
      </section>

      <section id="specs" className="page-section">
        <p className="section-label mb-3">Specifications</p>
        <h2 className="text-xl font-semibold tracking-tight">Current behavior</h2>
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Trigger</td>
              <td className="py-3 font-medium text-foreground">Top-right floating button</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Visibility threshold</td>
              <td className="py-3 font-medium text-foreground">6 turns by default</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Open state</td>
              <td className="py-3 font-medium text-foreground">Overlay of clickable turn cards</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Selection behavior</td>
              <td className="py-3 font-medium text-foreground">Card click selects and jumps to the target turn</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Animation model</td>
              <td className="py-3 font-medium text-foreground">Shared-layout morph between inline turn chip and overlay card</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Layout impact</td>
              <td className="py-3 font-medium text-foreground">No permanent gutter width reserved</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Use case</td>
              <td className="py-3 font-medium text-foreground">Long-running chats where users need quick re-entry into earlier turns</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  )
}
