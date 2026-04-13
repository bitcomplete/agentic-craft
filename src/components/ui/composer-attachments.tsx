"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  File01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ComposerFile } from "./composer"

const FILE_ICONS = {
  file: File01Icon,
  image: Image01Icon,
} as const

export function ComposerAttachments({
  files,
  onRemove,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  files: ComposerFile[]
  onRemove?: (name: string) => void
}) {
  if (files.length === 0) return null

  return (
    <div
      data-slot="composer-attachments"
      className={cn("animate-composer-slide flex flex-wrap gap-2", className)}
      {...props}
    >
      {files.map((file) => (
        <div
          key={file.name}
          className={cn(
            "flex items-center gap-2 rounded-[calc(var(--composer-inner-radius)-var(--radius-sm))] border border-border/60 bg-background/80 px-2.5 py-1 shadow-xs"
          )}
        >
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={FILE_ICONS[file.type]}
              size={14}
              strokeWidth={1.5}
            />
            <div className="min-w-0">
              <p className="max-w-35 truncate text-sm">{file.name}</p>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onRemove(file.name)}
                className="rounded-[calc(var(--composer-control-radius)-var(--radius-sm))]"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={12}
                  strokeWidth={1.5}
                />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
