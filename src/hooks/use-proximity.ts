"use client"

import { useMotionValueEvent, type MotionValue } from "motion/react"
import * as React from "react"

/** Radius of the proximity effect in pixels. Lines beyond this distance stay at rest. */
export const DISTANCE_LIMIT = 80

/**
 * Calculate a scaled value based on distance from a reference point.
 * Quadratic falloff -- elements closer to the reference scale more.
 *
 * Adapted from Devouring Details line-minimap `transformScale`.
 */
export function transformScale(
  distance: number,
  initialValue: number,
  baseValue: number,
  intensity: number,
): number {
  if (Math.abs(distance) > DISTANCE_LIMIT) return initialValue
  const normalizedDistance =
    initialValue - Math.abs(distance) / DISTANCE_LIMIT
  const scaleFactor = normalizedDistance * normalizedDistance
  return baseValue + intensity * scaleFactor
}

export interface UseProximityOptions {
  ref: React.RefObject<HTMLElement | null>
  baseValue: number
  cursorY: MotionValue<number>
  intensity?: number
  transformer?: typeof transformScale
}

/**
 * Drive a spring-animated MotionValue based on cursor proximity to an element.
 * Adapted from Devouring Details line-minimap `useProximity` (Y-axis, mouse only).
 */
export function useProximity(
  value: MotionValue<number>,
  {
    ref,
    baseValue,
    cursorY,
    intensity = 1.5,
    transformer = transformScale,
  }: UseProximityOptions,
) {
  const initialValueRef = React.useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (initialValueRef.current === null) {
      initialValueRef.current = value.get()
    }
  }, [value])

  useMotionValueEvent(cursorY, "change", (latest) => {
    if (!ref.current || initialValueRef.current === null) return
    if (latest === 0) {
      if (prefersReducedMotion.current) {
        value.jump(initialValueRef.current)
      } else {
        value.set(initialValueRef.current)
      }
      return
    }
    const rect = ref.current.getBoundingClientRect()
    const centerY = rect.top + rect.height / 2
    const distance = latest - centerY
    const target = transformer(
      distance,
      initialValueRef.current,
      baseValue,
      intensity,
    )
    if (prefersReducedMotion.current) {
      value.jump(target)
    } else {
      value.set(target)
    }
  })
}

/** Reactively track prefers-reduced-motion, updating on OS setting change. */
export function usePrefersReducedMotion() {
  const ref = React.useRef(false)
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    ref.current = mql.matches
    const onChange = () => { ref.current = mql.matches }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return ref
}

/** Spring config for proximity-driven values. Fast response, no overshoot. */
export const PROXIMITY_SPRING = { stiffness: 600, damping: 45 }
