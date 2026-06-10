"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

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

/* ── Context ── */

export interface ComposerState {
  value: string
  isFocused: boolean
  isSending: boolean
  disabled: boolean
  canSend: boolean
}

export interface ComposerActions {
  setValue: (value: string) => void
  setFocused: (focused: boolean) => void
  send: () => void
}

export interface ComposerMeta {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

export const ComposerContext = React.createContext<ComposerContextValue | null>(
  null
)

export function useComposer(): ComposerContextValue {
  const ctx = React.use(ComposerContext)
  if (!ctx) {
    throw new Error("useComposer must be used within a <ComposerProvider />")
  }
  return ctx
}

/* ── ComposerProvider ── */

export function ComposerProvider({
  state,
  actions,
  meta,
  children,
}: {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
  children: React.ReactNode
}) {
  const ctx = React.useMemo<ComposerContextValue>(
    () => ({ state, actions, meta }),
    [state, actions, meta]
  )

  return <ComposerContext value={ctx}>{children}</ComposerContext>
}

/* ── ComposerFrame ── */

export function ComposerFrame({
  className,
  children,
  onSubmit,
  ...props
}: React.ComponentProps<"form">) {
  const {
    actions: { send },
  } = useComposer()

  return (
    <form
      data-slot="composer"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(event)
        send()
      }}
      className={cn(
        "mx-auto flex w-full max-w-[720px] flex-col items-center",
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}

/* ── Composer (local-state convenience root) ── */

export function Composer({
  value: valueProp,
  defaultValue = "",
  onValueChange: onValueChangeProp,
  onSend,
  canSend: canSendProp,
  disabled = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit" | "onChange"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSend?: (value: string) => void
  canSend?: boolean
  disabled?: boolean
}) {
  const [_value, _setValue] = React.useState(defaultValue)
  const value = valueProp ?? _value
  const setValue = React.useCallback(
    (v: string) => {
      if (onValueChangeProp) onValueChangeProp(v)
      else _setValue(v)
    },
    [onValueChangeProp]
  )

  const [isFocused, setIsFocused] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const canSend = canSendProp ?? value.trim().length > 0

  const send = React.useCallback(() => {
    if (disabled) return
    if (isSending) return
    if (!canSend) return
    setIsSending(true)
    const currentValue = value
    setTimeout(() => {
      setValue("")
      setIsSending(false)
      if (textareaRef.current) textareaRef.current.style.height = "auto"
    }, 400)
    onSend?.(currentValue)
  }, [value, disabled, isSending, canSend, setValue, onSend])

  const state = React.useMemo<ComposerState>(
    () => ({
      value,
      isFocused,
      isSending,
      disabled,
      canSend,
    }),
    [value, isFocused, isSending, disabled, canSend]
  )

  const actions = React.useMemo<ComposerActions>(
    () => ({
      setValue,
      setFocused: setIsFocused,
      send,
    }),
    [setValue, send]
  )

  const meta = React.useMemo<ComposerMeta>(
    () => ({ textareaRef }),
    [textareaRef]
  )

  return (
    <ComposerProvider state={state} actions={actions} meta={meta}>
      <ComposerFrame className={className} {...props}>
        {children}
      </ComposerFrame>
    </ComposerProvider>
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
        "relative z-0 -mb-px flex w-[95%] max-w-[684px] flex-col items-stretch self-center",
        "[&>[data-slot=composer-island-wrap]:first-child>[data-slot=composer-island]]:rounded-t-lg sm:[&>[data-slot=composer-island-wrap]:first-child>[data-slot=composer-island]]:rounded-t-xl",
        "[&>[data-slot=composer-island-wrap]:not(:first-child)>[data-slot=composer-island]]:rounded-t-none",
        "[&>[data-slot=composer-island-wrap]:last-child>[data-slot=composer-island]]:rounded-b-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ComposerCard ── */

export function ComposerCard({
  className,
  children,
  onMouseDown,
  ...props
}: React.ComponentProps<"div">) {
  const {
    state: { isFocused },
    meta: { textareaRef },
  } = useComposer()

  return (
    <div
      data-slot="composer-card"
      onMouseDown={(event) => {
        onMouseDown?.(event)
        if (event.defaultPrevented) return
        const target = event.target
        if (!(target instanceof HTMLElement)) return
        if (
          target.closest(
            "button,a,input,textarea,select,[role=button],[data-no-focus]"
          )
        ) {
          return
        }
        textareaRef.current?.focus()
      }}
      className={cn(
        "relative z-1 w-full rounded-xl border bg-background/95 transition-[border-color,box-shadow] duration-200 ease-out sm:rounded-2xl",
        isFocused
          ? "border-foreground/20 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_6px_24px_rgba(0,0,0,0.18)]"
          : "border-border/80 shadow-[0_1px_1px_rgba(0,0,0,0.12)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── Re-exports ── */

export { ComposerInput } from "./composer-input"
export {
  ComposerToolbar,
  ComposerMenu,
  ComposerContextRing,
  ComposerSend,
} from "./composer-toolbar"
export { ComposerScope, ComposerReply, ComposerPlan } from "./composer-islands"
export { ComposerAttachments } from "./composer-attachments"
export { ComposerSuggestions } from "./composer-suggestions"
