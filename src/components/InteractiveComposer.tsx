"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01Icon,
  Image01Icon,
  Attachment01Icon,
  Plug01Icon,
  Globe02Icon,
  ComputerIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { PatternControls } from "@/components/pattern-controls"
import { cn } from "@/lib/utils"
import {
  Composer,
  ComposerIslands,
  ComposerCard,
  ComposerInput,
  ComposerToolbar,
  ComposerMenu,
  ComposerContextRing,
  ComposerSend,
  ComposerScope,
  ComposerReply,
  ComposerPlan,
  ComposerSuggestions,
} from "@/components/ui/composer"
import type { ComposerScopeItem } from "@/components/ui/composer"
import {
  FileLifecycle,
  type FileLifecycleFile,
  type FileLifecycleSurface,
} from "@/components/ui/file-lifecycle"

/* ─── Demo Data ─── */

interface FeatureState {
  scopeBanner: boolean
  replyTo: boolean
  plan: boolean
  suggestions: boolean
  attachments: boolean
}

const SUGGESTIONS = [
  "Check launch risks",
  "Compare with previous version",
  "List open findings",
  "Generate summary",
]

const REPLY_QUOTE =
  "The onboarding section references the previous rollout plan — this should be updated before the launch review."

const PLACEHOLDER_MAP: Record<string, string> = {
  default: "Ask about this project…",
  reply: "Reply to this message…",
  scope: "Ask about the selected sources…",
}

const INITIAL_LIFECYCLE_FILES: FileLifecycleFile[] = [
  {
    id: "brief",
    name: "Project_Brief_v3.pdf",
    size: "2.4 MB",
    type: "file",
    status: "uploaded",
    progress: 100,
    message: "Ready",
  },
  {
    id: "timeline",
    name: "Launch_Timeline.png",
    size: "340 KB",
    type: "image",
    status: "uploading",
    progress: 68,
    message: "Scanning",
  },
  {
    id: "duplicate",
    name: "Project_Brief_v2.pdf",
    size: "2.1 MB",
    type: "file",
    status: "rejected",
    message: "Duplicate source",
  },
]

const INITIAL_SCOPE_ITEMS: ComposerScopeItem[] = [
  { id: "brief", label: "Project brief", icon: File01Icon },
  { id: "product", label: "Customer portal", icon: ComputerIcon },
  { id: "policy", label: "Launch guidelines", icon: Shield01Icon },
]

const PLAN_TASKS = [
  {
    label: "Review project brief for missing assumptions and open decisions",
    done: false,
  },
  {
    label: "Compare launch timeline against support and marketing readiness",
    done: false,
  },
  {
    label: "Prepare a concise findings summary for the next planning review",
    done: false,
    dimmed: true,
  },
]

/* ─── Demo Component ─── */

type ComposerDemoPresentation = "playground" | "compact-playground" | "embedded"

const COMPOSER_DEMO_PRESENTATIONS = {
  playground: {
    controls: "full",
    defaultPlan: true,
  },
  "compact-playground": {
    controls: "compact",
    defaultPlan: true,
  },
  embedded: {
    controls: "none",
    defaultPlan: false,
  },
} as const satisfies Record<
  ComposerDemoPresentation,
  {
    controls: "full" | "compact" | "none"
    defaultPlan: boolean
  }
>

function ComposerDemo({
  presentation,
}: {
  presentation: ComposerDemoPresentation
}) {
  const demo = COMPOSER_DEMO_PRESENTATIONS[presentation]
  const controls = demo.controls
  const [features, setFeatures] = useState<FeatureState>(() => ({
    scopeBanner: false,
    replyTo: false,
    plan: demo.defaultPlan,
    suggestions: true,
    attachments: false,
  }))

  const [scopeItems, setScopeItems] =
    useState<ComposerScopeItem[]>(INITIAL_SCOPE_ITEMS)
  const [draft, setDraft] = useState("")
  const [fileSurface, setFileSurface] = useState<FileLifecycleSurface>("idle")
  const [files, setFiles] = useState<FileLifecycleFile[]>([])

  const toggle = useCallback((key: keyof FeatureState) => {
    setFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "scopeBanner" && next.scopeBanner) next.replyTo = false
      if (key === "replyTo" && next.replyTo) next.scopeBanner = false
      if (key === "attachments") {
        setFiles(next.attachments ? INITIAL_LIFECYCLE_FILES : [])
        setFileSurface("idle")
      }
      return next
    })
    if (key === "scopeBanner") setScopeItems(INITIAL_SCOPE_ITEMS)
  }, [])

  const showAttachments = useCallback(() => {
    setFeatures((prev) => ({ ...prev, attachments: true }))
    setFiles(INITIAL_LIFECYCLE_FILES)
    setFileSurface("idle")
  }, [])

  const removeFile = useCallback((file: FileLifecycleFile) => {
    setFiles((prev) => {
      const next = prev.filter((item) => item.id !== file.id)
      if (next.length === 0) {
        setFeatures((current) => ({ ...current, attachments: false }))
      }
      return next
    })
  }, [])

  const retryFile = useCallback((file: FileLifecycleFile) => {
    setFiles((prev) =>
      prev.map((item) =>
        item.id === file.id
          ? {
              ...item,
              status: "queued",
              message: "Ready to retry",
              progress: 0,
            }
          : item
      )
    )
  }, [])

  const addDroppedFile = useCallback(() => {
    setFeatures((prev) => ({ ...prev, attachments: true }))
    setFileSurface("idle")
    setFiles((prev) => {
      if (prev.some((file) => file.id === "dropped-notes")) return prev
      return [
        ...prev,
        {
          id: "dropped-notes",
          name: "Release_Notes.md",
          size: "18 KB",
          type: "file",
          status: "queued",
          message: "Dropped",
        },
      ]
    })
  }, [])

  const removeScopeItem = useCallback((id: string) => {
    setScopeItems((prev) => {
      const next = prev.filter((item) => item.id !== id)
      if (next.length === 0) {
        setFeatures((f) => ({ ...f, scopeBanner: false }))
      }
      return next
    })
  }, [])

  const getPlaceholder = () => {
    if (features.replyTo) return PLACEHOLDER_MAP.reply
    if (features.scopeBanner) return PLACEHOLDER_MAP.scope
    return PLACEHOLDER_MAP.default
  }
  const hasIslands = features.plan || features.scopeBanner || features.replyTo

  return (
    <div
      className={cn(
        "relative flex flex-col",
        controls === "full" ? "min-h-[520px]" : "",
        controls === "compact" ? "gap-1.5 sm:gap-4" : ""
      )}
    >
      {controls !== "none" && (
        <PatternControls
          options={[
            { key: "scopeBanner", label: "Scope" },
            { key: "replyTo", label: "Reply-to" },
            { key: "plan", label: "Plan" },
            { key: "suggestions", label: "Suggestions" },
            { key: "attachments", label: "Attachments" },
          ]}
          active={features}
          onToggle={(key) => toggle(key as keyof FeatureState)}
          showLabel={controls === "full"}
          density={controls === "compact" ? "compact" : "default"}
          className={controls === "compact" ? "w-full pb-0" : "pb-6"}
        />
      )}

      {controls === "full" && <div className="flex-1" />}

      <Composer
        value={draft}
        onValueChange={setDraft}
        canSend={draft.trim().length > 0 || files.length > 0}
        onSend={(text) => {
          console.log("send:", text)
          setFiles([])
          setFeatures((current) => ({ ...current, attachments: false }))
        }}
      >
        {hasIslands && (
          <ComposerIslands>
            {features.plan && <ComposerPlan tasks={PLAN_TASKS} />}
            {features.scopeBanner && (
              <ComposerScope
                items={scopeItems}
                onRemove={removeScopeItem}
                onDismiss={() => toggle("scopeBanner")}
              />
            )}
            {features.replyTo && (
              <ComposerReply onDismiss={() => toggle("replyTo")}>
                {REPLY_QUOTE}
              </ComposerReply>
            )}
          </ComposerIslands>
        )}

        <ComposerCard
          className={
            hasIslands
              ? "rounded-t-none border-t-0 sm:rounded-t-none"
              : undefined
          }
        >
          {features.attachments && (
            <div className="px-1.5 pt-1.5 sm:px-4 sm:pt-3" aria-live="polite">
              <FileLifecycle.Root
                className="border-0 bg-transparent sm:border sm:bg-background"
                surface={fileSurface}
                onDragEnter={(event) => {
                  event.preventDefault()
                  setFileSurface("dragging")
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                  setFileSurface("dragging")
                }}
                onDragLeave={(event) => {
                  if (
                    event.currentTarget.contains(event.relatedTarget as Node)
                  ) {
                    return
                  }
                  setFileSurface("idle")
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  addDroppedFile()
                }}
              >
                <FileLifecycle.Dropzone className="border-b border-border/70 sm:border-b-0">
                  <div className="flex flex-col gap-1 text-left">
                    <p className="text-xs font-medium sm:text-sm">
                      Files attached to this message
                    </p>
                    <p className="hidden text-xs leading-relaxed text-muted-foreground sm:block">
                      Drop another source here, retry rejected files, or remove
                      anything before sending.
                    </p>
                  </div>
                </FileLifecycle.Dropzone>
                <FileLifecycle.List>
                  {files.map((file) => (
                    <FileLifecycle.Item
                      key={file.id}
                      file={file}
                      onRemove={removeFile}
                      onRetry={retryFile}
                    />
                  ))}
                </FileLifecycle.List>
              </FileLifecycle.Root>
            </div>
          )}
          <ComposerInput placeholder={getPlaceholder()} />
          <ComposerToolbar>
            <ComposerMenu>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Add to message</DropdownMenuLabel>
                <DropdownMenuItem onClick={showAttachments}>
                  <HugeiconsIcon icon={File01Icon} strokeWidth={1.5} />
                  Upload file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={showAttachments}>
                  <HugeiconsIcon icon={Image01Icon} strokeWidth={1.5} />
                  Upload image
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Attachment01Icon} strokeWidth={1.5} />
                  Paste from clipboard
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Connect</DropdownMenuLabel>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Plug01Icon} strokeWidth={1.5} />
                  Add connector
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Globe02Icon} strokeWidth={1.5} />
                  Web search
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </ComposerMenu>

            <div className="flex-1" />

            <ComposerContextRing
              used={66}
              total={75}
              label="66k / 75k tokens"
            />
            <ComposerSend />
          </ComposerToolbar>
        </ComposerCard>

        {features.suggestions && <ComposerSuggestions items={SUGGESTIONS} />}
      </Composer>
    </div>
  )
}

export function ComposerPlayground() {
  return <ComposerDemo presentation="playground" />
}

export function CompactComposerPlayground() {
  return <ComposerDemo presentation="compact-playground" />
}

export function EmbeddedComposerDemo() {
  return <ComposerDemo presentation="embedded" />
}

export default ComposerPlayground
