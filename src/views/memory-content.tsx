"use client"

import { MemoryPanelCrudSection } from "./memory/memory-panel-crud-section"
import { AutoMemorySection } from "./memory/auto-memory-section"
import { ContextRingSection } from "./memory/context-ring-section"
import { PrivacyControlsSection } from "./memory/privacy-controls-section"

export function MemoryContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Memory</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Memory
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for persistent memory, cross-session recall, context
          awareness, auto-detection of preferences, and privacy controls for
          reviewer data.
        </p>
      </header>

      <MemoryPanelCrudSection />
      <AutoMemorySection />
      <ContextRingSection />
      <PrivacyControlsSection />
    </article>
  )
}
