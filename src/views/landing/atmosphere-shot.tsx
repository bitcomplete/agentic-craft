"use client"

import { useEffect, useRef, useState } from "react"

/* The hero feature shot: an atmosphere sky with a perspective stack of
   three dark agent cards, one block type per plate — approval gate →
   agent voice → observable work. Art-directed illustration, not a live
   demo: nothing here pretends to be interactive (Honest Affordance), so
   the plate colors are fixed ink values rather than theme tokens. */

/* Scales a fixed-size composition to its container width. */
function ShotScaler({
  w,
  h,
  children,
  ...rest
}: {
  w: number
  h: number
  children: React.ReactNode
} & React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf: number | null = null
    const measure = () => {
      raf = null
      const cw = el.clientWidth
      if (cw > 0) setScale(cw / w)
    }
    measure()
    const ro = new ResizeObserver(() => {
      // rAF-defer: rendering inside the observer callback triggers the
      // browser's "ResizeObserver loop" notification.
      if (!raf) raf = requestAnimationFrame(measure)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [w])

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: Math.round(h * scale) }}
      {...rest}
    >
      <div
        style={{
          width: w,
          height: h,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ── shared plate bits ── */

function PlateHeader({
  name,
  time,
  dim = 1,
}: {
  name: string
  time: string
  dim?: number
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        marginBottom: 15,
        opacity: dim,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: "oklch(0.58 0 0)",
        }}
      ></span>
      <span style={{ fontSize: 13, opacity: 0.6 }}>{name}</span>
      <span style={{ flex: 1 }}></span>
      <span
        style={{
          fontSize: 12,
          opacity: 0.5,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {time}
      </span>
    </div>
  )
}

function PlateCheckRow({ label, time }: { label: string; time: string }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 15 }}
    >
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
        style={{ opacity: 0.55, flexShrink: 0 }}
      >
        <path d="M3 8.5 6.5 12 13 4.5"></path>
      </svg>
      <span style={{ flex: 1 }}>{label}</span>
      <span
        style={{
          fontSize: 12,
          opacity: 0.55,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {time}
      </span>
    </div>
  )
}

const SHOT_W = 880
const SHOT_H = 470
const PLATE_TILT = "rotateX(32deg) rotateZ(-8deg)"

const shotPlateBase: React.CSSProperties = {
  position: "absolute",
  width: 520,
  transform: PLATE_TILT,
  transformOrigin: "0 0",
  borderRadius: 18,
  padding: "18px 22px",
  boxSizing: "border-box",
  overflow: "hidden",
}

/* A flat sky frame for LIVE demos — same atmosphere as the hero shot,
   no perspective: the demo stays fully interactive, floating on the sky. */
export function AtmosphereFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="atmosphere-bg overflow-hidden rounded-2xl border border-border/80 px-[18px] pt-5 pb-[22px] min-[560px]:px-10 min-[560px]:pt-9 min-[560px]:pb-10">
      {children}
    </div>
  )
}

export function AtmosphereShot() {
  return (
    <ShotScaler
      w={SHOT_W}
      h={SHOT_H}
      className="overflow-hidden rounded-2xl border border-border/80"
      role="img"
      aria-label="Three agent runs stacked in perspective: an approval gate awaiting consent, the agent's summary in its own voice, and an observable tool run with step timings."
    >
      <div
        className="atmosphere-bg"
        style={{
          width: SHOT_W,
          height: SHOT_H,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            perspective: "1400px",
            perspectiveOrigin: "30% 26%",
          }}
        >
          {/* back plate — approval gate: consequence + actions */}
          <div
            style={{
              ...shotPlateBase,
              left: -40,
              top: 18,
              height: 330,
              background: "oklch(0.24 0 0 / 0.97)",
              border: "1px solid oklch(0.4 0 0 / 0.7)",
              boxShadow: "0 34px 80px -34px rgb(0 0 0 / 0.55)",
              color: "oklch(0.9 0 0)",
            }}
          >
            <PlateHeader name="vendor-outreach" time="13:48:51" dim={0.85} />
            <div style={{ opacity: 0.8 }}>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
                Send renewal notices to 12 vendors
              </p>
              <p style={{ margin: "5px 0 0", fontSize: 12.5, opacity: 0.55 }}>
                Needs approval · external email
              </p>
              <div style={{ display: "flex", gap: 9, marginTop: 14 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "7px 14px",
                    borderRadius: 8,
                    background: "oklch(0.88 0 0)",
                    color: "oklch(0.25 0 0)",
                  }}
                >
                  Approve &amp; send
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "1px solid oklch(0.42 0 0)",
                  }}
                >
                  Edit first
                </span>
              </div>
            </div>
          </div>

          {/* middle plate — the agent's voice: serif summary */}
          <div
            style={{
              ...shotPlateBase,
              left: 56,
              top: 90,
              height: 330,
              background: "oklch(0.27 0 0 / 0.97)",
              border: "1px solid oklch(0.4 0 0 / 0.7)",
              boxShadow: "0 34px 80px -34px rgb(0 0 0 / 0.55)",
              color: "oklch(0.9 0 0)",
            }}
          >
            <PlateHeader name="renewals-audit" time="13:55:24" dim={0.9} />
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                lineHeight: 1.6,
                letterSpacing: "-0.3px",
                opacity: 0.85,
                maxWidth: 430,
              }}
            >
              Of the 12 contracts I indexed, two auto-renew within 30 days.
              Northwind&rsquo;s terms changed since last cycle — flagging for
              review.
            </p>
          </div>

          {/* front plate — observable work: steps + summary */}
          <div
            style={{
              ...shotPlateBase,
              left: 250,
              top: 160,
              background: "oklch(0.3 0 0)",
              border: "1px solid oklch(0.44 0 0 / 0.8)",
              boxShadow: "0 40px 90px -36px rgb(0 0 0 / 0.6)",
              color: "oklch(0.93 0 0)",
              padding: "20px 24px",
            }}
          >
            <PlateHeader name="procurement-review" time="14:02:08" />
            <div style={{ display: "grid", gap: 12 }}>
              <PlateCheckRow label="Read procurement inbox" time="1.3s" />
              <PlateCheckRow label="Search contract repository" time="2.1s" />
              <PlateCheckRow label="Cross-check renewal dates" time="1.6s" />
              <PlateCheckRow label="Draft summary for review" time="0.9s" />
            </div>
            <div
              style={{
                borderTop: "1px solid oklch(0.42 0 0 / 0.8)",
                marginTop: 15,
                paddingTop: 14,
                fontFamily: "var(--font-serif)",
                fontSize: 15.5,
                lineHeight: 1.55,
                letterSpacing: "-0.3px",
              }}
            >
              I read 47 threads and 12 contracts. Two renewals need attention
              before June 30.
            </div>
          </div>
        </div>
      </div>
    </ShotScaler>
  )
}
