"use client"

import * as React from "react"

const SHOT_W = 880
const SHOT_H = 470

const AVATAR_PALETTES = [
  ["#5fae7e", "#356b4f"],
  ["#6aa9d6", "#37607e"],
  ["#cf8f63", "#7e5234"],
  ["#9a82cf", "#54417e"],
  ["#d67f8c", "#7e333f"],
  ["#5fc3bb", "#2f7e77"],
  ["#c9b15f", "#7e6b2f"],
  ["#7e9a6a", "#465a3a"],
]

function hashString(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function drawAvatar(canvas: HTMLCanvasElement, name: string) {
  const context = canvas.getContext("2d")
  if (!context) return

  const seed = Math.abs(hashString(name)) % 509
  const cells = 7
  const scale = canvas.width / cells
  const [primary, shade] = AVATAR_PALETTES[seed % AVATAR_PALETTES.length]
  const offset = (seed % 17) * 3.7 + 1.3
  const offsetTwo = (seed % 13) * 2.9 + 5.1
  const noiseScale = 4.6

  const fract = (x: number) => x - Math.floor(x)
  const hash = (x: number, y: number) =>
    fract(Math.sin(x * 127.1 + y * 311.7 + seed * 53.3) * 43758.5453)
  const smooth = (t: number) => t * t * (3 - 2 * t)
  const valueNoise = (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const a = hash(xi, yi)
    const b = hash(xi + 1, yi)
    const c = hash(xi, yi + 1)
    const d = hash(xi + 1, yi + 1)
    const u = smooth(xf)
    const v = smooth(yf)

    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
  }
  const fbm = (x: number, y: number) => {
    let amplitude = 0.6
    let frequency = 1
    let sum = 0
    let norm = 0
    for (let i = 0; i < 2; i += 1) {
      sum += amplitude * valueNoise(x * frequency, y * frequency)
      norm += amplitude
      amplitude *= 0.5
      frequency *= 2
    }
    return sum / norm
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
  for (let cy = 0; cy < cells; cy += 1) {
    for (let cx = 0; cx < cells; cx += 1) {
      const u = (cx + 0.5) / cells
      const v = (cy + 0.5) / cells
      const mirroredX = Math.abs(u - 0.5) * 2
      const noise = fbm(
        mirroredX * noiseScale + offset,
        v * noiseScale + offsetTwo
      )
      const radius = Math.hypot(u - 0.5, v - 0.5) * 2
      const value = (noise - 0.5) * 2.2 + 0.5 - radius * 0.4 - 0.04

      if (value <= 0) continue
      context.fillStyle = value > 0.2 ? primary : shade
      context.fillRect(
        Math.round(cx * scale),
        Math.round(cy * scale),
        Math.ceil(scale),
        Math.ceil(scale)
      )
    }
  }
}

function AgentAvatar({ name }: { name: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (ref.current) drawAvatar(ref.current, name)
  }, [name])

  return (
    <canvas
      ref={ref}
      className="agent-av"
      width={7}
      height={7}
      title={name}
      aria-hidden="true"
    />
  )
}

function ShotScaler({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    let frame: number | null = null
    const measure = () => {
      frame = null
      const width = element.clientWidth
      if (width > 0) setScale(width / SHOT_W)
    }

    measure()
    const observer = new ResizeObserver(() => {
      if (frame === null) frame = requestAnimationFrame(measure)
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="shot-scaler"
      style={{ height: Math.round(SHOT_H * scale) }}
    >
      <div
        className="shot-canvas atmosphere"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

function ProgressIcon() {
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
      <circle cx="8" cy="8" r="6.3" />
      <path
        d="M8 1.7a6.3 6.3 0 0 1 0 12.6z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

function CheckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
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
      width="12"
      height="12"
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

function AgentRow({
  name,
  detail,
  time,
  state,
}: {
  name: string
  detail: string
  time: string
  state: "done" | "active"
}) {
  return (
    <div className="spec-row">
      <AgentAvatar name={name} />
      <span className={`spec-g ${state}`}>
        {state === "done" ? <CheckIcon /> : <SpinnerIcon />}
      </span>
      <span>
        {name} <span className="meta">— {detail}</span>
      </span>
      <span className="tm">{time}</span>
    </div>
  )
}

export function AtmosphereShot() {
  const atmoRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const atmo = atmoRef.current
    if (!atmo) return

    if (!("IntersectionObserver" in window)) {
      atmo.classList.add("in-view")
      return
    }

    atmo.classList.add("in-view")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          atmo.classList.toggle("in-view", entry.isIntersecting)
        })
      },
      { threshold: 0 }
    )
    observer.observe(atmo)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="shot"
      role="img"
      aria-label="A multi-agent run beside the agent's autonomy level and the open pull request awaiting your approval: three sub-agents migrated a billing service to a new pricing model in parallel, schema and API changes done, tests still running, and the merge to main, above the agent's autonomy level, awaits your review."
    >
      <ShotScaler>
        <div ref={atmoRef} className="atmo-img" aria-hidden="true" />
        <div className="shot-stage" aria-hidden="true">
          <div className="hero-cols">
            <div className="spec-card">
              <div className="spec-bar">
                <i />
                <i />
                <i />
                <span className="lbl">multi-agent-run</span>
              </div>
              <div className="spec-in">
                <div className="spec-q">
                  <span className="you">You</span>
                  <p>Migrate the billing service to the new pricing model.</p>
                </div>
                <p className="spec-say">
                  I split the work across three agents and merged their results.
                  The test run is finishing — one change needs your review.
                </p>
                <div>
                  <div className="spec-row">
                    <span className="spec-g">
                      <ProgressIcon />
                    </span>
                    <span>
                      Plan migration <span className="meta">· 4 subtasks</span>
                    </span>
                    <span className="tm">—</span>
                  </div>
                  <div className="spec-kids">
                    <AgentRow
                      name="schema-agent"
                      detail="alter pricing tables"
                      time="3.2s"
                      state="done"
                    />
                    <AgentRow
                      name="api-agent"
                      detail="update endpoints"
                      time="2.7s"
                      state="done"
                    />
                    <AgentRow
                      name="test-agent"
                      detail="running suite · 41/120"
                      time="—"
                      state="active"
                    />
                  </div>
                  <div className="spec-row spec-row--muted">
                    <span className="spec-g">
                      <PendingIcon />
                    </span>
                    <span>
                      Merge &amp; open PR{" "}
                      <span className="meta">· awaiting review</span>
                    </span>
                    <span className="tm">—</span>
                  </div>
                </div>
                <div className="spec-foot">
                  <span className="ok">
                    <ProgressIcon />
                  </span>
                  <span>2 of 3 done · 1 running</span>
                </div>
              </div>
            </div>

            <div className="hero-rightcol">
              <div className="hero-gate hero-gate--auton">
                <div className="hg-top">
                  <span className="hg-title">Autonomy</span>
                  <span className="hg-badge">Level 2 of 3</span>
                </div>
                <div className="auton-body">
                  <div className="auton-track">
                    <span className="seg fill" />
                    <span className="seg fill" />
                    <span className="seg" />
                  </div>
                  <div className="auton-labels">
                    <span>Suggest</span>
                    <span className="cur">Act &amp; ask</span>
                    <span>Full auto</span>
                  </div>
                  <p className="auton-note">
                    Plans, edits &amp; runs tests on its own — merging to main
                    needs your approval.
                  </p>
                </div>
              </div>

              <div className="hero-gate">
                <div className="hg-top">
                  <span className="hg-title">Open pull request</span>
                  <span className="hg-badge">Needs review</span>
                </div>
                <div className="hg-body">
                  <div className="hg-row">
                    <span className="k">Branch</span>
                    <span className="v">billing-pricing → main</span>
                  </div>
                  <div className="hg-row">
                    <span className="k">Diff</span>
                    <span className="v">+1,240 −308 · 9 files</span>
                  </div>
                  <div className="hg-row">
                    <span className="k">Checks</span>
                    <span className="v warn">2 of 3 · 1 running</span>
                  </div>
                  <div className="hg-row">
                    <span className="k">By</span>
                    <span className="v">schema · api · test agents</span>
                  </div>
                  <div className="hg-actions">
                    <span className="hg-btn primary">Approve &amp; merge</span>
                    <span className="hg-btn ghost">Request changes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ShotScaler>
    </div>
  )
}
