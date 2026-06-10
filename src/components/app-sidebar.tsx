"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useSyncExternalStore } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ComputerIcon,
  Moon02Icon,
  Sun02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { useTheme } from "@/components/theme-provider"
import { sections } from "@/content/navigation"

const themeOptions = [
  // "Auto" instead of "System": the full word truncates at the default
  // sidebar width
  { value: "system", label: "Auto", icon: ComputerIcon },
  { value: "light", label: "Light", icon: Sun02Icon },
  { value: "dark", label: "Dark", icon: Moon02Icon },
] as const

const emptySubscribe = () => () => {}

function ThemeMenu() {
  const { theme, setTheme } = useTheme()
  // The stored theme is only known on the client — show no selection until
  // hydration so the first client render matches the server HTML.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const activeTheme = hydrated ? theme : undefined

  return (
    <div
      role="group"
      aria-label="Choose appearance"
      className="flex rounded-lg border border-sidebar-border/70 p-1"
    >
      {themeOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={activeTheme === option.value ? "secondary" : "ghost"}
          size="xs"
          aria-pressed={activeTheme === option.value}
          aria-label={
            option.value === "system"
              ? "Use system theme"
              : `Use ${option.label.toLowerCase()} theme`
          }
          onClick={() => setTheme(option.value)}
          className="min-w-0 flex-1 px-1 text-[11px]"
        >
          <HugeiconsIcon
            icon={option.icon}
            data-icon="inline-start"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="truncate">{option.label}</span>
        </Button>
      ))}
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = useCallback(
    (sectionPath: string, elementId: string) => {
      const scrollTo = (el: HTMLElement) => {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        })
      }

      if (pathname !== sectionPath) {
        router.push(sectionPath)
        // The target section mounts after navigation — retry each frame
        // (up to ~2s) instead of racing a fixed timeout.
        const deadline = Date.now() + 2000
        const tryScroll = () => {
          const el = document.getElementById(elementId)
          if (el) {
            scrollTo(el)
          } else if (Date.now() < deadline) {
            requestAnimationFrame(tryScroll)
          }
        }
        requestAnimationFrame(tryScroll)
      } else {
        requestAnimationFrame(() => {
          const el = document.getElementById(elementId)
          if (el) scrollTo(el)
        })
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
      <SidebarFooter>
        <ThemeMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
