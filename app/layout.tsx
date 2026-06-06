import type { Metadata, Viewport } from "next"
import { Albert_Sans, Source_Serif_4 } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "@/index.css"

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Agentic Craft",
  description:
    "Reference guide for designing agentic product interfaces beyond chat",
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${sourceSerif4.variable} dark`}
    >
      <body>
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-50 -translate-y-16 rounded-md bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-1 ring-border transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <ThemeProvider>
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
                <footer className="border-t border-dashed border-border/40 px-4 py-8 text-center text-xs text-muted-foreground/60 sm:px-8">
                  <a
                    href="https://github.com/arielconti10/agentic-craft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-muted-foreground"
                  >
                    Agentic Craft — Open Source
                  </a>
                </footer>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
