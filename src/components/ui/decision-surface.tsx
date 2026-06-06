"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContentClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function DecisionSurfaceRoot({
  ...props
}: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />
}

function DecisionSurfaceTrigger({
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />
}

function DecisionSurfaceContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      data-slot="decision-surface-content"
      className={cn("sm:max-w-lg", className)}
      {...props}
    >
      <DialogContentClose />
      {children}
    </DialogContent>
  )
}

function DecisionSurfaceHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  return (
    <DialogHeader
      data-slot="decision-surface-header"
      className={cn("pr-8", className)}
      {...props}
    />
  )
}

function DecisionSurfaceTitle({
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return <DialogTitle {...props} />
}

function DecisionSurfaceDescription({
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return <DialogDescription {...props} />
}

function DecisionSurfaceBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="decision-surface-body"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function DecisionSurfaceImpactList({
  className,
  ...props
}: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="decision-surface-impact-list"
      className={cn(
        "grid grid-cols-[minmax(96px,0.45fr)_1fr] gap-x-4 gap-y-2 rounded-lg border border-border/70 p-3 text-sm",
        className
      )}
      {...props}
    />
  )
}

function DecisionSurfaceImpactItem({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-foreground">{children}</dd>
    </>
  )
}

function DecisionSurfaceFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  return <DialogFooter className={cn("mt-1", className)} {...props} />
}

function DecisionSurfaceCancel({
  children = "Cancel",
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  return (
    <DialogClose render={<Button variant="outline" />} {...props}>
      {children}
    </DialogClose>
  )
}

function DecisionSurfaceConfirm({
  variant = "default",
  children = "Confirm",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button variant={variant} {...props}>
      {children}
    </Button>
  )
}

const DecisionSurface = {
  Root: DecisionSurfaceRoot,
  Trigger: DecisionSurfaceTrigger,
  Content: DecisionSurfaceContent,
  Header: DecisionSurfaceHeader,
  Title: DecisionSurfaceTitle,
  Description: DecisionSurfaceDescription,
  Body: DecisionSurfaceBody,
  ImpactList: DecisionSurfaceImpactList,
  ImpactItem: DecisionSurfaceImpactItem,
  Footer: DecisionSurfaceFooter,
  Cancel: DecisionSurfaceCancel,
  Confirm: DecisionSurfaceConfirm,
}

export {
  DecisionSurface,
  DecisionSurfaceRoot,
  DecisionSurfaceTrigger,
  DecisionSurfaceContent,
  DecisionSurfaceHeader,
  DecisionSurfaceTitle,
  DecisionSurfaceDescription,
  DecisionSurfaceBody,
  DecisionSurfaceImpactList,
  DecisionSurfaceImpactItem,
  DecisionSurfaceFooter,
  DecisionSurfaceCancel,
  DecisionSurfaceConfirm,
}
