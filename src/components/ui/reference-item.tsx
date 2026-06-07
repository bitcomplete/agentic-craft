"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function ReferenceItemRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="reference-item"
      className={cn(
        "group/reference-item flex min-w-0 items-start gap-3 rounded-lg border border-border/60 bg-background p-3 text-sm transition-[border-color,background-color,box-shadow] hover:border-border hover:bg-muted/20",
        className
      )}
      {...props}
    />
  )
}

function ReferenceItemMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="reference-item-media"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/40 text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ReferenceItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="reference-item-content"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  )
}

function ReferenceItemHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="reference-item-header"
      className={cn("flex min-w-0 items-start justify-between gap-3", className)}
      {...props}
    />
  )
}

function ReferenceItemTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="reference-item-title"
      className={cn("min-w-0 truncate font-medium text-foreground", className)}
      {...props}
    />
  )
}

function ReferenceItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="reference-item-description"
      className={cn(
        "mt-1 text-sm leading-5 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ReferenceItemMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="reference-item-meta"
      className={cn(
        "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ReferenceItemActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="reference-item-actions"
      className={cn(
        "flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-focus-within/reference-item:opacity-100 sm:group-hover/reference-item:opacity-100",
        className
      )}
      {...props}
    />
  )
}

const ReferenceItem = {
  Root: ReferenceItemRoot,
  Media: ReferenceItemMedia,
  Content: ReferenceItemContent,
  Header: ReferenceItemHeader,
  Title: ReferenceItemTitle,
  Description: ReferenceItemDescription,
  Meta: ReferenceItemMeta,
  Actions: ReferenceItemActions,
}

export {
  ReferenceItem,
  ReferenceItemRoot,
  ReferenceItemMedia,
  ReferenceItemContent,
  ReferenceItemHeader,
  ReferenceItemTitle,
  ReferenceItemDescription,
  ReferenceItemMeta,
  ReferenceItemActions,
}
