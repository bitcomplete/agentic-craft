"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useSyncExternalStore } from "react"

const APP_SCROLL_CONTAINER_SELECTOR = "[data-app-scroll-container]"
const HASH_TARGET_OBSERVER_TIMEOUT_MS = 2000
const LOCATION_CHANGE_EVENT = "hermes:locationchange"
const HISTORY_PATCH_FLAG = "__hermesLocationChangePatched"
const LOCATION_CHANGE_DISPATCH_SCHEDULED_FLAG =
  "__hermesLocationChangeDispatchScheduled"

type PatchedWindow = Window & {
  [HISTORY_PATCH_FLAG]?: boolean
  [LOCATION_CHANGE_DISPATCH_SCHEDULED_FLAG]?: boolean
}

function dispatchLocationChange() {
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT))
}

function scheduleLocationChange() {
  const patchedWindow = window as PatchedWindow

  if (patchedWindow[LOCATION_CHANGE_DISPATCH_SCHEDULED_FLAG]) {
    return
  }

  patchedWindow[LOCATION_CHANGE_DISPATCH_SCHEDULED_FLAG] = true
  queueMicrotask(() => {
    patchedWindow[LOCATION_CHANGE_DISPATCH_SCHEDULED_FLAG] = false
    dispatchLocationChange()
  })
}

function ensureHistoryLocationEvents() {
  const patchedWindow = window as PatchedWindow

  if (patchedWindow[HISTORY_PATCH_FLAG]) {
    return
  }

  const originalPushState = window.history.pushState.bind(window.history)
  const originalReplaceState = window.history.replaceState.bind(window.history)

  window.history.pushState = ((...args) => {
    const result = originalPushState(...args)
    scheduleLocationChange()
    return result
  }) as History["pushState"]

  window.history.replaceState = ((...args) => {
    const result = originalReplaceState(...args)
    scheduleLocationChange()
    return result
  }) as History["replaceState"]

  patchedWindow[HISTORY_PATCH_FLAG] = true
}

function subscribe(onStoreChange: () => void) {
  ensureHistoryLocationEvents()

  window.addEventListener("hashchange", onStoreChange)
  window.addEventListener("popstate", onStoreChange)
  window.addEventListener(LOCATION_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener("hashchange", onStoreChange)
    window.removeEventListener("popstate", onStoreChange)
    window.removeEventListener(LOCATION_CHANGE_EVENT, onStoreChange)
  }
}

function getHashSnapshot() {
  return window.location.hash
}

function getServerHashSnapshot() {
  return ""
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function resolveScrollBehavior(behavior: ScrollBehavior) {
  if (behavior !== "smooth") {
    return behavior
  }

  return prefersReducedMotion() ? "auto" : behavior
}

function decodeHashValue(hash: string) {
  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
  }
}

function getHashTarget(hash: string) {
  const normalizedHash = hash.startsWith("#") ? hash.slice(1) : hash

  if (!normalizedHash) {
    return null
  }

  return document.getElementById(decodeHashValue(normalizedHash))
}

function getAppScrollContainer() {
  return document.querySelector<HTMLElement>(APP_SCROLL_CONTAINER_SELECTOR)
}

export function useCurrentHash() {
  return useSyncExternalStore(subscribe, getHashSnapshot, getServerHashSnapshot)
}

export function scrollHashIntoView(
  hash: string,
  behavior: ScrollBehavior = "smooth",
) {
  const target = getHashTarget(hash)

  if (!target) {
    return false
  }

  target.scrollIntoView({
    behavior: resolveScrollBehavior(behavior),
    block: "start",
  })
  return true
}

export function scrollPageContentToTop(
  behavior: ScrollBehavior = "smooth",
) {
  const resolvedBehavior = resolveScrollBehavior(behavior)
  const scrollContainer = getAppScrollContainer()
  let didScroll = false

  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: resolvedBehavior,
    })
    didScroll = true
  }

  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: resolvedBehavior })
    didScroll = true
  }

  return didScroll
}

export function HashScrollHandler() {
  const pathname = usePathname()
  const currentHash = useCurrentHash()
  const isFirstRender = useRef(true)
  const previousPathname = useRef(pathname)
  const previousHash = useRef(currentHash)

  useEffect(() => {
    const hasPathChanged = previousPathname.current !== pathname
    const resolvedHash = window.location.hash
    const previousHashValue = previousHash.current
    const hasHashChanged = previousHashValue !== resolvedHash
    const behavior: ScrollBehavior = isFirstRender.current ? "auto" : "smooth"
    const shouldHandleNavigation =
      isFirstRender.current || hasPathChanged || hasHashChanged

    previousPathname.current = pathname
    previousHash.current = resolvedHash
    isFirstRender.current = false

    if (!shouldHandleNavigation) {
      return
    }

    if (!resolvedHash) {
      if (hasPathChanged) {
        scrollPageContentToTop("auto")
      } else if (hasHashChanged && previousHashValue) {
        scrollPageContentToTop(behavior)
      }

      return
    }

    let observer: MutationObserver | null = null
    let observerTimeout: number | null = null

    const disconnectObserver = () => {
      observer?.disconnect()
      observer = null

      if (observerTimeout !== null) {
        window.clearTimeout(observerTimeout)
        observerTimeout = null
      }
    }

    const frame = requestAnimationFrame(() => {
      if (scrollHashIntoView(resolvedHash, behavior)) {
        return
      }

      const root = getAppScrollContainer() ?? document.body
      observer = new MutationObserver(() => {
        if (scrollHashIntoView(resolvedHash, behavior)) {
          disconnectObserver()
        }
      })
      observer.observe(root, { childList: true, subtree: true })
      observerTimeout = window.setTimeout(
        disconnectObserver,
        HASH_TARGET_OBSERVER_TIMEOUT_MS,
      )
    })

    return () => {
      cancelAnimationFrame(frame)
      disconnectObserver()
    }
  }, [pathname, currentHash])

  return null
}
