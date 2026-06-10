"use client"

import * as React from "react"
import { Shield01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  StatusIndicator,
  type StatusIndicatorStatus,
} from "@/components/ui/status-indicator"
import { cn } from "@/lib/utils"

type EffectivePolicy = {
  label: string
  value: React.ReactNode
  description?: React.ReactNode
  status?: "required" | "review" | "allowed" | "blocked"
}

type EffectivePolicyPreviewProps = React.ComponentProps<"div"> & {
  title?: string
  policies: EffectivePolicy[]
}

const statusLabel = {
  required: "Required",
  review: "Review",
  allowed: "Allowed",
  blocked: "Blocked",
} satisfies Record<NonNullable<EffectivePolicy["status"]>, string>

const policyIndicatorStatus = {
  required: "warning",
  review: "pending",
  allowed: "complete",
  blocked: "error",
} satisfies Record<
  NonNullable<EffectivePolicy["status"]>,
  StatusIndicatorStatus
>

function EffectivePolicyPreview({
  title = "Effective policy",
  policies,
  className,
  ...props
}: EffectivePolicyPreviewProps) {
  return (
    <div
      data-slot="effective-policy-preview"
      className={cn("rounded-lg border border-border/60 p-4", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={Shield01Icon}
          size={14}
          strokeWidth={1.5}
          className="text-muted-foreground"
          aria-hidden="true"
        />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-border/50">
        {policies.map((policy) => (
          <div
            key={policy.label}
            className="grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-start"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {policy.label}
            </p>
            <div className="min-w-0">
              <div className="text-sm leading-5 break-words text-foreground">
                {policy.value}
              </div>
              {policy.description && (
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {policy.description}
                </p>
              )}
            </div>
            {policy.status && (
              <span className="flex items-center gap-1.5">
                <StatusIndicator
                  status={policyIndicatorStatus[policy.status]}
                  label={statusLabel[policy.status]}
                />
                <span className="text-xs text-muted-foreground">
                  {statusLabel[policy.status]}
                </span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export {
  EffectivePolicyPreview,
  type EffectivePolicy,
  type EffectivePolicyPreviewProps,
}
