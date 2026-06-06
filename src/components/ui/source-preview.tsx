"use client"

import * as React from "react"
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
        "relative rounded-2xl border border-white/10 bg-black text-white shadow-[0_18px_70px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={15}
            strokeWidth={1.7}
            className="shrink-0 text-white/60"
            aria-hidden="true"
          />
          <p className="truncate text-sm font-semibold sm:text-base">
            {title}
          </p>
          <Button
            type="button"
            aria-label={`Open ${title}`}
            onClick={onOpenSource}
            variant="ghost"
            size="icon-xs"
            className="shrink-0 text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
          >
            <HugeiconsIcon
              icon={ArrowExpand01Icon}
              strokeWidth={1.7}
              data-icon="inline-start"
            />
          </Button>
        </div>

        {showNavigation && (
          <div className="flex shrink-0 items-center gap-1 text-xs text-white/70">
            <Button
              type="button"
              aria-label="Previous source"
              onClick={onPrevious}
              variant="ghost"
              size="icon-xs"
              className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                strokeWidth={1.7}
                data-icon="inline-start"
              />
            </Button>
            <span className="tabular-nums">
              {(index ?? 0) + 1} of {total}
            </span>
            <Button
              type="button"
              aria-label="Next source"
              onClick={onNext}
              variant="ghost"
              size="icon-xs"
              className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={1.7}
                data-icon="inline-start"
              />
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 py-5 sm:px-5">
        <p className="text-base leading-relaxed text-white/88 sm:text-lg sm:leading-8">
          "{excerpt}"
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs text-white/75">
            <HugeiconsIcon icon={File01Icon} size={14} strokeWidth={1.7} />
            {location}
          </div>
          {source && (
            <Button
              type="button"
              onClick={onOpenSource}
              variant="ghost"
              size="sm"
              className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/18 focus-visible:ring-white/40"
            >
              View source
              <HugeiconsIcon
                icon={ArrowExpand01Icon}
                strokeWidth={1.7}
                data-icon="inline-end"
              />
            </Button>
          )}
        </div>
        {source && (
          <p className="mt-3 truncate text-xs text-white/45">{source}</p>
        )}
      </div>
    </aside>
  )
}

export { SourcePreview, type SourcePreviewProps }
