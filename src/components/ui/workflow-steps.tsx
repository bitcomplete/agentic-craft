"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

/* ── Context ── */

interface WorkflowStepsContextValue {
  activeIndex: number
}

const WorkflowStepsCtx =
  React.createContext<WorkflowStepsContextValue | null>(null)

/* ── WorkflowSteps ── */

function WorkflowSteps({
  activeIndex,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  activeIndex: number
}) {
  const items = React.Children.toArray(children)
  const ctx = React.useMemo(() => ({ activeIndex }), [activeIndex])

  return (
    <WorkflowStepsCtx.Provider value={ctx}>
      <div
        data-slot="workflow-steps"
        className={cn("flex flex-col", className)}
        {...props}
      >
        {items.map((child, i) => {
          const isLast = i === items.length - 1
          const status: StepStatus =
            i < activeIndex ? "completed" : i === activeIndex ? "running" : "pending"

          return (
            <div key={i} className="flex gap-2.5 min-w-0">
              {/* Indicator column */}
              <div className="flex flex-col items-center w-3.5 shrink-0">
                {/* Dot */}
                <div
                  className={cn(
                    "mt-[5px] size-[7px] shrink-0 rounded-full",
                    status === "completed" && "bg-muted-foreground",
                    status === "running" && "bg-muted-foreground animate-tool-call-pulse",
                    status === "pending" && "border border-muted-foreground/40",
                  )}
                />
                {/* Connector */}
                {!isLast && (
                  <div
                    className="flex-1 w-px min-h-3"
                    style={{ backgroundColor: "var(--tool-tree-connector)" }}
                  />
                )}
              </div>

              {/* Step content */}
              {React.isValidElement<WorkflowStepInternalProps>(child)
                ? React.cloneElement(child, { _status: status })
                : child}
            </div>
          )
        })}
      </div>
    </WorkflowStepsCtx.Provider>
  )
}

/* ── WorkflowStep ── */

type StepStatus = "completed" | "running" | "pending"

interface WorkflowStepInternalProps {
  _status?: StepStatus
}

function WorkflowStep({
  details,
  className,
  children,
  _status = "pending",
  ...props
}: React.ComponentProps<"div"> & {
  details?: React.ReactNode
  _status?: StepStatus
}) {
  const [expanded, setExpanded] = React.useState(false)
  const canExpand = _status === "completed" && !!details

  return (
    <div
      data-slot="workflow-step"
      className={cn("min-w-0 pb-2", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {canExpand ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "min-w-0 flex items-center gap-1 cursor-pointer text-sm select-none truncate",
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="truncate">{children}</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={12}
              strokeWidth={1.5}
              className={cn(
                "shrink-0 transition-transform duration-200",
                expanded && "rotate-90",
              )}
            />
          </button>
        ) : (
          <span
            className={cn(
              "min-w-0 text-sm select-none truncate",
              _status === "completed" && "text-muted-foreground",
              _status === "running" && "text-foreground",
              _status === "pending" && "text-muted-foreground/50",
            )}
          >
            {children}
          </span>
        )}
      </div>

      {expanded && details && (
        <div className="animate-composer-slide mt-1 text-xs text-muted-foreground leading-relaxed">
          {details}
        </div>
      )}
    </div>
  )
}

export { WorkflowSteps, WorkflowStep }
