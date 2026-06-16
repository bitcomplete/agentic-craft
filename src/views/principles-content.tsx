import Link from "next/link"

import { PatternPage } from "@/components/reference/pattern-page"
import { PatternSection } from "@/components/reference/pattern-section"
import { principles } from "@/views/principles-data"

export function PrinciplesContent() {
  return (
    <PatternPage
      eyebrow="Principles"
      title="Ten rules for agentic product interfaces"
      description="The editorial spine of Agentic Craft: the research-backed rules the patterns are evaluated against."
    >
      <section className="mb-12 border-y border-border/60 py-5">
        <p className="section-label mb-4">Index</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {principles.map((principle, index) => (
            <Link
              key={principle.id}
              href={`#${principle.id}`}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="text-xs text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-foreground group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
                {principle.navTitle}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {principles.map((principle, index) => (
        <PatternSection
          key={principle.id}
          id={principle.id}
          eyebrow={String(index + 1).padStart(2, "0")}
          title={principle.title}
          description={principle.statement}
        >
          <div className="mt-5 max-w-[680px] space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {principle.elaboration}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {principle.citation}
            </p>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {principle.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-lg border border-border/70 bg-background p-3 transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="block text-sm font-medium text-foreground group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
                  {link.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {link.note}
                </span>
              </Link>
            ))}
          </div>
        </PatternSection>
      ))}
    </PatternPage>
  )
}
