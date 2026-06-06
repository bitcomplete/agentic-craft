"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, File01Icon, Image01Icon } from "@hugeicons/core-free-icons"
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
      className={cn("animate-composer-slide flex gap-2 px-4 pt-3 pb-1", className)}
      {...props}
    >
      {files.map((file) => (
        <div
          key={file.name}
          className="group flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
        >
          <HugeiconsIcon
            icon={FILE_ICONS[file.type]}
            size={14}
            strokeWidth={1.5}
            className="shrink-0 text-muted-foreground"
          />
          <div className="min-w-0">
            <p className="max-w-[140px] truncate text-xs font-medium">
              {file.name}
            </p>
            <p className="text-[10px] text-muted-foreground">{file.size}</p>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(file.name)}
              aria-label={`Remove ${file.name}`}
              className="ml-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
