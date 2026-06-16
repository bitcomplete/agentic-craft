import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "220px" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <div className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur md:static md:h-10 md:justify-start md:border-0 md:bg-transparent md:backdrop-blur-none">
          <SidebarTrigger className="-ml-1" />
          <span className="text-sm font-semibold tracking-tight md:hidden">
            Agentic Craft
          </span>
          <span className="size-7 md:hidden" aria-hidden="true" />
        </div>
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 overflow-auto"
        >
          <div className="mx-auto w-full max-w-[860px] px-4 pt-8 pb-24 sm:px-10">
            {children}
          </div>
        </main>
        <footer className="border-t border-dashed border-border/40 px-4 py-8 text-center text-xs text-muted-foreground sm:px-8">
          <a
            href="https://github.com/bitcomplete/agentic-craft"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 items-center transition-colors hover:text-foreground"
          >
            Agentic Craft — Open Source
          </a>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
