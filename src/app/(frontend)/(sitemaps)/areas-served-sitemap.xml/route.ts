import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getAreasServedSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'areas-served',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        breadcrumbs: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((doc) => Boolean(doc?.slug))
          .map((doc) => {
            const breadcrumbs = doc.breadcrumbs
            const url =
              Array.isArray(breadcrumbs) && breadcrumbs.length > 0
                ? breadcrumbs[breadcrumbs.length - 1]?.url
                : null
            const path = url ?? `/${doc.slug}`
            return {
              loc: `${SITE_URL}${path}`,
              lastmod: doc.updatedAt || dateFallback,
            }
          })
      : []

    return sitemap
  },
  ['areas-served-sitemap'],
  {
    tags: ['areas-served-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getAreasServedSitemap()

  return getServerSideSitemap(sitemap)
}
