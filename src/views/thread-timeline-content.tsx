"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  ThreadTimeline,
  ThreadTimelineLine,
} from "@/components/ui/thread-timeline"

const TURNS = [
  { id: "1", message: "Can you review the Security Target document for CC evaluation compliance?", time: "12m ago" },
  { id: "2", message: "List the specific SFRs that are missing from the mapping", time: "10m ago" },
  { id: "3", message: "What about FDP_IFC.1?", time: "8m ago" },
  { id: "4", message: "Can you check if ALC_FLR.2 covers the flaw remediation timeline requirement?", time: "5m ago" },
  { id: "5", message: "Summarize all findings", time: "3m ago" },
  { id: "6", message: "Export the findings as a compliance checklist", time: "1m ago" },
  { id: "7", message: "Are there any open questions for the evaluation facility?", time: "just now" },
]

export function ThreadTimelineContent() {
  const [activeTurn, setActiveTurn] = React.useState<string | null>(null)

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Navigation</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Thread Timeline
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A vertical timeline gutter for navigating conversation threads.
          Lines represent turns, scale on proximity, and show tooltip
          previews on hover.
        </p>
      </header>

      <section id="demo" className="page-section">
        <p className="section-label mb-3">Interactive</p>
        <h2 className="text-xl font-semibold tracking-tight">Demo</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Hover over the timeline on the right to see proximity scaling
          and tooltip previews. Click a line to select that turn.
        </p>

        <div className="mt-10 rounded-lg border border-border/40 overflow-hidden">
          <div className="flex min-h-[500px]">
            {/* Conversation area */}
            <div className="flex-1 p-6 space-y-4">
              {TURNS.map((turn) => (
                <div key={turn.id}>
                  <div className="flex justify-end mb-3">
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-opacity duration-200",
                        activeTurn && activeTurn !== turn.id && "opacity-30",
                      )}
                    >
                      {turn.message}
                    </div>
                  </div>
                  <div className="flex justify-start">
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

            {/* Timeline gutter */}
            <ThreadTimeline
              threshold={3}
              onLineClick={(turnId) => {
                setActiveTurn((prev) => prev === turnId ? null : turnId)
              }}
            >
              {TURNS.map((turn, i) => (
                <ThreadTimelineLine
                  key={turn.id}
                  turnId={turn.id}
                  timestamp={turn.time}
                  active={i === TURNS.length - 1}
                >
                  {turn.message}
                </ThreadTimelineLine>
              ))}
            </ThreadTimeline>
          </div>
        </div>

        {activeTurn && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selected turn: <span className="text-foreground font-medium">{activeTurn}</span>
            {" -- "}
            <button
              className="underline hover:text-foreground"
              onClick={() => setActiveTurn(null)}
            >
              Clear
            </button>
          </p>
        )}
      </section>

      <section className="page-section">
        <p className="section-label mb-3">Specifications</p>
        <h2 className="text-xl font-semibold tracking-tight">Visual Specs</h2>
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Gutter width</td>
              <td className="py-3 font-medium text-foreground">32px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Line width (rest)</td>
              <td className="py-3 font-medium text-foreground">1.5px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Line width (max scale)</td>
              <td className="py-3 font-medium text-foreground">3px (scaleX: 2)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Proximity distance limit</td>
              <td className="py-3 font-medium text-foreground">80px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Spring config</td>
              <td className="py-3 font-medium text-foreground">stiffness: 600, damping: 45</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Tooltip max-width</td>
              <td className="py-3 font-medium text-foreground">260px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Threshold</td>
              <td className="py-3 font-medium text-foreground">6 turns (default)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Entrance</td>
              <td className="py-3 font-medium text-foreground">translateX slide-in, 200ms ease-out</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  )
}
