"use client"

import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Robot01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
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

const SESSION_SINGLE = [
  {
    role: "user" as const,
    content:
      "Check if the project brief covers all Export workflow requirements for the ACME Customer Portal.",
  },
  {
    role: "agent" as const,
    content:
      "I reviewed the Project brief v3 against Export workflow and found the export behavior specification references CSV-only export, but the latest Launch Policy v2 expects CSV and JSON exports. This is a gap that should be addressed before the review team session.",
    tool: "Searched document repository",
  },
]

const SESSION_MULTI = [
  {
    role: "user" as const,
    content:
      "Run a gap analysis on the requirement coverage for Launch checklist.",
  },
  {
    role: "agent" as const,
    content:
      "Starting the analysis. I'll cross-reference all 23 requirements from Launch checklist against the current project brief.",
    tool: "Loading requirement catalog",
  },
  {
    role: "user" as const,
    content:
      "Focus on the network workflow requirements — integration and export sections.",
  },
  {
    role: "agent" as const,
    content:
      "Narrowing scope to network-related requirements. I found 2 gaps: Integration policy lacks a rationale for the chosen trusted channel mechanism, and Retention setting references a deprecated key size.",
    tool: "Cross-referencing project brief",
  },
  {
    role: "user" as const,
    content: "Generate a remediation report for those gaps.",
  },
  {
    role: "agent" as const,
    content:
      "Report generated with remediation steps for both gaps, including estimated effort and references to relevant policy sections. Saved as gap-remediation-2026-03.pdf.",
    tool: "Generating coverage report",
  },
]

export function SessionTimelineSection() {
  const [sessionCtrl, sessionAnim, toggleSession] = useExclusiveToggle({
    single: true,
    multi: false,
  })

  const sessionCtrlMap = sessionCtrl as Record<string, boolean>
  const activeSession =
    Object.keys(sessionCtrl).find((k) => sessionCtrlMap[k]) || "single"
  const sessionItems =
    activeSession === "single" ? SESSION_SINGLE : SESSION_MULTI

  return (
    <section id="session-timeline" className="page-section">
      <p className="section-label mb-3">Conversation</p>
      <h2 className="text-xl font-semibold tracking-tight">Session Timeline</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        A vertical timeline showing the sequence of requests, tool calls, and
        agent responses within a review session.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "single", label: "Single Turn" },
            { key: "multi", label: "Multi Turn" },
          ]}
          active={sessionCtrl}
          onToggle={toggleSession}
        />

        <div
          className="rounded-lg border border-border/40 p-6"
          key={sessionAnim}
        >
          <div className="flex flex-col gap-0">
            {sessionItems.map((item, i) => (
              <div
                key={`${activeSession}-${i}`}
                className="mon-slide-in relative"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Connector line */}
                {i < sessionItems.length - 1 && (
                  <div className="absolute top-8 bottom-0 left-3 w-px bg-border" />
                )}

                <div className="flex items-start gap-3 pb-4">
                  {/* Node */}
                  <div
                    className={`mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                      item.role === "user" ? "bg-muted" : "bg-foreground/[0.06]"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        item.role === "user" ? ArrowRight01Icon : Robot01Icon
                      }
                      size={12}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs text-muted-foreground">
                      {item.role === "user" ? "Reviewer" : "Agent"}
                    </p>
                    {item.role === "user" ? (
                      <p className="text-sm">{item.content}</p>
                    ) : (
                      <>
                        {"tool" in item && item.tool && (
                          <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <HugeiconsIcon
                              icon={Search01Icon}
                              size={11}
                              strokeWidth={1.5}
                            />
                            <span>{item.tool}</span>
                          </div>
                        )}
                        <p
                          className="agent-prose text-sm"
                          style={{ color: "var(--foreground)" }}
                        >
                          {item.content}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border text-left">
            <TableHead className="pr-6 pb-3 text-xs font-medium text-muted-foreground">
              Element
            </TableHead>
            <TableHead className="pb-3 text-xs font-medium text-muted-foreground">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Connector
            </TableCell>
            <TableCell className="py-3">
              1px vertical line between nodes, bg-border color
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Node icons
            </TableCell>
            <TableCell className="py-3">
              Arrow for reviewer, robot for agent — rounded-md 24px containers
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Agent prose
            </TableCell>
            <TableCell className="py-3">
              Source Serif 4, 14px/22px, theme-aware foreground color
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 text-muted-foreground">
              Tool annotations
            </TableCell>
            <TableCell className="py-3">
              Shown above agent response as muted text with search icon
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Session timelines provide the conversation-level audit trail that review
        team reviewers need when reviewing how an agent arrived at its
        conclusions. Multi-turn sessions show how iterative refinement (e.g.,
        narrowing scope from all requirements to just the integration and export
        sections) leads to more targeted analysis.
      </div>
    </section>
  )
}
