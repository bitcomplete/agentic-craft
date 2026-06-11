"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  EffectivePolicyPreview,
  type EffectivePolicy,
} from "@/components/ui/effective-policy-preview"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
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

const AUTONOMY_LEVELS = [
  {
    level: 2,
    name: "Human-in-Command",
    description:
      "AI drafts outputs and proposes actions; human approves every one before execution.",
    uiPattern: "Approval modal",
    capabilities: [
      "Draft project findings for review",
      "Propose requirement-to-test-case mappings",
      "Suggest source requests to developer",
    ],
    restrictions: [
      "Cannot send emails without approval",
      "Cannot modify project records",
      "Cannot create or close findings",
    ],
  },
  {
    level: 3,
    name: "Human-Delegated",
    description:
      "AI handles routine tasks autonomously; human reviews only flagged exceptions.",
    uiPattern: "Inbox of flagged items",
    capabilities: [
      "Automatically cross-reference requirement coverage",
      "Generate routine status reports",
      "Send pre-approved notification templates",
    ],
    restrictions: [
      "Flags novel findings for human review",
      "Cannot submit source packages to lab",
      "Escalates if confidence drops below 70%",
    ],
  },
  {
    level: 4,
    name: "Human-in-the-Loop",
    description:
      "AI executes freely but escalates when confidence drops below a set threshold.",
    uiPattern: "Confidence slider",
    capabilities: [
      "Execute full review workflows end-to-end",
      "Send emails and create findings autonomously",
      "Update project brief revision history",
    ],
    restrictions: [
      "Escalates on confidence below threshold",
      "Cannot approve final launch summary submission",
      "Human monitors via activity dashboard",
    ],
  },
]

const SETTINGS_TEMPLATES = [
  {
    id: "autonomy-settings",
    title: "Autonomy Settings",
    description:
      "Set the maximum independence level, escalation threshold, and allowed action classes.",
    enabled: true,
  },
  {
    id: "notification-settings",
    title: "Notification Settings",
    description:
      "Choose when background runs, blockers, approvals, and completions notify users.",
    enabled: true,
  },
  {
    id: "approval-policy-settings",
    title: "Approval Policy Settings",
    description:
      "Require confirmation for external communication, spending, publishing, and destructive edits.",
    enabled: true,
  },
  {
    id: "memory-privacy-settings",
    title: "Memory & Privacy Settings",
    description:
      "Control durable memory review, workspace scope, expiry, and removal behavior.",
    enabled: false,
  },
] as const

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SettingsAutonomySection() {
  const [settingsEnabled, setSettingsEnabled] = useState<
    Record<(typeof SETTINGS_TEMPLATES)[number]["id"], boolean>
  >(() =>
    SETTINGS_TEMPLATES.reduce(
      (acc, template) => {
        acc[template.id] = template.enabled
        return acc
      },
      {} as Record<(typeof SETTINGS_TEMPLATES)[number]["id"], boolean>
    )
  )

  const toggleSetting = (id: (typeof SETTINGS_TEMPLATES)[number]["id"]) => {
    setSettingsEnabled((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  const [autoCtrl, autoAnimKey, autoToggle] = useExclusiveToggle({
    level2: true,
    level3: false,
    level4: false,
  })

  const activeLevel = autoCtrl.level2
    ? AUTONOMY_LEVELS[0]
    : autoCtrl.level3
      ? AUTONOMY_LEVELS[1]
      : AUTONOMY_LEVELS[2]

  const effectivePolicies: EffectivePolicy[] = [
    {
      label: "Autonomy",
      value: `Maximum Level ${activeLevel.level}: ${activeLevel.name}`,
      description: settingsEnabled["autonomy-settings"]
        ? "Applies to the current workspace until changed."
        : "Using product defaults because custom autonomy settings are off.",
      status: "review",
    },
    {
      label: "External actions",
      value: settingsEnabled["approval-policy-settings"]
        ? "Approval required before sending, publishing, or modifying shared records."
        : "Allowed by workflow defaults.",
      description:
        "Risky actions should show a locked consequence preview before execution.",
      status: settingsEnabled["approval-policy-settings"]
        ? "required"
        : "allowed",
    },
    {
      label: "Notifications",
      value: settingsEnabled["notification-settings"]
        ? "Notify on blockers, approvals, completions, and budget warnings."
        : "Only critical blockers notify users.",
      status: settingsEnabled["notification-settings"] ? "allowed" : "review",
    },
    {
      label: "Memory",
      value: settingsEnabled["memory-privacy-settings"]
        ? "Memory changes require review, scope, provenance, and expiry."
        : "Durable memory is blocked until review settings are enabled.",
      description: "Memory should not expand scope silently.",
      status: settingsEnabled["memory-privacy-settings"]
        ? "required"
        : "blocked",
    },
  ]

  return (
    <>
      {/* ============================================================ */}
      {/*  Settings Templates                                           */}
      {/* ============================================================ */}
      <section id="settings-templates" className="page-section">
        <p className="section-label mb-3">Configuration</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Settings Templates
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Reusable control groups for product teams that need durable agent
          boundaries across sessions, not one-off prompt instructions.
        </p>

        <FieldGroup className="mt-10 rounded-lg border border-border/40 p-4 sm:p-6">
          <FieldSet>
            <FieldLegend>Reusable Settings Groups</FieldLegend>
            {SETTINGS_TEMPLATES.map((template) => (
              <Field key={template.id} orientation="horizontal">
                <Switch
                  id={template.id}
                  checked={settingsEnabled[template.id]}
                  onCheckedChange={() => toggleSetting(template.id)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={template.id}>
                    {template.title}
                  </FieldLabel>
                  <FieldDescription>{template.description}</FieldDescription>
                </FieldContent>
              </Field>
            ))}
          </FieldSet>
        </FieldGroup>

        <EffectivePolicyPreview className="mt-4" policies={effectivePolicies} />
      </section>

      {/* ============================================================ */}
      {/*  Autonomy Level                                               */}
      {/* ============================================================ */}
      <section id="autonomy-level" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Autonomy Level</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Select how much independence the agent has. Higher levels increase
          speed but reduce oversight. Uses the 6-level autonomy scale from
          foundations.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "level2", label: "Level 2" },
              { key: "level3", label: "Level 3" },
              { key: "level4", label: "Level 4" },
            ]}
            active={autoCtrl}
            onToggle={autoToggle}
          />

          <div
            className="rounded-lg border border-border/40 p-4 sm:p-6"
            key={autoAnimKey}
          >
            <div className="trust-slide-in">
              {/* Stepped indicator */}
              <div className="mb-6 flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div
                      className={`h-2 w-full rounded-md transition-colors duration-200 ${
                        n <= activeLevel.level ? "bg-foreground/20" : "bg-muted"
                      }`}
                    />
                    <span
                      className={`text-[10px] tabular-nums ${
                        n === activeLevel.level
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {n}
                    </span>
                  </div>
                ))}
              </div>

              {/* Level details */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Level {activeLevel.level}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-sm font-medium">
                      {activeLevel.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activeLevel.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Capabilities
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {activeLevel.capabilities.map((cap) => (
                        <div key={cap} className="flex items-start gap-2">
                          <HugeiconsIcon
                            icon={Tick01Icon}
                            size={12}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0 text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            {cap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Restrictions
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {activeLevel.restrictions.map((r) => (
                        <div key={r} className="flex items-start gap-2">
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            size={12}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0 text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            {r}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="pt-2 text-xs text-muted-foreground">
                  Surface: {activeLevel.uiPattern}
                </p>
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
                  Property
                </TableHead>
                <TableHead className="pr-4 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Value
                </TableHead>
                <TableHead className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow className="border-b border-border/50">
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Scale
                </TableCell>
                <TableCell className="py-2.5 pr-4">6 levels (1–6)</TableCell>
                <TableCell className="py-2.5">
                  From Human-Augmented to Human-Out-of-the-Loop
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2.5 pr-4 font-medium text-foreground">
                  Default
                </TableCell>
                <TableCell className="py-2.5 pr-4">Level 2</TableCell>
                <TableCell className="py-2.5">
                  Start conservative, unlock higher levels over time
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Autonomy levels should be progressive — start at Level 2 for new
          workflows and unlock higher levels only after the agent has
          demonstrated reliability. Never default to full autonomy for review
          tasks that affect approval outcomes.
        </div>
      </section>
    </>
  )
}
