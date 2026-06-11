"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp02Icon,
  BrowserIcon,
  File01Icon,
  GitCompareIcon,
  Globe02Icon,
  PlusSignIcon,
  RefreshIcon,
  Shield01Icon,
  ViewSidebarRightIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type ContextualWorkbenchSurfaceStatus =
  | "idle"
  | "active"
  | "review"
  | "blocked"
  | "complete"

type ContextualWorkbenchSurfaceKind =
  | "browser"
  | "artifact"
  | "diff"
  | "source"
  | "custom"

type ContextualWorkbenchSurfaceItem = {
  label: string
  detail: string
  status?: ContextualWorkbenchSurfaceStatus
}

export type ContextualWorkbenchSurface = {
  id: string
  label: string
  title: string
  description?: string
  status?: ContextualWorkbenchSurfaceStatus
  kind?: ContextualWorkbenchSurfaceKind
  icon?: IconSvgElement
  meta?: { label: string; value: string }[]
  items?: ContextualWorkbenchSurfaceItem[]
}

export type ContextualWorkbenchMessage = {
  id: string
  role: "user" | "agent" | "system"
  label: string
  body: React.ReactNode
  timestamp?: string
  duration?: string
  surfaceId?: string
}

export type ContextualWorkbenchProps = React.ComponentProps<"section"> & {
  messages?: ContextualWorkbenchMessage[]
  surfaces?: ContextualWorkbenchSurface[]
  activeSurfaceId?: string
  defaultSurfaceId?: string
  onSurfaceChange?: (surfaceId: string) => void
  renderSurface?: (surface: ContextualWorkbenchSurface) => React.ReactNode
}

const surfaceKindIcon: Record<ContextualWorkbenchSurfaceKind, IconSvgElement> =
  {
    browser: BrowserIcon,
    artifact: File01Icon,
    diff: GitCompareIcon,
    source: Shield01Icon,
    custom: ViewSidebarRightIcon,
  }

const defaultSurfaces: ContextualWorkbenchSurface[] = [
  {
    id: "browser",
    label: "Browser",
    title: "Customer portal preview",
    description: "Inspecting launch readiness.",
    status: "active",
    kind: "browser",
  },
  {
    id: "source",
    label: "Source",
    title: "Launch checklist source",
    description: "Source backing the selected claim.",
    status: "review",
    kind: "source",
    icon: Shield01Icon,
    items: [
      {
        label: "Named owner",
        detail: "Required before enterprise release",
        status: "complete",
      },
      {
        label: "Triage window",
        detail: "72-hour acknowledgment requirement",
        status: "complete",
      },
    ],
  },
  {
    id: "diff",
    label: "Diff",
    title: "Brief update proposal",
    description: "Pending update preview.",
    status: "idle",
    kind: "diff",
    icon: GitCompareIcon,
    items: [
      {
        label: "Support owner",
        detail: "Project-Brief-v3.md",
        status: "idle",
      },
      {
        label: "Source citation",
        detail: "Launch Checklist, Section 4.2",
        status: "idle",
      },
    ],
  },
]

const defaultMessages: ContextualWorkbenchMessage[] = [
  {
    id: "request",
    role: "user",
    label: "Reviewer",
    body: "Check the launch page against the support readiness checklist.",
    timestamp: "09:41",
  },
  {
    id: "agent-browser",
    role: "agent",
    label: "Agent",
    body: "I opened the page and selected the support readiness banner.",
    timestamp: "09:42",
    duration: "27s",
    surfaceId: "browser",
  },
  {
    id: "agent-source",
    role: "agent",
    label: "Agent",
    body: "The checklist requires a named owner and triage window before release.",
    timestamp: "09:43",
    duration: "41s",
    surfaceId: "source",
  },
]

function getSurfaceIcon(surface: ContextualWorkbenchSurface) {
  return surface.icon ?? surfaceKindIcon[surface.kind ?? "custom"]
}

function ContextualWorkbenchMessageRow({
  message,
}: {
  message: ContextualWorkbenchMessage
}) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  return (
    <div className={cn("px-3 py-3", isUser ? "flex justify-end" : "block")}>
      <div
        className={cn(
          "min-w-0",
          isUser && "max-w-[72%] rounded-md bg-muted/40 px-3 py-2 text-right",
          isSystem && "max-w-full"
        )}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>
              {message.duration
                ? `Worked for ${message.duration}`
                : message.label}
            </span>
            {message.timestamp && (
              <span className="tabular-nums">{message.timestamp}</span>
            )}
          </div>
        )}
        <p
          className={cn(
            "text-sm leading-6 text-foreground",
            isUser && "text-xs leading-5",
            isSystem && "text-muted-foreground"
          )}
        >
          {message.body}
        </p>
      </div>
    </div>
  )
}

function ContextualWorkbenchChatPane({
  messages,
}: {
  messages: ContextualWorkbenchMessage[]
}) {
  return (
    <div className="flex h-full min-h-[340px] flex-col bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.map((message) => (
          <ContextualWorkbenchMessageRow key={message.id} message={message} />
        ))}
        <div className="border-b border-border/70 px-3 py-2.5">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left text-xs text-muted-foreground transition-[color] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span>37 previous messages</span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="border-b border-border/70 px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-foreground">1 file changed</span>
            <Button type="button" variant="ghost" size="xs">
              Undo
            </Button>
          </div>
          <div className="divide-y divide-border/70 rounded-md border border-border/70">
            {[["Project-Brief-v3.md", "+3", "-0"]].map(
              ([file, added, removed]) => (
                <div
                  key={file}
                  className="flex items-center justify-between gap-3 px-2 py-1.5 text-xs"
                >
                  <span className="min-w-0 truncate text-muted-foreground">
                    {file}
                  </span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <span className="text-foreground">{added}</span>
                    <span className="text-muted-foreground">{removed}</span>
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border/70 p-2">
        <div className="rounded-lg border border-border/80 bg-muted/20 px-2 py-2">
          <p className="mb-5 text-xs text-muted-foreground">
            Ask for follow-up changes
          </p>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex min-w-0 items-center gap-2">
              <Button type="button" variant="ghost" size="icon-xs">
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  data-icon="inline-start"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="sr-only">Add context</span>
              </Button>
              <span className="truncate">Default permissions</span>
            </div>
            <Button type="button" variant="secondary" size="icon-xs">
              <HugeiconsIcon
                icon={ArrowUp02Icon}
                data-icon="inline-start"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const checklistRows: {
  label: string
  detail: string
  status: "complete" | "pending" | "blocked" | "active"
}[] = [
  {
    label: "Named support owner",
    detail: "Enterprise Release Desk assigned",
    status: "complete",
  },
  {
    label: "Triage window defined",
    detail: "72-hour acknowledgment, 30-day target",
    status: "complete",
  },
  {
    label: "Escalation path documented",
    detail: "Checking against policy requirements",
    status: "active",
  },
  {
    label: "Customer-facing runbook",
    detail: "Not yet published",
    status: "pending",
  },
]

const statusDotClass: Record<(typeof checklistRows)[number]["status"], string> =
  {
    complete: "bg-primary",
    active: "bg-primary/40",
    pending: "bg-muted-foreground/40",
    blocked: "bg-destructive",
  }

function BrowserPreview() {
  return (
    <div className="flex h-full min-h-[260px] flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border/70 px-2 py-1.5 text-[11px] text-muted-foreground">
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={13}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={13}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <HugeiconsIcon
          icon={RefreshIcon}
          size={13}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <HugeiconsIcon
          icon={Globe02Icon}
          size={13}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate">127.0.0.1:4173</span>
      </div>
      <div className="min-h-0 flex-1 bg-background p-8 text-foreground">
        <div className="mx-auto max-w-[520px]">
          <div className="rounded-md border border-border bg-muted/30 p-5">
            <p className="text-sm leading-5 font-semibold text-foreground">
              Launch Checklist: Support Readiness
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              docs.internal/launch/support-readiness
            </p>
            <div className="mt-4 divide-y divide-border/70">
              {checklistRows.map((row) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex items-center justify-between gap-3 px-2 py-2.5",
                    row.status === "active" && "rounded-sm bg-muted"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">
                      {row.label}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {row.detail}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      statusDotClass[row.status]
                    )}
                    aria-label={row.status}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SurfaceRows({ surface }: { surface: ContextualWorkbenchSurface }) {
  return (
    <div className="divide-y divide-border/70">
      {(surface.items ?? []).map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 px-3 py-2"
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">
              {item.label}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {item.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function SourcePreviewBody({
  surface,
}: {
  surface: ContextualWorkbenchSurface
}) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border/70 px-3 py-3">
        <p className="font-serif text-sm leading-6 text-foreground">
          "The product team must establish issue triage procedures, named
          owners, and response timelines before enterprise release."
        </p>
      </div>
      <SurfaceRows surface={surface} />
    </div>
  )
}

function DiffPreview({ surface }: { surface: ContextualWorkbenchSurface }) {
  return (
    <div className="divide-y divide-border/70 font-mono text-xs">
      <div className="px-3 py-2 text-muted-foreground">Project-Brief-v3.md</div>
      <div className="px-3 py-2 text-muted-foreground">
        @@ launch-readiness/support @@
      </div>
      <div className="px-3 py-2 text-foreground">
        + Support owner: Enterprise Release Desk
      </div>
      <div className="px-3 py-2 text-foreground">
        + Triage window: 72-hour acknowledgment, 30-day target
      </div>
      <div className="px-3 py-2 text-foreground">
        + Source: Launch Checklist, Section 4.2
      </div>
      <div className="font-sans">
        <SurfaceRows surface={surface} />
      </div>
    </div>
  )
}

function DefaultSurfaceBody({
  surface,
}: {
  surface: ContextualWorkbenchSurface
}) {
  if (surface.kind === "browser") {
    return <BrowserPreview />
  }

  if (surface.kind === "source") {
    return <SourcePreviewBody surface={surface} />
  }

  if (surface.kind === "diff") {
    return <DiffPreview surface={surface} />
  }

  return (
    <div className="px-3 py-4 text-sm leading-6 text-muted-foreground">
      {surface.description}
    </div>
  )
}

function ContextualWorkbenchSurfacePane({
  surface,
  surfaces,
  onSurfaceSelect,
  renderSurface,
}: {
  surface: ContextualWorkbenchSurface
  surfaces: ContextualWorkbenchSurface[]
  onSurfaceSelect: (surfaceId: string) => void
  renderSurface?: (surface: ContextualWorkbenchSurface) => React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-[340px] flex-col bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-2 py-1.5">
        <Tabs
          aria-label="Select workbench surface"
          value={surface.id}
          onValueChange={onSurfaceSelect}
          className="min-w-0 flex-1 gap-0"
        >
          <TabsList variant="line" className="h-6 min-w-0 gap-0 p-0">
            {surfaces.map((candidate) => (
              <TabsTrigger
                key={candidate.id}
                value={candidate.id}
                aria-label={`Show ${candidate.title}`}
                className="h-6 flex-none px-2 text-xs"
              >
                <HugeiconsIcon
                  icon={getSurfaceIcon(candidate)}
                  data-icon="inline-start"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {candidate.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button type="button" variant="ghost" size="icon-xs">
          <HugeiconsIcon
            icon={PlusSignIcon}
            data-icon="inline-start"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="sr-only">Add workbench surface</span>
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 overflow-y-auto">
        {renderSurface ? (
          renderSurface(surface)
        ) : (
          <DefaultSurfaceBody surface={surface} />
        )}
      </div>
    </div>
  )
}

export function ContextualWorkbench({
  className,
  messages = defaultMessages,
  surfaces = defaultSurfaces,
  activeSurfaceId,
  defaultSurfaceId,
  onSurfaceChange,
  renderSurface,
  ...props
}: ContextualWorkbenchProps) {
  const firstSurfaceId = surfaces[0]?.id ?? ""
  const [internalSurfaceId, setInternalSurfaceId] = React.useState(
    defaultSurfaceId ?? firstSurfaceId
  )
  const [mobileView, setMobileView] = React.useState<"chat" | "workbench">(
    "chat"
  )
  const selectedSurfaceId = activeSurfaceId ?? internalSurfaceId
  const activeSurface =
    surfaces.find((surface) => surface.id === selectedSurfaceId) ?? surfaces[0]

  const selectSurface = React.useCallback(
    (surfaceId: string) => {
      if (!activeSurfaceId) {
        setInternalSurfaceId(surfaceId)
      }
      setMobileView("workbench")
      onSurfaceChange?.(surfaceId)
    },
    [activeSurfaceId, onSurfaceChange]
  )

  if (!activeSurface) {
    return null
  }

  return (
    <section
      data-slot="contextual-workbench"
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className
      )}
      {...props}
    >
      <div className="hidden md:block">
        <ResizablePanelGroup orientation="horizontal" className="h-[540px]">
          <ResizablePanel defaultSize="52%" minSize="38%">
            <ContextualWorkbenchChatPane messages={messages} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="48%" minSize="34%">
            <ContextualWorkbenchSurfacePane
              surface={activeSurface}
              surfaces={surfaces}
              onSurfaceSelect={selectSurface}
              renderSurface={renderSurface}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="md:hidden">
        <div className="border-b border-border/70 px-3 py-2">
          <div className="flex justify-end">
            <ToggleGroup
              aria-label="Switch contextual workbench view"
              multiple
              value={[mobileView]}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value.at(-1) : value
                if (next === "chat" || next === "workbench") {
                  setMobileView(next)
                }
              }}
              spacing={1}
              size="sm"
            >
              <ToggleGroupItem value="chat" aria-label="Show chat">
                Chat
              </ToggleGroupItem>
              <ToggleGroupItem value="workbench" aria-label="Show workbench">
                Surface
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        {mobileView === "chat" ? (
          <ContextualWorkbenchChatPane messages={messages} />
        ) : (
          <ContextualWorkbenchSurfacePane
            surface={activeSurface}
            surfaces={surfaces}
            onSurfaceSelect={selectSurface}
            renderSurface={renderSurface}
          />
        )}
      </div>
    </section>
  )
}
