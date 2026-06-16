"use client"
import * as React from "react"

export type Theme = "dark" | "light" | "system"

type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

const themes = ["dark", "light", "system"] as const

function isTheme(value: string | null): value is Theme {
  return themes.some((theme) => theme === value)
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme
}

function getStoredTheme(storageKey: string, fallback: Theme) {
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const storedTheme = window.localStorage.getItem(storageKey)
    return isTheme(storedTheme) ? storedTheme : fallback
  } catch {
    return fallback
  }
}

function persistTheme(storageKey: string, theme: Theme) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(storageKey, theme)
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

function disableTransitionsTemporarily() {
  if (typeof document === "undefined") {
    return () => {}
  }

  document.documentElement.classList.add("theme-flipping")

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("theme-flipping")
      })
    })
  }
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const editableParent = target.closest(
    "input, textarea, select, [contenteditable='true']"
  )
  if (editableParent) {
    return true
  }

  return false
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "agentic-craft-theme",
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  // Initial state must match the server render, which can't know the stored
  // or system theme — start from the default and sync in effects. The inline
  // script in app/layout.tsx applies the stored theme before first paint.
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>("light")
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    defaultTheme === "system" ? "light" : defaultTheme
  )

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      persistTheme(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      const resolved = resolveTheme(nextTheme)

      if (typeof document === "undefined") {
        return resolved
      }

      const root = document.documentElement
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      root.classList.remove("light", "dark")
      root.classList.add(resolved)
      root.dataset.theme = nextTheme
      root.dataset.resolvedTheme = resolved
      root.style.colorScheme = resolved

      if (restoreTransitions) {
        restoreTransitions()
      }

      return resolved
    },
    [disableTransitionOnChange]
  )

  React.useEffect(() => {
    setThemeState(getStoredTheme(storageKey, defaultTheme))
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    setResolvedTheme(applyTheme(theme))
  }, [theme, applyTheme])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      const nextSystemTheme = getSystemTheme()
      setSystemTheme(nextSystemTheme)

      if (theme === "system") {
        setResolvedTheme(applyTheme("system"))
      }
    }

    handleSystemThemeChange()
    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [applyTheme, theme])

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return
      }

      const nextTheme = isTheme(event.newValue) ? event.newValue : defaultTheme
      setThemeState(nextTheme)
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (isEditableTarget(event.target)) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [resolvedTheme, setTheme])

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      setTheme,
    }),
    [theme, resolvedTheme, systemTheme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.use(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
