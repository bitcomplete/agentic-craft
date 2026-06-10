"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Wrench01Icon,
  ArrowDown01Icon,
  Brain01Icon,
} from "@hugeicons/core-free-icons"
import {
  ToolCall,
  ToolCallTrigger,
  ToolCallLabel,
  ToolCallContent,
} from "@/components/ui/tool-call"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SUBAGENT_TOOLS = [
  {
    label: "Checking configuration management source material",
    duration: "1.8s",
    details: [
      { key: "Documents", value: "CM Plan v2.3, CM Records" },
      { key: "Status", value: "All source material present" },
    ],
  },
  {
    label: "Checking delivery readiness source material",
    duration: "0.9s",
    details: [
      { key: "Documents", value: "Delivery procedures rev 4" },
      { key: "Status", value: "Complete" },
    ],
  },
  {
    label: "Checking risk review source material",
    duration: "4.2s",
    details: [
      { key: "Documents", value: "Risk analysis report" },
      { key: "Status", value: "Pending — 2 items missing" },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Sub-component                                                      */
/* ------------------------------------------------------------------ */

function SubagentSection() {
  const [subagentState, setSubagentState] = useState({
    running: true,
    complete: false,
  })
  const [subagentProgress, setSubagentProgress] = useState(0)
  const [subagentOpen, setSubagentOpen] = useState(true)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const toggleSubagentControl = useCallback(
    (key: string) => {
      if (key === "running") {
        setSubagentState({ running: !subagentState.running, complete: false })
        setSubagentProgress(0)
        return
      }
      if (key === "complete") {
        const nextComplete = !subagentState.complete
        setSubagentState({ running: false, complete: nextComplete })
        setSubagentProgress(nextComplete ? 8 : 0)
      }
    },
    [subagentState.running, subagentState.complete]
  )

  useEffect(() => {
    const stopProgress = () => {
      if (progressRef.current) {
        clearInterval(progressRef.current)
        progressRef.current = null
      }
    }

    const startProgress = () => {
      if (!subagentState.running || document.hidden || progressRef.current) {
        return
      }

      progressRef.current = setInterval(() => {
        // Loop while "Running" is selected so the demo never drifts into the
        // complete state with the Running control still pressed.
        setSubagentProgress((prev) => (prev >= 7 ? 0 : prev + 1))
      }, 600)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopProgress()
        return
      }
      startProgress()
    }

    stopProgress()
    startProgress()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      stopProgress()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [subagentState.running])

  return (
    <>
      <Controls
        options={[
          { key: "running", label: "Running" },
          { key: "complete", label: "Complete" },
        ]}
        active={subagentState}
        onToggle={toggleSubagentControl}
      />

      <div className="rounded-lg border border-border/40 p-6">
        <button
          type="button"
          aria-label="Toggle Source Collector details"
          onClick={() => setSubagentOpen(!subagentOpen)}
          className="flex w-full items-center gap-2.5 py-2.5 text-left"
        >
          <HugeiconsIcon
            icon={Brain01Icon}
            size={14}
            strokeWidth={1.5}
            className="shrink-0 text-muted-foreground"
          />
          <span className="text-sm font-normal">Source Collector</span>
          {subagentProgress < 8 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {subagentProgress} of 8 review areas
            </span>
          )}
          <StatusIndicator
            status={subagentProgress >= 8 ? "complete" : "active"}
          />
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={12}
            strokeWidth={1.5}
            className={`ml-auto shrink-0 text-muted-foreground transition-transform duration-200 ${
              subagentOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {subagentOpen && (
          <div className="actions-expand flex flex-col gap-2 py-3 pl-6">
            <Separator />
            <p className="text-xs text-muted-foreground">
              Validating completeness and traceability of review source
              material for each review area.
            </p>
            <Progress value={(subagentProgress / 8) * 100} />
            {/* Nested tool calls */}
            <div className="mt-2 flex flex-col gap-1.5">
              {SUBAGENT_TOOLS.map((tool) => (
                <ToolCall
                  key={tool.label}
                  icon={Wrench01Icon}
                  status="completed"
                  timestamp={tool.duration}
                >
                  <ToolCallTrigger>
                    <ToolCallLabel>{tool.label}</ToolCallLabel>
                  </ToolCallTrigger>
                  <ToolCallContent>
                    <div className="flex flex-col gap-1 text-xs">
                      {tool.details.map((d) => (
                        <div key={d.key} className="flex gap-2">
                          <span className="text-muted-foreground">
                            {d.key}:
                          </span>
                          <span className="text-foreground">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </ToolCallContent>
                </ToolCall>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function SubagentsSection() {
  return (
    <section id="subagents" className="page-section">
      <p className="section-label mb-3">Orchestration</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Subagent Orchestration
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Expandable rows showing delegated subagent work. Each row carries its
        own progress indicator and related tool calls.
      </p>

      <div className="mt-10">
        <SubagentSection />
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Property
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Spec
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Progress format",
              '"N of M unit" — concrete, not percentage-based',
            ],
            ["Completion", '"complete" badge replaces the progress count'],
            [
              "Running indicator",
              "Pulsing dot next to the badge while in-progress",
            ],
            ["Nesting", "Nested tool calls inherit the same collapsed style"],
            [
              "Progress bar",
              "1px foreground/40 bar with transition-transform duration-500",
            ],
          ].map(([prop, spec], i, arr) => (
            <TableRow
              key={prop}
              className={
                i < arr.length - 1 ? "border-b border-border/50" : ""
              }
            >
              <TableCell className="py-3 pr-6 font-medium">{prop}</TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {spec}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Subagent cards let users monitor delegated work without leaving their
        current context. The progress bar provides glanceable status while
        nested tools offer drill-down detail.
      </p>
    </section>
  )
}
