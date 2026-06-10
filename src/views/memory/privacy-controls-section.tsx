"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldSet,
  FieldTitle,
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

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PRIVACY_CATEGORIES = [
  {
    key: "preferences",
    label: "Preferences",
    desc: "release tier, report format, workflow choices",
  },
  {
    key: "docHistory",
    label: "Document History",
    desc: "Previously reviewed briefs, policies, and launch summaries",
  },
  {
    key: "projectContext",
    label: "Project Context",
    desc: "Current product, team, and approval path",
  },
  {
    key: "personalInfo",
    label: "Personal Info",
    desc: "Name, timezone, role at review team",
  },
]

export function PrivacyControlsSection() {
  const [privacyState, setPrivacyState] = useState<Record<string, boolean>>({
    allOn: true,
    selective: false,
    allOff: false,
  })
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    preferences: true,
    docHistory: true,
    projectContext: true,
    personalInfo: true,
  })
  const [showOffConfirm, setShowOffConfirm] = useState(false)

  const handlePrivacyToggle = useCallback((key: string) => {
    setPrivacyState(() => {
      const next: Record<string, boolean> = {
        allOn: false,
        selective: false,
        allOff: false,
      }
      next[key] = true
      return next
    })
    setShowOffConfirm(false)
    if (key === "allOn") {
      setToggles({
        preferences: true,
        docHistory: true,
        projectContext: true,
        personalInfo: true,
      })
    } else if (key === "selective") {
      setToggles({
        preferences: true,
        docHistory: true,
        projectContext: false,
        personalInfo: false,
      })
    } else if (key === "allOff") {
      setToggles({
        preferences: false,
        docHistory: false,
        projectContext: false,
        personalInfo: false,
      })
      setShowOffConfirm(true)
    }
  }, [])

  const handleToggleSwitch = useCallback((catKey: string) => {
    setToggles((prev) => ({ ...prev, [catKey]: !prev[catKey] }))
  }, [])

  return (
    <section id="privacy-controls" className="page-section">
      <p className="section-label mb-3">Governance</p>
      <h2 className="text-xl font-semibold tracking-tight">
        Privacy Controls
      </h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Category-level toggles for what the agent is allowed to remember.
        Reviewers working under NDA or handling sensitive product data may
        need to disable specific categories.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "allOn", label: "All On" },
            { key: "selective", label: "Selective" },
            { key: "allOff", label: "All Off" },
          ]}
          active={privacyState}
          onToggle={handlePrivacyToggle}
        />

        <FieldSet className="rounded-lg border border-border/40 p-6">
          <FieldGroup className="gap-1">
            {PRIVACY_CATEGORIES.map((cat) => (
              <Field
                key={cat.key}
                orientation="horizontal"
                className="items-center justify-between rounded-md px-3 py-3 transition-colors hover:bg-foreground/[0.02]"
              >
                <FieldContent>
                  <FieldTitle>{cat.label}</FieldTitle>
                  <FieldDescription className="text-xs">
                    {cat.desc}
                  </FieldDescription>
                </FieldContent>
                <Switch
                  checked={toggles[cat.key]}
                  onCheckedChange={() => handleToggleSwitch(cat.key)}
                  aria-label={`Toggle ${cat.label}`}
                />
              </Field>
            ))}
          </FieldGroup>

          {/* All-off confirmation */}
          {showOffConfirm && (
            <div className="memory-slide-in mt-4 border-l border-foreground/15 bg-foreground/[0.02] py-3 pl-3">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={Alert01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-sm text-foreground/80">
                    All memory categories are disabled
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    The agent will not retain any information between
                    sessions. Existing memories remain but will not be used or
                    updated.
                  </p>
                </div>
              </div>
            </div>
          )}
        </FieldSet>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Preset
            </TableHead>
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Toggle State
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Notes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "All On",
              "All categories enabled",
              "Default for most reviewers",
            ],
            [
              "Selective",
              "Preferences + Documents on, Context + Personal off",
              "Common for consultants working across multiple review teams",
            ],
            [
              "All Off",
              "All categories disabled with confirmation",
              "For sensitive reviews or private review sessions",
            ],
          ].map(([preset, state, notes], i) => (
            <TableRow
              key={preset}
              className={i < 2 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-2.5 pr-6 font-medium">
                {preset}
              </TableCell>
              <TableCell className="py-2.5 pr-6 text-muted-foreground">
                {state}
              </TableCell>
              <TableCell className="py-2.5 text-muted-foreground">
                {notes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Privacy controls are category-level, not per-entry — this keeps the
        mental model simple. Disabling a category does not delete existing
        memories, it just prevents the agent from reading or updating them.
        This distinction matters for complex review workflows where data
        retention policies may differ from data access policies.
      </div>
    </section>
  )
}
