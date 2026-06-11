"use client"

import { useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"

/**
 * Returns a stable `scrollToSection(sectionPath, elementId)` callback.
 * If already on `sectionPath` it scrolls immediately; otherwise it pushes
 * the route and retries each animation frame until the element mounts
 * (up to ~2 s).
 */
export function useScrollToSection() {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = useCallback(
    (sectionPath: string, elementId: string) => {
      const scrollTo = (el: HTMLElement) => {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        })
      }

      if (pathname !== sectionPath) {
        router.push(sectionPath)
        // The target section mounts after navigation — retry each frame
        // (up to ~2s) instead of racing a fixed timeout.
        const deadline = Date.now() + 2000
        const tryScroll = () => {
          const el = document.getElementById(elementId)
          if (el) {
            scrollTo(el)
          } else if (Date.now() < deadline) {
            requestAnimationFrame(tryScroll)
          }
        }
        requestAnimationFrame(tryScroll)
      } else {
        requestAnimationFrame(() => {
          const el = document.getElementById(elementId)
          if (el) scrollTo(el)
        })
      }
    },
    [pathname, router]
  )

  return scrollToSection
}
