import { readFileSync } from "node:fs"
import { relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const root = resolve(fileURLToPath(new URL("..", import.meta.url)))
const shouldFail = process.argv.includes("--fail")
const files = execFileSync("git", [
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
  const lines = source.split("\n")

  for (const check of checks) {
    for (const match of source.matchAll(check.pattern)) {
      const line =
        source.slice(0, match.index).split("\n").length
      findings.push({
        file: relative(root, abs),
        line,
        id: check.id,
        message: check.message,
      })
    }
  }

  for (const match of source.matchAll(/<button\b[\s\S]*?<\/button>/g)) {
    const block = match[0]
    if (
      !/aria-label=/.test(block) &&
      !/<span[^>]+className="sr-only"/.test(block) &&
      !/<button[^>]*>[^<\s]/.test(block)
    ) {
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
