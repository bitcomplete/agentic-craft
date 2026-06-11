"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  GitBranchIcon,
  TextIcon,
  CodeIcon,
} from "@hugeicons/core-free-icons"
import {
  ToolTree,
  ToolTreeTrigger,
  ToolTreeContent,
} from "@/components/ui/tool-tree"
import {
  ToolCall,
  ToolCallTrigger,
  ToolCallLabel,
  ToolCallContent,
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

const PARALLEL_TASKS = [
  {
    label: "Checking current git status in the project",
    timestamp: "10:44 AM · 0.8s",
    details: [
      { key: "Working dir", value: "/workspace/customer-portal" },
      {
        key: "Modified files",
        value: "3 (coverage-matrix.xlsx, requirement-map.json, notes.md)",
      },
      { key: "Untracked", value: "1 (test-results-2026-03.csv)" },
    ],
  },
  {
    label: "Checking remote configuration",
    timestamp: "10:44 AM · 1.4s",
    details: [
      {
        key: "Remote",
        value: "origin → git.internal/product/customer-portal",
      },
      { key: "Branch", value: "main (up to date)" },
      { key: "Last push", value: "2026-03-14 09:41 UTC" },
    ],
  },
  {
    label: "Reading requirement coverage definitions",
    timestamp: "10:44 AM · 2.2s",
    details: [
      { key: "File", value: "requirement-map.json" },
      { key: "Requirements parsed", value: "23 requirements" },
      { key: "Classes", value: "Access, Export, Audit, Auth, Retention" },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Section export                                                     */
/* ------------------------------------------------------------------ */

export function ParallelSection() {
  const [parallelState, setParallelState] = useState({
    sequential: false,
    parallel: true,
  })
  const [treeOpen, setTreeOpen] = useState(true)
  const [childExpanded, setChildExpanded] = useState<Record<number, boolean>>(
    {}
  )
  const [parallelAnim, setParallelAnim] = useState(0)

  const toggleParallelControl = useCallback((key: string) => {
    setParallelState(() => {
      if (key === "sequential") return { sequential: true, parallel: false }
      return { sequential: false, parallel: true }
    })
    setTreeOpen(true)
    setChildExpanded({})
    setParallelAnim((p) => p + 1)
  }, [])

  const toggleChildExpand = useCallback((idx: number) => {
    setChildExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }, [])

  return (
    <section id="parallel" className="page-section">
      <p className="section-label mb-3">Concurrency</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Parallel Execution
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        IDE-style tree connectors for operations running concurrently. The
        parent row collapses the branch; each child expands to show tool call
        details inline.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "sequential", label: "Sequential" },
            { key: "parallel", label: "Parallel" },
          ]}
          active={parallelState}
          onToggle={toggleParallelControl}
        />

        <div
          key={parallelAnim}
          className="rounded-lg border border-border/40 p-4 sm:p-6"
        >
          {parallelState.parallel ? (
            <div className="actions-slide-in">
              <ToolTree open={treeOpen} onOpenChange={setTreeOpen}>
                <ToolTreeTrigger
                  icon={GitBranchIcon}
                  timestamp="10:44 AM · 2.6s"
                >
                  Running tasks in parallel
                </ToolTreeTrigger>
                <ToolTreeContent>
                  {PARALLEL_TASKS.map((task) => (
                    <ToolCall
                      key={task.label}
                      icon={TextIcon}
                      status="completed"
                      timestamp={task.timestamp}
                    >
                      <ToolCallTrigger>
                        <ToolCallLabel>{task.label}</ToolCallLabel>
                      </ToolCallTrigger>
                      <ToolCallContent>
                        <div className="flex flex-col gap-1 text-xs">
                          {task.details.map((d) => (
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
                </ToolTreeContent>
              </ToolTree>
            </div>
          ) : (
            /* Sequential mode — flat list */
            <div className="actions-slide-in">
              <div className="mb-3 flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-muted-foreground"
                />
                <span className="text-sm text-muted-foreground">
                  Running {PARALLEL_TASKS.length} tasks sequentially
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {PARALLEL_TASKS.map((task, i) => (
                  <div key={task.label}>
                    <button
                      type="button"
                      aria-label={`Toggle task details: ${task.label}`}
                      onClick={() => toggleChildExpand(i)}
                      className="flex w-full items-center gap-2.5 border-l border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <HugeiconsIcon
                        icon={CodeIcon}
                        size={13}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-sm font-normal text-muted-foreground">
                        {task.label}
                      </span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={11}
                        strokeWidth={1.5}
                        className={`ml-auto shrink-0 text-muted-foreground/70 transition-transform duration-200 ${
                          childExpanded[i] ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {childExpanded[i] && (
                      <div className="actions-expand mt-1 mb-1 ml-[21px]">
                        <div className="flex flex-col gap-1 border-l border-border/60 py-2 pl-3">
                          {task.details.map((d) => (
                            <div key={d.key} className="flex gap-2 text-xs">
                              <span className="text-muted-foreground">
                                {d.key}:
                              </span>
                              <span className="text-foreground">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Element
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Spec
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "Sequential fallback",
              "Flat list of bordered rows, no tree connectors",
            ],
          ].map(([el, spec], i, arr) => (
            <TableRow
              key={el}
              className={i < arr.length - 1 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-3 pr-6 font-medium">{el}</TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {spec}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
