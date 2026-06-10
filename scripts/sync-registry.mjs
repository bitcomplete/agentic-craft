import { readFileSync, copyFileSync, unlinkSync, readdirSync, lstatSync } from "node:fs"
import { resolve, basename } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(fileURLToPath(new URL("..", import.meta.url)))
const checkMode = process.argv.includes("--check")

// Collect ui paths from registry.json
const registryJson = JSON.parse(readFileSync(resolve(root, "registry.json"), "utf8"))
const uiDir = resolve(root, "registry/base-nova/ui")
const srcDir = resolve(root, "src/components/ui")

const pathsFromRegistry = new Set()
for (const item of registryJson.items) {
  if (!Array.isArray(item.files)) continue
  for (const file of item.files) {
    if (typeof file.path === "string" && file.path.startsWith("registry/base-nova/ui/")) {
      pathsFromRegistry.add(basename(file.path))
    }
  }
}

// Also include any file already present in registry/base-nova/ui not listed in registry.json
const presentInDir = readdirSync(uiDir)
for (const name of presentInDir) {
  pathsFromRegistry.add(name)
}

const names = Array.from(pathsFromRegistry).sort()

let hasMismatch = false

for (const name of names) {
  const src = resolve(srcDir, name)
  const dest = resolve(uiDir, name)

  // Verify source exists
  try {
    lstatSync(src)
  } catch {
    console.error(`Missing source: src/components/ui/${name}`)
    process.exit(1)
  }

  const srcContent = readFileSync(src, "utf8")

  if (checkMode) {
    // In check mode: destination that is a symlink counts as a mismatch
    let destStat
    try {
      destStat = lstatSync(dest)
    } catch {
      console.log(`MISSING dest: registry/base-nova/ui/${name}`)
      hasMismatch = true
      continue
    }

    if (destStat.isSymbolicLink()) {
      console.log(`SYMLINK (mismatch): registry/base-nova/ui/${name}`)
      hasMismatch = true
      continue
    }

    const destContent = readFileSync(dest, "utf8")
    if (srcContent !== destContent) {
      console.log(`CONTENT MISMATCH: registry/base-nova/ui/${name}`)
      hasMismatch = true
    }
  } else {
    // Default mode: unlink symlink first if needed, then copy
    let destStat
    try {
      destStat = lstatSync(dest)
    } catch {
      destStat = null
    }

    if (destStat && destStat.isSymbolicLink()) {
      unlinkSync(dest)
    }

    copyFileSync(src, dest)
    console.log(`Synced: registry/base-nova/ui/${name}`)
  }
}

if (checkMode) {
  if (hasMismatch) {
    process.exit(1)
  } else {
    console.log("Registry sources in sync.")
    process.exit(0)
  }
}
