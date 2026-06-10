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
              32×32px hit area, 24px inner icon button, foreground when
              active, muted when empty, spring press animation
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
              Rendered in the connected 95%-width stack above the composer,
              not inside the authored text area.
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              State controls
            </TableCell>
            <TableCell className="py-3">
              Multi-select toggle group, active = subtle foreground tint,
              drives visible reference states without resizing the input
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Suggestions
            </TableCell>
            <TableCell className="py-3">
              Click to fill textarea, flash animation on click, flex-wrap
              below
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border/50">
            <TableCell className="py-3 pr-6 font-medium text-foreground">
              Attachments
            </TableCell>
            <TableCell className="py-3">
              File preview chips with name/size, dismiss per-file, enables
              send; rendered inside the composer card because files belong to
              the message being drafted.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm text-muted-foreground italic">
        <p>
          Scope and reply-to are mutually exclusive — enabling one dismisses
          the other. Plan/progress, scope, and reply stay in a connected
          island stack above the composer; attachments stay inside the
          composer because they are part of the message payload. The send
          button uses a spring-based press animation (cubic-bezier 0.34, 1.56,
          0.64, 1) with an arrow flyout on send. Suggestion chips fill the
          textarea on click with a brief color flash to confirm the action.
        </p>
      </div>
    </section>
  )
}
