import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type TemplateFlowStep = {
  label: string
  description: string
  owner?: "input" | "agent" | "human" | "output"
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
      <div className="grid divide-y divide-border/50 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="relative min-w-0 py-3 first:pt-0 last:pb-0 lg:px-3 lg:py-0 lg:first:pl-0 lg:last:pr-0"
          >
            <div className="flex h-full min-w-0 flex-col">
              {step.owner && (
                <p className="mb-1.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  {step.owner}
                </p>
              )}
              <p className="text-sm font-medium text-foreground">
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
                className="absolute top-1/2 right-[-13px] hidden -translate-y-1/2 text-muted-foreground/50 lg:block"
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
