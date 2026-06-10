"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  File01Icon,
  Image01Icon,
  Alert01Icon,
  Loading03Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import type { ComposerFile } from "./composer"

const FILE_ICONS = {
  file: File01Icon,
  image: Image01Icon,
} as const

export type ComposerAttachmentFile = Omit<ComposerFile, "size" | "type"> & {
  id: string
  size?: string
  type?: "file" | "image"
  status: "queued" | "validating" | "uploading" | "uploaded" | "rejected"
  progress?: number
  message?: string
}

export function ComposerAttachments({
  files,
  onRemove,
  onRetry,
  surface = "idle",
  onDropFile,
  onSurfaceChange,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  files: ComposerAttachmentFile[]
  onRemove?: (file: ComposerAttachmentFile) => void
  onRetry?: (file: ComposerAttachmentFile) => void
  surface?: "idle" | "dragging" | "disabled"
  onDropFile?: () => void
  onSurfaceChange?: (surface: "idle" | "dragging" | "disabled") => void
}) {
  if (files.length === 0) return null

  return (
    <div
      data-slot="composer-attachments"
      className={cn(
        "animate-composer-slide flex flex-wrap gap-1.5 px-2 pt-1.5 pb-0 transition-[background-color,box-shadow] sm:px-3 sm:pt-2",
        surface === "dragging" &&
          "bg-muted/45 shadow-[inset_0_0_0_1px_var(--color-border)]",
        className
      )}
      onDragEnter={(event) => {
        event.preventDefault()
        onSurfaceChange?.("dragging")
      }}
      onDragOver={(event) => {
        event.preventDefault()
        onSurfaceChange?.("dragging")
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return
        onSurfaceChange?.("idle")
      }}
      onDrop={(event) => {
        event.preventDefault()
        onSurfaceChange?.("idle")
        onDropFile?.()
      }}
      aria-live="polite"
      {...props}
    >
      {files.map((file) => (
        <span
          key={file.id}
          className={cn(
            "group inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-xs",
            file.status === "rejected" ? "text-destructive" : "text-foreground"
          )}
        >
          <HugeiconsIcon
            icon={FILE_ICONS[file.type ?? "file"]}
            size={12}
            strokeWidth={1.5}
            className="shrink-0 text-muted-foreground"
          />
          <span className="max-w-[150px] truncate font-medium">
            {file.name}
          </span>
          {file.status === "uploading" ? (
            <HugeiconsIcon
              icon={Loading03Icon}
              size={11}
              strokeWidth={1.5}
              className="shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : file.status === "rejected" ? (
            <HugeiconsIcon
              icon={Alert01Icon}
              size={11}
              strokeWidth={1.5}
              className="shrink-0"
              aria-hidden="true"
            />
          ) : (
            <HugeiconsIcon
              icon={Tick01Icon}
              size={11}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <span className="text-muted-foreground">
            {file.status === "uploading"
              ? `${file.progress}%`
              : (file.message ?? file.size)}
          </span>
          {file.status === "rejected" && onRetry && (
            <button
              type="button"
              data-compact-touch
              onClick={() => onRetry(file)}
              aria-label={`Retry ${file.name}`}
              className="rounded-sm font-medium text-foreground underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              Retry
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              data-compact-touch
              onClick={() => onRemove(file)}
              aria-label={`Remove ${file.name}`}
              className="shrink-0 text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
            </button>
          )}
        </span>
      ))}
    </div>
  )
}
