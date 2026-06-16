"use client"

import * as React from "react"

import { useTheme } from "@/components/theme-provider"
import { AtmosphereShot } from "./atmosphere-shot"

const GITHUB_URL = "https://github.com/bitcomplete/agentic-craft"
const REGISTRY_CMD =
  "npx shadcn@latest add bitcomplete/agentic-craft/observable-work"

const AREAS = [
  [
    "Conversation",
    "/conversation",
    "Message surfaces, citations, observable work, clarifying questions.",
  ],
  [
    "Sources & artifacts",
    "/sources",
    "Citation systems, source previews, source-backed documents.",
  ],
  [
    "Agent actions",
    "/actions",
    "Tool calls, subagents, plans, decision flows, approval gates.",
  ],
  [
    "Trust & control plane",
    "/trust",
    "Autonomy settings, consent, provenance, audit trails, kill switch.",
  ],
  [
    "Memory",
    "/memory",
    "Memory panels, ledger items, provenance previews, privacy controls.",
  ],
  [
    "Multi-agent",
    "/multi-agent",
    "Agent identity, handoff, routing, parallel execution.",
  ],
  [
    "Feedback",
    "/feedback",
    "Corrections, ratings, error reports, escalation, feedback history.",
  ],
  [
    "Observability",
    "/observability",
    "Activity timelines, token usage, session timelines, error states.",
  ],
  [
    "Templates",
    "/templates",
    "Complete workflow references built from the primitives.",
  ],
] as const

function LogoMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="9" height="9" rx="2" />
      <rect x="13" y="2" width="9" height="9" rx="2" />
      <rect x="2" y="13" width="9" height="9" rx="2" />
      <rect x="13" y="13" width="9" height="9" rx="2" />
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
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      className="i-sun"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      className="i-moon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
    </svg>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  return (
    <button
      className="icon-btn"
      id="theme-toggle"
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme (d)"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <SunIcon />
      <MoonIcon />
    </button>
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

function PendingIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeDasharray="2.4 2.4"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.3" />
    </svg>
  )
}

function RegistryCommand() {
  const [copied, setCopied] = React.useState(false)

  return (
    <span className="cmd-chip">
      <code>
        <span className="prompt">$</span> {REGISTRY_CMD}
      </code>
      <button
        className="btn btn-ghost btn-sm"
        id="copy-reg"
        type="button"
        aria-live="polite"
        onClick={() => {
          void navigator.clipboard?.writeText(REGISTRY_CMD)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1800)
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  )
}

function StateSpecimen() {
  return (
    <div className="states-card">
      <div className="states-group">
        <p className="states-label">Button — interaction states</p>
        <div className="states-row">
          <span className="state-cell">
            <span className="sbtn">Approve</span>
            <span className="cap">default</span>
          </span>
          <span className="state-cell">
            <span className="sbtn hover">Approve</span>
            <span className="cap">hover</span>
          </span>
          <span className="state-cell">
            <span className="sbtn focus">Approve</span>
            <span className="cap">focus</span>
          </span>
          <span className="state-cell">
            <span className="sbtn disabled">Approve</span>
            <span className="cap">disabled</span>
          </span>
        </div>
      </div>
      <div className="states-group">
        <p className="states-label">Status — one shape per state</p>
        <div className="states-row">
          <span className="schip">
            <span className="g ok">
              <CheckIcon />
            </span>
            Complete
          </span>
          <span className="schip">
            <span className="g">
              <SpinnerIcon />
            </span>
            Active
          </span>
          <span className="schip">
            <span className="g">
              <PendingIcon />
            </span>
            Pending
          </span>
          <span className="schip">
            <span className="g warn">
              <ClockIcon />
            </span>
            Blocked
          </span>
          <span className="schip">
            <span className="g err">
              <AlertIcon />
            </span>
            Error
          </span>
        </div>
      </div>
    </div>
  )
}

function useScrollReveals() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".landing .will-reveal")
    const revealAll = () => {
      els.forEach((el) => el.classList.add("revealed"))
    }

    let seenReveal = false
    try {
      seenReveal = sessionStorage.getItem("ac-revealed") === "1"
    } catch {
      // Storage can be unavailable in private or restricted browsing contexts.
    }

    if (seenReveal) {
      revealAll()
      return
    }

    if (
      !("IntersectionObserver" in window) ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      revealAll()
      return
    }

    let revealedAny = false
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          revealedAny = true
          entry.target.classList.add("revealed")
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12 }
    )

    els.forEach((el) => observer.observe(el))
    const fallback = window.setTimeout(() => {
      if (!revealedAny) revealAll()
    }, 800)

    try {
      sessionStorage.setItem("ac-revealed", "1")
    } catch {
      // Storage can be unavailable in private or restricted browsing contexts.
    }

    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])
}

export function LandingContent() {
  useScrollReveals()

  return (
    <div className="landing">
      <div className="landing-grain" aria-hidden="true" />

      <header className="site-header" data-od-id="header">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Agentic Craft home">
            <LogoMark />
            Agentic Craft
          </a>
          <div className="h-actions">
            <ThemeToggle />
            <a
              className="icon-btn"
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

      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="top" data-od-id="hero">
          <div className="wrap">
            <div className="hero-grid">
              <h1 className="will-reveal">
                The <span className="serif-it">foundation</span> for your agent
                interface
              </h1>
              <div
                className="hero-aside will-reveal"
                style={{ "--rd": "60ms" } as React.CSSProperties}
              >
                <p>
                  Researched interaction patterns for orchestration, tool use,
                  approvals, memory, and observability — shipped as installable
                  components.
                </p>
                <div className="hero-cta">
                  <a
                    className="btn btn-primary"
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubGlyph /> View on GitHub
                  </a>
                  <a className="btn btn-ghost" href="#areas">
                    Browse patterns
                  </a>
                </div>
              </div>
            </div>

            <div
              className="shot-wrap will-reveal"
              style={{ "--rd": "120ms" } as React.CSSProperties}
            >
              <AtmosphereShot />
            </div>
          </div>
        </section>

        <div className="band">
          <div className="wrap band-inner">
            <section className="section" id="areas" data-od-id="areas">
              <div className="section-head will-reveal">
                <p className="kicker">01 · Reference areas</p>
                <h2>Nine areas. One system.</h2>
                <p>
                  A taxonomy of agentic UX, synthesized from research and
                  shipping products. Behavior, states, and rationale for every
                  pattern.
                </p>
              </div>
              <div className="ledger">
                {AREAS.map(([name, href, description], index) => (
                  <a
                    key={name}
                    className="ledger-row will-reveal"
                    href={href}
                    style={{ "--rd": `${index * 25}ms` } as React.CSSProperties}
                    aria-label={`${name} — ${description}`}
                  >
                    <span className="num tabular">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="name">{name}</span>
                    <span className="desc">{description}</span>
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section
              className="section section--split"
              id="components"
              data-od-id="components"
            >
              <div className="section-head will-reveal">
                <p className="kicker">02 · Components</p>
                <h2>Real components. Every state.</h2>
                <p>
                  Each pattern ships as working code, not a screenshot — every
                  state drawn, the behavior specified, the rationale documented.
                  Drop one in and it already handles hover, focus, loading, and
                  error.
                </p>
              </div>
              <div className="demo-max will-reveal">
                <StateSpecimen />
              </div>
            </section>

            <section
              className="section section--split"
              id="registry"
              data-od-id="registry"
            >
              <div className="section-head will-reveal">
                <p className="kicker">03 · Registry</p>
                <h2>Open source. Open code.</h2>
                <p>
                  Every primitive and workflow block is distributed through a
                  shadcn-compatible registry. Install it with a single command.
                </p>
              </div>
              <div className="registry-cmd will-reveal">
                <RegistryCommand />
              </div>
            </section>

            <section className="closing" data-od-id="closing">
              <h2 className="will-reveal">
                Start with the pattern,{" "}
                <span className="serif-it">then make it your own</span>
              </h2>
              <div
                className="hero-cta will-reveal"
                style={{ "--rd": "60ms" } as React.CSSProperties}
              >
                <a className="btn btn-primary" href="#areas">
                  Browse the patterns
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="site-footer" data-od-id="footer">
        <div className="wordmark" aria-hidden="true">
          Agentic Craft
        </div>
      </footer>
    </div>
  )
}
