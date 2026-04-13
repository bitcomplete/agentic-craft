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
  ComposerMentionMenu,
  ComposerShell,
  ComposerBody,
  ComposerInput,
  ComposerFooter,
  ComposerFooterStart,
  ComposerFooterEnd,
  ComposerMenu,
  ComposerContextRing,
  ComposerSend,
  ComposerReply,
  ComposerPlan,
  ComposerAttachments,
  ComposerSuggestions,
} from "@/components/ui/composer"
import type {
  ComposerMention,
  ComposerMentionGroup,
  ComposerFile,
} from "@/components/ui/composer"

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

const INITIAL_SCOPE_MENTIONS: ComposerMention[] = [
  {
    id: "linear",
    label: "Linear",
    icon: (
      <HugeiconsIcon
        icon={ComputerIcon}
        size={11}
        strokeWidth={1.6}
        className="opacity-85"
      />
    ),
    badgeClassName:
      "border-violet-400/18 bg-violet-500/12 text-violet-300 hover:bg-violet-500/12",
    handle: "linear",
  },
  {
    id: "composer-tsx",
    label: "composer.tsx",
    icon: (
      <HugeiconsIcon
        icon={File01Icon}
        size={11}
        strokeWidth={1.6}
        className="opacity-85"
      />
    ),
    badgeClassName:
      "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
    handle: "composer",
  },
]

const MENTION_GROUPS: ComposerMentionGroup[] = [
  {
    id: "plugins",
    label: "Plugins",
    items: [
      {
        id: "plugin-linear",
        label: "Linear",
        description: "Find and reference issues and projects.",
        icon: (
          <HugeiconsIcon
            icon={ComputerIcon}
            size={11}
            strokeWidth={1.65}
            className="text-violet-300"
          />
        ),
        badgeClassName:
          "border-violet-400/18 bg-violet-500/12 text-violet-300 hover:bg-violet-500/12",
        handle: "linear",
        searchValue: "issues projects tracker",
      },
      {
        id: "plugin-figma",
        label: "Figma",
        description: "Design-to-code workflows powered by Figma MCP.",
        icon: (
          <HugeiconsIcon
            icon={Image01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-rose-300"
          />
        ),
        badgeClassName:
          "border-rose-400/18 bg-rose-500/12 text-rose-300 hover:bg-rose-500/12",
        handle: "figma",
        searchValue: "design tokens code connect",
      },
      {
        id: "plugin-github",
        label: "GitHub",
        description: "Triage PRs, issues, CI, and publish flows.",
        icon: (
          <HugeiconsIcon
            icon={Attachment01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-foreground/88"
          />
        ),
        badgeClassName:
          "border-foreground/10 bg-foreground/6 text-foreground/78 hover:bg-foreground/6",
        handle: "github",
        searchValue: "pull requests issues ci actions",
      },
      {
        id: "plugin-notion",
        label: "Notion",
        description: "Notion workflows for specs, research, and docs.",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-amber-300"
          />
        ),
        badgeClassName:
          "border-amber-400/18 bg-amber-500/12 text-amber-300 hover:bg-amber-500/12",
        handle: "notion",
        searchValue: "docs wiki specs research knowledge",
      },
      {
        id: "plugin-build-web-apps",
        label: "Build Web Apps",
        description:
          "Build, review, ship, and scale web apps across UI and infra.",
        icon: (
          <HugeiconsIcon
            icon={Globe02Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/18 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "build-web-apps",
        searchValue: "vercel react deployment payments database",
      },
    ],
  },
  {
    id: "files",
    label: "Files",
    emptyLabel: "Type to search for files",
    hideItemsWhenQueryEmpty: true,
    items: [
      {
        id: "file-composer-app",
        label: "composer",
        description: "app",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-foreground/88"
          />
        ),
        badgeClassName:
          "border-foreground/10 bg-foreground/6 text-foreground/78 hover:bg-foreground/6",
        handle: "composer",
        searchValue: "composer app route page",
      },
      {
        id: "file-composer-css-registry",
        label: "composer.css",
        description: "registry/base-nova/ui",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "composer.css",
        searchValue: "registry base nova ui composer css styles",
      },
      {
        id: "file-composer-css-src",
        label: "composer.css",
        description: "src/components/ui",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "composer.css",
        searchValue: "src components ui composer css styles animation layout",
      },
      {
        id: "file-composer-tsx-registry",
        label: "composer.tsx",
        description: "registry/base-nova/ui",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "composer.tsx",
        searchValue: "registry base nova ui composer tsx react",
      },
      {
        id: "file-composer-tsx-src",
        label: "composer.tsx",
        description: "src/components/ui",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "composer.tsx",
        searchValue: "src components ui composer tsx react root",
      },
      {
        id: "file-composer-json-public",
        label: "composer.json",
        description: "public/r",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "composer.json",
        searchValue: "public r composer json registry",
      },
      {
        id: "file-composer-input-registry",
        label: "composer-input.tsx",
        description: "registry/base-nova/ui",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "composer-input.tsx",
        searchValue: "registry base nova ui composer input tsx react",
      },
      {
        id: "file-composer-input-src",
        label: "composer-input.tsx",
        description: "src/components/ui",
        icon: (
          <HugeiconsIcon
            icon={File01Icon}
            size={11}
            strokeWidth={1.65}
            className="text-sky-300"
          />
        ),
        badgeClassName:
          "border-sky-400/22 bg-sky-500/12 text-sky-300 hover:bg-sky-500/12",
        handle: "composer-input.tsx",
        searchValue: "src components ui composer input tsx contenteditable mention autocomplete",
      },
    ],
  },
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

function DemoFooterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-7 items-center gap-1.5 rounded-full px-1.5 text-[15px] font-medium tracking-[-0.01em] text-foreground/62 transition-colors hover:bg-transparent hover:text-foreground focus-visible:outline-none"
    >
      <span>{label}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 10 6"
        className="h-1.5 w-2.5 text-foreground/42"
        fill="none"
      >
        <path
          d="M1 1.25 5 4.75 9 1.25"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

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

  const [scopeMentions, setScopeMentions] = useState<ComposerMention[]>([])

  const toggle = useCallback((key: keyof FeatureState) => {
    setFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "scopeBanner" && next.scopeBanner) next.replyTo = false
      if (key === "replyTo" && next.replyTo) next.scopeBanner = false
      if (key === "scopeBanner") {
        setScopeMentions(next.scopeBanner ? INITIAL_SCOPE_MENTIONS : [])
      }
      if (key === "replyTo" && next.replyTo) {
        setScopeMentions([])
      }
      return next
    })
  }, [])

  const handleScopeMentionsChange = useCallback(
    (nextMentions: ComposerMention[]) => {
      setScopeMentions(nextMentions)
      setFeatures((prev) => ({
        ...prev,
        scopeBanner: nextMentions.length > 0,
      }))
    },
    []
  )

  const getPlaceholder = () => {
    if (features.replyTo) return PLACEHOLDER_MAP.reply
    if (features.scopeBanner) return PLACEHOLDER_MAP.scope
    return PLACEHOLDER_MAP.default
  }

  return (
    <div
      className={`relative flex flex-col ${showControls ? "min-h-130" : ""}`}
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
                  ? "border-foreground/20 bg-foreground/4 text-foreground"
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

      <Composer
        mentionGroups={MENTION_GROUPS}
        mentions={scopeMentions}
        onMentionsChange={handleScopeMentionsChange}
        onSend={(text) => console.log("send:", text)}
      >
        {(features.plan || features.replyTo) && (
          <ComposerIslands>
            {features.plan && <ComposerPlan tasks={PLAN_TASKS} />}
            {features.replyTo && (
              <ComposerReply onDismiss={() => toggle("replyTo")}>
                {REPLY_QUOTE}
              </ComposerReply>
            )}
          </ComposerIslands>
        )}

        <ComposerMentionMenu />

        <ComposerShell>
          <ComposerBody>
            {features.attachments && (
              <ComposerAttachments
                files={MOCK_ATTACHMENTS}
                onRemove={() => toggle("attachments")}
              />
            )}
            <ComposerInput placeholder={getPlaceholder()} />
          </ComposerBody>

          <ComposerFooter>
            <ComposerFooterStart>
              <ComposerMenu className="size-7 rounded-full bg-transparent p-0 text-foreground/60 shadow-none hover:bg-transparent hover:text-foreground dark:hover:bg-transparent">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Add to message</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => toggle("attachments")}>
                    <HugeiconsIcon
                      icon={File01Icon}
                      size={12}
                      strokeWidth={1.5}
                    />
                    Upload file
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggle("attachments")}>
                    <HugeiconsIcon
                      icon={Image01Icon}
                      size={12}
                      strokeWidth={1.5}
                    />
                    Upload image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={Attachment01Icon}
                      size={12}
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
                      size={12}
                      strokeWidth={1.5}
                    />
                    Add connector
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={Globe02Icon}
                      size={12}
                      strokeWidth={1.5}
                    />
                    Web search
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </ComposerMenu>

              <DemoFooterSelect label="GPT-5.4" />
              <DemoFooterSelect label="Extra High" />
            </ComposerFooterStart>

            <ComposerFooterEnd>
              <ComposerContextRing
                used={66}
                total={75}
                label="66k / 75k tokens"
                className="size-7 rounded-full bg-transparent text-foreground/42 shadow-none hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
              />
              <ComposerSend />
            </ComposerFooterEnd>
          </ComposerFooter>
        </ComposerShell>

        {features.suggestions && <ComposerSuggestions items={SUGGESTIONS} />}
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
