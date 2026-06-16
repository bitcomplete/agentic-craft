import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { UseCaseDetailContent } from "@/views/use-cases/use-case-detail-content"
import { getUseCaseVariant, useCaseVariants } from "@/views/use-cases/data"

type UseCasePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return useCaseVariants.map((variant) => ({
    slug: variant.slug,
  }))
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params
  const variant = getUseCaseVariant(slug)

  if (!variant) {
    return {
      title: "Use Case",
    }
  }

  return {
    title: variant.title,
    description: variant.summary,
  }
}

export default async function UseCaseDetailPage({ params }: UseCasePageProps) {
  const { slug } = await params
  const variant = getUseCaseVariant(slug)

  if (!variant) {
    notFound()
  }

  return <UseCaseDetailContent slug={slug} />
}
