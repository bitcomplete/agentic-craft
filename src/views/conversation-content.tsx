"use client"

import { MessagesProgressSection } from "./conversation/messages-progress-section"
import { CitationsSection } from "./conversation/citations-section"
import { ComposerSection } from "./conversation/composer-section"

export function ConversationContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Patterns</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Conversation
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Message patterns, prose styling, citations, observable work, and
          composer patterns for agent dialogue.
        </p>
      </header>

      <MessagesProgressSection />
      <CitationsSection />
      <ComposerSection />
    </article>
  )
}
