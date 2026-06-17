"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSyncExternalStore } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ComputerIcon,
  Moon02Icon,
  Search01Icon,
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
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { sections } from "@/content/navigation"
import { CommandPalette, useCommandPalette } from "@/components/command-palette"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"

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
  const { setOpenMobile } = useSidebar()
  const scrollToSection = useScrollToSection()
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette()

  return (
    <>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-8 items-center px-2">
            <span className="truncate text-sm font-semibold tracking-tight">
              Agentic Craft
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            aria-label="Search patterns"
            onClick={() => setPaletteOpen(true)}
            className="w-full justify-start text-muted-foreground"
          >
            <HugeiconsIcon
              icon={Search01Icon}
              data-icon="inline-start"
              aria-hidden="true"
            />
            <span className="flex-1 text-left">Search</span>
            <kbd className="shrink-0 rounded border border-border bg-muted/50 px-1 text-[11px] text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          {sections.map((section) => {
            const isActive =
              pathname === section.path ||
              pathname.startsWith(`${section.path}/`)

            // Demo page has no subs — just a link
            if (section.subs.length === 0) {
              return (
                <SidebarGroup key={section.path}>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={section.path}
                            onClick={() => setOpenMobile(false)}
                          />
                        }
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
                      <SidebarMenuButton
                        render={
                          <Link
                            href={section.path}
                            onClick={() => setOpenMobile(false)}
                          />
                        }
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
                          aria-hidden="true"
                          className={cn(
                            "ml-auto transition-transform duration-200",
                            isActive && "rotate-180"
                          )}
                        />
                      </SidebarMenuButton>
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
                                      setOpenMobile(false)
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
    </>
  )
}
