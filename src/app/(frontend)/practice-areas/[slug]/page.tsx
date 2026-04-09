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
  const practiceAreas = await payload.find({
    collection: 'practice-areas',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return practiceAreas.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function PracticeAreaPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/practice-areas/' + decodedSlug

  const practiceArea = await queryPracticeAreaBySlug({ slug: decodedSlug })

  if (!practiceArea) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, contentSection, relatedPages } = practiceArea
  const { form, header } = await getShortSideForm()

  const relatedPageLinks = (relatedPages || [])
    .map((page) => (typeof page === 'object' ? page : null))
    .filter((page): page is NonNullable<typeof page> => page !== null)
    .map((page) => ({
      title: page.title,
      href: `/practice-areas/${page.slug}`,
    }))

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
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const practiceArea = await queryPracticeAreaBySlug({ slug: decodedSlug })

  return generateMeta({ doc: practiceArea })
}

const queryPracticeAreaBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'practice-areas',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
