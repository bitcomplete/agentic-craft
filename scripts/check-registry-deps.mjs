import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(fileURLToPath(new URL("..", import.meta.url)))

const registry = JSON.parse(
  readFileSync(resolve(root, "registry.json"), "utf8")
)

const itemNames = new Set(registry.items.map((item) => item.name))

const prefix = "bitcomplete/agentic-craft/"
const missing = []

for (const item of registry.items) {
  if (!Array.isArray(item.registryDependencies)) continue
  for (const dep of item.registryDependencies) {
    if (!dep.startsWith(prefix)) continue
    const segment = dep.slice(prefix.length)
    if (!itemNames.has(segment)) {
      missing.push({ item: item.name, dep, segment })
    }
  }
}

if (missing.length > 0) {
  for (const { item, dep } of missing) {
    console.error(`${item}: unresolved registryDependency "${dep}"`)
  }
  process.exit(1)
} else {
  console.log("Registry dependencies resolve.")
}
