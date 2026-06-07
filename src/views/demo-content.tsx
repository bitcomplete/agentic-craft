"use client"

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GitBranchIcon,
  CodeIcon,
  Cancel01Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  File01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons"
import { EmbeddedComposerDemo } from "../components/InteractiveComposer"
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

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const OBSERVABLE_WORK_TEXT =
  "Reading the project brief, roadmap, customer notes, and launch checklist. Checking for missing decisions, timeline risks, and assumptions that still need an owner..."

const PARALLEL_TASKS = [
  { label: "Checking roadmap alignment", duration: "2.1s" },
  { label: "Reviewing customer feedback themes", duration: "1.8s" },
  { label: "Validating launch checklist coverage", duration: "3.4s" },
]

const TASK_DETAILS: Record<number, string> = {
  0: "Compared 18 roadmap commitments against the project brief. Found 2 items without owners.",
  1: "Grouped 64 customer notes into five themes. Onboarding confusion appears in three separate sources.",
  2: "Checked launch readiness items against the draft timeline. Support handoff is not scheduled.",
}

const FINDINGS = [
  { id: "Owner gap", text: "Two launch tasks do not have a named owner" },
  {
    id: "Timeline risk",
    text: "Support handoff starts after the public release date",
  },
  {
    id: "Open assumption",
    text: "Enterprise onboarding scope is still unresolved",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DemoContent() {
  /* Observable work disclosure state */
  const [workState, setWorkState] = useState<
    "collapsed" | "expanded" | "completed"
  >("collapsed")

  /* Streaming cursor */
  const [showCursor, setShowCursor] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShowCursor(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  /* Tool call expansion */
  const [toolTreeOpen, setToolTreeOpen] = useState(true)

  /* Approval gate */
  const [approvalState, setApprovalState] = useState<
    "pending" | "approved" | "denied"
  >("pending")

  /* Feedback */
  const [feedback, setFeedback] = useState<"none" | "up" | "down">("none")

  /* Context ring hover */

  return (
    <article>
      <header className="mb-16">
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Agentic Craft
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A reference guide for designing agentic product interfaces. Every
          pattern below is interactive — click, expand, approve.
        </p>
      </header>

      <div className="mx-auto max-w-[720px] flex flex-col gap-6">
        {/* -------------------------------------------------------- */}
        {/*  Message 1: User message                                  */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground">
            Can you review the latest project brief and check it against the
            roadmap, customer notes, and launch checklist?
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 2: Observable work disclosure                     */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="max-w-[85%]">
            <button
              type="button"
              aria-label="Toggle observable work details"
              onClick={() => {
                setWorkState((prev) =>
                  prev === "collapsed" ? "expanded" : "completed"
                )
              }}
              className="w-full cursor-pointer px-1 py-2 text-left"
            >
              {workState === "collapsed" && (
                <span className="demo-shimmer-text text-sm">
                  Reviewing sources
                </span>
              )}

              {workState === "expanded" && (
                <div className="demo-slide-in">
                  <p
                    className="text-sm text-muted-foreground italic"
                    style={{ lineHeight: "22px" }}
                  >
                    {OBSERVABLE_WORK_TEXT}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    Click to collapse
                  </p>
                </div>
              )}

              {workState === "completed" && (
                <span className="text-xs text-muted-foreground/60">
                  Source review completed in 3.2s
                </span>
              )}
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 3: Agent response with citations                 */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div
            className="max-w-[85%] font-serif text-base"
            style={{
              lineHeight: "26px",
              letterSpacing: "-0.4px",
              fontVariationSettings: '"opsz" 12',
            }}
          >
            <p className="text-foreground">
              I've completed the initial review. The brief covers the main
              launch goals
              <sup className="ml-0.5 font-sans text-xs font-medium text-primary">
                1
              </sup>
              , but I found three areas that need attention before the release
              planning meeting
              <sup className="ml-0.5 font-sans text-xs font-medium text-primary">
                2
              </sup>
              .
            </p>
            {showCursor && (
              <span className="ml-0.5 inline-block h-4 w-0.5 bg-foreground/70 align-middle" />
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 4: Tool call — parallel execution tree           */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="w-full max-w-[85%]">
            <ToolTree open={toolTreeOpen} onOpenChange={setToolTreeOpen}>
              <ToolTreeTrigger icon={GitBranchIcon} timestamp="10:44 AM · 1s">
                Running 3 tasks in parallel
              </ToolTreeTrigger>
              <ToolTreeContent>
                {PARALLEL_TASKS.map((task, i) => (
                  <ToolCall
                    key={task.label}
                    icon={CodeIcon}
                    status="completed"
                    timestamp={task.duration}
                  >
                    <ToolCallTrigger>
                      <ToolCallLabel>{task.label}</ToolCallLabel>
                    </ToolCallTrigger>
                    <ToolCallContent>
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ lineHeight: "18px" }}
                      >
                        {TASK_DETAILS[i]}
                      </p>
                    </ToolCallContent>
                  </ToolCall>
                ))}
              </ToolTreeContent>
            </ToolTree>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 5: Agent response with findings                  */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div
            className="max-w-[85%] font-serif text-base text-foreground"
            style={{
              lineHeight: "26px",
              letterSpacing: "-0.4px",
              fontVariationSettings: '"opsz" 12',
            }}
          >
            <p>Based on the analysis, here are the findings:</p>
            <ul className="mt-3 flex flex-col gap-2">
              {FINDINGS.map((f) => (
                <li
                  key={f.id}
                  className="flex items-start gap-2 text-sm"
                  style={{ lineHeight: "22px" }}
                >
                  <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                  <span>
                    <span className="font-sans text-sm font-medium text-foreground">
                      {f.id}
                    </span>
                    <span className="text-muted-foreground"> — {f.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 6: Approval gate                                 */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="w-full max-w-[85%]">
            <div
              className="font-serif text-base text-foreground"
              style={{
                lineHeight: "26px",
                letterSpacing: "-0.4px",
                fontVariationSettings: '"opsz" 12',
              }}
            >
              <p>
                I'd like to generate a findings summary and send it to the
                project team.
              </p>
            </div>

            <div className="mt-3 rounded-lg border border-border/40 p-4">
              {approvalState === "pending" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HugeiconsIcon
                      icon={File01Icon}
                      size={14}
                      strokeWidth={1.5}
                    />
                    <span>
                      Generate findings summary and email to
                      project-team@example.com
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Approve findings summary"
                      onClick={() => setApprovalState("approved")}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      aria-label="Deny findings summary"
                      onClick={() => setApprovalState("denied")}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                    >
                      Deny
                    </button>
                  </div>
                </>
              )}

              {approvalState === "approved" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HugeiconsIcon
                      icon={SentIcon}
                      size={14}
                      strokeWidth={1.5}
                    />
                    <span>Summary sent to project-team@example.com</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Reset approved action"
                    onClick={() => setApprovalState("pending")}
                    className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                  >
                    Reset
                  </button>
                </div>
              )}

              {approvalState === "denied" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={14}
                      strokeWidth={1.5}
                    />
                    <span>Action cancelled</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Reset denied action"
                    onClick={() => setApprovalState("pending")}
                    className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 7: Feedback                                      */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground/60">
              Was this helpful?
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setFeedback((prev) => (prev === "up" ? "none" : "up"))
                }
                aria-label="Mark response as helpful"
                aria-pressed={feedback === "up"}
                className={`rounded-md p-1.5 transition-colors ${
                  feedback === "up"
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                <HugeiconsIcon
                  icon={ThumbsUpIcon}
                  size={14}
                  strokeWidth={1.5}
                />
              </button>
              <button
                type="button"
                onClick={() =>
                  setFeedback((prev) => (prev === "down" ? "none" : "down"))
                }
                aria-label="Mark response as not helpful"
                aria-pressed={feedback === "down"}
                className={`rounded-md p-1.5 transition-colors ${
                  feedback === "down"
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                <HugeiconsIcon
                  icon={ThumbsDownIcon}
                  size={14}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Composer                                                  */}
        {/* -------------------------------------------------------- */}
        <div className="mt-8">
          <EmbeddedComposerDemo />
        </div>
      </div>
    </article>
  )
}
