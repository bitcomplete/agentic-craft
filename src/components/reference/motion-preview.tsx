import { motionPresets, motionRuleChecklist } from "@/lib/motion"
import { Badge } from "@/components/ui/badge"

function MotionPreview() {
  const presets = Object.values(motionPresets)

  return (
    <div className="mt-8 rounded-lg border border-border bg-background">
      <div className="grid gap-3 border-b border-border/60 p-4 md:grid-cols-4">
        {presets.map((preset) => (
          <div key={preset.name} className="min-w-0">
            <Badge
              variant={preset.name === "reduced" ? "outline" : "secondary"}
            >
              {preset.name}
            </Badge>
            <p className="mt-2 text-xs text-muted-foreground tabular-nums">
              {preset.duration}ms / {preset.easing}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {preset.useFor}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4">
        <p className="section-label mb-3">Rules</p>
        <ul className="grid gap-x-6 divide-y divide-border/60 text-sm text-muted-foreground md:grid-cols-2 md:divide-y-0">
          {motionRuleChecklist.map((rule) => (
            <li key={rule} className="py-2.5">
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { MotionPreview }
