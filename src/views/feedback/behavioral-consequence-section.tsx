"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  MessageIcon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { AGENT_PROSE_COLOR } from "./data"

export function BehavioralConsequenceSection() {
  const [behaviorState, setBehaviorState] = useState<Record<string, boolean>>({
    before: true,
    after: false,
  })

  const handleBehaviorToggle = useCallback((key: string) => {
    setBehaviorState(() => {
      const next: Record<string, boolean> = { before: false, after: false }
      next[key] = true
      return next
    })
  }, [])

  return (
    <section id="behavioral-consequence" className="page-section">
      <p className="section-label mb-3">Adaptation</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Behavioral Consequence
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        How the agent&apos;s behavior visibly changes after receiving feedback.
        Demonstrates the feedback loop closing — the reviewer sees the before
        and after side by side. The After state includes an annotation card that
        links back to the original feedback entry so the change is fully
        traceable.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "before", label: "Before" },
            { key: "after", label: "After" },
          ]}
          active={behaviorState}
          onToggle={handleBehaviorToggle}
        />

        <div className="rounded-lg border border-border/40 p-4 sm:p-6">
          {behaviorState.before ? (
            <div>
              <p
                className="agent-prose text-base"
                style={{ color: AGENT_PROSE_COLOR }}
              >
                The launch readiness plan requires dedicated support plan for
                issue triage procedures. This pattern ensures that the team has
                an explicit process to track and correct issues reported by
                users of the product.
              </p>
              <div className="mt-3 flex items-center gap-1">
                <span className="text-muted-foreground/50">
                  <HugeiconsIcon
                    icon={ThumbsUpIcon}
                    size={14}
                    strokeWidth={1.5}
                  />
                </span>
                <span className="text-muted-foreground/50">
                  <HugeiconsIcon
                    icon={ThumbsDownIcon}
                    size={14}
                    strokeWidth={1.5}
                  />
                </span>
              </div>
            </div>
          ) : (
            <div className="feedback-fade-in flex flex-col gap-3">
              <div>
                <p
                  className="agent-prose text-base"
                  style={{ color: AGENT_PROSE_COLOR }}
                >
                  The launch readiness plan requires{" "}
                  <span className="feedback-highlight-in rounded-md px-1">
                    standard support plan
                  </span>{" "}
                  for issue triage procedures. This pattern ensures that the
                  team has an explicit process to track and correct issues
                  reported by users of the product.
                </p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-foreground/60">
                    <HugeiconsIcon
                      icon={ThumbsUpIcon}
                      size={14}
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="text-muted-foreground/50">
                    <HugeiconsIcon
                      icon={ThumbsDownIcon}
                      size={14}
                      strokeWidth={1.5}
                    />
                  </span>
                </div>
              </div>

              {/* Annotation */}
              <div className="feedback-slide-in flex items-start gap-3 border-l border-foreground/15 bg-foreground/[0.02] py-3 pl-3">
                <HugeiconsIcon
                  icon={MessageIcon}
                  size={14}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">
                      Correction applied
                    </span>{" "}
                    — dedicated support plan → standard support plan
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Linked to feedback from 2026-03-14 · 11:07. The agent now
                    correctly references the base issue triage component for
                    enterprise release reviews.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
