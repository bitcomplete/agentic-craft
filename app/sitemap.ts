import type { MetadataRoute } from "next"
import { sections } from "@/content/navigation"
import { templateDetails } from "@/content/templates"
import { useCaseVariants } from "@/views/use-cases/data"

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

  const useCaseEntries: MetadataRoute.Sitemap = useCaseVariants.map(
    (variant) => ({
      url: `${BASE}/use-cases/${variant.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  )

  return [...sectionEntries, ...useCaseEntries, ...templateEntries]
}
