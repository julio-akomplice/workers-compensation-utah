import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

export const queryPracticeAreaBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'practice-areas',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})

export async function getPracticeAreaStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const practiceAreas = await payload.find({
    collection: 'practice-areas',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    depth: 1,
    select: { slug: true, breadcrumbs: true },
  })
  return practiceAreas.docs.map(({ breadcrumbs, slug }) => {
    const urlSegments =
      breadcrumbs && breadcrumbs.length > 0
        ? breadcrumbs[breadcrumbs.length - 1]?.url?.split('/').filter(Boolean)
        : [slug]
    return { slug: urlSegments }
  })
}
