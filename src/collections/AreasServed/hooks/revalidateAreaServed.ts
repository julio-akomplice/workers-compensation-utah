import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { AreasServed as AreasServedType } from '../../../payload-types'

export const revalidateAreaServed: CollectionAfterChangeHook<AreasServedType> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/areas-served/${doc.slug}`

      payload.logger.info(`Revalidating area served at path: ${path}`)

      revalidatePath(path)
      revalidateTag('areas-served-sitemap')
    }

    // If the area was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/areas-served/${previousDoc.slug}`

      payload.logger.info(`Revalidating old area served at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('areas-served-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<AreasServedType> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/areas-served/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('areas-served-sitemap')
  }

  return doc
}
