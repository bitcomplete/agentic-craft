"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Robot01Icon,
  Search01Icon,
  Shield01Icon,
  Target01Icon,
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
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MODE_CONFIGS = {
  requirements: {
    label: "Requirements",
    focus:
      "Ensuring all source material meets operating playbook requirements and policy alignment claims.",
    tools: [
      "Source completeness checker",
      "Requirement coverage matrix generator",
      "Policy alignment validator",
      "Lifecycle document scanner",
    ],
  },
  research: {
    label: "Research",
    focus:
      "Investigating technical aspects of the product, analyzing risk reports, and reviewing export implementations.",
    tools: [
      "Risk database search",
      "Export behavior verifier",
      "Technical document analyzer",
      "Platform capability lookup",
    ],
  },
  review: {
    label: "Review",
    focus:
      "Reviewing project deliverables, checking consistency across documents, and preparing for stakeholder reviews.",
    tools: [
      "Cross-document consistency checker",
      "Launch summary section reviewer",
      "Finding classification advisor",
      "Audit preparation checklist",
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ModeTogglesSection() {
  const [modeCtrl, modeAnimKey, modeToggle] = useExclusiveToggle({
    requirements: true,
    research: false,
    review: false,
  })

  const activeMode = modeCtrl.requirements
    ? MODE_CONFIGS.requirements
    : modeCtrl.research
      ? MODE_CONFIGS.research
      : MODE_CONFIGS.review

  return (
    <section id="mode-toggles" className="page-section">
      <p className="section-label mb-3">Governance</p>
      <h2 className="text-xl font-semibold tracking-tight">Mode Toggles</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Switch the agent's operational mode to focus on different aspects of the
        review workflow. Each mode changes available tools and priorities.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "requirements", label: "Requirements" },
            { key: "research", label: "Research" },
            { key: "review", label: "Review" },
          ]}
          active={modeCtrl}
          onToggle={modeToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={modeAnimKey}
        >
          <div className="trust-slide-in">
            <div className="flex flex-col gap-4">
              {/* Mode header */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <HugeiconsIcon
                    icon={
                      modeCtrl.requirements
                        ? Shield01Icon
                        : modeCtrl.research
                          ? Search01Icon
                          : Target01Icon
                    }
                    size={14}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{activeMode.label} mode</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>

              {/* Focus */}
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Focus</p>
                <p className="text-sm text-muted-foreground">
                  {activeMode.focus}
                </p>
              </div>

              {/* Available tools */}
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Available tools
                </p>
                <div className="divide-y divide-border/50">
                  {activeMode.tools.map((tool, i) => (
                    <div
                      key={tool}
                      className="trust-slide-in flex items-center gap-2 py-1.5"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <HugeiconsIcon
                        icon={Robot01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-xs">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spec table */}
      <div className="mt-8">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Mode
              </TableHead>
              <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                Focus
              </TableHead>
              <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                Tools
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-muted-foreground">
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Requirements
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Source material and policy alignment
              </TableCell>
              <TableCell className="py-2.5">
                4 requirements-specific tools
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Research
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Technical investigation
              </TableCell>
              <TableCell className="py-2.5">
                4 research-specific tools
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                Review
              </TableCell>
              <TableCell className="py-2.5 pr-4">
                Deliverable review and audit prep
              </TableCell>
              <TableCell className="py-2.5">4 review-specific tools</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Callout */}
      <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Mode switching should be instant — no confirmation dialog needed since
        it only changes tool availability and focus, not data access. Reviewers
        typically switch modes multiple times during a single review session.
      </div>
    </section>
  )
}
