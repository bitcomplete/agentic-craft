"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function SidebarFloatingTrigger() {
  const { isMobile, state } = useSidebar()

  if (isMobile || state === "expanded") {
    return null
  }

  return (
    <div className="fixed top-3 left-3 z-40">
      <SidebarTrigger className="h-8 w-8 rounded-md border border-border/50 bg-background/80 shadow-sm backdrop-blur-sm" />
    </div>
  )
}
