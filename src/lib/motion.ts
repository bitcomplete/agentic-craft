export type MotionPresetName = "fast" | "moderate" | "slow" | "reduced"

export type MotionPreset = {
  name: MotionPresetName
  duration: number
  easing: string
  useFor: string
}

export const motionPresets: Record<MotionPresetName, MotionPreset> = {
  fast: {
    name: "fast",
    duration: 120,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    useFor: "Taps, hover weight, chip selection, send press.",
  },
  moderate: {
    name: "moderate",
    duration: 220,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    useFor: "Rows entering, attachments appearing, grouped selections.",
  },
  slow: {
    name: "slow",
    duration: 360,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    useFor: "Panels, long explanations, multi-step layout changes.",
  },
  reduced: {
    name: "reduced",
    duration: 0,
    easing: "linear",
    useFor: "Opacity, border, color, and text state without movement.",
  },
}

export const motionRuleChecklist = [
  "Animate transform and opacity for movement.",
  "List transition properties explicitly.",
  "Preserve state clarity when reduced motion is enabled.",
  "Use proximity motion to preview the object about to change.",
  "Use merge and split backgrounds when adjacent choices become one grouped object.",
] as const

