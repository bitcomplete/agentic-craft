import Link from "next/link"

import { cn } from "@/lib/utils"

const primaryLinkClass =
  "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

const outlineLinkClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

const smallOutlineLinkClass =
  "inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

const doors = [
  {
    number: "01",
    title: "Read the principles",
    href: "/principles",
    description:
      "Ten rules that explain what the patterns defend and where the research points.",
    preview: ["control", "provenance", "cost", "memory"],
  },
  {
    number: "02",
    title: "Browse patterns",
    href: "/patterns/autonomy-contract",
    description:
      "Start with the Autonomy Contract card, then follow the registry pieces it composes.",
    preview: ["spectrum", "preview", "policy", "recipe"],
  },
  {
    number: "03",
    title: "See use cases",
    href: "/use-cases",
    description:
      "One launch-review thread shown as conversation, context blocks, and side panel.",
    preview: ["thread", "context", "side panel", "operations"],
  },
]

const policyRows = [
  ["Execution", "Allowed after approval"],
  ["Confirmation", "Required for this action"],
  ["Initiation", "User starts the run"],
] as const

export function LandingHomeContent() {
  return (
    <article>
      <header className="mb-14 border-b border-border/60 pb-10 sm:mb-16">
        <p className="section-label mb-3">Thesis</p>
        <h1 className="max-w-[760px] font-serif text-4xl leading-[1.12] font-light tracking-tight text-balance sm:text-5xl">
          A reference guide for design engineers building agent interfaces.
        </h1>
        <p className="mt-5 max-w-[680px] text-sm leading-relaxed text-muted-foreground">
          Distilled from Microsoft HAX, Shape of AI, LukeW, NN/g, Smashing, and
          direct study of Anthropic, OpenAI, Perplexity, Google, Vercel, and
          Cursor. Code is distributed through the shadcn registry, but the site
          starts with the interaction rules.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Link className={primaryLinkClass} href="/principles">
            Read principles
          </Link>
          <Link className={outlineLinkClass} href="/registry">
            Open registry
          </Link>
        </div>
      </header>

      <section className="page-section">
        <div className="max-w-[620px]">
          <p className="section-label mb-3">Three doors</p>
          <h2 className="text-xl font-semibold tracking-tight">
            Choose the layer you need.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Principles explain the thesis, patterns teach the reusable moves,
            and use cases show the patterns composed into operational surfaces.
          </p>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {doors.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="group flex min-h-[230px] flex-col rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs text-muted-foreground tabular-nums">
                  {door.number}
                </p>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  Open
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {door.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {door.description}
              </p>
              <div className="mt-auto pt-6">
                <div className="grid grid-cols-2 gap-1.5">
                  {door.preview.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-border/70 px-2 py-1 text-[11px] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="grid gap-8 border-y border-border/60 py-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(320px,1.14fr)] lg:items-start">
          <div>
            <p className="section-label mb-3">Featured pattern</p>
            <h2 className="text-xl font-semibold tracking-tight">
              Autonomy is a contract, not a slider.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The pattern card turns autonomy into visible product terms: what
              the agent may do, what it must show, when the user approves, and
              where the run can still be stopped.
            </p>
            <div className="mt-5">
              <Link
                className={smallOutlineLinkClass}
                href="/patterns/autonomy-contract"
              >
                Open pattern card
              </Link>
            </div>
          </div>

          <Link
            href="/patterns/autonomy-contract"
            className="group block rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <p className="section-label mb-2">Autonomy spectrum</p>
                <p className="text-sm font-medium text-foreground">
                  Execute with confirm
                </p>
              </div>
              <span className="rounded-md border border-border/70 px-2 py-1 text-xs text-muted-foreground">
                Level 03
              </span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-1.5">
              {["Suggest", "Recommend", "Confirm", "Execute", "Initiate"].map(
                (label, index) => (
                  <span
                    key={label}
                    className={cn(
                      "min-h-12 rounded-md border px-1 py-2 text-[9px] leading-tight sm:px-1.5 sm:text-[10px]",
                      index === 2
                        ? "border-foreground/30 bg-foreground text-background"
                        : "border-border/70 text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
            <div className="mt-4 rounded-md border border-border/70 bg-muted/20 p-3">
              <p className="text-xs font-medium text-foreground">
                Send blocker summary
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Recipient, source set, cost, consequence, and rollback are
                locked before approval.
              </p>
            </div>
            <div className="mt-3 grid gap-2">
              {policyRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 border-t border-border/60 pt-2 text-xs"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground group-hover:text-foreground">
              View the full pattern card
            </p>
          </Link>
        </div>
      </section>

      <section className="page-section">
        <div className="grid gap-5 rounded-lg border border-border bg-background p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="section-label mb-2">Operational layer</p>
            <h2 className="text-xl font-semibold tracking-tight">
              Agents need work surfaces after the thread.
            </h2>
            <p className="mt-2 max-w-[620px] text-sm leading-6 text-muted-foreground">
              Inbox, kanban, manager surface, run monitor, and background tasks
              show delegated work as accountable objects instead of transcript
              residue.
            </p>
          </div>
          <Link className={smallOutlineLinkClass} href="/operational-surfaces">
            Open surfaces
          </Link>
        </div>
      </section>
    </article>
  )
}
