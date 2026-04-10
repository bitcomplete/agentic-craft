"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useLayoutEffect, useMemo, useState } from "react"
import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  BubbleChatIcon,
  ZapIcon,
  Shield01Icon,
  Brain01Icon,
  GridIcon,
  Activity01Icon,
  DashboardSpeed01Icon,
  ArrowDown01Icon,
  LeftToRightListBulletIcon,
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  scrollHashIntoView,
  scrollPageContentToTop,
  useCurrentHash,
} from "@/components/hash-scroll-handler"

type NavSub = {
  title: string
  id: string
}

type NavItem = {
  title: string
  path: string
  icon: IconSvgElement
  subs?: NavSub[]
  anchorId?: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Overview",
        path: "/",
        icon: Home01Icon,
      },
    ],
  },
  {
    label: "Pattern Reference",
    items: [
      {
        title: "Composer",
        path: "/composer",
        icon: BubbleChatIcon,
        subs: [
          { title: "Demo", id: "demo" },
          { title: "Anatomy", id: "anatomy" },
          { title: "States", id: "states" },
          { title: "Composition", id: "composition" },
          { title: "Implementation", id: "implementation" },
        ],
      },
      {
        title: "Thread Timeline",
        path: "/thread-timeline",
        icon: LeftToRightListBulletIcon,
        subs: [
          { title: "Demo", id: "demo" },
          { title: "Visual Specs", id: "specs" },
        ],
      },
      {
        title: "Approval Gate",
        path: "/approval-gate",
        icon: Shield01Icon,
      },
      {
        title: "Activity Timeline",
        path: "/activity-timeline",
        icon: Activity01Icon,
      },
      {
        title: "Audit Trail",
        path: "/audit-trail",
        icon: DashboardSpeed01Icon,
      },
    ],
  },
  {
    label: "Research Lenses",
    items: [
      {
        title: "Conversation",
        path: "/conversation",
        icon: BubbleChatIcon,
        subs: [
          { title: "Messages & Prose", id: "messages" },
          { title: "Citations", id: "citations" },
          { title: "Thinking Blocks", id: "thinking" },
          { title: "Composer in context", id: "composer" },
        ],
      },
      {
        title: "Actions",
        path: "/actions",
        icon: ZapIcon,
        subs: [
          { title: "Tool Calls", id: "tool-calls" },
          { title: "Subagent Cards", id: "subagents" },
          { title: "Parallel Execution", id: "parallel" },
          { title: "Plan Cards", id: "plans" },
          { title: "Decision Blocks", id: "decisions" },
          { title: "Ask Blocks", id: "ask-blocks" },
          { title: "Approval Gate", id: "approval-gate" },
        ],
      },
      {
        title: "Trust & Governance",
        path: "/trust",
        icon: Shield01Icon,
        subs: [
          { title: "Autonomy Level", id: "autonomy-level" },
          { title: "Mode Toggles", id: "mode-toggles" },
          { title: "Context Scope", id: "context-scope" },
          { title: "Consent Flow", id: "consent-flow" },
          { title: "Confidence Display", id: "confidence-display" },
          { title: "Kill Switch", id: "kill-switch" },
          { title: "Cost Transparency", id: "cost-transparency" },
          { title: "Data Provenance", id: "data-provenance" },
          { title: "Audit Trail", id: "audit-trail" },
        ],
      },
      {
        title: "Memory & Knowledge",
        path: "/memory",
        icon: Brain01Icon,
        subs: [
          { title: "Memory Panel", id: "memory-panel" },
          { title: "Memory Entry CRUD", id: "memory-crud" },
          { title: "Auto-Memory", id: "auto-memory" },
          { title: "Context Ring", id: "context-ring" },
          { title: "Privacy Controls", id: "privacy-controls" },
        ],
      },
      {
        title: "Multi-Agent",
        path: "/multi-agent",
        icon: GridIcon,
        subs: [
          { title: "Agent Cards", id: "agent-cards" },
          { title: "Handoff Flow", id: "handoff-flow" },
          { title: "Parallel Agents", id: "parallel-agents" },
          { title: "Agent Routing", id: "agent-routing" },
          { title: "Agent Communication", id: "agent-communication" },
        ],
      },
      {
        title: "Feedback",
        path: "/feedback",
        icon: Activity01Icon,
        subs: [
          { title: "Thumbs Feedback", id: "thumbs-feedback" },
          { title: "Inline Correction", id: "inline-correction" },
          { title: "Rating Scale", id: "rating-scale" },
          { title: "Behavioral Consequence", id: "behavioral-consequence" },
          { title: "Feedback History", id: "feedback-history" },
        ],
      },
      {
        title: "Observability",
        path: "/observability",
        icon: DashboardSpeed01Icon,
        subs: [
          { title: "Activity Timeline", id: "activity-timeline" },
          { title: "Token Usage", id: "token-usage" },
          { title: "Session Timeline", id: "session-timeline" },
          { title: "Error Log", id: "error-log" },
        ],
      },
    ],
  },
  {
    label: "Composed Flows",
    items: [
      {
        title: "Release Review",
        path: "/",
        icon: Activity01Icon,
        anchorId: "featured-flow",
      },
    ],
  },
]

function normalizeHash(idOrHash?: string) {
  if (!idOrHash) {
    return ""
  }

  return idOrHash.startsWith("#") ? idOrHash : `#${idOrHash}`
}

function buildHref(path: string, hash?: string) {
  return hash ? `${path}${normalizeHash(hash)}` : path
}

function buildNavGroupId(label: string) {
  return `sidebar-group-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`
}

export function AppSidebar() {
  const pathname = usePathname()
  const currentHash = useCurrentHash()
  const { isMobile, setOpenMobile } = useSidebar()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const sectionPaths = useMemo(
    () =>
      new Set(
        navGroups.flatMap((group) =>
          group.items
            .filter((item) => item.subs?.length)
            .map((item) => item.path),
        ),
      ),
    [],
  )

  const navHashesByPath = useMemo(() => {
    const hashesByPath = new Map<string, Set<string>>()

    for (const group of navGroups) {
      for (const item of group.items) {
        const hashes = hashesByPath.get(item.path) ?? new Set<string>()

        if (item.anchorId) {
          hashes.add(normalizeHash(item.anchorId))
        }

        item.subs?.forEach((sub) => {
          hashes.add(normalizeHash(sub.id))
        })

        if (hashes.size > 0) {
          hashesByPath.set(item.path, hashes)
        }
      }
    }

    return hashesByPath
  }, [])

  useLayoutEffect(() => {
    if (!sectionPaths.has(pathname)) {
      return
    }

    setOpenItems((current) => {
      if (current[pathname] === true) {
        return current
      }

      return { ...current, [pathname]: true }
    })
  }, [pathname, sectionPaths])

  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  const handleLinkClick = useCallback(
    (href: string) => () => {
      closeMobileSidebar()

      const [targetPathname, targetHashSegment] = href.split("#")
      const resolvedPathname = targetPathname || pathname
      const targetHash = normalizeHash(targetHashSegment)

      if (resolvedPathname !== pathname) {
        return
      }

      if (targetHash) {
        if (targetHash !== currentHash) {
          return
        }

        scrollHashIntoView(targetHash)
        return
      }

      requestAnimationFrame(() => {
        scrollPageContentToTop()
      })
    },
    [closeMobileSidebar, currentHash, pathname],
  )

  const isItemActive = useCallback(
    (item: NavItem) => {
      if (pathname !== item.path) {
        return false
      }

      if (item.anchorId) {
        return currentHash === normalizeHash(item.anchorId)
      }

      const itemHashes = navHashesByPath.get(item.path)
      if (!item.subs?.length && currentHash && itemHashes?.has(currentHash)) {
        return false
      }

      return true
    },
    [navHashesByPath, currentHash, pathname],
  )

  const getItemAriaCurrent = useCallback(
    (item: NavItem) => {
      if (pathname !== item.path) {
        return undefined
      }

      if (item.anchorId) {
        return currentHash === normalizeHash(item.anchorId)
          ? "location"
          : undefined
      }

      if (item.subs?.length) {
        const isSubLocationActive = item.subs.some(
          (sub) => currentHash === normalizeHash(sub.id),
        )

        return isSubLocationActive ? undefined : "page"
      }

      const itemHashes = navHashesByPath.get(item.path)
      if (currentHash && itemHashes?.has(currentHash)) {
        return undefined
      }

      return "page"
    },
    [navHashesByPath, currentHash, pathname],
  )

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="truncate text-sm font-semibold tracking-tight">
            Agentic Craft
          </span>
          <SidebarTrigger className="ml-auto h-7 w-7 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Primary navigation" className="flex min-h-0 flex-1 flex-col">
          {navGroups.map((group) => {
            const groupLabelId = buildNavGroupId(group.label)

            return (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel id={groupLabelId}>{group.label}</SidebarGroupLabel>
                <SidebarMenu aria-labelledby={groupLabelId}>
                  {group.items.map((item) => {
                    const key = `${group.label}:${item.title}`
                    const hasSubs = Boolean(item.subs?.length)
                    const isRouteActive = pathname === item.path
                    const itemAriaCurrent = getItemAriaCurrent(item)

                    if (!hasSubs) {
                      const href = buildHref(item.path, item.anchorId)

                      return (
                        <SidebarMenuItem key={key}>
                          <SidebarMenuButton
                            render={
                              <Link
                                href={href}
                                scroll={false}
                                onClick={handleLinkClick(href)}
                                aria-current={itemAriaCurrent}
                              />
                            }
                            isActive={isItemActive(item)}
                          >
                            <HugeiconsIcon
                              icon={item.icon}
                              size={16}
                              strokeWidth={1.5}
                            />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    }

                    const isOpen = openItems[item.path] ?? isRouteActive

                    return (
                      <SidebarMenuItem key={key}>
                        <Collapsible
                          open={isOpen}
                          onOpenChange={(open) => {
                            setOpenItems((current) => ({
                              ...current,
                              [item.path]: open,
                            }))
                          }}
                        >
                          <SidebarMenuButton
                            render={
                              <Link
                                href={item.path}
                                scroll={false}
                                onClick={handleLinkClick(item.path)}
                                aria-current={itemAriaCurrent}
                              />
                            }
                            isActive={isRouteActive}
                          >
                            <HugeiconsIcon
                              icon={item.icon}
                              size={16}
                              strokeWidth={1.5}
                            />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                          <SidebarMenuAction
                            render={<CollapsibleTrigger />}
                            type="button"
                            aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.title} sections`}
                            className="[&[data-panel-open]>svg]:rotate-180"
                          >
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              size={14}
                              strokeWidth={1.5}
                              className="transition-transform duration-200"
                            />
                          </SidebarMenuAction>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subs?.map((sub) => {
                                const href = buildHref(item.path, sub.id)
                                const isSubActive =
                                  isRouteActive &&
                                  currentHash === normalizeHash(sub.id)

                                return (
                                  <SidebarMenuSubItem key={sub.id}>
                                    <SidebarMenuSubButton
                                      render={
                                        <Link
                                          href={href}
                                          scroll={false}
                                          onClick={handleLinkClick(href)}
                                          aria-current={isSubActive ? "location" : undefined}
                                        />
                                      }
                                      size="sm"
                                      isActive={isSubActive}
                                    >
                                      <span>{sub.title}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroup>
            )
          })}
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
