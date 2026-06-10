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
        detail: "Launch Checklist, Page 14",
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
      <div className="min-h-0 flex-1 bg-[#f5f3ea] p-8 text-[#222222]">
        <div className="mx-auto flex h-full max-w-[520px] items-center justify-center gap-5">
          <div className="w-[42%] rounded-md bg-[#fffdf7] p-4 shadow-sm ring-1 ring-black/5">
            <p className="text-[10px] font-medium tracking-wide uppercase opacity-60">
              Team plan
            </p>
            <div className="mt-2 flex items-baseline justify-between gap-3">
              <p className="text-2xl font-semibold tracking-tight">Growth</p>
              <p className="text-lg font-semibold">$29</p>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-xs opacity-70">
              <span>10 seats included</span>
              <span>Usage dashboard</span>
              <span>Email support</span>
            </div>
          </div>
          <div className="w-[52%] rounded-md bg-[#fffdf7] p-4 shadow-sm ring-1 ring-black/5">
            <p className="text-[10px] font-medium tracking-wide uppercase opacity-60">
              Usage preview
            </p>
            <p className="text-lg font-semibold tracking-tight">
              Monthly units
            </p>
            <div className="mt-4 flex h-36 items-end gap-3 rounded-md border border-black/10 bg-[#fbf8ef] p-3">
              {[42, 76, 64, 58].map((height, index) => (
                <div
                  key={height}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className={cn(
                      "w-full rounded-sm bg-[#2f7d72]",
                      index === 1 && "bg-[#cf6956]",
                      index === 2 && "bg-[#e4b43f]"
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] opacity-60">
                    {["Jan", "Feb", "Mar", "Apr"][index]}
                  </span>
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
        + Source: Launch Checklist, Page 14
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
