"use client"

import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  COMPOSER_MENTION_MARKER,
  ensureComposerMentionMarkers,
  useComposer,
  type ComposerMention,
} from "./composer"

const CARET_SENTINEL = "\u200B"
const INLINE_MENTION_SLOT = "composer-inline-mention"

function isIconSvgElement(
  icon: React.ReactNode | IconSvgElement | undefined
): icon is IconSvgElement {
  return (
    Boolean(icon) && typeof icon === "object" && !React.isValidElement(icon)
  )
}

function placeCaretAtEnd(element: HTMLDivElement) {
  const selection = window.getSelection()
  if (!selection) return

  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

function normalizeEditorText(text: string | null | undefined) {
  return (text ?? "").replace(/\u00a0/g, " ").replace(/\u200B/g, "")
}

function ensureCaretAnchor(element: HTMLDivElement) {
  if (normalizeEditorText(element.textContent)) return
  element.textContent = CARET_SENTINEL
}

function insertPlainTextAtSelection(text: string) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  range.deleteContents()
  const textNode = document.createTextNode(text)
  range.insertNode(textNode)
  range.setStartAfter(textNode)
  range.setEndAfter(textNode)
  selection.removeAllRanges()
  selection.addRange(range)
}

function areMentionsEqual(
  left: ComposerMention[],
  right: ComposerMention[]
): boolean {
  if (left.length !== right.length) return false
  return left.every(
    (mention, index) =>
      mention.id === right[index]?.id &&
      mention.handle === right[index]?.handle &&
      mention.label === right[index]?.label
  )
}

function getMentionBadgeClassName(mention: ComposerMention) {
  return cn(
    "pointer-events-none inline-flex h-6 items-center gap-1 rounded-full px-2 align-middle text-[0.8125rem]/4 font-medium tracking-[-0.01em] whitespace-nowrap shadow-none select-none [&>svg]:size-3!",
    mentionToneClassNames[mention.tone ?? "neutral"],
    mention.badgeClassName
  )
}

function readComposerEditorState(
  editor: HTMLDivElement,
  mentionLookup: Map<string, ComposerMention>
) {
  let nextValue = ""
  const nextMentions: ComposerMention[] = []

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      nextValue += normalizeEditorText(node.textContent)
      return
    }

    if (!(node instanceof HTMLElement)) return

    if (node.dataset.slot === INLINE_MENTION_SLOT) {
      const mentionId = node.dataset.mentionId
      const mention = mentionId ? mentionLookup.get(mentionId) : null
      if (!mention) return

      nextValue += COMPOSER_MENTION_MARKER
      nextMentions.push(mention)
      return
    }

    if (node.tagName === "BR") {
      nextValue += "\n"
      return
    }

    const isBlockNode =
      node !== editor && (node.tagName === "DIV" || node.tagName === "P")
    const childNodes = Array.from(node.childNodes)

    childNodes.forEach((childNode, index) => {
      walk(childNode)

      if (
        isBlockNode &&
        index === childNodes.length - 1 &&
        node.nextSibling &&
        !nextValue.endsWith("\n")
      ) {
        nextValue += "\n"
      }
    })
  }

  Array.from(editor.childNodes).forEach(walk)

  return {
    value: nextValue,
    mentions: nextMentions,
  }
}

function cloneMentionNode(
  mention: ComposerMention,
  templateRoot: HTMLDivElement | null
) {
  const fallback = document.createElement("span")
  fallback.textContent = mention.label
  fallback.className = getMentionBadgeClassName(mention)

  const templateNode = templateRoot?.querySelector<HTMLElement>(
    `[data-template-mention-id="${mention.id}"]`
  )
  const mentionNode = templateNode?.cloneNode(true)

  const element =
    mentionNode instanceof HTMLElement ? mentionNode : fallback.cloneNode(true)

  if (!(element instanceof HTMLElement)) return fallback

  element.dataset.slot = INLINE_MENTION_SLOT
  element.dataset.mentionId = mention.id
  element.removeAttribute("data-template-mention-id")
  element.setAttribute("contenteditable", "false")
  element.setAttribute("spellcheck", "false")
  return element
}

function renderComposerEditorContent(
  editor: HTMLDivElement,
  templateRoot: HTMLDivElement | null,
  value: string,
  mentions: ComposerMention[],
  isFocused: boolean
) {
  const renderValue = ensureComposerMentionMarkers(value, mentions.length)
  const fragment = document.createDocumentFragment()
  let textBuffer = ""
  let mentionIndex = 0

  const flushTextBuffer = () => {
    if (!textBuffer) return
    fragment.append(document.createTextNode(textBuffer))
    textBuffer = ""
  }

  for (const character of renderValue) {
    if (character === COMPOSER_MENTION_MARKER) {
      flushTextBuffer()
      const mention = mentions[mentionIndex]
      if (mention) fragment.append(cloneMentionNode(mention, templateRoot))
      mentionIndex += 1
      continue
    }

    textBuffer += character
  }

  flushTextBuffer()

  while (mentionIndex < mentions.length) {
    const mention = mentions[mentionIndex]
    if (mention) {
      if (fragment.lastChild) fragment.append(document.createTextNode(" "))
      fragment.append(cloneMentionNode(mention, templateRoot))
    }
    mentionIndex += 1
  }

  if (!fragment.childNodes.length && isFocused) {
    fragment.append(document.createTextNode(CARET_SENTINEL))
  } else if (
    isFocused &&
    fragment.lastChild instanceof HTMLElement &&
    fragment.lastChild.dataset.slot === INLINE_MENTION_SLOT
  ) {
    fragment.append(document.createTextNode(" "))
  }

  editor.replaceChildren(fragment)
}

const mentionToneClassNames = {
  neutral: "border border-foreground/10 bg-foreground/6 text-foreground/78",
  blue: "border border-sky-400/22 bg-sky-500/12 text-sky-300",
  violet: "border border-violet-400/18 bg-violet-500/12 text-violet-300",
} as const

export function ComposerInput({
  placeholder = "Type a message...",
  maxHeight,
  "aria-label": ariaLabel = "Message",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  placeholder?: string
  maxHeight?: number
}) {
  const {
    value,
    onValueChange,
    mentionGroups,
    mentions,
    onMentionsChange,
    mentionMenuOpen,
    mentionOptionCount,
    moveActiveMention,
    closeMentionMenu,
    syncMentionQuery,
    selectActiveMention,
    send,
    disabled,
    inputRef,
  } = useComposer()
  const [isFocused, setIsFocused] = React.useState(false)
  const templateRef = React.useRef<HTMLDivElement | null>(null)
  const knownMentions = React.useMemo(() => {
    const nextMentions = new Map<string, ComposerMention>()

    mentions.forEach((mention) => {
      nextMentions.set(mention.id, mention)
    })

    mentionGroups.forEach((group) => {
      group.items.forEach((mention) => {
        if (!nextMentions.has(mention.id)) nextMentions.set(mention.id, mention)
      })
    })

    return Array.from(nextMentions.values())
  }, [mentionGroups, mentions])
  const mentionLookup = React.useMemo(
    () => new Map(knownMentions.map((mention) => [mention.id, mention])),
    [knownMentions]
  )

  React.useEffect(() => {
    const editor = inputRef.current
    if (!editor) return

    const renderValue = ensureComposerMentionMarkers(value, mentions.length)
    const domState = readComposerEditorState(editor, mentionLookup)

    if (
      domState.value !== renderValue ||
      !areMentionsEqual(domState.mentions, mentions)
    ) {
      renderComposerEditorContent(
        editor,
        templateRef.current,
        value,
        mentions,
        document.activeElement === editor || isFocused
      )
      if (document.activeElement === editor) placeCaretAtEnd(editor)
    }

    if (!renderValue && mentions.length === 0) {
      if (document.activeElement === editor) {
        ensureCaretAnchor(editor)
        placeCaretAtEnd(editor)
      } else {
        editor.innerHTML = ""
      }
    }
    syncMentionQuery(renderValue)

    if (maxHeight) {
      editor.style.maxHeight = `${maxHeight}px`
      editor.style.overflowY =
        editor.scrollHeight > maxHeight ? "auto" : "hidden"
    } else {
      editor.style.maxHeight = ""
      editor.style.overflowY = "hidden"
    }
  }, [
    inputRef,
    isFocused,
    maxHeight,
    mentionLookup,
    mentions,
    syncMentionQuery,
    value,
  ])

  const syncValueFromDom = React.useCallback(() => {
    const editor = inputRef.current
    if (!editor) return

    const nextState = readComposerEditorState(editor, mentionLookup)
    const nextValue = nextState.value

    if (
      !nextValue &&
      nextState.mentions.length === 0 &&
      document.activeElement !== editor
    ) {
      editor.innerHTML = ""
    }

    if (nextValue !== value) onValueChange(nextValue)
    if (!areMentionsEqual(nextState.mentions, mentions)) {
      onMentionsChange(nextState.mentions)
    }

    syncMentionQuery(nextValue)
  }, [
    inputRef,
    mentionLookup,
    mentions,
    onMentionsChange,
    onValueChange,
    syncMentionQuery,
    value,
  ])

  return (
    <div
      data-slot="composer-input"
      className={cn("min-w-0", className)}
      {...props}
    >
      <div
        data-slot="composer-input-frame"
        className="min-h-11 cursor-text text-[0.9375rem]/6 font-medium tracking-[-0.01em] text-foreground sm:min-h-12"
      >
        <div
          data-slot="composer-input-flow"
          className="relative min-h-full w-full break-words whitespace-pre-wrap"
          onMouseDown={(event) => {
            const target = event.target as HTMLElement
            if (
              target !== event.currentTarget &&
              target.dataset.slot !== "composer-placeholder"
            ) {
              return
            }

            event.preventDefault()
            inputRef.current?.focus()
            if (inputRef.current) {
              ensureCaretAnchor(inputRef.current)
              placeCaretAtEnd(inputRef.current)
            }
          }}
        >
          {!value && mentions.length === 0 && !isFocused ? (
            <span
              data-slot="composer-placeholder"
              className="pointer-events-none absolute inset-0 text-foreground/34"
            >
              {placeholder}
            </span>
          ) : null}

          <div
            ref={inputRef}
            contentEditable={!disabled}
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label={ariaLabel}
            data-slot="composer-editable"
            onFocus={() => {
              setIsFocused(true)
              syncMentionQuery(value)
              if (inputRef.current) {
                if (!normalizeEditorText(inputRef.current.textContent)) {
                  ensureCaretAnchor(inputRef.current)
                  placeCaretAtEnd(inputRef.current)
                }
              }
            }}
            onInput={syncValueFromDom}
            onBlur={() => {
              setIsFocused(false)
              syncValueFromDom()
              requestAnimationFrame(() => {
                if (document.activeElement !== inputRef.current) {
                  if (
                    inputRef.current &&
                    !normalizeEditorText(inputRef.current.textContent)
                  ) {
                    inputRef.current.innerHTML = ""
                  }
                  closeMentionMenu()
                }
              })
            }}
            onPaste={(event) => {
              event.preventDefault()
              insertPlainTextAtSelection(
                event.clipboardData.getData("text/plain")
              )
              syncValueFromDom()
            }}
            onKeyDown={(event) => {
              if (mentionMenuOpen) {
                if (event.key === "ArrowDown") {
                  event.preventDefault()
                  moveActiveMention(1)
                  return
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault()
                  moveActiveMention(-1)
                  return
                }

                if (event.key === "Escape") {
                  event.preventDefault()
                  closeMentionMenu()
                  return
                }

                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  mentionOptionCount > 0
                ) {
                  event.preventDefault()
                  selectActiveMention()
                  return
                }
              }

              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                send()
                return
              }

              if (
                event.key === "Backspace" &&
                !value &&
                mentions.length > 0 &&
                !event.shiftKey
              ) {
                event.preventDefault()
                onMentionsChange(mentions.slice(0, -1))
              }
            }}
            className="relative z-1 inline-block min-h-6 min-w-[1px] bg-transparent align-middle break-words whitespace-pre-wrap caret-current outline-none"
          />

          <div ref={templateRef} className="hidden" aria-hidden="true">
            {knownMentions.map((mention) => (
              <Badge
                key={mention.id}
                data-template-mention-id={mention.id}
                data-icon={mention.icon ? "inline-start" : undefined}
                variant={mention.badgeVariant ?? "outline"}
                className={cn(
                  getMentionBadgeClassName(mention),
                  "translate-y-[-1px]"
                )}
              >
                {React.isValidElement(mention.icon) ? (
                  mention.icon
                ) : isIconSvgElement(mention.icon) ? (
                  <HugeiconsIcon
                    icon={mention.icon}
                    size={12}
                    strokeWidth={1.7}
                    className="opacity-85"
                  />
                ) : null}
                <span>{mention.label}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
