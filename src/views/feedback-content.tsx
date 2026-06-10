"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  Edit01Icon,
  Tick01Icon,
  Clock01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  MessageIcon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AGENT_PROSE_STYLE = {
  fontFamily: "'Source Serif 4', serif",
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
  WebkitFontSmoothing: "antialiased" as const,
}

const AGENT_PROSE_COLOR = "var(--foreground)"

const FEEDBACK_HISTORY = [
  {
    id: "fb-1",
    timestamp: "2026-03-14 · 14:32",
    message:
      "The project brief defines 23 requirements across 5 classes. Implementation notes summarize the workflow behavior and open dependencies.",
    type: "positive" as const,
    detail:
      "Accurate requirement count and implementation notes description confirmed against Brief v3.",
  },
  {
    id: "fb-2",
    timestamp: "2026-03-14 · 11:07",
    message:
      "The launch readiness plan requires dedicated support plan for issue triage procedures.",
    type: "correction" as const,
    detail:
      "Corrected dedicated support plan → standard support plan. enterprise release does not require dedicated support coverage.",
  },
  {
    id: "fb-3",
    timestamp: "2026-03-13 · 16:45",
    message:
      "I've mapped each requirement to its corresponding test case in the review plan. Coverage is at 91.3%.",
    type: "negative" as const,
    detail:
      "Fallback behavior and Cleanup behavior were missing from the mapping. Coverage was overstated.",
  },
  {
    id: "fb-4",
    timestamp: "2026-03-13 · 09:20",
    message:
      "Release QA is complete. All functional tests for the export service passed.",
    type: "positive" as const,
    detail: "Test results verified against release QA checklist.",
  },
  {
    id: "fb-5",
    timestamp: "2026-03-12 · 15:10",
    message:
      "The product boundary includes the billing integration and its configuration up to version 2.4.",
    type: "correction" as const,
    detail:
      "Corrected configuration scope: boundary extends to v2.4.1 per the latest ST addendum.",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function FeedbackContent() {
  /* ── Section 1: Thumbs Feedback ── */
  const [thumbsState, setThumbsState] = useState<Record<string, boolean>>({
    neutral: true,
    positive: false,
    negative: false,
    withCorrection: false,
  })
  const [thumbsSelection, setThumbsSelection] = useState<"up" | "down" | null>(
    null
  )
  const [thumbsFlash, setThumbsFlash] = useState(false)
  const [correctionText, setCorrectionText] = useState("")
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const correctionConfirmRef = useRef<HTMLDivElement>(null)
  const thumbsFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ratingPressedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const ratingConfirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  const handleThumbsToggle = useCallback((key: string) => {
    setThumbsState((prev) => {
      const next = { ...prev }
      // Mutual exclusion: neutral, positive, negative, withCorrection
      for (const k of Object.keys(next)) next[k] = false
      next[key] = true
      return next
    })
    // Reset derived state
    setThumbsFlash(false)
    setCorrectionSubmitted(false)
    setCorrectionText("")
    if (key === "positive") {
      setThumbsSelection("up")
      clearTimeout(thumbsFlashTimerRef.current ?? undefined)
      setThumbsFlash(true)
      thumbsFlashTimerRef.current = setTimeout(() => setThumbsFlash(false), 600)
    } else if (key === "negative") {
      setThumbsSelection("down")
    } else if (key === "withCorrection") {
      setThumbsSelection("down")
      setCorrectionText(
        "enterprise release does not require dedicated support plan — only standard support plan is mandated for issue triage at this level."
      )
    } else {
      setThumbsSelection(null)
    }
  }, [])

  const handleThumbClick = useCallback(
    (which: "up" | "down") => {
      if (thumbsSelection === which) {
        setThumbsSelection(null)
        setThumbsState({
          neutral: true,
          positive: false,
          negative: false,
          withCorrection: false,
        })
        return
      }
      setThumbsSelection(which)
      if (which === "up") {
        setThumbsState({
          neutral: false,
          positive: true,
          negative: false,
          withCorrection: false,
        })
        clearTimeout(thumbsFlashTimerRef.current ?? undefined)
        setThumbsFlash(true)
        thumbsFlashTimerRef.current = setTimeout(
          () => setThumbsFlash(false),
          600
        )
      } else {
        setThumbsState({
          neutral: false,
          positive: false,
          negative: true,
          withCorrection: false,
        })
      }
    },
    [thumbsSelection]
  )

  const handleCorrectionSubmit = useCallback(() => {
    if (!correctionText.trim()) return
    setCorrectionSubmitted(true)
  }, [correctionText])

  // Move focus to the confirmation once, on the submit transition
  useEffect(() => {
    if (correctionSubmitted) correctionConfirmRef.current?.focus()
  }, [correctionSubmitted])

  // Cleanup all timers on unmount — capture ref objects, not their .current values,
  // so the cleanup always sees the latest id when it runs.
  useEffect(() => {
    const tRef = thumbsFlashTimerRef
    const rpRef = ratingPressedTimerRef
    const rcRef = ratingConfirmTimerRef
    return () => {
      clearTimeout(tRef.current ?? undefined)
      clearTimeout(rpRef.current ?? undefined)
      clearTimeout(rcRef.current ?? undefined)
    }
  }, [])

  /* ── Section 2: Inline Correction ── */
  const [corrState, setCorrState] = useState<Record<string, boolean>>({
    original: true,
    corrected: false,
  })

  const handleCorrToggle = useCallback((key: string) => {
    setCorrState(() => {
      const next: Record<string, boolean> = {
        original: false,
        corrected: false,
      }
      next[key] = true
      return next
    })
  }, [])

  /* ── Section 3: Rating Scale ── */
  const [ratingState, setRatingState] = useState<Record<string, boolean>>({
    unrated: true,
    rated: false,
  })
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [ratingPressed, setRatingPressed] = useState<number | null>(null)
  const [ratingConfirm, setRatingConfirm] = useState(false)

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

  /* ── Section 4: Behavioral Consequence ── */
  const [behaviorState, setBehaviorState] = useState<Record<string, boolean>>({
    before: true,
    after: false,
  })

  const handleBehaviorToggle = useCallback((key: string) => {
    setBehaviorState(() => {
      const next: Record<string, boolean> = { before: false, after: false }
      next[key] = true
      return next
    })
  }, [])

  /* ── Section 5: Feedback History ── */
  const [historyState, setHistoryState] = useState<Record<string, boolean>>({
    recent: true,
    all: false,
  })
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const handleHistoryToggle = useCallback((key: string) => {
    setHistoryState(() => {
      const next: Record<string, boolean> = { recent: false, all: false }
      next[key] = true
      return next
    })
    setExpandedRow(null)
  }, [])

  const visibleHistory = historyState.all
    ? FEEDBACK_HISTORY
    : FEEDBACK_HISTORY.slice(0, 3)

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Feedback &amp; Correction
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for collecting reviewer feedback on agent responses — thumbs
          rating, inline corrections, numeric scales, behavioral consequences,
          and feedback history.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Thumbs Feedback                                  */}
      {/* ============================================================ */}
      <section id="thumbs-feedback" className="page-section">
        <p className="section-label mb-3">Rating</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Thumbs Feedback
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Quick signal from the reviewer on response quality. Thumbs up confirms
          accuracy. Thumbs down opens a correction flow for structured
          remediation.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "neutral", label: "Neutral" },
              { key: "positive", label: "Positive" },
              { key: "negative", label: "Negative" },
              { key: "withCorrection", label: "With Correction" },
            ]}
            active={thumbsState}
            onToggle={handleThumbsToggle}
          />

          <div
            className="rounded-lg border border-border/40 p-6"
            ref={thumbsRef}
          >
            {/* Agent message */}
            <div
              className={`transition-colors duration-300 ${
                thumbsFlash ? "feedback-flash-green" : ""
              }`}
            >
              <p
                className="text-base"
                style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
              >
                The project brief defines 23 requirements across 5 classes.
                implementation notes summarize the workflow behavior and open
                dependencies. I&apos;ve mapped each requirement to its
                corresponding test case in the review plan.
              </p>

              {/* Thumbs buttons */}
              <div className="mt-3 flex items-center gap-1">
                <Button
                  type="button"
                  onClick={() => handleThumbClick("up")}
                  aria-label="Mark response as helpful"
                  aria-pressed={thumbsSelection === "up"}
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "text-muted-foreground/50 hover:text-muted-foreground",
                    thumbsSelection === "up" &&
                      "feedback-press bg-foreground/[0.06] text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={ThumbsUpIcon} strokeWidth={1.5} />
                </Button>
                <Button
                  type="button"
                  onClick={() => handleThumbClick("down")}
                  aria-label="Mark response as not helpful"
                  aria-pressed={thumbsSelection === "down"}
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "text-muted-foreground/50 hover:text-muted-foreground",
                    thumbsSelection === "down" &&
                      "feedback-press bg-foreground/[0.06] text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={ThumbsDownIcon} strokeWidth={1.5} />
                </Button>
              </div>

              {/* Correction textarea — shown on negative or withCorrection */}
              {thumbsSelection === "down" && (
                <div className="feedback-expand mt-3">
                  {correctionSubmitted ? (
                    <div
                      ref={correctionConfirmRef}
                      tabIndex={-1}
                      role="status"
                      className="feedback-fade-in flex items-center gap-2 border-l border-foreground/15 bg-foreground/[0.02] py-2 pl-3"
                    >
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                      <span className="text-sm text-muted-foreground">
                        Correction recorded — the agent will apply this in
                        future responses.
                      </span>
                    </div>
                  ) : (
                    <form
                      className="flex flex-col gap-2"
                      onSubmit={(event) => {
                        event.preventDefault()
                        handleCorrectionSubmit()
                      }}
                    >
                      <Field>
                        <FieldLabel
                          htmlFor="feedback-correction"
                          className="sr-only"
                        >
                          Correction feedback
                        </FieldLabel>
                        <Textarea
                          id="feedback-correction"
                          name="feedback-correction"
                          aria-label="Correction feedback"
                          value={correctionText}
                          onChange={(e) => setCorrectionText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                              e.preventDefault()
                              handleCorrectionSubmit()
                            }
                          }}
                          placeholder="What should be different?"
                          rows={3}
                          className="resize-none"
                        />
                      </Field>
                      <div className="mt-2 flex justify-end">
                        <Button
                          type="submit"
                          disabled={!correctionText.trim()}
                          variant="outline"
                          size="xs"
                        >
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            strokeWidth={1.5}
                            data-icon="inline-start"
                          />
                          Submit correction
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                State
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Trigger
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Neutral",
                "Default",
                "Thumbs visible at half opacity, no selection",
              ],
              [
                "Positive",
                "Thumbs up clicked",
                "Brief green flash confirms, selection persists",
              ],
              [
                "Negative",
                "Thumbs down clicked",
                "Correction textarea expands below the message",
              ],
              [
                "With Correction",
                "Submit button or Cmd/Ctrl+Enter",
                "Textarea pre-filled, submit records the correction",
              ],
            ].map(([state, trigger, behavior], i) => (
              <TableRow
                key={state}
                className={i < 3 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">
                  {state}
                </TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {trigger}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {behavior}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Thumbs appear at reduced opacity until hover, keeping the reading
          experience clean. A thumbs-down always opens the correction flow —
          negative signal without context is less useful than a directed
          correction.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Inline Correction                                */}
      {/* ============================================================ */}
      <section id="inline-correction" className="page-section">
        <p className="section-label mb-3">Editing</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Inline Correction
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Direct editing of agent prose when a specific factual error is
          identified — typically an incorrect launch plan reference or misquoted
          launch requirement.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "original", label: "Original" },
              { key: "corrected", label: "Corrected" },
            ]}
            active={corrState}
            onToggle={handleCorrToggle}
          />

          <div className="rounded-lg border border-border/40 p-6">
            <div>
              {corrState.original ? (
                <p
                  className="text-base"
                  style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                >
                  The launch readiness plan requires{" "}
                  <span className="relative inline-flex items-baseline gap-1.5">
                    <span className="rounded-md bg-foreground/[0.06] px-1">
                      dedicated support plan
                    </span>
                    <Button
                      type="button"
                      onClick={() => handleCorrToggle("corrected")}
                      variant="outline"
                      size="xs"
                    >
                      <HugeiconsIcon
                        icon={Edit01Icon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Fix this
                    </Button>
                  </span>{" "}
                  for issue triage procedures. This pattern ensures that the
                  team has an explicit process to track and correct issues
                  reported by users.
                </p>
              ) : (
                <div className="feedback-fade-in">
                  <p
                    className="text-base"
                    style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                  >
                    The launch readiness plan requires{" "}
                    <span className="feedback-highlight-in rounded-md px-1">
                      standard support plan
                    </span>{" "}
                    for issue triage procedures. This pattern ensures that the
                    team has an explicit process to track and correct issues
                    reported by users.
                  </p>
                  <div className="feedback-slide-in mt-3 flex items-center gap-2">
                    <Badge variant="outline">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        strokeWidth={1.5}
                        data-icon="inline-start"
                      />
                      Applied
                    </Badge>
                    <span className="text-xs text-muted-foreground/60">
                      dedicated support plan → standard support plan
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                State
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Visual
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Original",
                "Error text with subtle highlight + edit button",
                "Clicking the edit button transitions to corrected state",
              ],
              [
                "Corrected",
                "Replacement text with green-tinted highlight",
                "Applied tag appears with before → after summary",
              ],
            ].map(([state, visual, behavior], i) => (
              <TableRow
                key={state}
                className={i < 1 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">
                  {state}
                </TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {visual}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {behavior}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Inline corrections are scoped to specific factual errors — typically
          launch plan misreferences or incorrect readiness level claims. The
          correction is applied in-place so the reviewer sees the fix in context
          rather than receiving a full regeneration.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Rating Scale                                     */}
      {/* ============================================================ */}
      <section id="rating-scale" className="page-section">
        <p className="section-label mb-3">Assessment</p>
        <h2 className="text-xl font-semibold tracking-tight">Rating Scale</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Numeric quality rating for agent responses, used to build a
          calibration dataset over time. More granular than thumbs, less
          intrusive than a full correction.
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

      {/* ============================================================ */}
      {/*  Section 4 — Behavioral Consequence                           */}
      {/* ============================================================ */}
      <section id="behavioral-consequence" className="page-section">
        <p className="section-label mb-3">Adaptation</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Behavioral Consequence
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          How the agent&apos;s behavior visibly changes after receiving
          feedback. Demonstrates the feedback loop closing — the reviewer sees
          the before and after side by side.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "before", label: "Before" },
              { key: "after", label: "After" },
            ]}
            active={behaviorState}
            onToggle={handleBehaviorToggle}
          />

          <div className="rounded-lg border border-border/40 p-6">
            {behaviorState.before ? (
              <div>
                <p
                  className="text-base"
                  style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                >
                  The launch readiness plan requires dedicated support plan for
                  issue triage procedures. This pattern ensures that the team
                  has an explicit process to track and correct issues reported
                  by users of the product.
                </p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-muted-foreground/50">
                    <HugeiconsIcon
                      icon={ThumbsUpIcon}
                      size={14}
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="text-muted-foreground/50">
                    <HugeiconsIcon
                      icon={ThumbsDownIcon}
                      size={14}
                      strokeWidth={1.5}
                    />
                  </span>
                </div>
              </div>
            ) : (
              <div className="feedback-fade-in flex flex-col gap-3">
                <div>
                  <p
                    className="text-base"
                    style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                  >
                    The launch readiness plan requires{" "}
                    <span className="feedback-highlight-in rounded-md px-1">
                      standard support plan
                    </span>{" "}
                    for issue triage procedures. This pattern ensures that the
                    team has an explicit process to track and correct issues
                    reported by users of the product.
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-foreground/60">
                      <HugeiconsIcon
                        icon={ThumbsUpIcon}
                        size={14}
                        strokeWidth={1.5}
                      />
                    </span>
                    <span className="text-muted-foreground/50">
                      <HugeiconsIcon
                        icon={ThumbsDownIcon}
                        size={14}
                        strokeWidth={1.5}
                      />
                    </span>
                  </div>
                </div>

                {/* Annotation */}
                <div className="feedback-slide-in flex items-start gap-3 border-l border-foreground/15 bg-foreground/[0.02] py-3 pl-3">
                  <HugeiconsIcon
                    icon={MessageIcon}
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">
                        Correction applied
                      </span>{" "}
                      — dedicated support plan → standard support plan
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Linked to feedback from 2026-03-14 · 11:07. The agent now
                      correctly references the base issue triage component for
                      enterprise release reviews.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                State
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Content
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Purpose
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Before",
                "Original agent response with error",
                "Establishes baseline for comparison",
              ],
              [
                "After",
                "Corrected response with annotation",
                "Shows the loop closing — feedback produces visible change",
              ],
            ].map(([state, content, purpose], i) => (
              <TableRow
                key={state}
                className={i < 1 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">
                  {state}
                </TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {content}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {purpose}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          Closing the feedback loop visibly builds trust. The annotation card
          links back to the original feedback entry so the reviewer can trace
          exactly which correction produced the behavioral change.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Feedback History                                  */}
      {/* ============================================================ */}
      <section id="feedback-history" className="page-section">
        <p className="section-label mb-3">Record</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Feedback History
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A running log of all reviewer feedback — positive signals, negative
          signals, and corrections. Provides an audit trail and training
          reference for the agent.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "recent", label: "Recent" },
              { key: "all", label: "All" },
            ]}
            active={historyState}
            onToggle={handleHistoryToggle}
          />

          <div className="rounded-lg border border-border/40 p-6">
            <div className="flex flex-col gap-0">
              {visibleHistory.map((entry, i) => {
                const isExpanded = expandedRow === entry.id
                return (
                  <div
                    key={entry.id}
                    className={
                      i < visibleHistory.length - 1
                        ? "border-b border-border/40"
                        : ""
                    }
                  >
                    <button
                      type="button"
                      aria-label={`Toggle feedback history entry: ${entry.message}`}
                      onClick={() =>
                        setExpandedRow(isExpanded ? null : entry.id)
                      }
                      className="flex w-full items-start gap-3 rounded-md px-2 py-3 text-left transition-colors hover:bg-muted/30"
                    >
                      {/* Type indicator */}
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                          entry.type === "positive"
                            ? "bg-foreground/[0.04]"
                            : entry.type === "negative"
                              ? "bg-foreground/[0.04]"
                              : "bg-foreground/[0.04]"
                        }`}
                      >
                        {entry.type === "positive" ? (
                          <HugeiconsIcon
                            icon={ThumbsUpIcon}
                            size={11}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                        ) : entry.type === "negative" ? (
                          <HugeiconsIcon
                            icon={ThumbsDownIcon}
                            size={11}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={Edit01Icon}
                            size={11}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                        )}
                      </span>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground/60">
                            <HugeiconsIcon
                              icon={Clock01Icon}
                              size={10}
                              strokeWidth={1.5}
                              className="mr-1 inline"
                            />
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-foreground/80">
                          {entry.message}
                        </p>
                      </div>

                      {/* Expand arrow */}
                      <HugeiconsIcon
                        icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="mt-1.5 shrink-0 text-muted-foreground/40"
                      />
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="feedback-expand mb-3 ml-8 px-2">
                        <div className="feedback-slide-in border-l border-border/60 bg-foreground/[0.01] py-2 pl-3">
                          <p className="text-sm text-muted-foreground">
                            {entry.detail}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {historyState.recent && (
              <div className="mt-3 flex flex-col gap-3">
                <Separator />
                <Button
                  type="button"
                  onClick={() => handleHistoryToggle("all")}
                  variant="ghost"
                  size="xs"
                  className="w-fit text-muted-foreground/60 hover:text-muted-foreground"
                >
                  Show all {FEEDBACK_HISTORY.length} entries
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <Table className="mt-10 w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Column
              </TableHead>
              <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
                Content
              </TableHead>
              <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Notes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Type",
                "Positive / Negative / Correction",
                "Icon-coded, monochrome",
              ],
              [
                "Timestamp",
                "Date and time of feedback",
                "Sorted most recent first",
              ],
              [
                "Message",
                "Excerpt of the rated agent response",
                "Truncated to one line, full text on expand",
              ],
              [
                "Detail",
                "Reviewer's note or correction text",
                "Visible only when row is expanded",
              ],
            ].map(([col, content, notes], i) => (
              <TableRow
                key={col}
                className={i < 3 ? "border-b border-border/50" : ""}
              >
                <TableCell className="py-2.5 pr-6 font-medium">{col}</TableCell>
                <TableCell className="py-2.5 pr-6 text-muted-foreground">
                  {content}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {notes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
          The feedback history doubles as an audit trail — useful for compliance
          reviews where traceability of reviewer decisions matters. Expandable
          rows keep the list scannable while preserving full detail on demand.
        </div>
      </section>
    </article>
  )
}
