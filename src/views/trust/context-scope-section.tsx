"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon, Target01Icon } from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Separator } from "@/components/ui/separator"
import { useExclusiveToggle } from "@/hooks/use-exclusive-toggle"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SCOPE_CONFIGS = {
  portal: {
    label: "Portal Only",
    scope: "ACME Customer Portal v3.1",
    documents: [
      { name: "Project brief v3", section: "Full document" },
      { name: "QA Notes 2026-003", section: "Product-specific checks" },
    ],
  },
  portalPolicy: {
    label: "Portal + Policy",
    scope: "ACME Customer Portal v3.1 + Launch Policy v2",
    documents: [
      { name: "Project brief v3", section: "Full document" },
      { name: "QA Notes 2026-003", section: "All check results" },
      { name: "Launch Policy v2", section: "Requirement definitions" },
      { name: "Policy Review Report", section: "Alignment claims" },
    ],
  },
  global: {
    label: "Global",
    scope: "All project artifacts",
    documents: [
      { name: "Project brief v3", section: "Full document" },
      { name: "QA Notes 2026-003", section: "All check results" },
      { name: "Launch Policy v2", section: "Full document" },
      {
        name: "Previous launch review (2025-08)",
        section: "Findings and conclusions",
      },
      { name: "Operating playbook", section: "Reviewer actions" },
      { name: "Risk Analysis Report", section: "risk review results" },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ContextScopeSection() {
  const [scopeCtrl, scopeAnimKey, scopeToggle] = useExclusiveToggle({
    portal: true,
    portalPolicy: false,
    global: false,
  })

  const activeScope = scopeCtrl.portal
    ? SCOPE_CONFIGS.portal
    : scopeCtrl.portalPolicy
      ? SCOPE_CONFIGS.portalPolicy
      : SCOPE_CONFIGS.global

  return (
    <section id="context-scope" className="page-section">
      <p className="section-label mb-3">Governance</p>
      <h2 className="text-xl font-semibold tracking-tight">Context Scope</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Define which documents and project artifacts the agent can access.
        Narrower scopes reduce noise; wider scopes enable cross-referencing.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "portal", label: "Portal Only" },
            { key: "portalPolicy", label: "Portal + Policy" },
            { key: "global", label: "Global" },
          ]}
          active={scopeCtrl}
          onToggle={scopeToggle}
        />

        <div
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          key={scopeAnimKey}
        >
          <div className="trust-slide-in">
            <div className="flex flex-col gap-4">
              {/* Scope indicator */}
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                  <HugeiconsIcon
                    icon={Target01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{activeScope.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeScope.scope}
                  </p>
                </div>
              </div>

              {/* Document list */}
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Accessible documents
                </p>
                <div className="divide-y divide-border/40">
                  {activeScope.documents.map((doc, i) => (
                    <div
                      key={doc.name}
                      className="trust-slide-in flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <HugeiconsIcon
                        icon={File01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium">{doc.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          — {doc.section}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope size indicator */}
              <div className="flex flex-col gap-2 pt-2">
                <Separator />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {activeScope.documents.length} document
                    {activeScope.documents.length !== 1 ? "s" : ""} in scope
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    {["portal", "portalPolicy", "global"].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 w-4 rounded-md transition-colors ${
                          s === "portal" ||
                          (s === "portalPolicy" &&
                            (scopeCtrl.portalPolicy || scopeCtrl.global)) ||
                          (s === "global" && scopeCtrl.global)
                            ? "bg-foreground/20"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
