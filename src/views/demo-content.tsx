'use client'

import { useState, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GitBranchIcon,
  CodeIcon,
  Cancel01Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  File01Icon,
  SentIcon,
  Analytics01Icon,
} from "@hugeicons/core-free-icons"
import InteractiveComposer from "../components/InteractiveComposer"
import {
  ToolTree,
  ToolTreeTrigger,
  ToolTreeContent,
} from "@/components/ui/tool-tree"
import {
  ToolCall,
  ToolCallLabel,
  ToolCallContent,
} from "@/components/ui/tool-call"
import {
  ThreadTimeline,
  ThreadTimelineLine,
  ThreadTimelineMessage,
  useThreadTimeline,
} from "@/components/ui/thread-timeline"
import {
  WorkflowSteps,
  WorkflowStep,
} from "@/components/ui/workflow-steps"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "demo-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes demo-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes demo-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes demo-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .demo-slide-in {
      animation: demo-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .demo-fade-in {
      animation: demo-fade-in 0.2s ease forwards;
    }
    .demo-shimmer-text {
      background: linear-gradient(
        90deg,
        var(--color-muted-foreground) 0%,
        var(--color-muted-foreground) 35%,
        oklch(0.75 0.02 260) 50%,
        var(--color-muted-foreground) 65%,
        var(--color-muted-foreground) 100%
      );
      background-size: 200% 100%;
      animation: demo-shimmer 2.5s ease-in-out infinite;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PARALLEL_TASKS = [
  { label: "Comparing deployment diff", duration: "2.1s" },
  { label: "Checking feature flag rollout", duration: "1.8s" },
  { label: "Validating logs and error rate", duration: "3.4s" },
]

const TASK_DETAILS: Record<number, string> = {
  0: "Compared the latest production deploy against the previous stable release. Found 2 changes worth reviewing before wider rollout.",
  1: "Verified rollout targeting and kill-switch coverage. One flag is still enabled for a broader audience than expected.",
  2: "Checked logs, traces, and recent alert volume. No critical failures, but checkout latency is slightly elevated.",
}


/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DemoContent() {
  useEffect(() => { ensureStyles() }, [])

  /* Thinking block state */
  const [thinkingState, setThinkingState] = useState<"collapsed" | "expanded" | "completed">("collapsed")

  /* Streaming cursor */
  const [showCursor, setShowCursor] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShowCursor(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  /* Tool call expansion */
  const [toolTreeOpen, setToolTreeOpen] = useState(true)

  /* Approval gate */
  const [approvalState, setApprovalState] = useState<"pending" | "approved" | "denied">("pending")

  /* Feedback */
  const [feedback, setFeedback] = useState<"none" | "up" | "down">("none")

  /* Context ring hover */

  const chatRef = useRef<HTMLDivElement>(null)
  const agentProse: React.CSSProperties = { lineHeight: "26px", letterSpacing: "-0.4px", fontVariationSettings: '"opsz" 12' }

  return (
    <article className="relative flex flex-col gap-10 h-[calc(100dvh-theme(spacing.12)-theme(spacing.24))]">
      <header className="shrink-0">
        <p className="section-label mb-3">Overview</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Agentic Craft
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          A HAX-informed reference for agentic UX patterns and interaction models.
          The flow below is a composed example showing how conversation,
          tool calls, workflow steps, approvals, navigation, and composer states
          work together in a realistic product scenario.
        </p>
      </header>

      <section id="featured-flow" className="relative flex-1 min-h-0">
        <ThreadTimeline threshold={6} scrollContainerRef={chatRef}>
          {/* Chat scroll area -- blurs when minimap is open */}
          <ChatArea chatRef={chatRef} agentProse={agentProse} thinkingState={thinkingState} setThinkingState={setThinkingState} showCursor={showCursor} toolTreeOpen={toolTreeOpen} setToolTreeOpen={setToolTreeOpen} approvalState={approvalState} setApprovalState={setApprovalState} feedback={feedback} setFeedback={setFeedback} />

          {/* Minimap cards */}
          <ThreadTimelineLine turnId="t1">can you review the latest release before we ship it?</ThreadTimelineLine>
          <ThreadTimelineLine turnId="t2">show me what changed in the latest deployment</ThreadTimelineLine>
          <ThreadTimelineLine turnId="t3">is it safe to roll this back if needed?</ThreadTimelineLine>
          <ThreadTimelineLine turnId="t4">can you send a short handoff summary to the team?</ThreadTimelineLine>
          <ThreadTimelineLine turnId="t5">how should we harden this before launch?</ThreadTimelineLine>
          <ThreadTimelineLine turnId="t6">which regions are impacted by this rollout?</ThreadTimelineLine>
          <ThreadTimelineLine turnId="t7">was this review helpful overall?</ThreadTimelineLine>

          {/* Composer */}
          <div className="mt-2 shrink-0">
            <InteractiveComposer showControls={false} />
          </div>
        </ThreadTimeline>
      </section>
    </article>
  )
}

/* ── Chat area (extracted so it can read ThreadTimeline context for blur) ── */

function ChatArea({
  chatRef,
  agentProse,
  thinkingState,
  setThinkingState,
  showCursor,
  toolTreeOpen,
  setToolTreeOpen,
  approvalState,
  setApprovalState,
  feedback,
  setFeedback,
}: {
  chatRef: React.RefObject<HTMLDivElement | null>
  agentProse: React.CSSProperties
  thinkingState: "collapsed" | "expanded" | "completed"
  setThinkingState: React.Dispatch<React.SetStateAction<"collapsed" | "expanded" | "completed">>
  showCursor: boolean
  toolTreeOpen: boolean
  setToolTreeOpen: React.Dispatch<React.SetStateAction<boolean>>
  approvalState: "pending" | "approved" | "denied"
  setApprovalState: React.Dispatch<React.SetStateAction<"pending" | "approved" | "denied">>
  feedback: "none" | "up" | "down"
  setFeedback: React.Dispatch<React.SetStateAction<"none" | "up" | "down">>
}) {
  const { open } = useThreadTimeline()

  return (
    <div
      ref={chatRef}
      className={`flex-1 min-h-0 overflow-y-auto px-8 pt-8 pb-4 flex flex-col gap-8 transition-[filter,opacity] duration-500 ${open ? "blur-[5px] opacity-30 pointer-events-none" : ""}`}
      style={{ scrollbarWidth: "none" }}
    >
      {/* Turn 1 */}
      <div>
        <ThreadTimelineMessage turnId="t1">can you review the latest release before we ship it?</ThreadTimelineMessage>
        <div className="mt-4 flex justify-start">
          <div className="max-w-[85%] font-serif text-base" style={agentProse}>
            <button type="button" onClick={() => setThinkingState(prev => prev === "collapsed" ? "expanded" : "completed")} className="w-full cursor-pointer px-1 py-2 text-left">
              {thinkingState === "collapsed" && <span className="demo-shimmer-text text-sm">Thinking</span>}
              {thinkingState === "expanded" && (
                <div className="demo-slide-in">
                  <p className="text-sm italic text-muted-foreground" style={{ lineHeight: "22px" }}>Let me pull up the latest deployment diff, release notes, and production metrics before I make a recommendation...</p>
                  <p className="mt-2 text-xs text-muted-foreground/60">Click to collapse</p>
                </div>
              )}
              {thinkingState === "completed" && <span className="text-xs text-muted-foreground/60">Thought for 3.2s</span>}
            </button>
            <p className="text-foreground">
              I've completed the initial review. The release looks healthy overall
              <sup className="ml-0.5 font-sans text-xs font-medium text-primary">1</sup>, but I found three areas that need attention
              <sup className="ml-0.5 font-sans text-xs font-medium text-primary">2</sup>.
            </p>
            {showCursor && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle" />}
          </div>
        </div>
      </div>

      {/* Turn 2 */}
      <div>
        <ThreadTimelineMessage turnId="t2">show me what changed in the latest deployment</ThreadTimelineMessage>
        <div className="mt-4 flex justify-start">
          <div className="w-full max-w-[85%]">
            <ToolTree open={toolTreeOpen} onOpenChange={setToolTreeOpen}>
              <ToolTreeTrigger icon={GitBranchIcon} timestamp="10:44 AM · 1s">Running 3 tasks in parallel</ToolTreeTrigger>
              <ToolTreeContent>
                {PARALLEL_TASKS.map((task, i) => (
                  <ToolCall key={task.label} icon={CodeIcon} status="completed" timestamp={task.duration}>
                    <ToolCallLabel>{task.label}</ToolCallLabel>
                    <ToolCallContent>
                      <p className="text-xs text-muted-foreground" style={{ lineHeight: "18px" }}>{TASK_DETAILS[i]}</p>
                    </ToolCallContent>
                  </ToolCall>
                ))}
              </ToolTreeContent>
            </ToolTree>
          </div>
        </div>
      </div>

      {/* Turn 3 */}
      <div>
        <ThreadTimelineMessage turnId="t3">is it safe to roll this back if needed?</ThreadTimelineMessage>
        <div className="mt-4 flex justify-start">
          <div className="w-full max-w-[85%]">
            <ToolCall icon={Analytics01Icon} status="running" defaultExpanded>
              <ToolCallLabel>Code analysis</ToolCallLabel>
              <ToolCallContent>
                <WorkflowSteps activeIndex={2}>
                  <WorkflowStep details="Scanned 12 files across 3 modules">Looking at the code</WorkflowStep>
                  <WorkflowStep details="Found 2 potential issues in auth middleware">Checking for issues</WorkflowStep>
                  <WorkflowStep>Writing report</WorkflowStep>
                  <WorkflowStep>Done</WorkflowStep>
                </WorkflowSteps>
              </ToolCallContent>
            </ToolCall>
          </div>
        </div>
      </div>

      {/* Turn 4 */}
      <div>
        <ThreadTimelineMessage turnId="t4">can you send a short handoff summary to the team?</ThreadTimelineMessage>
        <div className="mt-4 flex justify-start">
          <div className="w-full max-w-[85%]">
            <div className="font-serif text-base text-foreground" style={agentProse}>
              <p>I'd like to generate a short launch summary and send it to the team.</p>
            </div>
            <div className="mt-3 rounded-lg border border-border/40 p-4">
              {approvalState === "pending" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={File01Icon} size={14} strokeWidth={1.5} />
                    <span>Generate launch summary and email it to product-team@acme.dev</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" onClick={() => setApprovalState("approved")} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">Approve</button>
                    <button type="button" onClick={() => setApprovalState("denied")} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50">Deny</button>
                  </div>
                </>
              )}
              {approvalState === "approved" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><HugeiconsIcon icon={SentIcon} size={14} strokeWidth={1.5} /><span>Report sent</span></div>
                  <button type="button" onClick={() => setApprovalState("pending")} className="text-xs text-muted-foreground/60 hover:text-muted-foreground">Reset</button>
                </div>
              )}
              {approvalState === "denied" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} /><span>Action cancelled</span></div>
                  <button type="button" onClick={() => setApprovalState("pending")} className="text-xs text-muted-foreground/60 hover:text-muted-foreground">Reset</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Turn 5 */}
      <div>
        <ThreadTimelineMessage turnId="t5">how should we harden this before launch?</ThreadTimelineMessage>
        <div className="mt-4 flex justify-start">
          <div className="max-w-[85%] font-serif text-base text-foreground" style={agentProse}>
            <p>Before launch, keep the feature flag scoped to internal users, enable WAF/bot protection on the public routes, and make sure the error alert is paging the right team.</p>
          </div>
        </div>
      </div>

      {/* Turn 6 */}
      <div>
        <ThreadTimelineMessage turnId="t6">which regions are impacted by this rollout?</ThreadTimelineMessage>
        <div className="mt-4 flex justify-start">
          <div className="max-w-[85%] font-serif text-base text-foreground" style={agentProse}>
            <p>This rollout is currently active in us-east-1, fra1, and sin1. Preview traffic is global, but the guarded production path is limited to those primary regions.</p>
          </div>
        </div>
      </div>

      {/* Turn 7 */}
      <div>
        <ThreadTimelineMessage turnId="t7">was this review helpful overall?</ThreadTimelineMessage>
        <div className="mt-4 flex justify-start">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground/60">Was this helpful?</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setFeedback(prev => prev === "up" ? "none" : "up")} className={`rounded-md p-1.5 transition-colors ${feedback === "up" ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}>
                <HugeiconsIcon icon={ThumbsUpIcon} size={14} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => setFeedback(prev => prev === "down" ? "none" : "down")} className={`rounded-md p-1.5 transition-colors ${feedback === "down" ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}>
                <HugeiconsIcon icon={ThumbsDownIcon} size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
