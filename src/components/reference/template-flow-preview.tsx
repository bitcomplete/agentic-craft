import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TemplateFlowStep = {
  label: string
  description: string
  icon: IconSvgElement
  status?: "input" | "agent" | "human" | "output"
}

function TemplateFlowPreview({
  steps,
  className,
}: {
  steps: TemplateFlowStep[]
  className?: string
}) {
  return (
    <div
      data-slot="template-flow-preview"
      className={cn("border-y border-border/60 py-3 sm:py-4", className)}
    >
      <div className="grid divide-y divide-border/50 md:grid-cols-5 md:divide-x md:divide-y-0">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="relative min-w-0 py-3 first:pt-0 last:pb-0 md:px-3 md:py-0 md:first:pl-0 md:last:pr-0"
          >
            <div className="flex h-full min-w-0 flex-col">
              <div className="flex items-center justify-between gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
                  <HugeiconsIcon icon={step.icon} strokeWidth={1.5} />
                </div>
                {step.status && (
                  <Badge variant="outline" className="capitalize">
                    {step.status}
                  </Badge>
                )}
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {step.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {step.description}
              </p>
            </div>
            {index < steps.length - 1 && (
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                strokeWidth={1.5}
                className="absolute top-1/2 right-[-13px] hidden -translate-y-1/2 text-muted-foreground/50 md:block"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { TemplateFlowPreview, type TemplateFlowStep }
