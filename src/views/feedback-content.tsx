'use client'

import { useState, useEffect, useCallback, useRef } from "react"
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

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "feedback-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes feedback-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes feedback-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes feedback-flash-green {
      0% { background-color: transparent; }
      30% { background-color: oklch(0.72 0.15 155 / 0.15); }
      100% { background-color: transparent; }
    }
    @keyframes feedback-press {
      0% { transform: scale(1); }
      40% { transform: scale(0.92); }
      100% { transform: scale(1); }
    }
    @keyframes feedback-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 400px; opacity: 1; }
    }
    @keyframes feedback-highlight-in {
      from { background-color: transparent; }
      to { background-color: oklch(0.72 0.15 155 / 0.08); }
    }
    .feedback-slide-in {
      animation: feedback-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .feedback-fade-in {
      animation: feedback-fade-in 0.2s ease forwards;
    }
    .feedback-flash-green {
      animation: feedback-flash-green 0.6s ease;
    }
    .feedback-press {
      animation: feedback-press 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .feedback-expand {
      animation: feedback-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .feedback-highlight-in {
      animation: feedback-highlight-in 0.4s ease forwards;
    }
  `
  document.head.appendChild(style)
}

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

const AGENT_PROSE_COLOR = "oklch(0.2642 0.013 93.9)"

const FEEDBACK_HISTORY = [
  {
    id: "fb-1",
    timestamp: "2026-03-14 · 14:32",
    message: "The checkout release covers 14 acceptance criteria across UX, QA, and rollout readiness.",
    type: "positive" as const,
    detail: "Requirement count and checklist grouping confirmed against the launch brief.",
  },
  {
    id: "fb-2",
    timestamp: "2026-03-14 · 11:07",
    message: "The rollout should go to 100% immediately after merge.",
    type: "correction" as const,
    detail: "Corrected to staged rollout. The launch plan requires 10% → 50% → 100% with rollback ready at each step.",
  },
  {
    id: "fb-3",
    timestamp: "2026-03-13 · 16:45",
    message: "I mapped every launch requirement to implementation and QA evidence. Coverage is at 91.3%.",
    type: "negative" as const,
    detail: "Rollback ownership and analytics verification were still missing, so coverage was overstated.",
  },
  {
    id: "fb-4",
    timestamp: "2026-03-13 · 09:20",
    message: "Smoke testing is complete. All critical checkout flows passed in staging.",
    type: "positive" as const,
    detail: "Results verified against the latest regression and smoke-check artifacts.",
  },
  {
    id: "fb-5",
    timestamp: "2026-03-12 · 15:10",
    message: "The release scope includes the pricing page experiment and the mobile summary refresh.",
    type: "correction" as const,
    detail: "Corrected scope: the pricing experiment is included, but the mobile summary refresh is deferred to the next release.",
  },
]

/* ------------------------------------------------------------------ */
/*  Controls component                                                 */
/* ------------------------------------------------------------------ */

function Controls({
  options,
  active,
  onToggle,
}: {
  options: { key: string; label: string }[]
  active: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-5">
      <span className="section-label mr-1">Controls</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className={`
            relative text-xs px-2.5 py-1 rounded-md border transition-all duration-200
            ${active[opt.key]
              ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
        >
          {opt.label}
          {active[opt.key] && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
          )}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function FeedbackContent() {
  useEffect(ensureStyles, [])

  /* ── Section 1: Thumbs Feedback ── */
  const [thumbsState, setThumbsState] = useState<Record<string, boolean>>({
    neutral: true,
    positive: false,
    negative: false,
    withCorrection: false,
  })
  const [thumbsSelection, setThumbsSelection] = useState<"up" | "down" | null>(null)
  const [thumbsFlash, setThumbsFlash] = useState(false)
  const [correctionText, setCorrectionText] = useState("")
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false)
  const thumbsRef = useRef<HTMLDivElement>(null)

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
      setThumbsFlash(true)
      setTimeout(() => setThumbsFlash(false), 600)
    } else if (key === "negative") {
      setThumbsSelection("down")
    } else if (key === "withCorrection") {
      setThumbsSelection("down")
      setCorrectionText("The release should not go to 100% immediately — the launch plan requires a staged rollout with rollback ready at each step.")
    } else {
      setThumbsSelection(null)
    }
  }, [])

  const handleThumbClick = useCallback((which: "up" | "down") => {
    if (thumbsSelection === which) {
      setThumbsSelection(null)
      return
    }
    setThumbsSelection(which)
    if (which === "up") {
      setThumbsFlash(true)
      setTimeout(() => setThumbsFlash(false), 600)
    }
  }, [thumbsSelection])

  const handleCorrectionSubmit = useCallback(() => {
    if (!correctionText.trim()) return
    setCorrectionSubmitted(true)
  }, [correctionText])

  /* ── Section 2: Inline Correction ── */
  const [corrState, setCorrState] = useState<Record<string, boolean>>({
    original: true,
    corrected: false,
  })

  const handleCorrToggle = useCallback((key: string) => {
    setCorrState(() => {
      const next: Record<string, boolean> = { original: false, corrected: false }
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
    setTimeout(() => setRatingPressed(null), 250)
    setSelectedRating(n)
    setRatingConfirm(true)
    setTimeout(() => setRatingConfirm(false), 2500)
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

  const visibleHistory = historyState.all ? FEEDBACK_HISTORY : FEEDBACK_HISTORY.slice(0, 3)

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Feedback &amp; Correction
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for collecting evaluator feedback on agent responses —
          thumbs rating, inline corrections, numeric scales, behavioral
          consequences, and feedback history.
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
          Quick signal from the evaluator on response quality. Thumbs up
          confirms accuracy. Thumbs down opens a correction flow for
          structured remediation.
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

          <div className="border border-border/40 rounded-lg p-6" ref={thumbsRef}>
            {/* Agent message */}
            <div
              className={`rounded-lg border border-border/40 p-4 transition-colors duration-300 ${
                thumbsFlash ? "feedback-flash-green" : ""
              }`}
            >
              <p
                className="text-base"
                style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
              >
                The Security Target defines 14 SFRs across 5 classes.
                ADV_FSP.1 requires a functional specification with a
                complete summary of the TSFI. I&apos;ve mapped each SFR to
                its corresponding test case in the evaluation work plan.
              </p>

              {/* Thumbs buttons */}
              <div className="mt-3 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleThumbClick("up")}
                  className={`rounded-md p-1.5 transition-colors ${
                    thumbsSelection === "up"
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  } ${thumbsSelection === "up" ? "feedback-press" : ""}`}
                >
                  <HugeiconsIcon icon={ThumbsUpIcon} size={14} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => handleThumbClick("down")}
                  className={`rounded-md p-1.5 transition-colors ${
                    thumbsSelection === "down"
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  } ${thumbsSelection === "down" ? "feedback-press" : ""}`}
                >
                  <HugeiconsIcon icon={ThumbsDownIcon} size={14} strokeWidth={1.5} />
                </button>
              </div>

              {/* Correction textarea — shown on negative or withCorrection */}
              {thumbsSelection === "down" && (
                <div className="mt-3 feedback-expand">
                  {correctionSubmitted ? (
                    <div className="flex items-center gap-2 rounded-md border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 feedback-fade-in">
                      <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Correction recorded — the agent will apply this in future responses.
                      </span>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={correctionText}
                        onChange={(e) => setCorrectionText(e.target.value)}
                        placeholder="What should be different?"
                        rows={3}
                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleCorrectionSubmit}
                          disabled={!correctionText.trim()}
                          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={1.5} />
                          Submit correction
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                State
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Trigger
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Neutral", "Default", "Thumbs visible at half opacity, no selection"],
              ["Positive", "Thumbs up clicked", "Brief green flash confirms, selection persists"],
              ["Negative", "Thumbs down clicked", "Correction textarea expands below the message"],
              ["With Correction", "Submit button or Enter", "Textarea pre-filled, submit records the correction"],
            ].map(([state, trigger, behavior], i) => (
              <tr key={state} className={i < 3 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{state}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{trigger}</td>
                <td className="py-2.5 text-muted-foreground">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Thumbs appear at reduced opacity until hover, keeping the reading
          experience clean. A thumbs-down always opens the correction flow —
          negative signal without context is less useful than a directed correction.
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
          identified — typically an incorrect CC component reference or
          misquoted assurance requirement.
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

          <div className="border border-border/40 rounded-lg p-6">
            <div className="rounded-lg border border-border/40 p-4">
              {corrState.original ? (
                <p
                  className="text-base"
                  style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                >
                  The evaluation assurance level requires{" "}
                  <span className="relative inline-flex items-baseline gap-1.5">
                    <span className="rounded-md bg-foreground/[0.06] px-1">
                      ALC_FLR.2
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCorrToggle("corrected")}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
                    >
                      <HugeiconsIcon icon={Edit01Icon} size={10} strokeWidth={1.5} />
                      Fix this
                    </button>
                  </span>{" "}
                  for flaw remediation procedures. This component ensures that
                  the developer has established procedures to track and correct
                  security flaws reported by users.
                </p>
              ) : (
                <div className="feedback-fade-in">
                  <p
                    className="text-base"
                    style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                  >
                    The evaluation assurance level requires{" "}
                    <span className="rounded-md px-1 feedback-highlight-in" style={{ backgroundColor: "oklch(0.72 0.15 155 / 0.08)" }}>
                      ALC_FLR.1
                    </span>{" "}
                    for flaw remediation procedures. This component ensures that
                    the developer has established procedures to track and correct
                    security flaws reported by users.
                  </p>
                  <div className="mt-3 flex items-center gap-2 feedback-slide-in">
                    <span className="flex items-center gap-1.5 rounded-md border border-foreground/10 bg-foreground/[0.02] px-2 py-1 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={1.5} />
                      Applied
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      ALC_FLR.2 → ALC_FLR.1
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                State
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Visual
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Original", "Error text with subtle highlight + edit button", "Clicking the edit button transitions to corrected state"],
              ["Corrected", "Replacement text with green-tinted highlight", "Applied tag appears with before → after summary"],
            ].map(([state, visual, behavior], i) => (
              <tr key={state} className={i < 1 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{state}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{visual}</td>
                <td className="py-2.5 text-muted-foreground">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Inline corrections are scoped to specific factual errors — typically CC
          component misreferences or incorrect assurance level claims. The
          correction is applied in-place so the evaluator sees the fix in context
          rather than receiving a full regeneration.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Rating Scale                                     */}
      {/* ============================================================ */}
      <section id="rating-scale" className="page-section">
        <p className="section-label mb-3">Assessment</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Rating Scale
        </h2>
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

          <div className="border border-border/40 rounded-lg p-6">
            <div className="rounded-lg border border-border/40 p-4">
              <p
                className="text-base"
                style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
              >
                Based on the Protection Profile PP-CIMC-SLv3, the TOE must
                implement FCS_COP.1 for AES-256-GCM and FCS_CKM.1 for
                RSA-4096 key generation. Both are covered by the ACME
                cryptographic module&apos;s FIPS 140-3 certification.
              </p>

              {/* Rating row */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-muted-foreground/60">Rate this response</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleRatingClick(n)}
                      className={`
                        flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all duration-150
                        ${ratingPressed === n ? "feedback-press" : ""}
                        ${selectedRating === n
                          ? "border border-foreground/20 bg-foreground/[0.06] text-foreground font-medium"
                          : "border border-transparent text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50"
                        }
                      `}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {ratingConfirm && (
                  <span className="text-xs text-muted-foreground/60 feedback-fade-in">
                    Feedback recorded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Rating
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Meaning
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Agent Response
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "Incorrect or harmful", "Flagged for immediate review, excluded from training"],
              ["2", "Mostly wrong", "Queued for regeneration with guided corrections"],
              ["3", "Partially correct", "Logged as neutral — no behavioral change"],
              ["4", "Good with minor issues", "Reinforced with small adjustments noted"],
              ["5", "Excellent", "Reinforced as-is, used as positive calibration example"],
            ].map(([rating, meaning, response], i) => (
              <tr key={rating} className={i < 4 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{rating}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{meaning}</td>
                <td className="py-2.5 text-muted-foreground">{response}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Numbered buttons rather than stars — the scale is intentionally
          utilitarian. Evaluators are accustomed to EAL numeric levels and
          respond well to explicit ordinal scales. The brief confirmation
          message auto-dismisses to avoid interrupting workflow.
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
          feedback. Demonstrates the feedback loop closing — the evaluator
          sees the before and after side by side.
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

          <div className="border border-border/40 rounded-lg p-6">
            {behaviorState.before ? (
              <div className="rounded-lg border border-border/40 p-4">
                <p
                  className="text-base"
                  style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                >
                  The evaluation assurance level requires ALC_FLR.2 for
                  flaw remediation procedures. This component ensures that
                  the developer has established procedures to track and
                  correct security flaws reported by users of the TOE.
                </p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-muted-foreground/50">
                    <HugeiconsIcon icon={ThumbsUpIcon} size={14} strokeWidth={1.5} />
                  </span>
                  <span className="text-muted-foreground/50">
                    <HugeiconsIcon icon={ThumbsDownIcon} size={14} strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 feedback-fade-in">
                <div className="rounded-lg border border-border/40 p-4">
                  <p
                    className="text-base"
                    style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}
                  >
                    The evaluation assurance level requires{" "}
                    <span className="rounded-md px-1" style={{ backgroundColor: "oklch(0.72 0.15 155 / 0.08)" }}>
                      ALC_FLR.1
                    </span>{" "}
                    for flaw remediation procedures. This component ensures that
                    the developer has established procedures to track and
                    correct security flaws reported by users of the TOE.
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-foreground/60">
                      <HugeiconsIcon icon={ThumbsUpIcon} size={14} strokeWidth={1.5} />
                    </span>
                    <span className="text-muted-foreground/50">
                      <HugeiconsIcon icon={ThumbsDownIcon} size={14} strokeWidth={1.5} />
                    </span>
                  </div>
                </div>

                {/* Annotation */}
                <div className="flex items-start gap-3 rounded-md border border-foreground/10 bg-foreground/[0.02] px-4 py-3 feedback-slide-in">
                  <HugeiconsIcon icon={MessageIcon} size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">Correction applied</span>{" "}
                      — ALC_FLR.2 → ALC_FLR.1
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Linked to feedback from 2026-03-14 · 11:07. The agent now
                      correctly references the base flaw remediation component
                      for EAL4 augmented evaluations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                State
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Content
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Before", "Original agent response with error", "Establishes baseline for comparison"],
              ["After", "Corrected response with annotation", "Shows the loop closing — feedback produces visible change"],
            ].map(([state, content, purpose], i) => (
              <tr key={state} className={i < 1 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{state}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{content}</td>
                <td className="py-2.5 text-muted-foreground">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Closing the feedback loop visibly builds trust. The annotation card
          links back to the original feedback entry so the evaluator can trace
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
          A running log of all evaluator feedback — positive signals, negative
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

          <div className="border border-border/40 rounded-lg p-6">
            <div className="space-y-0">
              {visibleHistory.map((entry, i) => {
                const isExpanded = expandedRow === entry.id
                return (
                  <div key={entry.id} className={i < visibleHistory.length - 1 ? "border-b border-border/40" : ""}>
                    <button
                      type="button"
                      onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
                      className="flex w-full items-start gap-3 py-3 text-left transition-colors hover:bg-muted/30 px-2 rounded-md"
                    >
                      {/* Type indicator */}
                      <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                        entry.type === "positive"
                          ? "bg-foreground/[0.04]"
                          : entry.type === "negative"
                            ? "bg-foreground/[0.04]"
                            : "bg-foreground/[0.04]"
                      }`}>
                        {entry.type === "positive" ? (
                          <HugeiconsIcon icon={ThumbsUpIcon} size={11} strokeWidth={1.5} className="text-muted-foreground" />
                        ) : entry.type === "negative" ? (
                          <HugeiconsIcon icon={ThumbsDownIcon} size={11} strokeWidth={1.5} className="text-muted-foreground" />
                        ) : (
                          <HugeiconsIcon icon={Edit01Icon} size={11} strokeWidth={1.5} className="text-muted-foreground" />
                        )}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground/60">
                            <HugeiconsIcon icon={Clock01Icon} size={10} strokeWidth={1.5} className="inline mr-1" />
                            {entry.timestamp}
                          </span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                            entry.type === "positive"
                              ? "bg-foreground/[0.04] text-muted-foreground"
                              : entry.type === "negative"
                                ? "bg-foreground/[0.04] text-muted-foreground"
                                : "bg-foreground/[0.04] text-muted-foreground"
                          }`}>
                            {entry.type}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-foreground/80 truncate">
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
                      <div className="ml-8 mb-3 px-2 feedback-expand">
                        <div className="rounded-md border border-border/40 bg-foreground/[0.01] px-3 py-2.5 feedback-slide-in">
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
              <div className="mt-3 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => handleHistoryToggle("all")}
                  className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  Show all {FEEDBACK_HISTORY.length} entries
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Column
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Content
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Type", "Positive / Negative / Correction", "Icon-coded, monochrome"],
              ["Timestamp", "Date and time of feedback", "Sorted most recent first"],
              ["Message", "Excerpt of the rated agent response", "Truncated to one line, full text on expand"],
              ["Detail", "Evaluator's note or correction text", "Visible only when row is expanded"],
            ].map(([col, content, notes], i) => (
              <tr key={col} className={i < 3 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{col}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{content}</td>
                <td className="py-2.5 text-muted-foreground">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The feedback history doubles as an audit trail — useful for CC
          evaluations where traceability of evaluator decisions matters.
          Expandable rows keep the list scannable while preserving full detail
          on demand.
        </div>
      </section>
    </article>
  )
}
