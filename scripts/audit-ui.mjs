import { readFileSync, realpathSync } from "node:fs"
import { basename, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const root = resolve(fileURLToPath(new URL("..", import.meta.url)))
const shouldFail = process.argv.includes("--fail")

// Build the set of basenames in src/components/ui/ for real-file-copy dedup.
let srcUiBasenames
try {
  srcUiBasenames = new Set(
    execFileSync("git", ["ls-files", "src/components/ui"], {
      cwd: root,
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean)
      .map((f) => basename(f))
  )
} catch {
  srcUiBasenames = new Set()
}

const rawFiles = execFileSync("git", [
  "ls-files",
  "app",
  "src",
  "registry",
], {
  cwd: root,
  encoding: "utf8",
})
  .split("\n")
  .filter((file) => /\.(tsx|ts|css)$/.test(file))

// Deduplicate: skip registry/base-nova/ui/ entries whose basename also exists
// in src/components/ui/ (handles both symlink and real-file-copy cases).
const seenRealPaths = new Set()
const files = rawFiles.filter((file) => {
  const abs = resolve(root, file)
  // Skip registry/base-nova/ui/ files if a counterpart exists under src/components/ui/
  if (file.startsWith("registry/base-nova/ui/") && srcUiBasenames.has(basename(file))) {
    return false
  }
  // Skip files that resolve to a real path we have already seen (symlink dedup)
  let real
  try {
    real = realpathSync(abs)
  } catch {
    real = abs
  }
  if (seenRealPaths.has(real)) return false
  seenRealPaths.add(real)
  return true
})

const checks = [
  {
    id: "no-space-utilities",
    pattern: /\bspace-[xy]-\d/g,
    message: "Use flex/grid with gap utilities instead of space-x/space-y.",
  },
  {
    id: "no-transition-all",
    pattern: /\btransition-all\b/g,
    message: "Use property-specific transitions.",
  },
  {
    id: "no-clickable-div",
    pattern: /<div[^>]+onClick=/g,
    message: "Use a button or link for clickable controls.",
  },
  {
    id: "no-page-style-injection",
    pattern: /document\.createElement\("style"\)/g,
    message: "Move reusable motion styles into CSS or registry item css.",
  },
  {
    id: "prefer-semantic-status",
    pattern: /\b(text|bg|border)-(emerald|green|red|rose|amber|yellow)-\d/g,
    message: "Prefer Badge variants or semantic tokens for status color.",
  },
]

const findings = []

for (const file of files) {
  const abs = resolve(root, file)
  const source = readFileSync(abs, "utf8")

  for (const check of checks) {
    for (const match of source.matchAll(check.pattern)) {
      const line = source.slice(0, match.index).split("\n").length
      findings.push({
        file: relative(root, abs),
        line,
        id: check.id,
        message: check.message,
      })
    }
  }

  for (const match of source.matchAll(/<button\b[^>]*>/g)) {
    const openTag = match[0]
    // Inspection window: the opening tag + 300 chars of following source
    const windowStart = match.index + openTag.length
    const window = openTag + source.slice(windowStart, windowStart + 300)
    // After the closing '>' of the opening tag, strip whitespace and check
    // whether the content starts with a text character or a JSX expression.
    const afterTag = source.slice(windowStart).trimStart()
    const hasVisibleLabel =
      // Explicit aria-label on the button itself
      /aria-label=/.test(openTag) ||
      // sr-only span anywhere in the window
      /<span[^>]+className="sr-only"/.test(window) ||
      // visible text span (a <span> without sr-only class) anywhere in the window
      /<span(?![^>]*className="sr-only")[^>]*>[^<]/.test(window) ||
      // content starts directly with text (after whitespace) — same-line label
      /^[^<\s{]/.test(afterTag) ||
      // content starts with a JSX expression — e.g. {label}
      /^\{/.test(afterTag)
    if (!hasVisibleLabel) {
      const line = source.slice(0, match.index).split("\n").length
      findings.push({
        file,
        line,
        id: "icon-button-label",
        message: "Icon-only buttons need an aria-label or sr-only label.",
      })
    }
  }
}

if (findings.length === 0) {
  console.log("UI audit passed.")
} else {
  for (const finding of findings) {
    console.log(
      `${finding.file}:${finding.line} ${finding.id} ${finding.message}`
    )
  }
  if (shouldFail) {
    process.exitCode = 1
  }
}
