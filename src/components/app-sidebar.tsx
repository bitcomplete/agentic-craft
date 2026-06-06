"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
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
import { sections } from "@/content/navigation"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = useCallback(
    (sectionPath: string, elementId: string) => {
      const doScroll = () => {
        requestAnimationFrame(() => {
          const el = document.getElementById(elementId)
          if (el) {
            const prefersReducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
            el.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "start",
            })
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
        <div className="flex h-8 items-center px-2">
          <span className="truncate text-sm font-semibold tracking-tight">
            Agentic Craft
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => {
          const isActive =
            pathname === section.path || pathname.startsWith(`${section.path}/`)

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
              <Collapsible open={isActive}>
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
