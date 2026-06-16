import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import "@/index.css"

/* The PP Neue Montreal free cut ships no Medium (500), and font-medium is
   the site's dominant emphasis tier. The scale shifts down one face: Text
   Book (350) takes body duty at 400, Regular steps up to 500, Semibold
   holds 600 — keeping normal/medium/semibold visually distinct. */
const neueMontreal = localFont({
  src: [
    {
      path: "./fonts/pp-neue-montreal-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/pp-neue-montreal-text-book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/pp-neue-montreal-text-book-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/pp-neue-montreal-regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/pp-neue-montreal-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/pp-neue-montreal-semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  adjustFontFallback: "Arial",
  variable: "--font-neue-montreal",
})

/* Klim test cut of Signifier — limited character set; missing glyphs fall
   back to the metric-adjusted Times fallback next/font generates. */
const signifier = localFont({
  src: [
    {
      path: "./fonts/test-signifier-vf-roman.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/test-signifier-vf-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  adjustFontFallback: "Times New Roman",
  variable: "--font-signifier",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://agentic-craft.vercel.app"),
  title: {
    default: "Agentic Craft",
    template: "%s · Agentic Craft",
  },
  description:
    "Reference guide for designing agentic product interfaces beyond chat",
  openGraph: {
    title: "Agentic Craft",
    description:
      "Interaction patterns for agent orchestration, tool use, approvals, memory, and observability.",
    url: "/",
    siteName: "Agentic Craft",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Agentic Craft",
    description:
      "Interaction patterns for agent orchestration, tool use, approvals, memory, and observability.",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
}

const themeInitializerScript = `
  (function () {
    try {
      var storageKey = "agentic-craft-theme";
      var storedTheme = window.localStorage.getItem(storageKey);
      var theme =
        storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
          ? storedTheme
          : "system";
      var resolved =
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme;
      var root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.dataset.theme = theme;
      root.dataset.resolvedTheme = resolved;
      root.style.colorScheme = resolved;
    } catch (error) {}
  })();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${neueMontreal.variable} ${signifier.variable}`}
    >
      <body>
        {/* Plain inline script (not next/script): it must run synchronously
            during HTML parsing, before any content paints, or dark-mode
            loads flash the light theme. */}
        <script
          id="agentic-craft-theme"
          dangerouslySetInnerHTML={{ __html: themeInitializerScript }}
        />
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-50 -translate-y-16 rounded-md bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-1 ring-border transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
