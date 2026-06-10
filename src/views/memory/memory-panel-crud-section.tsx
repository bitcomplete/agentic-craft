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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
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

/* ------------------------------------------------------------------ */
/*  Section export (panel + crud colocated — panel calls handleCrudToggle)
/* ------------------------------------------------------------------ */

export function MemoryPanelCrudSection() {
  /* ── Memory Panel state ── */
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

  /* ── Memory Entry CRUD state ── */
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

  return (
    <>
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
    </>
  )
}
