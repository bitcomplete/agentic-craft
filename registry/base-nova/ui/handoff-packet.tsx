"use client"

import * as React from "react"
import {
  Alert01Icon,
  ArrowRight01Icon,
  Brain01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type HandoffPacketStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"

type HandoffPacketItem = {
  label: React.ReactNode
  value: React.ReactNode
}

type HandoffPacketProps = React.ComponentProps<"section"> & {
  sender: string
  receiver: string
  title: React.ReactNode
  description?: React.ReactNode
  status?: HandoffPacketStatus
  items: HandoffPacketItem[]
  onAccept?: () => void
  onReject?: () => void
}

const statusLabel = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
} satisfies Record<HandoffPacketStatus, string>

const statusVariant = {
  draft: "outline",
  sent: "secondary",
  accepted: "default",
  rejected: "destructive",
  expired: "outline",
} satisfies Record<
  HandoffPacketStatus,
  React.ComponentProps<typeof Badge>["variant"]
>

function HandoffPacket({
  sender,
  receiver,
  title,
  description,
  status = "sent",
  items,
  onAccept,
  onReject,
  className,
  ...props
}: HandoffPacketProps) {
  const showActions = status === "sent" && (onAccept || onReject)

  return (
    <section
      data-slot="handoff-packet"
      className={cn(
        "rounded-lg border border-border bg-background text-sm",
        className
      )}
      {...props}
    >
      <div className="border-b border-border/70 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-sm font-medium text-foreground">
                {title}
              </h3>
              <Badge variant={statusVariant[status]}>
                {statusLabel[status]}
              </Badge>
            </div>
            {description && (
              <p className="mt-1 max-w-[620px] text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {showActions && (
            <div className="flex shrink-0 items-center gap-2">
              {onReject && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onReject}
                >
                  Reject
                </Button>
              )}
              {onAccept && (
                <Button type="button" size="sm" onClick={onAccept}>
                  Accept
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid border-b border-border/70 text-xs sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 items-center gap-2 px-3 py-2 sm:px-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
            <HugeiconsIcon
              icon={Brain01Icon}
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-muted-foreground">Sender</span>
            <span className="block truncate font-medium text-foreground">
              {sender}
            </span>
          </span>
        </div>
        <div className="hidden items-center px-2 text-muted-foreground sm:flex">
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 items-center gap-2 border-t border-border/70 px-3 py-2 sm:border-t-0 sm:px-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
            <HugeiconsIcon
              icon={status === "rejected" ? Alert01Icon : Tick01Icon}
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-muted-foreground">Receiver</span>
            <span className="block truncate font-medium text-foreground">
              {receiver}
            </span>
          </span>
        </div>
      </div>

      <dl className="divide-y divide-border/70">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-1 px-3 py-2 sm:grid-cols-[160px_1fr] sm:gap-4 sm:px-4"
          >
            <dt className="text-xs font-medium text-foreground">
              {item.label}
            </dt>
            <dd className="min-w-0 text-xs leading-5 text-muted-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export {
  HandoffPacket,
  type HandoffPacketItem,
  type HandoffPacketProps,
  type HandoffPacketStatus,
}
