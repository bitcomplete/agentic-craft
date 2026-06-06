import Link from "next/link"
import { notFound } from "next/navigation"

import { PatternAnatomy } from "@/components/reference/pattern-anatomy"
import { PatternDemo } from "@/components/reference/pattern-demo"
import { PatternGuidelines } from "@/components/reference/pattern-guidelines"
import { PatternPage } from "@/components/reference/pattern-page"
import { PatternSection } from "@/components/reference/pattern-section"
import { PatternSpecTable } from "@/components/reference/pattern-spec-table"
import { PatternStateMatrix } from "@/components/reference/pattern-state-matrix"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getTemplateDetail, type TemplateSlug } from "@/content/templates"

function TemplateDetailContent({ slug }: { slug: TemplateSlug }) {
  const template = getTemplateDetail(slug)

  if (!template) {
    notFound()
  }

  return (
    <PatternPage
      eyebrow={template.eyebrow}
      title={template.title}
      description={template.summary}
    >
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {template.pieces.map((piece) => (
          <Badge key={piece} variant="outline">
            {piece}
          </Badge>
        ))}
      </div>

      <PatternSection
        id="workflow"
        eyebrow="Use"
        title="Workflow Guidance"
        description={template.whenToUse}
      >
        <PatternAnatomy
          items={[
            {
              part: "Human Control",
              role: template.humanControl,
            },
            {
              part: "What Can Fail",
              role: template.failureMode,
            },
            {
              part: "Recovery Behavior",
              role: template.recovery,
            },
          ]}
        />
      </PatternSection>

      <PatternSection
        id="states"
        eyebrow="State Matrix"
        title="Required States"
        description="A template is only useful when it shows normal, blocked, and recovery states."
      >
        <PatternDemo
          title="State Coverage"
          description="Use the matrix as the minimum implementation contract for this workflow."
        >
          <PatternStateMatrix
            rows={template.states.map((state) => ({
              state: state.state,
              userSees: state.userSees,
              systemDoes: state.systemDoes,
            }))}
          />
        </PatternDemo>
      </PatternSection>

      <PatternSection
        id="implementation"
        eyebrow="Implementation"
        title="Pattern Pieces"
        description="Templates are guidance; registry items stay smaller so teams can compose them into their own product surface."
      >
        <PatternSpecTable
          rows={template.pieces.map((piece) => ({
            element: piece,
            spec: `Compose ${piece} into the workflow without hard-coding the whole page as one component.`,
          }))}
        />
        <PatternGuidelines
          title="Build Rules"
          items={[
            {
              title: "Approval",
              description: "Risky external actions use a Decision Surface before execution.",
            },
            {
              title: "Provenance",
              description: "Sources, memory, cost, and owner metadata stay visible at the decision point.",
            },
            {
              title: "Recovery",
              description: "Blocked states expose the next input needed instead of showing indefinite activity.",
            },
          ]}
        />
      </PatternSection>

      <Separator className="my-12" />
      <Button
        render={<Link href="/templates" />}
        nativeButton={false}
        variant="outline"
      >
        Back to Templates
      </Button>
    </PatternPage>
  )
}

export { TemplateDetailContent }
