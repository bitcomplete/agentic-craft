'use client'

import { useState, useEffect, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  Delete01Icon,
  Search01Icon,
  Cancel01Icon,
  Tick01Icon,
  Brain01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "memory-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes memory-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes memory-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes memory-fade-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-4px); }
    }
    @keyframes memory-press {
      0% { transform: scale(1); }
      40% { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    @keyframes memory-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 300px; opacity: 1; }
    }
    @keyframes memory-ring-fill {
      from { stroke-dashoffset: var(--ring-circ); }
      to { stroke-dashoffset: var(--ring-offset); }
    }
    .memory-slide-in {
      animation: memory-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .memory-fade-in {
      animation: memory-fade-in 0.2s ease forwards;
    }
    .memory-fade-out {
      animation: memory-fade-out 0.2s ease forwards;
    }
    .memory-press {
      animation: memory-press 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .memory-expand {
      animation: memory-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .memory-ring-fill {
      animation: memory-ring-fill 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MEMORY_ENTRIES = [
  { id: "m1", key: "Preferred rollout style", value: "Staged rollout with rollback ready" },
  { id: "m2", key: "Default repo", value: "web-app" },
  { id: "m3", key: "Active design file", value: "Checkout redesign — Figma" },
  { id: "m4", key: "Report format", value: "Markdown with blockers, risks, and next actions" },
  { id: "m5", key: "Default review depth", value: "Product + UI + implementation" },
  { id: "m6", key: "Handoff audience", value: "product-team@acme.dev" },
]

const PRIVACY_CATEGORIES = [
  { key: "preferences", label: "Preferences", desc: "Review depth, output format, workflow choices" },
  { key: "docHistory", label: "Project History", desc: "Previously reviewed PRs, specs, designs, and launch notes" },
  { key: "evalContext", label: "Work Context", desc: "Active repo, release, feature area, and design surface" },
  { key: "personalInfo", label: "Personal Info", desc: "Name, timezone, role, and communication preferences" },
]

/* ------------------------------------------------------------------ */
/*  Controls component                                                 */
/* ------------------------------------------------------------------ */

function Controls({
  options,
  active,
  onToggle,
}: {
  options: { key: string; label: string }[]
  active: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-5">
      <span className="section-label mr-1">Controls</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className={`
            relative text-xs px-2.5 py-1 rounded-md border transition-all duration-200
            ${active[opt.key]
              ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
        >
          {opt.label}
          {active[opt.key] && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
          )}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function MemoryContent() {
  useEffect(ensureStyles, [])

  /* ── Section 1: Memory Panel ── */
  const [panelState, setPanelState] = useState<Record<string, boolean>>({
    empty: false,
    populated: true,
    search: false,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)

  const handlePanelToggle = useCallback((key: string) => {
    setPanelState(() => {
      const next: Record<string, boolean> = { empty: false, populated: false, search: false }
      next[key] = true
      return next
    })
    setSearchQuery("")
    setHoveredEntry(null)
  }, [])

  const filteredEntries = panelState.search && searchQuery
    ? MEMORY_ENTRIES.filter(
        (e) =>
          e.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MEMORY_ENTRIES

  /* ── Section 2: Memory Entry CRUD ── */
  const [crudState, setCrudState] = useState<Record<string, boolean>>({
    view: true,
    edit: false,
    delete: false,
  })
  const [editValue, setEditValue] = useState("Staged rollout with rollback ready")
  const [crudAnimKey, setCrudAnimKey] = useState(0)

  const handleCrudToggle = useCallback((key: string) => {
    setCrudState(() => {
      const next: Record<string, boolean> = { view: false, edit: false, delete: false }
      next[key] = true
      return next
    })
    setEditValue("Staged rollout with rollback ready")
    setCrudAnimKey((k) => k + 1)
  }, [])

  /* ── Section 3: Auto-Memory ── */
  const [autoState, setAutoState] = useState<Record<string, boolean>>({
    detected: true,
    saved: false,
    dismissed: false,
  })
  const [autoAnimKey, setAutoAnimKey] = useState(0)

  const handleAutoToggle = useCallback((key: string) => {
    setAutoState(() => {
      const next: Record<string, boolean> = { detected: false, saved: false, dismissed: false }
      next[key] = true
      return next
    })
    setAutoAnimKey((k) => k + 1)
  }, [])

  /* ── Section 4: Memory Context Ring ── */
  const [ringState, setRingState] = useState<Record<string, boolean>>({
    noContext: true,
    withContext: false,
  })
  const [ringHovered, setRingHovered] = useState(false)
  const [ringAnimKey, setRingAnimKey] = useState(0)

  const handleRingToggle = useCallback((key: string) => {
    setRingState(() => {
      const next: Record<string, boolean> = { noContext: false, withContext: false }
      next[key] = true
      return next
    })
    setRingHovered(false)
    setRingAnimKey((k) => k + 1)
  }, [])

  /* ── Section 5: Privacy Controls ── */
  const [privacyState, setPrivacyState] = useState<Record<string, boolean>>({
    allOn: true,
    selective: false,
    allOff: false,
  })
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    preferences: true,
    docHistory: true,
    evalContext: true,
    personalInfo: true,
  })
  const [showOffConfirm, setShowOffConfirm] = useState(false)

  const handlePrivacyToggle = useCallback((key: string) => {
    setPrivacyState(() => {
      const next: Record<string, boolean> = { allOn: false, selective: false, allOff: false }
      next[key] = true
      return next
    })
    setShowOffConfirm(false)
    if (key === "allOn") {
      setToggles({ preferences: true, docHistory: true, evalContext: true, personalInfo: true })
    } else if (key === "selective") {
      setToggles({ preferences: true, docHistory: true, evalContext: false, personalInfo: false })
    } else if (key === "allOff") {
      setToggles({ preferences: false, docHistory: false, evalContext: false, personalInfo: false })
      setShowOffConfirm(true)
    }
  }, [])

  const handleToggleSwitch = useCallback((catKey: string) => {
    setToggles((prev) => ({ ...prev, [catKey]: !prev[catKey] }))
  }, [])

  // Ring constants
  const RING_R = 34
  const RING_CIRC = 2 * Math.PI * RING_R

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Knowledge &amp; Context</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Memory
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for persistent memory, cross-session recall, context
          awareness, auto-detection of preferences, and privacy controls
          for evaluator data.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Memory Panel                                     */}
      {/* ============================================================ */}
      <section id="memory-panel" className="page-section">
        <p className="section-label mb-3">Persistence</p>
        <h2 className="text-xl font-semibold tracking-tight">Memory Panel</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          The evaluator&apos;s stored preferences and facts — key-value pairs
          the agent uses to personalize responses across sessions.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "empty", label: "Empty" },
              { key: "populated", label: "Populated" },
              { key: "search", label: "Search" },
            ]}
            active={panelState}
            onToggle={handlePanelToggle}
          />

          <div className="border border-border/40 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Brain01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                <span className="text-sm font-medium">Memories</span>
                {!panelState.empty && (
                  <span className="rounded-md bg-foreground/[0.04] px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {panelState.search && searchQuery ? filteredEntries.length : MEMORY_ENTRIES.length}
                  </span>
                )}
              </div>
            </div>

            {/* Search input — shown only in search mode */}
            {panelState.search && (
              <div className="mb-4 memory-slide-in">
                <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5">
                  <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {panelState.empty && (
              <div className="flex flex-col items-center justify-center py-10 text-center memory-fade-in">
                <HugeiconsIcon icon={Brain01Icon} size={32} strokeWidth={1} className="mb-3 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground/70">
                  No memories yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground/50">
                  As you work with the agent, it will learn your review
                  preferences, frequently referenced project artifacts,
                  and workflow habits.
                </p>
              </div>
            )}

            {/* Populated / Search entries */}
            {!panelState.empty && (
              <div className="space-y-1">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-foreground/[0.02]"
                    onMouseEnter={() => setHoveredEntry(entry.id)}
                    onMouseLeave={() => setHoveredEntry(null)}
                  >
                    <div className="min-w-0">
                      <span className="text-xs text-muted-foreground/60">{entry.key}</span>
                      <p className="text-sm text-foreground/85 truncate">{entry.value}</p>
                    </div>
                    {/* Actions — visible on hover */}
                    <div className={`flex shrink-0 items-center gap-0.5 transition-opacity ${
                      hoveredEntry === entry.id ? "opacity-100" : "opacity-0"
                    }`}>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
                      >
                        <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
                {panelState.search && searchQuery && filteredEntries.length === 0 && (
                  <div className="py-6 text-center memory-fade-in">
                    <p className="text-sm text-muted-foreground/60">
                      No memories match &ldquo;{searchQuery}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">State</th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Content</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Behavior</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Empty", "Placeholder with guidance text", "Shown when the agent has no stored memories"],
              ["Populated", "Key-value list with hover actions", "Edit and delete icons appear on hover per row"],
              ["Search", "Filtered list with search input", "Real-time filtering by key or value"],
            ].map(([state, content, behavior], i) => (
              <tr key={state} className={i < 2 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{state}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{content}</td>
                <td className="py-2.5 text-muted-foreground">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Memory entries are key-value pairs rather than free text — this makes
          them scannable and editable without requiring the evaluator to parse
          unstructured prose. Actions appear only on hover to keep the list clean.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Memory Entry CRUD                                */}
      {/* ============================================================ */}
      <section id="memory-crud" className="page-section">
        <p className="section-label mb-3">Management</p>
        <h2 className="text-xl font-semibold tracking-tight">Memory Entry CRUD</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          View, edit, and delete individual memory entries. Each operation
          uses inline controls so the evaluator stays in context.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "view", label: "View" },
              { key: "edit", label: "Edit" },
              { key: "delete", label: "Delete" },
            ]}
            active={crudState}
            onToggle={handleCrudToggle}
          />

          <div className="border border-border/40 rounded-lg p-6" key={crudAnimKey}>
            <div className="rounded-md border border-border/40 px-4 py-3 memory-slide-in">
              {/* View mode */}
              {crudState.view && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground/60">Preferred rollout style</span>
                    <p className="text-sm text-foreground/85">Staged rollout with rollback ready</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleCrudToggle("edit")}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCrudToggle("delete")}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              )}

              {/* Edit mode */}
              {crudState.edit && (
                <div className="space-y-3">
                  <span className="text-xs text-muted-foreground/60">Preferred rollout style</span>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-foreground/20"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCrudToggle("view")}
                      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
                    >
                      <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={1.5} />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCrudToggle("view")}
                      className="rounded-md border border-transparent px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Delete mode */}
              {crudState.delete && (
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground/60">Preferred rollout style</span>
                    <p className="text-sm text-foreground/85">Staged rollout with rollback ready</p>
                  </div>
                  <div className="rounded-md border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <HugeiconsIcon icon={Alert01Icon} size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground/80">Delete this memory?</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          This cannot be undone. The agent will no longer use this
                          preference in future responses.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCrudToggle("view")}
                      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-foreground/[0.04]"
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={12} strokeWidth={1.5} />
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCrudToggle("view")}
                      className="rounded-md border border-transparent px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Operation</th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Interaction</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Behavior</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["View", "Default display", "Shows key-value pair with edit and delete icons"],
              ["Edit", "Click edit icon", "Inline text field replaces value, Save/Cancel buttons appear"],
              ["Delete", "Click delete icon", "Confirmation prompt with warning text and Confirm/Cancel"],
            ].map(([op, interaction, behavior], i) => (
              <tr key={op} className={i < 2 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{op}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{interaction}</td>
                <td className="py-2.5 text-muted-foreground">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          All CRUD operations happen inline — no modals. The delete confirmation
          is intentionally low-drama: a text warning, not a blocking dialog.
          This matches the lightweight feel of key-value memory management.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Auto-Memory                                      */}
      {/* ============================================================ */}
      <section id="auto-memory" className="page-section">
        <p className="section-label mb-3">Detection</p>
        <h2 className="text-xl font-semibold tracking-tight">Auto-Memory</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          The agent detects learnable information from conversation and
          offers to save it as a memory — the evaluator always has the
          final say.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "detected", label: "Detected" },
              { key: "saved", label: "Saved" },
              { key: "dismissed", label: "Dismissed" },
            ]}
            active={autoState}
            onToggle={handleAutoToggle}
          />

          <div className="border border-border/40 rounded-lg p-6" key={autoAnimKey}>
            {/* Agent message context */}
            <div className="rounded-lg border border-border/40 p-4 mb-3">
              <p
                className="text-base"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "16px",
                  lineHeight: "26px",
                  letterSpacing: "-0.4px",
                  fontVariationSettings: '"opsz" 12',
                  WebkitFontSmoothing: "antialiased",
                  color: "oklch(0.2642 0.013 93.9)",
                }}
              >
                I see you&apos;ve been consistently requesting staged rollouts with
                rollback ready across the last three sessions. The checkout
                launch brief appears to be your default reference.
              </p>
            </div>

            {/* Detected banner */}
            {autoState.detected && (
              <div className="flex items-center justify-between rounded-md border border-foreground/10 bg-foreground/[0.02] px-4 py-3 memory-slide-in">
                <div className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={Brain01Icon} size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    I noticed you prefer <span className="font-medium text-foreground/80">Staged rollout with rollback ready</span> — save this preference?
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={() => handleAutoToggle("saved")}
                    className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-accent"
                  >
                    <HugeiconsIcon icon={Tick01Icon} size={11} strokeWidth={1.5} />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoToggle("dismissed")}
                    className="rounded-md border border-transparent px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Saved confirmation */}
            {autoState.saved && (
              <div className="flex items-center gap-2 rounded-md border border-foreground/10 bg-foreground/[0.02] px-4 py-3 memory-fade-in">
                <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Preference saved</p>
              </div>
            )}

            {/* Dismissed — banner gone, just the message */}
            {autoState.dismissed && (
              <div className="flex items-center gap-2 rounded-md px-4 py-2 memory-fade-in">
                <p className="text-xs text-muted-foreground/50 italic">
                  Suggestion dismissed — the agent will not ask about this preference again.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">State</th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Visual</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Behavior</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Detected", "Banner below agent message with Save/Dismiss", "Agent surfaces the detected preference with a clear opt-in prompt"],
              ["Saved", "Brief confirmation message", "Fades in, replacing the banner. Memory is persisted immediately"],
              ["Dismissed", "Banner removed, muted note", "Agent will not re-prompt for this particular preference"],
            ].map(([state, visual, behavior], i) => (
              <tr key={state} className={i < 2 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{state}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{visual}</td>
                <td className="py-2.5 text-muted-foreground">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Auto-memory is opt-in by design. The agent detects patterns but
          never persists without explicit evaluator consent. This is critical
          for CC environments where auditors may need to justify what data
          the tool retains.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Memory Context Ring                              */}
      {/* ============================================================ */}
      <section id="context-ring" className="page-section">
        <p className="section-label mb-3">Awareness</p>
        <h2 className="text-xl font-semibold tracking-tight">Memory Context Ring</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Visual indicator showing how much memory context is loaded into
          the current session. Details are revealed on hover to avoid
          visual clutter.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "noContext", label: "No Context" },
              { key: "withContext", label: "With Context" },
            ]}
            active={ringState}
            onToggle={handleRingToggle}
          />

          <div className="border border-border/40 rounded-lg p-6" key={ringAnimKey}>
            <div className="flex items-center gap-8">
              {/* Ring */}
              <div
                className="group relative shrink-0"
                onMouseEnter={() => setRingHovered(true)}
                onMouseLeave={() => setRingHovered(false)}
              >
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={RING_R}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-muted/40"
                  />
                  {ringState.withContext && (
                    <circle
                      cx="40"
                      cy="40"
                      r={RING_R}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRC}
                      strokeDashoffset={RING_CIRC * 0.35}
                      className="text-foreground/50 memory-ring-fill"
                      style={{
                        "--ring-circ": RING_CIRC,
                        "--ring-offset": RING_CIRC * 0.35,
                      } as React.CSSProperties}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Brain01Icon}
                    size={18}
                    strokeWidth={1.5}
                    className={ringState.withContext ? "text-foreground/60" : "text-muted-foreground/30"}
                  />
                </div>

                {/* Hover tooltip */}
                {ringState.withContext && ringHovered && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-10 w-56 rounded-md border border-border bg-popover px-3 py-2.5 shadow-md memory-fade-in">
                    <p className="text-xs font-medium text-foreground/80 mb-2">Loaded memories</p>
                    <div className="space-y-1.5">
                      {MEMORY_ENTRIES.slice(0, 4).map((e) => (
                        <div key={e.id} className="flex items-baseline gap-2">
                          <span className="text-[10px] text-muted-foreground/50 shrink-0">{e.key}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{e.value}</span>
                        </div>
                      ))}
                      <p className="text-[10px] text-muted-foreground/40">
                        +{MEMORY_ENTRIES.length - 4} more
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Label */}
              <div>
                <p className="text-sm font-medium">
                  {ringState.withContext ? "Memory active" : "No memory loaded"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {ringState.withContext
                    ? `${MEMORY_ENTRIES.length} entries loaded into this session — hover the ring for details.`
                    : "Start a conversation to load evaluator preferences and context."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">State</th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Ring Visual</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Tooltip</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["No Context", "Empty ring with muted icon", "No tooltip — nothing to show"],
              ["With Context", "Partially filled ring, animated on load", "Lists loaded memories with key-value pairs on hover"],
            ].map(([state, ring, tooltip], i) => (
              <tr key={state} className={i < 1 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{state}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{ring}</td>
                <td className="py-2.5 text-muted-foreground">{tooltip}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          No number inside the ring — the icon signals presence, and the
          tooltip provides detail on demand. This avoids cognitive load
          for people who don&apos;t need to know the exact count at
          a glance.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Privacy Controls                                 */}
      {/* ============================================================ */}
      <section id="privacy-controls" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Privacy Controls</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Category-level toggles for what the agent is allowed to remember.
          Teams working with sensitive launches, internal designs, or customer
          data may need to disable specific categories.
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

          <div className="border border-border/40 rounded-lg p-6">
            <div className="space-y-1">
              {PRIVACY_CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="flex items-center justify-between rounded-md px-3 py-3 transition-colors hover:bg-foreground/[0.02]"
                >
                  <div>
                    <p className="text-sm">{cat.label}</p>
                    <p className="text-xs text-muted-foreground/60">{cat.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSwitch(cat.key)}
                    className={`relative h-5 w-9 rounded-md transition-colors ${
                      toggles[cat.key]
                        ? "bg-foreground/80"
                        : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-md bg-background shadow-sm transition-transform ${
                        toggles[cat.key]
                          ? "translate-x-4"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* All-off confirmation */}
            {showOffConfirm && (
              <div className="mt-4 rounded-md border border-foreground/10 bg-foreground/[0.02] px-4 py-3 memory-slide-in">
                <div className="flex items-start gap-2.5">
                  <HugeiconsIcon icon={Alert01Icon} size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground/80">
                      All memory categories are disabled
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      The agent will not retain any information between sessions.
                      Existing memories remain but will not be used or updated.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Preset</th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Toggle State</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["All On", "All categories enabled", "Default for most product teams"],
              ["Selective", "Preferences + Documents on, Context + Personal off", "Common when working across multiple repos or clients"],
              ["All Off", "All categories disabled with confirmation", "For sensitive launches or audit-mode sessions"],
            ].map(([preset, state, notes], i) => (
              <tr key={preset} className={i < 2 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{preset}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{state}</td>
                <td className="py-2.5 text-muted-foreground">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Privacy controls are category-level, not per-entry — this keeps the
          mental model simple. Disabling a category does not delete existing
          memories, it just prevents the agent from reading or updating them.
          This distinction matters for CC evaluations where data retention
          policies may differ from data access policies.
        </div>
      </section>
    </article>
  )
}
