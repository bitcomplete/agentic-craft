"use client"

import * as React from "react"
import {
  ArrowExpand01Icon,
  File01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ArtifactDocumentSection = {
  id: string
  title: string
  body: React.ReactNode
  source?: string
  status?: "draft" | "cited" | "needs-source"
}

type ArtifactDocumentMeta = {
  label: string
  value: React.ReactNode
}

type ArtifactDocumentProps = React.ComponentProps<"section"> & {
  title: string
  description: React.ReactNode
  status?: "draft" | "reviewing" | "ready" | "blocked"
  version?: string
  sourceCount?: number
  meta?: ArtifactDocumentMeta[]
  sections: ArtifactDocumentSection[]
  onOpen?: () => void
}

const statusLabels = {
  draft: "Draft",
  reviewing: "Reviewing",
  ready: "Ready",
  blocked: "Blocked",
} satisfies Record<NonNullable<ArtifactDocumentProps["status"]>, string>

const sectionStatusLabels = {
  draft: "Draft",
  cited: "Cited",
  "needs-source": "Needs source",
} satisfies Record<NonNullable<ArtifactDocumentSection["status"]>, string>

function ArtifactDocument({
  title,
  description,
  status = "reviewing",
  version,
  sourceCount,
  meta = [],
  sections,
  onOpen,
  className,
  ...props
}: ArtifactDocumentProps) {
  return (
    <section
      data-slot="artifact-document"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 border-b border-border/70 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <HugeiconsIcon
              icon={File01Icon}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="truncate text-sm font-semibold text-foreground">
              {title}
            </h3>
          </div>
          <p className="mt-2 max-w-[600px] text-xs leading-5 text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge variant={status === "blocked" ? "destructive" : "outline"}>
            {statusLabels[status]}
          </Badge>
          {version && <Badge variant="secondary">{version}</Badge>}
          {onOpen && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpen}
            >
              Open
              <HugeiconsIcon
                icon={ArrowExpand01Icon}
                strokeWidth={1.5}
                data-icon="inline-end"
              />
            </Button>
          )}
        </div>
      </div>

      {(sourceCount !== undefined || meta.length > 0) && (
        <div className="grid border-b border-border/70 text-xs sm:grid-cols-3">
          {sourceCount !== undefined && (
            <div className="border-b border-border/70 px-3 py-2 sm:border-r sm:border-b-0 sm:px-4">
              <p className="text-muted-foreground">Sources</p>
              <p className="mt-1 font-medium text-foreground tabular-nums">
                {sourceCount} linked
              </p>
            </div>
          )}
          {meta.map((item) => (
            <div
              key={item.label}
              className="border-b border-border/70 px-3 py-2 last:border-b-0 sm:border-r sm:border-b-0 sm:px-4 sm:last:border-r-0"
            >
              <p className="text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="divide-y divide-border/70">
        {sections.map((section) => (
          <div
            key={section.id}
            data-slot="artifact-document-section"
            className="grid gap-2 px-3 py-3 sm:grid-cols-[160px_1fr] sm:px-4"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">
                {section.title}
              </p>
              {section.status && (
                <Badge
                  variant={
                    section.status === "needs-source"
                      ? "destructive"
                      : "outline"
                  }
                  className="mt-2"
                >
                  {sectionStatusLabels[section.status]}
                </Badge>
              )}
            </div>
            <div className="min-w-0 text-sm leading-6 text-muted-foreground">
              <div>{section.body}</div>
              {section.source && (
                <p className="mt-2 inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={Link01Icon}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="truncate">{section.source}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export {
  ArtifactDocument,
  type ArtifactDocumentProps,
  type ArtifactDocumentSection,
}
