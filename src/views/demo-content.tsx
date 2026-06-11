"use client"

import { useState, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GitBranchIcon,
  CodeIcon,
  Cancel01Icon,
  File01Icon,
  SentIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
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
import { SourcePreviewCitation } from "@/components/ui/source-preview"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const OBSERVABLE_WORK_TEXT =
  "Reading the project brief, roadmap, customer notes, and launch checklist. Checking for missing decisions, timeline risks, and assumptions that still need an owner…"

const CITATIONS = [
  {
    id: 1,
    title: "Project Brief v3",
    source: "Project-Brief-v3.pdf",
    location: "Page 2",
    excerpt:
      "The launch covers the self-serve and team tiers at release, with the enterprise tier following once the support plan is in place.",
  },
  {
    id: 2,
    title: "Launch Checklist: Support Readiness",
    source: "docs.internal/launch/support-readiness",
    location: "§3 — Support readiness",
    excerpt:
      "The standard support plan requires issue triage procedures, named owners, and response timelines before enterprise release.",
  },
] as const

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
  const [workExpanded, setWorkExpanded] = useState(false)

  /* Tool call expansion */
  const [toolTreeOpen, setToolTreeOpen] = useState(true)

  /* Approval gate */
  const [approvalState, setApprovalState] = useState<
    "pending" | "approved" | "denied"
  >("pending")
  const approvalOutcomeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (approvalState !== "pending") approvalOutcomeRef.current?.focus()
  }, [approvalState])

  /* Context ring hover */

  return (
    <article>
      <header className="mb-12 sm:mb-16">
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Agentic Craft
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A reference guide for designing agentic product interfaces. Every
          pattern below is interactive — click, expand, approve.
        </p>
      </header>

      <div className="mx-auto flex max-w-[720px] flex-col gap-6">
        {/* -------------------------------------------------------- */}
        {/*  Message 1: User message                                  */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
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
              aria-expanded={workExpanded}
              aria-label="Toggle observable work details"
              onClick={() => setWorkExpanded((prev) => !prev)}
              className="flex w-full cursor-pointer items-center gap-1.5 px-1 py-2 text-left"
            >
              <span className="text-xs text-muted-foreground">
                Reviewed 6 sources · 3.2s
              </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={14}
                strokeWidth={1.5}
                className={`shrink-0 text-muted-foreground transition-transform duration-150 ${workExpanded ? "rotate-180" : ""}`}
              />
            </button>
            {workExpanded && (
              <div className="demo-slide-in px-1 pb-2">
                <p
                  className="text-sm text-muted-foreground italic"
                  style={{ lineHeight: "22px" }}
                >
                  {OBSERVABLE_WORK_TEXT}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 3: Agent response with citations                 */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="agent-prose max-w-[85%] font-serif text-base">
            <p className="text-foreground">
              I’ve completed the initial review. The brief covers the main
              launch goals
              <SourcePreviewCitation sources={CITATIONS} sourceIndex={0} />
              , but I found three areas that need attention before the release
              planning meeting
              <SourcePreviewCitation sources={CITATIONS} sourceIndex={1} />.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 4: Tool call — parallel execution tree           */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="w-full max-w-[85%]">
            <ToolTree open={toolTreeOpen} onOpenChange={setToolTreeOpen}>
              <ToolTreeTrigger icon={GitBranchIcon} timestamp="10:44 AM · 3.6s">
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
          <div className="agent-prose max-w-[85%] font-serif text-base text-foreground">
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
            <div className="agent-prose font-serif text-base text-foreground">
              <p>
                I’d like to generate a findings summary and send it to the
                project team.
              </p>
            </div>

            <div className="mt-3 rounded-lg border border-border/40 p-4 sm:p-6">
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
                      project-team@meridian.internal
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      aria-label="Approve findings summary"
                      onClick={() => setApprovalState("approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label="Deny findings summary"
                      onClick={() => setApprovalState("denied")}
                    >
                      Deny
                    </Button>
                  </div>
                </>
              )}

              {approvalState === "approved" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div
                    ref={approvalOutcomeRef}
                    tabIndex={-1}
                    role="status"
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <HugeiconsIcon
                      icon={SentIcon}
                      size={14}
                      strokeWidth={1.5}
                    />
                    <span>Summary sent to project-team@meridian.internal</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Reset approved action"
                    onClick={() => setApprovalState("pending")}
                  >
                    Reset
                  </Button>
                </div>
              )}

              {approvalState === "denied" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div
                    ref={approvalOutcomeRef}
                    tabIndex={-1}
                    role="status"
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={14}
                      strokeWidth={1.5}
                    />
                    <span>Action canceled</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Reset denied action"
                    onClick={() => setApprovalState("pending")}
                  >
                    Reset
                  </Button>
                </div>
              )}
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
