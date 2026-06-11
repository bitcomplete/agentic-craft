"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Brain01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AutoMemorySection() {
  const [autoState, setAutoState] = useState<Record<string, boolean>>({
    detected: true,
    saved: false,
    dismissed: false,
  })
  const [autoAnimKey, setAutoAnimKey] = useState(0)

  const handleAutoToggle = useCallback((key: string) => {
    setAutoState(() => {
      const next: Record<string, boolean> = {
        detected: false,
        saved: false,
        dismissed: false,
      }
      next[key] = true
      return next
    })
    setAutoAnimKey((k) => k + 1)
  }, [])

  return (
    <section id="auto-memory" className="page-section">
      <p className="section-label mb-3">Detection</p>
      <h2 className="text-xl font-semibold tracking-tight">Auto-Memory</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        The agent detects learnable information from conversation and offers to
        save it as a memory — the reviewer always has the final say.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "detected", label: "Detected" },
            { key: "saved", label: "Saved" },
            { key: "dismissed", label: "Dismissed" },
          ]}
          active={autoState}
          onToggle={handleAutoToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={autoAnimKey}
        >
          {/* Agent message context */}
          <div className="mb-3">
            <p
              className="agent-prose text-base"
              style={{ color: "var(--foreground)" }}
            >
              I see you’ve been consistently requesting enterprise release
              reviews across the last three sessions. The reference document
              Launch Policy v2 appears to be your default reference.
            </p>
          </div>

          {/* Detected banner */}
          {autoState.detected && (
            <div className="memory-slide-in flex items-center justify-between border-l border-foreground/15 bg-foreground/[0.02] py-3 pl-3">
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={Brain01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  I noticed you prefer{" "}
                  <span className="font-medium text-foreground/80">
                    enterprise release
                  </span>{" "}
                  — save this preference?
                </p>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleAutoToggle("saved")}
                  variant="outline"
                  size="xs"
                >
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    strokeWidth={1.5}
                    data-icon="inline-start"
                  />
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={() => handleAutoToggle("dismissed")}
                  variant="ghost"
                  size="xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Saved confirmation */}
          {autoState.saved && (
            <div className="memory-fade-in flex items-center gap-2 border-l border-foreground/15 bg-foreground/[0.02] py-3 pl-3">
              <HugeiconsIcon
                icon={Tick01Icon}
                size={14}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground">Preference saved</p>
            </div>
          )}

          {/* Dismissed — banner gone, just the message */}
          {autoState.dismissed && (
            <div className="memory-fade-in flex items-center gap-2 rounded-md px-4 py-2">
              <p className="text-xs text-muted-foreground/70 italic">
                Suggestion dismissed — the agent will not ask about this
                preference again.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              State
            </TableHead>
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Visual
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Behavior
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Detected",
              "Banner below agent message with Save/Dismiss",
              "Agent surfaces the detected preference with a clear opt-in prompt",
            ],
            [
              "Saved",
              "Brief confirmation message",
              "Fades in, replacing the banner. Memory is persisted immediately",
            ],
            [
              "Dismissed",
              "Banner removed, muted note",
              "Agent will not re-prompt for this particular preference",
            ],
          ].map(([state, visual, behavior], i) => (
            <TableRow
              key={state}
              className={i < 2 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-2.5 pr-6 font-medium">{state}</TableCell>
              <TableCell className="py-2.5 pr-6 text-muted-foreground">
                {visual}
              </TableCell>
              <TableCell className="py-2.5 text-muted-foreground">
                {behavior}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Auto-memory is opt-in by design. The agent detects patterns but never
        persists without explicit reviewer consent. This is critical for
        regulated environments where auditors may need to justify what data the
        tool retains.
      </div>
    </section>
  )
}
