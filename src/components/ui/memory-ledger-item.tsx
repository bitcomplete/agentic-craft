"use client"

import * as React from "react"
import { Brain01Icon, Clock01Icon, File01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReferenceItem } from "@/components/ui/reference-item"
import { cn } from "@/lib/utils"

type MemoryLedgerItemProps = React.ComponentProps<"div"> & {
  title: string
  value: string
  source: string
  lastUsed: string
  scope: string
  expiry: string
  selected?: boolean
  onInspect?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function MemoryLedgerItem({
  title,
  value,
  source,
  lastUsed,
  scope,
  expiry,
  selected,
  onInspect,
  onEdit,
  onDelete,
  className,
  ...props
}: MemoryLedgerItemProps) {
  return (
    <ReferenceItem.Root
      data-slot="memory-ledger-item"
      className={cn(
        "flex-wrap sm:flex-nowrap",
        selected && "border-foreground/20 bg-muted/25",
        className
      )}
      {...props}
    >
      <ReferenceItem.Media>
        <HugeiconsIcon icon={Brain01Icon} strokeWidth={1.5} />
      </ReferenceItem.Media>
      <ReferenceItem.Content>
        <ReferenceItem.Header>
          <ReferenceItem.Title className="whitespace-normal">
            {value}
          </ReferenceItem.Title>
          <Badge variant="outline">{scope}</Badge>
        </ReferenceItem.Header>
        <ReferenceItem.Description>{title}</ReferenceItem.Description>
        <ReferenceItem.Meta>
          <span className="inline-flex min-w-0 items-center gap-1">
            <HugeiconsIcon icon={File01Icon} size={12} strokeWidth={1.5} />
            <span className="truncate">{source}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={12} strokeWidth={1.5} />
            {lastUsed}
          </span>
          <span>Expires {expiry}</span>
        </ReferenceItem.Meta>
      </ReferenceItem.Content>
      <ReferenceItem.Actions className="ml-11 w-full justify-start sm:ml-0 sm:w-auto sm:justify-end">
        {onInspect && (
          <Button
            type="button"
            onClick={onInspect}
            variant="outline"
            size="xs"
          >
            Inspect
          </Button>
        )}
        {onEdit && (
          <Button
            type="button"
            onClick={onEdit}
            variant="ghost"
            size="xs"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            variant="ghost"
            size="xs"
          >
            Remove
          </Button>
        )}
      </ReferenceItem.Actions>
    </ReferenceItem.Root>
  )
}

export { MemoryLedgerItem, type MemoryLedgerItemProps }
