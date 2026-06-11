"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  Tick01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { PatternControls as Controls } from "@/components/pattern-controls"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { AGENT_PROSE_COLOR } from "./data"

export function ThumbsFeedbackSection() {
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

  // Cleanup timer on unmount
  useEffect(() => {
    const tRef = thumbsFlashTimerRef
    return () => {
      clearTimeout(tRef.current ?? undefined)
    }
  }, [])

  return (
    <section id="thumbs-feedback" className="page-section">
      <p className="section-label mb-3">Rating</p>
      <h2 className="text-xl font-semibold tracking-tight">Thumbs Feedback</h2>
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
          className="rounded-lg border border-border/40 p-4 sm:p-6"
          ref={thumbsRef}
        >
          {/* Agent message */}
          <div
            className={`transition-colors duration-150 ${
              thumbsFlash ? "feedback-flash-green" : ""
            }`}
          >
            <p
              className="agent-prose text-base"
              style={{ color: AGENT_PROSE_COLOR }}
            >
              The project brief defines 23 requirements across 5 classes.
              implementation notes summarize the workflow behavior and open
              dependencies. I&apos;ve mapped each requirement to its
              corresponding test case in the review plan.
            </p>

            {/* Thumbs buttons */}
            <div className="mt-3 flex items-center gap-1 [@media(pointer:coarse)]:gap-3">
              <Button
                type="button"
                onClick={() => handleThumbClick("up")}
                aria-label="Mark response as helpful"
                aria-pressed={thumbsSelection === "up"}
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "text-muted-foreground/70 hover:text-muted-foreground",
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
                  "text-muted-foreground/70 hover:text-muted-foreground",
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
                      Correction recorded — the agent will apply this in future
                      responses.
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
              "Thumbs visible at opacity /70, no selection",
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
              <TableCell className="py-2.5 pr-6 font-medium">{state}</TableCell>
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
    </section>
  )
}
