"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { PatternControls as Controls } from "@/components/pattern-controls"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AGENT_PROSE_STYLE = {
  fontFamily: "'Source Serif 4', serif",
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
  WebkitFontSmoothing: "antialiased" as const,
}

const AGENT_PROSE_COLOR = "var(--foreground)"

export function RatingScaleSection() {
  const [ratingState, setRatingState] = useState<Record<string, boolean>>({
    unrated: true,
    rated: false,
  })
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [ratingPressed, setRatingPressed] = useState<number | null>(null)
  const [ratingConfirm, setRatingConfirm] = useState(false)
  const ratingPressedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const ratingConfirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  const handleRatingToggle = useCallback((key: string) => {
    setRatingState(() => {
      const next: Record<string, boolean> = { unrated: false, rated: false }
      next[key] = true
      return next
    })
    if (key === "rated") {
      setSelectedRating(4)
      setRatingConfirm(true)
    } else {
      setSelectedRating(null)
      setRatingConfirm(false)
    }
  }, [])

  const handleRatingClick = useCallback((n: number) => {
    setRatingPressed(n)
    clearTimeout(ratingPressedTimerRef.current ?? undefined)
    ratingPressedTimerRef.current = setTimeout(
      () => setRatingPressed(null),
      250
    )
    setSelectedRating(n)
    setRatingConfirm(true)
    clearTimeout(ratingConfirmTimerRef.current ?? undefined)
    ratingConfirmTimerRef.current = setTimeout(
      () => setRatingConfirm(false),
      2500
    )
  }, [])

  // Cleanup timers on unmount
  useEffect(() => {
    const rpRef = ratingPressedTimerRef
    const rcRef = ratingConfirmTimerRef
    return () => {
      clearTimeout(rpRef.current ?? undefined)
      clearTimeout(rcRef.current ?? undefined)
    }
  }, [])

  return (
    <section id="rating-scale" className="page-section">
      <p className="section-label mb-3">Assessment</p>
      <h2 className="text-xl font-semibold tracking-tight">Rating Scale</h2>
      <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
        Numeric quality rating for agent responses, used to build a calibration
        dataset over time. More granular than thumbs, less intrusive than a full
        correction.
      </p>

      <div className="mt-10">
        <Controls
          options={[
            { key: "unrated", label: "Unrated" },
            { key: "rated", label: "Rated" },
          ]}
          active={ratingState}
          onToggle={handleRatingToggle}
        />

        <div className="rounded-lg border border-border/40 p-6">
          <div>
            <p
              className="text-base"
              style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
            >
              Based on the launch policy, the product must implement Export
              workflow for CSV and JSON exports and Retention setting for
              account retention. Both are covered by the ACME export
              service&apos;s internal platform approval.
            </p>

            {/* Rating row */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-muted-foreground/60">
                Rate this response
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleRatingClick(n)}
                    aria-label={`Rate response ${n} out of 5`}
                    aria-pressed={selectedRating === n}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors duration-150 ${ratingPressed === n ? "feedback-press" : ""} ${
                      selectedRating === n
                        ? "border border-foreground/20 bg-foreground/[0.06] font-medium text-foreground"
                        : "border border-transparent text-muted-foreground/50 hover:bg-muted/50 hover:text-muted-foreground"
                    } `}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {ratingConfirm && (
                <span
                  role="status"
                  className="feedback-fade-in text-xs text-muted-foreground/60"
                >
                  Feedback recorded
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Rating
            </TableHead>
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Meaning
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Agent Response
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              "1",
              "Incorrect or harmful",
              "Flagged for immediate review, excluded from training",
            ],
            [
              "2",
              "Mostly wrong",
              "Queued for regeneration with guided corrections",
            ],
            [
              "3",
              "Partially correct",
              "Logged as neutral — no behavioral change",
            ],
            [
              "4",
              "Good with minor issues",
              "Reinforced with small adjustments noted",
            ],
            [
              "5",
              "Excellent",
              "Reinforced as-is, used as positive calibration example",
            ],
          ].map(([rating, meaning, response], i) => (
            <TableRow
              key={rating}
              className={i < 4 ? "border-b border-border/50" : ""}
            >
              <TableCell className="py-2.5 pr-6 font-medium">
                {rating}
              </TableCell>
              <TableCell className="py-2.5 pr-6 text-muted-foreground">
                {meaning}
              </TableCell>
              <TableCell className="py-2.5 text-muted-foreground">
                {response}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        Numbered buttons rather than stars — the scale is intentionally
        utilitarian. Reviewers are accustomed to readiness labels and respond
        well to explicit ordinal scales. The brief confirmation message
        auto-dismisses to avoid interrupting workflow.
      </div>
    </section>
  )
}
