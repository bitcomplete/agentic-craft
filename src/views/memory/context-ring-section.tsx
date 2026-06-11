"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Brain01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MEMORY_ENTRIES_PREVIEW = [
  { id: "m1", key: "Preferred release tier", value: "enterprise release" },
  { id: "m2", key: "Default launch policy", value: "Launch Policy v2" },
  { id: "m3", key: "Review workspace", value: "Launch review team" },
  {
    id: "m4",
    key: "Report format",
    value: "Markdown with operating playbook work unit headers",
  },
  { id: "m5", key: "product type", value: "self-serve onboarding flow" },
  { id: "m6", key: "Approval team", value: "Internal launch process" },
]

const RING_R = 34
const RING_CIRC = 2 * Math.PI * RING_R

export function ContextRingSection() {
  const [ringState, setRingState] = useState<Record<string, boolean>>({
    noContext: true,
    withContext: false,
  })
  const [ringAnimKey, setRingAnimKey] = useState(0)

  const handleRingToggle = (key: string) => {
    setRingState(() => {
      const next: Record<string, boolean> = {
        noContext: false,
        withContext: false,
      }
      next[key] = true
      return next
    })
    setRingAnimKey((k) => k + 1)
  }

  return (
    <section id="context-ring" className="page-section">
      <p className="section-label mb-3">Awareness</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Memory Context Ring
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Visual indicator showing how much memory context is loaded into the
        current session. Details are revealed on hover to avoid visual clutter.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "noContext", label: "No Context" },
            { key: "withContext", label: "With Context" },
          ]}
          active={ringState}
          onToggle={handleRingToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={ringAnimKey}
        >
          <div className="flex items-center gap-8">
            {/* Ring */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="group relative shrink-0 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    aria-label={
                      ringState.withContext
                        ? `${MEMORY_ENTRIES_PREVIEW.length} loaded memories`
                        : "No memory loaded"
                    }
                  />
                }
              >
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={RING_R}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-muted/40"
                  />
                  {ringState.withContext && (
                    <circle
                      cx="40"
                      cy="40"
                      r={RING_R}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRC}
                      strokeDashoffset={RING_CIRC * 0.35}
                      className="memory-ring-fill text-foreground/50"
                      style={
                        {
                          "--ring-circ": RING_CIRC,
                          "--ring-offset": RING_CIRC * 0.35,
                        } as React.CSSProperties
                      }
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Brain01Icon}
                    size={18}
                    strokeWidth={1.5}
                    className={
                      ringState.withContext
                        ? "text-foreground/60"
                        : "text-muted-foreground/30"
                    }
                  />
                </div>
              </TooltipTrigger>
              {ringState.withContext && (
                <TooltipContent
                  side="right"
                  sideOffset={12}
                  className="w-56 max-w-56 flex-col items-stretch gap-2 bg-popover text-popover-foreground"
                >
                  <p className="text-xs font-medium text-foreground/80">
                    Loaded memories
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {MEMORY_ENTRIES_PREVIEW.slice(0, 4).map((e) => (
                      <div key={e.id} className="flex items-baseline gap-2">
                        <span className="shrink-0 text-[10px] text-muted-foreground/70">
                          {e.key}
                        </span>
                        <span className="truncate text-[10px] text-muted-foreground">
                          {e.value}
                        </span>
                      </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground/70">
                      +{MEMORY_ENTRIES_PREVIEW.length - 4} more
                    </p>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>

            {/* Label */}
            <div>
              <p className="text-sm font-medium">
                {ringState.withContext ? "Memory active" : "No memory loaded"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ringState.withContext
                  ? `${MEMORY_ENTRIES_PREVIEW.length} entries loaded into this session — open the ring for details.`
                  : "Start a conversation to load reviewer preferences and context."}
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
