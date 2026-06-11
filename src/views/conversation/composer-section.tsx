"use client"

import { CompactComposerPlayground } from "../../components/InteractiveComposer"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COMPOSER_CHECKS = [
  {
    check: "The user can see the active scope",
    reason:
      "Reply targets and generated state use connected islands above the drafting surface, while files stay inside the composer as message payload.",
  },
  {
    check: "The next commitment is explicit",
    reason:
      "The send state, pending tasks, and generated suggestions are visible before the user commits the action.",
  },
  {
    check: "Suggestions remain provisional",
    reason:
      "Fast-start prompts fill the composer only after selection, leaving a clear boundary between proposal and message.",
  },
  {
    check: "Every added object is reversible",
    reason:
      "Context objects, attachments, and reply targets expose a local dismiss path without changing the primary action.",
  },
] as const

const COMPOSER_ANATOMY = [
  {
    part: "Context islands",
    role: "A connected 95%-width stack for plan, reply, and scope above the input surface.",
  },
  {
    part: "Primary input",
    role: "A quiet writing area that grows with the user instead of forcing a modal.",
  },
  {
    part: "Action chrome",
    role: "Menu, context budget, and send state stay low-contrast until needed.",
  },
  {
    part: "Suggestion row",
    role: "Fast-start prompts live outside the input so they never impersonate user text.",
  },
] as const

const COMPOSER_VARIANTS = [
  {
    name: "Display",
    text: "Show selected context without requiring edits.",
  },
  {
    name: "Interactive",
    text: "Let the user dismiss, attach, choose suggestions, and revise.",
  },
  {
    name: "Tool-rendered",
    text: "Render tool output as a structured island before it enters the message.",
  },
  {
    name: "State-rendered",
    text: "Keep scope and plan synced as connected islands, with attachments kept inside the draft payload.",
  },
] as const

const COMPOSER_GUIDANCE = [
  {
    principle: "Separate authored text from proposed context",
    avoid: "Do not let generated suggestions look like user-authored text.",
  },
  {
    principle: "Expose what will be sent before commitment",
    avoid:
      "Do not place generated plans inside the user-authored input surface.",
  },
  {
    principle: "Keep generated affordances reversible",
    avoid: "Do not make dismiss, edit, or send paths compete visually.",
  },
] as const

export function ComposerSection() {
  return (
    <section id="composer" className="page-section">
      <div className="max-w-[660px]">
        <p className="section-label mb-3">Input pattern</p>
        <h2 className="text-xl font-semibold tracking-tight">Composer</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A composer is not just a chat box. It is where the user reviews
          context, edits intent, and commits the next agent action.
        </p>
      </div>

      <div className="mt-5 bg-background/70 sm:mt-10">
        <div className="mb-2 border-b border-border/50 pb-1.5 sm:mb-4 sm:pb-3">
          <div>
            <p className="section-label">Live specimen</p>
            <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">
              A clean drafting surface with context and generated plan state
              kept outside authored text.
            </p>
          </div>
        </div>
        <CompactComposerPlayground />
      </div>

      <div className="mt-8">
        <div className="grid gap-2 border-b border-border/50 py-3 text-xs md:grid-cols-[180px_minmax(0,1fr)]">
          <p className="section-label">Inspect for</p>
          <p className="text-muted-foreground">
            The checks that make a composer trustworthy before anything is sent.
          </p>
        </div>
        <div className="divide-y divide-border/50">
          {COMPOSER_CHECKS.map((item) => (
            <div
              key={item.check}
              className="grid gap-2 py-3 text-sm md:grid-cols-[260px_minmax(0,1fr)]"
            >
              <p className="font-medium text-foreground">{item.check}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div>
          <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
            <p className="section-label">Anatomy</p>
            <span className="text-xs text-muted-foreground">4 regions</span>
          </div>
          <div className="divide-y divide-border/50">
            {COMPOSER_ANATOMY.map((item) => (
              <div
                key={item.part}
                className="grid gap-2 py-3 text-sm sm:grid-cols-[170px_minmax(0,1fr)]"
              >
                <p className="font-medium text-foreground">{item.part}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <p className="section-label border-b border-border pb-3">Depth</p>
          <div className="divide-y divide-border/50">
            {COMPOSER_VARIANTS.map((variant) => (
              <div key={variant.name} className="py-3">
                <p className="text-sm font-medium text-foreground">
                  {variant.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {variant.text}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-8">
        <div className="grid border-b border-border pb-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <p className="section-label">Rule</p>
          <p className="section-label hidden md:block">Failure to avoid</p>
        </div>
        <div className="divide-y divide-border/50">
          {COMPOSER_GUIDANCE.map((item) => (
            <div
              key={item.principle}
              className="grid gap-2 py-3 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
            >
              <p className="text-foreground">{item.principle}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.avoid}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Composer spec table */}
      <Table className="mt-10 w-full text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="pr-6 pb-3 text-left text-xs font-medium text-muted-foreground">
              Element
            </TableHead>
            <TableHead className="pb-3 text-left text-xs font-medium text-muted-foreground">
              Spec
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm text-muted-foreground">
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Container
            </TableCell>
            <TableCell className="py-3">
              max-w-[720px], rounded-xl on mobile, rounded-2xl on desktop,
              border border-border
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Textarea
            </TableCell>
            <TableCell className="py-3">
              Auto-expanding, min 36px, max 160px, 14px Albert Sans
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Send button
            </TableCell>
            <TableCell className="py-3">
              32×32px hit area, 24px inner icon button, foreground when active,
              muted when empty, spring press animation
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Focus state
            </TableCell>
            <TableCell className="py-3">
              Border transitions to foreground/20, subtle outer shadow
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Scope island
            </TableCell>
            <TableCell className="py-3">
              Compact dismissible chips in the connected island stack.
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Reply island
            </TableCell>
            <TableCell className="py-3">
              Reply icon plus truncated quote with a local dismiss action.
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Plan island
            </TableCell>
            <TableCell className="py-3">
              Rendered in the connected 95%-width stack above the composer, not
              inside the authored text area.
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              State controls
            </TableCell>
            <TableCell className="py-3">
              Multi-select toggle group, active = subtle foreground tint, drives
              visible reference states without resizing the input
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Suggestions
            </TableCell>
            <TableCell className="py-3">
              Click to fill textarea, flash animation on click, flex-wrap below
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Attachments
            </TableCell>
            <TableCell className="py-3">
              File preview chips with name/size, dismiss per-file, enables send;
              rendered inside the composer card because files belong to the
              message being drafted.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        <p>
          Scope and reply-to are mutually exclusive — enabling one dismisses the
          other. Plan/progress, scope, and reply stay in a connected island
          stack above the composer; attachments stay inside the composer because
          they are part of the message payload. The send button uses a
          spring-based press animation (cubic-bezier 0.34, 1.56, 0.64, 1) with
          an arrow flyout on send. Suggestion chips fill the textarea on click
          with a brief color flash to confirm the action.
        </p>
      </div>
    </section>
  )
}
