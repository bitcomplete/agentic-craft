"use client"

import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

/* ── Types ── */

export interface ComposerTask {
  label: string
  done: boolean
  dimmed?: boolean
}

export interface ComposerFile {
  name: string
  size: string
  type: "file" | "image"
}

export interface ComposerScopeItem {
  id: string
  label: string
  icon: IconSvgElement
}

export interface ComposerMention {
  id: string
  label: string
  icon?: IconSvgElement | React.ReactNode
  tone?: "neutral" | "blue" | "violet"
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
  badgeClassName?: string
  handle?: string
  prefix?: string
}

export interface ComposerMentionOption extends ComposerMention {
  description?: string
  searchValue?: string
}

export interface ComposerMentionGroup {
  id: string
  label: string
  emptyLabel?: string
  hideItemsWhenQueryEmpty?: boolean
  items: ComposerMentionOption[]
}

export const COMPOSER_MENTION_MARKER = "\uFFFC"

function getComposerMentionText(mention: ComposerMention): string {
  const prefix = mention.prefix ?? "@"
  const handle = mention.handle ?? mention.label
  return `${prefix}${handle}`
}

export function ensureComposerMentionMarkers(
  value: string,
  mentionCount: number
): string {
  const markerCount = [...value].filter(
    (character) => character === COMPOSER_MENTION_MARKER
  ).length

  if (markerCount >= mentionCount) return value

  const nextMarkers = Array.from(
    { length: mentionCount - markerCount },
    () => COMPOSER_MENTION_MARKER
  ).join(" ")

  if (!nextMarkers) return value

  const trimmedValue = value.replace(/\s+$/, "")
  return trimmedValue ? `${trimmedValue} ${nextMarkers}` : nextMarkers
}

export function serializeComposerValue(
  value: string,
  mentions: ComposerMention[]
): string {
  let mentionIndex = 0
  let output = ""

  for (const character of value) {
    if (character === COMPOSER_MENTION_MARKER) {
      const mention = mentions[mentionIndex]
      if (mention) output += getComposerMentionText(mention)
      mentionIndex += 1
      continue
    }

    output += character
  }

  while (mentionIndex < mentions.length) {
    const mentionText = getComposerMentionText(mentions[mentionIndex]!)
    output = output.replace(/\s+$/, "")
    output = output ? `${output} ${mentionText}` : mentionText
    mentionIndex += 1
  }

  return output
}

function createComposerMentionOnlyValue(mentionCount: number): string {
  return Array.from(
    { length: mentionCount },
    () => COMPOSER_MENTION_MARKER
  ).join(" ")
}

function getComposerMentionQuery(value: string): string | null {
  const match = value.match(/(?:^|\s)@([^\s@]*)$/)
  return match ? match[1] : null
}

function stripComposerMentionQuery(value: string): string {
  return value.replace(/(^|\s)@[^\s@]*$/, "$1").replace(/\s+$/, "")
}

function isIconSvgElement(
  icon: React.ReactNode | IconSvgElement | undefined
): icon is IconSvgElement {
  return (
    Boolean(icon) && typeof icon === "object" && !React.isValidElement(icon)
  )
}

function matchesComposerMentionQuery(
  mention: ComposerMentionOption,
  query: string
): boolean {
  if (!query) return true

  const normalizedQuery = query.toLowerCase()
  const searchHaystack = [
    mention.label,
    mention.handle,
    mention.description,
    mention.searchValue,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return searchHaystack.includes(normalizedQuery)
}

/* ── Context ── */

interface ComposerContextValue {
  value: string
  onValueChange: (value: string) => void
  mentionGroups: ComposerMentionGroup[]
  mentions: ComposerMention[]
  onMentionsChange: (mentions: ComposerMention[]) => void
  mentionQuery: string | null
  mentionMenuOpen: boolean
  mentionOptionCount: number
  activeMentionIndex: number
  setActiveMentionIndex: (index: number) => void
  moveActiveMention: (delta: number) => void
  closeMentionMenu: () => void
  syncMentionQuery: (value: string) => void
  selectMention: (mention: ComposerMentionOption) => void
  selectActiveMention: () => boolean
  filteredMentionGroups: ComposerMentionGroup[]
  isSending: boolean
  send: () => void
  disabled: boolean
  inputRef: React.RefObject<HTMLDivElement | null>
}

const ComposerContext = React.createContext<ComposerContextValue | null>(null)

export function useComposer(): ComposerContextValue {
  const ctx = React.useContext(ComposerContext)
  if (!ctx) {
    throw new Error("useComposer must be used within a <Composer />")
  }
  return ctx
}

/* ── Composer (root) ── */

export function Composer({
  value: valueProp,
  defaultValue = "",
  onValueChange: onValueChangeProp,
  onSend,
  disabled = false,
  mentionGroups = [],
  mentions: mentionsProp,
  defaultMentions = [],
  onMentionsChange: onMentionsChangeProp,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSend?: (value: string) => void
  disabled?: boolean
  mentionGroups?: ComposerMentionGroup[]
  mentions?: ComposerMention[]
  defaultMentions?: ComposerMention[]
  onMentionsChange?: (mentions: ComposerMention[]) => void
}) {
  const [_value, _setValue] = React.useState(defaultValue)
  const value = valueProp ?? _value
  const onValueChange = React.useCallback(
    (v: string) => {
      if (onValueChangeProp) onValueChangeProp(v)
      else _setValue(v)
    },
    [onValueChangeProp]
  )

  const [_mentions, _setMentions] = React.useState(defaultMentions)
  const mentions = mentionsProp ?? _mentions
  const onMentionsChange = React.useCallback(
    (nextMentions: ComposerMention[]) => {
      if (onMentionsChangeProp) onMentionsChangeProp(nextMentions)
      else _setMentions(nextMentions)
    },
    [onMentionsChangeProp]
  )

  const [isSending, setIsSending] = React.useState(false)
  const [mentionQuery, setMentionQuery] = React.useState<string | null>(null)
  const [activeMentionIndex, setActiveMentionIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLDivElement | null>(null)

  const filteredMentionGroups = React.useMemo(() => {
    if (mentionQuery === null) return []

    const normalizedQuery = mentionQuery.trim().toLowerCase()

    return mentionGroups
      .filter(Boolean)
      .map((group) => {
        const searchableItems =
          group.hideItemsWhenQueryEmpty && !normalizedQuery ? [] : group.items

        return {
          ...group,
          items: searchableItems.filter((item) =>
            matchesComposerMentionQuery(item, normalizedQuery)
          ),
        }
      })
      .filter((group) => group.items.length > 0 || Boolean(group.emptyLabel))
  }, [mentionGroups, mentionQuery])

  const filteredMentionOptions = React.useMemo(
    () => filteredMentionGroups.flatMap((group) => group.items),
    [filteredMentionGroups]
  )

  const mentionMenuOpen = React.useMemo(
    () =>
      mentionQuery !== null &&
      filteredMentionGroups.some(
        (group) => group.items.length > 0 || Boolean(group.emptyLabel)
      ),
    [filteredMentionGroups, mentionQuery]
  )

  React.useEffect(() => {
    setActiveMentionIndex((currentIndex) => {
      if (filteredMentionOptions.length === 0) return 0
      return Math.min(currentIndex, filteredMentionOptions.length - 1)
    })
  }, [filteredMentionOptions.length])

  const syncMentionQuery = React.useCallback((nextValue: string) => {
    setMentionQuery(getComposerMentionQuery(nextValue))
  }, [])

  const closeMentionMenu = React.useCallback(() => {
    setMentionQuery(null)
    setActiveMentionIndex(0)
  }, [])

  const moveActiveMention = React.useCallback(
    (delta: number) => {
      if (filteredMentionOptions.length === 0) return

      setActiveMentionIndex((currentIndex) => {
        const nextIndex = currentIndex + delta
        if (nextIndex < 0) return filteredMentionOptions.length - 1
        if (nextIndex >= filteredMentionOptions.length) return 0
        return nextIndex
      })
    },
    [filteredMentionOptions.length]
  )

  const selectMention = React.useCallback(
    (mention: ComposerMentionOption) => {
      const baseValue = stripComposerMentionQuery(
        ensureComposerMentionMarkers(value, mentions.length)
      ).replace(/\s+$/, "")

      onValueChange(
        baseValue
          ? `${baseValue} ${COMPOSER_MENTION_MARKER} `
          : `${COMPOSER_MENTION_MARKER} `
      )
      onMentionsChange([...mentions, mention])
      closeMentionMenu()
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    },
    [closeMentionMenu, mentions, onMentionsChange, onValueChange, value]
  )

  const selectActiveMention = React.useCallback(() => {
    const activeMention = filteredMentionOptions[activeMentionIndex]
    if (!activeMention) return false
    selectMention(activeMention)
    return true
  }, [activeMentionIndex, filteredMentionOptions, selectMention])

  const send = React.useCallback(() => {
    if (disabled) return
    const currentValue = serializeComposerValue(
      ensureComposerMentionMarkers(value, mentions.length),
      mentions
    ).trim()
    if (!currentValue) return
    setIsSending(true)
    const resetValue = mentions.length
      ? createComposerMentionOnlyValue(mentions.length)
      : ""
    setTimeout(() => {
      onValueChange(resetValue)
      setIsSending(false)
    }, 400)
    onSend?.(currentValue)
  }, [disabled, mentions, onSend, onValueChange, value])

  const ctx = React.useMemo<ComposerContextValue>(
    () => ({
      value,
      onValueChange,
      mentionGroups,
      mentions,
      onMentionsChange,
      mentionQuery,
      mentionMenuOpen,
      mentionOptionCount: filteredMentionOptions.length,
      activeMentionIndex,
      setActiveMentionIndex,
      moveActiveMention,
      closeMentionMenu,
      syncMentionQuery,
      selectMention,
      selectActiveMention,
      filteredMentionGroups,
      isSending,
      send,
      disabled,
      inputRef,
    }),
    [
      value,
      onValueChange,
      mentionGroups,
      mentions,
      onMentionsChange,
      mentionQuery,
      mentionMenuOpen,
      filteredMentionOptions.length,
      activeMentionIndex,
      moveActiveMention,
      closeMentionMenu,
      syncMentionQuery,
      selectMention,
      selectActiveMention,
      filteredMentionGroups,
      isSending,
      send,
      disabled,
    ]
  )

  return (
    <ComposerContext.Provider value={ctx}>
      <div
        data-slot="composer"
        className={cn(
          "mx-auto flex w-full max-w-180 flex-col items-center [--composer-shell-inset:--spacing(3)] [--composer-shell-radius:var(--radius-4xl)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ComposerContext.Provider>
  )
}

/* ── ComposerIslands ── */

export function ComposerIslands({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-islands"
      className={cn(
        "flex w-full flex-col items-center",
        "*:data-[slot=composer-island-wrapper]:w-[calc(100%-var(--composer-shell-inset)*2)]",
        "[&>[data-slot=composer-island-wrapper]_[data-slot=composer-island]]:rounded-b-none",
        "[&>[data-slot=composer-island-wrapper]:not(:first-child)_[data-slot=composer-island]]:rounded-t-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ComposerShell ── */

export function ComposerShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-shell"
      className={cn(
        "relative isolate z-1 flex w-full flex-col overflow-hidden rounded-[var(--composer-shell-radius)] border border-border/55 bg-card/92 text-card-foreground shadow-[0_1px_0_rgba(255,255,255,0.035)_inset,0_18px_40px_rgba(0,0,0,0.2)] [--composer-control-radius:var(--composer-inner-radius)] [--composer-inner-radius:calc(var(--composer-shell-radius)-var(--composer-shell-inset))] supports-[backdrop-filter]:bg-card/84 supports-[backdrop-filter]:backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ComposerBody ── */

export function ComposerBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-body"
      className={cn(
        "flex flex-col gap-1.5 [padding-inline:var(--composer-shell-inset)] [padding-top:var(--composer-shell-inset)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ComposerMentionMenu ── */

export function ComposerMentionMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    mentionMenuOpen,
    filteredMentionGroups,
    activeMentionIndex,
    setActiveMentionIndex,
    selectMention,
  } = useComposer()

  if (!mentionMenuOpen) return null

  let itemIndex = -1

  return (
    <div
      data-slot="composer-mention-menu"
      className={cn(
        "animate-composer-slide mb-1 w-full overflow-hidden rounded-[var(--composer-shell-radius)] border border-border/55 bg-card/94 text-card-foreground shadow-[0_1px_0_rgba(255,255,255,0.035)_inset,0_18px_40px_rgba(0,0,0,0.18)] supports-[backdrop-filter]:bg-card/88 supports-[backdrop-filter]:backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {filteredMentionGroups.map((group, groupIndex) => (
        <div
          key={group.id}
          className={cn(groupIndex > 0 ? "border-t border-border/45" : "")}
        >
          <div className="px-3.5 pt-2 pb-0.5 text-[0.75rem]/4 font-medium tracking-[-0.01em] text-muted-foreground">
            {group.label}
          </div>

          <div className="flex flex-col gap-0.5 px-1.5 pb-1">
            {group.items.length > 0 ? (
              group.items.map((item) => {
                itemIndex += 1
                const isActive = itemIndex === activeMentionIndex

                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveMentionIndex(itemIndex)}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      selectMention(item)
                    }}
                    className={cn(
                      "flex min-h-8 w-full items-center gap-1.5 rounded-[var(--radius-2xl)] px-2 py-0.5 text-left transition-colors",
                      isActive ? "bg-foreground/8" : "hover:bg-foreground/5"
                    )}
                  >
                    <div className="flex size-3.5 shrink-0 items-center justify-center text-foreground/82">
                      {React.isValidElement(item.icon) ? (
                        item.icon
                      ) : isIconSvgElement(item.icon) ? (
                        <HugeiconsIcon
                          icon={item.icon}
                          size={11}
                          strokeWidth={1.65}
                        />
                      ) : (
                        <span className="size-1.25 rounded-full bg-current opacity-75" />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
                      <div className="shrink-0 text-[0.875rem]/5 font-medium tracking-[-0.01em] text-foreground">
                        {item.label}
                      </div>
                      {item.description ? (
                        <div className="min-w-0 truncate text-[0.875rem]/5 text-muted-foreground">
                          {item.description}
                        </div>
                      ) : null}
                    </div>
                  </button>
                )
              })
            ) : group.emptyLabel ? (
              <div className="px-3.5 py-1 text-[0.875rem]/5 text-muted-foreground">
                {group.emptyLabel}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Re-exports ── */

export { ComposerInput } from "./composer-input"
export {
  ComposerFooter,
  ComposerFooterStart,
  ComposerFooterEnd,
  ComposerMenu,
  ComposerContextRing,
  ComposerSend,
} from "./composer-toolbar"
export { ComposerScope, ComposerReply, ComposerPlan } from "./composer-islands"
export { ComposerAttachments } from "./composer-attachments"
export { ComposerSuggestions } from "./composer-suggestions"
