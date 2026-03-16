"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const sections = [
  {
    title: "Demo",
    path: "/",
    icon: Home01Icon,
    subs: [],
  },
  {
    title: "Conversation",
    path: "/conversation",
    icon: BubbleChatIcon,
    subs: [
      { title: "Messages & Prose", id: "messages" },
      { title: "Citations", id: "citations" },
      { title: "Thinking Blocks", id: "thinking" },
      { title: "Composer", id: "composer" },
    ],
  },
  {
    title: "Agent Actions",
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
      { title: "Context Ring", id: "memory-context-ring" },
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
  {
    title: "Thread Timeline",
    path: "/thread-timeline",
    icon: LeftToRightListBulletIcon,
    subs: [],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = useCallback(
    (sectionPath: string, elementId: string) => {
      const doScroll = () => {
        requestAnimationFrame(() => {
          const el = document.getElementById(elementId)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        })
      }

      if (pathname !== sectionPath) {
        router.push(sectionPath)
        setTimeout(doScroll, 100)
      } else {
        doScroll()
      }
    },
    [pathname, router]
  )

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-sm font-semibold tracking-tight">
            Agentic Craft
          </span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            v3
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => {
          const isActive = pathname === section.path
          
          // Demo page has no subs — just a link
          if (section.subs.length === 0) {
            return (
              <SidebarGroup key={section.path}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href={section.path} />}
                      isActive={isActive}
                    >
                      <HugeiconsIcon
                        icon={section.icon}
                        size={16}
                        strokeWidth={1.5}
                      />
                      <span>{section.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )
          }

          return (
            <SidebarGroup key={section.path}>
              <Collapsible defaultOpen={isActive}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <CollapsibleTrigger className="w-full [&[data-panel-open]>div>svg:last-child]:rotate-180">
                      <SidebarMenuButton
                        render={<Link href={section.path} />}
                        isActive={isActive}
                      >
                        <HugeiconsIcon
                          icon={section.icon}
                          size={16}
                          strokeWidth={1.5}
                        />
                        <span>{section.title}</span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="ml-auto transition-transform duration-200"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.subs.map((sub) => (
                          <SidebarMenuSubItem key={sub.id}>
                            <SidebarMenuSubButton
                              render={
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    scrollToSection(section.path, sub.id)
                                  }}
                                />
                              }
                              size="sm"
                            >
                              <span>{sub.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </SidebarMenu>
              </Collapsible>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
