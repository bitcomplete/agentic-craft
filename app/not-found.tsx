import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found | Agentic Craft",
}

export default function NotFound() {
  return (
    <article>
      <header className="mb-12 sm:mb-20">
        <p className="section-label mb-3">404</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          This address does not match any pattern, template, or demo — every
          section is still reachable from the sidebar.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-8 items-center text-sm font-medium underline underline-offset-4 transition-colors hover:text-muted-foreground"
        >
          Back to the demo
        </Link>
      </header>
    </article>
  )
}
