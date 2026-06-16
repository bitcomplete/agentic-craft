"use client"

import * as React from "react"
import { Streamdown, type AnimateOptions, type Components } from "streamdown"

import { cn } from "@/lib/utils"

const defaultAnimated: AnimateOptions = {
  animation: "slideUp",
  duration: 180,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  sep: "word",
  stagger: 8,
}

function withoutNode<T extends { node?: unknown }>(props: T) {
  const { node, ...domProps } = props

  void node

  return domProps
}

const threadMarkdownComponents: Components = {
  p: ({ className, ...props }) => (
    <p
      className={cn("my-3 first:mt-0 last:mb-0", className)}
      {...withoutNode(props)}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "font-medium text-foreground underline underline-offset-4 transition-[color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground/80",
        className
      )}
      {...withoutNode(props)}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...withoutNode(props)}
    />
  ),
  em: ({ className, ...props }) => (
    <em className={cn("text-foreground", className)} {...withoutNode(props)} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-3 list-disc pl-5 marker:text-muted-foreground first:mt-0 last:mb-0 [&>li+li]:mt-1.5",
        className
      )}
      {...withoutNode(props)}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-3 list-decimal pl-5 first:mt-0 last:mb-0 [&>li+li]:mt-1",
        className
      )}
      {...withoutNode(props)}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("pl-1 text-pretty", className)} {...withoutNode(props)} />
  ),
  h1: ({ className, ...props }) => (
    <h1
      className={cn("mt-5 mb-2 text-lg leading-7 font-semibold", className)}
      {...withoutNode(props)}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn("mt-5 mb-2 text-base leading-7 font-semibold", className)}
      {...withoutNode(props)}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn("mt-4 mb-2 text-sm leading-6 font-semibold", className)}
      {...withoutNode(props)}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn("mt-4 mb-2 text-sm leading-6 font-semibold", className)}
      {...withoutNode(props)}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-3 border-l border-border pl-3 text-muted-foreground first:mt-0 last:mb-0",
        className
      )}
      {...withoutNode(props)}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded border border-border bg-muted px-1 py-0.5 font-mono text-[0.9em]",
        className?.includes("language-") &&
          "block border-0 bg-transparent p-0 text-[13px] leading-5",
        className
      )}
      {...withoutNode(props)}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-3 overflow-x-auto rounded-md border border-border bg-muted/50 p-3 first:mt-0 last:mb-0",
        className
      )}
      {...withoutNode(props)}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-3 overflow-x-auto rounded-md border border-border first:mt-0 last:mb-0">
      <table
        className={cn("w-full text-left text-sm", className)}
        {...withoutNode(props)}
      />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("bg-muted/70", className)} {...withoutNode(props)} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("px-3 py-2 font-medium", className)}
      {...withoutNode(props)}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border-t border-border px-3 py-2", className)}
      {...withoutNode(props)}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr
      className={cn("my-4 border-border", className)}
      {...withoutNode(props)}
    />
  ),
}

type ThreadMarkdownProps = React.ComponentProps<typeof Streamdown> & {
  streaming?: boolean
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"
const reducedMotionSubscribers = new Set<() => void>()
let reducedMotionMediaQuery: MediaQueryList | null = null

function notifyReducedMotionSubscribers() {
  for (const subscriber of reducedMotionSubscribers) {
    subscriber()
  }
}

function getReducedMotionMediaQuery() {
  if (typeof window === "undefined") {
    return null
  }

  reducedMotionMediaQuery ??= window.matchMedia(reducedMotionQuery)
  return reducedMotionMediaQuery
}

function getReducedMotionSnapshot() {
  return getReducedMotionMediaQuery()?.matches ?? true
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mediaQuery = getReducedMotionMediaQuery()

  if (!mediaQuery) {
    return () => {}
  }

  if (reducedMotionSubscribers.size === 0) {
    mediaQuery.addEventListener("change", notifyReducedMotionSubscribers)
  }

  reducedMotionSubscribers.add(onStoreChange)

  return () => {
    reducedMotionSubscribers.delete(onStoreChange)

    if (reducedMotionSubscribers.size === 0) {
      mediaQuery.removeEventListener("change", notifyReducedMotionSubscribers)
    }
  }
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => true
  )
}

function ThreadMarkdown({
  streaming,
  isAnimating,
  animated,
  mode,
  components,
  className,
  children,
  ...props
}: ThreadMarkdownProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const mergedComponents = React.useMemo(
    () => ({
      ...threadMarkdownComponents,
      ...components,
    }),
    [components]
  )
  const shouldAnimate = Boolean(isAnimating ?? streaming)

  return (
    <Streamdown
      mode={mode ?? (streaming ? "streaming" : "static")}
      isAnimating={shouldAnimate && !prefersReducedMotion}
      animated={prefersReducedMotion ? false : (animated ?? defaultAnimated)}
      components={mergedComponents}
      className={cn(
        "thread-markdown text-sm leading-6 text-pretty [overflow-wrap:anywhere] break-words whitespace-normal text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    >
      {children}
    </Streamdown>
  )
}

export { ThreadMarkdown, threadMarkdownComponents }
export type { ThreadMarkdownProps }
