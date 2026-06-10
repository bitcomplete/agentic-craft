"use client"

import { useState, useCallback } from "react"
import { Wrench01Icon } from "@hugeicons/core-free-icons"
import {
  ToolCall,
  ToolCallTrigger,
  ToolCallLabel,
  ToolCallContent,
  ToolCallError,
} from "@/components/ui/tool-call"
import { PatternControls as Controls } from "@/components/pattern-controls"
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

const TOOL_CALLS_DATA = [
  {
    label: "Searching document repository",
    duration: "1.2s",
    details: [
      { key: "Query", value: "active workflow requirements" },
      { key: "Results", value: "47 documents matched" },
      { key: "Scope", value: "Project brief v3" },
    ],
  },
  {
    label: "Loading project brief definitions",
    duration: "0.4s",
    details: [
      { key: "File", value: "Project-Brief-v3.pdf" },
      { key: "Requirements parsed", value: "23 requirements" },
      { key: "Review criteria parsed", value: "14 review criteria" },
    ],
  },
  {
    label: "Cross-referencing test case mappings",
    duration: "3.4s",
    details: [
      { key: "Test cases", value: "87 mapped" },
      {
        key: "Unmapped requirements",
        value: "2 (Fallback behavior, Cleanup behavior)",
      },
    ],
  },
  {
    label: "Generating coverage matrix",
    duration: "0.9s",
    details: [
      { key: "Coverage", value: "91.3% (21 of 23 requirements)" },
      { key: "Output", value: "coverage-matrix-2026-03.xlsx" },
    ],
  },
]

const ERROR_TOOL = {
  label: "Checking remote syslog connectivity",
  duration: "8.2s",
  error:
    "Connection timed out — the remote syslog server at 10.0.4.22:514 did not respond within 8 seconds.",
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ToolCallsSection() {
  const [toolState, setToolState] = useState({
    expandAll: false,
    error: false,
    grouped: false,
  })

  const toggleToolControl = useCallback((key: string) => {
    setToolState((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }, [])

  return (
    <section id="tool-calls" className="page-section">
      <p className="section-label mb-3">Actions</p>
      <h2 className="text-xl font-semibold tracking-tight">Tool Calls</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Expandable, human-readable action indicators. Each tool call shows a
        plain-language label — never a function signature. Click to reveal
        key-value details.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "expandAll", label: "Expand All" },
            { key: "error", label: "Error State" },
            { key: "grouped", label: "Grouped" },
          ]}
          active={toolState}
          onToggle={toggleToolControl}
        />

        <div className="rounded-lg border border-border/40 p-6">
          <div
            className={`flex flex-col gap-1.5 ${toolState.grouped ? "border-l-2 border-border pl-3" : ""}`}
          >
            {toolState.error ? (
              <>
                <ToolCall
                  key={`error-ok-${toolState.expandAll}`}
                  icon={Wrench01Icon}
                  status="completed"
                  timestamp={TOOL_CALLS_DATA[0].duration}
                  defaultExpanded={toolState.expandAll}
                >
                  <ToolCallTrigger>
                    <ToolCallLabel>{TOOL_CALLS_DATA[0].label}</ToolCallLabel>
                  </ToolCallTrigger>
                  <ToolCallContent>
                    <div className="flex flex-col gap-1 text-xs">
                      {TOOL_CALLS_DATA[0].details.map((d) => (
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
                <ToolCall
                  icon={Wrench01Icon}
                  status="failed"
                  timestamp={ERROR_TOOL.duration}
                >
                  <ToolCallTrigger>
                    <ToolCallLabel>{ERROR_TOOL.label}</ToolCallLabel>
                  </ToolCallTrigger>
                  <ToolCallError>{ERROR_TOOL.error}</ToolCallError>
                </ToolCall>
              </>
            ) : (
              TOOL_CALLS_DATA.map((tool) => (
                <ToolCall
                  key={`${tool.label}-${toolState.expandAll}`}
                  icon={Wrench01Icon}
                  status="completed"
                  timestamp={tool.duration}
                  defaultExpanded={toolState.expandAll}
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
              ))
            )}
          </div>
        </div>
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
            ["Tool title", "14px sans, font-weight 400 (never bold)"],
            ["Inner detail text", "12px, key in muted, value in foreground"],
            ["Icons", "All monochrome — no colored status indicators"],
            [
              "Labels",
              "Human-readable only — no function signatures or code",
            ],
            [
              "Duration",
              'Right-aligned in muted text; errors show "failed ·" prefix',
            ],
            [
              "Interaction",
              "Click anywhere on the header row to expand/collapse",
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
        Tool calls should feel like quiet status updates, not system logs. The
        user glances at them during execution and digs in only when something
        looks wrong.
      </p>
    </section>
  )
}
