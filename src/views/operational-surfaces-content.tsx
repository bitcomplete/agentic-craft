import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"

import { RunTrace } from "@/components/ui/run-trace"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { UsageMeter } from "@/components/ui/usage-meter"
import {
  operationalComponents,
  operationalPrinciples,
  operationalRunTrace,
  operationalSurfaces,
  operationalUsage,
} from "@/views/operational-surfaces-data"

export function OperationalSurfacesContent() {
  return (
    <article>
      <header className="mb-10 sm:mb-14">
        <p className="section-label mb-3">Operational surfaces</p>
        <h1 className="font-serif text-4xl leading-[1.12] font-light tracking-tight text-balance">
          Where delegated agent work becomes manageable.
        </h1>
        <p className="mt-4 max-w-[680px] text-sm leading-6 text-muted-foreground">
          Agents do not only live in a thread. Inbox, kanban, manager surface,
          run monitor, and background task views give users a way to inspect,
          compare, stop, and resume work after it leaves the chat turn.
        </p>
      </header>

      <section className="grid gap-4 border-y border-border/60 py-6 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="section-label mb-2">Operating rule</p>
          <h2 className="font-serif text-2xl leading-tight font-light tracking-tight">
            Treat agent work as a queue of accountable objects.
          </h2>
        </div>
        <ul className="grid gap-3">
          {operationalPrinciples.map((principle) => (
            <li
              key={principle}
              className="border-l border-border/70 pl-4 text-sm leading-6 text-muted-foreground"
            >
              {principle}
            </li>
          ))}
        </ul>
      </section>

      <section className="page-section">
        <div className="grid gap-3">
          {operationalSurfaces.map((surface) => (
            <section
              key={surface.id}
              id={surface.id}
              className="scroll-mt-20 rounded-lg border border-border bg-background p-4"
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(300px,1.15fr)]">
                <div className="min-w-0">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-muted/25 text-muted-foreground">
                      <HugeiconsIcon icon={surface.icon} size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="section-label mb-1">{surface.label}</p>
                      <h2 className="text-lg font-semibold tracking-tight">
                        {surface.title}
                      </h2>
                    </div>
                  </div>
                  <p className="font-serif text-2xl leading-tight font-light tracking-tight text-balance">
                    {surface.thesis}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {surface.summary}
                  </p>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        User job
                      </dt>
                      <dd className="mt-1 leading-6">{surface.userJob}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Patterns
                      </dt>
                      <dd className="mt-1 leading-6">{surface.patternUse}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border border-border/70 bg-muted/15 p-3">
                  <div className="grid gap-2">
                    {surface.rows.map((row) => (
                      <div
                        key={`${surface.id}-${row.label}`}
                        className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-start gap-3 rounded-md border border-border/70 bg-background px-3 py-2"
                      >
                        <StatusIndicator status={row.status} label={row.meta} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {row.label}
                          </p>
                          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                            {row.detail}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {row.meta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="page-section grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <RunTrace
          title="Surface rollup trace"
          description="The operational layer keeps blocked work visible after the conversation moves on."
          events={operationalRunTrace}
        />
        <UsageMeter
          title="Operational budget"
          description="A compact budget view for runs, reviews, and spend."
          items={operationalUsage}
          className="rounded-lg border border-border bg-background px-3"
        />
      </section>

      <section className="page-section border-y border-border/60 py-6">
        <p className="section-label mb-3">Registry pieces</p>
        <div className="flex flex-wrap gap-2">
          {operationalComponents.map((component) => (
            <Link
              key={component.label}
              href={component.href}
              className="rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {component.label}
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
