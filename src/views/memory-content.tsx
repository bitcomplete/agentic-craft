"use client"

import { useState, useCallback } from "react"
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
import { PatternControls as Controls } from "@/components/pattern-controls"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MemoryLedgerItem } from "@/components/ui/memory-ledger-item"
import { SourcePreview } from "@/components/ui/source-preview"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MEMORY_ENTRIES = [
  {
    id: "m1",
    key: "Preferred release tier",
    value: "enterprise release",
    source: "Launch review session",
    page: "Message 18",
    excerpt:
      "Use enterprise release as the default review tier when checking launch readiness and support coverage.",
    lastUsed: "12m ago",
    scope: "Workspace",
    expiry: "90 days",
  },
  {
    id: "m2",
    key: "Default launch policy",
    value: "Launch Policy v2",
    source: "Project brief v3",
    page: "Page 4",
    excerpt:
      "Launch Policy v2 is the governing policy for this review cycle and should be linked from final findings.",
    lastUsed: "31m ago",
    scope: "Project",
    expiry: "180 days",
  },
  {
    id: "m3",
    key: "Review workspace",
    value: "Launch review team",
    source: "Workspace settings",
    page: "Team profile",
    excerpt:
      "Route review summaries and source requests through the Launch review team workspace.",
    lastUsed: "1h ago",
    scope: "Team",
    expiry: "Never",
  },
  {
    id: "m4",
    key: "Report format",
    value: "Markdown with operating playbook work unit headers",
    source: "User preference",
    page: "Message 6",
    excerpt:
      "Please format review output as concise Markdown grouped by operating playbook work units.",
    lastUsed: "Yesterday",
    scope: "User",
    expiry: "90 days",
  },
  {
    id: "m5",
    key: "product type",
    value: "self-serve onboarding flow",
    source: "Product notes",
    page: "Page 2",
    excerpt:
      "The reviewed product is a self-serve onboarding flow with enterprise support dependencies.",
    lastUsed: "Yesterday",
    scope: "Project",
    expiry: "60 days",
  },
  {
    id: "m6",
    key: "Approval team",
    value: "Internal launch process",
    source: "Approval policy",
    page: "Section 3",
    excerpt:
      "Launch approval follows the internal launch process and requires review team sign-off before distribution.",
    lastUsed: "2d ago",
    scope: "Team",
    expiry: "180 days",
  },
]

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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function MemoryContent() {
  /* ── Section 1: Memory Panel ── */
  const [panelState, setPanelState] = useState<Record<string, boolean>>({
    empty: false,
    populated: true,
    search: false,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [activeMemoryId, setActiveMemoryId] = useState(MEMORY_ENTRIES[0].id)

  const handlePanelToggle = useCallback((key: string) => {
    setPanelState(() => {
      const next: Record<string, boolean> = {
        empty: false,
        populated: false,
        search: false,
      }
      next[key] = true
      return next
    })
    setSearchQuery("")
  }, [])

  const filteredEntries =
    panelState.search && searchQuery
      ? MEMORY_ENTRIES.filter(
          (e) =>
            e.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : MEMORY_ENTRIES
  const activeMemory =
    filteredEntries.find((entry) => entry.id === activeMemoryId) ??
    filteredEntries[0] ??
    MEMORY_ENTRIES[0]

  /* ── Section 2: Memory Entry CRUD ── */
  const [crudState, setCrudState] = useState<Record<string, boolean>>({
    view: true,
    edit: false,
    delete: false,
  })
  const [savedValue, setSavedValue] = useState("enterprise release")
  const [editValue, setEditValue] = useState("enterprise release")
  const [crudAnimKey, setCrudAnimKey] = useState(0)

  const handleCrudToggle = (key: string) => {
    setCrudState(() => {
      const next: Record<string, boolean> = {
        view: false,
        edit: false,
        delete: false,
      }
      next[key] = true
      return next
    })
    setEditValue(savedValue)
    setCrudAnimKey((k) => k + 1)
  }

  const handleCrudSave = () => {
    const trimmed = editValue.trim()
    if (trimmed) setSavedValue(trimmed)
    handleCrudToggle("view")
  }

  /* ── Section 3: Auto-Memory ── */
  const [autoState, setAutoState] = useState<Record<string, boolean>>({
    detected: true,
    saved: false,
    dismissed: false,
  })
  const [autoAnimKey, setAutoAnimKey] = useState(0)

  const handleAutoToggle = useCallback((key: string) => {
    setAutoState(() => {
      const next: Record<string, boolean> = {
        detected: false,
        saved: false,
        dismissed: false,
      }
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
  const [ringAnimKey, setRingAnimKey] = useState(0)

  const handleRingToggle = (key: string) => {
    setRingState(() => {
      const next: Record<string, boolean> = {
        noContext: false,
        withContext: false,
      }
      next[key] = true
      return next
    })
    setRingAnimKey((k) => k + 1)
  }

  /* ── Section 5: Privacy Controls ── */
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

  // Ring constants
  const RING_R = 34
  const RING_CIRC = 2 * Math.PI * RING_R

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Memory</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Memory
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for persistent memory, cross-session recall, context
          awareness, auto-detection of preferences, and privacy controls for
          reviewer data.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Memory Panel                                     */}
      {/* ============================================================ */}
      <section id="memory-panel" className="page-section">
        <p className="section-label mb-3">Persistence</p>
        <h2 className="text-xl font-semibold tracking-tight">Memory Panel</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          The reviewer&apos;s stored preferences and facts — key-value pairs the
          agent uses to personalize responses across sessions.
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

          <div className="border-y border-border/40 py-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Brain01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">Memories</span>
                {!panelState.empty && (
                  <Badge variant="secondary">
                    {panelState.search && searchQuery
                      ? filteredEntries.length
                      : MEMORY_ENTRIES.length}
                  </Badge>
                )}
              </div>
            </div>

            {/* Search input — shown only in search mode */}
            {panelState.search && (
              <div className="memory-slide-in mb-4">
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="memory-search"
                    name="memory-search"
                    type="text"
                    aria-label="Search memories"
                    placeholder="Search memories…"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear memory search"
                        size="icon-xs"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
                      </InputGroupButton>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </div>
            )}

            {/* Empty state */}
            {panelState.empty && (
              <div className="memory-fade-in flex flex-col items-center justify-center py-10 text-center">
                <HugeiconsIcon
                  icon={Brain01Icon}
                  size={32}
                  strokeWidth={1}
                  className="mb-3 text-muted-foreground/30"
                />
                <p className="text-sm font-medium text-muted-foreground/70">
                  No memories yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  As you work with the agent, it will learn your review
                  preferences, frequently referenced reference documents, and
                  workflow habits.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handlePanelToggle("populated")}
                >
                  View example memories
                </Button>
              </div>
            )}

            {/* Populated / Search entries */}
            {!panelState.empty && (
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex flex-col gap-2">
                  {filteredEntries.map((entry) => (
                    <MemoryLedgerItem
                      key={entry.id}
                      title={entry.key}
                      value={entry.value}
                      source={entry.source}
                      lastUsed={entry.lastUsed}
                      scope={entry.scope}
                      expiry={entry.expiry}
                      selected={activeMemory.id === entry.id}
                      onInspect={() => setActiveMemoryId(entry.id)}
                      onEdit={() => handleCrudToggle("edit")}
                      onDelete={() => handleCrudToggle("delete")}
                    />
                  ))}
                </div>
                {filteredEntries.length > 0 && (
                  <SourcePreview
                    className="self-start xl:sticky xl:top-4"
                    title={activeMemory.source}
                    excerpt={activeMemory.excerpt}
                    location={activeMemory.page}
                    source={activeMemory.key}
                  />
                )}
                {panelState.search &&
                  searchQuery &&
                  filteredEntries.length === 0 && (
                    <div className="memory-fade-in py-6 text-center xl:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        No memories match &ldquo;{searchQuery}&rdquo;
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                State
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Content
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Empty",
                "Placeholder with guidance text",
                "Shown when the agent has no stored memories",
              ],
              [
                "Populated",
                "Key-value list with hover actions",
                "Edit and delete icons appear on hover per row",
              ],
              [
                "Search",
                "Filtered list with search input",
                "Real-time filtering by key or value",
              ],
            ].map(([state, content, behavior], i) => (
              <TableRow
                key={state}
                className={i < 2 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">
                  {state}
                </TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {content}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {behavior}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Memory entries are key-value pairs rather than free text — this makes
          them scannable and editable without requiring the reviewer to parse
          unstructured prose. Actions appear only on hover to keep the list
          clean.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Memory Entry CRUD                                */}
      {/* ============================================================ */}
      <section id="memory-crud" className="page-section">
        <p className="section-label mb-3">Management</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Memory Entry CRUD
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          View, edit, and delete individual memory entries. Each operation uses
          inline controls so the reviewer stays in context.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={crudAnimKey}
          >
            <div className="memory-slide-in">
              {/* View mode */}
              {crudState.view && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground/60">
                      Preferred release tier
                    </span>
                    <p className="text-sm text-foreground/85">{savedValue}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      onClick={() => handleCrudToggle("edit")}
                      aria-label="Edit memory: Preferred release tier"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Edit01Icon} strokeWidth={1.5} />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleCrudToggle("delete")}
                      aria-label="Delete memory: Preferred release tier"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Delete01Icon} strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Edit mode */}
              {crudState.edit && (
                <FieldGroup className="gap-3">
                  <Field>
                    <FieldLabel
                      htmlFor="memory-edit-value"
                      className="text-xs text-muted-foreground/60"
                    >
                      Preferred release tier
                    </FieldLabel>
                    <Input
                      id="memory-edit-value"
                      name="memory-edit-value"
                      type="text"
                      autoComplete="off"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") handleCrudToggle("view")
                      }}
                    />
                  </Field>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={handleCrudSave}
                      variant="outline"
                      size="xs"
                    >
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleCrudToggle("view")}
                      variant="ghost"
                      size="xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </FieldGroup>
              )}

              {/* Delete mode */}
              {crudState.delete && (
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground/60">
                      Preferred release tier
                    </span>
                    <p className="text-sm text-foreground/85">{savedValue}</p>
                  </div>
                  <div className="border-l border-foreground/15 bg-foreground/[0.02] py-2 pl-3">
                    <div className="flex items-start gap-2">
                      <HugeiconsIcon
                        icon={Alert01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-muted-foreground"
                      />
                      <div>
                        <p className="text-sm text-foreground/80">
                          Delete this memory?
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          This cannot be undone. The agent will no longer use
                          this preference in future responses.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => handleCrudToggle("view")}
                      variant="outline"
                      size="xs"
                    >
                      <HugeiconsIcon
                        icon={Delete01Icon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Confirm delete
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleCrudToggle("view")}
                      variant="ghost"
                      size="xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Operation
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Interaction
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "View",
                "Default display",
                "Shows key-value pair with edit and delete icons",
              ],
              [
                "Edit",
                "Click edit icon",
                "Inline text field replaces value, Save/Cancel buttons appear",
              ],
              [
                "Delete",
                "Click delete icon",
                "Confirmation prompt with warning text and Confirm/Cancel",
              ],
            ].map(([op, interaction, behavior], i) => (
              <TableRow
                key={op}
                className={i < 2 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">{op}</TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {interaction}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {behavior}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
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
          The agent detects learnable information from conversation and offers
          to save it as a memory — the reviewer always has the final say.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={autoAnimKey}
          >
            {/* Agent message context */}
            <div className="mb-3">
              <p
                className="text-base"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "16px",
                  lineHeight: "26px",
                  letterSpacing: "-0.4px",
                  fontVariationSettings: '"opsz" 12',
                  WebkitFontSmoothing: "antialiased",
                  color: "var(--foreground)",
                }}
              >
                I see you&apos;ve been consistently requesting enterprise
                release reviews across the last three sessions. The reference
                document Launch Policy v2 appears to be your default reference.
              </p>
            </div>

            {/* Detected banner */}
            {autoState.detected && (
              <div className="memory-slide-in flex items-center justify-between border-l border-foreground/15 bg-foreground/[0.02] py-3 pl-3">
                <div className="flex items-center gap-2.5">
                  <HugeiconsIcon
                    icon={Brain01Icon}
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">
                    I noticed you prefer{" "}
                    <span className="font-medium text-foreground/80">
                      enterprise release
                    </span>{" "}
                    — save this preference?
                  </p>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => handleAutoToggle("saved")}
                    variant="outline"
                    size="xs"
                  >
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      strokeWidth={1.5}
                      data-icon="inline-start"
                    />
                    Save
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleAutoToggle("dismissed")}
                    variant="ghost"
                    size="xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}

            {/* Saved confirmation */}
            {autoState.saved && (
              <div className="memory-fade-in flex items-center gap-2 border-l border-foreground/15 bg-foreground/[0.02] py-3 pl-3">
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  Preference saved
                </p>
              </div>
            )}

            {/* Dismissed — banner gone, just the message */}
            {autoState.dismissed && (
              <div className="memory-fade-in flex items-center gap-2 rounded-md px-4 py-2">
                <p className="text-xs text-muted-foreground/50 italic">
                  Suggestion dismissed — the agent will not ask about this
                  preference again.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                State
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Visual
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Detected",
                "Banner below agent message with Save/Dismiss",
                "Agent surfaces the detected preference with a clear opt-in prompt",
              ],
              [
                "Saved",
                "Brief confirmation message",
                "Fades in, replacing the banner. Memory is persisted immediately",
              ],
              [
                "Dismissed",
                "Banner removed, muted note",
                "Agent will not re-prompt for this particular preference",
              ],
            ].map(([state, visual, behavior], i) => (
              <TableRow
                key={state}
                className={i < 2 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">
                  {state}
                </TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {visual}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {behavior}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Auto-memory is opt-in by design. The agent detects patterns but never
          persists without explicit reviewer consent. This is critical for
          regulated environments where auditors may need to justify what data
          the tool retains.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Memory Context Ring                              */}
      {/* ============================================================ */}
      <section id="context-ring" className="page-section">
        <p className="section-label mb-3">Awareness</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Memory Context Ring
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Visual indicator showing how much memory context is loaded into the
          current session. Details are revealed on hover to avoid visual
          clutter.
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

          <div
            className="rounded-lg border border-border/40 p-6"
            key={ringAnimKey}
          >
            <div className="flex items-center gap-8">
              {/* Ring */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="group relative shrink-0 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      aria-label={
                        ringState.withContext
                          ? `${MEMORY_ENTRIES.length} loaded memories`
                          : "No memory loaded"
                      }
                    />
                  }
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
                        className="memory-ring-fill text-foreground/50"
                        style={
                          {
                            "--ring-circ": RING_CIRC,
                            "--ring-offset": RING_CIRC * 0.35,
                          } as React.CSSProperties
                        }
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Brain01Icon}
                      size={18}
                      strokeWidth={1.5}
                      className={
                        ringState.withContext
                          ? "text-foreground/60"
                          : "text-muted-foreground/30"
                      }
                    />
                  </div>
                </TooltipTrigger>
                {ringState.withContext && (
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="w-56 max-w-56 flex-col items-stretch gap-2 bg-popover text-popover-foreground"
                  >
                    <p className="text-xs font-medium text-foreground/80">
                      Loaded memories
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {MEMORY_ENTRIES.slice(0, 4).map((e) => (
                        <div key={e.id} className="flex items-baseline gap-2">
                          <span className="shrink-0 text-[10px] text-muted-foreground/50">
                            {e.key}
                          </span>
                          <span className="truncate text-[10px] text-muted-foreground">
                            {e.value}
                          </span>
                        </div>
                      ))}
                      <p className="text-[10px] text-muted-foreground/40">
                        +{MEMORY_ENTRIES.length - 4} more
                      </p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>

              {/* Label */}
              <div>
                <p className="text-sm font-medium">
                  {ringState.withContext ? "Memory active" : "No memory loaded"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {ringState.withContext
                    ? `${MEMORY_ENTRIES.length} entries loaded into this session — open the ring for details.`
                    : "Start a conversation to load reviewer preferences and context."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                State
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Ring Visual
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Tooltip
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "No Context",
                "Empty ring with muted icon",
                "No tooltip — nothing to show",
              ],
              [
                "With Context",
                "Partially filled ring, animated on load",
                "Lists loaded memories with key-value pairs on hover or focus",
              ],
            ].map(([state, ring, tooltip], i) => (
              <TableRow
                key={state}
                className={i < 1 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">
                  {state}
                </TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {ring}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {tooltip}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          No number inside the ring — the icon signals presence, and the tooltip
          provides detail on demand. This avoids cognitive load for reviewers
          who don&apos;t need to know the exact count at a glance.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Privacy Controls                                 */}
      {/* ============================================================ */}
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
    </article>
  )
}
