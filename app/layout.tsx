import type { Metadata } from "next"
import { Source_Serif_4, Geist, Lora } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { HashScrollHandler } from "@/components/hash-scroll-handler"
import { SidebarFloatingTrigger } from "@/components/sidebar-floating-trigger"
import "@/index.css"
import { cn } from "@/lib/utils"

const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" })

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Agentic Craft",
  description: "Agnostic reference for agentic UX patterns and interaction models",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        sourceSerif4.variable,
        "font-sans",
        geist.variable,
        loraHeading.variable,
      )}
    >
      <body>
        <TooltipProvider>
          <ThemeProvider>
            <SidebarProvider
              style={{ "--sidebar-width": "220px" } as React.CSSProperties}
            >
              <AppSidebar />
              <SidebarInset id="main-content">
                <HashScrollHandler />
                <SidebarFloatingTrigger />
                <div className="flex h-10 items-center px-4 md:hidden">
                  <SidebarTrigger />
                </div>
                <div className="min-h-0 flex-1 overflow-auto" data-app-scroll-container>
                  <div className="mx-auto max-w-[860px] px-6 pt-12 pb-24 sm:px-10">
                    {children}
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
