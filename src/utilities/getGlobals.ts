import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0, populate?: Record<string, Record<string, boolean>>) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    ...(populate && { populate }),
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0, populate?: Record<string, Record<string, boolean>>) =>
  unstable_cache(async () => getGlobal(slug, depth, populate), [slug], {
    tags: [`global_${slug}`],
  })
