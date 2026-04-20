import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

async function revalidateAdjacentPosts(
  payload: Parameters<CollectionAfterChangeHook<Post>>[0]['req']['payload'],
  publishedAt: string | null | undefined,
  id: string,
) {
  const [prevResult, nextResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 1,
      pagination: false,
      sort: '-publishedAt',
      select: { slug: true },
      where: {
        id: { not_equals: id },
        ...(publishedAt ? { publishedAt: { less_than: publishedAt } } : {}),
      },
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 1,
      pagination: false,
      sort: 'publishedAt',
      select: { slug: true },
      where: {
        id: { not_equals: id },
        ...(publishedAt ? { publishedAt: { greater_than: publishedAt } } : {}),
      },
    }),
  ])

  const prev = prevResult.docs?.[0]
  const next = nextResult.docs?.[0]

  if (prev?.slug) revalidatePath(`/blogs/${prev.slug}`)
  if (next?.slug) revalidatePath(`/blogs/${next.slug}`)
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/blogs/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')

      void revalidateAdjacentPosts(payload, doc.publishedAt, String(doc.id))
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/blogs/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')

      void revalidateAdjacentPosts(payload, previousDoc.publishedAt, String(previousDoc.id))
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    const path = `/blogs/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap')

    void revalidateAdjacentPosts(payload, doc?.publishedAt, String(doc?.id))
  }

  return doc
}
