import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { AreasServed as AreasServedType } from '../../../payload-types'

const getPath = (doc: Partial<AreasServedType>): string => {
  const breadcrumbs = doc.breadcrumbs
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    const url = breadcrumbs[breadcrumbs.length - 1]?.url
    if (url) return url
  }
  return `/${doc.slug}`
}

export const revalidateAreaServed: CollectionAfterChangeHook<AreasServedType> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = getPath(doc)

      payload.logger.info(`Revalidating area served at path: ${path}`)

      revalidatePath(path)
      revalidateTag('areas-served-sitemap')
    }

    // If the area was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = getPath(previousDoc)

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
    const path = getPath(doc)
    revalidatePath(path)
    revalidateTag('areas-served-sitemap')
  }

  return doc
}
