"use client"

import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Message01Icon,
  Robot01Icon,
  Search01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const DIRECT_MESSAGES = [
  {
    from: "Requirements Mapper",
    to: "Document Drafter",
    content:
      "I found that Export workflow references CSV-only export in the project brief, but the launch policy Launch Policy v2 requires CSV and JSON exports. Can you update section 6.1.3?",
  },
  {
    from: "Document Drafter",
    to: "Requirements Mapper",
    content:
      "Confirmed. I have updated the export behavior table in implementation notes to reference CSV and JSON export. The rationale now cites the data export policy.",
  },
  {
    from: "Requirements Mapper",
    to: "Document Drafter",
    content:
      "Verified. Export workflow mapping now aligns with the policy requirement. Marking this requirement as fully covered.",
  },
]

const SHARED_CONTEXT_ITEMS = [
  {
    agent: "Source Collector",
    label: "delivery readiness.1 delivery procedures",
    type: "Artifact",
    time: "2m ago",
  },
  {
    agent: "Requirements Mapper",
    label: "Export workflow coverage gap — missing JSON option",
    type: "Finding",
    time: "4m ago",
  },
  {
    agent: "Document Drafter",
    label: "implementation notes section 6.1.3 — updated",
    type: "Draft",
    time: "5m ago",
  },
  {
    agent: "Policy Analyst",
    label: "Launch Policy v1.2 requirement delta report",
    type: "Analysis",
    time: "8m ago",
  },
  {
    agent: "Risk Scanner",
    label: "Incident-2025-3891 disposition — not applicable",
    type: "Assessment",
    time: "12m ago",
  },
]

export function AgentCommunicationSection() {
  const [commCtrl, commAnim, toggleComm] = useExclusiveToggle({
    direct: true,
    shared: false,
  })
  const activeComm = commCtrl.direct ? "direct" : "shared"

  return (
    <section id="agent-communication" className="page-section">
      <p className="section-label mb-3">Collaboration</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Agent Communication
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Inter-agent information exchange via direct messaging or a shared
        context workspace. Both patterns create auditable communication records.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "direct", label: "Direct" },
            { key: "shared", label: "Shared Context" },
          ]}
          active={commCtrl}
          onToggle={toggleComm}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={commAnim}
        >
          {activeComm === "direct" ? (
            <div className="ma-slide-in flex flex-col gap-3">
              <div className="mb-4 flex items-center gap-2">
                <HugeiconsIcon
                  icon={Message01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">
                  Direct thread — Requirements Mapper and Document Drafter
                </span>
              </div>
              {DIRECT_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  className="ma-slide-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className={`flex gap-3 ${msg.from === "Document Drafter" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <HugeiconsIcon
                        icon={Robot01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div
                      className={`flex-1 border-l border-border/50 py-2 pl-3 ${
                        msg.from === "Document Drafter"
                          ? "bg-foreground/[0.02]"
                          : ""
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-xs font-medium">{msg.from}</span>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={10}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                        <span className="text-xs text-muted-foreground">
                          {msg.to}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ma-slide-in flex flex-col gap-3">
              <div className="mb-4 flex items-center gap-2">
                <HugeiconsIcon
                  icon={Share01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">
                  Shared project context — 5 items from 5 agents
                </span>
              </div>
              {SHARED_CONTEXT_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="ma-slide-in flex items-center gap-3 border-b border-border/40 py-3 last:border-b-0"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={Robot01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm">{item.label}</p>
                      <Badge variant="secondary">{item.type}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.agent} · {item.time}
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
