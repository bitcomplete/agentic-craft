"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
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
      value: string
      sectionPath: string
    }
  | {
      kind: "nav-sub"
      groupLabel: string
      title: string
      value: string
      sectionPath: string
      subId: string
    }
  | {
      kind: "template"
      groupLabel: string
      title: string
      value: string
      slug: string
    }
  | {
      kind: "action"
      groupLabel: string
      title: string
      value: string
      hint: string
      onActivate: () => void
    }

// ---------------------------------------------------------------------------
// Build the full index, deduplicated by destination href
// ---------------------------------------------------------------------------

function buildIndex(toggleTheme: () => void): PaletteItem[] {
  const items: PaletteItem[] = []
  const seenHrefs = new Set<string>()
  const push = (href: string, item: PaletteItem) => {
    if (seenHrefs.has(href)) return
    seenHrefs.add(href)
    items.push(item)
  }

  // Navigation sections and their subsections (nav order)
  for (const section of sections) {
    push(section.path, {
      kind: "nav-section",
      groupLabel: "Sections",
      title: section.title,
      value: `nav-section:${section.path}`,
      sectionPath: section.path,
    })
    for (const sub of section.subs) {
      push(`${section.path}#${sub.id}`, {
        kind: "nav-sub",
        groupLabel: section.title,
        title: sub.title,
        value: `nav-sub:${section.path}:${sub.id}`,
        sectionPath: section.path,
        subId: sub.id,
      })
    }
  }

  // Template detail pages. Each template slug matches a Templates-section
  // sub id above — same destination, so the seen-set drops the duplicate
  // and only templates without a nav subsection get their own row.
  for (const tpl of templateDetails) {
    push(`/templates#${tpl.slug}`, {
      kind: "template",
      groupLabel: "Templates",
      title: tpl.title,
      value: `template:${tpl.slug}`,
      slug: tpl.slug,
    })
  }

  // Actions
  items.push({
    kind: "action",
    groupLabel: "Actions",
    title: "Toggle theme",
    value: "action:toggle-theme",
    hint: "d",
    onActivate: toggleTheme,
  })

  return items
}

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

const MAX_RESULTS = 12

/** True when every query character appears in `haystack` in order. */
function isSubsequence(haystack: string, query: string): boolean {
  let qi = 0
  for (let i = 0; i < haystack.length && qi < query.length; i++) {
    if (haystack[i] === query[qi]) qi++
  }
  return qi === query.length
}

function filterItems(items: PaletteItem[], query: string): PaletteItem[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    // Default view: one row per top-level section, in navigation order.
    // Subsections and templates appear only once the user types.
    return items.filter((item) => item.kind === "nav-section")
  }
  // Substring matches rank first; a subsequence fallback (characters in
  // order, case-insensitive) catches near-miss typing like "aproval".
  const substringMatches: PaletteItem[] = []
  const subsequenceMatches: PaletteItem[] = []
  for (const item of items) {
    const haystack = item.title.toLowerCase()
    if (haystack.includes(q)) {
      substringMatches.push(item)
    } else if (isSubsequence(haystack, q)) {
      subsequenceMatches.push(item)
    }
  }
  return [...substringMatches, ...subsequenceMatches].slice(0, MAX_RESULTS)
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
// CommandPaletteContent  (the inner list rendered inside the dialog)
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

  const results = React.useMemo(
    () => filterItems(allItems, query),
    [allItems, query]
  )

  const groups = React.useMemo(() => groupResults(results), [results])

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

  const browseTemplates = React.useCallback(() => {
    setOpenMobile(false)
    onClose()
    router.push("/templates")
  }, [onClose, router, setOpenMobile])

  return (
    <Command shouldFilter={false} className="rounded-none!">
      <CommandInput
        placeholder="Search…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {results.length === 0 ? (
          <>
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No matches
            </div>
            <CommandGroup>
              <CommandItem
                value="browse-templates"
                onSelect={() => browseTemplates()}
              >
                Browse templates
                <CommandShortcut>↵</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </>
        ) : (
          groups.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => activate(item)}
                >
                  {item.title}
                  {item.kind === "action" && (
                    <CommandShortcut>{item.hint}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))
        )}
      </CommandList>
    </Command>
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
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command palette"
      description="Search sections, templates, and actions."
      className="sm:max-w-md"
    >
      <CommandPaletteContent onClose={() => onOpenChange(false)} />
    </CommandDialog>
  )
}

// ---------------------------------------------------------------------------
// Global Cmd+K hook
// ---------------------------------------------------------------------------

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // The ⌘K / Ctrl+K chord works from anywhere, including inputs,
      // textareas, and contenteditable surfaces — capture phase so a
      // focused editor cannot swallow it. Plain (unmodified) keys are
      // never intercepted.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [])

  return { open, setOpen }
}
