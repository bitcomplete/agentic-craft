import Link from "next/link"

import { useCaseVariants } from "./data"

export function UseCasesContent() {
  return (
    <article>
      <header className="mb-10 sm:mb-14">
        <p className="section-label mb-3">Use cases</p>
        <h1 className="font-serif text-4xl leading-[1.12] font-light tracking-tight text-balance">
          One thread, three levels of product surface
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-6 text-muted-foreground">
          The variants build on the same launch-review thread. Each step adds a
          new surface only when the work needs it: first the conversation, then
          persistent context blocks, then a parallel workbench.
        </p>
      </header>

      <section className="grid gap-3">
        {useCaseVariants.map((variant) => (
          <Link
            key={variant.slug}
            href={`/use-cases/${variant.slug}`}
            id={variant.slug}
            className="group grid gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-border/90 hover:bg-muted/20 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:grid-cols-[96px_minmax(0,1fr)_180px]"
          >
            <div>
              <p className="text-xs text-muted-foreground tabular-nums">
                {variant.step}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {variant.shortTitle}
              </p>
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-2xl leading-tight font-light tracking-tight underline-offset-4 group-hover:underline">
                {variant.title}
              </h2>
              <p className="mt-2 max-w-[560px] text-sm leading-6 text-muted-foreground">
                {variant.summary}
              </p>
            </div>
            <div className="flex items-start md:justify-end">
              <span className="rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {variant.capability}
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section
        id="fixture-convention"
        className="mt-10 grid scroll-mt-20 gap-5 border-y border-border/60 py-6 md:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <p className="section-label mb-2">Fixture convention</p>
          <p className="font-serif text-2xl leading-tight font-light tracking-tight">
            Examples own the story they teach.
          </p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          The use-case fixtures live in{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 text-xs">
            src/views/use-cases/data.ts
          </code>
          . Registry primitives stay portable; use-case and pattern pages supply
          narrative data that demonstrates pattern composition in a real product
          surface.
        </p>
      </section>

      <section className="mt-10 grid gap-5 rounded-lg border border-border bg-background p-4 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="section-label mb-2">Operational surfaces</p>
          <p className="font-serif text-2xl leading-tight font-light tracking-tight">
            The thread is not the end of the interface.
          </p>
        </div>
        <div>
          <p className="text-sm leading-6 text-muted-foreground">
            Longer-running and autonomous work needs inbox, kanban, manager,
            monitor, and background-task surfaces where state can be compared.
          </p>
          <Link
            href="/operational-surfaces"
            className="mt-4 inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Open operational surfaces
          </Link>
        </div>
      </section>
    </article>
  )
}
