import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

export const queryAreaServedBySlug = cache(async ({ slugPath }: { slugPath: string[] }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const breadcrumbUrl = '/' + slugPath.join('/')
  const lastSlug = slugPath[slugPath.length - 1]!
  const result = await payload.find({
    collection: 'areas-served',
    draft,
    depth: 2,
    limit: 5,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        { slug: { equals: lastSlug } },
        { 'breadcrumbs.url': { equals: breadcrumbUrl } },
      ],
    },
  })
  // Safety net: confirm the last breadcrumb is the full path, not an intermediate one.
  return (
    result.docs.find((doc) => {
      const breadcrumbs = doc.breadcrumbs
      if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) return false
      return breadcrumbs[breadcrumbs.length - 1]?.url === breadcrumbUrl
    }) ?? null
  )
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
