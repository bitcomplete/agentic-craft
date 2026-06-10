import * as React from "react"

export function useExclusiveToggle<K extends string>(
  initial: Record<K, boolean>
): [Record<K, boolean>, number, (key: string) => void] {
  const [ctrl, setCtrl] = React.useState(initial)
  const [animKey, setAnimKey] = React.useState(0)
  const toggle = React.useCallback((key: string) => {
    setCtrl((prev) => {
      const next = {} as Record<K, boolean>
      for (const k of Object.keys(prev) as K[]) next[k] = false
      next[key as K] = true
      return next
    })
    setAnimKey((n) => n + 1)
  }, [])
  return [ctrl, animKey, toggle]
}
