"use client"

import Link from "next/link"
import InteractiveComposer from "@/components/InteractiveComposer"

const STATES = [
  {
    name: "Idle",
    details: "Empty input with low visual weight and suggestions available as entry points.",
  },
  {
    name: "Scoped",
    details: "A task or artifact scope is attached above the input so the user can see what the message is anchored to.",
  },
  {
    name: "Replying",
    details: "A reply banner keeps the immediate conversation context visible without taking over the input surface.",
  },
  {
    name: "Planning",
    details: "A plan island makes the upcoming work legible before or during execution.",
  },
  {
    name: "Attached",
    details: "Files and images are visible before send so the user can verify what the model will receive.",
  },
  {
    name: "Sending",
    details: "The composer gives immediate feedback with a compact press/send animation instead of a heavyweight loading state.",
  },
]

const ANATOMY = [
  ["Composer", "Root state container for value, focus, send state, and shared context."],
  ["ComposerCard", "Primary input surface with focus treatment and toolbar."],
  ["ComposerInput", "Auto-expanding text area for open-ended prompts."],
  ["ComposerToolbar", "Actions, context ring, and send affordance."],
  ["ComposerScope", "Shows the active scope or attached working context."],
  ["ComposerReply", "Displays the message or fragment currently being replied to."],
  ["ComposerPlan", "Surfaces a lightweight task plan above the input."],
  ["ComposerAttachments", "Pre-send file/image chips with removal controls."],
  ["ComposerSuggestions", "Blank-state suggestions that help the user begin."],
]

const IMPLEMENTATION = [
  ["Primary demo", "src/components/InteractiveComposer.tsx"],
  ["Core primitive", "src/components/ui/composer.tsx"],
  ["Input primitive", "src/components/ui/composer-input.tsx"],
  ["Toolbar primitive", "src/components/ui/composer-toolbar.tsx"],
  ["Island primitives", "src/components/ui/composer-islands.tsx"],
  ["Registry item", "registry.json → composer"],
]

export function ComposerContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Pattern Reference</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Composer
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          The composer is the main prompt surface for an agentic interface. It is
          not just a textarea — it is where scope, reply context, plans,
          attachments, and lightweight control surfaces come together into a
          single interaction model.
        </p>
      </header>

      <section id="demo" className="page-section">
        <p className="section-label mb-3">Interactive</p>
        <h2 className="text-xl font-semibold tracking-tight">Demo</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          Use the controls to move through the composer states. The goal is not to
          define a universal default style, but to show one way to represent a
          complex agentic prompt surface using composed shadcn/ui-style
          primitives.
        </p>

        <div className="mt-10 rounded-xl border border-border/40 bg-background p-6">
          <InteractiveComposer />
        </div>
      </section>

      <section id="anatomy" className="page-section">
        <p className="section-label mb-3">Structure</p>
        <h2 className="text-xl font-semibold tracking-tight">Anatomy</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          The composer is built from a small set of primitives that each solve a
          clear job: input, context, action, and temporary supporting state.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Element
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {ANATOMY.map(([name, role]) => (
              <tr key={name} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{name}</td>
                <td className="py-3">{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="states" className="page-section">
        <p className="section-label mb-3">Behavior</p>
        <h2 className="text-xl font-semibold tracking-tight">State model</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          The composer should reveal complexity progressively. Not every surface is
          visible at once; supporting context appears only when it earns its way
          into the interaction.
        </p>

        <div className="mt-10 space-y-3">
          {STATES.map((state) => (
            <div key={state.name} className="rounded-lg border border-border/40 p-4">
              <p className="text-sm font-medium text-foreground">{state.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {state.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="composition" className="page-section">
        <p className="section-label mb-3">Guidance</p>
        <h2 className="text-xl font-semibold tracking-tight">Composition rules</h2>
        <div className="mt-10 space-y-4 font-serif text-base" style={{ lineHeight: "26px", letterSpacing: "-0.4px", fontVariationSettings: '"opsz" 12' }}>
          <p>
            Keep the composer anchored around one primary action: send a message.
            Everything else should support that action rather than compete with it.
          </p>
          <p>
            Scope, reply context, and plan surfaces are useful because they make the
            agent’s working context explicit. They become noise when they are always
            on or stacked without clear priority.
          </p>
          <p>
            Suggestions are best treated as an onboarding and recovery aid, not as
            the main interface. They should help a user begin, then get out of the
            way once intent is established.
          </p>
        </div>
      </section>

      <section id="implementation" className="page-section">
        <p className="section-label mb-3">Implementation</p>
        <h2 className="text-xl font-semibold tracking-tight">Implementation notes</h2>
        <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-muted-foreground">
          The composer is implemented as a higher-order composition on top of the
          repo’s existing UI primitives and is also exposed through the registry.
        </p>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Asset
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Path
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            {IMPLEMENTATION.map(([label, path]) => (
              <tr key={label} className="border-b border-border/50">
                <td className="py-3 pr-6 font-medium text-foreground">{label}</td>
                <td className="py-3">{path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="page-section">
        <p className="section-label mb-3">Related</p>
        <h2 className="text-xl font-semibold tracking-tight">Related pages</h2>
        <div className="mt-10 space-y-2 text-sm text-muted-foreground">
          <p>
            Read the broader <Link href="/conversation" className="text-foreground underline underline-offset-4">Conversation</Link> lens for how the composer sits alongside prose, citations, and thinking blocks.
          </p>
          <p>
            Compare with <Link href="/thread-timeline" className="text-foreground underline underline-offset-4">Thread Timeline</Link> for another higher-order interaction pattern.
          </p>
        </div>
      </section>
    </article>
  )
}
