import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

export const queryAreaServedBySlug = cache(async ({ slugPath }: { slugPath: string[] }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const breadcrumbUrl = '/' + slugPath.join('/')
  const result = await payload.find({
    collection: 'areas-served',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { 'breadcrumbs.url': { equals: breadcrumbUrl } },
  })
  return result.docs?.[0] || null
})

export async function getAreaServedStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const areasServed = await payload.find({
    collection: 'areas-served',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    depth: 1,
    select: { slug: true, breadcrumbs: true },
  })
  return areasServed.docs.map(({ breadcrumbs, slug }) => {
    const urlSegments =
      breadcrumbs && breadcrumbs.length > 0
        ? breadcrumbs[breadcrumbs.length - 1]?.url?.split('/').filter(Boolean)
        : [slug]
    return { slug: urlSegments }
  })
}
