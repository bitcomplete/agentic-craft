import type { MetadataRoute } from "next"
import { sections } from "@/content/navigation"
import { templateDetails } from "@/content/templates"

const BASE = "https://agentic-craft.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const sectionEntries: MetadataRoute.Sitemap = sections.map((section) => ({
    url: `${BASE}${section.path}`,
    changeFrequency: "weekly",
    priority: section.path === "/" ? 1 : 0.8,
  }))

  const templateEntries: MetadataRoute.Sitemap = templateDetails.map(
    (template) => ({
      url: `${BASE}/templates/${template.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  )

  return [...sectionEntries, ...templateEntries]
}
