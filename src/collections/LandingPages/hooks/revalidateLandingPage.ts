import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { LandingPage } from '../../../payload-types'

export const revalidateLandingPage: CollectionAfterChangeHook<LandingPage> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${doc.slug}`

      payload.logger.info(`Revalidating landing page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('landing-pages-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old landing page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('landing-pages-sitemap')
    }
  }
  return doc
}

export const revalidateLandingPageDelete: CollectionAfterDeleteHook<LandingPage> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/${doc?.slug}`)
    revalidateTag('landing-pages-sitemap')
  }

  return doc
}
