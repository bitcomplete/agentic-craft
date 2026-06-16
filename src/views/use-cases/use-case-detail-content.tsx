"use client"

import * as React from "react"
import Link from "next/link"
import {
  Attachment01Icon,
  BrowserIcon,
  File01Icon,
  Globe02Icon,
  Plug01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ArtifactDocument } from "@/components/ui/artifact-document"
import {
  Composer,
  ComposerCard,
  ComposerContextRing,
  ComposerInput,
  ComposerIslands,
  ComposerMenu,
  ComposerPlan,
  ComposerScope,
  ComposerSend,
  ComposerSuggestions,
  ComposerToolbar,
} from "@/components/ui/composer"
import { ContextualWorkbench } from "@/components/ui/contextual-workbench"
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MemoryLedgerItem } from "@/components/ui/memory-ledger-item"
import { ObservableWork } from "@/components/ui/observable-work"
import { ReferenceItem } from "@/components/ui/reference-item"
import { RunTrace } from "@/components/ui/run-trace"
import {
  SourcePreview,
  SourcePreviewCitation,
} from "@/components/ui/source-preview"
import { UsageMeter } from "@/components/ui/usage-meter"
import { cn } from "@/lib/utils"

import {
  getUseCaseVariant,
  useCaseVariants,
  type ComponentLink,
  type PatternLink,
  type ReferenceFixture,
  type ThreadMessage,
  type UseCaseVariant,
} from "./data"

export function UseCaseDetailContent({ slug }: { slug: string }) {
  const variant = getUseCaseVariant(slug)

  if (!variant) return null

  return (
    <article>
      <header className="mb-10 sm:mb-14">
        <p className="section-label mb-3">Use case</p>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="font-serif text-4xl leading-[1.12] font-light tracking-tight text-balance">
              {variant.title}
            </h1>
            <p className="mt-4 max-w-[640px] text-sm leading-6 text-muted-foreground">
              {variant.summary}
            </p>
          </div>
          <div className="shrink-0 border-l border-border/70 pl-4">
            <p className="text-xs text-muted-foreground">Variant</p>
            <p className="mt-1 text-sm font-medium text-foreground tabular-nums">
              {variant.step} / {variant.capability}
            </p>
          </div>
        </div>
      </header>

      <VariantStrip activeSlug={variant.slug} />

      <section
        id="what-this-is"
        className="my-10 grid gap-5 border-y border-border/60 py-5 md:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <p className="section-label mb-2">What this is</p>
          <p className="font-serif text-2xl leading-tight font-light tracking-tight text-balance">
            {variant.thesis}
          </p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {variant.whatThisIs}
        </p>
      </section>

      <section id="implementation" className="scroll-mt-20">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label mb-2">Interactive implementation</p>
            <h2 className="font-serif text-2xl leading-tight font-light tracking-tight">
              {variant.primaryPattern} in context
            </h2>
          </div>
          <p className="max-w-[360px] text-xs leading-5 text-muted-foreground sm:text-right">
            {variant.fixtureNote}
          </p>
        </div>
        <UseCaseImplementation variant={variant} />
      </section>

      <section
        id="patterns"
        className="mt-12 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <PatternLinkPanel patterns={variant.patterns} />
        <ComponentLinkPanel components={variant.componentsUsed} />
      </section>

      <section
        id="tradeoffs"
        className="mt-12 grid gap-4 border-y border-border/60 py-6 md:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <p className="section-label mb-2">Tradeoffs</p>
          <h2 className="font-serif text-2xl leading-tight font-light tracking-tight">
            What the variant chooses
          </h2>
        </div>
        <ul className="grid gap-3">
          {variant.tradeoffs.map((tradeoff) => (
            <li
              key={tradeoff}
              className="border-l border-border/70 pl-4 text-sm leading-6 text-muted-foreground"
            >
              {tradeoff}
            </li>
          ))}
        </ul>
      </section>

      <section id="composition" className="mt-12 scroll-mt-20">
        <p className="section-label mb-2">Composition</p>
        <h2 className="font-serif text-2xl leading-tight font-light tracking-tight">
          How the pattern recipes combine
        </h2>
        <pre className="mt-5 overflow-x-auto rounded-lg border border-border bg-muted/25 p-4 text-xs leading-6 text-muted-foreground">
          <code>{variant.composition}</code>
        </pre>
      </section>
    </article>
  )
}

function VariantStrip({ activeSlug }: { activeSlug: UseCaseVariant["slug"] }) {
  return (
    <nav aria-label="Use case variants" className="grid gap-2 sm:grid-cols-3">
      {useCaseVariants.map((variant) => {
        const active = variant.slug === activeSlug

        return (
          <Link
            key={variant.slug}
            href={`/use-cases/${variant.slug}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "min-w-0 rounded-lg border p-3 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              active
                ? "border-foreground/20 bg-muted/35"
                : "border-border/60 hover:border-border hover:bg-muted/20"
            )}
          >
            <span className="block text-xs text-muted-foreground tabular-nums">
              {variant.step}
            </span>
            <span className="mt-1 block text-sm font-medium text-foreground">
              {variant.shortTitle}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {variant.capability}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function UseCaseImplementation({ variant }: { variant: UseCaseVariant }) {
  if (variant.layout === "contextual-side-panel" && variant.workbench) {
    return <SidePanelSurface variant={variant} />
  }

  return (
    <ThreadSurface
      variant={variant}
      showContextBlocks={variant.layout === "context-blocks"}
    />
  )
}

function ThreadSurface({
  variant,
  showContextBlocks,
}: {
  variant: UseCaseVariant
  showContextBlocks?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/15 p-3 sm:p-4">
      <div
        className={cn(
          "grid gap-4",
          showContextBlocks &&
            "lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)]"
        )}
      >
        <div className="min-w-0 rounded-lg border border-border/70 bg-background p-3 sm:p-4">
          <ThreadMessages variant={variant} />
          <ScopedComposer variant={variant} />
        </div>

        {showContextBlocks && variant.contextBlocks && (
          <ContextRail variant={variant} />
        )}
      </div>
    </div>
  )
}

function ThreadMessages({ variant }: { variant: UseCaseVariant }) {
  return (
    <div className="grid gap-5">
      {variant.messages.map((message) => {
        if (message.role === "system") {
          return <ObservableWorkMessage key={message.id} variant={variant} />
        }

        return (
          <MessageBubble key={message.id} message={message} variant={variant} />
        )
      })}
    </div>
  )
}

function MessageBubble({
  message,
  variant,
}: {
  message: ThreadMessage
  variant: UseCaseVariant
}) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] min-w-0",
          isUser
            ? "rounded-lg bg-foreground px-4 py-2.5 text-sm leading-6 text-background"
            : "text-foreground"
        )}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{message.label}</span>
            <span aria-hidden="true">/</span>
            <span>{message.timestamp}</span>
          </div>
        )}
        {message.body && <p className="text-sm leading-6">{message.body}</p>}
        {message.segments && (
          <p className="agent-prose font-serif text-base leading-7">
            {message.segments.map((segment, index) => (
              <React.Fragment key={`${message.id}-${index}`}>
                {segment.text}
                {segment.sourceIndex !== undefined && (
                  <SourcePreviewCitation
                    sources={variant.sources}
                    sourceIndex={segment.sourceIndex}
                    align="start"
                  />
                )}
              </React.Fragment>
            ))}
          </p>
        )}
      </div>
    </div>
  )
}

function ObservableWorkMessage({ variant }: { variant: UseCaseVariant }) {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[92%]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
          <span>Observable work / launch review</span>
          <span>3.9s elapsed</span>
        </div>
        <ObservableWork.Root className="bg-background">
          {variant.observableWork.map((step) => (
            <ObservableWork.Step
              key={step.id}
              title={step.title}
              description={step.description}
              status={step.status}
              source={step.source}
              meta={step.meta}
              defaultOpen={step.defaultOpen}
            >
              <ObservableWork.Detail>
                <ul className="grid gap-1">
                  {step.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </ObservableWork.Detail>
            </ObservableWork.Step>
          ))}
        </ObservableWork.Root>
      </div>
    </div>
  )
}

function ScopedComposer({ variant }: { variant: UseCaseVariant }) {
  const { composer } = variant

  return (
    <Composer
      className="mt-6 max-w-full"
      defaultValue={composer.defaultValue}
      onSend={() => undefined}
    >
      <ComposerIslands>
        <ComposerPlan tasks={composer.plan} defaultExpanded={false} />
        <ComposerScope items={composer.scope} />
      </ComposerIslands>
      <ComposerCard>
        <ComposerInput placeholder={composer.placeholder} />
        <ComposerToolbar>
          <ComposerMenu>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Add to thread</DropdownMenuLabel>
              <DropdownMenuItem>
                <HugeiconsIcon icon={File01Icon} strokeWidth={1.5} />
                Upload source
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Plug01Icon} strokeWidth={1.5} />
                Add connector
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Promote</DropdownMenuLabel>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Attachment01Icon} strokeWidth={1.5} />
                Create artifact
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Globe02Icon} strokeWidth={1.5} />
                Check browser state
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </ComposerMenu>
          <div className="flex-1" />
          <ComposerContextRing
            used={composer.contextUsed}
            total={composer.contextTotal}
            label={`${composer.contextUsed}k / ${composer.contextTotal}k context`}
          />
          <ComposerSend />
        </ComposerToolbar>
      </ComposerCard>
      <ComposerSuggestions items={composer.suggestions} />
    </Composer>
  )
}

function ContextRail({ variant }: { variant: UseCaseVariant }) {
  const context = variant.contextBlocks
  if (!context) return null

  return (
    <aside className="grid min-w-0 gap-3 lg:content-start">
      <ContextBlock title="Artifacts" count={context.artifacts.length}>
        <ReferenceRows items={context.artifacts} />
      </ContextBlock>

      <ContextBlock title="Sources" count={context.sources.length}>
        <ReferenceRows
          items={context.sources.map((source) => ({
            id: String(source.id),
            title: source.title,
            description: source.excerpt,
            meta: [source.source, source.location].filter(Boolean).join(" / "),
            icon: source.icon ?? Shield01Icon,
          }))}
        />
      </ContextBlock>

      <ContextBlock title="Connectors" count={context.connectors.length}>
        <ReferenceRows items={context.connectors} />
      </ContextBlock>

      <ContextBlock title="Memory" count={context.memories.length}>
        <div className="grid gap-2">
          {context.memories.map((memory) => (
            <MemoryLedgerItem
              key={`${memory.source}-${memory.value}`}
              {...memory}
            />
          ))}
        </div>
      </ContextBlock>

      <UsageMeter
        title="Usage"
        description="Context, source coverage, and run cost for this thread."
        items={context.usage}
        className="rounded-lg border border-border bg-background px-3"
      />

      <RunTrace
        title="Run trace"
        description="Persistent state attached to the context rail."
        events={context.runTrace}
      />
    </aside>
  )
}

function ContextBlock({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-border bg-background p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      {children}
    </section>
  )
}

function ReferenceRows({ items }: { items: ReferenceFixture[] }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <ReferenceItem.Root key={item.id}>
          <ReferenceItem.Media>
            <HugeiconsIcon icon={item.icon} strokeWidth={1.5} />
          </ReferenceItem.Media>
          <ReferenceItem.Content>
            <ReferenceItem.Title className="text-clip whitespace-normal">
              {item.title}
            </ReferenceItem.Title>
            <ReferenceItem.Description>
              {item.description}
            </ReferenceItem.Description>
            <ReferenceItem.Meta>{item.meta}</ReferenceItem.Meta>
          </ReferenceItem.Content>
        </ReferenceItem.Root>
      ))}
    </div>
  )
}

function SidePanelSurface({ variant }: { variant: UseCaseVariant }) {
  const workbench = variant.workbench
  if (!workbench) return null

  return (
    <div className="rounded-lg border border-border bg-muted/15 p-3 sm:p-4">
      <ContextualWorkbench
        messages={workbench.messages}
        surfaces={workbench.surfaces}
        defaultSurfaceId="memo"
        renderSurface={(surface) => (
          <WorkbenchSurface variant={variant} surfaceId={surface.id} />
        )}
        className="bg-background"
      />
      <div className="mt-4 rounded-lg border border-border/70 bg-background p-3 sm:p-4">
        <ScopedComposer variant={variant} />
      </div>
    </div>
  )
}

function WorkbenchSurface({
  variant,
  surfaceId,
}: {
  variant: UseCaseVariant
  surfaceId: string
}) {
  const workbench = variant.workbench
  if (!workbench) return null

  if (surfaceId === "memo") {
    return (
      <div className="p-3">
        <ArtifactDocument {...workbench.artifact} />
      </div>
    )
  }

  if (surfaceId === "browser") {
    return (
      <div className="grid gap-3 p-3">
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex items-center gap-2 border-b border-border/70 px-3 py-2">
            <HugeiconsIcon
              icon={BrowserIcon}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
            <div className="min-w-0 flex-1 rounded-md bg-muted/35 px-2 py-1 text-xs text-muted-foreground">
              preview.local/invite
            </div>
          </div>
          <div className="grid gap-3 p-4">
            <p className="font-serif text-xl leading-tight font-light tracking-tight">
              Invite your team
            </p>
            <div className="grid gap-2 text-xs text-muted-foreground">
              <div className="h-8 rounded-md border border-border bg-muted/30 px-2 py-2">
                Billing owner: Dana Lee
              </div>
              <div className="h-8 rounded-md border border-border bg-muted/30 px-2 py-2">
                5 setup steps before first invite
              </div>
            </div>
          </div>
        </div>
        <ReferenceRows items={workbench.browserChecks} />
      </div>
    )
  }

  if (surfaceId === "diff") {
    return (
      <div className="p-3">
        <div className="rounded-lg border border-border bg-background">
          <div className="border-b border-border/70 px-3 py-2 text-sm font-medium">
            Copy change waiting for approval
          </div>
          <pre className="overflow-x-auto p-3 text-xs leading-6 text-muted-foreground">
            <code>{workbench.diffLines.join("\n")}</code>
          </pre>
        </div>
      </div>
    )
  }

  if (surfaceId === "source") {
    return (
      <div className="p-3">
        <SourcePreview
          title={workbench.source.title}
          excerpt={workbench.source.excerpt}
          location={workbench.source.location}
          source={workbench.source.source}
          icon={workbench.source.icon}
        />
      </div>
    )
  }

  return null
}

function PatternLinkPanel({ patterns }: { patterns: PatternLink[] }) {
  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <p className="section-label mb-3">Patterns composed here</p>
      <div className="grid gap-2">
        {patterns.map((pattern) => (
          <Link
            key={pattern.label}
            href={pattern.href}
            className="group rounded-md border border-border/60 p-3 transition-colors hover:border-border hover:bg-muted/20 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
              {pattern.label}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {pattern.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ComponentLinkPanel({ components }: { components: ComponentLink[] }) {
  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <p className="section-label mb-3">Components used</p>
      <div className="flex flex-wrap gap-2">
        {components.map((component) => (
          <Link
            key={component.label}
            href={component.href}
            className="rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {component.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Registry items stay generic. This page owns the launch-review narrative
        data that makes the composition legible.
      </p>
    </section>
  )
}
