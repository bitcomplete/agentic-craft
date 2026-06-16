"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { AtmosphereShot } from "./atmosphere-shot"

const GITHUB_URL = "https://github.com/bitcomplete/agentic-craft"
const REGISTRY_CMD = "npx shadcn add https://agenticcraft.dev/r/thread.json"

/* Kickers stay sentence case on this page — the landing speaks at a
   lower volume than the reference guide's uppercase eyebrow. */
const kicker = "text-xs font-medium tracking-[0.03em] text-muted-foreground"

const PATTERN_AREAS = [
  {
    name: "Thread",
    href: "/thread",
    desc: "Streaming messages, tool calls, status, and scroll anchoring.",
  },
  {
    name: "Side panel",
    desc: "Overlay workspace for artifacts, context, and parallel reading.",
    status: "Coming next",
  },
  {
    name: "Run timeline",
    desc: "Durable run states, events, spans, retries, and completion.",
    status: "Coming soon",
  },
  {
    name: "Approval gate",
    desc: "Locked preview surfaces before destructive or external actions.",
    status: "Coming soon",
  },
  {
    name: "Tool tree",
    desc: "Nested tool execution, parallel branches, and timing disclosure.",
    status: "Coming soon",
  },
  {
    name: "Sources & artifacts",
    desc: "Citation systems, source previews, and source-backed documents.",
    status: "Coming soon",
  },
  {
    name: "Memory ledger",
    desc: "Stored context, provenance, review, deletion, and privacy controls.",
    status: "Coming soon",
  },
  {
    name: "Multi-agent handoff",
    desc: "Agent identity, role transfer, routing, and shared state.",
    status: "Coming soon",
  },
  {
    name: "Usage & cost",
    desc: "Token, runtime, and cost surfaces that remain accountable.",
    status: "Coming soon",
  },
]

/* ── Logo: 2×2 grid of soft-cornered squares (from app/icon.svg) ── */
function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor"></rect>
      <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor"></rect>
      <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor"></rect>
      <rect
        x="13"
        y="13"
        width="9"
        height="9"
        rx="2"
        fill="currentColor"
      ></rect>
    </svg>
  )
}

function GitHubGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path>
    </svg>
  )
}

/* The agent's voice breaking into the product's: serif italic accent. */
function Accent({ children }: { children: React.ReactNode }) {
  return (
    <em className="font-serif font-light tracking-[-0.02em] italic">
      {children}
    </em>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme (d)"
    >
      <HugeiconsIcon
        icon={dark ? Moon02Icon : Sun02Icon}
        size={15}
        strokeWidth={1.5}
      />
    </Button>
  )
}

/* ── Registry command with honest copy affordance ── */
function RegistryCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <span className="inline-flex max-w-full items-center gap-2.5 rounded-md border border-border bg-muted py-[7px] pr-2 pl-3">
      <code className="overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap">
        {command}
      </code>
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0"
        onClick={copy}
        aria-live="polite"
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </span>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="13" height="13" rx="3" />
      <path d="M5 8.2l2.1 2.1L11 6.2" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="animate-spin motion-reduce:animate-none"
    >
      <path d="M8 1.5a6.5 6.5 0 1 1-6.5 6.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.3" />
      <path d="M8 4.6V8l2.2 1.4" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.8 1.6 13h12.8L8 1.8Z" />
      <path d="M8 6.4v3.1" />
      <path d="M8 11.4h.01" />
    </svg>
  )
}

function StatusShape({
  kind,
  children,
}: {
  kind: "complete" | "active" | "pending" | "blocked" | "error"
  children: React.ReactNode
}) {
  const icon =
    kind === "complete" ? (
      <CheckIcon />
    ) : kind === "active" ? (
      <SpinnerIcon />
    ) : kind === "pending" ? (
      <span className="size-3 rounded-full border border-dashed border-muted-foreground/70" />
    ) : kind === "blocked" ? (
      <ClockIcon />
    ) : (
      <AlertIcon />
    )

  return (
    <span className="inline-flex items-center gap-1.5 text-[0.8125rem]">
      <span
        className={cn(
          "grid size-4 place-items-center",
          kind === "complete" && "text-[var(--status-ok)]",
          kind === "blocked" && "text-[var(--status-warn)]",
          kind === "error" && "text-destructive"
        )}
      >
        {icon}
      </span>
      {children}
    </span>
  )
}

function StateSpecimen() {
  return (
    <div className="rounded-lg border border-border bg-card px-5 py-5">
      <div>
        <p className="section-label mb-3">Button — interaction states</p>
        <div className="flex flex-wrap items-start gap-x-[18px] gap-y-4">
          {[
            ["default", "bg-primary text-primary-foreground"],
            ["hover", "bg-primary/90 text-primary-foreground"],
            [
              "focus",
              "bg-primary text-primary-foreground shadow-[0_0_0_3px_color-mix(in_oklch,var(--ring)_50%,transparent)]",
            ],
            ["disabled", "bg-primary text-primary-foreground opacity-50"],
          ].map(([label, className]) => (
            <span key={label} className="inline-flex flex-col gap-2">
              <span
                className={cn(
                  "inline-flex h-8 items-center rounded-lg px-3 text-[0.8125rem] font-medium",
                  className
                )}
              >
                Approve
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.02em] text-muted-foreground">
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 border-t border-dashed border-border pt-5">
        <p className="section-label mb-3">Status — one shape per state</p>
        <div className="flex flex-wrap gap-x-[18px] gap-y-3">
          <StatusShape kind="complete">Complete</StatusShape>
          <StatusShape kind="active">Active</StatusShape>
          <StatusShape kind="pending">Pending</StatusShape>
          <StatusShape kind="blocked">Blocked</StatusShape>
          <StatusShape kind="error">Error</StatusShape>
        </div>
      </div>
    </div>
  )
}

export function LandingContent() {
  /* Session-once scroll reveals. They start mostly visible and move 4px,
     so the page reads as present before the enhancement runs. */
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]")
    const revealAll = () => {
      els.forEach((el) => el.classList.add("revealed"))
    }

    let seenReveal = false
    try {
      seenReveal = sessionStorage.getItem("ac-revealed") === "1"
    } catch {
      // Storage can be unavailable in restricted browsing modes.
    }

    if (seenReveal) {
      revealAll()
      return
    }

    if (!("IntersectionObserver" in window)) {
      revealAll()
      return
    }

    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      revealAll()
      return
    }

    let revealedAny = false
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealedAny = true
            entry.target.classList.add("revealed")
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => {
      el.classList.add("will-reveal")
      io.observe(el)
    })

    const fallback = setTimeout(() => {
      if (!revealedAny) revealAll()
    }, 800)

    try {
      sessionStorage.setItem("ac-revealed", "1")
    } catch {
      // Storage can be unavailable in restricted browsing modes.
    }

    return () => {
      clearTimeout(fallback)
      io.disconnect()
    }
  }, [])

  return (
    <div className="landing flex min-h-svh flex-col">
      <div className="landing-grain" aria-hidden="true"></div>

      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-[1020px] items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-medium tracking-tight whitespace-nowrap text-foreground"
          >
            <LogoMark /> Agentic Craft
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "text-muted-foreground"
              )}
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              title="View on GitHub"
            >
              <GitHubGlyph />
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Statement hero: headline left, supporting copy right, the
            feature shot below straddling into the sections band. */}
        <section className="mx-auto w-full max-w-[1020px] px-6 pt-[72px]">
          <div className="grid gap-x-10 gap-y-6 min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] min-[821px]:items-start">
            <div>
              <h1 className="max-w-[14em] text-[clamp(2.375rem,5.4vw,3.625rem)] leading-[1.08] font-medium tracking-[-0.03em]">
                The <Accent>foundation</Accent> for your agent interface
              </h1>
            </div>
            {/* pt-2 optically aligns the paragraph's cap height with the
                headline's — the display size carries more internal leading. */}
            <div className="flex flex-col items-start gap-1 min-[821px]:pt-2">
              <p className="max-w-[600px] text-[0.9375rem] leading-[1.6] text-muted-foreground">
                Researched interaction patterns for orchestration, tool use,
                approvals, memory, and observability — shipped as installable
                components.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <a
                  className={buttonVariants({ size: "lg" })}
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubGlyph /> View on GitHub
                </a>
                <Link
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "text-muted-foreground"
                  )}
                  href="#areas"
                >
                  Browse patterns
                </Link>
              </div>
            </div>
          </div>
          <div
            data-reveal
            className="relative z-[1] mx-auto mt-10 -mb-[132px] max-w-[880px] min-[821px]:mt-16"
          >
            <AtmosphereShot />
          </div>
        </section>

        {/* The sections band rises behind the hero specimen — the straddle
            handoff: artifact over the seam, content beneath it. */}
        <div className="border-t border-border bg-sidebar pt-[calc(132px+4rem)]">
          <div className="mx-auto w-full max-w-[1020px] px-6 pb-[72px]">
            <section className="page-section" id="areas">
              <div data-reveal className="max-w-[600px]">
                <p className={kicker}>01 · Reference areas</p>
                <h2 className="mt-2.5 text-xl font-semibold tracking-tight">
                  Nine areas. One system.
                </h2>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                  A taxonomy of agentic UX, synthesized from research and
                  shipping products. Behavior, states, and rationale for every
                  pattern.
                </p>
              </div>
              <div className="landing-pattern-index mt-10">
                {PATTERN_AREAS.map((area, i) => {
                  const rowClass =
                    "group -mx-2.5 grid grid-cols-[36px_minmax(0,1fr)_auto] items-baseline gap-x-[18px] gap-y-1 rounded-md border-t border-border px-2.5 py-3 transition-[background-color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none min-[721px]:grid-cols-[44px_220px_minmax(0,1fr)_auto]"
                  const rowContent = (
                    <>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {area.name}
                      </span>
                      <span className="col-start-2 row-start-2 text-[0.8125rem] leading-[1.55] text-muted-foreground min-[721px]:col-start-3 min-[721px]:row-start-1 min-[721px]:truncate">
                        {area.desc}
                      </span>
                      {area.href ? (
                        <span
                          className="col-start-3 row-start-1 -translate-x-1 text-[0.8125rem] text-muted-foreground opacity-0 transition-[opacity,transform] duration-150 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 min-[721px]:col-start-4 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      ) : (
                        <span className="col-start-3 row-start-1 text-[0.75rem] text-muted-foreground min-[721px]:col-start-4">
                          {area.status}
                        </span>
                      )}
                    </>
                  )

                  return area.href ? (
                    <Link
                      key={area.name}
                      href={area.href}
                      data-reveal
                      className={cn(
                        rowClass,
                        "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-background"
                      )}
                    >
                      {rowContent}
                    </Link>
                  ) : (
                    <div
                      key={area.name}
                      data-reveal
                      role="link"
                      aria-disabled="true"
                      className={cn(rowClass, "cursor-default opacity-80")}
                    >
                      {rowContent}
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="page-section">
              <div data-reveal className="max-w-[600px]">
                <p className={kicker}>02 · Components</p>
                <h2 className="mt-2.5 text-xl font-semibold tracking-tight">
                  Real components. Every state.
                </h2>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                  Each pattern ships as working code, not a screenshot — every
                  state drawn, the behavior specified, the rationale documented.
                  Drop one in and it already handles hover, focus, loading, and
                  error.
                </p>
              </div>
              <div data-reveal className="mt-10 max-w-[640px]">
                <StateSpecimen />
              </div>
            </section>

            <section className="page-section">
              <div data-reveal className="max-w-[600px]">
                <p className={kicker}>03 · Registry</p>
                <h2 className="mt-2.5 text-xl font-semibold tracking-tight">
                  Open source. Open code.
                </h2>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                  Every primitive and workflow block is distributed through a
                  shadcn-compatible registry. Install it with a single command.
                </p>
              </div>
              <div data-reveal className="mt-6">
                <RegistryCommand command={REGISTRY_CMD} />
              </div>
            </section>

            <section className="page-section">
              <h2
                data-reveal
                className="max-w-[15em] text-[clamp(2rem,4vw,2.875rem)] leading-[1.1] font-medium tracking-[-0.03em]"
              >
                Start with the pattern, <Accent>then make it your own</Accent>
              </h2>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link className={buttonVariants({ size: "lg" })} href="#areas">
                  Browse the patterns
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="overflow-hidden border-t border-border bg-sidebar">
        {/* Giant cropped wordmark — typographic, monochrome, near-hairline. */}
        <div
          className="mx-auto -mb-[0.34em] w-full max-w-[1020px] px-6 text-[clamp(64px,12.5vw,150px)] leading-[0.95] font-semibold tracking-[-0.04em] whitespace-nowrap text-foreground/[0.07] select-none"
          aria-hidden="true"
        >
          Agentic Craft
        </div>
      </footer>
    </div>
  )
}
