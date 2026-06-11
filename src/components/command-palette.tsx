"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { sections } from "@/content/navigation"
import { templateDetails } from "@/content/templates"
import { useTheme } from "@/components/theme-provider"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { useSidebar } from "@/components/ui/sidebar"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaletteItem =
  | {
      kind: "nav-section"
      groupLabel: string
      title: string
      sectionPath: string
    }
  | {
      kind: "nav-sub"
      groupLabel: string
      title: string
      sectionPath: string
      subId: string
    }
  | {
      kind: "template"
      groupLabel: string
      title: string
      slug: string
    }
  | {
      kind: "action"
      groupLabel: string
      title: string
      hint: string
      onActivate: () => void
    }

// ---------------------------------------------------------------------------
// Build the full index once (outside component — stable ref)
// ---------------------------------------------------------------------------

function buildIndex(toggleTheme: () => void): PaletteItem[] {
  const items: PaletteItem[] = []

  // Navigation sections and their subsections
  for (const section of sections) {
    items.push({
      kind: "nav-section",
      groupLabel: section.title,
      title: section.title,
      sectionPath: section.path,
    })
    for (const sub of section.subs) {
      items.push({
        kind: "nav-sub",
        groupLabel: section.title,
        title: sub.title,
        sectionPath: section.path,
        subId: sub.id,
      })
    }
  }

  // Template detail pages
  for (const tpl of templateDetails) {
    items.push({
      kind: "template",
      groupLabel: "Templates",
      title: tpl.title,
      slug: tpl.slug,
    })
  }

  // Actions
  items.push({
    kind: "action",
    groupLabel: "Actions",
    title: "Toggle theme",
    hint: "d",
    onActivate: toggleTheme,
  })

  return items
}

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

const MAX_RESULTS = 12

function filterItems(items: PaletteItem[], query: string): PaletteItem[] {
  if (!query.trim()) {
    // Show the first MAX_RESULTS items from the index
    return items.slice(0, MAX_RESULTS)
  }
  const q = query.toLowerCase()
  return items
    .filter((item) => {
      const haystack = (item.groupLabel + " " + item.title).toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, MAX_RESULTS)
}

// ---------------------------------------------------------------------------
// Group results
// ---------------------------------------------------------------------------

type Group = {
  label: string
  items: PaletteItem[]
}

function groupResults(items: PaletteItem[]): Group[] {
  const map = new Map<string, PaletteItem[]>()
  for (const item of items) {
    const list = map.get(item.groupLabel) ?? []
    list.push(item)
    map.set(item.groupLabel, list)
  }
  return Array.from(map.entries()).map(([label, its]) => ({
    label,
    items: its,
  }))
}

// ---------------------------------------------------------------------------
// Unique item id (for aria-activedescendant)
// ---------------------------------------------------------------------------

function itemId(_item: PaletteItem, index: number): string {
  return `cmd-item-${index}`
}

// ---------------------------------------------------------------------------
// CommandPaletteContent  (the inner listbox rendered inside the dialog)
// ---------------------------------------------------------------------------

interface CommandPaletteContentProps {
  onClose: () => void
}

function CommandPaletteContent({ onClose }: CommandPaletteContentProps) {
  const router = useRouter()
  const scrollToSection = useScrollToSection()
  const { resolvedTheme, setTheme } = useTheme()
  const { setOpenMobile } = useSidebar()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  // Build index inside component so toggleTheme is stable
  const allItems = React.useMemo(() => buildIndex(toggleTheme), [toggleTheme])

  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)

  const results = React.useMemo(
    () => filterItems(allItems, query),
    [allItems, query]
  )

  const groups = React.useMemo(() => groupResults(results), [results])

  // Reset active index when results change
  React.useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const activeItemId =
    results.length > 0 ? itemId(results[activeIndex], activeIndex) : undefined

  const activate = React.useCallback(
    (item: PaletteItem) => {
      setOpenMobile(false)
      onClose()
      if (item.kind === "nav-section") {
        router.push(item.sectionPath)
      } else if (item.kind === "nav-sub") {
        scrollToSection(item.sectionPath, item.subId)
      } else if (item.kind === "template") {
        router.push(`/templates/${item.slug}`)
      } else if (item.kind === "action") {
        item.onActivate()
      }
    },
    [onClose, router, scrollToSection, setOpenMobile]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % Math.max(results.length, 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) =>
        prev === 0 ? Math.max(results.length - 1, 0) : prev - 1
      )
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (results[activeIndex]) {
        activate(results[activeIndex])
      }
    }
  }

  // Scroll active row into view
  const listRef = React.useRef<HTMLUListElement>(null)
  React.useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector(
      `[data-active="true"]`
    ) as HTMLElement | null
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Search input */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <HugeiconsIcon
          icon={Search01Icon}
          size={14}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          aria-label="Search patterns"
          aria-controls="cmd-listbox"
          aria-activedescendant={activeItemId}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          autoComplete="off"
          autoFocus
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Results */}
      <ul
        id="cmd-listbox"
        role="listbox"
        aria-label="Search results"
        ref={listRef}
        className="max-h-72 overflow-y-auto overscroll-contain p-1.5"
      >
        {results.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            No matches
          </li>
        ) : (
          groups.map((group) => (
            <li key={group.label} role="presentation">
              <div
                role="presentation"
                className="px-2 py-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase"
              >
                {group.label}
              </div>
              <ul role="presentation">
                {group.items.map((item) => {
                  const globalIndex = results.indexOf(item)
                  const isActive = globalIndex === activeIndex
                  return (
                    <li
                      key={itemId(item, globalIndex)}
                      id={itemId(item, globalIndex)}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onMouseEnter={() => setActiveIndex(globalIndex)}
                      onClick={() => activate(item)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-sm text-foreground transition-colors duration-75",
                        isActive
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted/60"
                      )}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.kind === "action" && (
                        <kbd className="ml-2 shrink-0 rounded border border-border bg-muted/50 px-1 text-[11px] text-muted-foreground">
                          {item.hint}
                        </kbd>
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CommandPalette (Dialog wrapper + global keyboard trigger)
// ---------------------------------------------------------------------------

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "fixed top-[20%] left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-lg bg-background text-sm ring-1 ring-foreground/10 duration-150 outline-none motion-reduce:animate-none motion-reduce:transition-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          )}
        >
          <CommandPaletteContent onClose={() => onOpenChange(false)} />
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Global Cmd+K hook
// ---------------------------------------------------------------------------

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when target is editable (unless it's the palette's own input)
      const target = e.target as HTMLElement
      const isEditable =
        target.isContentEditable ||
        (target instanceof HTMLInputElement && target.role !== "combobox") ||
        target instanceof HTMLTextAreaElement

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        if (isEditable) return
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { open, setOpen }
}
