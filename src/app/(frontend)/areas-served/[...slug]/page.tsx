import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import RichText from '@/components/RichText'
import { ContentWithSidebar } from '@/components/ContentWithSidebar'
import { RelatedPages } from '@/components/RelatedPages'
import { getShortSideForm } from '@/utilities/getShortSideForm'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const areasServed = await payload.find({
    collection: 'areas-served',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    depth: 1,
    select: {
      slug: true,
      breadcrumbs: true,
    },
  })

  return areasServed.docs.map(({ breadcrumbs, slug }) => {
    const urlSegments =
      breadcrumbs && breadcrumbs.length > 0
        ? breadcrumbs[breadcrumbs.length - 1]?.url?.split('/').filter(Boolean)
        : [slug]
    return { slug: urlSegments }
  })
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function AreaServedPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = [] } = await paramsPromise
  const url = '/areas-served/' + slug.map(decodeURIComponent).join('/')

  const areaServed = await queryAreaServedBySlug({ slugPath: slug.map(decodeURIComponent) })

  if (!areaServed) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, contentSection, relatedPages } = areaServed
  const { form, header } = await getShortSideForm()

  const relatedPageLinks = (relatedPages || [])
    .map((page) => (typeof page === 'object' ? page : null))
    .filter((page): page is NonNullable<typeof page> => page !== null)
    .map((page) => {
      const breadcrumbs = page.breadcrumbs
      const breadcrumbUrl =
        Array.isArray(breadcrumbs) && breadcrumbs.length > 0
          ? breadcrumbs[breadcrumbs.length - 1]?.url
          : null
      return {
        title: page.title,
        href: breadcrumbUrl ? `/areas-served${breadcrumbUrl}` : `/areas-served/${page.slug}`,
      }
    })

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      {contentSection?.content && (
        <section className="w-full bg-white">
          <div className="container mx-auto px-5 md:px-8 2xl:px-0">
            <div className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pt-16">
              <ContentWithSidebar
                form={form}
                header={header}
                sidebarExtra={<RelatedPages pages={relatedPageLinks} />}
              >
                <div>
                  <RichText
                    className="richtext"
                    data={contentSection.content}
                    enableGutter={false}
                    enableProse={false}
                  />
                </div>
              </ContentWithSidebar>
            </div>
          </div>
        </section>
      )}
      <RenderBlocks blocks={layout as Page['layout'][0][]} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = [] } = await paramsPromise
  const areaServed = await queryAreaServedBySlug({ slugPath: slug.map(decodeURIComponent) })

  return generateMeta({ doc: areaServed })
}

const queryAreaServedBySlug = cache(async ({ slugPath }: { slugPath: string[] }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  // Use the full breadcrumb URL to distinguish nested docs that share the same
  // flat slug (e.g. /provo/provo-child vs /provo-child).
  const breadcrumbUrl = '/' + slugPath.join('/')

  const result = await payload.find({
    collection: 'areas-served',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      'breadcrumbs.url': {
        equals: breadcrumbUrl,
      },
    },
  })

  return result.docs?.[0] || null
})
