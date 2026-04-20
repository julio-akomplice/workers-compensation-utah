import { PayloadRequest, CollectionSlug } from 'payload'
import { postsSlug } from './constants'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: `/${postsSlug}`,
  pages: '',
  'practice-areas': '',
  'areas-served': '',
  faq: '/faq',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  /** Full path override for nested docs (e.g. '/provo/provo-child'). When provided,
   *  it is appended to the collection prefix instead of the flat slug. */
  breadcrumbUrl?: string
}

export const generatePreviewPath = ({ collection, slug, breadcrumbUrl }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const path = breadcrumbUrl
    ? `${collectionPrefixMap[collection]}${breadcrumbUrl}`
    : `${collectionPrefixMap[collection]}/${encodedSlug}`

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
