"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import {
  ArrowExpand01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SourcePreviewProps = React.ComponentProps<"aside"> & {
  title: string
  excerpt: string
  location: string
  source?: string
  icon?: IconSvgElement
  index?: number
  total?: number
  onPrevious?: () => void
  onNext?: () => void
  onOpenSource?: () => void
}

function SourcePreview({
  title,
  excerpt,
  location,
  source,
  icon = File01Icon,
  index,
  total,
  onPrevious,
  onNext,
  onOpenSource,
  className,
  ...props
}: SourcePreviewProps) {
  const showNavigation = index !== undefined && total !== undefined && total > 1

  return (
    <aside
      data-slot="source-preview"
      aria-label={`${title} source preview`}
      className={cn(
        "relative rounded-xl border border-white/10 bg-black text-white shadow-[0_14px_52px_rgba(0,0,0,0.42)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={13}
            strokeWidth={1.5}
            className="shrink-0 text-white/60"
            aria-hidden="true"
          />
          <p className="truncate text-xs font-semibold sm:text-sm">{title}</p>
          {onOpenSource && (
            <Button
              type="button"
              data-compact-touch
              aria-label={`Open ${title}`}
              onClick={onOpenSource}
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            >
              <HugeiconsIcon
                icon={ArrowExpand01Icon}
                strokeWidth={1.5}
                data-icon="inline-start"
              />
            </Button>
          )}
        </div>

        {showNavigation && (
          <div className="flex shrink-0 items-center gap-1 text-xs text-white/70">
            <Button
              type="button"
              data-compact-touch
              aria-label="Previous source"
              onClick={onPrevious}
              variant="ghost"
              size="icon-xs"
              className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                strokeWidth={1.5}
                data-icon="inline-start"
              />
            </Button>
            <span className="tabular-nums">
              {(index ?? 0) + 1} of {total}
            </span>
            <Button
              type="button"
              data-compact-touch
              aria-label="Next source"
              onClick={onNext}
              variant="ghost"
              size="icon-xs"
              className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={1.5}
                data-icon="inline-start"
              />
            </Button>
          </div>
        )}
      </div>

      <div className="px-3 py-2.5">
        <p className="text-[13px] leading-5 text-white/88">“{excerpt}”</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2 py-1 text-[11px] text-white/75">
            <HugeiconsIcon icon={File01Icon} size={12} strokeWidth={1.5} />
            {location}
          </div>
          {source && onOpenSource ? (
            <Button
              type="button"
              data-compact-touch
              onClick={onOpenSource}
              variant="ghost"
              size="sm"
              className="h-6 rounded-full bg-white/12 px-2 text-[11px] font-medium text-white hover:bg-white/18 focus-visible:ring-white/40"
            >
              View source
              <HugeiconsIcon
                icon={ArrowExpand01Icon}
                strokeWidth={1.5}
                data-icon="inline-end"
              />
            </Button>
          ) : source ? (
            <span className="inline-flex h-6 items-center rounded-full bg-white/12 px-2 text-[11px] font-medium text-white">
              View source
            </span>
          ) : null}
        </div>
        {source && (
          <p className="mt-2 truncate text-[11px] text-white/45">{source}</p>
        )}
      </div>
    </aside>
  )
}

type SourcePreviewPopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  setPopupElement: (node: HTMLDivElement | null) => void
  consumeReturnFocusGuard: () => boolean
}

const SourcePreviewPopoverContext =
  React.createContext<SourcePreviewPopoverContextValue | null>(null)

type SourcePreviewPopoverProps = Omit<
  PopoverPrimitive.Root.Props,
  "open" | "defaultOpen" | "onOpenChange"
> & {
  onOpenChange?: (open: boolean) => void
}

function SourcePreviewPopover({
  onOpenChange,
  ...props
}: SourcePreviewPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const popupRef = React.useRef<HTMLDivElement | null>(null)
  const suppressNextFocusOpenRef = React.useRef(false)

  const setPopupElement = React.useCallback((node: HTMLDivElement | null) => {
    popupRef.current = node
  }, [])

  // Reads and disarms the guard in one step so a single close suppresses at
  // most one focus event.
  const consumeReturnFocusGuard = React.useCallback(() => {
    const armed = suppressNextFocusOpenRef.current
    suppressNextFocusOpenRef.current = false
    return armed
  }, [])

  const handleOpenChange = React.useCallback(
    (
      nextOpen: boolean,
      eventDetails?: PopoverPrimitive.Root.ChangeEventDetails
    ) => {
      if (nextOpen) {
        suppressNextFocusOpenRef.current = false
      } else {
        // After Escape, an outside press, or a close press, Base UI's focus
        // manager programmatically refocuses the trigger — but only once the
        // exit animation finishes, which can be arbitrarily later than this
        // callback. Arm a one-shot guard (consumed by the trigger's next
        // focus event) instead of racing a timer against the animation. The
        // refocus only happens when the popup held focus (or focus sat on
        // <body>); hover-out closes never return focus, so they leave the
        // guard unarmed and genuine keyboard focus keeps opening the card.
        const reason = eventDetails?.reason
        const mayReturnFocus =
          reason === "escape-key" ||
          reason === "outside-press" ||
          reason === "close-press"
        const activeElement = document.activeElement
        suppressNextFocusOpenRef.current =
          mayReturnFocus &&
          (activeElement === document.body ||
            Boolean(popupRef.current?.contains(activeElement)))
      }
      setOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen: handleOpenChange,
      setPopupElement,
      consumeReturnFocusGuard,
    }),
    [open, handleOpenChange, setPopupElement, consumeReturnFocusGuard]
  )

  return (
    <SourcePreviewPopoverContext.Provider value={contextValue}>
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </SourcePreviewPopoverContext.Provider>
  )
}

function SourcePreviewPopoverTrigger({
  openOnHover = true,
  delay = 300,
  closeDelay = 100,
  onFocus,
  ...props
}: PopoverPrimitive.Trigger.Props) {
  const context = React.useContext(SourcePreviewPopoverContext)

  return (
    <PopoverPrimitive.Trigger
      data-slot="source-preview-popover-trigger"
      openOnHover={openOnHover}
      delay={delay}
      closeDelay={closeDelay}
      onFocus={(event) => {
        onFocus?.(event)
        if (!context) return
        // A close that held focus arms a one-shot guard: the focus manager
        // refocuses this trigger after the exit animation finishes, and that
        // programmatic refocus must not reopen the card. Consume the guard
        // on the first focus event, whenever it lands.
        const isReturnFocus = context.consumeReturnFocusGuard()
        if (context.open || isReturnFocus) return
        // Only keyboard-driven focus opens the preview; pointer interactions
        // are covered by hover and press.
        if (!event.currentTarget.matches(":focus-visible")) return
        context.setOpen(true)
      }}
      {...props}
    />
  )
}

type SourcePreviewPopoverContentProps = PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "collisionPadding" | "side" | "sideOffset"
  >

function SourcePreviewPopoverContent({
  className,
  side = "top",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  collisionPadding = 12,
  children,
  ref,
  ...props
}: SourcePreviewPopoverContentProps) {
  const context = React.useContext(SourcePreviewPopoverContext)
  const setPopupElement = context?.setPopupElement
  const popupRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setPopupElement?.(node)
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [setPopupElement, ref]
  )

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="source-preview-popover-content"
          ref={popupRef}
          initialFocus={false}
          className={cn(
            "z-50 w-[min(360px,calc(100vw-24px))] origin-(--transform-origin) outline-none motion-reduce:animate-none motion-reduce:transition-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
          <PopoverPrimitive.Arrow
            data-slot="source-preview-popover-arrow"
            className="flex data-[side=bottom]:-top-2 data-[side=left]:-right-[13px] data-[side=left]:rotate-90 data-[side=right]:-left-[13px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180"
          >
            <svg
              width="20"
              height="10"
              viewBox="0 0 20 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                className="fill-black"
              />
              <path
                d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                className="fill-white/10"
              />
            </svg>
          </PopoverPrimitive.Arrow>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

type SourcePreviewCitationSource = {
  id: string | number
  title: string
  excerpt: string
  location: string
  source?: string
  icon?: IconSvgElement
}

type SourcePreviewCitationProps = Pick<
  SourcePreviewPopoverContentProps,
  "align" | "side"
> & {
  sources: readonly SourcePreviewCitationSource[]
  sourceIndex?: number
  showIcon?: boolean
  className?: string
  onOpenSource?: (source: SourcePreviewCitationSource) => void
}

/**
 * An inline citation marker: a numbered chip that opens the source preview
 * anchored at the chip on hover, keyboard focus, or tap, with pagination
 * across the supplied sources.
 */
function SourcePreviewCitation({
  sources,
  sourceIndex = 0,
  showIcon = false,
  className,
  side,
  align,
  onOpenSource,
}: SourcePreviewCitationProps) {
  const [viewIndex, setViewIndex] = React.useState(sourceIndex)
  const marker = sources[sourceIndex]
  const preview = sources[viewIndex] ?? marker
  const step = (offset: number) =>
    setViewIndex(
      (current) => (current + offset + sources.length) % sources.length
    )

  if (!marker) return null

  return (
    <SourcePreviewPopover
      onOpenChange={(open) => {
        if (open) setViewIndex(sourceIndex)
      }}
    >
      <SourcePreviewPopoverTrigger
        data-slot="source-preview-citation"
        data-compact-touch
        aria-label={`Preview source ${marker.id}: ${marker.title}`}
        className={cn(
          "relative inline-flex translate-y-[-1px] items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-sans text-xs leading-none text-muted-foreground transition-[background-color,border-color,color,box-shadow] after:absolute after:-inset-x-1 after:-inset-y-2 after:content-[''] hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none data-popup-open:border-primary/30 data-popup-open:bg-primary/10 data-popup-open:text-primary",
          className
        )}
      >
        {showIcon && marker.icon && (
          <HugeiconsIcon
            icon={marker.icon}
            size={12}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
        <span className="tabular-nums">{marker.id}</span>
      </SourcePreviewPopoverTrigger>
      <SourcePreviewPopoverContent side={side} align={align}>
        <SourcePreview
          title={preview.title}
          excerpt={preview.excerpt}
          location={preview.location}
          source={preview.source}
          icon={preview.icon}
          index={viewIndex}
          total={sources.length}
          onPrevious={() => step(-1)}
          onNext={() => step(1)}
          onOpenSource={onOpenSource ? () => onOpenSource(preview) : undefined}
        />
      </SourcePreviewPopoverContent>
    </SourcePreviewPopover>
  )
}

export {
  SourcePreview,
  SourcePreviewCitation,
  SourcePreviewPopover,
  SourcePreviewPopoverContent,
  SourcePreviewPopoverTrigger,
  type SourcePreviewCitationProps,
  type SourcePreviewCitationSource,
  type SourcePreviewPopoverContentProps,
  type SourcePreviewPopoverProps,
  type SourcePreviewProps,
}
