import type { Metadata } from 'next'

import type { Faq, Media, Page, Post, PracticeArea, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { SITE_NAME, SITE_DESCRIPTION } from '@/constants/site'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/wcu_logo.png'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

/** Falls back to "{page title} | {site}" so pages without an SEO title don't all share one. */
const getTitle = (doc: Partial<Page> | Partial<Post> | Partial<PracticeArea> | Partial<Faq> | null) => {
  if (doc?.meta?.title) return doc.meta.title

  const pageTitle = doc && ('title' in doc ? doc.title : 'question' in doc ? doc.question : null)
  if (!pageTitle || doc?.slug === 'home') return SITE_NAME

  return `${pageTitle} | ${SITE_NAME}`
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<PracticeArea> | Partial<Faq> | null
  /** The page's path, e.g. `/blogs/my-post`; used for the canonical and og:url. */
  url?: string
}): Promise<Metadata> => {
  const { doc, url } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = getTitle(doc)

  return {
    ...(url && { alternates: { canonical: url } }),
    description: doc?.meta?.description || SITE_DESCRIPTION,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || SITE_DESCRIPTION,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: url ?? '/',
    }),
    title,
  }
}
