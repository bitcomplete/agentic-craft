"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  File01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
      className={cn("animate-composer-slide flex gap-2 px-4 pt-3 pb-1", className)}
      {...props}
    >
      {files.map((file) => (
        <Card key={file.name} size="sm" className="gap-0 px-3 py-2">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={FILE_ICONS[file.type]}
              size={14}
              strokeWidth={1.5}
            />
            <div className="min-w-0">
              <p className="max-w-[140px] truncate text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{file.size}</p>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onRemove(file.name)}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={12}
                  strokeWidth={1.5}
                />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
