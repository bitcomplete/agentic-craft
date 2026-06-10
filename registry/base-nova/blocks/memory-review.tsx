"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DecisionSurface } from "@/components/ui/decision-surface"
import { MemoryLedgerItem } from "@/components/ui/memory-ledger-item"
import { SourcePreview } from "@/components/ui/source-preview"

function MemoryReviewBlock() {
  const [selected, setSelected] = React.useState("release-tier")

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3 border-l border-border/70 bg-muted/20 px-3 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              Memory review queue
            </p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Proposed memories stay reviewable until source, scope, and expiry
              are clear.
            </p>
          </div>
          <Badge variant="outline">2 proposed</Badge>
        </div>

        <MemoryLedgerItem
          title="Preferred release tier"
          value="enterprise release"
          source="Launch review session"
          lastUsed="proposed"
          scope="Workspace"
          expiry="90 days"
          selected={selected === "release-tier"}
          onInspect={() => setSelected("release-tier")}
          onEdit={() => setSelected("release-tier")}
          onDelete={() => setSelected("release-tier")}
        />
        <MemoryLedgerItem
          title="Default launch policy"
          value="Launch Policy v2"
          source="Project brief v3"
          lastUsed="proposed"
          scope="Project"
          expiry="180 days"
          selected={selected === "policy"}
          onInspect={() => setSelected("policy")}
          onEdit={() => setSelected("policy")}
          onDelete={() => setSelected("policy")}
        />

        <DecisionSurface.Root>
          <DecisionSurface.Trigger render={<Button type="button" size="sm" />}>
            Review memory save
          </DecisionSurface.Trigger>
          <DecisionSurface.Content>
            <DecisionSurface.Header>
              <DecisionSurface.Title>Save this memory?</DecisionSurface.Title>
              <DecisionSurface.Description>
                Saved memory will be reused in matching launch review tasks
                until the expiry period ends or the user removes it.
              </DecisionSurface.Description>
            </DecisionSurface.Header>
            <DecisionSurface.Body>
              <DecisionSurface.ImpactList>
                <DecisionSurface.ImpactItem label="Scope">
                  Workspace
                </DecisionSurface.ImpactItem>
                <DecisionSurface.ImpactItem label="Source">
                  Launch review session
                </DecisionSurface.ImpactItem>
                <DecisionSurface.ImpactItem label="Expiry">
                  90 days
                </DecisionSurface.ImpactItem>
              </DecisionSurface.ImpactList>
            </DecisionSurface.Body>
            <DecisionSurface.Footer>
              <DecisionSurface.Cancel>Deny</DecisionSurface.Cancel>
              <DecisionSurface.Confirm>Save memory</DecisionSurface.Confirm>
            </DecisionSurface.Footer>
          </DecisionSurface.Content>
        </DecisionSurface.Root>
      </div>

      <SourcePreview
        title="Launch review session"
        excerpt="Use enterprise release as the default review tier when checking launch readiness and support coverage."
        location="Message 18"
        source="workspace.internal/review/session"
        index={0}
        total={2}
      />
    </div>
  )
}

export { MemoryReviewBlock }
