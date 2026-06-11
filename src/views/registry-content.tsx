import registry from "../../registry.json"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const registryItems = registry.items.map((item) => ({
  name: item.name,
  type: item.type,
  title: item.title,
  description: item.description,
  dependencies: "registryDependencies" in item ? item.registryDependencies : [],
}))

const primitiveItems = registryItems.filter(
  (item) => item.type === "registry:ui"
)
const blockItems = registryItems.filter(
  (item) => item.type === "registry:block"
)

function RegistryItemList({ items }: { items: typeof registryItems }) {
  return (
    <div className="divide-y divide-border/70 border-y border-border/70 md:hidden">
      {items.map((item) => (
        <div key={item.name} className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.name}</p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}

function RegistryItemTable({ items }: { items: typeof registryItems }) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="hidden lg:table-cell">Use</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="min-w-44">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.name}
                  </p>
                </div>
              </TableCell>
              <TableCell className="hidden whitespace-normal text-muted-foreground lg:table-cell">
                {item.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function RegistryContent() {
  return (
    <article>
      <header className="mb-12 sm:mb-20">
        <p className="section-label mb-3">DISTRIBUTION</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Registry
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Agentic Craft patterns should install as shadcn registry items. The
          guide separates reusable primitives from workflow blocks so teams can
          adopt the smallest useful piece first.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="/r/registry.json"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Open registry.json
          </a>
          <Badge variant="outline">{primitiveItems.length} primitives</Badge>
          <Badge variant="outline">{blockItems.length} blocks</Badge>
        </div>
      </header>

      <section id="install" className="page-section">
        <p className="section-label mb-3">Install</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Registry Commands
        </h2>
        <div className="mt-6 grid gap-3">
          {[
            "npx shadcn@latest list https://raw.githubusercontent.com/bitcomplete/agentic-craft/main/public/r/registry.json",
            "npx shadcn@latest view https://raw.githubusercontent.com/bitcomplete/agentic-craft/main/public/r/source-backed-artifact.json",
            "npx shadcn@latest add https://raw.githubusercontent.com/bitcomplete/agentic-craft/main/public/r/source-backed-artifact.json",
          ].map((command) => (
            <code
              key={command}
              className="block overflow-x-auto rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
            >
              {command}
            </code>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A local dev server serves the same payloads at /r/ for previewing.
        </p>
      </section>

      <section id="primitives" className="page-section">
        <p className="section-label mb-3">registry:ui</p>
        <h2 className="text-xl font-semibold tracking-tight">Primitives</h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Primitives are small, composable surfaces: composer, source preview,
          observable work, decision surface, artifact document, memory rows, and
          usage meters.
        </p>
        <div className="mt-8">
          <RegistryItemTable items={primitiveItems} />
          <RegistryItemList items={primitiveItems} />
        </div>
      </section>

      <section id="blocks" className="page-section">
        <p className="section-label mb-3">registry:block</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Workflow Blocks
        </h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Blocks compose primitives into product-ready workflow specimens. They
          are the registry equivalent of the guide's Templates section.
        </p>
        <div className="mt-8">
          <RegistryItemTable items={blockItems} />
          <RegistryItemList items={blockItems} />
        </div>
      </section>

      <section id="quality-gates" className="page-section">
        <p className="section-label mb-3">Quality gates</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Before Publishing an Item
        </h2>
        <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
          {[
            [
              "State coverage",
              "Normal, active, blocked, completed, empty, and error states are documented or shown.",
            ],
            [
              "Mobile behavior",
              "Touch targets, wrapping, source sheets, and compact composer states are verified at 390px.",
            ],
            [
              "Source ownership",
              "The item makes affected object, source, owner, cost, or policy visible when relevant.",
            ],
            [
              "Install proof",
              "The item passes registry build and can be viewed through shadcn CLI.",
            ],
          ].map(([gate, rule]) => (
            <div
              key={gate}
              className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"
            >
              <p className="text-sm font-medium text-foreground">{gate}</p>
              <p className="text-sm leading-6 text-muted-foreground">{rule}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
