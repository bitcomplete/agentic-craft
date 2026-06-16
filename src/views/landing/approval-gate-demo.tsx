"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusIndicator } from "@/components/ui/status-indicator"

/* Approval gate: locked consequence preview, then commitment. The agent
   renders exactly what will happen before it asks — approve it, or send
   it back with a revision note and watch the draft come back as v2. */

type Phase = "review" | "revising" | "redrafted" | "sent"

function nowStamp() {
  return new Date().toTimeString().slice(0, 8)
}

export function ApprovalGateDemo({ kicker }: { kicker: string }) {
  const [phase, setPhase] = useState<Phase>("review")
  const [revising, setRevising] = useState(false)
  const [note, setNote] = useState("")
  const [flash, setFlash] = useState(false)
  const [sent, setSent] = useState({ at: "14:02:08", revised: false })
  const v2 = phase === "redrafted"

  const approve = () => {
    setSent({ at: nowStamp(), revised: v2 })
    setPhase("sent")
    setFlash(true)
    setTimeout(() => setFlash(false), 700)
  }

  const requestChanges = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    setRevising(false)
    setPhase("revising")
    setTimeout(() => setPhase("redrafted"), 1600)
  }

  const reset = () => {
    setPhase("review")
    setRevising(false)
    setNote("")
  }

  const badge =
    phase === "sent" ? (
      <Badge variant="outline" className="text-[var(--status-ok)]">
        Sent
      </Badge>
    ) : phase === "revising" ? (
      <Badge variant="outline">Revising…</Badge>
    ) : (
      <Badge variant="outline" className="text-[var(--status-warn)]">
        Needs approval
      </Badge>
    )

  return (
    <div>
      <div className="mb-3.5 flex min-h-[30px] items-center justify-between gap-3">
        <span className={kicker}>Approval gate · live</span>
        {phase === "sent" && (
          <Button variant="ghost" size="sm" onClick={reset}>
            Run it again
          </Button>
        )}
      </div>
      <div
        className="overflow-hidden rounded-lg border border-border shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35),0_6px_18px_-10px_rgb(0_0_0/0.16)]"
        style={{
          backgroundColor: flash ? "var(--success-flash)" : "var(--card)",
          transition: "background-color 400ms ease",
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3.5">
          <span className="text-sm font-medium">Send weekly digest</span>
          {badge}
        </div>

        {phase === "sent" ? (
          <div
            role="status"
            className="flex items-center gap-2.5 bg-[var(--success-highlight)] px-4 py-3.5 text-sm tabular-nums"
          >
            <StatusIndicator status="complete" label="Sent" />
            <span>
              Sent to 312 recipients · {sent.at}
              {sent.revised && " · draft v2"}
            </span>
          </div>
        ) : (
          <div className="p-4">
            <div
              aria-label="Locked consequence preview"
              className="grid gap-2 rounded-md border border-border/70 bg-muted px-3.5 py-3"
            >
              <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 text-[0.8125rem] leading-normal">
                <span className="text-muted-foreground">To</span>
                <span className="break-words tabular-nums">
                  312 recipients · customers-active
                </span>
              </div>
              <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 text-[0.8125rem] leading-normal">
                <span className="text-muted-foreground">Subject</span>
                <span className="break-words tabular-nums">
                  {v2
                    ? "Meridian launch update — revised for next week"
                    : "Meridian launch update — week of June 8"}
                </span>
              </div>
              <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 text-[0.8125rem] leading-normal">
                <span className="text-muted-foreground">Schedule</span>
                <span className="break-words tabular-nums">
                  Immediately on approval
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              This preview is locked. What you approve is exactly what sends.
              {v2 && ` Draft v2 · updated ${nowStamp()}.`}
            </p>

            {phase === "revising" ? (
              <div role="status" className="mt-4 flex items-center gap-2.5">
                <StatusIndicator status="active" label="Revising" />
                <span className="text-sm text-muted-foreground">
                  Returned to the agent — revising the draft…
                </span>
              </div>
            ) : revising ? (
              <form className="mt-3 flex gap-2" onSubmit={requestChanges}>
                <Input
                  value={note}
                  autoFocus
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tell the agent what to change"
                  aria-label="Revision note"
                />
                <Button type="submit" variant="secondary">
                  Request changes
                </Button>
              </form>
            ) : (
              <div className="mt-4 flex items-center gap-2.5">
                <Button onClick={approve}>Approve &amp; send</Button>
                <Button variant="secondary" onClick={() => setRevising(true)}>
                  Revise draft
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
