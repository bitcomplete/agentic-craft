"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  File01Icon,
  Image01Icon,
  ReloadIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type FileLifecycleSurface = "idle" | "dragging" | "disabled"
type FileLifecycleStatus =
  | "queued"
  | "validating"
  | "uploading"
  | "uploaded"
  | "rejected"

type FileLifecycleFile = {
  id: string
  name: string
  size?: string
  type?: "file" | "image"
  status: FileLifecycleStatus
  progress?: number
  message?: string
}

const statusVariant: Record<
  FileLifecycleStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  queued: "outline",
  validating: "secondary",
  uploading: "secondary",
  uploaded: "default",
  rejected: "destructive",
}

const statusLabel: Record<FileLifecycleStatus, string> = {
  queued: "Queued",
  validating: "Validating",
  uploading: "Uploading",
  uploaded: "Uploaded",
  rejected: "Rejected",
}

const fileIcon = {
  file: File01Icon,
  image: Image01Icon,
} as const

function FileLifecycleRoot({
  surface = "idle",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  surface?: FileLifecycleSurface
}) {
  return (
    <div
      data-slot="file-lifecycle"
      data-surface={surface}
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background transition-[border-color,background-color,box-shadow]",
        surface === "dragging" &&
          "border-foreground/30 bg-muted/30 shadow-[0_0_0_1px_hsl(var(--border))]",
        surface === "disabled" && "opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function FileLifecycleDropzone({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-lifecycle-dropzone"
      className={cn(
        "flex min-h-0 flex-col items-start justify-center gap-1 p-1.5 text-left text-sm sm:min-h-28 sm:items-center sm:gap-2 sm:p-4 sm:text-center",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <div className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground">
            <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium">Drop files here</p>
            <p className="mt-1 text-muted-foreground">
              Attach source material before sending.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function FileLifecycleList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-lifecycle-list"
      className={cn("flex flex-col border-t border-border/70", className)}
      {...props}
    />
  )
}

function FileLifecycleItem({
  file,
  onRemove,
  onRetry,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  file: FileLifecycleFile
  onRemove?: (file: FileLifecycleFile) => void
  onRetry?: (file: FileLifecycleFile) => void
}) {
  const Icon = fileIcon[file.type ?? "file"]
  const progress = Math.max(0, Math.min(file.progress ?? 0, 100))

  return (
    <div
      data-slot="file-lifecycle-item"
      data-status={file.status}
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-1.5 border-b border-border/70 p-1.5 last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-3 sm:p-3",
        className
      )}
      {...props}
    >
      <div className="hidden size-8 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground sm:flex">
        <HugeiconsIcon icon={Icon} strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-xs font-medium sm:text-sm">
            {file.name}
          </p>
          <Badge
            variant={statusVariant[file.status]}
            className="hidden sm:inline-flex"
          >
            {statusLabel[file.status]}
          </Badge>
        </div>
        {(file.size || file.message) && (
          <p className="truncate text-[11px] leading-snug text-muted-foreground sm:mt-1 sm:text-sm">
            {[file.size, statusLabel[file.status], file.message]
              .filter(Boolean)
              .join(" / ")}
          </p>
        )}
        {file.status === "uploading" && (
          <Progress
            value={progress}
            className="mt-1 sm:mt-2"
            aria-label={file.name}
          />
        )}
      </div>
      <div className="flex items-start gap-1">
        {file.status === "rejected" && onRetry && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="min-h-7! min-w-7!"
            onClick={() => onRetry(file)}
            aria-label={`Retry ${file.name}`}
          >
            <HugeiconsIcon icon={ReloadIcon} strokeWidth={1.5} />
          </Button>
        )}
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="min-h-7! min-w-7!"
            onClick={() => onRemove(file)}
            aria-label={`Remove ${file.name}`}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
          </Button>
        )}
      </div>
    </div>
  )
}

const FileLifecycle = {
  Root: FileLifecycleRoot,
  Dropzone: FileLifecycleDropzone,
  List: FileLifecycleList,
  Item: FileLifecycleItem,
}

export {
  FileLifecycle,
  FileLifecycleRoot,
  FileLifecycleDropzone,
  FileLifecycleList,
  FileLifecycleItem,
  type FileLifecycleSurface,
  type FileLifecycleStatus,
  type FileLifecycleFile,
}
