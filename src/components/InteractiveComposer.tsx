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
  ComposerAttachments,
  ComposerSuggestions,
} from "@/components/ui/composer"
import type { ComposerScopeItem, ComposerFile } from "@/components/ui/composer"

/* ─── Demo Data ─── */

interface FeatureState {
  scopeBanner: boolean
  replyTo: boolean
  plan: boolean
  suggestions: boolean
  attachments: boolean
}

const SUGGESTIONS = [
  "Review this PR",
  "Summarize release risks",
  "List open issues",
  "Draft a handoff note",
]

const REPLY_QUOTE =
  "The schema migration still runs on every preview deployment — we should move it to the release job before rolling this out further."

const PLACEHOLDER_MAP: Record<string, string> = {
  default: "Ask about this project...",
  reply: "Reply to this message...",
  scope: "Ask about this release...",
}

const MOCK_ATTACHMENTS: ComposerFile[] = [
  { name: "checkout-redesign-spec.md", size: "2.4 MB", type: "file" },
  { name: "pricing-page-v2.png", size: "340 KB", type: "image" },
]

const INITIAL_SCOPE_ITEMS: ComposerScopeItem[] = [
  { id: "release", label: "Spring release", icon: File01Icon },
  { id: "repo", label: "web-app repo", icon: ComputerIcon },
  { id: "design", label: "pricing revamp", icon: Shield01Icon },
]

const PLAN_TASKS = [
  {
    label:
      "Patch PR1 branch for API formatting and webapp compile compatibility, then verify local checks",
    done: false,
  },
  {
    label:
      "Patch PR2-specific formatting or backend issues and verify local checks",
    done: false,
  },
  {
    label:
      "Restack PR3 on top, run targeted verification, and push updated branches",
    done: false,
    dimmed: true,
  },
]

/* ─── Demo Component ─── */

export default function InteractiveComposer({
  showControls = true,
}: {
  showControls?: boolean
}) {
  const [features, setFeatures] = useState<FeatureState>({
    scopeBanner: false,
    replyTo: false,
    plan: false,
    suggestions: true,
    attachments: false,
  })

  const [scopeItems, setScopeItems] =
    useState<ComposerScopeItem[]>(INITIAL_SCOPE_ITEMS)

  const toggle = useCallback((key: keyof FeatureState) => {
    setFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "scopeBanner" && next.scopeBanner) next.replyTo = false
      if (key === "replyTo" && next.replyTo) next.scopeBanner = false
      return next
    })
    if (key === "scopeBanner") setScopeItems(INITIAL_SCOPE_ITEMS)
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

  return (
    <div
      className={`relative flex flex-col ${showControls ? "min-h-[520px]" : ""}`}
    >
      {showControls && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-6">
          <span className="section-label mr-1">Controls</span>
          {(
            [
              ["scopeBanner", "Scope"],
              ["replyTo", "Reply-to"],
              ["plan", "Plan"],
              ["suggestions", "Suggestions"],
              ["attachments", "Attachments"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`relative rounded-md border px-2.5 py-1 text-xs transition-all duration-200 ${
                features[key]
                  ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              } `}
            >
              {label}
              {features[key] && (
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
              )}
            </button>
          ))}
        </div>
      )}

      {showControls && <div className="flex-1" />}

      <Composer onSend={(text) => console.log("send:", text)}>
        {(features.plan || features.scopeBanner || features.replyTo) && (
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

        <ComposerCard>
          {features.attachments && (
            <ComposerAttachments
              files={MOCK_ATTACHMENTS}
              onRemove={() => toggle("attachments")}
            />
          )}
          <ComposerInput placeholder={getPlaceholder()} />
          <ComposerToolbar>
            <ComposerMenu>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Add to message</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => toggle("attachments")}>
                  <HugeiconsIcon
                    icon={File01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                  Upload file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggle("attachments")}>
                  <HugeiconsIcon
                    icon={Image01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                  Upload image
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Attachment01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                  Paste from clipboard
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Connect</DropdownMenuLabel>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Plug01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                  Add connector
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Globe02Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
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

        {features.suggestions && (
          <ComposerSuggestions items={SUGGESTIONS} />
        )}
      </Composer>

      {showControls && (
        <div className="mt-3 mb-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] text-muted-foreground/40">
          <span>Type to auto-expand</span>
          <span>Enter to send</span>
          <span>Shift+Enter for newline</span>
          <span>Click suggestions to fill</span>
        </div>
      )}
    </div>
  )
}
