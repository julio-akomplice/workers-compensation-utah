import type { CollectionBeforeChangeHook, CollectionSlug, Where } from 'payload'
import { ValidationError } from 'payload'

type Args = {
  collection: CollectionSlug
}

export const validateUniqueSlugPerParent = ({ collection }: Args): CollectionBeforeChangeHook =>
  async ({ data, req, operation, originalDoc }) => {
    const { payload } = req
    const slug = data?.slug
    const parent = data?.parent ?? null

    if (!slug) return data

    const conditions: Where[] = [
      { slug: { equals: slug } },
      parent ? { parent: { equals: parent } } : { parent: { exists: false } },
    ]

    if (operation === 'update' && originalDoc?.id) {
      conditions.push({ id: { not_equals: originalDoc.id } })
    }

    const existing = await payload.find({
      collection,
      where: { and: conditions },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      pagination: false,
    })

    if (existing.totalDocs > 0) {
      throw new ValidationError({
        errors: [
          {
            path: 'slug',
            message: `A page with the slug "${slug}" already exists at the same level. Please use a different slug.`,
          },
        ],
      })
    }

    return data
  }
